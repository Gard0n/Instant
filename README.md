# Instant — Appareil photo jetable pour mariage

React + Vite + TypeScript + Supabase. PWA mobile-first (pas d'installation, pas de compte invité).

## Setup Supabase

1. Créer un projet Supabase.
2. Activer **Authentication → Providers → Anonymous Sign-Ins** (nécessaire pour que l'organisateur puisse prévisualiser ses photos avant la révélation — voir `supabase/migrations/0001_init.sql`).
3. Exécuter la migration `supabase/migrations/0001_init.sql` (SQL Editor ou `supabase db push`).
4. Copier `.env.example` vers `.env.local` et renseigner `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`.

## Dev

```bash
npm install
npm run dev
```

⚠️ `getUserMedia` (accès caméra) nécessite un contexte sécurisé (HTTPS ou `localhost`). Pour tester depuis un téléphone sur le réseau local, utiliser `npm run dev -- --host` avec un tunnel HTTPS (ex. `ngrok`) ou déployer sur un hébergement HTTPS.

## Build

```bash
npm run build
```

## Pages

- `/create` — l'organisateur crée l'événement (nom + date de révélation + style de filtre), obtient un lien + QR code.
- `/event/:id` — page invité : caméra, capture, filtre appliqué automatiquement (selon le style choisi par l'organisateur), upload.
- `/event/:id/gallery` — verrouillée avec compte à rebours avant la révélation (sauf pour l'organisateur, identifié par sa session anonyme), grille de photos téléchargeables après.
