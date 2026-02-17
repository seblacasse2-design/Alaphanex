// functions/index.js
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const Stripe = require('stripe');

admin.initializeApp();
const db = admin.firestore();

const STRIPE_SECRET = defineSecret('STRIPE_SECRET_KEY');
const WH_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET'); // tu le configureras plus tard

const round2 = n => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Crée une session Stripe Checkout à partir du panier.
 * - Vérifie prix/stock en lisant Firestore (anti-fraude)
 * - Crée une commande 'pending' dans /orders
 * - Retourne l'URL Stripe (redirection)
 */
exports.createCheckoutSession = onRequest(
  { secrets: [STRIPE_SECRET], region: 'northamerica-northeast1' },
  async (req, res) => {
    cors(req, res, async () => {
      try {
        if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

        const stripe = new Stripe(STRIPE_SECRET.value());
        const { cart, user } = req.body || {};
        if (!Array.isArray(cart) || !user?.uid || !user?.email) {
          return res.status(400).json({ error: 'Payload invalide' });
        }

        // Recharge et valide les items
        const items = [];
        for (const i of cart) {
          if (!i?.id || !i?.quantity) continue;
          const snap = await db.collection('products').doc(i.id).get();
          if (!snap.exists) continue;
          const p = snap.data();
          const qty = Math.max(1, parseInt(i.quantity, 10));
          // Vérifie stock si défini
          if (typeof p.stock === 'number' && p.stock < qty) {
            return res.status(400).json({ error: `Stock insuffisant: ${p.name}` });
          }
          const unit = Math.round(parseFloat(p.price) * 100); // en cents
          items.push({
            id: i.id,
            name: p.name,
            unit_amount: unit,
            quantity: qty,
            image: p.image || undefined,
          });
        }
        if (items.length === 0) return res.status(400).json({ error: 'Panier vide' });

        const subtotal = round2(items.reduce((s, it) => s + (it.unit_amount / 100) * it.quantity, 0));
        // Crée une commande "pending"
        const orderRef = await db.collection('orders').add({
          userUID: user.uid,
          userEmail: user.email,
          userName: user.name || user.email,
          date: new Date().toLocaleDateString('fr-CA'),
          items: items.map(it => ({ productId: it.id, name: it.name, qty: it.quantity, price: it.unit_amount / 100 })),
          subtotal,
          tps: 0, tvq: 0, taxes: 0, total: 0,
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Construit les lignes Stripe
        const line_items = items.map(it => ({
          quantity: it.quantity,
          price_data: {
            currency: 'cad',
            unit_amount: it.unit_amount,
            product_data: {
              name: it.name,
              images: it.image ? [it.image] : []
            }
          }
          // Astuce: tu pourras ajouter tax_rates ici si tu crées TPS/TVQ dans Stripe
        }));

        // Détecte l'origine pour success/cancel
        const origin = (req.get('origin') || req.get('referer') || '').replace(/\/$/, '') || 'http://localhost:5000';

        const session = await stripe.checkout.sessions.create({
          mode: 'payment',
          payment_method_types: ['card'],
          customer_email: user.email,
          line_items,
          success_url: `${origin}/?payment=success&order=${orderRef.id}`,
          cancel_url: `${origin}/?payment=cancel`,
          metadata: {
            firebaseOrderId: orderRef.id,
            userUID: user.uid
          }
        });

        await orderRef.update({ stripeSessionId: session.id });

        return res.json({ url: session.url }); // on utilise l'URL directe (pas besoin de clé pk côté client)
      } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'Erreur serveur: ' + e.message });
      }
    });
  }
);

/**
 * Webhook Stripe (optionnel mais recommandé)
 * - Marque la commande "paid"
 * - Décrémente le stock
 * À activer après configuration du webhook dans Stripe Dashboard.
 */
exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET, WH_SECRET], region: 'northamerica-northeast1' },
  async (req, res) => {
    const stripe = new Stripe(STRIPE_SECRET.value());
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, WH_SECRET.value());
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata?.firebaseOrderId;
        if (!orderId) return res.status(200).end();

        const amount_total = (session.amount_total || 0) / 100;
        const amount_subtotal = (session.amount_subtotal || 0) / 100;
        const taxes = round2(amount_total - amount_subtotal);

        const orderRef = db.collection('orders').doc(orderId);
        const snap = await orderRef.get();
        if (!snap.exists) return res.status(200).end();

        const batch = db.batch();
        const order = snap.data();

        // Décrémente le stock
        for (const it of order.items || []) {
          if (!it.productId || !it.qty) continue;
          const pRef = db.collection('products').doc(it.productId);
          batch.update(pRef, { stock: admin.firestore.FieldValue.increment(-Number(it.qty)) });
        }

        batch.update(orderRef, {
          status: 'paid',
          taxes,
          total: amount_total,
          tps: 0, tvq: 0, // si tu veux séparer TPS/TVQ, on pourra activer tax_rates et lire le breakdown
          stripePaymentIntentId: session.payment_intent,
          paidAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await batch.commit();
      }

      return res.status(200).end();
    } catch (e) {
      console.error(e);
      return res.status(500).send('Webhook handling error');
    }
  }
);
