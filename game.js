/**
 * Game Engine — The Drowned Meridian
 *
 * Manages the Leaflet map, player state, turn logic,
 * corruption spread, and event resolution.
 */

(function () {
  "use strict";

  // ─── GAME STATE ──────────────────────────────────────────────
  const state = {
    turn: 1,
    sanity: 100,
    sealsIntact: 7,
    reinforcedSeals: [],
    corruptedPorts: [],
    visitedPorts: [],
    currentPort: null,
    playerMarker: null,
    awakeningLevel: 0,  // 0-4, at 4 the god wakes
    loreFragments: [],
    gameOver: false
  };

  let map;
  let portMarkers = {};
  let routeLines = [];
  let corruptionOverlay;

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

    // Dark-themed tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      subdomains: "abcd",
      maxZoom: 19
    }).addTo(map);

    // Zoom control in bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Attribution
    L.control.attribution({ position: "bottomleft" })
      .addAttribution('Map: <a href="https://carto.com/">CARTO</a> | Game: The Drowned Meridian')
      .addTo(map);

    // Corruption overlay
    corruptionOverlay = document.createElement("div");
    corruptionOverlay.className = "corruption-overlay";
    document.body.appendChild(corruptionOverlay);
  }

  // ─── PORT MARKERS ───────────────────────────────────────────
  function renderPorts() {
    PORTS.forEach(port => {
      const size = port.sealSite ? 28 : 20;
      const icon = L.divIcon({
        className: "port-marker",
        iconSize: [size, size],
        html: port.sealSite ? "&#x2609;" : "&#x2693;"  // sun symbol for seals, anchor for ports
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

      el.classList.remove("corrupted", "sealed", "player-here");

      if (state.currentPort && state.currentPort.id === port.id) {
        el.classList.add("player-here");
      }
      if (state.corruptedPorts.includes(port.id)) {
        el.classList.add("corrupted");
      }
      if (state.reinforcedSeals.includes(port.id)) {
        el.classList.add("sealed");
      }
    });
  }

  // ─── PORT POPUP ─────────────────────────────────────────────
  function getPopupContent(port) {
    const isCorrupted = state.corruptedPorts.includes(port.id);
    const isSealed = state.reinforcedSeals.includes(port.id);
    const isHere = state.currentPort && state.currentPort.id === port.id;

    let statusTag = "";
    if (isCorrupted) statusTag = ' <span style="color:#c44a4a;">[CORRUPTED]</span>';
    if (isSealed) statusTag = ' <span style="color:#5ab87a;">[SEAL REINFORCED]</span>';

    let actionBtn = "";
    if (!isHere && state.currentPort) {
      const dist = getDistance(state.currentPort, port);
      actionBtn = `<button class="popup-btn" onclick="GAME.sailTo('${port.id}')">Sail here (~${dist} leagues)</button>`;
    } else if (isHere) {
      actionBtn = `<button class="popup-btn" onclick="GAME.investigate('${port.id}')">Investigate</button>`;
    } else if (!state.currentPort) {
      actionBtn = `<button class="popup-btn" onclick="GAME.startAt('${port.id}')">Begin voyage here</button>`;
    }

    return `
      <div class="popup-port-name">${port.name}${statusTag}</div>
      <div class="popup-port-region">${port.region} — ${port.country}</div>
      <div class="popup-port-desc">${port.desc}</div>
      ${port.sealSite ? '<div style="color:#c4a35a;font-size:12px;margin-bottom:6px;">&#x2609; MERIDIAN SEAL SITE</div>' : ""}
      ${actionBtn}
    `;
  }

  function onPortClick(port) {
    if (state.gameOver) return;
    const marker = portMarkers[port.id];
    marker.unbindPopup();
    marker.bindPopup(getPopupContent(port), { maxWidth: 300, className: "port-popup" }).openPopup();
  }

  // ─── DISTANCE / TRAVEL ─────────────────────────────────────
  function getDistance(a, b) {
    const dLat = b.lat - a.lat;
    const dLng = b.lng - a.lng;
    return Math.round(Math.sqrt(dLat * dLat + dLng * dLng) * 60); // rough "leagues"
  }

  function drawRoute(from, to) {
    const line = L.polyline(
      [[from.lat, from.lng], [to.lat, to.lng]],
      { color: "rgba(139,115,85,0.3)", dashArray: "6 4", weight: 1 }
    ).addTo(map);
    routeLines.push(line);
  }

  // ─── PLAYER ACTIONS ─────────────────────────────────────────
  function startAt(portId) {
    const port = PORTS.find(p => p.id === portId);
    if (!port) return;

    state.currentPort = port;
    state.visitedPorts.push(portId);

    // Initial corruption: corrupt 3 random ports
    const initialCorruption = HORROR.spreadCorruption(PORTS, [], 5);
    state.corruptedPorts.push(...initialCorruption);

    updateMarkerStyles();
    map.closePopup();
    map.flyTo([port.lat, port.lng], 5, { duration: 1.5 });

    setMessage(`Voyage begins at ${port.name}. The charts await.`);
    showEvent(HORROR.getEvent(port, state));
  }

  function sailTo(portId) {
    if (state.gameOver) return;
    const port = PORTS.find(p => p.id === portId);
    if (!port || !state.currentPort) return;

    const from = state.currentPort;

    // Draw route
    drawRoute(from, port);

    // Advance turn
    state.turn++;
    state.currentPort = port;
    state.visitedPorts.push(portId);

    // Corruption spreads each turn
    const spreadCount = 1 + Math.floor(state.turn / 5);
    const newCorruption = HORROR.spreadCorruption(PORTS, state.corruptedPorts, spreadCount);
    state.corruptedPorts.push(...newCorruption);

    // Check awakening
    checkAwakening();

    // Update UI
    updateHUD();
    updateMarkerStyles();
    map.closePopup();
    map.flyTo([port.lat, port.lng], 5, { duration: 1.5 });

    // Show global event every 3 turns
    if (state.turn % 3 === 0) {
      const globalEvt = HORROR.getGlobalEvent();
      state.corruptedPorts.push(
        ...HORROR.spreadCorruption(PORTS, state.corruptedPorts, globalEvt.corruption)
      );
      setTimeout(() => {
        showEvent({
          title: globalEvt.title,
          text: globalEvt.text,
          choices: [{ text: "Noted", effect: "nothing", value: 0 }]
        });
        // Then show port event after dismissal
      }, 500);
    } else {
      setTimeout(() => showEvent(HORROR.getEvent(port, state)), 500);
    }

    if (newCorruption.length > 0) {
      const names = newCorruption.map(id => PORTS.find(p => p.id === id)?.name).filter(Boolean);
      setMessage(`Corruption spreads to: ${names.join(", ")}`);
    }
  }

  function investigate(portId) {
    if (state.gameOver) return;
    const port = PORTS.find(p => p.id === portId);
    if (!port) return;

    map.closePopup();
    showEvent(HORROR.getEvent(port, state));
  }

  // ─── EVENT SYSTEM ──────────────────────────────────────────
  function showEvent(event) {
    const panel = document.getElementById("event-panel");
    const title = document.getElementById("event-title");
    const text = document.getElementById("event-text");
    const choices = document.getElementById("event-choices");

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
        state.sanity = Math.max(0, Math.min(100, state.sanity + choice.value));
        if (choice.value < 0) {
          setMessage(`Your mind frays. Sanity ${choice.value}.`);
        } else {
          setMessage(`A moment of peace. Sanity +${choice.value}.`);
        }
        break;

      case "seal_reinforce":
        if (state.sanity >= choice.value) {
          state.sanity -= choice.value;
          const port = state.currentPort;
          if (port && port.sealSite && !state.reinforcedSeals.includes(port.id)) {
            state.reinforcedSeals.push(port.id);
            // Remove from corrupted if it was
            state.corruptedPorts = state.corruptedPorts.filter(id => id !== port.id);
            setMessage(`The seal at ${port.name} holds. Seals reinforced: ${state.reinforcedSeals.length}/7.`);
          }
        } else {
          setMessage("You lack the mental fortitude. The seal remains cracked.");
        }
        break;

      case "corruption_spread":
        const spread = HORROR.spreadCorruption(PORTS, state.corruptedPorts, choice.value);
        state.corruptedPorts.push(...spread);
        setMessage("The corruption deepens.");
        break;

      case "corruption_local":
        if (state.currentPort && !state.corruptedPorts.includes(state.currentPort.id)) {
          state.corruptedPorts.push(state.currentPort.id);
          setMessage(`${state.currentPort.name} falls to corruption.`);
        }
        break;

      case "nothing":
        break;
    }

    if (choice.bonus) {
      state.loreFragments.push(choice.bonus);
      setMessage(getMessage() + ` [Acquired: ${formatBonus(choice.bonus)}]`);
    }

    checkGameEnd();
    updateHUD();
    updateMarkerStyles();
    updateCorruptionOverlay();
  }

  function formatBonus(bonus) {
    return bonus.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }

  // ─── AWAKENING & WIN/LOSS ──────────────────────────────────
  function checkAwakening() {
    const corruptionRatio = state.corruptedPorts.length / PORTS.length;
    const sealsBroken = 7 - state.reinforcedSeals.length;

    if (corruptionRatio > 0.75 && sealsBroken >= 5) {
      state.awakeningLevel = 4;
    } else if (corruptionRatio > 0.6) {
      state.awakeningLevel = Math.max(state.awakeningLevel, 3);
    } else if (corruptionRatio > 0.4) {
      state.awakeningLevel = Math.max(state.awakeningLevel, 2);
    } else if (corruptionRatio > 0.2) {
      state.awakeningLevel = Math.max(state.awakeningLevel, 1);
    }
  }

  function checkGameEnd() {
    // Loss: sanity hits 0
    if (state.sanity <= 0) {
      state.gameOver = true;
      showEvent({
        title: "LOST TO THE DEEP",
        text: "Your mind unravels like wet rope. The charts dissolve into meaningless lines. You can no longer tell where the sea ends and the sky begins. You sit on the dock at " + (state.currentPort?.name || "an unknown port") + " and watch the horizon eat itself. You are smiling. You do not know why.",
        choices: [{ text: "The chart is complete.", effect: "nothing", value: 0 }]
      });
      return;
    }

    // Loss: awakening reaches 4
    if (state.awakeningLevel >= 4) {
      state.gameOver = true;
      showEvent({
        title: "THE DROWNED GOD WAKES",
        text: HORROR.awakeningStages[3],
        choices: [{ text: "The meridian breaks.", effect: "nothing", value: 0 }]
      });
      return;
    }

    // Win: all 7 seals reinforced
    if (state.reinforcedSeals.length >= 7) {
      state.gameOver = true;
      showEvent({
        title: "THE MERIDIAN HOLDS",
        text: "Seven seals. Seven anchors along the drowned meridian. Each one cost you a piece of your mind, but the line holds. The Drowned God turns in its sleep but does not wake. The charts are true — for now. You have bought the world another age of ignorance. You hope it is enough.",
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

    // Color sanity based on level
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
    const ratio = state.corruptedPorts.length / PORTS.length;
    corruptionOverlay.style.opacity = Math.min(ratio * 0.8, 0.6);

    // Also warp the map tiles slightly at high corruption
    const tiles = document.querySelectorAll(".leaflet-tile");
    const hue = 200 + ratio * 60; // shift toward purple/red
    tiles.forEach(t => {
      t.style.filter = `saturate(${0.3 - ratio * 0.2}) brightness(${0.6 - ratio * 0.15}) sepia(${0.3 + ratio * 0.2}) hue-rotate(${hue}deg)`;
    });
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
    renderPorts();
    initIntro();
    updateHUD();
  }

  // Expose public API for popup buttons
  window.GAME = { sailTo, startAt, investigate };

  // Go
  document.addEventListener("DOMContentLoaded", init);
})();
