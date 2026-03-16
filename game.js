/**
 * Game Engine — The Drowned Meridian (Phase 5)
 *
 * Audio system, advanced corruption visuals, animated travel,
 * mobile-responsive, difficulty, resources, save/load.
 */

(function () {
  "use strict";

  // ─── DIFFICULTY PRESETS ─────────────────────────────────────
  const DIFFICULTY = {
    easy: {
      label: "Fair Winds",
      startSanity: 120,
      startSupplies: 14,
      corruptionSpeedMod: 0.5,     // corruption spreads half as often
      sealCostMod: 0,
      initialCorruption: 3,
      fogOfWar: false
    },
    normal: {
      label: "Charted Waters",
      startSanity: 100,
      startSupplies: 10,
      corruptionSpeedMod: 1.0,
      sealCostMod: 0,
      initialCorruption: 5,
      fogOfWar: false
    },
    hard: {
      label: "Storm Season",
      startSanity: 80,
      startSupplies: 8,
      corruptionSpeedMod: 1.25,
      sealCostMod: 5,
      initialCorruption: 7,
      fogOfWar: false
    },
    nightmare: {
      label: "Blind Meridian",
      startSanity: 70,
      startSupplies: 6,
      corruptionSpeedMod: 1.0,
      sealCostMod: 3,
      initialCorruption: 5,
      fogOfWar: true
    }
  };

  // ─── GAME STATE ──────────────────────────────────────────────
  const state = {
    difficulty: "normal",
    turn: 1,
    sanity: 100,
    supplies: 10,
    wards: 0,
    reinforcedSeals: [],
    corruptedPorts: {},     // portId → intensity (1-3), replaces flat array
    visitedPorts: [],
    currentPort: null,
    awakeningLevel: 0,      // 0-4, at 4 the god wakes
    loreFragments: [],
    recentEvents: [],
    investigatedThisTurn: false,
    gameOver: false
  };

  let map;
  let portMarkers = {};
  let connectionLines = [];
  let routeLines = [];
  let corruptionOverlay;

  // Ship's log entries
  const logEntries = {
    voyage: [],
    lore: [],
    corruption: []
  };

  // ─── HELPERS ────────────────────────────────────────────────
  function getDifficulty() {
    return DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
  }

  function isCorrupted(portId) {
    return portId in state.corruptedPorts;
  }

  function getCorruptionIntensity(portId) {
    return state.corruptedPorts[portId] || 0;
  }

  function corruptPort(portId, intensity) {
    if (state.reinforcedSeals.includes(portId)) return;
    const current = state.corruptedPorts[portId] || 0;
    state.corruptedPorts[portId] = Math.min(3, Math.max(current, intensity || 1));
  }

  function getCorruptedPortIds() {
    return Object.keys(state.corruptedPorts);
  }

  function getConnections(portId) {
    return SEA_ROUTES[portId] || [];
  }

  // ─── MAP INITIALIZATION ─────────────────────────────────────
  function initMap() {
    map = L.map("map", {
      center: [30, 20],
      zoom: 3,
      minZoom: 2,
      maxZoom: 8,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.control.attribution({ position: "bottomleft" })
      .addAttribution('Map: <a href="https://carto.com/">CARTO</a> | Game: The Drowned Meridian')
      .addTo(map);

    corruptionOverlay = document.createElement("div");
    corruptionOverlay.className = "corruption-overlay";
    document.body.appendChild(corruptionOverlay);
  }

  // ─── SEA ROUTE LINES ──────────────────────────────────────
  function renderConnections() {
    const drawn = new Set();
    PORTS.forEach(port => {
      const conns = getConnections(port.id);
      conns.forEach(targetId => {
        const key = [port.id, targetId].sort().join("-");
        if (drawn.has(key)) return;
        drawn.add(key);

        const target = PORTS.find(p => p.id === targetId);
        if (!target) return;

        const line = L.polyline(
          [[port.lat, port.lng], [target.lat, target.lng]],
          { color: "rgba(139,115,85,0.08)", weight: 0.8, dashArray: "3 6" }
        ).addTo(map);
        connectionLines.push(line);
      });
    });
  }

  // ─── PORT MARKERS ───────────────────────────────────────────
  function renderPorts() {
    PORTS.forEach(port => {
      const size = port.sealSite ? 28 : 20;
      const icon = L.divIcon({
        className: "port-marker",
        iconSize: [size, size],
        html: port.sealSite ? "&#x2609;" : "&#x2693;"
      });

      const marker = L.marker([port.lat, port.lng], { icon }).addTo(map);
      marker.on("click", () => onPortClick(port));
      marker.bindTooltip(port.name, {
        direction: "top",
        offset: [0, -12],
        className: "port-tooltip"
      });

      portMarkers[port.id] = marker;
    });
  }

  function updateMarkerStyles() {
    PORTS.forEach(port => {
      const marker = portMarkers[port.id];
      const el = marker.getElement();
      if (!el) return;

      el.classList.remove("corrupted", "corrupted-2", "corrupted-3", "sealed", "player-here");

      if (state.currentPort && state.currentPort.id === port.id) {
        el.classList.add("player-here");
      }
      if (isCorrupted(port.id)) {
        const intensity = getCorruptionIntensity(port.id);
        el.classList.add("corrupted");
        if (intensity >= 2) el.classList.add("corrupted-2");
        if (intensity >= 3) el.classList.add("corrupted-3");
      }
      if (state.reinforcedSeals.includes(port.id)) {
        el.classList.add("sealed");
      }

      marker.unbindTooltip();
      marker.bindTooltip(getDisplayName(port), {
        direction: "top",
        offset: [0, -12],
        className: "port-tooltip"
      });
    });
  }

  // ─── PORT DISPLAY NAME ─────────────────────────────────────
  function getDisplayName(port) {
    if (isCorrupted(port.id) && port.corruptedName) {
      return port.corruptedName;
    }
    return port.name;
  }

  // ─── PORT POPUP ─────────────────────────────────────────────
  function getPopupContent(port) {
    const corrupted = isCorrupted(port.id);
    const intensity = getCorruptionIntensity(port.id);
    const sealed = state.reinforcedSeals.includes(port.id);
    const isHere = state.currentPort && state.currentPort.id === port.id;
    const displayName = getDisplayName(port);
    const connected = state.currentPort ? getConnections(state.currentPort.id) : [];

    let statusTag = "";
    if (corrupted) {
      const label = intensity >= 3 ? "DEEPLY CORRUPTED" : intensity >= 2 ? "CORRUPTED" : "TAINTED";
      statusTag = ` <span style="color:#c44a4a;">[${label}]</span>`;
    }
    if (sealed) statusTag = ' <span style="color:#5ab87a;">[SEAL REINFORCED]</span>';

    let buttons = "";

    if (!state.currentPort) {
      // Pre-game: pick starting port
      buttons = `<button class="popup-btn" onclick="GAME.startAt('${port.id}')">Begin voyage here</button>`;
    } else if (isHere) {
      // At current port: investigate, rest, study, resupply
      if (!state.investigatedThisTurn) {
        buttons += `<button class="popup-btn" onclick="GAME.investigate('${port.id}')">Investigate</button> `;
      }
      const recovery = state.awakeningLevel >= 3 ? 4 : state.awakeningLevel >= 2 ? 6 : 8;
      buttons += `<button class="popup-btn" onclick="GAME.rest()">Rest (+${recovery} Sanity, end turn)</button> `;
      buttons += `<button class="popup-btn" onclick="GAME.studyCharts()">Study Charts</button> `;
      if (state.supplies < getDifficulty().startSupplies) {
        buttons += `<button class="popup-btn" onclick="GAME.resupply()">Resupply (+3, end turn)</button> `;
      }
    } else if (connected.includes(port.id)) {
      // Connected port: can sail
      const dist = getDistance(state.currentPort, port);
      buttons = `<button class="popup-btn" onclick="GAME.sailTo('${port.id}')">Sail here (~${dist} leagues)</button>`;
    } else {
      // Not connected
      buttons = `<span style="color:#6a5d4a;font-size:12px;font-style:italic;">No direct sea route from ${getDisplayName(state.currentPort)}</span>`;
    }

    return `
      <div class="popup-port-name">${displayName}${statusTag}</div>
      <div class="popup-port-region">${port.region} — ${port.country}</div>
      <div class="popup-port-desc">${port.desc}</div>
      ${port.sealSite ? '<div style="color:#c4a35a;font-size:12px;margin-bottom:6px;">&#x2609; MERIDIAN SEAL SITE</div>' : ""}
      ${buttons}
    `;
  }

  function onPortClick(port) {
    if (state.gameOver) return;
    const marker = portMarkers[port.id];
    marker.unbindPopup();
    marker.bindPopup(getPopupContent(port), { maxWidth: 320, className: "port-popup" }).openPopup();
  }

  // ─── DISTANCE / TRAVEL ─────────────────────────────────────
  function getDistance(a, b) {
    const dLat = b.lat - a.lat;
    const dLng = b.lng - a.lng;
    return Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 60);
  }

  function drawRoute(from, to) {
    const line = L.polyline(
      [[from.lat, from.lng], [to.lat, to.lng]],
      { color: "rgba(196,163,90,0.6)", dashArray: "12 6", weight: 2, className: "travel-path-animated" }
    ).addTo(map);
    routeLines.push(line);

    // Stop animation on older lines and fade them
    routeLines.forEach((rl, i) => {
      const age = routeLines.length - 1 - i;
      if (age > 0) {
        const el = rl.getElement && rl.getElement();
        if (el) el.classList.remove("travel-path-animated");
      }
      const opacity = Math.max(0.08, 0.5 - age * 0.06);
      rl.setStyle({ opacity, weight: age === 0 ? 2 : 1.5 });
    });

    while (routeLines.length > 20) {
      map.removeLayer(routeLines.shift());
    }
  }

  // ─── TURN STRUCTURE ────────────────────────────────────────
  // Phase: Travel → Travel Event → Arrival → Port Event → Corruption Spread → Global Check → Drowned God Retaliation

  function advanceTurn() {
    state.turn++;
    state.investigatedThisTurn = false;

    // Corruption spreads (scaled by difficulty)
    const diff = getDifficulty();
    const baseSpread = 1 + Math.floor(state.turn / 5);
    const awakeningBonus = state.awakeningLevel >= 1 ? state.awakeningLevel : 0;
    const spreadCount = Math.max(1, Math.round((baseSpread + awakeningBonus) * diff.corruptionSpeedMod));
    spreadCorruption(spreadCount);

    // Existing corruption intensifies
    intensifyCorruption();

    // Check awakening
    checkAwakening();

    // Drowned God retaliation
    drownedGodAction();

    // Update everything
    updateHUD();
    updateMarkerStyles();
    updateFogOfWar();
    updateCorruptionOverlay();
    updateSanityEffects();
    saveGame();
  }

  // ─── CORRUPTION SYSTEM ─────────────────────────────────────
  function spreadCorruption(count) {
    const corruptedIds = getCorruptedPortIds();
    const uncorrupted = PORTS.filter(p =>
      !isCorrupted(p.id) && !state.reinforcedSeals.includes(p.id)
    );
    if (uncorrupted.length === 0) return;

    const newCorruptions = [];
    const pool = [...uncorrupted];

    for (let i = 0; i < count && pool.length > 0; i++) {
      // Prefer ports connected to already-corrupted ones (graph-based spread)
      let candidates = pool.filter(p => {
        const conns = getConnections(p.id);
        return conns.some(cid => isCorrupted(cid));
      });

      if (candidates.length === 0) candidates = pool;

      const target = candidates[Math.floor(Math.random() * candidates.length)];
      corruptPort(target.id, 1);
      newCorruptions.push(target.id);
      pool.splice(pool.indexOf(target), 1);
    }

    if (newCorruptions.length > 0) {
      const names = newCorruptions.map(id => PORTS.find(p => p.id === id)?.name).filter(Boolean);
      setMessage(`Corruption spreads to: ${names.join(", ")}`);
      addCorruptionLog(`Corruption spreads to: ${names.join(", ")}.`);
      playCorruptionSting();
    }
  }

  function intensifyCorruption() {
    // Each turn, 20% chance for each corrupted port to intensify
    const ids = getCorruptedPortIds();
    ids.forEach(id => {
      if (state.corruptedPorts[id] < 3 && Math.random() < 0.2) {
        state.corruptedPorts[id]++;
      }
    });
  }

  // ─── DROWNED GOD ANTAGONIST ────────────────────────────────
  function drownedGodAction() {
    if (state.awakeningLevel < 1) return;

    // The god targets chokepoints and ports near the player
    if (state.awakeningLevel >= 2 && state.currentPort) {
      // Target a connected port of the player's current location
      const nearby = getConnections(state.currentPort.id).filter(
        id => !isCorrupted(id) && !state.reinforcedSeals.includes(id)
      );
      if (nearby.length > 0 && Math.random() < 0.3 * state.awakeningLevel) {
        const target = nearby[Math.floor(Math.random() * nearby.length)];
        corruptPort(target, 1);
        const port = PORTS.find(p => p.id === target);
        if (port) {
          setMessage(`The Drowned God stirs. ${port.name} darkens.`);
        }
      }
    }

    // Target chokepoints preferentially
    if (state.awakeningLevel >= 1) {
      const vulnerableChokepoints = CHOKEPOINTS.filter(
        id => !isCorrupted(id) && !state.reinforcedSeals.includes(id)
      );
      if (vulnerableChokepoints.length > 0 && Math.random() < 0.15 * state.awakeningLevel) {
        const target = vulnerableChokepoints[Math.floor(Math.random() * vulnerableChokepoints.length)];
        corruptPort(target, 2); // Chokepoints get hit harder
        const port = PORTS.find(p => p.id === target);
        if (port) {
          setMessage(`The Drowned God reaches for ${port.name}. A chokepoint falls.`);
        }
      }
    }
  }

  function drownedGodRetaliation() {
    // Called after a seal is reinforced — the god strikes back
    if (state.awakeningLevel < 1) return;

    const spreadCount = 1 + state.awakeningLevel;
    spreadCorruption(spreadCount);

    // Intensify corruption near the reinforced seal
    if (state.currentPort) {
      const nearby = getConnections(state.currentPort.id);
      nearby.forEach(id => {
        if (isCorrupted(id)) {
          state.corruptedPorts[id] = Math.min(3, (state.corruptedPorts[id] || 1) + 1);
        }
      });
    }

    screenShake(4 + state.awakeningLevel);
    setMessage(getMessage() + " The Drowned God retaliates — corruption surges.");
  }

  // ─── PLAYER ACTIONS ─────────────────────────────────────────
  function startAt(portId) {
    const port = PORTS.find(p => p.id === portId);
    if (!port) return;

    const diff = getDifficulty();
    state.sanity = diff.startSanity;
    state.supplies = diff.startSupplies;

    state.currentPort = port;
    state.visitedPorts.push(portId);

    // Initial corruption scaled by difficulty
    const uncorrupted = PORTS.filter(p => p.id !== portId);
    for (let i = 0; i < diff.initialCorruption && uncorrupted.length > 0; i++) {
      const idx = Math.floor(Math.random() * uncorrupted.length);
      corruptPort(uncorrupted[idx].id, 1);
      uncorrupted.splice(idx, 1);
    }

    updateMarkerStyles();
    updateFogOfWar();
    updateHUD();
    map.closePopup();
    map.flyTo([port.lat, port.lng], 5, { duration: 1.5 });

    setMessage(`Voyage begins at ${port.name}. The charts await.`);
    addVoyageLog(`Voyage begins at <span class="log-port-name">${port.name}</span>.`);
    saveGame();
    showEvent(HORROR.getEvent(port, buildHorrorState()));
  }

  function sailTo(portId) {
    if (state.gameOver) return;
    const port = PORTS.find(p => p.id === portId);
    if (!port || !state.currentPort) return;

    // Verify connection exists
    const connected = getConnections(state.currentPort.id);
    if (!connected.includes(portId)) {
      setMessage("No sea route connects these ports.");
      return;
    }

    const from = state.currentPort;
    drawRoute(from, port);

    // Travel fatigue: longer voyages cost sanity
    const dist = getDistance(from, port);
    const fatigue = dist > 600 ? 3 : dist > 300 ? 2 : 1;
    state.sanity = Math.max(0, state.sanity - fatigue);

    // Consume supplies for travel
    const supplyCost = dist > 600 ? 2 : 1;
    state.supplies = Math.max(0, state.supplies - supplyCost);
    if (state.supplies === 0) {
      state.sanity = Math.max(0, state.sanity - 3);
      setMessage("No supplies remain. Hunger gnaws at your crew. Sanity -3.");
    }

    state.currentPort = port;
    state.visitedPorts.push(portId);

    addVoyageLog(`Sailed from <span class="log-port-name">${from.name}</span> to <span class="log-port-name">${port.name}</span> (~${dist} leagues).`);

    map.closePopup();
    map.flyTo([port.lat, port.lng], 5, { duration: 1.5 });

    // Travel event (25% chance, higher through corrupted chokepoints)
    const throughCorruptedChokepoint = CHOKEPOINTS.includes(from.id) && isCorrupted(from.id);
    const travelEventChance = throughCorruptedChokepoint ? 0.5 : 0.25;

    if (Math.random() < travelEventChance) {
      // Show travel event first, then advance turn + port event
      const tEvent = TRAVEL_EVENTS[Math.floor(Math.random() * TRAVEL_EVENTS.length)];
      const resolvedEvent = {
        ...tEvent,
        text: tEvent.text,
        choices: tEvent.choices.map(c => ({
          ...c,
          _then: () => {
            advanceTurn();
            // Global event every 3 turns
            if (state.turn % 3 === 0) {
              showGlobalThenPortEvent(port);
            } else {
              setTimeout(() => showEvent(HORROR.getEvent(port, buildHorrorState())), 300);
            }
          }
        }))
      };
      setTimeout(() => showEvent(resolvedEvent), 500);
    } else {
      // No travel event — advance turn directly
      advanceTurn();
      if (state.turn % 3 === 0) {
        showGlobalThenPortEvent(port);
      } else {
        setTimeout(() => showEvent(HORROR.getEvent(port, buildHorrorState())), 500);
      }
    }
  }

  function investigate(portId) {
    if (state.gameOver || state.investigatedThisTurn) return;
    const port = PORTS.find(p => p.id === portId);
    if (!port) return;

    state.investigatedThisTurn = true;
    map.closePopup();
    showEvent(HORROR.getEvent(port, buildHorrorState()));
  }

  function rest() {
    if (state.gameOver) return;
    map.closePopup();

    // Rest recovers sanity but costs a turn
    const recovery = state.awakeningLevel >= 3 ? 4 : state.awakeningLevel >= 2 ? 6 : 8;
    state.sanity = Math.min(100, state.sanity + recovery);
    setMessage(`You rest at ${getDisplayName(state.currentPort)}. Sanity +${recovery}.`);

    advanceTurn();
    checkGameEnd();
    updateHUD();
    updateSanityEffects();
  }

  function studyCharts() {
    if (state.gameOver) return;
    map.closePopup();

    // Reveal corruption levels of connected ports
    const conns = getConnections(state.currentPort.id);
    const intel = conns.map(id => {
      const p = PORTS.find(pp => pp.id === id);
      if (!p) return null;
      if (isCorrupted(id)) {
        const i = getCorruptionIntensity(id);
        const label = i >= 3 ? "deeply corrupted" : i >= 2 ? "corrupted" : "tainted";
        return `${p.name}: ${label}`;
      }
      return `${p.name}: clear`;
    }).filter(Boolean);

    state.sanity = Math.max(0, state.sanity - 2);
    setMessage(`Charts studied. Nearby: ${intel.join(" | ")}`);

    // Small sanity cost, does NOT end turn
    updateHUD();
    updateSanityEffects();
  }

  // ─── RESUPPLY ────────────────────────────────────────────
  function resupply() {
    if (state.gameOver) return;
    map.closePopup();

    const gained = 3;
    state.supplies = Math.min(getDifficulty().startSupplies, state.supplies + gained);
    setMessage(`Supplies restocked at ${getDisplayName(state.currentPort)}. Supplies +${gained}.`);
    addVoyageLog(`Resupplied at <span class="log-port-name">${getDisplayName(state.currentPort)}</span>.`);

    advanceTurn();
    checkGameEnd();
    updateHUD();
    updateSanityEffects();
  }

  // ─── FOG OF WAR (Nightmare mode) ────────────────────────
  function updateFogOfWar() {
    const diff = getDifficulty();
    if (!diff.fogOfWar) return;

    // Reveal visited ports and their direct connections
    const revealed = new Set();
    state.visitedPorts.forEach(id => {
      revealed.add(id);
      getConnections(id).forEach(cid => revealed.add(cid));
    });

    PORTS.forEach(port => {
      const marker = portMarkers[port.id];
      const el = marker ? marker.getElement() : null;
      if (!el) return;
      if (revealed.has(port.id)) {
        el.classList.remove("fog-hidden");
      } else {
        el.classList.add("fog-hidden");
      }
    });
  }

  // ─── SAVE / LOAD ──────────────────────────────────────────
  const SAVE_KEY = "drowned_meridian_save";

  function saveGame() {
    const saveData = {
      state: {
        difficulty: state.difficulty,
        turn: state.turn,
        sanity: state.sanity,
        supplies: state.supplies,
        wards: state.wards,
        reinforcedSeals: state.reinforcedSeals,
        corruptedPorts: state.corruptedPorts,
        visitedPorts: state.visitedPorts,
        currentPortId: state.currentPort ? state.currentPort.id : null,
        awakeningLevel: state.awakeningLevel,
        loreFragments: state.loreFragments,
        recentEvents: state.recentEvents,
        investigatedThisTurn: state.investigatedThisTurn,
        gameOver: state.gameOver
      },
      logEntries: logEntries,
      version: 1
    };
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      // localStorage full or unavailable — silently fail
    }
  }

  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const saveData = JSON.parse(raw);
      if (!saveData || !saveData.state || !saveData.state.currentPortId) return false;

      const s = saveData.state;
      state.difficulty = s.difficulty || "normal";
      state.turn = s.turn;
      state.sanity = s.sanity;
      state.supplies = s.supplies !== undefined ? s.supplies : 10;
      state.wards = s.wards || 0;
      state.reinforcedSeals = s.reinforcedSeals || [];
      state.corruptedPorts = s.corruptedPorts || {};
      state.visitedPorts = s.visitedPorts || [];
      state.awakeningLevel = s.awakeningLevel || 0;
      state.loreFragments = s.loreFragments || [];
      state.recentEvents = s.recentEvents || [];
      state.investigatedThisTurn = s.investigatedThisTurn || false;
      state.gameOver = s.gameOver || false;

      const port = PORTS.find(p => p.id === s.currentPortId);
      state.currentPort = port || null;

      if (saveData.logEntries) {
        logEntries.voyage = saveData.logEntries.voyage || [];
        logEntries.lore = saveData.logEntries.lore || [];
        logEntries.corruption = saveData.logEntries.corruption || [];
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  function clearSave() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
  }

  function newVoyage() {
    clearSave();
    location.reload();
  }

  // ─── EVENT HELPERS ─────────────────────────────────────────
  function showGlobalThenPortEvent(port) {
    const globalEvt = HORROR.getGlobalEvent(state.recentEvents);
    spreadCorruption(globalEvt.corruption);
    updateMarkerStyles();

    setTimeout(() => {
      showEvent({
        title: globalEvt.title,
        text: globalEvt.text,
        choices: [{
          text: "Noted",
          effect: "nothing",
          value: 0,
          _then: () => setTimeout(() => showEvent(HORROR.getEvent(port, buildHorrorState())), 300)
        }]
      });
    }, 500);
  }

  function buildHorrorState() {
    // Bridge between game state and HORROR system expectations
    return {
      reinforcedSeals: state.reinforcedSeals,
      corruptedPorts: getCorruptedPortIds(),
      recentEvents: state.recentEvents,
      awakeningLevel: state.awakeningLevel,
      loreFragments: state.loreFragments
    };
  }

  // ─── EVENT SYSTEM ──────────────────────────────────────────
  function showEvent(event) {
    const panel = document.getElementById("event-panel");
    const title = document.getElementById("event-title");
    const text = document.getElementById("event-text");
    const choices = document.getElementById("event-choices");

    state.recentEvents.push(event.title);
    if (state.recentEvents.length > 5) state.recentEvents.shift();

    title.textContent = event.title;
    text.textContent = event.text;
    choices.innerHTML = "";

    event.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.setAttribute("role", "button");
      btn.setAttribute("aria-label", `Choice ${i + 1}: ${choice.text}`);
      btn.addEventListener("click", () => resolveChoice(choice));
      choices.appendChild(btn);
    });

    panel.classList.remove("hidden");

    // Focus first choice for keyboard navigation
    const firstBtn = choices.querySelector("button");
    if (firstBtn) setTimeout(() => firstBtn.focus(), 100);
  }

  function hideEvent() {
    document.getElementById("event-panel").classList.add("hidden");
  }

  function resolveChoice(choice) {
    hideEvent();

    switch (choice.effect) {
      case "sanity":
        // Awakening stage 3+: sanity losses are amplified
        let value = choice.value;
        if (value < 0 && state.awakeningLevel >= 3) {
          value = Math.floor(value * 1.3);
        }
        state.sanity = Math.max(0, Math.min(100, state.sanity + value));
        if (value < 0) {
          setMessage(`Your mind frays. Sanity ${value}.`);
        } else {
          setMessage(`A moment of peace. Sanity +${value}.`);
        }
        break;

      case "seal_reinforce": {
        // Awakening stage 3+: seal costs increase by 5, plus difficulty modifier
        const diff = getDifficulty();
        const extraCost = (state.awakeningLevel >= 3 ? 5 : 0) + diff.sealCostMod;
        const wardDiscount = state.wards > 0 ? 5 : 0;
        const totalCost = Math.max(1, choice.value + extraCost - wardDiscount);
        if (state.sanity >= totalCost) {
          state.sanity -= totalCost;
          const port = state.currentPort;
          if (port && port.sealSite && !state.reinforcedSeals.includes(port.id)) {
            if (wardDiscount > 0) state.wards--;
            state.reinforcedSeals.push(port.id);
            delete state.corruptedPorts[port.id];
            setMessage(`The seal at ${port.name} holds.${wardDiscount > 0 ? " A ward crumbles to dust." : ""} Seals reinforced: ${state.reinforcedSeals.length}/7.`);
            addSealLog(`Seal reinforced at <span class="log-port-name">${port.name}</span>. (${state.reinforcedSeals.length}/7)`);
            playSealChime();
            // Drowned God retaliates
            drownedGodRetaliation();
          }
        } else {
          setMessage(`You lack the mental fortitude${extraCost > 0 ? " (the god resists — cost increased)" : ""}. The seal remains cracked.`);
        }
        break;
      }

      case "corruption_spread":
        spreadCorruption(choice.value);
        setMessage("The corruption deepens.");
        break;

      case "corruption_local":
        if (state.currentPort && !isCorrupted(state.currentPort.id)) {
          corruptPort(state.currentPort.id, 1);
          setMessage(`${state.currentPort.name} falls to corruption.`);
        } else if (state.currentPort && isCorrupted(state.currentPort.id)) {
          state.corruptedPorts[state.currentPort.id] = Math.min(3, getCorruptionIntensity(state.currentPort.id) + 1);
          setMessage(`The corruption at ${state.currentPort.name} deepens.`);
        }
        break;

      case "nothing":
        break;
    }

    if (choice.bonus) {
      state.loreFragments.push(choice.bonus);
      setMessage(getMessage() + ` [Acquired: ${formatBonus(choice.bonus)}]`);
      addLoreLog(choice.bonus, state.currentPort ? state.currentPort.name : "Unknown");

      // Certain lore finds grant wards
      if (choice.bonus === "priestly_knowledge" || choice.bonus === "safehouse_cache" || choice.bonus === "warden_pact") {
        state.wards++;
        setMessage(getMessage() + " [+1 Ward]");
      }
    }

    if (choice.effect === "sanity" && choice.value <= -10) {
      screenShake(3);
    } else if (choice.effect === "seal_reinforce") {
      screenShake(5);
    }

    checkGameEnd();
    updateHUD();
    updateMarkerStyles();
    updateCorruptionOverlay();
    updateSanityEffects();

    if (typeof choice._then === "function") {
      choice._then();
    }
  }

  function formatBonus(bonus) {
    return bonus.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  // ─── AWAKENING & WIN/LOSS ──────────────────────────────────
  function checkAwakening() {
    const corruptionRatio = getCorruptedPortIds().length / PORTS.length;
    const sealsBroken = 7 - state.reinforcedSeals.length;
    const oldLevel = state.awakeningLevel;

    if (corruptionRatio > 0.75 && sealsBroken >= 5) {
      state.awakeningLevel = 4;
    } else if (corruptionRatio > 0.6) {
      state.awakeningLevel = Math.max(state.awakeningLevel, 3);
    } else if (corruptionRatio > 0.4) {
      state.awakeningLevel = Math.max(state.awakeningLevel, 2);
    } else if (corruptionRatio > 0.2) {
      state.awakeningLevel = Math.max(state.awakeningLevel, 1);
    }

    // Announce awakening level changes
    if (state.awakeningLevel > oldLevel && state.awakeningLevel < 4) {
      const stageText = HORROR.awakeningStages[state.awakeningLevel - 1];
      setTimeout(() => {
        showEvent({
          title: `AWAKENING — STAGE ${state.awakeningLevel}`,
          text: stageText + getAwakeningMechanicalDesc(state.awakeningLevel),
          choices: [{ text: "The meridian trembles.", effect: "nothing", value: 0 }]
        });
      }, 600);
    }
  }

  function getAwakeningMechanicalDesc(level) {
    switch (level) {
      case 1: return "\n\n[Corruption now spreads faster. The Drowned God targets chokepoints.]";
      case 2: return "\n\n[The god hunts you. Ports near your position are targeted. Safe events grow rare.]";
      case 3: return "\n\n[Sanity losses amplified. Seal reinforcement costs +5. Rest recovers less. The end draws near.]";
      default: return "";
    }
  }

  function buildEndStats() {
    const diff = getDifficulty();
    const uniquePorts = [...new Set(state.visitedPorts)].length;
    const corruptedCount = getCorruptedPortIds().length;
    return `\n\nDifficulty: ${diff.label}\nTurns: ${state.turn}\nSanity remaining: ${state.sanity}%\nSeals reinforced: ${state.reinforcedSeals.length}/7\nPorts corrupted: ${corruptedCount}/${PORTS.length}\nUnique ports visited: ${uniquePorts}\nLore fragments: ${state.loreFragments.length}\nSupplies remaining: ${state.supplies}\nWards remaining: ${state.wards}`;
  }

  function checkGameEnd() {
    if (state.sanity <= 0) {
      state.gameOver = true;
      clearSave();
      showEvent({
        title: "LOST TO THE DEEP",
        text: "Your mind unravels like wet rope. The charts dissolve into meaningless lines. You can no longer tell where the sea ends and the sky begins. You sit on the dock at " + (state.currentPort ? getDisplayName(state.currentPort) : "an unknown port") + " and watch the horizon eat itself. You are smiling. You do not know why." + buildEndStats(),
        choices: [
          { text: "The chart is complete.", effect: "nothing", value: 0, _then: showNewVoyageButton }
        ]
      });
      return;
    }

    if (state.awakeningLevel >= 4) {
      state.gameOver = true;
      clearSave();
      showEvent({
        title: "THE DROWNED GOD WAKES",
        text: HORROR.awakeningStages[3] + buildEndStats(),
        choices: [
          { text: "The meridian breaks.", effect: "nothing", value: 0, _then: showNewVoyageButton }
        ]
      });
      return;
    }

    if (state.reinforcedSeals.length >= 7) {
      state.gameOver = true;
      clearSave();
      showEvent({
        title: "THE MERIDIAN HOLDS",
        text: "Seven seals. Seven anchors along the drowned meridian. Each one cost you a piece of your mind, but the line holds. The Drowned God turns in its sleep but does not wake. The charts are true — for now. You have bought the world another age of ignorance. You hope it is enough." + buildEndStats(),
        choices: [
          { text: "Fold the charts.", effect: "nothing", value: 0, _then: showNewVoyageButton }
        ]
      });
      return;
    }
  }

  function showNewVoyageButton() {
    const panel = document.getElementById("event-panel");
    if (panel.classList.contains("hidden")) return;
    const choices = document.getElementById("event-choices");
    const btn = document.createElement("button");
    btn.className = "new-voyage-btn";
    btn.textContent = "NEW VOYAGE";
    btn.addEventListener("click", newVoyage);
    choices.appendChild(btn);
  }

  // ─── HUD ───────────────────────────────────────────────────
  function updateHUD() {
    document.getElementById("sanity").textContent = state.sanity;
    document.getElementById("seals").textContent = 7 - state.reinforcedSeals.length;
    document.getElementById("turn").textContent = state.turn;
    document.getElementById("supplies").textContent = state.supplies;
    document.getElementById("wards").textContent = state.wards;

    // Awakening indicator
    const awakeEl = document.getElementById("awakening");
    if (awakeEl) {
      awakeEl.textContent = state.awakeningLevel;
      awakeEl.parentElement.style.color =
        state.awakeningLevel >= 3 ? "#c44a4a" :
        state.awakeningLevel >= 2 ? "#cc8844" :
        state.awakeningLevel >= 1 ? "#9a6b4e" : "#6a5d4a";
    }

    const sanityEl = document.getElementById("sanity").parentElement;
    if (state.sanity <= 25) {
      sanityEl.style.color = "#c44a4a";
    } else if (state.sanity <= 50) {
      sanityEl.style.color = "#cc8844";
    } else {
      sanityEl.style.color = "#9a8b6e";
    }
  }

  function setMessage(msg) {
    document.getElementById("hud-message").textContent = msg;
  }

  function getMessage() {
    return document.getElementById("hud-message").textContent;
  }

  function updateCorruptionOverlay() {
    const ratio = getCorruptedPortIds().length / PORTS.length;
    corruptionOverlay.style.opacity = Math.min(ratio * 0.8, 0.6);

    const tiles = document.querySelectorAll(".leaflet-tile");
    const hue = 200 + ratio * 60;
    tiles.forEach(t => {
      t.style.filter = `saturate(${0.3 - ratio * 0.2}) brightness(${0.6 - ratio * 0.15}) sepia(${0.3 + ratio * 0.2}) hue-rotate(${hue}deg)`;
    });
  }

  // ─── AUDIO SYSTEM ────────────────────────────────────────
  const audio = {
    ctx: null,
    enabled: false,
    ambientOsc: null,
    ambientGain: null,
    heartbeatInterval: null
  };

  function initAudio() {
    const toggle = document.getElementById("sound-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
      if (!audio.ctx) {
        try {
          audio.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) { return; }
      }

      audio.enabled = !audio.enabled;
      toggle.textContent = audio.enabled ? "\u{1F50A}" : "\u{1F507}";
      toggle.classList.toggle("sound-on", audio.enabled);

      if (audio.enabled) {
        startAmbient();
      } else {
        stopAmbient();
        stopHeartbeat();
      }
    });
  }

  function startAmbient() {
    if (!audio.ctx || audio.ambientOsc) return;

    // Deep ocean drone — layered oscillators
    const ctx = audio.ctx;
    audio.ambientGain = ctx.createGain();
    audio.ambientGain.gain.value = 0;
    audio.ambientGain.connect(ctx.destination);

    // Base drone
    audio.ambientOsc = ctx.createOscillator();
    audio.ambientOsc.type = "sine";
    audio.ambientOsc.frequency.value = 55; // Low A
    audio.ambientOsc.connect(audio.ambientGain);
    audio.ambientOsc.start();

    // Sub-harmonic
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 27.5;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.4;
    sub.connect(subGain);
    subGain.connect(audio.ambientGain);
    sub.start();
    audio._subOsc = sub;
    audio._subGain = subGain;

    // Fade in
    audio.ambientGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 2);
  }

  function stopAmbient() {
    if (audio.ambientOsc) {
      try { audio.ambientOsc.stop(); } catch (e) {}
      audio.ambientOsc = null;
    }
    if (audio._subOsc) {
      try { audio._subOsc.stop(); } catch (e) {}
      audio._subOsc = null;
    }
    audio.ambientGain = null;
  }

  function updateAmbientForState() {
    if (!audio.enabled || !audio.ctx || !audio.ambientOsc) return;
    const ctx = audio.ctx;
    const ratio = getCorruptedPortIds().length / PORTS.length;

    // Shift frequency darker with corruption
    audio.ambientOsc.frequency.linearRampToValueAtTime(
      55 - ratio * 20, ctx.currentTime + 1
    );

    // Get louder with corruption
    if (audio.ambientGain) {
      audio.ambientGain.gain.linearRampToValueAtTime(
        0.06 + ratio * 0.06, ctx.currentTime + 1
      );
    }

    // Heartbeat at low sanity
    if (state.sanity <= 30 && !audio.heartbeatInterval) {
      startHeartbeat();
    } else if (state.sanity > 30 && audio.heartbeatInterval) {
      stopHeartbeat();
    }
  }

  function startHeartbeat() {
    if (!audio.ctx || audio.heartbeatInterval) return;
    const bpm = state.sanity <= 15 ? 100 : 70;
    const interval = 60000 / bpm;

    audio.heartbeatInterval = setInterval(() => {
      if (!audio.enabled || !audio.ctx) return;
      playHeartbeatPulse();
    }, interval);
  }

  function stopHeartbeat() {
    if (audio.heartbeatInterval) {
      clearInterval(audio.heartbeatInterval);
      audio.heartbeatInterval = null;
    }
  }

  function playHeartbeatPulse() {
    if (!audio.ctx) return;
    const ctx = audio.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 40;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const t = ctx.currentTime;
    // Lub
    gain.gain.linearRampToValueAtTime(0.12, t + 0.05);
    gain.gain.linearRampToValueAtTime(0, t + 0.15);
    // Dub
    gain.gain.linearRampToValueAtTime(0.08, t + 0.25);
    gain.gain.linearRampToValueAtTime(0, t + 0.4);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  function playCorruptionSting() {
    if (!audio.enabled || !audio.ctx) return;
    const ctx = audio.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 80;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(ctx.destination);

    const t = ctx.currentTime;
    osc.frequency.linearRampToValueAtTime(40, t + 0.8);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.05);
    gain.gain.linearRampToValueAtTime(0, t + 0.8);

    osc.start(t);
    osc.stop(t + 1);
  }

  function playSealChime() {
    if (!audio.enabled || !audio.ctx) return;
    const ctx = audio.ctx;
    const freqs = [523, 659, 784]; // C5, E5, G5

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(ctx.destination);

      const t = ctx.currentTime + i * 0.15;
      gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gain.gain.linearRampToValueAtTime(0, t + 0.6);

      osc.start(t);
      osc.stop(t + 0.7);
    });
  }

  // ─── VISUAL EFFECTS ────────────────────────────────────────
  function screenShake(intensity) {
    const mapEl = document.getElementById("map");
    mapEl.classList.add("screen-shake");
    mapEl.style.setProperty("--shake-intensity", intensity + "px");
    setTimeout(() => mapEl.classList.remove("screen-shake"), 400);
  }

  function updateSanityEffects() {
    const body = document.body;
    body.classList.remove("sanity-low", "sanity-critical", "awakening-2", "awakening-3");
    if (state.sanity <= 15) {
      body.classList.add("sanity-critical");
    } else if (state.sanity <= 35) {
      body.classList.add("sanity-low");
    }
    if (state.awakeningLevel >= 3) {
      body.classList.add("awakening-3");
    } else if (state.awakeningLevel >= 2) {
      body.classList.add("awakening-2");
    }
    updateAmbientForState();
  }

  // ─── SHIP'S LOG ──────────────────────────────────────────
  function addLogEntry(type, text, cssClass) {
    const entry = { turn: state.turn, text, cssClass: cssClass || "" };
    logEntries[type].push(entry);
    renderLog();
  }

  function addVoyageLog(text) {
    addLogEntry("voyage", text);
  }

  function addCorruptionLog(text) {
    addLogEntry("corruption", text, "log-corruption-entry");
  }

  function addSealLog(text) {
    addLogEntry("voyage", text, "log-seal-entry");
  }

  function addLoreLog(bonusName, portName) {
    logEntries.lore.push({
      name: formatBonus(bonusName),
      port: portName,
      turn: state.turn
    });
    renderLog();
  }

  function renderLog() {
    const voyageEl = document.getElementById("log-voyage");
    const loreEl = document.getElementById("log-lore");
    const corruptionEl = document.getElementById("log-corruption");
    if (!voyageEl) return;

    if (logEntries.voyage.length === 0) {
      voyageEl.innerHTML = '<div class="log-empty">No entries yet. Begin your voyage.</div>';
    } else {
      voyageEl.innerHTML = logEntries.voyage.slice().reverse().map(e =>
        `<div class="log-entry ${e.cssClass}"><div class="log-turn">TURN ${e.turn}</div>${e.text}</div>`
      ).join("");
    }

    if (logEntries.lore.length === 0) {
      loreEl.innerHTML = '<div class="log-empty">No lore fragments collected.</div>';
    } else {
      loreEl.innerHTML = logEntries.lore.slice().reverse().map(e =>
        `<div class="log-lore-item"><div class="lore-name">${e.name}</div><div class="lore-port">Collected at ${e.port} — Turn ${e.turn}</div></div>`
      ).join("");
    }

    if (logEntries.corruption.length === 0) {
      corruptionEl.innerHTML = '<div class="log-empty">No corruption events recorded.</div>';
    } else {
      corruptionEl.innerHTML = logEntries.corruption.slice().reverse().map(e =>
        `<div class="log-entry ${e.cssClass}"><div class="log-turn">TURN ${e.turn}</div>${e.text}</div>`
      ).join("");
    }
  }

  function initShipsLog() {
    const toggle = document.getElementById("log-toggle");
    const log = document.getElementById("ships-log");
    const close = document.getElementById("log-close");
    const tabs = document.querySelectorAll(".log-tab");

    if (!toggle || !log) return;

    toggle.addEventListener("click", () => {
      log.classList.toggle("hidden");
    });

    close.addEventListener("click", () => {
      log.classList.add("hidden");
    });

    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        document.querySelectorAll(".log-section").forEach(s => s.classList.remove("active"));
        document.getElementById("log-" + tab.dataset.tab).classList.add("active");
      });
    });

    renderLog();
  }

  // ─── MAP LEGEND ───────────────────────────────────────────
  function initLegend() {
    const legend = L.control({ position: "bottomleft" });
    legend.onAdd = function () {
      const div = L.DomUtil.create("div", "map-legend");
      div.innerHTML = `
        <div class="legend-title">CHART KEY</div>
        <div class="legend-item"><span class="legend-icon seal-icon">&#x2609;</span> Meridian Seal</div>
        <div class="legend-item"><span class="legend-icon port-icon">&#x2693;</span> Port of Call</div>
        <div class="legend-item"><span class="legend-icon corrupted-icon">&#x2693;</span> Corrupted</div>
        <div class="legend-item"><span class="legend-icon sealed-icon">&#x2609;</span> Seal Reinforced</div>
        <div class="legend-item"><span class="legend-icon player-icon">&#x25C9;</span> Your Location</div>
        <div class="legend-item" style="margin-top:4px;font-size:11px;color:#6a5d4a;">─ ─ Sea Routes</div>
      `;
      return div;
    };
    legend.addTo(map);
  }

  // ─── INTRO ─────────────────────────────────────────────────
  function initIntro() {
    // Difficulty selection
    const diffBtns = document.querySelectorAll(".diff-btn");
    diffBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        diffBtns.forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.difficulty = btn.dataset.diff;
      });
    });

    document.getElementById("start-btn").addEventListener("click", () => {
      const overlay = document.getElementById("intro-overlay");
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 1200);
      setMessage("Click any port to begin your voyage.");
    });
  }

  function resumeFromSave() {
    // Skip intro, set up map state
    const overlay = document.getElementById("intro-overlay");
    if (overlay) overlay.remove();

    updateMarkerStyles();
    updateFogOfWar();
    updateHUD();
    updateCorruptionOverlay();
    updateSanityEffects();
    renderLog();

    if (state.currentPort) {
      map.setView([state.currentPort.lat, state.currentPort.lng], 5);
    }

    setMessage(`Voyage resumed. Turn ${state.turn}. ${getDisplayName(state.currentPort)}.`);

    if (state.gameOver) {
      showNewVoyageButton();
    }
  }

  // ─── ACCESSIBILITY ──────────────────────────────────────────
  function initAccessibility() {
    const panel = document.getElementById("event-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Event");
    panel.setAttribute("aria-live", "polite");

    const hud = document.getElementById("hud");
    hud.setAttribute("role", "status");
    hud.setAttribute("aria-live", "polite");
    hud.setAttribute("aria-label", "Game status");

    document.getElementById("log-toggle").setAttribute("aria-label", "Open ship's log");
    document.getElementById("log-close").setAttribute("aria-label", "Close ship's log");
  }

  // ─── BOOT ──────────────────────────────────────────────────
  function init() {
    initMap();
    renderConnections();
    renderPorts();
    initLegend();
    initShipsLog();
    initAudio();
    initAccessibility();

    // Check for saved game
    if (loadGame()) {
      resumeFromSave();
    } else {
      initIntro();
      updateHUD();
    }
  }

  // Expose public API
  window.GAME = { sailTo, startAt, investigate, rest, studyCharts, resupply, newVoyage };

  document.addEventListener("DOMContentLoaded", init);
})();
