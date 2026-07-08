/**
 * build.js — Générateur de site statique (zéro dépendance).
 * Assemble le layout, les partiels (header/footer/breadcrumb), les pages et
 * les actualités, puis produit un site complet dans /public + sitemap.xml + robots.txt.
 *
 * Lancer : node build.js
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { config, nav, pages, news, elus } = require("./src/data/site.js");

const ROOT = __dirname;
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "public");
const BASE = config.baseUrl.replace(/\/$/, "");

/* ------------------------------------------------------------------ utils */
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const read = (p) => fs.readFileSync(p, "utf8");
const ensureDir = (p) => fs.mkdirSync(p, { recursive: true });

function write(rel, content) {
  const dest = path.join(OUT, rel);
  ensureDir(path.dirname(dest));
  fs.writeFileSync(dest, content);
}

const FR_DATE = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

/* --------------------------------------------------------------- partials */
function buildNav(currentNav) {
  const items = nav
    .map((item) => {
      const active = item.href === currentNav ? ' aria-current="page"' : "";
      const isActiveClass = item.href === currentNav ? " is-active" : "";
      if (item.children && item.children.length) {
        const id = "menu-" + item.label.toLowerCase().replace(/[^a-z]+/g, "-");
        const sub = item.children
          .map((c) => `<li><a href="${c.href}">${esc(c.label)}</a></li>`)
          .join("\n");
        return `
        <li class="nav-item has-sub${isActiveClass}">
          <a href="${item.href}"${active} class="nav-link" aria-haspopup="true" aria-expanded="false" data-submenu="${id}">${esc(
          item.label
        )}<svg class="caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></a>
          <ul class="submenu" id="${id}">
${sub}
          </ul>
        </li>`;
      }
      return `<li class="nav-item${isActiveClass}"><a href="${item.href}"${active} class="nav-link">${esc(item.label)}</a></li>`;
    })
    .join("\n");
  return items;
}

function header(page) {
  const n = config.nap;
  const navItems = buildNav(page.nav);
  return `
  <div class="topbar">
    <div class="container topbar-inner">
      <p class="topbar-hours"><svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> <span data-open-status>Horaires d'ouverture</span></p>
      <div class="topbar-right">
        <a class="topbar-link" href="tel:${n.phoneE164}"><svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15 15 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11 11 0 003.5.56 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11 11 0 00.56 3.5 1 1 0 01-.24 1z" fill="currentColor"/></svg> ${esc(n.phone)}</a>
        <span class="topbar-social" aria-label="Réseaux sociaux">
          <a href="${config.social.facebook}" aria-label="Facebook" rel="noopener" target="_blank"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z" fill="currentColor"/></svg></a>
          <a href="${config.social.instagram}" aria-label="Instagram" rel="noopener" target="_blank"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a>
          <a href="${config.social.youtube}" aria-label="YouTube" rel="noopener" target="_blank"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="M10 9l5 3-5 3z" fill="#fff"/></svg></a>
        </span>
      </div>
    </div>
  </div>
  <header class="site-header" id="siteHeader">
    <div class="container header-inner">
      <a class="brand" href="/" aria-label="Accueil — Mairie de Montastruc-la-Conseillère">
        <img src="/assets/img/logo-montastruc.jpg" width="196" height="60" alt="Montastruc-la-Conseillère" class="brand-logo">
      </a>
      <nav class="main-nav" id="mainNav" aria-label="Navigation principale">
        <ul class="nav-list">
${navItems}
        </ul>
        <a class="btn btn-accent nav-cta" href="/demarches">Mes démarches</a>
      </nav>
      <button class="nav-toggle" id="navToggle" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mainNav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

function breadcrumb(page) {
  if (!page.breadcrumbs || !page.breadcrumbs.length) return "";
  const crumbs = [{ label: "Accueil", url: "/" }, ...page.breadcrumbs];
  const items = crumbs
    .map((c, i) => {
      const last = i === crumbs.length - 1;
      if (last) return `<li aria-current="page"><span>${esc(c.label)}</span></li>`;
      return `<li><a href="${c.url}">${esc(c.label)}</a></li>`;
    })
    .join('<li class="sep" aria-hidden="true">/</li>');
  return `
  <nav class="breadcrumb" aria-label="Fil d'Ariane">
    <div class="container"><ol>${items}</ol></div>
  </nav>`;
}

function footer() {
  const n = config.nap;
  const cols = nav
    .filter((i) => i.href !== "/")
    .slice(0, 4)
    .map((i) => {
      const links = (i.children || [{ label: i.label, href: i.href }])
        .map((c) => `<li><a href="${c.href}">${esc(c.label)}</a></li>`)
        .join("");
      return `<div class="foot-col"><h3>${esc(i.label)}</h3><ul>${links}</ul></div>`;
    })
    .join("\n");
  return `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="foot-brand">
        <div class="foot-brand-head">
          <span class="foot-logo-chip"><img src="/assets/img/logo-montastruc.jpg" width="150" height="46" alt="Montastruc-la-Conseillère"></span>
        </div>
        <address>
          ${esc(n.street)}, ${esc(n.postBox)}<br>${esc(n.postalCode)} ${esc(n.city)}<br>
          <a href="tel:${n.phoneE164}">${esc(n.phone)}</a><br>
          <a href="mailto:${n.email}">${esc(n.email)}</a>
        </address>
        <div class="foot-social">
          <a href="${config.social.facebook}" aria-label="Facebook" rel="noopener" target="_blank"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v6h3v-6h3l1-3h-4v-2a1 1 0 011-1z" fill="currentColor"/></svg></a>
          <a href="${config.social.instagram}" aria-label="Instagram" rel="noopener" target="_blank"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg></a>
          <a href="${config.social.youtube}" aria-label="YouTube" rel="noopener" target="_blank"><svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" fill="currentColor"/><path d="M10 9l5 3-5 3z" fill="#fff"/></svg></a>
        </div>
      </div>
${cols}
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <p>© ${new Date().getFullYear()} Mairie de Montastruc-la-Conseillère. Tous droits réservés.</p>
        <ul class="legal-links">
          <li><a href="/mentions-legales">Mentions légales</a></li>
          <li><a href="/politique-confidentialite">Confidentialité &amp; cookies</a></li>
          <li><a href="/accessibilite">Accessibilité</a></li>
          <li><a href="/plan-du-site">Plan du site</a></li>
          <li><button type="button" class="linkish" data-cookie-open>Gérer les cookies</button></li>
        </ul>
      </div>
    </div>
  </footer>`;
}

function cookieBanner() {
  return `
  <div class="cookie-banner" id="cookieBanner" role="dialog" aria-live="polite" aria-label="Gestion des cookies" hidden>
    <div class="cookie-inner">
      <div class="cookie-text">
        <strong>Respect de votre vie privée</strong>
        <p>Ce site utilise uniquement des cookies de mesure d'audience anonymisée pour améliorer votre navigation. Aucun traçage publicitaire. <a href="/politique-confidentialite">En savoir plus</a>.</p>
      </div>
      <div class="cookie-actions">
        <button type="button" class="btn btn-ghost" data-cookie="refuse">Refuser</button>
        <button type="button" class="btn btn-accent" data-cookie="accept">Accepter</button>
      </div>
    </div>
  </div>`;
}

/* ----------------------------------------------------------------- schema */
function localGovSchema() {
  const n = config.nap;
  const openingHours = [];
  config.hours
    .filter((h) => h.o.length)
    .forEach((h) => {
      h.o.forEach((slot) => {
        const [opens, closes] = slot.split("-");
        openingHours.push({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: `https://schema.org/${h.d}`,
          opens,
          closes,
        });
      });
    });
  return {
    "@type": "GovernmentOffice",
    "@id": BASE + "/#mairie",
    name: n.name,
    alternateName: "Hôtel de ville de Montastruc-la-Conseillère",
    url: BASE + "/",
    telephone: n.phoneE164,
    email: n.email,
    image: BASE + "/assets/img/mairie-facade.jpg",
    areaServed: { "@type": "City", name: n.city },
    address: {
      "@type": "PostalAddress",
      streetAddress: n.street,
      postalCode: n.postalCode,
      addressLocality: n.city,
      addressRegion: n.region,
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: n.lat, longitude: n.lng },
    openingHoursSpecification: openingHours,
  };
}

function schemaFor(page, extra) {
  const graph = [];
  const website = {
    "@type": "WebSite",
    "@id": BASE + "/#website",
    url: BASE + "/",
    name: config.siteName,
    inLanguage: "fr-FR",
    publisher: { "@id": BASE + "/#mairie" },
  };
  if (page.schema === "home") {
    graph.push(website, localGovSchema());
  } else if (page.schema === "contact") {
    graph.push(localGovSchema());
  } else if (page.schema !== "none") {
    graph.push({ "@id": BASE + "/#mairie" });
  }
  // Breadcrumb
  if (page.breadcrumbs && page.breadcrumbs.length) {
    const crumbs = [{ label: "Accueil", url: "/" }, ...page.breadcrumbs];
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.label,
        item: BASE + (c.url === "/" ? "/" : c.url),
      })),
    });
  }
  if (extra) graph.push(...extra);
  const json = { "@context": "https://schema.org", "@graph": graph };
  return `<script type="application/ld+json">${JSON.stringify(json)}</script>`;
}

/* ------------------------------------------------------------ token subst */
function hoursTable() {
  const rows = config.hours
    .map((h) => {
      const closed = h.o.length === 0;
      return `<tr class="${closed ? "is-closed" : ""}" data-day="${h.d}"><th scope="row">${h.day}</th><td>${
        closed ? "Fermé" : `${h.am} · ${h.pm}`
      }</td></tr>`;
    })
    .join("\n");
  return `<table class="hours-table"><caption class="sr-only">Horaires d'ouverture de la mairie</caption><tbody>\n${rows}\n</tbody></table>`;
}

function newsCard(a, opts = {}) {
  return `
  <article class="news-card">
    <a class="news-card-media" href="/actualites/${a.slug}">
      <img src="${a.image}" alt="" width="600" height="360" loading="lazy" decoding="async">
      <span class="badge">${esc(a.category)}</span>
    </a>
    <div class="news-card-body">
      <time datetime="${a.date}">${FR_DATE(a.date)}</time>
      <h3><a href="/actualites/${a.slug}">${esc(a.title)}</a></h3>
      <p>${esc(a.excerpt)}</p>
      <a class="read-more" href="/actualites/${a.slug}">Lire la suite<span aria-hidden="true"> →</span></a>
    </div>
  </article>`;
}

function eluCard(p) {
  const label = p.role ? `${p.name} — ${p.role}` : `${p.name}, conseiller(ère) municipal(e)`;
  return `<figure class="elu-card"><img src="${p.img}" alt="${esc(label)}" width="350" height="200" loading="lazy" decoding="async"><figcaption class="sr-only">${esc(label)}</figcaption></figure>`;
}
function elusGalleries() {
  const group = (title, sub, arr) => `
    <div class="elus-group">
      <h3 class="elus-title">${esc(title)}<span>${esc(sub)}</span></h3>
      <div class="elus-grid">${arr.map(eluCard).join("")}</div>
    </div>`;
  return (
    group("Les adjoints", `${elus.adjoints.length} adjoints au maire`, elus.adjoints) +
    group("Conseillers municipaux délégués", `${elus.delegues.length} conseillers délégués de la majorité`, elus.delegues) +
    group("Conseillers municipaux", `${elus.conseillers.length} conseillers de la majorité`, elus.conseillers)
  );
}

function tokens(html) {
  const n = config.nap;
  const map = {
    "{{PHONE}}": esc(n.phone),
    "{{PHONE_E164}}": n.phoneE164,
    "{{EMAIL}}": esc(n.email),
    "{{MAYOR}}": esc(n.mayor),
    "{{POPULATION}}": esc(n.population),
    "{{ADDRESS_LINE}}": `${esc(n.street)}, ${esc(n.postalCode)} ${esc(n.city)}`,
    "{{HOURS_TABLE}}": hoursTable(),
    "{{YEAR}}": String(new Date().getFullYear()),
    "{{NEWS_LIST}}": news.map((a) => newsCard(a)).join("\n"),
    "{{NEWS_HOME}}": news.slice(0, 3).map((a) => newsCard(a)).join("\n"),
    "{{ELUS}}": elusGalleries(),
  };
  for (const [k, v] of Object.entries(map)) html = html.split(k).join(v);
  return html;
}

/* ------------------------------------------------------------ page render */
const LAYOUT = read(path.join(SRC, "templates", "layout.html"));

// Empreinte de contenu du CSS+JS pour le cache-busting (change seulement si le contenu change)
const ASSET_V = crypto
  .createHash("md5")
  .update(read(path.join(OUT, "assets/css/styles.css")) + read(path.join(OUT, "assets/js/main.js")))
  .digest("hex")
  .slice(0, 8);

function render({ title, description, canonical, ogType, ogImage, bodyClass, header: h, breadcrumb: b, content, footer: f, cookie, schema, noindex }) {
  return LAYOUT.replace(/{{TITLE}}/g, esc(title))
    .replace(/{{DESCRIPTION}}/g, esc(description))
    .replace(/{{CANONICAL}}/g, canonical)
    .replace(/{{ROBOTS}}/g, noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">')
    .replace(/{{OG_TYPE}}/g, ogType || "website")
    .replace(/{{OG_IMAGE}}/g, ogImage || BASE + "/assets/img/mairie-facade.jpg")
    .replace(/{{BODY_CLASS}}/g, bodyClass || "")
    .replace(/{{ASSET_V}}/g, ASSET_V)
    .replace("{{HEADER}}", h)
    .replace("{{BREADCRUMB}}", b)
    .replace("{{CONTENT}}", content)
    .replace("{{FOOTER}}", f)
    .replace("{{COOKIE}}", cookie)
    .replace("{{SCHEMA}}", schema);
}

/* --------------------------------------------------------------- build!  */
function buildPages() {
  const sitemapUrls = [];
  const FOOT = footer();
  const COOKIE = cookieBanner();

  for (const page of pages) {
    const contentPath = path.join(SRC, "pages", page.content + ".html");
    let content = tokens(read(contentPath));

    // FAQ / HowTo extra schema for the démarches page
    let extra = null;
    if (page.schema === "demarches") extra = demarchesSchema();
    if (page.schema === "blog") extra = blogSchema();

    const canonical = BASE + (page.url === "/" ? "/" : page.url);
    const html = render({
      title: page.title,
      description: page.description,
      canonical,
      ogType: page.url === "/" ? "website" : "article",
      bodyClass: "page-" + page.slug,
      header: header(page),
      breadcrumb: breadcrumb(page),
      content,
      footer: FOOT,
      cookie: COOKIE,
      schema: schemaFor(page, extra),
      noindex: page.noindex,
    });
    write(page.out, html);
    if (!page.noindex) sitemapUrls.push({ loc: canonical, priority: page.url === "/" ? "1.0" : "0.8" });
  }

  // Actualités : pages individuelles
  const newsPage = pages.find((p) => p.slug === "actualites");
  for (const a of news) {
    const url = `/actualites/${a.slug}`;
    const canonical = BASE + url;
    const bc = [{ label: "Actualités", url: "/actualites" }, { label: a.title, url }];
    const pageMeta = {
      schema: "article",
      breadcrumbs: bc,
      nav: "/actualites",
    };
    const article = {
      "@type": "NewsArticle",
      headline: a.title,
      datePublished: a.date,
      dateModified: a.date,
      articleSection: a.category,
      image: BASE + a.image,
      inLanguage: "fr-FR",
      author: { "@type": "Organization", name: config.nap.name },
      publisher: { "@id": BASE + "/#mairie" },
      mainEntityOfPage: canonical,
      description: a.excerpt,
    };
    const content = `
    <article class="article container-narrow">
      <header class="article-head">
        <p class="eyebrow">${esc(a.category)}</p>
        <h1>${esc(a.title)}</h1>
        <p class="article-meta">Publié le <time datetime="${a.date}">${FR_DATE(a.date)}</time></p>
      </header>
      <img class="article-cover" src="${a.image}" alt="Illustration : ${esc(a.title)}" width="1200" height="600" fetchpriority="high">
      <div class="prose">
${a.body}
      </div>
      <p class="article-back"><a href="/actualites">← Retour aux actualités</a></p>
    </article>`;
    const html = render({
      title: `${a.title} — Actualités de Montastruc-la-Conseillère`,
      description: a.excerpt,
      canonical,
      ogType: "article",
      ogImage: BASE + a.image,
      bodyClass: "page-article",
      header: header(pageMeta),
      breadcrumb: breadcrumb(pageMeta),
      content,
      footer: FOOT,
      cookie: COOKIE,
      schema: schemaFor(pageMeta, [article]),
    });
    write(`actualites/${a.slug}.html`, html);
    sitemapUrls.push({ loc: canonical, priority: "0.6", lastmod: a.date });
  }

  buildSitemap(sitemapUrls);
  buildRobots();
  buildManifest();
  console.log(`✓ ${pages.length} pages + ${news.length} actualités générées dans /public`);
}

function demarchesSchema() {
  const faqs = [
    ["Comment faire une carte nationale d'identité à Montastruc-la-Conseillère ?", "La demande de carte d'identité se fait sur rendez-vous dans une mairie équipée d'un dispositif de recueil. Effectuez d'abord une pré-demande en ligne sur le site de l'ANTS, puis présentez-vous au rendez-vous avec les pièces justificatives."],
    ["Où obtenir un acte de naissance à Montastruc-la-Conseillère ?", "Si vous êtes né(e) à Montastruc-la-Conseillère, la demande d'acte de naissance est gratuite et se fait auprès de la mairie, sur place, par courrier ou en ligne. Sinon, adressez-vous à la mairie de votre commune de naissance."],
    ["Quels sont les horaires de la mairie pour mes démarches ?", "La mairie est ouverte du lundi au vendredi. Les horaires précis figurent sur la page Contact. Certaines démarches (passeport, CNI) se font uniquement sur rendez-vous."],
    ["Comment déposer une demande d'urbanisme (permis, déclaration préalable) ?", "Les demandes d'autorisation d'urbanisme se déposent en mairie ou via le guichet numérique. Le service urbanisme vous accompagne pour constituer votre dossier (permis de construire, déclaration préalable de travaux, certificat d'urbanisme)."],
  ];
  return [
    {
      "@type": "FAQPage",
      mainEntity: faqs.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
    {
      "@type": "HowTo",
      name: "Obtenir une carte nationale d'identité",
      description: "Les étapes pour demander une carte nationale d'identité à Montastruc-la-Conseillère.",
      step: [
        { "@type": "HowToStep", position: 1, name: "Pré-demande en ligne", text: "Créez une pré-demande sur le site de l'ANTS et notez le numéro de dossier." },
        { "@type": "HowToStep", position: 2, name: "Prendre rendez-vous", text: "Prenez rendez-vous dans une mairie équipée d'un dispositif de recueil." },
        { "@type": "HowToStep", position: 3, name: "Rassembler les pièces", text: "Munissez-vous d'une photo d'identité conforme, d'un justificatif de domicile et d'un timbre fiscal si nécessaire." },
        { "@type": "HowToStep", position: 4, name: "Retirer le titre", text: "Récupérez votre carte d'identité dans un délai moyen de 2 à 4 semaines." },
      ],
    },
  ];
}

function blogSchema() {
  return [
    {
      "@type": "Blog",
      "@id": BASE + "/actualites#blog",
      name: "Actualités de Montastruc-la-Conseillère",
      blogPost: news.map((a) => ({
        "@type": "BlogPosting",
        headline: a.title,
        datePublished: a.date,
        url: BASE + "/actualites/" + a.slug,
      })),
    },
  ];
}

/* ------------------------------------------------------------- sitemap etc */
function buildSitemap(urls) {
  const today = new Date().toISOString().slice(0, 10);
  const body = urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod || today}</lastmod><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`
    )
    .join("\n");
  write(
    "sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
  );
}

function buildRobots() {
  write(
    "robots.txt",
    `User-agent: *\nAllow: /\n\n# Assistants IA / moteurs génératifs bienvenus\nUser-agent: GPTBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`
  );
}

function buildManifest() {
  write(
    "site.webmanifest",
    JSON.stringify(
      {
        name: config.siteName,
        short_name: "Montastruc",
        description: config.description,
        start_url: "/",
        display: "standalone",
        background_color: "#f5f7f8",
        theme_color: "#0d3b54",
        lang: "fr-FR",
        icons: [{ src: "/assets/img/favicon.png", sizes: "30x32", type: "image/png" }],
      },
      null,
      2
    )
  );
}

ensureDir(OUT);
buildPages();
