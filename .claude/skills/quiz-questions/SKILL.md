---
name: quiz-questions
description: Écrire, ajouter ou corriger des questions du quiz de Digital City sur le numérique responsable. À utiliser pour tout ce qui touche à src/content/questions.json ou aux cartes événement.
---

# Questions du quiz

## Format (src/content/questions.json)
```json
{
  "id": "q01",
  "theme": "empreinte" ,
  "question": "...",
  "choices": ["...", "...", "..."],
  "answer": 0,
  "explication": "1-2 phrases, ton léger, avec un conseil concret.",
  "source": "Nom de la source ou À VÉRIFIER",
  "bonus": "money" 
}
```
- theme ∈ empreinte | reseaux-sociaux | donnees-perso | cybersecurite | sante-mentale | fake-news | materiel
- bonus ∈ money | wellbeing | privacy

## Règles
- **Ne jamais inventer de chiffre.** Si un chiffre précis n'est pas fourni avec une source, reformuler la question sans chiffre (comparaison qualitative) ou mettre "source": "À VÉRIFIER".
- 3 choix, une seule bonne réponse, des mauvaises réponses plausibles.
- Questions courtes (< 120 caractères), lisibles sur téléphone.
- Ton fun, jamais moralisateur. L'explication donne une action concrète (« désactive la lecture auto des vidéos »).
- Varier les thèmes : pas deux questions du même thème à la suite.
- Le jeu tire les questions au hasard sans répétition dans une partie.
