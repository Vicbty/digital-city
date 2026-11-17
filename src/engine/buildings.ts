import type { Family, FamilyDef } from './types'

// Stats réglées par les game designers : voir .claude/skills/game-balance/SKILL.md
export const FAMILIES: Record<Family, FamilyDef> = {
  servers: {
    family: 'servers',
    label: 'Serveurs',
    short: 'Serveurs',
    upgradeCosts: [50, 100],
    tiers: [
      { name: 'Vieux serveurs', emoji: '🗄️', description: 'Lents, gourmands, toujours allumés.', co2: 12, capacity: 10, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Serveurs efficaces', emoji: '🖥️', description: 'Plus de calcul pour moins d’énergie.', co2: 7, capacity: 13, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Serveurs virtualisés', emoji: '💠', description: 'Une machine fait le travail de plusieurs.', co2: 4, capacity: 16, demand: 0, income: 0, satisfaction: 0 },
    ],
  },
  cooling: {
    family: 'cooling',
    label: 'Refroidissement',
    short: 'Refroid.',
    upgradeCosts: [40, 80],
    tiers: [
      { name: 'Clim à fond', emoji: '🥵', description: 'On refroidit les serveurs comme un frigo ouvert.', co2: 10, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Free cooling', emoji: '🌬️', description: 'L’air extérieur refroidit les serveurs.', co2: 4, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Récup’ de chaleur', emoji: '♨️', description: 'La chaleur des serveurs chauffe le quartier.', co2: 0, capacity: 0, demand: 0, income: 0, satisfaction: 1 },
    ],
  },
  energy: {
    family: 'energy',
    label: 'Énergie',
    short: 'Énergie',
    upgradeCosts: [60, 120],
    tiers: [
      { name: 'Générateur diesel', emoji: '🛢️', description: 'Ça tourne… et ça fume.', co2: 15, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Réseau électrique', emoji: '🔌', description: 'Branché sur le réseau, déjà plus propre.', co2: 6, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Solaire & éolien', emoji: '☀️', description: 'Une énergie renouvelable produite sur place.', co2: 1, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
    ],
  },
  storage: {
    family: 'storage',
    label: 'Stockage',
    short: 'Données',
    upgradeCosts: [30, 60],
    tiers: [
      { name: 'Données zombies', emoji: '🧟', description: 'Doublons, vieux mails, vidéos oubliées : ça charge les serveurs.', co2: 6, capacity: 0, demand: 3, income: 0, satisfaction: 0 },
      { name: 'Grand ménage', emoji: '🧹', description: 'On supprime l’inutile, la charge baisse.', co2: 3, capacity: 0, demand: 1, income: 0, satisfaction: 0 },
      { name: 'Archivage froid', emoji: '🧊', description: 'Les données rarement lues dorment sur des supports éteints.', co2: 1, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
    ],
  },
  hardware: {
    family: 'hardware',
    label: 'Matériel usagé',
    short: 'Matériel',
    upgradeCosts: [30, 60],
    tiers: [
      { name: 'Décharge', emoji: '🗑️', description: 'Le vieux matériel finit en tas.', co2: 8, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Recyclage', emoji: '♻️', description: 'Les composants sont récupérés.', co2: 3, capacity: 0, demand: 0, income: 0, satisfaction: 0 },
      { name: 'Reconditionnement', emoji: '🔧', description: 'On répare et on revend : ça rapporte.', co2: 0, capacity: 0, demand: 0, income: 5, satisfaction: 0 },
    ],
  },
}

export const FAMILY_LIST = Object.values(FAMILIES)

/** Plan de départ du data center (5x5), du pire au pire. */
const S = 'servers', C = 'cooling', E = 'energy', D = 'storage', H = 'hardware'
export const START_LAYOUT: Family[] = [
  E, S, C, S, E,
  S, D, H, D, S,
  C, H, E, H, C,
  S, D, H, D, S,
  E, S, C, D, E,
]
// 7 serveurs, 4 clims, 5 énergies, 5 stockages, 4 matériels
