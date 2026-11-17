---
name: game-balance
description: Règles d'équilibrage de Digital City. À utiliser dès qu'on crée ou modifie une installation, ses niveaux ou ses stats (coût, CO₂, capacité, demande), les niveaux, les échanges entre data centers, les gains du quiz, la formule de score ou la durée d'une partie.
---

# Équilibrage de Digital City (data center)

## Principe
On part du data center le plus polluant. Aucune stratégie simpliste ne doit gagner :
- Ne rien améliorer → score 0.
- Tout miser sur une seule famille → score médiocre (ex. énergie seule : la demande n'est plus couverte au niveau 2).
- Le meilleur score vient d'un mix : énergie et clim pour le CO₂, serveurs et ménage des données pour tenir la demande.
- Le quiz est le moteur : plus on répond juste, plus on a de pièces.

## Valeurs de départ (src/engine/simulation.ts)
- coins = 100, satisfaction = 60, 3 niveaux × 5 tours.
- Quiz : bonne réponse +40 🪙, +20 de bonus à partir de 3 bonnes réponses d'affilée. Mauvaise = rien (la série repart à 0).
- Demande couverte : +15 🪙 et +5 😊 par tour. Non couverte : −10 😊.

## Installations (CO₂ par tour, niveau 0 → 1 → 2) — src/engine/buildings.ts
| Famille | Nb | Coûts d'amélioration | CO₂ | Autre effet |
|---|---|---|---|---|
| Serveurs | 7 | 50 / 100 | 12 → 7 → 4 | capacité 10 → 13 → 16 |
| Refroidissement | 4 | 40 / 80 | 10 → 4 → 0 | niveau 2 : +1 😊/tour |
| Énergie | 5 | 60 / 120 | 15 → 6 → 1 | |
| Stockage | 5 | 30 / 60 | 6 → 3 → 1 | demande +3 → +1 → 0 |
| Matériel usagé | 4 | 30 / 60 | 8 → 3 → 0 | niveau 2 : +5 🪙/tour |

## Niveaux (src/engine/levels.ts)
| Niveau | Demande de base | Objectif CO₂ |
|---|---|---|
| 1 · Le pire data center de France | 45 | −15 % |
| 2 · Le rush du streaming | 58 | −40 % |
| 3 · Le sommet climat | 70 | −55 % |

## Résultats de simulation (dernière vérif)
Joueur « malin » (meilleur CO₂ par pièce + échanges bien choisis) : 18 / 52 / 69 / 85 points selon qu'il a 30 / 60 / 80 / 100 % de bonnes réponses.
Énergie seule : 9 à 14 points. Serveurs seuls : 20 à 28 points. Ne rien faire : 0.

## Règles
- Toute modification de chiffre doit être justifiée en une phrase.
- Après une modif, re-simuler (ou raisonner) : ne rien faire, une seule famille, mix malin, avec 30 % et 100 % au quiz. Le mix doit gagner.
- Les échanges (TRADES) doivent rester des vrais dilemmes : certains sont des pièges (TechDump, StreamMax).
- Les stats vivent UNIQUEMENT dans src/engine/buildings.ts et src/engine/levels.ts.
