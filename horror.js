/**
 * Eldritch Event System — The Drowned Meridian
 *
 * Generates narrative events when players visit ports,
 * manages corruption spread, and tracks the Drowned God's awakening.
 */

const HORROR = {

  // ─── CORRUPTION EVENTS (appear at any corrupted port) ──────
  corruptionEvents: [
    {
      title: "The Ink Moves",
      text: "Your charts have changed. The coastline around {port} has shifted — subtly, impossibly. The harbor entrance is drawn two degrees off from reality. Or perhaps reality has shifted to match the older chart.",
      choices: [
        { text: "Correct the charts", effect: "sanity", value: -5 },
        { text: "Trust the old charts", effect: "corruption_spread", value: 1 }
      ]
    },
    {
      title: "Tidal Murmur",
      text: "The tide at {port} speaks. Not in words — in patterns. The water slaps the pilings in a rhythm that your body recognizes but your mind refuses to decode.",
      choices: [
        { text: "Listen closely", effect: "sanity", value: -10, bonus: "lore_fragment" },
        { text: "Stuff wax in your ears", effect: "sanity", value: -2 }
      ]
    },
    {
      title: "The Wrong Stars",
      text: "Taking a sextant reading in {port}'s harbor, you find a star where none should be. It is faint, greenish, and appears to pulse. Your almanac is sixty years old but has never been wrong before.",
      choices: [
        { text: "Record the new star", effect: "sanity", value: -8, bonus: "star_chart" },
        { text: "Disregard it", effect: "corruption_local", value: 1 }
      ]
    },
    {
      title: "Dockside Whispers",
      text: "A {port} stevedore approaches you with bloodshot eyes. 'You're one of them chart-makers, yeah? I need you to map what I saw in the hold of the Erebus II. Please. Before I forget. Before it makes me forget.'",
      choices: [
        { text: "Map his account", effect: "sanity", value: -7, bonus: "witness_account" },
        { text: "Walk away", effect: "corruption_local", value: 2 }
      ]
    },
    {
      title: "A Familiar Face",
      text: "You see yourself across the {port} harbor. Same coat, same satchel. The other you is looking at a chart and frowning. Then it looks up — directly at you — and mouths a single word you cannot read.",
      choices: [
        { text: "Approach your double", effect: "sanity", value: -15, bonus: "paradox_clue" },
        { text: "Flee to your ship", effect: "sanity", value: -5 }
      ]
    },
    {
      title: "The Barnacle Script",
      text: "Your ship's hull, scraped clean in {port} just three days ago, is covered in barnacles. They form lines. The lines form letters. The letters form a sentence in no human language — but you almost understand it.",
      choices: [
        { text: "Transcribe the script", effect: "sanity", value: -10, bonus: "lore_fragment" },
        { text: "Scrape the hull clean", effect: "nothing", value: 0 }
      ]
    },
    {
      title: "Deepwater Cartography",
      text: "A bathymetric survey of {port}'s approaches reveals an anomaly: the seabed descends to an impossible depth in a perfectly circular depression. Your instruments may be malfunctioning. They are not.",
      choices: [
        { text: "Lower a probe", effect: "sanity", value: -12, bonus: "depth_reading" },
        { text: "Mark it and move on", effect: "corruption_local", value: 1 }
      ]
    }
  ],

  // ─── SEAL EVENTS (appear at seal sites) ─────────────────────
  sealEvents: [
    {
      title: "The Meridian Anchor",
      text: "Beneath {port}, in a chamber that exists between the pages of any map, you find the Meridian Anchor — a seal of impossible geometry that hums with a frequency your bones feel before your ears do. The corruption is thick here. The seal is cracked.",
      choices: [
        { text: "Reinforce the seal (costs 15 Sanity)", effect: "seal_reinforce", value: 15 },
        { text: "Study the cracks (costs 8 Sanity)", effect: "sanity", value: -8, bonus: "seal_knowledge" },
        { text: "Leave it — the cost is too high", effect: "corruption_spread", value: 3 }
      ]
    },
    {
      title: "The Dreaming Ward",
      text: "The seal at {port} is not merely cracked — it is dreaming. You can see, in the fracture lines, visions of a vast body turning in its sleep beneath the ocean floor. Reinforcing it will mean pressing your hands to the cracks and pouring your own certainty into the stone.",
      choices: [
        { text: "Pour yourself into the seal (costs 20 Sanity)", effect: "seal_reinforce", value: 20 },
        { text: "Record the visions", effect: "sanity", value: -12, bonus: "vision_record" },
        { text: "Back away slowly", effect: "corruption_spread", value: 2 }
      ]
    }
  ],

  // ─── SAFE PORT EVENTS ──────────────────────────────────────
  safeEvents: [
    {
      title: "A Moment of Clarity",
      text: "The harbor at {port} is calm. The charts make sense. The stars are where they should be. For a single, precious evening, the world is merely the world.",
      choices: [
        { text: "Rest and recover (+10 Sanity)", effect: "sanity", value: 10 },
        { text: "Use the clarity to study your notes", effect: "sanity", value: 5, bonus: "research" }
      ]
    },
    {
      title: "The Meridian Society Archive",
      text: "A fellow cartographer in {port} shares a cache of Meridian Society documents. They detail the history of the seals — seven anchors placed along ley lines that converge beneath the Mediterranean.",
      choices: [
        { text: "Study the documents (+5 Sanity, gain intel)", effect: "sanity", value: 5, bonus: "archive_intel" },
        { text: "Copy and move on", effect: "nothing", value: 0 }
      ]
    },
    {
      title: "An Old Salt's Warning",
      text: "A retired captain in {port} buys you a drink. 'I know that look,' she says. 'You've seen the other tide. My advice: don't sail at the dark of the moon. And never, ever drop anchor where the water is too clear.'",
      choices: [
        { text: "Heed her wisdom (+5 Sanity)", effect: "sanity", value: 5 },
        { text: "Ask for more details", effect: "sanity", value: -3, bonus: "sailor_lore" }
      ]
    }
  ],

  // ─── GLOBAL EVENTS (happen between turns) ──────────────────
  globalEvents: [
    {
      title: "The Sea Darkens",
      text: "Satellite imagery shows an expanding area of abnormally dark water in the central Mediterranean. Shipping lanes are being quietly rerouted. The official explanation is 'algal bloom.'",
      corruption: 2
    },
    {
      title: "Tremors Along the Ridge",
      text: "A series of deep-focus earthquakes along the Mid-Atlantic Ridge. They are too deep, too regular, and too precisely spaced to be tectonic. Seismologists are confused. The Meridian Society is not.",
      corruption: 1
    },
    {
      title: "The Dream Broadcast",
      text: "Reports from ports across EMEA: hundreds of people dreamt the same dream last night — a vast shape beneath dark water, turning slowly, and a sound like a city-sized throat clearing.",
      corruption: 3
    },
    {
      title: "Compass Deviation",
      text: "Magnetic compass readings across the Mediterranean are deviating by 2-3 degrees. Navigation authorities have issued an advisory. The deviation points converge on a single location in the deep Ionian basin.",
      corruption: 1
    },
    {
      title: "The Silence",
      text: "For six hours, no whale song was detected anywhere in the Atlantic. Then it resumed — but the songs had changed. Marine biologists describe the new songs as 'responsive,' as if the whales are now answering something.",
      corruption: 2
    },
    {
      title: "Tidal Anomaly",
      text: "High tide arrived forty minutes early at every EMEA port simultaneously. The moon's position cannot account for this. Something else is exerting gravitational pull.",
      corruption: 2
    }
  ],

  // ─── ENDGAME EVENTS ────────────────────────────────────────
  awakeningStages: [
    "The water in every harbor has turned the color of old blood. Fish float belly-up in patterns that, from altitude, form a glyph.",
    "The Mediterranean has begun to drain — slowly, impossibly — into something below the Ionian basin. A whirlpool visible from space.",
    "A shape is visible beneath the water. It is the size of Cyprus. It is moving.",
    "IT WAKES. The Drowned God rises from the meridian, and every chart ever drawn becomes a lie. The coastlines reshape to its will. The game is over."
  ],

  /**
   * Pick a random event from a pool, avoiding recent titles
   */
  _pickAvoidingRepeats(pool, recentEvents) {
    // Filter out recently seen events
    let candidates = pool.filter(e => !recentEvents.includes(e.title));
    // Fallback to full pool if all have been seen recently
    if (candidates.length === 0) candidates = pool;
    return candidates[Math.floor(Math.random() * candidates.length)];
  },

  /**
   * Select a random event appropriate for the port's state
   */
  getEvent(port, gameState) {
    let pool;
    const recent = gameState.recentEvents || [];
    const awakening = gameState.awakeningLevel || 0;

    if (port.sealSite && !gameState.reinforcedSeals.includes(port.id)) {
      // 60% chance of seal event at unreinforced seal sites
      pool = Math.random() < 0.6 ? this.sealEvents : this.corruptionEvents;
    } else if (gameState.corruptedPorts.includes(port.id)) {
      pool = this.corruptionEvents;
    } else {
      // Safe ports: safe event chance decreases with awakening level
      // Stage 0: 70%, Stage 1: 60%, Stage 2: 50%, Stage 3: 35%
      const safeChance = Math.max(0.35, 0.7 - awakening * 0.12);
      pool = Math.random() < safeChance ? this.safeEvents : this.corruptionEvents;
    }

    const event = this._pickAvoidingRepeats(pool, recent);
    return {
      ...event,
      title: event.title,
      text: event.text.replace(/\{port\}/g, port.name)
    };
  },

  /**
   * Get a random global event for between turns (avoids recent repeats)
   */
  getGlobalEvent(recentEvents) {
    const recent = recentEvents || [];
    return this._pickAvoidingRepeats(this.globalEvents, recent);
  },

  /**
   * Spread corruption to adjacent ports (graph-based via SEA_ROUTES)
   */
  spreadCorruption(ports, corruptedPorts, count) {
    const uncorrupted = ports.filter(p => !corruptedPorts.includes(p.id));
    if (uncorrupted.length === 0) return [];

    const newCorruptions = [];
    for (let i = 0; i < count && uncorrupted.length > 0; i++) {
      // Prefer ports connected via sea routes to already-corrupted ones
      let candidates = uncorrupted.filter(p => {
        const conns = (typeof SEA_ROUTES !== "undefined" && SEA_ROUTES[p.id]) || [];
        return conns.some(cid => corruptedPorts.includes(cid));
      });

      // Fallback to proximity if no graph connections found
      if (candidates.length === 0) {
        candidates = uncorrupted.filter(p => {
          return corruptedPorts.some(cid => {
            const cp = ports.find(pp => pp.id === cid);
            if (!cp) return false;
            const dist = Math.sqrt(Math.pow(p.lat - cp.lat, 2) + Math.pow(p.lng - cp.lng, 2));
            return dist < 15;
          });
        });
      }

      if (candidates.length === 0) candidates = uncorrupted;

      const target = candidates[Math.floor(Math.random() * candidates.length)];
      newCorruptions.push(target.id);
      uncorrupted.splice(uncorrupted.indexOf(target), 1);
    }
    return newCorruptions;
  }
};
