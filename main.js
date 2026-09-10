/* =====================================================================
   BOISCLAIR SERVICES — main.js
   Aucune dépendance externe. Vanilla JS.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when a link is clicked (mobile)
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Contact form ---------- */
  // This form is wired for Formspree (https://formspree.io) — a free
  // service that emails form submissions without needing a backend.
  // See README.md ("Activer le formulaire de contact") for setup steps.
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      var action = form.getAttribute("action") || "";
      var placeholder = action.indexOf("YOUR_FORM_ID") !== -1 || action === "";

      if (placeholder) {
        // No real endpoint configured yet — demo mode.
        e.preventDefault();
        var successEl = document.querySelector("#form-success");
        if (successEl) {
          successEl.classList.add("show");
          successEl.setAttribute("role", "status");
        }
        form.reset();
        console.warn(
          "[Boisclair] Le formulaire de contact n'est pas encore connecté. " +
          "Voir README.md pour brancher Formspree ou un autre service."
        );
      }
      // If a real Formspree action is set, let the form submit normally.
    });
  }

  /* ---------- Newsletter form (same demo pattern) ---------- */
  var newsletterForm = document.querySelector("#newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      var action = newsletterForm.getAttribute("action") || "";
      if (action.indexOf("YOUR_FORM_ID") !== -1 || action === "") {
        e.preventDefault();
        var msg = newsletterForm.querySelector(".newsletter-msg");
        if (msg) {
          msg.textContent =
            newsletterForm.getAttribute("data-thanks") || "Merci!";
          msg.classList.add("show");
        }
        newsletterForm.reset();
      }
    });
  }

  /* ---------- Only one FAQ item open at a time (nice-to-have) ---------- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqItems.forEach(function (other) {
          if (other !== item) other.removeAttribute("open");
        });
      }
    });
  });
})();
