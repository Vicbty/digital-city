---
name: ui-design
description: Charte visuelle et règles d'interface de Digital City. À utiliser pour tout composant React, style CSS, animation, écran ou mise en page dans src/ui/.
---

# Charte UI

## Style
- Ambiance : ville néon / pixel friendly, fun et colorée, pas corporate.
- Palette (variables CSS dans src/index.css) :
  --bg #0f172a, --surface #1e293b, --text #f8fafc,
  --money #facc15, --co2 #94a3b8, --wellbeing #4ade80, --privacy #60a5fa, --danger #f87171, --accent #a78bfa
- Police : system-ui, titres en gras. Bâtiments représentés par des emojis (pas d'images à charger).
- Coins arrondis 12px, ombres douces, transitions 150-250ms.

## Mobile first (le public joue sur téléphone via QR code)
- Tester en 375px de large d'abord.
- Grille carrée qui tient dans l'écran (min(90vw, 480px)).
- Boutons d'au moins 44px de haut. Pas de survol obligatoire (pas de hover-only).
- Barre des bâtiments en bas, scrollable horizontalement sur mobile.
- Indicateurs en haut, toujours visibles, avec emoji + barre de progression.

## Écrans
1. Accueil : titre, 1 phrase d'accroche, bouton « Jouer ».
2. Jeu : indicateurs / grille / barre des bâtiments / bouton « Tour suivant ».
3. Carte quiz : modale plein écran, feedback immédiat vert/rouge + explication.
4. Fin : score /100 en gros, « tu bats X % des joueurs », bouton partager (navigator.share, sinon copier le lien), note 1-10 en étoiles ou boutons, bouton rejouer.
5. /dashboard : chiffres clés en grandes tuiles (visiteurs, parties, score moyen quiz, note moyenne) + répartition des notes.

## Règles
- Textes en français, tutoiement.
- Aucune lib UI externe : CSS simple ou CSS modules.
- Feedback visuel à chaque action (placement, argent insuffisant, case occupée).
