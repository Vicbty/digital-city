import { LEVELS } from '../engine/levels'
import { QUIZ_COINS, SATISFIED_THRESHOLD, SERVICE_INCOME, STREAK_BONUS, STREAK_MIN } from '../engine/simulation'

/** Les règles en 5 points : utilisées sur l'accueil et dans l'aide. */
export default function HowToPlay() {
  return (
    <ol className="howto">
      <li>
        <strong>Ton but</strong> : réduire le CO₂ du data center le plus polluant de France, sans couper le service à tes
        utilisateurs.
      </li>
      <li>
        <strong>Gagne des pièces</strong> 🪙 : chaque tour, une question sur l’impact du numérique. Bonne réponse = +
        {QUIZ_COINS} (+{STREAK_BONUS} dès {STREAK_MIN} bonnes réponses d’affilée). Service assuré = +{SERVICE_INCOME} par
        tour.
      </li>
      <li>
        <strong>Améliore</strong> : entre dans le bâtiment, choisis une salle et remplace ses équipements : polluant → en
        progrès → sobre.
      </li>
      <li>
        <strong>Attention</strong> : garde assez de capacité serveur pour couvrir la demande, sinon tes utilisateurs
        décrochent.
      </li>
      <li>
        <strong>Gagne des étoiles</strong> : {LEVELS.length} niveaux de 5 tours. Par niveau : ★ service assuré, ★ objectif
        CO₂ atteint, ★ satisfaction ≥ {SATISFIED_THRESHOLD}. Score final /100 = baisse de CO₂ × satisfaction.
      </li>
    </ol>
  )
}
