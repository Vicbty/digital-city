# Digital City — SMIC Day (CentraleSupélec)

## Contexte
Challenge d'une journée (prototype à 15h, tests croisés 16h30, pitch 17h15).
Thème : **numérique responsable** (Social Media Impact Challenge).
Jeu web type SimCity : le joueur est maire d'une ville connectée et doit la rendre
rentable, avec une faible empreinte numérique et des habitants en bonne santé.
Le jury note : le fun, le potentiel viral (nb de visiteurs), la note des joueurs (1-10).

## Stack
- Vite + React + TypeScript (strict)
- Zustand pour l'état
- Supabase (tables `visits` et `games`) pour le dashboard
- Déploiement Vercel
- Pas d'autre lib sans demander. Pas de moteur de jeu (Phaser…) : grille en CSS grid.

## Structure
```
src/
  engine/        ← ordi DEV uniquement
    types.ts     ← CONTRAT partagé UI/dev : ne pas modifier sans prévenir l'autre
    buildings.ts ← stats des bâtiments (réglées par les game designers)
    simulation.ts← placeBuilding(), nextTurn()
    score.ts     ← computeScore()
  lib/supabase.ts← ordi DEV : logVisit(), saveGame(), getStats()
  content/questions.json ← questions du quiz (écrites par les researchers)
  ui/            ← ordi UI uniquement
    Grid.tsx, Toolbar.tsx, QuizCard.tsx, EndScreen.tsx, Dashboard.tsx
  store.ts       ← pont entre engine et ui
```

## Règles du jeu (résumé)
- Grille 10x10. Chaque bâtiment : coût, revenu/tour, CO₂/tour, effet bien-être, effet données.
- Indicateurs : money, co2, wellbeing (0-100), privacy (0-100), turn.
- Chaque tour : une carte quiz. Bonne réponse = bonus. On compte quiz_correct / quiz_total.
- Fin de partie au tour 15. Score = money × (1 − co2/co2Max) × wellbeing/100 × privacy/100, ramené sur 100.
- Écran de fin : score, % de joueurs battus, bouton partager, note 1-10 → saveGame().

## Conventions
- Le moteur est en fonctions **pures** : (state, action) => nouveau state. Aucun import React dans engine/.
- Composants React fonctionnels, un composant par fichier.
- Mobile first : tout doit marcher sur téléphone (le public scanne un QR code).
- Textes de l'interface en français, code et noms de variables en anglais.
- Toujours faire `npm run build` avant de dire qu'une tâche est finie.

## Git
- Deux branches de travail : `engine` (dev) et `ui` (UI). Fusion dans `main` par PR.
- Commits petits et fréquents. Jamais de `push --force` sur main.
- Ne jamais committer `.env`.

## Priorité absolue
Un prototype qui marche à 15h vaut mieux qu'un prototype complet qui casse.
Si une feature prend plus de 30 min, proposer une version plus simple.
