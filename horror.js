/**
 * Eldritch Event System — The Drowned Meridian (Phase 3)
 *
 * Expanded event pools, region-specific variants,
 * multi-part event chains, and Drowned God awakening.
 */

const HORROR = {

  // ─── CORRUPTION EVENTS (15 total) ─────────────────────────
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
    },
    {
      title: "The Cargo Manifest",
      text: "A customs official in {port} shows you a manifest from a ship that arrived last night. The cargo is listed as '14 tonnes of silence.' The ship is not in the harbor. No one saw it leave.",
      choices: [
        { text: "Investigate the berth", effect: "sanity", value: -8, bonus: "phantom_manifest" },
        { text: "File it away", effect: "corruption_local", value: 1 }
      ]
    },
    {
      title: "Clocks Running Backward",
      text: "Every timepiece in {port} — mechanical, digital, atomic — lost forty-seven seconds last night. Not stopped. Lost. The seconds are simply gone, excised from the record as cleanly as a surgeon removes a tumor.",
      choices: [
        { text: "Calculate what happened in those seconds", effect: "sanity", value: -9, bonus: "temporal_gap" },
        { text: "Reset your watch and move on", effect: "sanity", value: -2 }
      ]
    },
    {
      title: "The Harbor Water",
      text: "The water in {port}'s harbor has thickened. Not frozen — thickened, like oil, like blood, like something alive and reluctant to move. Boats leave furrows that take minutes to close.",
      choices: [
        { text: "Collect a sample", effect: "sanity", value: -6, bonus: "water_sample" },
        { text: "Avoid the water", effect: "corruption_local", value: 1 }
      ]
    },
    {
      title: "Maps That Bleed",
      text: "You unfold your chart of {port} and a dark stain is spreading from the center. It's warm. It smells of copper and brine. The stain is forming coordinates you haven't plotted.",
      choices: [
        { text: "Read the coordinates", effect: "sanity", value: -11, bonus: "bleeding_coords" },
        { text: "Burn the chart", effect: "sanity", value: -3 }
      ]
    },
    {
      title: "The Lighthouse Bends",
      text: "The lighthouse beam at {port} is curving. Not refracting — curving, as if the light itself is being pulled toward a point offshore. The keeper insists nothing has changed.",
      choices: [
        { text: "Follow the curve's bearing", effect: "sanity", value: -7, bonus: "bent_light" },
        { text: "Report it to authorities", effect: "nothing", value: 0 }
      ]
    },
    {
      title: "Crew Nightmares",
      text: "Three of your crew resign at {port}. All cite the same dream: standing on the seabed, looking up at the hull of your ship, unable to breathe but not dying. Just watching. For years.",
      choices: [
        { text: "Interview them before they leave", effect: "sanity", value: -8, bonus: "crew_dreams" },
        { text: "Hire replacements", effect: "sanity", value: -3 }
      ]
    },
    {
      title: "The Depth Sounding",
      text: "The harbor at {port} is charted at twelve meters. Your depth sounder reads twelve meters. Then, for one second, it reads twelve thousand. The digit hangs there, then corrects itself. The sounder's memory has been wiped.",
      choices: [
        { text: "Check the sounder's deleted logs", effect: "sanity", value: -10, bonus: "depth_anomaly" },
        { text: "Trust the official depth", effect: "corruption_local", value: 1 }
      ]
    },
    {
      title: "The Congregation",
      text: "At dawn, every seabird in {port} lands on the water facing the same direction. Thousands of them, perfectly still, perfectly silent. After eleven minutes, they take off and resume normal behavior. None of them will land on your ship.",
      choices: [
        { text: "Chart the bearing they faced", effect: "sanity", value: -6, bonus: "congregation_bearing" },
        { text: "Ignore the omen", effect: "corruption_spread", value: 1 }
      ]
    }
  ],

  // ─── SEAL EVENTS (5 total) ────────────────────────────────
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
    },
    {
      title: "The Seal Fights Back",
      text: "The Meridian Anchor at {port} resists your touch. It pulses with heat, then cold, then a sensation your nerves have no name for. The seal doesn't want to be reinforced. It wants to be opened.",
      choices: [
        { text: "Force the reinforcement (costs 18 Sanity)", effect: "seal_reinforce", value: 18 },
        { text: "Listen to the seal's desire", effect: "sanity", value: -14, bonus: "seal_whisper" },
        { text: "Step back — this is wrong", effect: "corruption_spread", value: 2 }
      ]
    },
    {
      title: "The Double Seal",
      text: "You find the seal at {port}, but there are two of them — overlapping, flickering between states like a compass needle between poles. One is the real seal. One is a trap. You cannot tell which is which.",
      choices: [
        { text: "Choose the left seal (costs 15 Sanity)", effect: "seal_reinforce", value: 15 },
        { text: "Choose the right seal (costs 15 Sanity, risky)", effect: "sanity", value: -15, bonus: "false_seal" },
        { text: "Study both until you're certain", effect: "sanity", value: -10, bonus: "seal_duality" }
      ]
    },
    {
      title: "The Warden's Price",
      text: "A figure stands beside the seal at {port}. It wears the uniform of the Meridian Society — but the uniform is centuries old, and the figure has no face. It extends a hand, palm up. It wants something from you before it will allow the reinforcement.",
      choices: [
        { text: "Give it a memory (costs 22 Sanity)", effect: "seal_reinforce", value: 22 },
        { text: "Give it your name (costs 12 Sanity)", effect: "sanity", value: -12, bonus: "warden_pact" },
        { text: "Refuse and retreat", effect: "corruption_spread", value: 3 }
      ]
    }
  ],

  // ─── SAFE PORT EVENTS (8 total) ───────────────────────────
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
    },
    {
      title: "The Safe House",
      text: "Behind a fishmonger's stall in {port}, a door marked with the Meridian Society's compass rose. Inside: a cot, a hot meal, a locked cabinet of supplies, and a note that reads 'You are not alone in this.'",
      choices: [
        { text: "Rest here (+12 Sanity)", effect: "sanity", value: 12 },
        { text: "Search the cabinet for intel", effect: "sanity", value: 3, bonus: "safehouse_cache" }
      ]
    },
    {
      title: "The Child Who Sees",
      text: "A child at the {port} docks tugs your sleeve. 'The dark water hasn't come here yet,' she says. 'But I can see it coming. It moves like a snake under the ground.' She draws a map in chalk. It's disturbingly accurate.",
      choices: [
        { text: "Copy her map (+3 Sanity, gain intel)", effect: "sanity", value: 3, bonus: "child_map" },
        { text: "Tell her to go home where it's safe", effect: "sanity", value: 5 }
      ]
    },
    {
      title: "The Priest's Ward",
      text: "A priest in {port} — old, bent, eyes sharp — recognizes your Meridian Society compass. 'I know what you fight,' he says. He presses a small icon into your hand. It's warm. 'This will help, once.'",
      choices: [
        { text: "Accept the ward (+8 Sanity)", effect: "sanity", value: 8 },
        { text: "Ask him what he knows", effect: "sanity", value: 2, bonus: "priestly_knowledge" }
      ]
    },
    {
      title: "Fair Harbor",
      text: "{port} is untouched. The fish are plentiful, the sailors sing, the sunset is merely beautiful. You allow yourself to believe, just for an evening, that the world is not ending.",
      choices: [
        { text: "Enjoy the evening (+7 Sanity)", effect: "sanity", value: 7 },
        { text: "Stay vigilant (less rest, more awareness)", effect: "sanity", value: 3, bonus: "vigilance_note" }
      ]
    },
    {
      title: "Resupply",
      text: "The chandler in {port} has everything you need: fresh water, salt pork, new rigging. Normal things. Blessedly, tediously normal things. You spend a full day on maintenance and feel almost human afterward.",
      choices: [
        { text: "Full resupply (+6 Sanity)", effect: "sanity", value: 6 },
        { text: "Resupply and ask around for news", effect: "sanity", value: 3, bonus: "port_rumors" }
      ]
    }
  ],

  // ─── REGION-SPECIFIC EVENTS ────────────────────────────────
  regionEvents: {
    "Northern Europe": [
      {
        title: "The Draugr's Warning",
        text: "In a {port} tavern, a fisherman speaks of the draugr — the restless dead who guard sunken hoards. 'They're walking the seabed again,' he says. 'I saw their lights beneath my keel. They're not guarding treasure anymore. They're fleeing something.'",
        choices: [
          { text: "Ask what they flee", effect: "sanity", value: -7, bonus: "draugr_lore" },
          { text: "Buy him another drink and leave", effect: "sanity", value: -2 }
        ]
      },
      {
        title: "The Runestone",
        text: "Workers dredging the harbor at {port} pull up a runestone. The runes are Elder Futhark, but the message is in no known Norse dialect. Your Meridian Society cipher key, however, translates it perfectly.",
        choices: [
          { text: "Translate the message", effect: "sanity", value: -9, bonus: "runestone_text" },
          { text: "Have it sent to a museum", effect: "nothing", value: 0 }
        ]
      }
    ],
    "Western Europe": [
      {
        title: "The Cartographer's Ghost",
        text: "In {port}'s maritime museum, you find a 16th-century portolan chart. The cartographer has drawn something in the Atlantic that isn't an island — it's a warning, hidden in the decorative sea monsters. The warning includes today's date.",
        choices: [
          { text: "Decode the warning", effect: "sanity", value: -8, bonus: "portolan_warning" },
          { text: "Photograph it and move on", effect: "sanity", value: -2 }
        ]
      },
      {
        title: "The Channel Fog",
        text: "A fog rolls into {port} that smells of deep ocean — not the harbor, not the coast, but the abyssal plain. Visibility drops to zero. When it lifts, three fishing boats are missing. They were at anchor.",
        choices: [
          { text: "Search for the boats", effect: "sanity", value: -6, bonus: "fog_evidence" },
          { text: "Wait for the fog to pass", effect: "corruption_local", value: 1 }
        ]
      }
    ],
    "Mediterranean": [
      {
        title: "The Oracle's Heir",
        text: "A woman in {port} claims descent from the oracles of old. She speaks in verse and her eyes never blink. 'The sleeper turns,' she says. 'Seven pins hold the cloth. You pull the pins. Do you know what the cloth covers?'",
        choices: [
          { text: "Ask her what the cloth covers", effect: "sanity", value: -10, bonus: "oracle_prophecy" },
          { text: "Thank her and leave", effect: "sanity", value: -3 }
        ]
      },
      {
        title: "Amphora from the Deep",
        text: "Sponge divers in {port} bring up an amphora from an impossible depth. Inside: a scroll of vellum, still dry, still legible. It's a nautical chart of the Mediterranean — but the coastlines are wrong. They match no known era. They may match the future.",
        choices: [
          { text: "Study the future chart", effect: "sanity", value: -11, bonus: "future_chart" },
          { text: "Seal it back in the amphora", effect: "nothing", value: 0 }
        ]
      }
    ],
    "Black Sea": [
      {
        title: "The Sunken Fleet",
        text: "Sonar surveys near {port} have found a fleet of ships on the seabed — hundreds of vessels from every era, from triremes to container ships. They are arranged in concentric circles around a central point. The arrangement is too precise to be currents.",
        choices: [
          { text: "Dive to investigate", effect: "sanity", value: -12, bonus: "sunken_fleet" },
          { text: "Mark the coordinates only", effect: "sanity", value: -3 }
        ]
      }
    ],
    "Middle East": [
      {
        title: "The Brine Pool Whisper",
        text: "A marine biologist at {port} shows you hydrophone recordings from the Red Sea's brine pools. Beneath the static, there is a voice — or something like a voice — repeating a sequence of numbers. The numbers are your ship's registration.",
        choices: [
          { text: "Analyze the recording", effect: "sanity", value: -10, bonus: "brine_recording" },
          { text: "Destroy the recording", effect: "sanity", value: -4 }
        ]
      },
      {
        title: "The Frankincense Trail",
        text: "A merchant in {port} sells you frankincense that, when burned, produces smoke that moves against the wind. The smoke forms shapes — coastlines, depth contours, a route leading south and down.",
        choices: [
          { text: "Follow the smoke's route", effect: "sanity", value: -7, bonus: "incense_map" },
          { text: "Extinguish it", effect: "sanity", value: -2 }
        ]
      }
    ],
    "East Africa": [
      {
        title: "The Swahili Warning",
        text: "A dhow captain in {port} reads the waves the way the Swahili have for a thousand years. 'The ocean has a new voice,' he says. 'It speaks from below. My grandfather heard it once. He never sailed again.'",
        choices: [
          { text: "Ask to hear the voice", effect: "sanity", value: -8, bonus: "ocean_voice" },
          { text: "Respect his warning (+3 Sanity)", effect: "sanity", value: 3 }
        ]
      }
    ],
    "West Africa": [
      {
        title: "The Griot's Song",
        text: "A griot in {port} sings a song that is not in his repertoire — not in any language he knows. He entered a trance and the words came. When you transcribe them using the Meridian cipher, they describe the location of a seal.",
        choices: [
          { text: "Follow the cipher's directions", effect: "sanity", value: -6, bonus: "griot_cipher" },
          { text: "Thank the griot and leave", effect: "sanity", value: 2 }
        ]
      }
    ],
    "Southern Africa": [
      {
        title: "The Flying Dutchman",
        text: "You see it at dusk off {port}: a ship with tattered sails and no running lights, visible for exactly ninety seconds before it vanishes. The Meridian Society's logbook records the same vessel, in the same position, with decreasing intervals between appearances.",
        choices: [
          { text: "Plot the appearances on a chart", effect: "sanity", value: -8, bonus: "dutchman_chart" },
          { text: "Look away", effect: "sanity", value: -3 }
        ]
      }
    ]
  },

  // ─── EVENT CHAINS (multi-part stories across ports) ────────
  chains: {
    passenger: {
      name: "The Passenger",
      stages: [
        {
          title: "The Passenger — I",
          text: "A man boards your ship at {port}. He has no luggage, pays in advance with gold coins of no recognizable mint, and asks only for passage 'south, and further south.' He does not eat. He does not sleep. He stands at the bow and watches the water.",
          choices: [
            { text: "Allow him to stay", effect: "sanity", value: -3, bonus: "passenger_stage_1" },
            { text: "Put him ashore", effect: "nothing", value: 0 }
          ],
          advance: true
        },
        {
          title: "The Passenger — II",
          text: "The passenger is still aboard. You did not take him on at this port, but here he is, standing at the bow, watching. A crew member swears the passenger's shadow points the wrong way — toward the sun, not away from it.",
          choices: [
            { text: "Confront him", effect: "sanity", value: -8, bonus: "passenger_stage_2" },
            { text: "Watch from a distance", effect: "sanity", value: -4 }
          ],
          advance: true
        },
        {
          title: "The Passenger — III",
          text: "The passenger turns to face you for the first time. His eyes are the color of deep water. 'You reinforce the seals,' he says. 'I once did the same. That was a very long time ago. The cost was everything. But the alternative...' He gestures at the sea. 'The alternative was this.'",
          choices: [
            { text: "Ask him what he became", effect: "sanity", value: -12, bonus: "passenger_truth" },
            { text: "Accept his warning (+5 Sanity)", effect: "sanity", value: 5 }
          ],
          advance: false
        }
      ]
    },
    cartographer: {
      name: "The Other Cartographer",
      stages: [
        {
          title: "The Other Cartographer — I",
          text: "In {port}, you find evidence that another Meridian Society member has been here recently. But their notes are wrong — deliberately wrong. They've been charting corruption sites and marking them as safe. Someone is working against you.",
          choices: [
            { text: "Study their false charts", effect: "sanity", value: -5, bonus: "false_charts_1" },
            { text: "Warn the local Society chapter", effect: "sanity", value: -2 }
          ],
          advance: true
        },
        {
          title: "The Other Cartographer — II",
          text: "You find their journal in a {port} boarding house. The handwriting starts normal and degrades over months into something frantic, looping, barely human. The last entry reads: 'The seals don't protect us from It. They protect It from waking up hungry. If It wakes gradually, It wakes sated. BREAK THE SEALS SLOWLY.'",
          choices: [
            { text: "Consider their logic", effect: "sanity", value: -10, bonus: "heretic_logic" },
            { text: "Burn the journal", effect: "sanity", value: -4 }
          ],
          advance: true
        },
        {
          title: "The Other Cartographer — III",
          text: "You find them in {port}. They are sitting on the dock, drawing charts in their own blood. When they see you, they smile. 'You're still sane,' they say. 'Good. One of us should be. I was wrong about the seals. Reinforce them. All of them. I'll hold the line here.' They turn back to their crimson cartography. Their charts are the most accurate you've ever seen.",
          choices: [
            { text: "Take their charts (+3 Sanity, gain intel)", effect: "sanity", value: 3, bonus: "blood_charts" },
            { text: "Try to help them", effect: "sanity", value: -8, bonus: "cartographer_fate" }
          ],
          advance: false
        }
      ]
    },
    signal: {
      name: "The Signal",
      stages: [
        {
          title: "The Signal — I",
          text: "Your ship's radio picks up a signal at {port}. It's on no published frequency — a carrier wave modulated with data that your equipment can't decode. The signal comes from below the waterline. From beneath the harbor floor.",
          choices: [
            { text: "Record the signal", effect: "sanity", value: -4, bonus: "signal_stage_1" },
            { text: "Turn off the radio", effect: "sanity", value: -1 }
          ],
          advance: true
        },
        {
          title: "The Signal — II",
          text: "The signal has changed since last time. It's stronger at {port}, and your radio decodes a fragment: coordinates, repeated on a loop. The coordinates point to a location in the deep Mediterranean. The depth at that location exceeds any charted trench.",
          choices: [
            { text: "Plot the coordinates", effect: "sanity", value: -7, bonus: "signal_coords" },
            { text: "Ignore the signal", effect: "corruption_spread", value: 1 }
          ],
          advance: true
        },
        {
          title: "The Signal — III",
          text: "The signal is now audible without equipment. Everyone in {port} can hear it — a low hum at the edge of perception. Your decoder finally cracks the full message. It's not a broadcast. It's a heartbeat. Electrocardiographic data from something with a heart the size of a city block. The heart rate is increasing.",
          choices: [
            { text: "Calculate time to full awakening", effect: "sanity", value: -14, bonus: "signal_heartbeat" },
            { text: "Smash the radio", effect: "sanity", value: -5 }
          ],
          advance: false
        }
      ]
    }
  },

  // ─── GLOBAL EVENTS (12 total) ─────────────────────────────
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
    },
    {
      title: "Undersea Cable Failure",
      text: "Three undersea internet cables in the Mediterranean have failed simultaneously. Repair crews report the cables weren't severed — they were pulled. Downward. The tension readings suggest a force of several hundred tonnes.",
      corruption: 2
    },
    {
      title: "GPS Drift",
      text: "GPS coordinates across EMEA have drifted by 30 meters. Not uniformly — the drift pattern, when mapped, forms a spiral centered on the Ionian basin. The drift corrected itself after four hours. Officially, it never happened.",
      corruption: 1
    },
    {
      title: "Mass Bird Die-Off",
      text: "Thousands of seabirds have washed ashore across the Mediterranean, all facing the same compass bearing. Necropsies reveal no toxins, no disease. Cause of death: their hearts stopped simultaneously.",
      corruption: 2
    },
    {
      title: "The Shipping Lane Closure",
      text: "Maritime authorities have closed a shipping lane in the eastern Mediterranean due to 'uncharted seabed elevation changes.' The seabed hasn't risen. Something on it has.",
      corruption: 2
    },
    {
      title: "The Temperature Inversion",
      text: "Deep-ocean temperature sensors across the Atlantic report a sudden warming at abyssal depths. The heat signature suggests a single source — biological in origin, moving northward along the Mid-Atlantic Ridge.",
      corruption: 3
    },
    {
      title: "The Second Moon",
      text: "For one night, observers across North Africa report seeing two moons. The second is lower, greener, and appears to be reflected from beneath the sea's surface rather than above it.",
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
    let candidates = pool.filter(e => !recentEvents.includes(e.title));
    if (candidates.length === 0) candidates = pool;
    return candidates[Math.floor(Math.random() * candidates.length)];
  },

  /**
   * Select a random event appropriate for the port's state.
   * Now includes region-specific events and chain progression.
   */
  getEvent(port, gameState) {
    let pool;
    const recent = gameState.recentEvents || [];
    const awakening = gameState.awakeningLevel || 0;

    if (port.sealSite && !gameState.reinforcedSeals.includes(port.id)) {
      pool = Math.random() < 0.6 ? this.sealEvents : this.corruptionEvents;
    } else if (gameState.corruptedPorts.includes(port.id)) {
      pool = this.corruptionEvents;
    } else {
      const safeChance = Math.max(0.35, 0.7 - awakening * 0.12);
      pool = Math.random() < safeChance ? this.safeEvents : this.corruptionEvents;
    }

    // 20% chance to get a region-specific event instead
    const regionPool = this.regionEvents[port.region];
    if (regionPool && regionPool.length > 0 && Math.random() < 0.2) {
      const regionEvt = this._pickAvoidingRepeats(regionPool, recent);
      return {
        ...regionEvt,
        text: regionEvt.text.replace(/\{port\}/g, port.name)
      };
    }

    // 15% chance to advance an event chain
    const chainEvent = this._getChainEvent(port, gameState);
    if (chainEvent && Math.random() < 0.15) {
      return chainEvent;
    }

    const event = this._pickAvoidingRepeats(pool, recent);
    return {
      ...event,
      title: event.title,
      text: event.text.replace(/\{port\}/g, port.name)
    };
  },

  /**
   * Check if any event chain can advance, and return the next stage if so.
   */
  _getChainEvent(port, gameState) {
    const lore = gameState.loreFragments || [];
    for (const [key, chain] of Object.entries(this.chains)) {
      const stages = chain.stages;
      // Find current stage based on collected lore
      let currentStage = -1;
      for (let i = stages.length - 1; i >= 0; i--) {
        const stageBonus = stages[i].choices.find(c => c.bonus)?.bonus;
        if (stageBonus && lore.includes(stageBonus)) {
          currentStage = i;
          break;
        }
      }
      const nextStage = currentStage + 1;
      if (nextStage < stages.length) {
        // Check if previous stage requires advancement
        if (currentStage >= 0 && !stages[currentStage].advance) continue;
        const stage = stages[nextStage];
        return {
          ...stage,
          text: stage.text.replace(/\{port\}/g, port.name),
          choices: stage.choices.map(c => ({
            ...c,
            // Don't replace _then if it exists
          }))
        };
      }
    }
    return null;
  },

  /**
   * Get a random global event (avoids recent repeats)
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
      let candidates = uncorrupted.filter(p => {
        const conns = (typeof SEA_ROUTES !== "undefined" && SEA_ROUTES[p.id]) || [];
        return conns.some(cid => corruptedPorts.includes(cid));
      });

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
