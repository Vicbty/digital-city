# Digital City — SMIC Day (CentraleSupélec)

## Contexte
Challenge d'une journée (prototype à 15h, tests croisés 16h30, pitch 17h15).
Thème : **numérique responsable** (Social Media Impact Challenge).
Jeu web **EcoVille Digital** (city-builder isométrique) : le joueur est maire d'une ville accro aux écrans
(data centers au charbon, téléphones remplacés chaque année, décharge de déchets électroniques) et doit amener
son empreinte numérique à zéro (net zero), niveau par niveau.
Le jury note : le fun, le potentiel viral (nb de visiteurs), la note des joueurs (1-10).

## Stack
- Jeu : un seul fichier index.html (HTML + CSS + JavaScript sans framework)
- Dashboard : Vite + React + TypeScript (strict)
- Supabase (tables `visits` et `games`) pour le dashboard
- Déploiement Vercel
- Pas d'autre lib sans demander. Pas de moteur de jeu (Phaser…).

## Structure
```
index.html          ← LE JEU (HTML + CSS + JS dans un seul fichier, venu de l'artifact de l'équipe)
                      Classement / visiteurs / notes via window.claude.use (claude.ai) ; hors claude.ai, en local.
dashboard.html      ← page /dashboard (React) pour le pitch : visiteurs, parties, notes, QR code
src/
  game-bridge.ts    ← ajouts au jeu : logVisit() Supabase au chargement
  dashboard.tsx     ← point d'entrée React du dashboard
  lib/supabase.ts   ← logVisit(), saveGame(), getStats(), getLeaderboard() (+ repli localStorage)
  ui/               ← Dashboard.tsx, Leaderboard.tsx, QrModal.tsx, Logo.tsx, ErrorBoundary.tsx
public/             ← icônes (apple-touch-icon, manifest), image de partage og.png
vercel.json         ← /dashboard → dashboard.html, le reste → index.html
```

## Conventions
- Le jeu (index.html) se modifie directement, en gardant tout dans ce seul fichier.
- Composants React fonctionnels, un composant par fichier.
- Mobile first : tout doit marcher sur téléphone (le public scanne un QR code).
- Textes de l'interface en français, code et noms de variables en anglais.
- Toujours faire `npm run build` avant de dire qu'une tâche est finie.

## Git
- Fusion dans `main` par PR (chaque fusion redéploie Vercel).
- Commits petits et fréquents. Jamais de `push --force` sur main.
- Ne jamais committer `.env`.

## Priorité absolue
Un prototype qui marche à 15h vaut mieux qu'un prototype complet qui casse.
Si une feature prend plus de 30 min, proposer une version plus simple.
