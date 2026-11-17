---
name: game-balance
description: Règles d'équilibrage de Digital City. À utiliser dès qu'on crée ou modifie un bâtiment, ses stats (coût, revenu, CO₂, bien-être, données), la formule de score, les événements ou la durée d'une partie.
---

# Équilibrage de Digital City

## Principe
Aucune stratégie unique ne doit gagner. Le joueur doit arbitrer entre argent, CO₂, bien-être et données.
- Tout miser sur l'argent (data centers + réseau social) → score final médiocre (CO₂ et bien-être effondrés).
- Tout miser sur l'écologie → pas assez d'argent pour construire → score médiocre.
- Le meilleur score vient d'un mix.

## Valeurs de départ
- money = 1000, co2 = 0, wellbeing = 70, privacy = 70, turn = 1, fin au tour 15.
- co2Max = 500 (au-delà, facteur CO₂ = 0).
- wellbeing et privacy bornés entre 0 et 100.

## Fourchettes par bâtiment (par tour)
| Bâtiment | Coût | Revenu | CO₂ | Bien-être | Données |
|---|---|---|---|---|---|
| Data center classique | 300 | +120 | +25 | 0 | -2 |
| Data center vert | 550 | +90 | +5 | 0 | -1 |
| Antenne 5G / fibre | 200 | +60 | +8 | +1 | 0 |
| Réseau social | 400 | +180 | +15 | -4 | -4 |
| Repair café | 150 | -10 | -10 | +2 | 0 |
| École du numérique | 250 | -20 | 0 | +3 | +3 |
| Parc sans écran | 100 | -5 | -5 | +3 | 0 |

## Règles
- Toute modification de chiffre doit être justifiée en une phrase.
- Après une modif, simuler mentalement les 3 stratégies (argent pur, écolo pur, mix) sur 15 tours et vérifier que le mix gagne.
- Bonus quiz : bonne réponse = +50 money ou +3 bien-être (selon la question). Mauvaise réponse = rien (pas de punition, on veut que ce soit fun).
- Les stats vivent UNIQUEMENT dans src/engine/buildings.ts.
