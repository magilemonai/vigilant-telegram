/**
 * Game Engine — The Drowned Meridian (Phase 2)
 *
 * Connection-based sea travel, formalized turn structure,
 * corruption intensity, Drowned God antagonist, awakening effects.
 */

(function () {
  "use strict";

  // ─── GAME STATE ──────────────────────────────────────────────
  const state = {
    turn: 1,
    sanity: 100,
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

  // ─── HELPERS ────────────────────────────────────────────────
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
      // At current port: investigate, rest, study
      if (!state.investigatedThisTurn) {
        buttons += `<button class="popup-btn" onclick="GAME.investigate('${port.id}')">Investigate</button> `;
      }
      buttons += `<button class="popup-btn" onclick="GAME.rest()">Rest (+8 Sanity, end turn)</button> `;
      buttons += `<button class="popup-btn" onclick="GAME.studyCharts()">Study Charts (reveal nearby corruption)</button>`;
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
      { color: "rgba(196,163,90,0.5)", dashArray: "6 4", weight: 1.5 }
    ).addTo(map);
    routeLines.push(line);

    routeLines.forEach((rl, i) => {
      const age = routeLines.length - 1 - i;
      const opacity = Math.max(0.08, 0.5 - age * 0.06);
      rl.setStyle({ opacity });
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

    // Corruption spreads
    const baseSpread = 1 + Math.floor(state.turn / 5);
    const awakeningBonus = state.awakeningLevel >= 1 ? state.awakeningLevel : 0;
    const spreadCount = baseSpread + awakeningBonus;
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
    updateCorruptionOverlay();
    updateSanityEffects();
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

    state.currentPort = port;
    state.visitedPorts.push(portId);

    // Initial corruption: 5 random ports at intensity 1
    const uncorrupted = PORTS.filter(p => p.id !== portId);
    for (let i = 0; i < 5 && uncorrupted.length > 0; i++) {
      const idx = Math.floor(Math.random() * uncorrupted.length);
      corruptPort(uncorrupted[idx].id, 1);
      uncorrupted.splice(idx, 1);
    }

    updateMarkerStyles();
    updateHUD();
    map.closePopup();
    map.flyTo([port.lat, port.lng], 5, { duration: 1.5 });

    setMessage(`Voyage begins at ${port.name}. The charts await.`);
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

    state.currentPort = port;
    state.visitedPorts.push(portId);

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
      awakeningLevel: state.awakeningLevel
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

    event.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice.text;
      btn.addEventListener("click", () => resolveChoice(choice));
      choices.appendChild(btn);
    });

    panel.classList.remove("hidden");
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
        // Awakening stage 3+: seal costs increase by 5
        const extraCost = state.awakeningLevel >= 3 ? 5 : 0;
        const totalCost = choice.value + extraCost;
        if (state.sanity >= totalCost) {
          state.sanity -= totalCost;
          const port = state.currentPort;
          if (port && port.sealSite && !state.reinforcedSeals.includes(port.id)) {
            state.reinforcedSeals.push(port.id);
            delete state.corruptedPorts[port.id];
            setMessage(`The seal at ${port.name} holds. Seals reinforced: ${state.reinforcedSeals.length}/7.`);
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

  function checkGameEnd() {
    if (state.sanity <= 0) {
      state.gameOver = true;
      showEvent({
        title: "LOST TO THE DEEP",
        text: "Your mind unravels like wet rope. The charts dissolve into meaningless lines. You can no longer tell where the sea ends and the sky begins. You sit on the dock at " + (state.currentPort ? getDisplayName(state.currentPort) : "an unknown port") + " and watch the horizon eat itself. You are smiling. You do not know why.",
        choices: [{ text: "The chart is complete.", effect: "nothing", value: 0 }]
      });
      return;
    }

    if (state.awakeningLevel >= 4) {
      state.gameOver = true;
      showEvent({
        title: "THE DROWNED GOD WAKES",
        text: HORROR.awakeningStages[3],
        choices: [{ text: "The meridian breaks.", effect: "nothing", value: 0 }]
      });
      return;
    }

    if (state.reinforcedSeals.length >= 7) {
      state.gameOver = true;
      const stats = `Turns: ${state.turn} | Sanity remaining: ${state.sanity}% | Lore fragments: ${state.loreFragments.length} | Ports visited: ${state.visitedPorts.length}`;
      showEvent({
        title: "THE MERIDIAN HOLDS",
        text: "Seven seals. Seven anchors along the drowned meridian. Each one cost you a piece of your mind, but the line holds. The Drowned God turns in its sleep but does not wake. The charts are true — for now. You have bought the world another age of ignorance. You hope it is enough.\n\n" + stats,
        choices: [{ text: "Fold the charts.", effect: "nothing", value: 0 }]
      });
      return;
    }
  }

  // ─── HUD ───────────────────────────────────────────────────
  function updateHUD() {
    document.getElementById("sanity").textContent = state.sanity;
    document.getElementById("seals").textContent = 7 - state.reinforcedSeals.length;
    document.getElementById("turn").textContent = state.turn;

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

  // ─── VISUAL EFFECTS ────────────────────────────────────────
  function screenShake(intensity) {
    const mapEl = document.getElementById("map");
    mapEl.classList.add("screen-shake");
    mapEl.style.setProperty("--shake-intensity", intensity + "px");
    setTimeout(() => mapEl.classList.remove("screen-shake"), 400);
  }

  function updateSanityEffects() {
    const body = document.body;
    body.classList.remove("sanity-low", "sanity-critical");
    if (state.sanity <= 15) {
      body.classList.add("sanity-critical");
    } else if (state.sanity <= 35) {
      body.classList.add("sanity-low");
    }
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
    document.getElementById("start-btn").addEventListener("click", () => {
      const overlay = document.getElementById("intro-overlay");
      overlay.classList.add("fade-out");
      setTimeout(() => overlay.remove(), 1200);
      setMessage("Click any port to begin your voyage.");
    });
  }

  // ─── BOOT ──────────────────────────────────────────────────
  function init() {
    initMap();
    renderConnections();
    renderPorts();
    initLegend();
    initIntro();
    updateHUD();
  }

  // Expose public API
  window.GAME = { sailTo, startAt, investigate, rest, studyCharts };

  document.addEventListener("DOMContentLoaded", init);
})();
