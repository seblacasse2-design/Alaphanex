# NORD TERRAIN — Site web bilingue

Site vitrine statique prêt pour GitHub Pages, inspiré des meilleures pratiques de sites de défrichage / land clearing modernes : hero fort, services, processus, réalisations, FAQ et formulaire de soumission.

## Mise en ligne sur GitHub Pages

1. Crée un nouveau repository GitHub.
2. Dépose **index.html**, **styles.css**, **script.js** et le dossier **assets** à la racine.
3. GitHub → **Settings** → **Pages**.
4. Source : **Deploy from a branch** → `main` → `/ (root)` → Save.
5. Ton site sera accessible à l’adresse GitHub Pages générée par GitHub.

## À personnaliser avant la mise en ligne

### 1. Nom / coordonnées
Dans `index.html`, remplace :
- `NORD TERRAIN`
- `514 000-0000`
- `info@nordterrain.ca`
- les secteurs desservis

### 2. Photos
Les photos actuelles sont des images Unsplash utilisées comme placeholders. Remplace-les par tes propres photos de travaux dans `index.html` pour obtenir un site beaucoup plus crédible.

### 3. Formulaire
Le formulaire est volontairement sans backend afin que le site fonctionne immédiatement sur GitHub Pages. Il utilise `mailto:`.

Pour un vrai formulaire professionnel sans ouvrir le logiciel de courriel, tu peux ensuite brancher Formspree, Web3Forms, Basin ou un autre service de formulaire. Remplace simplement l'attribut `action` du formulaire dans `index.html`.

### 4. SEO local
Ajoute éventuellement :
- une adresse d'entreprise si pertinente;
- un numéro de téléphone réel;
- Google Business Profile;
- les villes réellement desservies;
- des photos avant/après;
- des témoignages réels.

## Design

- Responsive mobile / tablette / desktop
- Français / anglais avec bouton FR/EN
- Navigation mobile
- FAQ accordéon
- Formulaire de soumission
- SEO de base
- Open Graph
- Animations et interactions légères
- Aucun framework requis
- Aucun build nécessaire
