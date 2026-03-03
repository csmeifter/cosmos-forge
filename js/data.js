// ============================================================
// data.js — Celestial body data, scientific facts, research tree
// ============================================================

const CELESTIAL_BODIES = {
  mars: {
    id: 'mars',
    name: 'Mars',
    emoji: '🔴',
    difficulty: 'Moderate',
    difficultyClass: 'difficulty-moderate',
    description:
      'The Red Planet — thin CO₂ atmosphere (0.6% of Earth\'s pressure), polar ice caps, ancient riverbeds. Avg temp: −65°C. Strongest candidate for human colonization.',
    modifiers: {
      solarEfficiency: 0.60,
      waterExtractorBonus: 1.2,
      oxygenConsumption: 1.1,
      hazardChance: 0.18,
      dustStormChance: 0.12,
      meteorChance: 0.06
    },
    startingResources: {
      oxygen: 120,
      water: 90,
      energy: 70,
      food: 100,
      minerals: 140
    },
    bgClass: 'bg-mars',
    facts: [
      'Mars has the largest volcano in the solar system — Olympus Mons, nearly 3× the height of Mt. Everest.',
      'A Martian day (Sol) is 24 hours and 37 minutes — very close to an Earth day.',
      'Mars has two small moons: Phobos and Deimos, likely captured asteroids.',
      'Evidence suggests Mars once had liquid water on its surface billions of years ago.',
      'The thin atmosphere on Mars offers little radiation protection, requiring underground habitats or shielding.',
      'NASA\'s Perseverance rover has been extracting oxygen from the Martian atmosphere via MOXIE since 2021.',
      'SpaceX\'s Starship is designed with Mars colonization as a primary mission objective.',
      'Dust storms on Mars can envelope the entire planet and last for months.',
      'Water ice exists at both polar caps and in subsurface deposits accessible to colonists.',
      'Terraforming Mars is theoretically possible over centuries using greenhouse gases and mirrors to warm the planet.'
    ],
    links: [
      { text: 'NASA Mars Exploration', url: 'https://mars.nasa.gov/' },
      { text: 'Mars Fact Sheet — NASA', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html' }
    ]
  },

  moon: {
    id: 'moon',
    name: 'The Moon',
    emoji: '🌑',
    difficulty: 'Hard',
    difficultyClass: 'difficulty-hard',
    description:
      'Earth\'s natural satellite — no atmosphere, extreme temperature swings (−173°C to 127°C). A 3-day journey from Earth with abundant helium-3 and ice in permanently shadowed craters.',
    modifiers: {
      solarEfficiency: 1.0,
      waterExtractorBonus: 0.7,
      oxygenConsumption: 1.3,
      hazardChance: 0.22,
      dustStormChance: 0.0,
      meteorChance: 0.14
    },
    startingResources: {
      oxygen: 60,
      water: 45,
      energy: 90,
      food: 60,
      minerals: 160
    },
    bgClass: 'bg-moon',
    facts: [
      'The Moon has no atmosphere, so colonists need fully pressurized suits and habitats at all times outdoors.',
      'Water ice has been confirmed in permanently shadowed craters at the lunar poles by NASA\'s LCROSS mission.',
      'Helium-3 on the Moon could fuel future fusion reactors — a potential energy revolution.',
      'The Moon\'s gravity is 1/6th of Earth\'s, which has long-term health effects on the human body.',
      'A lunar day is about 29.5 Earth days, meaning two weeks of sunlight followed by two weeks of darkness.',
      'NASA\'s Artemis program aims to return humans to the Moon and establish a long-term lunar base.',
      'The lunar surface is covered in sharp regolith — abrasive dust that damages equipment.',
      'Lava tubes on the Moon could provide natural radiation shielding and stable temperatures for habitats.',
      'The Moon is tidally locked to Earth — we always see the same face from Earth.',
      'A permanent lunar base could serve as a staging point for deeper space exploration missions.'
    ],
    links: [
      { text: 'NASA Artemis Program', url: 'https://www.nasa.gov/artemis-1/' },
      { text: 'Lunar Reconnaissance Orbiter', url: 'https://lunar.gsfc.nasa.gov/' }
    ]
  },

  europa: {
    id: 'europa',
    name: 'Europa',
    emoji: '🧊',
    difficulty: 'Expert',
    difficultyClass: 'difficulty-expert',
    description:
      'Jupiter\'s icy moon — beneath a 10–30 km ice shell lies a vast liquid ocean. Extreme cold (−160°C surface), intense radiation from Jupiter. A prime candidate for extraterrestrial life.',
    modifiers: {
      solarEfficiency: 0.25,
      waterExtractorBonus: 2.5,
      oxygenConsumption: 1.5,
      hazardChance: 0.30,
      dustStormChance: 0.0,
      meteorChance: 0.08,
      iceGeyserChance: 0.15
    },
    startingResources: {
      oxygen: 50,
      water: 180,
      energy: 35,
      food: 45,
      minerals: 100
    },
    bgClass: 'bg-europa',
    facts: [
      'Europa\'s subsurface ocean is estimated to contain twice as much water as all of Earth\'s oceans combined.',
      'The ice shell on Europa is constantly resurfaced by tidal heating from Jupiter\'s gravity, making it relatively young.',
      'Jupiter\'s radiation belts bombard Europa\'s surface with intense radiation — colonists must live under the ice.',
      'Scientists believe Europa\'s ocean could harbor microbial life due to hydrothermal vents on the ocean floor.',
      'NASA\'s Europa Clipper mission launched in 2024 to study whether Europa could support life.',
      'Europa orbits Jupiter once every 3.5 Earth days in a tight gravitational dance.',
      'The surface temperature of Europa averages −160°C, requiring extreme thermal insulation for habitats.',
      'Solar power is very weak at Europa — colonists would rely heavily on nuclear or chemical energy.',
      'Europa\'s ice cracks, called "lineae," suggest liquid water movements beneath the surface.',
      'ESA\'s JUICE mission is also studying Jupiter\'s icy moons including Europa, Ganymede, and Callisto.'
    ],
    links: [
      { text: 'NASA Europa Clipper', url: 'https://europa.nasa.gov/' },
      { text: 'Europa Fact Sheet', url: 'https://solarsystem.nasa.gov/moons/jupiter-moons/europa/in-depth/' }
    ]
  },

  titan: {
    id: 'titan',
    name: 'Titan',
    emoji: '🌫️',
    difficulty: 'Expert',
    difficultyClass: 'difficulty-expert',
    description:
      'Saturn\'s largest moon — thick nitrogen atmosphere (1.5× Earth\'s pressure), methane lakes, hydrocarbon haze. Temperature: −179°C. The only moon with a dense atmosphere.',
    modifiers: {
      solarEfficiency: 0.10,
      waterExtractorBonus: 0.8,
      oxygenConsumption: 1.4,
      hazardChance: 0.28,
      dustStormChance: 0.08,
      meteorChance: 0.05,
      hydrocarbonBonus: 1.5
    },
    startingResources: {
      oxygen: 45,
      water: 55,
      energy: 25,
      food: 45,
      minerals: 90
    },
    bgClass: 'bg-titan',
    facts: [
      'Titan has a thick nitrogen atmosphere — the only moon in the solar system with a dense atmosphere.',
      'Lakes and seas of liquid methane and ethane dot Titan\'s surface, forming a hydrocarbon cycle like Earth\'s water cycle.',
      'Despite extreme cold, Titan\'s thick atmosphere provides natural radiation shielding — a huge advantage for colonists.',
      'NASA\'s Dragonfly rotorcraft mission will explore Titan\'s surface starting in the 2030s.',
      'Titan\'s atmosphere is 1.5× denser than Earth\'s at sea level — humans could walk outside in just a heated suit.',
      'The Huygens probe landed on Titan in 2005, revealing a landscape of ice pebbles and methane drainage channels.',
      'Hydrocarbons on Titan could serve as chemical fuel or raw materials for manufacturing.',
      'Titan\'s gravity is only 14% of Earth\'s — heavy objects would feel very light.',
      'Sunlight on Titan is about 100× weaker than on Earth due to distance from the Sun.',
      'Titan orbits Saturn every 16 Earth days, making it visible as a bright star from Saturn\'s rings.'
    ],
    links: [
      { text: 'NASA Dragonfly Mission', url: 'https://dragonfly.jhuapl.edu/' },
      { text: 'Titan Fact Sheet', url: 'https://solarsystem.nasa.gov/moons/saturn-moons/titan/in-depth/' }
    ]
  }
};

// ============================================================
// Research Tree
// ============================================================
const RESEARCH_TREE = [
  {
    id: 'advanced_solar',
    name: 'Advanced Solar Panels',
    emoji: '☀️',
    description: 'Improved photovoltaic cells boost Solar Array output by 50%.',
    cost: 3,          // research points (labs needed)
    requires: [],
    effect: { buildingBoost: { buildingId: 'solar_array', resource: 'energy', multiplier: 1.5 } }
  },
  {
    id: 'advanced_hydroponics',
    name: 'Advanced Hydroponics',
    emoji: '🌿',
    description: 'Hydroponic techniques increase Greenhouse food output by 60%.',
    cost: 3,
    requires: [],
    effect: { buildingBoost: { buildingId: 'greenhouse', resource: 'food', multiplier: 1.6 } }
  },
  {
    id: 'better_insulation',
    name: 'Thermal Insulation',
    emoji: '🧱',
    description: 'Advanced insulation reduces energy consumption of all buildings by 20%.',
    cost: 4,
    requires: [],
    effect: { globalEnergyReduction: 0.2 }
  },
  {
    id: 'terraforming_basics',
    name: 'Terraforming Basics',
    emoji: '🌍',
    description: 'Initial terraforming steps improve colony morale by +15.',
    cost: 5,
    requires: ['advanced_solar'],
    effect: { moraleBonus: 15 }
  },
  {
    id: 'water_recycling',
    name: 'Water Recycling',
    emoji: '♻️',
    description: 'Grey water recycling reduces water consumption by 30%.',
    cost: 3,
    requires: [],
    effect: { globalWaterReduction: 0.3 }
  },
  {
    id: 'nuclear_power',
    name: 'Compact Nuclear Reactor',
    emoji: '⚛️',
    description: 'Unlocks a bonus +30 energy each turn from a miniaturised reactor.',
    cost: 6,
    requires: ['better_insulation'],
    effect: { flatResourceBonus: { resource: 'energy', amount: 30 } }
  },
  {
    id: 'atmospheric_processing',
    name: 'Atmospheric Processing',
    emoji: '💨',
    description: 'Extract useful gases from local atmosphere — +10 oxygen per turn.',
    cost: 4,
    requires: ['terraforming_basics'],
    effect: { flatResourceBonus: { resource: 'oxygen', amount: 10 } }
  },
  {
    id: 'automated_mining',
    name: 'Automated Mining Drones',
    emoji: '🤖',
    description: 'Drone swarms increase Mining Facility output by 70%.',
    cost: 5,
    requires: ['advanced_solar'],
    effect: { buildingBoost: { buildingId: 'mining_facility', resource: 'minerals', multiplier: 1.7 } }
  }
];
