# Celestial Frontier: Forge Your Colony Among the Stars 🚀🌌

> **Challenger Center Space Challenge — Interactive Space Colony Builder**

An immersive, browser-based space colony builder where players select a celestial body, construct buildings, manage critical resources, and grow a sustainable colony. Built with pure HTML, CSS, and JavaScript — no dependencies required.

---

## 🎮 How to Play

1. **Open `index.html`** in any modern web browser.
2. **Name your colony** and **select a celestial destination**:
   - 🔴 **Mars** — Moderate difficulty, thin atmosphere, polar ice
   - 🌑 **The Moon** — Hard difficulty, no atmosphere, craters full of ice
   - 🧊 **Europa** — Expert difficulty, subsurface ocean, extreme cold
   - 🌫️ **Titan** — Expert difficulty, thick nitrogen atmosphere, methane lakes
3. Click **🚀 Launch Colony** to begin.
4. **Build structures** by clicking a building card on the left panel, then clicking an empty tile on the colony grid.
5. Click **⏭️ Next Sol** to advance time — resources are produced/consumed, population may grow, and random events can occur.
6. **Research upgrades** in the Research panel by building Research Labs and accumulating points.
7. Reach a **population of 100** with positive morale and stable resources to **win**!
8. Avoid running out of critical resources (oxygen, water, food) for 3+ consecutive turns.

### Building Reference

| Building | Cost | Effect |
|----------|------|--------|
| 🏠 Habitat Module | 50 minerals + 20 energy | +10 population cap, consumes O₂/water/food/energy |
| 🌱 Greenhouse | 60 minerals + 30 energy | Produces food, consumes water & energy |
| ⚡ Solar Array | 40 minerals | Produces energy (varies by location) |
| 💧 Water Extractor | 50 minerals + 20 energy | Produces water (varies by location) |
| 🫁 Oxygen Generator | 45 minerals + 25 energy | Produces oxygen, consumes energy |
| ⛏️ Mining Facility | 40 minerals + 15 energy | Produces minerals |
| 🔬 Research Lab | 80 minerals + 40 energy | Generates research points each turn |
| 🛡️ Shield Generator | 70 minerals + 35 energy | Reduces chance of harmful random events |

---

## 🏆 Win / Lose Conditions

- **Win**: Reach 100 colonists with morale ≥ 50% and no critical resource at zero.
- **Lose**: Population drops to 0, OR any critical resource (oxygen, water, food) hits 0 for 3 consecutive turns.

---

## 🌌 Random Events

Space is unpredictable! Every Sol has a chance of triggering an event:

| Event | Effect |
|-------|--------|
| ☄️ Meteor Shower | Damages a random building (offline 2 turns) |
| 🌡️ Solar Flare | Reduces energy |
| 🧑‍🚀 New Settlers | Population boost |
| 🔬 Scientific Discovery | Bonus resources + morale |
| 🦠 Equipment Malfunction | A building goes offline for 1 turn |
| 🌊 Ice Geyser (Europa) | Bonus water |
| 🏜️ Dust Storm (Mars) | Reduces solar energy |
| 🌧️ Methane Rain (Titan) | Bonus energy from fuel harvest |
| ❄️ Crater Ice (Moon) | Bonus water deposit found |
| ⚛️ Helium-3 (Moon) | Large energy bonus |

Shield Generators reduce event probability by 25% each.

---

## 🔭 Research Upgrades

Build Research Labs to earn research points and unlock upgrades:

- ☀️ **Advanced Solar Panels** — +50% Solar Array output
- 🌿 **Advanced Hydroponics** — +60% Greenhouse food output
- 🧱 **Thermal Insulation** — −20% energy consumption
- 🌍 **Terraforming Basics** — +15 permanent morale bonus
- ♻️ **Water Recycling** — −30% water consumption
- ⚛️ **Compact Nuclear Reactor** — +30 energy per turn (flat)
- 💨 **Atmospheric Processing** — +10 oxygen per turn (flat)
- 🤖 **Automated Mining Drones** — +70% Mining Facility output

---

## 📚 Educational Value

Celestial Frontier covers real STEM concepts:

- **Resource Management** — balancing oxygen, water, energy, food, and minerals mirrors real life-support engineering challenges faced by NASA and ESA mission planners.
- **Environmental Science** — each celestial body has authentic environmental modifiers based on real scientific data (atmospheric pressure, solar irradiance, temperature ranges).
- **Space Engineering** — building types and their resource costs/outputs are grounded in actual proposed colony technologies (MOXIE oxygen extraction, regolith mining, hydroponics).
- **Systems Thinking** — players must manage interdependent systems where a failure in one (e.g. energy) cascades through others.
- **Astronomy** — educational sidebar provides 10 real scientific facts about each destination, with links to NASA and ESA resources.
- **Sustainability** — the game rewards long-term planning and penalises resource overconsumption — a direct analogy to Earth's sustainability challenges.

### Celestial Bodies — Real Science

| Body | Key Facts |
|------|-----------|
| 🔴 Mars | Olympus Mons, polar ice caps, 24h 37m Sol, MOXIE oxygen experiment |
| 🌑 Moon | Permanently shadowed crater ice, Helium-3 deposits, Artemis program |
| 🧊 Europa | 2× Earth's ocean water under ice, possible life, Europa Clipper mission |
| 🌫️ Titan | Methane lakes, dense atmosphere provides radiation shielding, Dragonfly mission |

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure, no frameworks
- **CSS3** — custom properties, grid/flexbox layout, keyframe animations (twinkling stars, nebula drift, glowing effects)
- **Vanilla JavaScript (ES6+)** — modular files, no build step required
- **Google Fonts** — Orbitron (headers), Exo 2 (body text)

### File Structure

```
index.html        — Main game page with all HTML structure
css/style.css     — All styling, animations, space theme
js/game.js        — Core game logic, state management, turn system, UI rendering
js/buildings.js   — Building definitions, costs, and effects
js/events.js      — Random event system with location-specific events
js/data.js        — Celestial body data, scientific facts, research tree
README.md         — This file
```

---

## 🚀 Running the Game

No server, build tool, or dependency installation needed:

```bash
# Just open the file directly in your browser:
open index.html
# or double-click index.html in your file manager
```

Or serve locally with any static server:
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

---

## 🌠 Credits

- Built for the **Challenger Center Space Challenge**
- Scientific facts sourced from NASA, ESA, and JPL
- Inspired by the Challenger Center's mission to inspire the next generation of space explorers

> *"The sky is not the limit — it's just the beginning."*

---

## 📄 License

MIT License — free to use, modify, and distribute.

