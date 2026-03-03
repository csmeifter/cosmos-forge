// ============================================================
// buildings.js — Building definitions, costs, and effects
// ============================================================

const BUILDINGS = {
  habitat: {
    id: 'habitat',
    name: 'Habitat Module',
    emoji: '🏠',
    description: 'Pressurised living quarters for colonists. Increases maximum population capacity.',
    cost: { minerals: 50, energy: 20 },
    perTurn: {
      oxygen: -4,
      water: -3,
      energy: -5,
      food: -5,
      minerals: 0
    },
    populationCapBonus: 10,
    maxCount: 10,
    category: 'infrastructure',
    buildTime: 1
  },

  greenhouse: {
    id: 'greenhouse',
    name: 'Greenhouse',
    emoji: '🌱',
    description: 'Enclosed growing facility that produces food using hydroponics and artificial lighting.',
    cost: { minerals: 60, energy: 30 },
    perTurn: {
      oxygen: 3,
      water: -8,
      energy: -10,
      food: 18,
      minerals: 0
    },
    populationCapBonus: 0,
    maxCount: 8,
    category: 'production',
    buildTime: 1
  },

  solar_array: {
    id: 'solar_array',
    name: 'Solar Array',
    emoji: '⚡',
    description: 'Photovoltaic panels that convert sunlight to electricity. Effectiveness varies by location.',
    cost: { minerals: 40, energy: 0 },
    perTurn: {
      oxygen: 0,
      water: 0,
      energy: 20,
      food: 0,
      minerals: 0
    },
    populationCapBonus: 0,
    maxCount: 12,
    category: 'energy',
    buildTime: 1,
    useSolarModifier: true
  },

  water_extractor: {
    id: 'water_extractor',
    name: 'Water Extractor',
    emoji: '💧',
    description: 'Extracts water from local ice deposits or atmospheric humidity.',
    cost: { minerals: 50, energy: 20 },
    perTurn: {
      oxygen: 0,
      water: 14,
      energy: -8,
      food: 0,
      minerals: 0
    },
    populationCapBonus: 0,
    maxCount: 8,
    category: 'production',
    buildTime: 1,
    useWaterModifier: true
  },

  oxygen_generator: {
    id: 'oxygen_generator',
    name: 'Oxygen Generator',
    emoji: '🫁',
    description: 'Electrolyses water or processes atmospheric gases to produce breathable oxygen.',
    cost: { minerals: 45, energy: 25 },
    perTurn: {
      oxygen: 18,
      water: -2,
      energy: -12,
      food: 0,
      minerals: 0
    },
    populationCapBonus: 0,
    maxCount: 8,
    category: 'production',
    buildTime: 1
  },

  mining_facility: {
    id: 'mining_facility',
    name: 'Mining Facility',
    emoji: '⛏️',
    description: 'Extracts raw minerals and metals from the local geology for construction.',
    cost: { minerals: 40, energy: 15 },
    perTurn: {
      oxygen: 0,
      water: 0,
      energy: -5,
      food: 0,
      minerals: 22
    },
    populationCapBonus: 0,
    maxCount: 8,
    category: 'production',
    buildTime: 1
  },

  research_lab: {
    id: 'research_lab',
    name: 'Research Lab',
    emoji: '🔬',
    description: 'Scientific facility that generates research points to unlock new technologies.',
    cost: { minerals: 80, energy: 40 },
    perTurn: {
      oxygen: 0,
      water: 0,
      energy: -15,
      food: 0,
      minerals: 0
    },
    researchPerTurn: 1,
    populationCapBonus: 0,
    maxCount: 4,
    category: 'research',
    buildTime: 1
  },

  shield_generator: {
    id: 'shield_generator',
    name: 'Shield Generator',
    emoji: '🛡️',
    description: 'Electromagnetic and physical shielding to protect the colony from hazards and radiation.',
    cost: { minerals: 70, energy: 35 },
    perTurn: {
      oxygen: 0,
      water: 0,
      energy: -10,
      food: 0,
      minerals: 0
    },
    hazardReduction: 0.25,
    populationCapBonus: 0,
    maxCount: 4,
    category: 'defence',
    buildTime: 1
  }
};

// Ordered list for the building panel
const BUILDING_ORDER = [
  'habitat',
  'greenhouse',
  'solar_array',
  'water_extractor',
  'oxygen_generator',
  'mining_facility',
  'research_lab',
  'shield_generator'
];

// Category display names
const BUILDING_CATEGORIES = {
  infrastructure: 'Infrastructure',
  production: 'Production',
  energy: 'Energy',
  research: 'Research',
  defence: 'Defence'
};
