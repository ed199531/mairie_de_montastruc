/* Mairie de Montastruc — interactions (vanilla JS, sans dépendance) */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------- menu mobile */
  var toggle = $("#navToggle");
  var nav = $("#mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    // fermer au clic sur un lien de navigation réel
    // (on NE ferme PAS quand on clique un parent à sous-menu : il ne fait que dérouler)
    $$(".main-nav a", nav).forEach(function (a) {
      a.addEventListener("click", function () {
        var isMobile = window.matchMedia("(max-width: 1000px)").matches;
        var isParent = a.classList.contains("nav-link") && a.parentNode.classList.contains("has-sub");
        if (isMobile && isParent) return; // laisse le sous-menu se dérouler
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Ouvrir le menu");
          document.body.style.overflow = "";
        }
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) toggle.click();
    });
  }

  /* -------------------------------------- sous-menus (mobile + clavier) */
  $$(".has-sub").forEach(function (item) {
    var link = $(".nav-link", item);
    var sub = $(".submenu", item);
    if (!link || !sub) return;
    link.addEventListener("click", function (e) {
      // en mode mobile, le 1er clic déploie le sous-menu
      if (window.matchMedia("(max-width: 1000px)").matches) {
        e.preventDefault();
        var open = sub.classList.toggle("open");
        item.classList.toggle("expanded", open);
        link.setAttribute("aria-expanded", open ? "true" : "false");
      }
    });
    // desktop : ouverture au survol gérée en CSS ; on synchronise aria
    item.addEventListener("mouseenter", function () { if (window.innerWidth > 1000) link.setAttribute("aria-expanded", "true"); });
    item.addEventListener("mouseleave", function () { if (window.innerWidth > 1000) link.setAttribute("aria-expanded", "false"); });
  });

  /* ------------------------------------------------- header sticky shadow */
  var header = $("#siteHeader");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------- horaires ouvert/fermé */
  var HOURS = {
    1: [["08:30", "12:00"], ["14:00", "18:00"]],
    2: [["08:30", "12:00"], ["14:00", "19:00"]],
    3: [["08:30", "12:30"], ["14:00", "18:00"]],
    4: [["08:30", "12:30"], ["14:00", "18:00"]],
    5: [["08:30", "12:00"], ["14:00", "17:00"]],
  };
  var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function status() {
    var now = new Date();
    var slots = HOURS[now.getDay()];
    var cur = now.getHours() * 60 + now.getMinutes();
    if (slots) {
      for (var i = 0; i < slots.length; i++) {
        if (cur >= toMin(slots[i][0]) && cur < toMin(slots[i][1])) {
          return { open: true, txt: "Ouvert · ferme à " + slots[i][1].replace(":", "h") };
        }
      }
      // prochain créneau aujourd'hui ?
      for (var j = 0; j < slots.length; j++) {
        if (cur < toMin(slots[j][0])) return { open: false, txt: "Ouvre à " + slots[j][0].replace(":", "h") };
      }
    }
    return { open: false, txt: "Fermé actuellement" };
  }
  var st = $("[data-open-status]");
  if (st) {
    var s = status();
    st.innerHTML = '<span class="' + (s.open ? "open-now" : "open-closed") + '">' + s.txt + "</span>";
  }
  // surligne le jour courant dans les tableaux d'horaires
  var todayName = dayNames[new Date().getDay()];
  $$('.hours-table tr[data-day="' + todayName + '"]').forEach(function (tr) { tr.classList.add("today"); });

  /* --------------------------------------------------------------- FAQ */
  $$(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".faq-item");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ------------------------------------------------- consentement cookies */
  var KEY = "mm_cookie_consent";
  var banner = $("#cookieBanner");
  function loadAnalytics() {
    // À activer avec l'ID Google Analytics fourni par le client (voir guide).
    // Chargé UNIQUEMENT après consentement explicite (conforme CNIL).
    if (window.__ga_loaded) return;
    window.__ga_loaded = true;
    // var GA_ID = "G-XXXXXXXXXX";
    // var s = document.createElement("script"); s.async = true;
    // s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    // document.head.appendChild(s);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){ dataLayer.push(arguments); } window.gtag = gtag;
    // gtag("js", new Date()); gtag("config", GA_ID, { anonymize_ip: true });
  }
  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    if (banner) banner.hidden = true;
    if (v === "accept") loadAnalytics();
  }
  if (banner) {
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (!saved) { banner.hidden = false; }
    else if (saved === "accept") { loadAnalytics(); }
    $$("[data-cookie]", banner).forEach(function (b) {
      b.addEventListener("click", function () { setConsent(b.getAttribute("data-cookie")); });
    });
  }
  $$("[data-cookie-open]").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); if (banner) banner.hidden = false; });
  });

  /* ------------------------------------------------- formulaire contact */
  var form = $("#contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = $("#formStatus", form.parentNode) || $("#formStatus");
      var data = new FormData(form);
      var subject = encodeURIComponent("[Site] " + (data.get("sujet") || "Message de contact"));
      var body = encodeURIComponent(
        "Nom : " + (data.get("nom") || "") + "\n" +
        "E-mail : " + (data.get("email") || "") + "\n" +
        "Téléphone : " + (data.get("telephone") || "") + "\n\n" +
        (data.get("message") || "")
      );
      window.location.href = "mailto:info@mairie-montastruc.fr?subject=" + subject + "&body=" + body;
      if (status) { status.hidden = false; status.textContent = "Votre logiciel de messagerie va s'ouvrir pour envoyer le message."; }
    });
  }

  /* ------------------------- année courante dans les mentions éventuelles */
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
