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
