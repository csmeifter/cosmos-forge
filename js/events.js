// ============================================================
// events.js — Random event system
// ============================================================

const EVENTS = [
  // ── Universal events ────────────────────────────────────────
  {
    id: 'meteor_shower',
    name: 'Meteor Shower',
    emoji: '☄️',
    description: 'A barrage of micrometeorites damages colony infrastructure!',
    type: 'bad',
    weight: 8,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      // Damage a random placed building (offline for 1 turn)
      const placed = state.grid.filter(c => c.buildingId && !c.destroyed);
      if (placed.length === 0) {
        return { message: 'Meteor shower strikes! Fortunately no buildings were hit.', resource: null };
      }
      const target = placed[Math.floor(Math.random() * placed.length)];
      target.offlineTurns = (target.offlineTurns || 0) + 2;
      const bld = BUILDINGS[target.buildingId];
      return {
        message: `Meteor shower! ${bld.emoji} ${bld.name} is damaged and offline for 2 turns.`,
        resource: null
      };
    }
  },

  {
    id: 'solar_flare',
    name: 'Solar Flare',
    emoji: '🌡️',
    description: 'A powerful solar flare disrupts energy systems across the colony.',
    type: 'bad',
    weight: 7,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      const loss = Math.floor(20 + Math.random() * 20);
      state.resources.energy = Math.max(0, state.resources.energy - loss);
      return {
        message: `Solar flare! Energy systems disrupted — lost ${loss} energy units.`,
        resource: 'energy'
      };
    }
  },

  {
    id: 'new_settlers',
    name: 'New Settlers Arrive',
    emoji: '🧑‍🚀',
    description: 'A supply ship delivers new volunteers eager to join your colony!',
    type: 'good',
    weight: 6,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      const count = 2 + Math.floor(Math.random() * 4);
      const available = state.populationCap - state.population;
      const actual = Math.min(count, available);
      if (actual <= 0) {
        return { message: 'New settlers arrived but the colony is at full capacity! Build more Habitats.', resource: null };
      }
      state.population += actual;
      return {
        message: `${actual} new settlers arrived! Population is now ${state.population}.`,
        resource: null
      };
    }
  },

  {
    id: 'scientific_discovery',
    name: 'Scientific Discovery',
    emoji: '🔬',
    description: 'Your scientists make a breakthrough that yields bonus resources!',
    type: 'good',
    weight: 5,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      const resources = ['oxygen', 'water', 'energy', 'food', 'minerals'];
      const chosen = resources[Math.floor(Math.random() * resources.length)];
      const amount = 20 + Math.floor(Math.random() * 30);
      state.resources[chosen] = Math.min(999, state.resources[chosen] + amount);
      state.morale = Math.min(100, state.morale + 5);
      return {
        message: `Scientific breakthrough! Gained ${amount} ${chosen} and +5 morale.`,
        resource: chosen
      };
    }
  },

  {
    id: 'equipment_malfunction',
    name: 'Equipment Malfunction',
    emoji: '🦠',
    description: 'A critical system failure takes a building offline.',
    type: 'bad',
    weight: 7,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      const placed = state.grid.filter(c => c.buildingId && !c.offlineTurns);
      if (placed.length === 0) {
        return { message: 'Equipment malfunction detected but quickly contained. No damage.', resource: null };
      }
      const target = placed[Math.floor(Math.random() * placed.length)];
      target.offlineTurns = 1;
      const bld = BUILDINGS[target.buildingId];
      return {
        message: `Equipment malfunction! ${bld.emoji} ${bld.name} is offline for 1 turn.`,
        resource: null
      };
    }
  },

  {
    id: 'morale_boost',
    name: 'Community Celebration',
    emoji: '🎉',
    description: 'The colonists organise a colony-wide celebration, boosting everyone\'s spirits.',
    type: 'good',
    weight: 5,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      const boost = 8 + Math.floor(Math.random() * 7);
      state.morale = Math.min(100, state.morale + boost);
      return {
        message: `Community celebration! Colony morale increased by ${boost}.`,
        resource: null
      };
    }
  },

  {
    id: 'supply_drop',
    name: 'Emergency Supply Drop',
    emoji: '📦',
    description: 'Earth sends an emergency resupply pod with critical materials.',
    type: 'good',
    weight: 4,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      const amount = 25 + Math.floor(Math.random() * 25);
      state.resources.minerals += amount;
      state.resources.food = Math.min(999, state.resources.food + 15);
      return {
        message: `Emergency supply drop! Received ${amount} minerals and 15 food.`,
        resource: 'minerals'
      };
    }
  },

  {
    id: 'power_surge',
    name: 'Power Grid Surge',
    emoji: '⚡',
    description: 'A cascading power surge damages energy infrastructure.',
    type: 'bad',
    weight: 5,
    locations: ['mars', 'moon', 'europa', 'titan'],
    apply(state) {
      const loss = 15 + Math.floor(Math.random() * 25);
      state.resources.energy = Math.max(0, state.resources.energy - loss);
      state.morale = Math.max(0, state.morale - 5);
      return {
        message: `Power grid surge! Lost ${loss} energy and -5 morale.`,
        resource: 'energy'
      };
    }
  },

  // ── Mars-specific events ─────────────────────────────────────
  {
    id: 'dust_storm',
    name: 'Martian Dust Storm',
    emoji: '🏜️',
    description: 'A planet-wide dust storm blankets the solar panels!',
    type: 'bad',
    weight: 10,
    locations: ['mars'],
    apply(state) {
      const loss = 25 + Math.floor(Math.random() * 20);
      state.resources.energy = Math.max(0, state.resources.energy - loss);
      return {
        message: `Dust storm blankets Mars! Solar power reduced — lost ${loss} energy.`,
        resource: 'energy'
      };
    }
  },

  {
    id: 'dust_storm_clear',
    name: 'Storm Clears',
    emoji: '🌄',
    description: 'The dust storm clears, revealing a spectacular sunset.',
    type: 'neutral',
    weight: 4,
    locations: ['mars'],
    apply(state) {
      state.morale = Math.min(100, state.morale + 8);
      return {
        message: 'The dust storm clears. A stunning Martian sunset boosts colony morale by 8.',
        resource: null
      };
    }
  },

  {
    id: 'regolith_cache',
    name: 'Rich Regolith Cache',
    emoji: '🪨',
    description: 'Surveys reveal an unusually mineral-rich area near the colony.',
    type: 'good',
    weight: 5,
    locations: ['mars'],
    apply(state) {
      const amount = 35 + Math.floor(Math.random() * 30);
      state.resources.minerals += amount;
      return {
        message: `Rich regolith cache discovered on Mars! Gained ${amount} minerals.`,
        resource: 'minerals'
      };
    }
  },

  // ── Moon-specific events ─────────────────────────────────────
  {
    id: 'crater_ice',
    name: 'Crater Ice Discovered',
    emoji: '❄️',
    description: 'Scouts find a pristine ice deposit in a nearby crater.',
    type: 'good',
    weight: 8,
    locations: ['moon'],
    apply(state) {
      const amount = 30 + Math.floor(Math.random() * 25);
      state.resources.water += amount;
      return {
        message: `Crater ice discovered on the Moon! Gained ${amount} water.`,
        resource: 'water'
      };
    }
  },

  {
    id: 'moonquake',
    name: 'Moonquake',
    emoji: '🌋',
    description: 'A tidal moonquake rattles the colony foundations.',
    type: 'bad',
    weight: 6,
    locations: ['moon'],
    apply(state) {
      const placed = state.grid.filter(c => c.buildingId);
      if (placed.length > 0) {
        const target = placed[Math.floor(Math.random() * placed.length)];
        target.offlineTurns = (target.offlineTurns || 0) + 1;
        const bld = BUILDINGS[target.buildingId];
        return {
          message: `Moonquake! ${bld.emoji} ${bld.name} is damaged and offline for 1 turn.`,
          resource: null
        };
      }
      return { message: 'Moonquake shakes the colony. Minor damage absorbed by shield systems.', resource: null };
    }
  },

  {
    id: 'helium3_deposit',
    name: 'Helium-3 Deposit Found',
    emoji: '⚛️',
    description: 'Drillers strike a concentrated deposit of Helium-3 fusion fuel!',
    type: 'good',
    weight: 3,
    locations: ['moon'],
    apply(state) {
      const energyBonus = 50 + Math.floor(Math.random() * 30);
      state.resources.energy = Math.min(999, state.resources.energy + energyBonus);
      state.morale = Math.min(100, state.morale + 10);
      return {
        message: `Helium-3 deposit found! Gained ${energyBonus} energy and +10 morale!`,
        resource: 'energy'
      };
    }
  },

  // ── Europa-specific events ────────────────────────────────────
  {
    id: 'ice_geyser',
    name: 'Ice Geyser Eruption',
    emoji: '🌊',
    description: 'A subsurface geyser erupts, showering the colony with water ice!',
    type: 'good',
    weight: 10,
    locations: ['europa'],
    apply(state) {
      const amount = 40 + Math.floor(Math.random() * 35);
      state.resources.water = Math.min(999, state.resources.water + amount);
      return {
        message: `Ice geyser eruption on Europa! Collected ${amount} water from the spray.`,
        resource: 'water'
      };
    }
  },

  {
    id: 'radiation_surge',
    name: 'Jovian Radiation Surge',
    emoji: '☢️',
    description: 'Jupiter\'s magnetosphere channels a deadly radiation burst toward Europa.',
    type: 'bad',
    weight: 8,
    locations: ['europa'],
    apply(state) {
      const moraleHit = 10 + Math.floor(Math.random() * 10);
      state.morale = Math.max(0, state.morale - moraleHit);
      const oxLoss = 10 + Math.floor(Math.random() * 10);
      state.resources.oxygen = Math.max(0, state.resources.oxygen - oxLoss);
      return {
        message: `Jovian radiation surge! Lost ${oxLoss} oxygen and -${moraleHit} morale.`,
        resource: 'oxygen'
      };
    }
  },

  {
    id: 'ocean_signal',
    name: 'Signal from the Deep',
    emoji: '🐟',
    description: 'Sensors detect unusual oscillations from the subsurface ocean — possible biosignatures!',
    type: 'good',
    weight: 3,
    locations: ['europa'],
    apply(state) {
      state.morale = Math.min(100, state.morale + 20);
      state.researchPoints = (state.researchPoints || 0) + 2;
      return {
        message: 'Possible biosignatures detected below the ice! Colony morale surges by 20 and +2 research points!',
        resource: null
      };
    }
  },

  // ── Titan-specific events ─────────────────────────────────────
  {
    id: 'hydrocarbon_rain',
    name: 'Methane Rainstorm',
    emoji: '🌧️',
    description: 'Liquid methane rains down, but your fuel collectors harvest it for energy!',
    type: 'good',
    weight: 8,
    locations: ['titan'],
    apply(state) {
      const energyBonus = 20 + Math.floor(Math.random() * 25);
      state.resources.energy = Math.min(999, state.resources.energy + energyBonus);
      return {
        message: `Methane rainstorm on Titan! Harvesters captured ${energyBonus} energy worth of fuel.`,
        resource: 'energy'
      };
    }
  },

  {
    id: 'titan_wind',
    name: 'Nitrogen Wind Storm',
    emoji: '💨',
    description: 'Titan\'s thick atmosphere unleashes powerful nitrogen winds that damage structures.',
    type: 'bad',
    weight: 7,
    locations: ['titan'],
    apply(state) {
      const placed = state.grid.filter(c => c.buildingId);
      if (placed.length > 0) {
        const target = placed[Math.floor(Math.random() * placed.length)];
        target.offlineTurns = (target.offlineTurns || 0) + 1;
        const bld = BUILDINGS[target.buildingId];
        return {
          message: `Nitrogen wind storm! ${bld.emoji} ${bld.name} is offline for 1 turn.`,
          resource: null
        };
      }
      return { message: 'Nitrogen winds howl across Titan. Shielding holds.', resource: null };
    }
  },

  {
    id: 'hydrocarbon_lake',
    name: 'Hydrocarbon Lake Survey',
    emoji: '🛸',
    description: 'Drones map a vast hydrocarbon lake rich in organic compounds!',
    type: 'good',
    weight: 4,
    locations: ['titan'],
    apply(state) {
      const mineralsBonus = 25 + Math.floor(Math.random() * 20);
      const energyBonus = 15 + Math.floor(Math.random() * 15);
      state.resources.minerals += mineralsBonus;
      state.resources.energy = Math.min(999, state.resources.energy + energyBonus);
      return {
        message: `Hydrocarbon lake surveyed! Gained ${mineralsBonus} minerals and ${energyBonus} energy.`,
        resource: null
      };
    }
  }
];

// ============================================================
// Event system helper
// ============================================================
function getRandomEvent(state) {
  const location = state.celestialBody;
  const applicable = EVENTS.filter(e => e.locations.includes(location));

  // Build weighted pool
  const pool = [];
  applicable.forEach(e => {
    for (let i = 0; i < e.weight; i++) pool.push(e);
  });

  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function triggerEvent(state) {
  // Base chance is 25%, modified by shield generators
  const shields = state.grid.filter(c => c.buildingId === 'shield_generator' && !c.offlineTurns).length;
  const hazardReduction = shields * 0.25;
  const eventChance = Math.max(0.05, 0.25 - hazardReduction);

  if (Math.random() > eventChance) return null;

  const event = getRandomEvent(state);
  if (!event) return null;

  const result = event.apply(state);
  return {
    event,
    message: result.message,
    resource: result.resource,
    type: event.type
  };
}
