---
name: ui-design
description: Charte visuelle et règles d'interface de Digital City. À utiliser pour tout composant React, style CSS, animation, écran ou mise en page dans src/ui/.
---

# Charte UI

## Style : « vrai data center », clair, pas « look IA »
- Thème CLAIR : béton clair, blanc, gris métal, bleu câble, voyants rouge / orange / vert.
- Interdit : dégradés violet-rose, effets néon, glow, texte en dégradé, avalanche d'emojis décoratifs.
- Palette (variables CSS dans src/index.css) :
  --bg #eef1f4, --surface #ffffff, --line #cfd6dd, --text #1b232c, --muted #5d6b79, --steel #3b4754,
  --accent #1f6fc5, --ok #1f9d55, --warn #c27c00, --bad #d64545, --coin #9a6700
- Étiquettes techniques (salles, niveaux, numéros d'équipements) en police mono majuscule (`.tag`).
- Les équipements sont représentés par des emojis ; voyants = état (rouge polluant, orange en progrès, vert sobre).
- Coins arrondis 10px, ombres légères, transitions 150-250ms.

## Mobile first, format iPhone (le public scanne un QR code)
- Tester en 320px (iPhone SE) et 390px (iPhone 13). Aucune barre de défilement horizontale.
- Respecter les zones sûres : env(safe-area-inset-*).
- Champs de saisie ≥ 16px (sinon iOS zoome).
- Boutons d'au moins 44px de haut. Pas de survol obligatoire.
- Icône écran d'accueil : public/apple-touch-icon.png (180px), manifest.webmanifest (192/512).

## Écrans
1. Accueil : logo, titre, « Comment gagner » (HowToPlay), pseudo, « Jouer ».
2. Jeu : bandeau (niveau, pièces, objectif CO₂ du niveau, service, satisfaction, bouton « ? »), puis
   vue extérieure → plan du site (5 salles) → salle (rôle, 3 versions, liste des équipements + Améliorer).
3. Carte quiz : feedback vert/rouge + explication + source cliquable.
4. Échange avec un data center voisin, carte de fin de niveau (étoiles).
5. Fin : score /100, « tu bats X % », classement, partager, note 1-10, rejouer.
6. /dashboard : tuiles, top 10, répartition des notes, QR code.

## Règles
- Textes en français, tutoiement.
- Aucune lib UI externe.
- Feedback visuel à chaque action (amélioration, pièces insuffisantes).
