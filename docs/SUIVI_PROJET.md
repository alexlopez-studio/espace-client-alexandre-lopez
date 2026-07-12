# Suivi Projet - Portail client

## État actuel - 12/07/2026

Le repo `espace-client-alexandre-lopez` est le projet autonome dédié au portail client.

- Dossier local : `/Users/AlexandreLopez/Documents/GitHub/espace-client-alexandre-lopez`
- Repo : `alexlopez-studio/espace-client-alexandre-lopez`
- Branche de travail locale : `preview`
- Branche de livraison : `main`
- Domaine cible : `https://espace.alexandrelopez.fr`
- Projet Vercel : `espace-client-alexandre-lopez`
- Stack : Vite / React
- Rôle produit : espace client public, suivi vendeur, expérience propriétaire, présentation claire du dossier et des prochaines étapes.

## Architecture cible

- Site public : `site-alex-lopez-provence` sur `https://alexandrelopez.fr`
- Portail client : `espace-client-alexandre-lopez` sur `https://espace.alexandrelopez.fr`
- Mandat OS : `mandat-os-alexandre-lopez` sur `https://app.alexandrelopez.fr`

Le portail client ne doit pas dépendre des routes `/espace-client/*` du repo site public. Les liens depuis le site public pourront pointer vers `https://espace.alexandrelopez.fr` quand le portail sera prêt.

## Avancement

- Base locale créée à partir de `outil-estimation-portail-client`.
- Repo GitHub configuré sur `alexlopez-studio/espace-client-alexandre-lopez`.
- Projet Vercel créé.
- Dossier build attendu : `dist`.
- Commande build attendue : `npm run build`.

## À vérifier / compléter

1. Confirmer l’URL production Vercel active du portail.
2. Vérifier `https://espace.alexandrelopez.fr` en HTTPS après DNS/SSL.
3. Faire un contrôle visuel desktop/mobile.
4. Lister les variables d’environnement réellement nécessaires.
5. Définir le raccord fonctionnel avec Supabase ou API Mandat OS sans recoller les repos.

## Tests de base

```bash
npm install
npm run dev
npm run build
```

## Points de vigilance

- Garder le portail orienté client final : lisible, rassurant, rapide et mobile-first.

### 12/07/2026 - Lien client stable et suivi vide

- Lecture du dossier client via URL stable `/dossier/<public_token>`.
- Conservation du fallback `?dossier=<token>` pour compatibilité locale et callback auth.
- Les sections Documents, Plan de vente, Visites, Offres et Statistiques restent vides si Mandat OS n’a rien publié.
- Ajout d’états vides dédiés pour le Plan de vente et les Statistiques.
- L’estimation reste affichable si elle est publiée dans la projection Mandat OS.
- Vérification technique : `npx tsc --noEmit` OK.
- Ne pas exposer de données internes Mandat OS.
- Ne pas ajouter de dépendance implicite au repo `site-alex-lopez-provence`.
- Toute donnée sensible doit passer par des API contrôlées ou des règles Supabase adaptées.

## Règle de suivi

- Ajouter une entrée datée à ce fichier après chaque décision structurante, livraison ou audit.
- Travailler localement sur `preview`.
- Ne rien pousser sans demande explicite d’Alexandre.
- Quand Alexandre demande explicitement une livraison, intégrer `preview` vers `main` puis pousser `origin/main`.
- Noter les URLs de preview/production et les validations visuelles importantes.

## Journal

### 12/07/2026 - Initialisation du suivi projet

- Création du fichier `docs/SUIVI_PROJET.md`.
- Formalisation de la séparation entre site public, portail client et Mandat OS.
- Prochaine étape : vérifier l’état Vercel/DNS du portail client et cadrer la V1 fonctionnelle.

### 12/07/2026 - Cohérence URL et indexation

- Domaine canonique retenu : `https://espace.alexandrelopez.fr`.
- Ajout d’une balise canonique dans `index.html`.
- Ajout d’une politique `noindex,nofollow` : le portail client ne doit pas être indexé comme contenu SEO public.
- Ajout de `public/robots.txt` avec `Disallow: /`.
- Dossier local renommé en `/Users/AlexandreLopez/Documents/GitHub/espace-client-alexandre-lopez`.
- Vérification : `npm run build` OK.

### 12/07/2026 - Harmonisation typographique

- Typographie principale alignée sur les autres projets : `Inter`.
- Ajout du chargement Google Fonts dans `index.html`.
- Définition des tokens Tailwind v4 `--font-sans` et `--font-mono` dans `src/index.css`.
- Application d’Inter au document via `html` et `body`.

### 12/07/2026 - Passerelle Mandat OS vers Espace Client

- Choix d’architecture : Mandat OS reste source de vérité métier, Supabase sert de couche partagée sécurisée.
- Le portail client lit uniquement la projection publiable `client_dossiers`, pas les routes admin Mandat OS.
- Ajout d’un client Supabase côté Vite avec session persistée et détection des liens magiques.
- Ajout d’un adaptateur `client_dossiers.property_snapshot` + `client_dossiers.professional_opinion.iad_report` vers l’état actuel du portail.
- Le mode démonstration local reste disponible si Supabase ou la session client ne sont pas configurés.

### 12/07/2026 - Configuration Supabase et callback client

- Ajout des variables locales ignorées `.env.local` pour Supabase côté portail.
- Ajout des variables Vercel `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` pour Production, Development et Preview branche `preview`.
- Ajout d’une réécriture Vercel SPA vers `index.html` pour que `/auth/callback` fonctionne avec les liens magiques Supabase.
- Vérification : `npm run lint` OK et `npm run build` OK.

### 12/07/2026 - Portail client lecture seule

- Suppression du composant conseiller/admin `AdminPortal` et retrait de la navigation “Espace Conseiller”.
- Les sections Documents, Visites, Plan de vente et Offres sont passées en visualisation uniquement.
- Le portail consomme désormais la projection publique Mandat OS via `VITE_MANDAT_OS_API_URL`, avec session Supabase client ou token d’aperçu.
- En production, l’absence de session ou un lien invalide affiche un écran “Accès client requis” au lieu du fallback démo.
- Le mode démo reste disponible en développement local lorsque Supabase n’est pas configuré.
