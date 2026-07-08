/**
 * Source de vérité unique du site.
 * Toute donnée NAP (Nom / Adresse / Téléphone), navigation, pages et actualités
 * est centralisée ici pour garantir la cohérence sur tout le site (SEO/GEO).
 */

const config = {
  siteName: "Mairie de Montastruc-la-Conseillère",
  shortName: "Montastruc-la-Conseillère",
  baseUrl: "https://mairie-montastruc.fr", // domaine de production
  lang: "fr",
  locale: "fr_FR",
  description:
    "Site officiel de la Mairie de Montastruc-la-Conseillère (31380, Haute-Garonne, Occitanie) : démarches administratives, actualités, élus, services et vie locale.",
  // NAP officiel — doit rester identique partout
  nap: {
    legalName: "Commune de Montastruc-la-Conseillère",
    name: "Mairie de Montastruc-la-Conseillère",
    street: "Place de la Mairie",
    postBox: "BP 49",
    postalCode: "31380",
    city: "Montastruc-la-Conseillère",
    department: "Haute-Garonne",
    region: "Occitanie",
    country: "France",
    phone: "05 61 84 21 10",
    phoneAlt: "05 61 84 17 15",
    phoneE164: "+33561842110",
    email: "info@mairie-montastruc.fr",
    lat: 43.6923,
    lng: 1.6033,
    mayor: "Jean-Baptiste Capel",
    mayorSince: "2020",
    population: "3 708",
    insee: "31384",
    siret: "21310358300018",
    elus: "27",
    adjoints: "7",
  },
  // Services externes officiels de la commune
  links: {
    rdv360: "https://www.rdv360.com/mairie-montastruc-la-conseillere-31380-montastruc-la-conseillere",
    portailFamille: "https://portail.berger-levrault.fr/mairieMontastruc31380/accueil",
    ants: "https://ants.gouv.fr",
    servicePublic: "https://www.service-public.fr",
  },
  // Hébergeur réel (le site n'est pas hébergé sur Vercel en production)
  host: {
    name: "OXYD S.A.R.L",
    rcs: "RCS Paris 433 768 975",
    address: "19 rue Alphonse de Neuville, 75017 Paris",
    phone: "01 71 250 350",
  },
  hours: [
    { day: "Lundi", d: "Monday", am: "08:30 – 12:00", pm: "14:00 – 18:00", o: ["08:30-12:00", "14:00-18:00"] },
    { day: "Mardi", d: "Tuesday", am: "08:30 – 12:00", pm: "14:00 – 19:00", o: ["08:30-12:00", "14:00-19:00"] },
    { day: "Mercredi", d: "Wednesday", am: "08:30 – 12:30", pm: "14:00 – 18:00", o: ["08:30-12:30", "14:00-18:00"] },
    { day: "Jeudi", d: "Thursday", am: "08:30 – 12:30", pm: "14:00 – 18:00", o: ["08:30-12:30", "14:00-18:00"] },
    { day: "Vendredi", d: "Friday", am: "08:30 – 12:00", pm: "14:00 – 17:00", o: ["08:30-12:00", "14:00-17:00"] },
    { day: "Samedi", d: "Saturday", am: "Fermé", pm: "Fermé", o: [] },
    { day: "Dimanche", d: "Sunday", am: "Fermé", pm: "Fermé", o: [] },
  ],
  social: {
    facebook: "https://www.facebook.com/MontastruclaConseillere/",
    instagram: "https://www.instagram.com/montastruclaconseillere/",
    youtube: "https://www.youtube.com/channel/UCZChfJQp5IMIJkviJXN-h8A/featured",
  },
};

/** Navigation principale (cliquable, avec sous-menus) */
const nav = [
  { label: "Accueil", href: "/" },
  {
    label: "Découvrir",
    href: "/decouvrir",
    children: [
      { label: "Présentation & histoire", href: "/decouvrir#presentation" },
      { label: "Situation géographique", href: "/decouvrir#situation" },
      { label: "Patrimoine & cadre de vie", href: "/decouvrir#patrimoine" },
    ],
  },
  {
    label: "La Mairie",
    href: "/mairie",
    children: [
      { label: "Le maire & les élus", href: "/mairie#elus" },
      { label: "Conseil municipal", href: "/mairie#conseil" },
      { label: "Services municipaux", href: "/mairie#services" },
      { label: "Comptes-rendus & délibérations", href: "/mairie#comptes-rendus" },
    ],
  },
  {
    label: "Démarches",
    href: "/demarches",
    children: [
      { label: "État civil", href: "/demarches#etat-civil" },
      { label: "Carte d'identité & passeport", href: "/demarches#cni-passeport" },
      { label: "Urbanisme & logement", href: "/demarches#urbanisme" },
      { label: "Toutes les démarches", href: "/demarches" },
    ],
  },
  {
    label: "Vie locale",
    href: "/vie-locale",
    children: [
      { label: "Enfance & éducation", href: "/vie-locale#enfance" },
      { label: "Culture, sport & associations", href: "/vie-locale#associations" },
      { label: "Économie & emploi", href: "/vie-locale#economie" },
      { label: "Solidarité & santé", href: "/vie-locale#solidarite" },
    ],
  },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

/** Pages statiques — le contenu vit dans src/pages/<content>.html */
const pages = [
  {
    slug: "index",
    out: "index.html",
    url: "/",
    nav: "/",
    title: "Mairie de Montastruc-la-Conseillère — Site officiel",
    description:
      "Bienvenue sur le site officiel de la Mairie de Montastruc-la-Conseillère (31380, Haute-Garonne). Démarches en ligne, actualités, horaires, élus et vie locale.",
    content: "index",
    breadcrumbs: [],
    schema: "home",
  },
  {
    slug: "decouvrir",
    out: "decouvrir.html",
    url: "/decouvrir",
    nav: "/decouvrir",
    title: "Découvrir Montastruc-la-Conseillère — Histoire, situation & patrimoine",
    description:
      "Découvrez Montastruc-la-Conseillère : village de la Haute-Garonne aux portes de Toulouse, son histoire, sa situation géographique, son patrimoine et son cadre de vie.",
    content: "decouvrir",
    breadcrumbs: [{ label: "Découvrir Montastruc", url: "/decouvrir" }],
    schema: "page",
  },
  {
    slug: "mairie",
    out: "mairie.html",
    url: "/mairie",
    nav: "/mairie",
    title: "La Mairie — Le maire, les élus et les services municipaux",
    description:
      "La Mairie de Montastruc-la-Conseillère : le maire Jean-Baptiste Capel, le conseil municipal, les services municipaux et les comptes-rendus des séances.",
    content: "mairie",
    breadcrumbs: [{ label: "La Mairie", url: "/mairie" }],
    schema: "page",
  },
  {
    slug: "demarches",
    out: "demarches.html",
    url: "/demarches",
    nav: "/demarches",
    title: "Démarches administratives — État civil, CNI, passeport, urbanisme",
    description:
      "Toutes vos démarches administratives à Montastruc-la-Conseillère : état civil, carte d'identité, passeport, urbanisme et logement. Guides pas à pas et prise de rendez-vous.",
    content: "demarches",
    breadcrumbs: [{ label: "Démarches", url: "/demarches" }],
    schema: "demarches",
  },
  {
    slug: "vie-locale",
    out: "vie-locale.html",
    url: "/vie-locale",
    nav: "/vie-locale",
    title: "Vie locale — Enfance, éducation, associations, culture & solidarité",
    description:
      "La vie locale à Montastruc-la-Conseillère : écoles et enfance, associations, culture et sport, économie et emploi, solidarité et santé.",
    content: "vie-locale",
    breadcrumbs: [{ label: "Vie locale", url: "/vie-locale" }],
    schema: "page",
  },
  {
    slug: "actualites",
    out: "actualites.html",
    url: "/actualites",
    nav: "/actualites",
    title: "Actualités de Montastruc-la-Conseillère",
    description:
      "Toute l'actualité de Montastruc-la-Conseillère : informations municipales, événements, travaux et vie de la commune.",
    content: "actualites",
    breadcrumbs: [{ label: "Actualités", url: "/actualites" }],
    schema: "blog",
  },
  {
    slug: "contact",
    out: "contact.html",
    url: "/contact",
    nav: "/contact",
    title: "Contact & horaires de la Mairie de Montastruc-la-Conseillère",
    description:
      "Contacter la Mairie de Montastruc-la-Conseillère : adresse Place de la Mairie 31380, téléphone 05 61 84 21 10, e-mail, horaires d'ouverture et plan d'accès.",
    content: "contact",
    breadcrumbs: [{ label: "Contact", url: "/contact" }],
    schema: "contact",
  },
  {
    slug: "mentions-legales",
    out: "mentions-legales.html",
    url: "/mentions-legales",
    nav: "",
    title: "Mentions légales",
    description: "Mentions légales du site officiel de la Mairie de Montastruc-la-Conseillère.",
    content: "mentions-legales",
    breadcrumbs: [{ label: "Mentions légales", url: "/mentions-legales" }],
    schema: "page",
  },
  {
    slug: "politique-confidentialite",
    out: "politique-confidentialite.html",
    url: "/politique-confidentialite",
    nav: "",
    title: "Politique de confidentialité & cookies",
    description:
      "Politique de confidentialité et gestion des cookies du site de la Mairie de Montastruc-la-Conseillère, conforme RGPD et recommandations CNIL.",
    content: "politique-confidentialite",
    breadcrumbs: [{ label: "Politique de confidentialité", url: "/politique-confidentialite" }],
    schema: "page",
  },
  {
    slug: "accessibilite",
    out: "accessibilite.html",
    url: "/accessibilite",
    nav: "",
    title: "Déclaration d'accessibilité",
    description:
      "Déclaration d'accessibilité du site de la Mairie de Montastruc-la-Conseillère (référentiel RGAA).",
    content: "accessibilite",
    breadcrumbs: [{ label: "Accessibilité", url: "/accessibilite" }],
    schema: "page",
  },
  {
    slug: "plan-du-site",
    out: "plan-du-site.html",
    url: "/plan-du-site",
    nav: "",
    title: "Plan du site",
    description: "Plan du site de la Mairie de Montastruc-la-Conseillère : accès à toutes les pages.",
    content: "plan-du-site",
    breadcrumbs: [{ label: "Plan du site", url: "/plan-du-site" }],
    schema: "page",
  },
  {
    slug: "404",
    out: "404.html",
    url: "/404",
    nav: "",
    title: "Page introuvable",
    description: "La page demandée est introuvable sur le site de la Mairie de Montastruc-la-Conseillère.",
    content: "404",
    breadcrumbs: [],
    schema: "none",
    noindex: true,
  },
];

/**
 * Actualités — chaque entrée génère une carte sur /actualites et une page
 * /actualites/<slug>. Ajouter une actu = ajouter un objet en tête de liste.
 */
const news = [
  {
    slug: "restauration-orgue-eglise-saint-barthelemy",
    title: "Restauration de l'orgue de l'église Saint-Barthélemy : appel aux dons",
    date: "2026-06-24",
    category: "Culture & patrimoine",
    image: "/assets/img/eglise-saint-barthelemy.jpg",
    excerpt:
      "La commune lance une souscription pour restaurer l'orgue historique de la manufacture Théodore Puget (1872), joyau de l'église Saint-Barthélemy.",
    body: `
      <p>L'orgue de l'église Saint-Barthélemy, construit en 1872 par la célèbre manufacture toulousaine <strong>Théodore Puget</strong>, fait partie du patrimoine remarquable de Montastruc-la-Conseillère. Après plus de 150 ans de service, l'instrument nécessite une restauration complète.</p>
      <p>La municipalité, en partenariat avec la Fondation du patrimoine, lance un <strong>appel aux dons</strong> ouvert à tous. Chaque contribution ouvre droit à une réduction fiscale.</p>
      <h2>Comment participer ?</h2>
      <ul>
        <li>En ligne, via la plateforme de la Fondation du patrimoine ;</li>
        <li>Par chèque à l'ordre de la commune, déposé en mairie ;</li>
        <li>En espèces, directement à l'accueil de la mairie.</li>
      </ul>
      <p>Pour toute question, contactez la mairie au <a href="tel:+33561842110">05 61 84 21 10</a>.</p>
    `,
  },
  {
    slug: "installation-conseil-administration-ccas",
    title: "Installation du conseil d'administration du CCAS",
    date: "2026-06-10",
    category: "Solidarité",
    image: "/assets/img/actu-ccas.svg",
    excerpt:
      "Le nouveau conseil d'administration du Centre communal d'action sociale (CCAS) a été installé pour poursuivre l'accompagnement des habitants.",
    body: `
      <p>Le <strong>Centre communal d'action sociale (CCAS)</strong> de Montastruc-la-Conseillère a procédé à l'installation de son conseil d'administration. Cette instance pilote l'action sociale de proximité de la commune.</p>
      <h2>Ses missions</h2>
      <ul>
        <li>Aide et accompagnement des personnes âgées et en situation de handicap ;</li>
        <li>Soutien aux familles et lutte contre la précarité ;</li>
        <li>Instruction des demandes d'aide sociale légale.</li>
      </ul>
      <p>Le CCAS reçoit sur rendez-vous. Contactez la mairie pour être orienté vers le bon interlocuteur.</p>
    `,
  },
  {
    slug: "consultation-juridique-gratuite",
    title: "Consultation juridique gratuite en mairie",
    date: "2026-06-05",
    category: "Services",
    image: "/assets/img/actu-juridique.svg",
    excerpt:
      "Un cabinet d'avocats toulousain tient une permanence gratuite en mairie pour répondre à vos questions juridiques du quotidien.",
    body: `
      <p>Pour faciliter l'accès au droit, la mairie accueille une <strong>permanence juridique gratuite</strong> assurée par un cabinet d'avocats toulousain.</p>
      <p>Ces consultations, sur rendez-vous, permettent d'obtenir un premier avis sur des questions de la vie courante : litiges de voisinage, droit de la famille, consommation, logement…</p>
      <h2>Prendre rendez-vous</h2>
      <p>Les rendez-vous se prennent à l'accueil de la mairie ou par téléphone au <a href="tel:+33561842110">05 61 84 21 10</a>.</p>
    `,
  },
  {
    slug: "defibrillateurs-communaux",
    title: "Des défibrillateurs installés dans la commune",
    date: "2026-05-20",
    category: "Santé",
    image: "/assets/img/actu-defibrillateur.svg",
    excerpt:
      "Une intervention rapide peut augmenter significativement les chances de survie en cas d'arrêt cardiaque. La commune s'équipe de défibrillateurs accessibles.",
    body: `
      <p>La commune a installé plusieurs <strong>défibrillateurs automatisés externes (DAE)</strong> dans les lieux publics. En cas d'arrêt cardiaque, chaque minute compte : une intervention rapide augmente fortement les chances de survie.</p>
      <h2>Que faire face à un arrêt cardiaque ?</h2>
      <ol>
        <li>Appelez le <strong>15</strong> (SAMU) ou le <strong>112</strong> ;</li>
        <li>Commencez le massage cardiaque ;</li>
        <li>Utilisez le défibrillateur le plus proche en suivant ses instructions vocales.</li>
      </ol>
      <p>Les appareils sont conçus pour être utilisés par tous, sans formation préalable.</p>
    `,
  },
  {
    slug: "permanence-impots",
    title: "Permanence des impôts sur rendez-vous",
    date: "2026-05-12",
    category: "Services",
    image: "/assets/img/actu-impots.svg",
    excerpt:
      "Un agent des Finances publiques tient une permanence en mairie les mardis matin pour vous accompagner dans vos démarches fiscales.",
    body: `
      <p>Une <strong>permanence des Finances publiques</strong> se tient en mairie afin de vous accompagner dans vos démarches fiscales : déclaration de revenus, taxe foncière, prélèvement à la source, etc.</p>
      <h2>Horaires</h2>
      <p>Les <strong>mardis de 9h00 à 12h00</strong>, sur rendez-vous à prendre auprès de la mairie au <a href="tel:+33561842110">05 61 84 21 10</a>.</p>
    `,
  },
];

module.exports = { config, nav, pages, news };
