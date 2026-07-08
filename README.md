# Site officiel — Mairie de Montastruc-la-Conseillère

Site statique moderne (HTML/CSS/JS), généré par un script Node **sans aucune dépendance**.
Optimisé SEO / GEO (visibilité IA), accessibilité WCAG AA, sécurité et performance.

---

## 🚀 Démarrage rapide

```bash
node build.js      # génère le site dans /public
node serve.js      # sert le site sur http://localhost:8768
# ou, en une commande :
npm run dev
```

> Aucune installation (`npm install`) n'est nécessaire : le projet n'utilise que Node.js (v18+).

---

## 🗂️ Structure du projet

```
├── build.js                # Générateur : assemble les pages + sitemap + robots
├── serve.js                # Serveur local (port 8768, clean URLs comme Vercel)
├── vercel.json             # Déploiement : clean URLs, redirections 301, en-têtes de sécurité
├── src/
│   ├── data/site.js        # ⭐ SOURCE UNIQUE : coordonnées (NAP), navigation, pages, actualités
│   ├── templates/layout.html   # Gabarit HTML commun (<head>, header, footer…)
│   └── pages/*.html        # Contenu de chaque page
└── public/                 # Site généré (servi par Vercel) — ne pas éditer à la main
    └── assets/             # CSS, JS, images (SVG)
```

**Règle d'or :** on n'édite jamais `/public` directement. On modifie `src/…`, puis on relance `node build.js`.

---

## ✍️ Modifier le contenu (pour la mairie)

### Changer une coordonnée (téléphone, horaires, e-mail…)
Tout est dans **`src/data/site.js`**, objet `config.nap` et `config.hours`.
Une seule modification met à jour **tout le site** (header, footer, page contact, données structurées).

### Publier une actualité
Dans `src/data/site.js`, ajoutez un objet **en tête** du tableau `news` :

```js
{
  slug: "titre-en-minuscules-avec-tirets",
  title: "Titre de l'actualité",
  date: "2026-09-01",              // format AAAA-MM-JJ
  category: "Culture & patrimoine",
  image: "/assets/img/actu-xxx.svg", // ou une photo dans public/assets/img/
  excerpt: "Résumé court affiché sur la carte.",
  body: `<p>Le contenu complet en HTML…</p>`
}
```

Puis `node build.js`. La carte et la page `/actualites/<slug>` sont créées automatiquement,
avec fil d'Ariane, données structurées `NewsArticle` et ajout au sitemap.

### Modifier le texte d'une page
Éditez le fichier correspondant dans `src/pages/` (ex. `contact.html`), puis relancez le build.
Jetons disponibles dans le contenu : `{{PHONE}}`, `{{EMAIL}}`, `{{ADDRESS_LINE}}`,
`{{HOURS_TABLE}}`, `{{MAYOR}}`, `{{POPULATION}}`, `{{NEWS_LIST}}`, `{{NEWS_HOME}}`.

---

## 🌐 Déploiement (Vercel)

Le dépôt est connecté au projet Vercel. À chaque `git push` sur la branche principale,
Vercel exécute `node build.js` (voir `vercel.json`) et publie `/public`.

- **Build Command :** `node build.js`
- **Output Directory :** `public`
- **Install Command :** *(vide — aucune dépendance)*

---

## 📈 SEO / GEO — ce qui est déjà en place

- Titres & meta descriptions **uniques** par page, `canonical`, Open Graph + Twitter Card
- **`sitemap.xml`** et **`robots.txt`** générés automatiquement (IA/GPTBot/Perplexity autorisés)
- Données structurées **Schema.org** : `GovernmentOffice`, `WebSite`, `BreadcrumbList`,
  `FAQPage`, `HowTo`, `NewsArticle`, `Blog`
- Fil d'Ariane cliquable (HTML + JSON-LD) sur toutes les sous-pages
- **NAP cohérent** (Nom / Adresse / Téléphone) sur tout le site
- URLs propres sans `.html`, redirections **301** des anciennes URLs `/fr/*.html`

### À finaliser par le client
1. **Google Search Console** : valider le domaine, soumettre `https<domaine>/sitemap.xml`
2. **Bing Webmaster Tools** : idem
3. **Google Analytics 4** : coller l'ID `G-XXXXXXXXXX` dans `public/assets/js/main.js`
   (fonction `loadAnalytics`, déjà câblée pour ne se déclencher **qu'après consentement** — conforme CNIL)
4. Remplacer les liens de réseaux sociaux dans `src/data/site.js` (`config.social`) par les vrais comptes
5. Vérifier la composition exacte du **conseil municipal** (page `src/pages/mairie.html`)
6. *(Optionnel)* Fournir une vraie photo pour l'image de partage `og-default` (format 1200×630)

---

## 🔒 Sécurité & performance

- HTTPS forcé + HSTS, en-têtes `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, **Content-Security-Policy** (voir `vercel.json`)
- Images vectorielles SVG légères, `width`/`height` renseignés, `loading="lazy"` hors écran
- Polices en `preconnect` + `display=swap`, JS en `defer`, CSS unique
- 100 % responsive mobile-first, navigation clavier, focus visibles, `aria-*` sur l'interactif

---

## ♿ Accessibilité
Conçu selon le RGAA / WCAG 2.1 AA : structure sémantique, lien d'évitement, contrastes conformes,
respect de `prefers-reduced-motion`. Déclaration sur la page `/accessibilite`.
