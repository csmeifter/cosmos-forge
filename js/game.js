// ============================================================
// game.js — Core game logic, state management, turn system
// ============================================================

// ── Game State ───────────────────────────────────────────────
let gameState = null;

const GRID_SIZE = 8; // 8×8 grid
const RESOURCE_MAX = 999;
const RESOURCE_CRITICAL_THRESHOLD = 20;

// ── Initialise / Reset ────────────────────────────────────────
function initGame(colonyName, celestialBodyId) {
  const body = CELESTIAL_BODIES[celestialBodyId];
  gameState = {
    colonyName,
    celestialBody: celestialBodyId,
    sol: 1,
    population: 5,
    populationCap: 10,        // starts with 1 habitat assumed for starting pop
    morale: 70,
    resources: { ...body.startingResources },
    grid: Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, i) => ({
      index: i,
      buildingId: null,
      offlineTurns: 0
    })),
    selectedBuilding: null,
    eventLog: [],
    researchPoints: 0,
    unlockedResearch: [],
    appliedResearch: [],
    criticalTurns: { oxygen: 0, water: 0, food: 0 },
    gameOver: false,
    gameWon: false,
    shields: 0
  };

  // Place 1 starting habitat
  gameState.grid[Math.floor(GRID_SIZE / 2) * GRID_SIZE + Math.floor(GRID_SIZE / 2)].buildingId = 'habitat';

  logEvent('🚀 Colony established! Welcome to the frontier, Commander.', 'good');
  return gameState;
}

// ── Event Log ─────────────────────────────────────────────────
function logEvent(message, type = 'neutral') {
  gameState.eventLog.unshift({ message, type, sol: gameState.sol });
  if (gameState.eventLog.length > 20) gameState.eventLog.pop();
}

// ── Resource Calculations ─────────────────────────────────────
function calculateResourceDeltas() {
  const deltas = { oxygen: 0, water: 0, energy: 0, food: 0, minerals: 0 };
  const body = CELESTIAL_BODIES[gameState.celestialBody];

  // Gather active (online) buildings
  gameState.grid.forEach(cell => {
    if (!cell.buildingId || cell.offlineTurns > 0) return;
    const bld = BUILDINGS[cell.buildingId];
    if (!bld) return;

    Object.keys(deltas).forEach(res => {
      let val = bld.perTurn[res] || 0;

      // Apply solar modifier to Solar Array
      if (cell.buildingId === 'solar_array' && res === 'energy') {
        val = Math.round(val * body.modifiers.solarEfficiency);
      }

      // Apply water extractor modifier
      if (cell.buildingId === 'water_extractor' && res === 'water') {
        val = Math.round(val * body.modifiers.waterExtractorBonus);
      }

      // Apply research boosts
      gameState.appliedResearch.forEach(rId => {
        const research = RESEARCH_TREE.find(r => r.id === rId);
        if (!research) return;
        if (research.effect.buildingBoost) {
          const b = research.effect.buildingBoost;
          if (b.buildingId === cell.buildingId && b.resource === res) {
            val = Math.round(val * b.multiplier);
          }
        }
        if (research.effect.globalEnergyReduction && res === 'energy' && val < 0) {
          val = Math.round(val * (1 - research.effect.globalEnergyReduction));
        }
        if (research.effect.globalWaterReduction && res === 'water' && val < 0) {
          val = Math.round(val * (1 - research.effect.globalWaterReduction));
        }
      });

      deltas[res] += val;
    });
  });

  // Apply flat research bonuses
  gameState.appliedResearch.forEach(rId => {
    const research = RESEARCH_TREE.find(r => r.id === rId);
    if (!research) return;
    if (research.effect.flatResourceBonus) {
      const { resource, amount } = research.effect.flatResourceBonus;
      deltas[resource] += amount;
    }
  });

  // Population consumes oxygen, water, food
  deltas.oxygen -= Math.round(gameState.population * 0.5 * body.modifiers.oxygenConsumption);
  deltas.water -= Math.round(gameState.population * 0.3);
  deltas.food -= Math.round(gameState.population * 0.5);

  return deltas;
}

function getResearchPoints() {
  let pts = 0;
  gameState.grid.forEach(cell => {
    if (cell.buildingId === 'research_lab' && !cell.offlineTurns) pts += 1;
  });
  return pts;
}

// ── Population Growth ─────────────────────────────────────────
function processPopulationGrowth() {
  const r = gameState.resources;
  const canGrow =
    r.oxygen > RESOURCE_CRITICAL_THRESHOLD &&
    r.water > RESOURCE_CRITICAL_THRESHOLD &&
    r.food > RESOURCE_CRITICAL_THRESHOLD &&
    gameState.population < gameState.populationCap &&
    gameState.morale >= 30;

  if (canGrow && gameState.sol % 3 === 0) {
    const growth = Math.min(2, gameState.populationCap - gameState.population);
    gameState.population += growth;
    if (growth > 0) logEvent(`👶 Population grew by ${growth}. Now ${gameState.population} colonists.`, 'good');
  }
}

// ── Population Decline ────────────────────────────────────────
function processPopulationDecline() {
  const r = gameState.resources;
  let decline = 0;
  let reasons = [];

  if (r.oxygen <= 0) { decline += 2; reasons.push('no oxygen'); }
  if (r.water <= 0) { decline += 2; reasons.push('no water'); }
  if (r.food <= 0) { decline += 1; reasons.push('no food'); }
  if (gameState.morale < 10) { decline += 1; reasons.push('despair'); }

  if (decline > 0) {
    const actual = Math.min(decline, gameState.population);
    gameState.population -= actual;
    logEvent(`💀 Lost ${actual} colonist(s) due to: ${reasons.join(', ')}.`, 'bad');
  }
}

// ── Morale Calculation ────────────────────────────────────────
function calculateMorale() {
  const r = gameState.resources;
  let morale = gameState.morale;

  // Resource levels affect morale
  const resources = ['oxygen', 'water', 'food', 'energy'];
  resources.forEach(res => {
    if (r[res] < RESOURCE_CRITICAL_THRESHOLD) morale -= 3;
    else if (r[res] > 200) morale += 1;
  });

  // Population vs cap
  const ratio = gameState.populationCap > 0 ? gameState.population / gameState.populationCap : 1;
  if (ratio < 0.3) morale += 2;

  // Passive morale decay
  morale -= 1;

  // Terraforming research bonus
  if (gameState.appliedResearch.includes('terraforming_basics')) morale += 1;

  gameState.morale = Math.max(0, Math.min(100, Math.round(morale)));
}

// ── Critical Resource Tracking ─────────────────────────────────
function trackCriticalResources() {
  ['oxygen', 'water', 'food'].forEach(res => {
    if (gameState.resources[res] <= 0) {
      gameState.criticalTurns[res] += 1;
    } else {
      gameState.criticalTurns[res] = 0;
    }
  });
}

// ── Win / Lose Checks ─────────────────────────────────────────
function checkWinLose() {
  // Lose conditions
  if (gameState.population <= 0) {
    gameState.gameOver = true;
    return 'lose';
  }
  const criticalLose = Object.values(gameState.criticalTurns).some(t => t >= 3);
  if (criticalLose) {
    gameState.gameOver = true;
    return 'lose';
  }

  // Win condition
  if (
    gameState.population >= 100 &&
    gameState.morale >= 50 &&
    gameState.resources.oxygen > 0 &&
    gameState.resources.water > 0 &&
    gameState.resources.food > 0
  ) {
    gameState.gameWon = true;
    return 'win';
  }

  return null;
}

// ── Advance Turn ──────────────────────────────────────────────
function advanceTurn() {
  if (gameState.gameOver || gameState.gameWon) return;

  // Decrement offline turns
  gameState.grid.forEach(cell => {
    if (cell.offlineTurns > 0) cell.offlineTurns -= 1;
  });

  // Calculate and apply resource deltas
  const deltas = calculateResourceDeltas();
  Object.keys(deltas).forEach(res => {
    gameState.resources[res] = Math.max(0, Math.min(RESOURCE_MAX, gameState.resources[res] + deltas[res]));
  });

  // Research points
  gameState.researchPoints += getResearchPoints();

  // Morale
  calculateMorale();

  // Population
  processPopulationGrowth();
  processPopulationDecline();

  // Track critical resources
  trackCriticalResources();

  // Random event
  const eventResult = triggerEvent(gameState);
  if (eventResult) {
    logEvent(`${eventResult.event.emoji} ${eventResult.message}`, eventResult.type);
  }

  // Advance sol
  gameState.sol += 1;

  // Win/lose check
  const outcome = checkWinLose();
  if (outcome === 'win') {
    logEvent('🏆 VICTORY! Your colony has thrived among the stars!', 'good');
  } else if (outcome === 'lose') {
    logEvent('💥 Colony lost. The stars claim another frontier...', 'bad');
  }

  return { deltas, eventResult, outcome };
}

// ── Building Placement ────────────────────────────────────────
function canAffordBuilding(buildingId) {
  const bld = BUILDINGS[buildingId];
  return (
    gameState.resources.minerals >= bld.cost.minerals &&
    gameState.resources.energy >= bld.cost.energy
  );
}

function placeBuilding(cellIndex, buildingId) {
  const cell = gameState.grid[cellIndex];
  if (cell.buildingId) return { success: false, reason: 'Cell already occupied.' };

  const bld = BUILDINGS[buildingId];
  if (!canAffordBuilding(buildingId)) {
    return {
      success: false,
      reason: `Not enough resources. Need ${bld.cost.minerals} minerals and ${bld.cost.energy} energy.`
    };
  }

  // Count existing buildings of this type
  const existing = gameState.grid.filter(c => c.buildingId === buildingId).length;
  if (existing >= bld.maxCount) {
    return { success: false, reason: `Maximum of ${bld.maxCount} ${bld.name}(s) allowed.` };
  }

  // Deduct cost
  gameState.resources.minerals -= bld.cost.minerals;
  gameState.resources.energy -= bld.cost.energy;

  // Place building
  cell.buildingId = buildingId;
  cell.offlineTurns = 0;

  // Update population cap
  if (bld.populationCapBonus > 0) {
    gameState.populationCap += bld.populationCapBonus;
  }

  logEvent(`🔨 Built ${bld.emoji} ${bld.name} at grid position ${cellIndex + 1}.`, 'neutral');
  return { success: true };
}

function demolishBuilding(cellIndex) {
  const cell = gameState.grid[cellIndex];
  if (!cell.buildingId) return { success: false, reason: 'No building here.' };

  const bld = BUILDINGS[cell.buildingId];

  // Refund 50% of mineral cost
  const refund = Math.floor(bld.cost.minerals * 0.5);
  gameState.resources.minerals = Math.min(RESOURCE_MAX, gameState.resources.minerals + refund);

  // Remove population cap bonus
  if (bld.populationCapBonus > 0) {
    gameState.populationCap = Math.max(gameState.population, gameState.populationCap - bld.populationCapBonus);
  }

  const name = bld.name;
  cell.buildingId = null;
  cell.offlineTurns = 0;

  logEvent(`🗑️ Demolished ${bld.emoji} ${name}. Recovered ${refund} minerals.`, 'neutral');
  return { success: true };
}

// ── Research ──────────────────────────────────────────────────
function unlockResearch(researchId) {
  if (gameState.unlockedResearch.includes(researchId)) {
    return { success: false, reason: 'Already researched.' };
  }

  const research = RESEARCH_TREE.find(r => r.id === researchId);
  if (!research) return { success: false, reason: 'Unknown research.' };

  // Check prerequisites
  for (const req of research.requires) {
    if (!gameState.unlockedResearch.includes(req)) {
      const reqName = RESEARCH_TREE.find(r => r.id === req)?.name || req;
      return { success: false, reason: `Requires "${reqName}" first.` };
    }
  }

  // Check research points
  if (gameState.researchPoints < research.cost) {
    return { success: false, reason: `Need ${research.cost} research points (have ${gameState.researchPoints}).` };
  }

  // Deduct and unlock
  gameState.researchPoints -= research.cost;
  gameState.unlockedResearch.push(researchId);
  gameState.appliedResearch.push(researchId);

  // Apply morale bonus immediately
  if (research.effect.moraleBonus) {
    gameState.morale = Math.min(100, gameState.morale + research.effect.moraleBonus);
  }

  logEvent(`🔭 Research complete: ${research.emoji} ${research.name}!`, 'good');
  return { success: true };
}

// ============================================================
// UI Rendering & DOM interaction
// ============================================================
const SCREEN_LANDING = 'landing-screen';
const SCREEN_GAME = 'game-screen';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(el => el.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

// ── Landing Screen ────────────────────────────────────────────
function renderLandingScreen() {
  const grid = document.getElementById('celestial-grid');
  grid.innerHTML = '';

  Object.values(CELESTIAL_BODIES).forEach(body => {
    const card = document.createElement('div');
    card.className = 'celestial-card';
    card.dataset.id = body.id;
    card.innerHTML = `
      <div class="celestial-emoji">${body.emoji}</div>
      <div class="celestial-name">${body.name}</div>
      <div class="celestial-difficulty ${body.difficultyClass}">${body.difficulty}</div>
      <div class="celestial-desc">${body.description}</div>
    `;
    card.addEventListener('click', () => selectCelestialBody(body.id));
    grid.appendChild(card);
  });
}

let selectedBody = null;
function selectCelestialBody(id) {
  selectedBody = id;
  document.querySelectorAll('.celestial-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === id);
  });
  document.getElementById('start-btn').disabled = false;
}

// ── Start Game ────────────────────────────────────────────────
function startGame() {
  const nameInput = document.getElementById('colony-name');
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.classList.add('shake');
    setTimeout(() => nameInput.classList.remove('shake'), 500);
    nameInput.placeholder = 'Please enter a colony name!';
    return;
  }
  if (!selectedBody) {
    showToast('Please select a celestial body first!', 'bad');
    return;
  }

  initGame(name, selectedBody);
  showScreen(SCREEN_GAME);
  renderGameScreen();
}

// ── Game Screen ───────────────────────────────────────────────
function renderGameScreen() {
  renderHeader();
  renderResources();
  renderGrid();
  renderBuildingPanel();
  renderInfoPanel();
  renderResearchPanel();
  renderSidebar();
  renderEventLog();
}

function renderHeader() {
  document.getElementById('colony-title').textContent = gameState.colonyName;
  const body = CELESTIAL_BODIES[gameState.celestialBody];
  document.getElementById('colony-location').textContent = `${body.emoji} ${body.name}`;
  document.getElementById('sol-counter').textContent = `Sol ${gameState.sol}`;
}

// ── Resources ─────────────────────────────────────────────────
const RESOURCE_CONFIG = {
  oxygen: { label: 'Oxygen', emoji: '🫁', color: '#00d4ff' },
  water: { label: 'Water', emoji: '💧', color: '#4fc3f7' },
  energy: { label: 'Energy', emoji: '⚡', color: '#ffd740' },
  food: { label: 'Food', emoji: '🌱', color: '#69f0ae' },
  minerals: { label: 'Minerals', emoji: '⛏️', color: '#ce93d8' }
};

function renderResources() {
  const deltas = calculateResourceDeltas();

  Object.keys(RESOURCE_CONFIG).forEach(res => {
    const cfg = RESOURCE_CONFIG[res];
    const val = gameState.resources[res];
    const delta = deltas[res];
    const pct = Math.min(100, (val / RESOURCE_MAX) * 100);

    const bar = document.getElementById(`res-${res}`);
    if (!bar) return;

    const fill = bar.querySelector('.resource-fill');
    const valEl = bar.querySelector('.resource-value');
    const deltaEl = bar.querySelector('.resource-delta');

    fill.style.width = `${pct}%`;

    // Color based on level
    if (val < RESOURCE_CRITICAL_THRESHOLD) {
      fill.style.background = '#f44336';
      bar.classList.add('critical');
    } else if (val < 80) {
      fill.style.background = '#ff9800';
      bar.classList.remove('critical');
    } else {
      fill.style.background = cfg.color;
      bar.classList.remove('critical');
    }

    valEl.textContent = val;
    deltaEl.textContent = (delta >= 0 ? '+' : '') + delta;
    deltaEl.className = 'resource-delta ' + (delta >= 0 ? 'delta-positive' : 'delta-negative');
  });

  // Population & morale
  const popEl = document.getElementById('population-display');
  if (popEl) {
    popEl.textContent = `${gameState.population} / ${gameState.populationCap}`;
  }
  const moraleEl = document.getElementById('morale-display');
  if (moraleEl) {
    moraleEl.textContent = `${gameState.morale}%`;
    const moraleFill = document.getElementById('morale-fill');
    if (moraleFill) {
      moraleFill.style.width = `${gameState.morale}%`;
      if (gameState.morale < 30) moraleFill.style.background = '#f44336';
      else if (gameState.morale < 60) moraleFill.style.background = '#ff9800';
      else moraleFill.style.background = '#69f0ae';
    }
  }
  const rpEl = document.getElementById('research-points-display');
  if (rpEl) rpEl.textContent = gameState.researchPoints;
  const rpEl2 = document.getElementById('research-points-display2');
  if (rpEl2) rpEl2.textContent = gameState.researchPoints;
}

// ── Grid ──────────────────────────────────────────────────────
function renderGrid() {
  const container = document.getElementById('colony-grid');
  if (!container) return;
  container.innerHTML = '';

  gameState.grid.forEach((cell, idx) => {
    const tile = document.createElement('div');
    tile.className = 'grid-tile';
    tile.dataset.index = idx;

    if (cell.buildingId) {
      const bld = BUILDINGS[cell.buildingId];
      tile.classList.add('has-building');
      if (cell.offlineTurns > 0) tile.classList.add('offline');
      tile.innerHTML = `
        <span class="tile-emoji">${bld.emoji}</span>
        ${cell.offlineTurns > 0 ? `<span class="offline-badge">${cell.offlineTurns}</span>` : ''}
      `;
      const offlineStatus = cell.offlineTurns > 0
        ? ` (offline ${cell.offlineTurns} turn${cell.offlineTurns > 1 ? 's' : ''})`
        : '';
      tile.title = `${bld.name}${offlineStatus}\nClick to demolish`;
      tile.addEventListener('click', () => handleGridTileClick(idx));
    } else {
      tile.classList.add('empty');
      tile.innerHTML = '<span class="tile-empty-dot">·</span>';
      tile.title = gameState.selectedBuilding
        ? `Build ${BUILDINGS[gameState.selectedBuilding].name} here`
        : 'Empty tile — select a building to place';
      tile.addEventListener('click', () => handleGridTileClick(idx));
    }

    // Highlight if a building is selected
    if (gameState.selectedBuilding && !cell.buildingId) {
      tile.classList.add('placeable');
    }

    container.appendChild(tile);
  });
}

function handleGridTileClick(idx) {
  const cell = gameState.grid[idx];

  if (cell.buildingId) {
    // Demolish confirmation
    if (confirm(`Demolish ${BUILDINGS[cell.buildingId].name}? You'll recover 50% of the mineral cost.`)) {
      const result = demolishBuilding(idx);
      if (result.success) {
        renderGameScreen();
      } else {
        showToast(result.reason, 'bad');
      }
    }
    return;
  }

  if (!gameState.selectedBuilding) {
    showToast('Select a building from the panel first!', 'neutral');
    return;
  }

  const result = placeBuilding(idx, gameState.selectedBuilding);
  if (result.success) {
    renderGameScreen();
  } else {
    showToast(result.reason, 'bad');
  }
}

// ── Building Panel ────────────────────────────────────────────
function renderBuildingPanel() {
  const container = document.getElementById('building-cards');
  if (!container) return;
  container.innerHTML = '';

  BUILDING_ORDER.forEach(bldId => {
    const bld = BUILDINGS[bldId];
    const canAfford = canAffordBuilding(bldId);
    const isSelected = gameState.selectedBuilding === bldId;
    const count = gameState.grid.filter(c => c.buildingId === bldId).length;

    const card = document.createElement('div');
    card.className = `building-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'unaffordable' : ''}`;
    card.title = bld.description;

    // Build per-turn summary
    const effects = [];
    Object.entries(bld.perTurn).forEach(([res, val]) => {
      if (val !== 0) {
        const cfg = RESOURCE_CONFIG[res];
        effects.push(`<span class="${val > 0 ? 'pos' : 'neg'}">${val > 0 ? '+' : ''}${val} ${cfg.emoji}</span>`);
      }
    });
    if (bld.researchPerTurn) effects.push(`<span class="pos">+${bld.researchPerTurn} 🔭</span>`);
    if (bld.populationCapBonus) effects.push(`<span class="pos">+${bld.populationCapBonus} 👥 cap</span>`);

    card.innerHTML = `
      <div class="bld-header">
        <span class="bld-emoji">${bld.emoji}</span>
        <span class="bld-name">${bld.name}</span>
        <span class="bld-count">${count}/${bld.maxCount}</span>
      </div>
      <div class="bld-cost">
        <span>⛏️ ${bld.cost.minerals}</span>
        ${bld.cost.energy > 0 ? `<span>⚡ ${bld.cost.energy}</span>` : ''}
      </div>
      <div class="bld-effects">${effects.join(' ')}</div>
    `;

    card.addEventListener('click', () => selectBuilding(bldId));
    container.appendChild(card);
  });
}

function selectBuilding(bldId) {
  if (gameState.selectedBuilding === bldId) {
    gameState.selectedBuilding = null;
  } else {
    gameState.selectedBuilding = bldId;
  }
  renderBuildingPanel();
  renderGrid();
  updateBuildingHint();
}

function updateBuildingHint() {
  const hint = document.getElementById('building-hint');
  if (!hint) return;
  if (gameState.selectedBuilding) {
    const bld = BUILDINGS[gameState.selectedBuilding];
    hint.textContent = `${bld.emoji} ${bld.name} selected — click an empty grid tile to place it. Click the building card again to cancel.`;
    hint.classList.remove('hidden');
  } else {
    hint.classList.add('hidden');
  }
}

// ── Info Panel ────────────────────────────────────────────────
function renderInfoPanel() {
  renderHeader();
  renderResources();
}

// ── Event Log ─────────────────────────────────────────────────
function renderEventLog() {
  const log = document.getElementById('event-log');
  if (!log) return;
  log.innerHTML = '';

  gameState.eventLog.slice(0, 10).forEach(entry => {
    const item = document.createElement('div');
    item.className = `log-entry log-${entry.type}`;
    item.innerHTML = `<span class="log-sol">Sol ${entry.sol}</span> ${entry.message}`;
    log.appendChild(item);
  });
}

// ── Research Panel ────────────────────────────────────────────
function renderResearchPanel() {
  const container = document.getElementById('research-cards');
  if (!container) return;
  container.innerHTML = '';

  // Count research labs
  const labCount = gameState.grid.filter(c => c.buildingId === 'research_lab' && !c.offlineTurns).length;

  // Update points display
  const rptEl = document.getElementById('research-points-display');
  if (rptEl) rptEl.textContent = gameState.researchPoints;

  RESEARCH_TREE.forEach(research => {
    const unlocked = gameState.unlockedResearch.includes(research.id);
    const prereqsMet = research.requires.every(req => gameState.unlockedResearch.includes(req));
    const canAfford = gameState.researchPoints >= research.cost;
    const hasLab = labCount > 0;

    const card = document.createElement('div');
    card.className = `research-card ${unlocked ? 'unlocked' : ''} ${!prereqsMet ? 'locked' : ''} ${!hasLab && !unlocked ? 'no-lab' : ''}`;

    const prereqNames = research.requires
      .filter(req => !gameState.unlockedResearch.includes(req))
      .map(req => RESEARCH_TREE.find(r => r.id === req)?.name || req);

    card.innerHTML = `
      <div class="research-header">
        <span class="research-emoji">${research.emoji}</span>
        <span class="research-name">${research.name}</span>
        <span class="research-cost">🔭 ${research.cost}</span>
      </div>
      <div class="research-desc">${research.description}</div>
      ${!prereqsMet ? `<div class="research-req">Requires: ${prereqNames.join(', ')}</div>` : ''}
      ${unlocked ? '<div class="research-status">✅ Researched</div>' : ''}
    `;

    if (!unlocked && prereqsMet && hasLab) {
      const btn = document.createElement('button');
      btn.className = `research-btn ${!canAfford ? 'disabled' : ''}`;
      btn.textContent = canAfford ? 'Research' : `Need ${research.cost} pts`;
      btn.disabled = !canAfford;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const result = unlockResearch(research.id);
        if (result.success) {
          renderGameScreen();
        } else {
          showToast(result.reason, 'bad');
        }
      });
      card.appendChild(btn);
    }

    if (!hasLab && !unlocked) {
      const note = document.createElement('div');
      note.className = 'research-req';
      note.textContent = 'Build a Research Lab first';
      card.appendChild(note);
    }

    container.appendChild(card);
  });
}

// ── Educational Sidebar ───────────────────────────────────────
function renderSidebar() {
  const body = CELESTIAL_BODIES[gameState.celestialBody];
  const factsEl = document.getElementById('facts-list');
  if (!factsEl) return;

  factsEl.innerHTML = '';
  body.facts.forEach(fact => {
    const li = document.createElement('li');
    li.textContent = fact;
    factsEl.appendChild(li);
  });

  const linksEl = document.getElementById('facts-links');
  if (linksEl) {
    linksEl.innerHTML = '';
    body.links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.text;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      linksEl.appendChild(a);
    });
  }

  const sidebarTitle = document.getElementById('sidebar-title');
  if (sidebarTitle) {
    sidebarTitle.textContent = `${body.emoji} About ${body.name}`;
  }
}

// ── Next Sol Button ───────────────────────────────────────────
function handleNextSol() {
  if (gameState.gameOver || gameState.gameWon) return;

  gameState.selectedBuilding = null;
  const result = advanceTurn();

  renderGameScreen();
  renderEventLog();

  if (result.eventResult) {
    showToast(
      `${result.eventResult.event.emoji} ${result.eventResult.event.name}: ${result.eventResult.message}`,
      result.eventResult.type
    );
  }

  if (result.outcome === 'win') {
    setTimeout(() => showModal('win'), 500);
  } else if (result.outcome === 'lose') {
    setTimeout(() => showModal('lose'), 500);
  }
}

// ── Modals ────────────────────────────────────────────────────
function showModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  if (!modal) return;

  if (type === 'win') {
    document.getElementById('win-stats').innerHTML = `
      <p>🏅 Colony: <strong>${gameState.colonyName}</strong></p>
      <p>🌍 Location: <strong>${CELESTIAL_BODIES[gameState.celestialBody].name}</strong></p>
      <p>👥 Final Population: <strong>${gameState.population}</strong></p>
      <p>📅 Sols Survived: <strong>${gameState.sol}</strong></p>
      <p>😊 Morale: <strong>${gameState.morale}%</strong></p>
    `;
  } else {
    const reasons = [];
    if (gameState.population <= 0) reasons.push('All colonists perished');
    ['oxygen', 'water', 'food'].forEach(res => {
      if (gameState.criticalTurns[res] >= 3) reasons.push(`${res} depleted for 3+ turns`);
    });
    document.getElementById('lose-reason').innerHTML = `
      <p>💀 <strong>Cause:</strong> ${reasons.join(' · ') || 'Unknown'}</p>
      <p>📅 Sols survived: <strong>${gameState.sol - 1}</strong></p>
      <p>👥 Final population: <strong>${gameState.population}</strong></p>
    `;
  }

  modal.classList.remove('hidden');
}

function hideModal(type) {
  const modal = document.getElementById(`${type}-modal`);
  if (modal) modal.classList.add('hidden');
}

function resetGame() {
  hideModal('win');
  hideModal('lose');
  gameState = null;
  selectedBody = null;
  document.getElementById('colony-name').value = '';
  document.querySelectorAll('.celestial-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('start-btn').disabled = true;
  showScreen(SCREEN_LANDING);
}

// ── Toast Notifications ───────────────────────────────────────
function showToast(message, type = 'neutral') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Sidebar Toggle ────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById('educational-sidebar');
  if (sidebar) sidebar.classList.toggle('collapsed');
  const btn = document.getElementById('sidebar-toggle');
  if (btn) btn.textContent = sidebar.classList.contains('collapsed') ? '📚 Show Facts' : '📚 Hide Facts';
}

// ── DOM Ready ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderLandingScreen();

  // Landing screen bindings
  document.getElementById('start-btn').addEventListener('click', startGame);
  document.getElementById('start-btn').disabled = true;
  document.getElementById('colony-name').addEventListener('keydown', e => {
    if (e.key === 'Enter') startGame();
  });

  // Game screen bindings
  const nextSolBtn = document.getElementById('next-sol-btn');
  if (nextSolBtn) nextSolBtn.addEventListener('click', handleNextSol);

  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) sidebarToggle.addEventListener('click', toggleSidebar);

  // Modal buttons
  const playAgainWin = document.getElementById('play-again-win');
  if (playAgainWin) playAgainWin.addEventListener('click', resetGame);
  const playAgainLose = document.getElementById('play-again-lose');
  if (playAgainLose) playAgainLose.addEventListener('click', resetGame);
});
