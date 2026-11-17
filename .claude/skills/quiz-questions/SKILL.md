---
name: quiz-questions
description: Écrire, ajouter ou corriger des questions du quiz de Digital City sur le numérique responsable. À utiliser pour tout ce qui touche à src/content/questions.json ou aux cartes événement.
---

# Questions du quiz

## Format (src/content/questions.json)
```json
{
  "id": "q01",
  "theme": "energie",
  "question": "...",
  "choices": ["...", "...", "..."],
  "answer": 0,
  "explication": "1-2 phrases, ton léger, avec un conseil concret.",
  "source": "Organisme, titre du document (année)",
  "url": "https://lien-vers-la-source"
}
```
- theme ∈ energie | refroidissement | materiel | donnees | usages | ia | reseau
- Sujet : l'impact des data centers et du numérique (« data impacts »). Une bonne réponse rapporte des pièces 🪙.
- Il faut au moins 15 questions (une par tour).

## Règles
- **Sources réelles obligatoires** : de préférence publiques (ADEME, Arcep, RTE, AIE, CNIL, info.gouv.fr, ministères). La source s'affiche au joueur après sa réponse.
- **Ne jamais inventer de chiffre.** Si un chiffre précis n'est pas fourni avec une source, reformuler la question sans chiffre (comparaison qualitative) ou mettre "source": "À VÉRIFIER".
- 3 choix, une seule bonne réponse, des mauvaises réponses plausibles.
- Questions courtes (< 120 caractères), lisibles sur téléphone.
- Ton fun, jamais moralisateur. L'explication donne une action concrète (« désactive la lecture auto des vidéos »).
- Varier les thèmes : pas deux questions du même thème à la suite.
- Le jeu tire les questions au hasard sans répétition dans une partie.
