# Digital City — SMIC Day (CentraleSupélec)

## Contexte
Challenge d'une journée (prototype à 15h, tests croisés 16h30, pitch 17h15).
Thème : **numérique responsable** (Social Media Impact Challenge).
Jeu web type SimCity : le joueur hérite du data center le plus polluant (une « ville » d'installations)
et doit le rendre le plus sobre possible, sans cesser de répondre aux besoins des habitants.
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
    buildings.ts ← familles d'installations et leurs 3 niveaux (réglées par les game designers)
    levels.ts    ← les 3 niveaux et les échanges avec les data centers voisins (fictifs)
    simulation.ts← upgradeTile(), answerQuiz(), acceptTrade(), nextTurn()
    score.ts     ← computeScore()
  lib/supabase.ts← ordi DEV : logVisit(), saveGame(), getStats()
  content/questions.json ← questions du quiz (écrites par les researchers)
  ui/            ← ordi UI uniquement
    Grid.tsx, UpgradePanel.tsx, QuizCard.tsx, TradeCard.tsx, LevelCard.tsx, EndScreen.tsx, Dashboard.tsx
  store.ts       ← pont entre engine et ui
```

## Règles du jeu (résumé)
- Grille 5x5 d'installations, 5 familles (serveurs, refroidissement, énergie, stockage, matériel usagé),
  chacune avec 3 niveaux : 0 = le pire, 2 = le plus sobre. Au départ tout est au niveau 0.
- Indicateurs : coins 🪙, CO₂/tour (et % de réduction vs départ), capacité ⚡ vs demande, satisfaction 😊 (0-100).
- Chaque tour : une question de quiz. Bonne réponse = pièces (+ bonus de série). Les pièces servent à améliorer les installations.
- Si la capacité ne couvre pas la demande, la satisfaction chute : on ne gagne pas en éteignant tout.
- 2 fois par niveau, un data center voisin (fictif) propose un échange (accepter / refuser).
- 3 niveaux de 5 tours (15 tours). Fin de niveau : jusqu'à 3 étoiles (demande couverte, objectif CO₂, habitants ≥ 70).
- Score /100 = réduction de CO₂ finale (75 % = max) × (0,4 + 0,6 × satisfaction/100).
- Écran de fin : score, étoiles, % de joueurs battus, bouton partager, note 1-10 → saveGame().

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
