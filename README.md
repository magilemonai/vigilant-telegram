# The Drowned Meridian

**A Cartographic Horror** — a browser-based strategy game set on a dark Leaflet.js map of EMEA ports, where you sail between real-world harbors to reinforce ancient seals before a cosmic entity awakens beneath the ocean.

## Premise

Ancient seals bind a sleeping god beneath the trade routes of the Old World. Seven meridian anchors — hidden in ports from Reykjavik to Cape Town — keep *It* from waking.

The seals are failing. Eldritch corruption spreads through the ports. You are a cartographer of the **Meridian Society**, tasked with sailing between ports, investigating the corruption, and reinforcing the seals before the Drowned God rises.

But each seal you touch erodes your mind. Each turn, the corruption spreads. And *It* is dreaming of you.

## How to Play

**Open `index.html` in a browser.** No build tools, no server, no dependencies to install.

### Controls

1. **Choose a difficulty** on the title screen
2. **Click any port** to begin your voyage
3. **Sail** to connected ports by clicking them (routes follow real navigable sea lanes)
4. **Investigate** ports to trigger events — gain lore or lose sanity
5. **Reinforce seals** at the 7 Meridian Seal sites (gold sun markers)
6. **Rest** to recover sanity (costs a turn)
7. **Study Charts** to reveal nearby corruption levels
8. **Resupply** to replenish provisions

### Objectives

- **Win:** Reinforce all 7 Meridian Seals before going insane or the god wakes
- **Lose:** Sanity reaches 0, or the Drowned God reaches Awakening Stage 4

### Key Mechanics

- **Sanity** — Your mental health. Drops from events, travel fatigue, and seal reinforcement. At 0, you lose.
- **Supplies** — Consumed during travel. At 0, your crew starves (extra sanity loss per trip). Resupply at ports.
- **Wards** — Found through specific lore. Each ward reduces the next seal reinforcement cost by 5 sanity.
- **Corruption** — Spreads along sea routes each turn. Ports gain intensity (Tainted -> Corrupted -> Deeply Corrupted).
- **Awakening** — As corruption grows, the Drowned God stirs. Each stage makes the game harder.
- **Chokepoints** — Strategic ports (Gibraltar, Suez, Bosporus, Bab el-Mandeb, Cape of Good Hope) that the god targets first.

### Difficulty Modes

| Mode | Sanity | Corruption | Special |
|------|--------|------------|---------|
| Fair Winds | 120 | Half speed | - |
| Charted Waters | 100 | Normal | - |
| Storm Season | 80 | 25% faster | +5 seal cost |
| Blind Meridian | 70 | Normal | Fog of war |

## The World

69 real EMEA ports across 8 regions:

- **Northern Europe** — Reykjavik, Bergen, Oslo, Stockholm, Helsinki, Saint Petersburg, Copenhagen, Edinburgh
- **Western Europe** — London, Amsterdam, Rotterdam, Hamburg, Antwerp, Le Havre, Brest, Bilbao, Lisbon
- **Mediterranean** — Barcelona, Marseille, Genoa, Venice, Split, Naples, Valletta, Dubrovnik, Piraeus, Algiers, Tunis, Tangier, Tripoli (Lebanon), Alexandria
- **Black Sea** — Istanbul, Varna, Sevastopol, Odesa, Constanta, Trabzon, Batumi
- **Middle East** — Doha, Kuwait City, Bandar Abbas, Beirut, Haifa, Jeddah, Dubai, Muscat, Aden
- **East Africa** — Port Sudan, Djibouti, Mogadishu, Lamu, Mombasa, Dar es Salaam, Zanzibar, Beira, Maputo
- **West Africa** — Casablanca, Dakar, Abidjan, Accra, Lagos, Douala
- **Southern Africa** — Toamasina, Lobito, Luanda, Walvis Bay, Cape Town, Durban, Port Louis

All travel follows navigable waterways — no routes through landmass.

## The Meridian Society

A secret cartographic order that has maintained the seven seals for centuries. Each seal is an anchor point along a ley line — the Drowned Meridian — that converges beneath the Mediterranean. The Society's archives contain charts annotated with warnings that predate every known civilization.

## The Drowned God

An entity of incomprehensible scale sleeping beneath the ocean floor. It does not think. It does not plan. It *dreams* — and its dreams reshape reality. The corruption spreading through EMEA's ports is the god stirring in its sleep. At full awakening, the coastlines themselves will change.

## Features

- 69 real-world EMEA ports with eldritch lore
- Navigable sea-route graph with strategic chokepoints
- 15 corruption events, 5 seal events, 8 safe events, 12 global events
- Region-specific events (Norse draugr, Mediterranean oracles, Swahili warnings)
- 3 multi-part event chains (The Passenger, The Other Cartographer, The Signal)
- Drowned God AI antagonist that targets chokepoints and retaliates
- 4 difficulty modes including fog-of-war Nightmare mode
- Resource management (supplies, wards)
- Ship's Log sidebar tracking voyage, lore, and corruption history
- Save/load via localStorage with auto-resume
- Procedural audio (ocean drone, heartbeat, corruption stings, seal chimes)
- Advanced visual effects (tile distortion, text glitch, screen shake)
- Animated travel paths
- Mobile-responsive layout
- Keyboard-accessible event choices

## Tech Stack

- **Leaflet.js** — Interactive map rendering
- **CARTO** — Dark basemap tiles
- **Web Audio API** — Procedural sound generation
- **Vanilla JS** — No frameworks, no build tools
- **Google Fonts** — Cinzel (headings), Crimson Text (body)

## Credits

- Map tiles by [CARTO](https://carto.com/)
- Map library: [Leaflet](https://leafletjs.com/)
- Fonts: [Cinzel](https://fonts.google.com/specimen/Cinzel) and [Crimson Text](https://fonts.google.com/specimen/Crimson+Text)
- Game design, writing, and code: The Drowned Meridian Project

## License

MIT
