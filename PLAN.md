# The Drowned Meridian — Improvement Plan

Every file, every system, made better. Organized by file, then by priority.

---

## 1. `ports.js` — The World

### 1a. Fill geographic gaps
- Add ~15 more ports to underrepresented regions:
  - **Middle East**: Doha, Kuwait City, Bandar Abbas
  - **East Africa**: Beira, Lamu, Port Sudan
  - **Southern Africa**: Toamasina (Madagascar), Lobito (Angola)
  - **Black Sea**: Sevastopol, Trabzon, Varna
  - **Mediterranean**: Tangier, Split, Beirut's neighbor Tripoli (Lebanon)
- Add a `sealSite` in the Middle East (Muscat) and Southern Africa (Cape Town) — currently those regions have zero seals, making them feel like dead zones

### 1b. Port interconnections
- Add a `connections` array to each port listing nearby reachable ports (graph edges)
- Use these to constrain travel (no teleporting Reykjavik→Cape Town in one turn)
- Show connection lines on the map as faint trade routes
- Connections also serve as corruption spread paths (replaces the vague 15-degree proximity check)

### 1c. Port attributes for gameplay variety
- Add `resources` field: `"fuel" | "lore" | "sanctuary" | "trade"` — gives ports mechanical identity
- Add `difficulty` rating (1-5) affecting event severity
- Add `population` field influencing how fast corruption spreads through the port
- Add `historicalPeriod` tag for lore theming (ancient, medieval, colonial, modern)

### 1d. Dynamic port names
- When a port is corrupted, mutate its display name slightly: "Lisbon" → "Lis'bhon", "Istanbul" → "Ist'anbul", "Mombasa" → "Momb'asa"
- Store original and corrupted name variants in port data
- Adds creeping unease as the map itself becomes unreliable

---

## 2. `horror.js` — The Narrative Engine

### 2a. Expand event pools
- **Corruption events**: Expand from 7 → 15+ (current pool gets repetitive fast)
  - New themes: phantom cargo manifests, crew nightmares, harbor water turning viscous, clocks running backward, maps that bleed, lighthouse beams bending
- **Seal events**: Expand from 2 → 5+ with escalating difficulty
  - Add events where the seal fights back, where previous reinforcements are tested, where you must choose between two seals
- **Safe events**: Expand from 3 → 8+
  - Add: finding a Meridian Society safe house, a child who can see the corruption, a priest who knows the old wards, resupplying your ship
- **Global events**: Expand from 6 → 12+
  - Add: satellite imagery anomalies, mass bird die-offs, shipping lane closures, undersea cable failures, GPS glitches across EMEA

### 2b. Event chaining and memory
- Track which events the player has seen; never repeat within 5 turns
- Create 3-4 multi-part event chains that continue across ports:
  - "The Passenger" — a stowaway who appears at multiple ports
  - "The Other Cartographer" — a rival who is doing the opposite (breaking seals)
  - "The Signal" — a radio frequency that evolves each time you tune in
- Store chain progress in game state

### 2c. Region-specific event flavoring
- Tag events with compatible regions
- Mediterranean events reference classical mythology, Northern European events reference Norse myth, African events reference local folklore
- Some events only appear in specific regions, rewarding exploration

### 2d. Corruption mechanics overhaul
- Replace simple proximity spread with graph-based spread along `connections`
- Add "corruption intensity" (1-3) per port — ports can get worse, not just binary corrupt/clean
- Intensity affects event severity and sanity costs
- Heavily corrupted ports become impassable without a sanity check
- Allow players to "cleanse" (not just reinforce seals) corrupted ports at a sanity cost

### 2e. The Drowned God as an active antagonist
- Give the entity agency: it targets ports near the player, reacts to seal reinforcements
- After a seal is reinforced, the god retaliates (extra corruption spread, targeted event)
- Awakening stages have mechanical effects, not just flavor text:
  - Stage 1: corruption spreads 1 extra port/turn
  - Stage 2: safe events become rarer (50/50 instead of 70/30)
  - Stage 3: seal reinforcement costs +5 sanity
  - Stage 4: game over

---

## 3. `game.js` — The Engine

### 3a. Bug fixes
- Remove dead `playerMarker` variable (declared line 20, never used)
- Fix global event flow: after dismissing a global event, show the port event too
- Guard against null `currentPort` in loss screen text
- Clear old route lines after 10+ segments to prevent map clutter (or fade them over time)

### 3b. Travel system
- Implement connection-based travel (only sail to connected ports)
- Add travel cost: longer routes cost 1-3 sanity (fatigue at sea)
- Add travel events: 20% chance of encountering something mid-voyage (storms, ghost ships, becalmed waters)
- Animate the travel path (dotted line draws itself)
- Show an estimated arrival indicator and route preview before confirming travel

### 3c. Turn structure
- Formalize turn phases: **Travel → Arrival Event → Investigation (optional) → Corruption Spread → Global Check**
- Add a "Rest" action: skip investigating to recover +5 sanity (but lose a turn)
- Add a "Study Charts" action: spend a turn to reveal corruption levels of nearby ports
- Limit investigations to 1 per port visit (prevent event farming at safe ports)

### 3d. Resource and inventory system
- Add **Ship's Log**: collected lore fragments viewable in a sidebar panel
- Add **Supplies**: fuel/provisions that deplete with travel, replenished at trade ports
- Add **Wards**: single-use items found at certain ports that reduce sanity cost of seal reinforcement
- Keep it lightweight — 3-4 resource types max

### 3e. Difficulty scaling
- **Easy mode**: Start with 120 sanity, corruption spreads 50% slower, 8 seals (one bonus)
- **Normal mode**: Current settings
- **Hard mode**: Start with 80 sanity, corruption spreads 25% faster, seals cost +5 more sanity
- **Nightmare mode**: Fog of war — only visited ports and their neighbors are visible

### 3f. Save/load system
- Serialize game state to `localStorage` on each turn
- Auto-resume on page load if save exists
- Add "New Voyage" button to reset

### 3g. Win/loss polish
- Victory screen: show stats (turns taken, ports visited, sanity remaining, lore collected)
- Loss screen: show how far the player got, which seals were reinforced
- Add a "voyage log" replay showing the route on the map

---

## 4. `style.css` — The Atmosphere

### 4a. Visual feedback improvements
- Add screen shake (CSS animation) on major corruption events
- Pulse the HUD sanity counter when it drops below 25
- Add a vignette effect that intensifies with corruption (upgrade current overlay)
- Animate marker state transitions (smooth color shifts when ports become corrupted)

### 4b. Corruption visual escalation
- At awakening stage 2+: map tiles crack/distort (CSS transform: skew on random tiles)
- At awakening stage 3+: glitch effects on text (random letter displacement via CSS animation)
- Port names on corrupted markers should render in a distorted font or with strikethrough

### 4c. Responsive design
- Mobile layout: stack HUD vertically, make event panel full-width
- Touch-friendly markers (minimum 44px tap target on mobile)
- Pinch-to-zoom should work natively with Leaflet but test on mobile

### 4d. Ship's Log sidebar
- Slide-out panel from the left showing:
  - Collected lore fragments with flavor text
  - Visited ports timeline
  - Corruption spread history
  - Current objectives / seal status
- Toggle with a button in the HUD

### 4e. Map legend
- Small collapsible legend showing marker types:
  - Gold ring = seal site
  - Red pulse = corrupted
  - Green = sealed
  - Anchor = normal port
  - Gold glow = your location

### 4f. Typography
- Use CSS `text-shadow` effects that intensify as sanity drops
- Low-sanity text should slightly blur or shift
- Event text for eldritch content should use a slightly different font weight or color

---

## 5. `index.html` — The Structure

### 5a. New UI panels
- Add Ship's Log sidebar (`<div id="log-panel">`)
- Add mini-map or compass rose element
- Add settings panel (difficulty, sound toggle, save/load)
- Add a "Turn Summary" toast notification area

### 5b. Accessibility
- Add `aria-labels` to all interactive elements
- Ensure event panel is keyboard-navigable (tab between choices, Enter to select)
- Add `role="dialog"` to event panel
- Screen reader announcements for state changes

### 5c. Meta and SEO
- Add proper `<meta>` description, Open Graph tags, favicon
- Add a simple `manifest.json` for PWA-like behavior (offline play)

### 5d. Audio hooks
- Add `<audio>` elements for:
  - Ambient ocean/wind loop
  - Corruption sting (low drone on corruption events)
  - Seal reinforcement chime
  - Heartbeat at low sanity
- All muted by default with a sound toggle

---

## 6. `README.md` — The Documentation

- Game overview and premise
- How to play (controls, objectives, mechanics)
- Win/loss conditions explained
- Screenshot or GIF of gameplay
- Port and region list
- Lore primer (what is the Meridian Society, the Drowned God, the seals)
- Development setup (just open `index.html`)
- Credits (Leaflet, CARTO, fonts)
- License

---

## Implementation Order

**Phase 1 — Fix & Polish** (immediate)
1. Bug fixes in game.js (dead code, event flow, route clutter)
2. Event repetition prevention in horror.js
3. Dynamic corrupted port names in ports.js
4. CSS visual feedback (sanity pulse, screen shake, vignette)
5. Map legend

**Phase 2 — Deepen Gameplay** (core systems)
1. Port connections graph + connection-based travel
2. Travel events and sea hazards
3. Formalized turn structure with Rest/Study actions
4. Corruption intensity levels (1-3) per port
5. Drowned God as active antagonist with retaliation mechanics
6. Awakening stages with mechanical effects

**Phase 3 — Expand Content** (narrative)
1. Double all event pools (corruption, seal, safe, global)
2. Region-specific event variants
3. Multi-part event chains (The Passenger, The Other Cartographer, The Signal)
4. 15 new ports filling geographic gaps
5. Ship's Log sidebar with collected lore

**Phase 4 — Systems & Replayability**
1. Difficulty modes (Easy/Normal/Hard/Nightmare)
2. Resource system (supplies, wards)
3. Save/load via localStorage
4. Victory/loss stats screen
5. Accessibility improvements

**Phase 5 — Atmosphere**
1. Audio system (ambient, stings, heartbeat)
2. Advanced corruption visuals (tile distortion, text glitch)
3. Animated travel paths
4. Mobile-responsive layout
5. README documentation
