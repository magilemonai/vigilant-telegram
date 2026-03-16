/**
 * EMEA Ports of Call — The Drowned Meridian
 *
 * Real-world ports across Europe, the Middle East, and Africa,
 * each annotated with eldritch lore for the game layer.
 *
 * Regions: Northern Europe, Western Europe, Mediterranean,
 *          Eastern Europe / Black Sea, Middle East, East Africa,
 *          West Africa, Southern Africa
 */

const PORTS = [

  // ─── NORTHERN EUROPE ────────────────────────────────────────
  {
    id: "reykjavik",
    name: "Reykjavik",
    corruptedName: "Reyk'javik",
    country: "Iceland",
    region: "Northern Europe",
    lat: 64.15, lng: -21.95,
    desc: "A wind-scoured harbor at the edge of the Arctic, where geysers exhale sulfurous fog.",
    lore: "Beneath the Hallgrimskirkja, Meridian surveyors found runes that predate the Norse by millennia — carved by hands with too many fingers.",
    sealSite: true
  },
  {
    id: "bergen",
    name: "Bergen",
    corruptedName: "Ber'ghen",
    country: "Norway",
    lat: 60.39, lng: 5.32,
    region: "Northern Europe",
    desc: "A Hanseatic port hemmed in by fjords and perpetual drizzle.",
    lore: "Fishermen speak of a second tide that moves against the moon. Nets come up with knots no sailor tied."
  },
  {
    id: "oslo",
    name: "Oslo",
    corruptedName: "Os'loh",
    country: "Norway",
    lat: 59.91, lng: 10.75,
    region: "Northern Europe",
    desc: "Capital port at the head of the Oslofjord.",
    lore: "The Viking Ship Museum's oldest hull has barnacles on the inside."
  },
  {
    id: "stockholm",
    name: "Stockholm",
    corruptedName: "Stokk'holm",
    country: "Sweden",
    lat: 59.33, lng: 18.07,
    region: "Northern Europe",
    desc: "A city of islands where Baltic waters wind between granite and copper spires.",
    lore: "The Vasa sank in 1628. Divers who explored the wreck in 1954 reported hearing singing from below the keel."
  },
  {
    id: "helsinki",
    name: "Helsinki",
    corruptedName: "Hels'inki",
    country: "Finland",
    lat: 60.17, lng: 24.94,
    region: "Northern Europe",
    desc: "A pale granite city facing the Gulf of Finland.",
    lore: "The Temppeliaukio church was carved into living rock. On certain nights, the rock hums back."
  },
  {
    id: "st_petersburg",
    name: "Saint Petersburg",
    corruptedName: "Sankt Pet'erburgh",
    country: "Russia",
    lat: 59.93, lng: 30.32,
    region: "Northern Europe",
    desc: "Peter the Great's window to Europe, built on bones and marshland.",
    lore: "The Hermitage has a sealed sub-basement. The cats that guard the museum refuse to descend past the third level."
  },
  {
    id: "copenhagen",
    name: "Copenhagen",
    corruptedName: "Koph'enhagen",
    country: "Denmark",
    lat: 55.68, lng: 12.57,
    region: "Northern Europe",
    desc: "A mercantile harbor where Scandinavian trade routes converge.",
    lore: "The Little Mermaid statue faces the sea. Twice, it has been found facing inland — both times preceding a storm that appeared on no forecast."
  },
  {
    id: "edinburgh",
    name: "Edinburgh (Leith)",
    corruptedName: "Edin'bhurgh",
    country: "United Kingdom",
    lat: 55.98, lng: -3.17,
    region: "Northern Europe",
    desc: "Scotland's capital port, overlooked by Arthur's Seat and a dormant volcano.",
    lore: "The vaults beneath the Royal Mile contain chambers that appear on no architectural plan. Tourists who wander too deep report losing hours."
  },

  // ─── WESTERN EUROPE ─────────────────────────────────────────
  {
    id: "london",
    name: "London",
    corruptedName: "Lon'duhn",
    country: "United Kingdom",
    lat: 51.51, lng: -0.08,
    region: "Western Europe",
    desc: "The Thames estuary — gateway to an empire, now a drowned memory of commerce.",
    lore: "The Thames Barrier was built to hold back water. The Meridian Society knows it was also built to hold back something that rides the water.",
    sealSite: true
  },
  {
    id: "amsterdam",
    name: "Amsterdam",
    corruptedName: "Amster'dahm",
    country: "Netherlands",
    lat: 52.38, lng: 4.90,
    region: "Western Europe",
    desc: "A city reclaimed from the sea, laced with canals and restless tides.",
    lore: "The Dutch drained the Zuider Zee. What they found in the exposed seabed was re-submerged within a week. The records were classified."
  },
  {
    id: "rotterdam",
    name: "Rotterdam",
    corruptedName: "Rott'erdahm",
    country: "Netherlands",
    lat: 51.92, lng: 4.48,
    region: "Western Europe",
    desc: "Europe's busiest port — a ceaseless machinery of containers and cranes.",
    lore: "Container MRDX-7714 has been circulating through Rotterdam for eleven years. No shipping company claims it. It is always cold to the touch."
  },
  {
    id: "hamburg",
    name: "Hamburg",
    corruptedName: "Ham'burgh",
    country: "Germany",
    lat: 53.55, lng: 9.99,
    region: "Western Europe",
    desc: "Germany's gateway to the sea, where the Elbe meets ambition.",
    lore: "The Speicherstadt warehouses are built on oak pilings driven into the riverbed. The wood has not rotted in over a century. It has, however, grown."
  },
  {
    id: "antwerp",
    name: "Antwerp",
    corruptedName: "Ant'wehrp",
    country: "Belgium",
    lat: 51.22, lng: 4.40,
    region: "Western Europe",
    desc: "A diamond-trade port on the Scheldt, polished by centuries of commerce.",
    lore: "The city's name derives from hand-werpen — to throw a hand. The legend says a giant's hand was severed and thrown into the river. The hand was never found."
  },
  {
    id: "le_havre",
    name: "Le Havre",
    corruptedName: "Le H'avre",
    country: "France",
    lat: 49.49, lng: 0.11,
    region: "Western Europe",
    desc: "Rebuilt from rubble after the war, a concrete testament to French resolve at the mouth of the Seine.",
    lore: "The post-war reconstruction uncovered a pre-Roman cistern. The water inside was salt, despite being thirty kilometers from the sea at the time."
  },
  {
    id: "lisbon",
    name: "Lisbon",
    corruptedName: "Lis'bhon",
    country: "Portugal",
    lat: 38.72, lng: -9.14,
    region: "Western Europe",
    desc: "City of explorers, perched where the Tagus meets the Atlantic.",
    lore: "The 1755 earthquake and tsunami were natural disasters. The thing that surfaced briefly in the Tagus during the receding waters was not.",
    sealSite: true
  },
  {
    id: "bilbao",
    name: "Bilbao",
    corruptedName: "Bil'bhao",
    country: "Spain",
    lat: 43.26, lng: -2.93,
    region: "Western Europe",
    desc: "A Basque port reborn through art and titanium curves.",
    lore: "The Guggenheim's titanium panels sometimes reflect a skyline that doesn't match the city."
  },
  {
    id: "brest",
    name: "Brest",
    corruptedName: "Br'est",
    country: "France",
    lat: 48.39, lng: -4.49,
    region: "Western Europe",
    desc: "A naval stronghold on the tip of Brittany, battered by Atlantic gales.",
    lore: "Breton sailors knew of a ninth wave that comes not from the sea but from beneath it."
  },

  // ─── MEDITERRANEAN ──────────────────────────────────────────
  {
    id: "barcelona",
    name: "Barcelona",
    corruptedName: "Barcel'ohna",
    country: "Spain",
    lat: 41.38, lng: 2.17,
    region: "Mediterranean",
    desc: "A Catalan jewel where Gaudi's spires reach toward something unseen.",
    lore: "Gaudi's Sagrada Familia was designed from plans he claimed were dictated in dreams. The crypt contains geometries that do not resolve in three dimensions."
  },
  {
    id: "marseille",
    name: "Marseille",
    corruptedName: "Mar'seille",
    country: "France",
    lat: 43.30, lng: 5.37,
    region: "Mediterranean",
    desc: "The oldest city in France — a cauldron of cultures on the Provencal coast.",
    lore: "The Calanques hide sea caves that go deeper than any survey has mapped. Divers who push too far report the water becoming warmer, not colder."
  },
  {
    id: "genoa",
    name: "Genoa",
    corruptedName: "Gen'oha",
    country: "Italy",
    lat: 44.41, lng: 8.93,
    region: "Mediterranean",
    desc: "Birthplace of Columbus, a Ligurian port compressed between mountains and sea.",
    lore: "The Lanterna lighthouse has stood since 1128. Its light has gone out exactly seven times. Each extinction preceded a Mediterranean earthquake by forty days."
  },
  {
    id: "naples",
    name: "Naples",
    corruptedName: "Nap'oleth",
    country: "Italy",
    lat: 40.85, lng: 14.27,
    region: "Mediterranean",
    desc: "A chaotic, beautiful city in the shadow of Vesuvius.",
    lore: "The Bourbon Tunnel network extends far beyond any official map. Workers who explored the deepest passages found walls covered in a script that predates Latin."
  },
  {
    id: "valletta",
    name: "Valletta",
    corruptedName: "Val'lhetta",
    country: "Malta",
    lat: 35.90, lng: 14.51,
    region: "Mediterranean",
    desc: "A fortress-city built by the Knights of St. John on sun-bleached limestone.",
    lore: "The Hal Saflieni Hypogeum descends to a third level that was sealed in 1940. The British cited 'structural concerns.' The structure is sound."
  },
  {
    id: "piraeus",
    name: "Piraeus (Athens)",
    corruptedName: "Pir'aeus (Ath'ens)",
    country: "Greece",
    lat: 37.94, lng: 23.65,
    region: "Mediterranean",
    desc: "The ancient port of Athens, where triremes once launched toward Troy.",
    lore: "The Oracle at Delphi spoke for Apollo. But the fumes that induced her visions rose from a fissure that connects to the Mediterranean seabed — a fissure that still breathes.",
    sealSite: true
  },
  {
    id: "dubrovnik",
    name: "Dubrovnik",
    corruptedName: "Dubr'ovhnik",
    country: "Croatia",
    lat: 42.65, lng: 18.09,
    region: "Mediterranean",
    desc: "The Pearl of the Adriatic, wrapped in medieval walls of white stone.",
    lore: "The city walls have never been breached by siege. The Republic of Ragusa attributed this to diplomacy. The Meridian Society attributes it to what lives in the walls."
  },
  {
    id: "venice",
    name: "Venice",
    corruptedName: "Ven'ithce",
    country: "Italy",
    lat: 45.44, lng: 12.32,
    region: "Mediterranean",
    desc: "A sinking labyrinth of canals, bridges, and fading grandeur.",
    lore: "Venice sinks three millimeters per year. But the sinking is not uniform — the city tilts, slowly, toward the same compass bearing."
  },
  {
    id: "algiers",
    name: "Algiers",
    corruptedName: "Al'ghiers",
    country: "Algeria",
    lat: 36.75, lng: 3.04,
    region: "Mediterranean",
    desc: "The White City, cascading down hillsides to a crescent-shaped bay.",
    lore: "The Casbah's oldest walls contain stones that match no local quarry. Geological analysis places their origin at a depth of four kilometers beneath the Mediterranean."
  },
  {
    id: "tunis",
    name: "Tunis",
    corruptedName: "Thu'nis",
    country: "Tunisia",
    lat: 36.81, lng: 10.18,
    region: "Mediterranean",
    desc: "Built near the ruins of Carthage, where salt was sown into conquered earth.",
    lore: "Rome salted the earth at Carthage so nothing would grow. Something grew anyway — in the catacombs beneath the salt."
  },
  {
    id: "alexandria",
    name: "Alexandria",
    corruptedName: "Alexan'dhria",
    country: "Egypt",
    lat: 31.20, lng: 29.92,
    region: "Mediterranean",
    desc: "Once home to the Great Library and the Pharos — beacons of a drowned age.",
    lore: "Divers mapping the sunken Royal Quarter found a chamber beneath Cleopatra's palace. The chamber was empty except for a mirror that reflected a sky with too many stars.",
    sealSite: true
  },

  // ─── EASTERN EUROPE / BLACK SEA ─────────────────────────────
  {
    id: "odesa",
    name: "Odesa",
    corruptedName: "Ode'sha",
    country: "Ukraine",
    lat: 46.48, lng: 30.74,
    region: "Black Sea",
    desc: "A Black Sea jewel known for its catacombs and operatic grandeur.",
    lore: "The Odesa Catacombs extend over 2,500 kilometers. That is the official number. Unofficial surveys suggest significantly more — but the surveyors did not return to confirm."
  },
  {
    id: "constanta",
    name: "Constanta",
    corruptedName: "Con'sthanта",
    country: "Romania",
    lat: 44.18, lng: 28.63,
    region: "Black Sea",
    desc: "Romania's chief port, where the Danube's journey ends in the Black Sea.",
    lore: "The Roman poet Ovid was exiled here. His final, unpublished work — found in fragments — describes a transformation far worse than any in the Metamorphoses."
  },
  {
    id: "istanbul",
    name: "Istanbul",
    corruptedName: "Ist'anbul",
    country: "Turkey",
    lat: 41.01, lng: 28.98,
    region: "Black Sea",
    desc: "The city of two continents, straddling the Bosporus with minarets and memory.",
    lore: "The Basilica Cistern holds 80,000 cubic meters of water. The two Medusa-head column bases were placed upside down and sideways — not as decoration, but as containment.",
    sealSite: true
  },
  {
    id: "batumi",
    name: "Batumi",
    corruptedName: "Bat'humi",
    country: "Georgia",
    lat: 41.64, lng: 41.64,
    region: "Black Sea",
    desc: "A subtropical port on the eastern Black Sea, where tea plantations meet the shore.",
    lore: "The Colchis coast, where Jason sought the Golden Fleece. The fleece was a ward. It was never meant to be taken."
  },

  // ─── MIDDLE EAST ────────────────────────────────────────────
  {
    id: "beirut",
    name: "Beirut",
    corruptedName: "Bei'rhut",
    country: "Lebanon",
    lat: 33.89, lng: 35.50,
    region: "Middle East",
    desc: "A phoenix city, rebuilt seven times from its own rubble.",
    lore: "Each time Beirut is destroyed and rebuilt, the new foundations settle a few meters deeper. The city is slowly descending, layer by layer, toward something."
  },
  {
    id: "haifa",
    name: "Haifa",
    corruptedName: "Hai'fha",
    country: "Israel",
    lat: 32.79, lng: 34.99,
    region: "Middle East",
    desc: "A terraced port on Mount Carmel, overlooking a contested bay.",
    lore: "The prophet Elijah hid in caves on Mount Carmel. The caves go deeper than the mountain should allow."
  },
  {
    id: "jeddah",
    name: "Jeddah",
    corruptedName: "Jed'dhah",
    country: "Saudi Arabia",
    lat: 21.49, lng: 39.19,
    region: "Middle East",
    desc: "Gateway to Mecca, a Red Sea port baked in relentless heat.",
    lore: "The Red Sea's deepest brine pools are anoxic — no life survives there. But the Meridian Society's sonar readings detected movement."
  },
  {
    id: "dubai",
    name: "Dubai (Jebel Ali)",
    corruptedName: "Dub'hai",
    country: "UAE",
    lat: 25.01, lng: 55.06,
    region: "Middle East",
    desc: "A port of impossible ambition, conjured from sand and sovereign wealth.",
    lore: "The Palm Islands were built by dredging sand from the seabed. The dredging machines broke through into a cavity. The cavity was pressurized."
  },
  {
    id: "muscat",
    name: "Muscat",
    corruptedName: "Mus'khat",
    country: "Oman",
    lat: 23.61, lng: 58.54,
    region: "Middle East",
    desc: "A quiet sultanate port, sheltered by barren mountains and crystalline waters.",
    lore: "Omani frankincense traders spoke of a customer who never aged, who paid in coins minted by no known civilization, and who always requested passage south."
  },
  {
    id: "aden",
    name: "Aden",
    corruptedName: "Adh'en",
    country: "Yemen",
    lat: 12.80, lng: 45.03,
    region: "Middle East",
    desc: "A port built in the crater of an extinct volcano, guarding the Red Sea's throat.",
    lore: "The volcano is classified as extinct. The classification is periodically reviewed. The review committee has unusual security clearance."
  },

  // ─── EAST AFRICA ────────────────────────────────────────────
  {
    id: "djibouti",
    name: "Djibouti",
    corruptedName: "Djib'outhi",
    country: "Djibouti",
    lat: 11.59, lng: 43.15,
    region: "East Africa",
    desc: "A sun-hammered port at the junction of the Red Sea and the Gulf of Aden.",
    lore: "Lake Assal, nearby, is the lowest point in Africa. Its salt concentration exceeds the Dead Sea. Nothing lives in it. Something, however, has been observed to move in it."
  },
  {
    id: "mogadishu",
    name: "Mogadishu",
    corruptedName: "Mog'adishuh",
    country: "Somalia",
    lat: 2.05, lng: 45.32,
    region: "East Africa",
    desc: "An ancient Indian Ocean trading post, battered by decades of conflict.",
    lore: "Medieval Arab geographers called this coast 'the Land of the Zanj.' They noted that certain coastal caves produced sounds that could not be attributed to wind or waves."
  },
  {
    id: "mombasa",
    name: "Mombasa",
    corruptedName: "Momb'asa",
    country: "Kenya",
    lat: -4.04, lng: 39.67,
    region: "East Africa",
    desc: "A coral island port where Swahili, Portuguese, and Omani histories collide.",
    lore: "Fort Jesus has been besieged, captured, and rebuilt by every power that touched this coast. Each occupier found the same sealed room. Each sealed it again."
  },
  {
    id: "dar_es_salaam",
    name: "Dar es Salaam",
    corruptedName: "Dar es Sal'ahm",
    country: "Tanzania",
    lat: -6.79, lng: 39.28,
    region: "East Africa",
    desc: "The 'Haven of Peace' — a humid, sprawling port on the Swahili coast.",
    lore: "The name means 'Haven of Peace.' Local fishermen have a different name for the deep water beyond the reef. It does not translate to anything peaceful."
  },
  {
    id: "zanzibar",
    name: "Zanzibar (Stone Town)",
    corruptedName: "Zan'zibhar",
    country: "Tanzania",
    lat: -6.16, lng: 39.19,
    region: "East Africa",
    desc: "A spice island whose labyrinthine alleys smell of clove and forgotten trade.",
    lore: "The House of Wonders contains artifacts from Zanzibar's trading past. One artifact, a compass, does not point north. It points down."
  },
  {
    id: "maputo",
    name: "Maputo",
    corruptedName: "Map'utho",
    country: "Mozambique",
    lat: -25.97, lng: 32.57,
    region: "East Africa",
    desc: "A faded colonial port with Art Deco bones and Indian Ocean warmth.",
    lore: "The central train station, designed by an associate of Eiffel, contains a basement level not in the original plans. The basement level contains a sub-basement."
  },

  // ─── WEST AFRICA ────────────────────────────────────────────
  {
    id: "casablanca",
    name: "Casablanca",
    corruptedName: "Casa'blhanca",
    country: "Morocco",
    lat: 33.59, lng: -7.62,
    region: "West Africa",
    desc: "Morocco's economic heart, where the Hassan II Mosque meets the Atlantic.",
    lore: "The Hassan II Mosque is built over the sea, as the king dreamt that the throne of God rests on water. The architects reported the foundation pilings struck something solid far deeper than the seabed."
  },
  {
    id: "dakar",
    name: "Dakar",
    corruptedName: "Dak'har",
    country: "Senegal",
    lat: 14.69, lng: -17.44,
    region: "West Africa",
    desc: "Westernmost point of continental Africa, where the Sahel meets the sea.",
    lore: "Goree Island held the Door of No Return. Meridian archivists believe the door's symbolism runs deeper — that certain thresholds, once crossed, alter what passes through them.",
    sealSite: true
  },
  {
    id: "abidjan",
    name: "Abidjan",
    corruptedName: "Abid'jhan",
    country: "Ivory Coast",
    lat: 5.36, lng: -4.01,
    region: "West Africa",
    desc: "A lagoon-side metropolis and West Africa's largest port.",
    lore: "The Ebrie Lagoon changes color during certain tidal alignments — a phenomenon attributed to algal blooms. The blooms form patterns."
  },
  {
    id: "accra",
    name: "Accra (Tema)",
    corruptedName: "Ak'kra",
    country: "Ghana",
    lat: 5.62, lng: -0.02,
    region: "West Africa",
    desc: "Ghana's gateway port, where gold coast history meets modern commerce.",
    lore: "Cape Coast Castle's dungeons held captives for centuries. The walls are stained with suffering that refuses to fade, despite repeated attempts to whitewash them."
  },
  {
    id: "lagos",
    name: "Lagos",
    corruptedName: "Lag'hos",
    country: "Nigeria",
    lat: 6.45, lng: 3.40,
    region: "West Africa",
    desc: "A megacity of twenty million, pulsing with uncontainable energy.",
    lore: "Lagos grows so fast that new neighborhoods appear on satellite imagery between updates. One neighborhood appeared and then vanished between two passes of the same satellite."
  },
  {
    id: "douala",
    name: "Douala",
    corruptedName: "Dou'ahla",
    country: "Cameroon",
    lat: 4.05, lng: 9.77,
    region: "West Africa",
    desc: "Cameroon's commercial hub, at the mouth of the Wouri River in equatorial heat.",
    lore: "Mount Cameroon, nearby, is the only active volcano in West Africa. Its eruptions follow no geological pattern — but they correlate precisely with seismic events in the Mid-Atlantic Ridge."
  },

  // ─── SOUTHERN AFRICA ────────────────────────────────────────
  {
    id: "luanda",
    name: "Luanda",
    corruptedName: "Lu'andha",
    country: "Angola",
    lat: -8.84, lng: 13.23,
    region: "Southern Africa",
    desc: "An oil-rich port where Portuguese colonial architecture meets African vitality.",
    lore: "Offshore oil platforms in the Angolan basin occasionally report instruments registering a rhythmic pressure variation from extreme depth. The rhythm is too regular to be geological."
  },
  {
    id: "walvis_bay",
    name: "Walvis Bay",
    corruptedName: "Walv'is Bhay",
    country: "Namibia",
    lat: -22.96, lng: 14.51,
    region: "Southern Africa",
    desc: "A desert port where Atlantic fog meets the Namib's red dunes.",
    lore: "The Skeleton Coast earned its name from shipwrecks and whale bones. Some of the bones are from no known species of whale."
  },
  {
    id: "cape_town",
    name: "Cape Town",
    corruptedName: "Cape T'hown",
    country: "South Africa",
    lat: -33.92, lng: 18.42,
    region: "Southern Africa",
    desc: "The Mother City, beneath Table Mountain, where two oceans meet.",
    lore: "The Flying Dutchman is a legend. But the Meridian Society's Cape Town chapter maintains a logbook of sightings — and the intervals between sightings are decreasing."
  },
  {
    id: "durban",
    name: "Durban",
    corruptedName: "Dur'bhan",
    country: "South Africa",
    lat: -29.86, lng: 31.03,
    region: "Southern Africa",
    desc: "Africa's busiest port, where the warm Agulhas current sweeps the KwaZulu-Natal coast.",
    lore: "The Agulhas current carries water from the Indian Ocean around the cape. It also carries things. The Durban harbormaster keeps a locked cabinet of items pulled from intake filters."
  },
  {
    id: "port_louis",
    name: "Port Louis",
    corruptedName: "Port Lou'his",
    country: "Mauritius",
    lat: -20.16, lng: 57.50,
    region: "Southern Africa",
    desc: "A volcanic island port in the Indian Ocean, surrounded by coral and sugar cane.",
    lore: "The 'underwater waterfall' illusion off Mauritius's coast is caused by sand and silt runoff. Except that the current flows the wrong direction for that explanation."
  }
];

/**
 * SEA ROUTES — Navigable connections between ports.
 * No routes through landmass. All edges follow real sea lanes.
 *
 * Chokepoints (strategically critical):
 *   - Gibraltar corridor: lisbon ↔ casablanca ↔ barcelona (Atlantic ↔ Med)
 *   - Suez corridor: alexandria → jeddah (Med ↔ Red Sea)
 *   - Bab el-Mandeb: aden ↔ djibouti (Red Sea ↔ Indian Ocean)
 *   - Bosporus: istanbul (Med ↔ Black Sea)
 *   - English Channel: london ↔ le_havre ↔ amsterdam (North Sea ↔ Atlantic)
 *   - Cape of Good Hope: cape_town (Atlantic ↔ Indian Ocean)
 */
const SEA_ROUTES = {
  // ─── NORTHERN EUROPE (Baltic & North Sea) ──────────────────
  reykjavik:      ["bergen", "edinburgh"],
  bergen:         ["reykjavik", "oslo", "edinburgh", "hamburg"],
  oslo:           ["bergen", "copenhagen", "stockholm"],
  stockholm:      ["oslo", "helsinki", "copenhagen"],
  helsinki:       ["stockholm", "st_petersburg"],
  st_petersburg:  ["helsinki"],
  copenhagen:     ["oslo", "stockholm", "hamburg", "edinburgh"],
  edinburgh:      ["reykjavik", "bergen", "copenhagen", "london"],

  // ─── WESTERN EUROPE (Atlantic & Channel) ───────────────────
  london:         ["edinburgh", "le_havre", "amsterdam", "rotterdam", "antwerp"],
  amsterdam:      ["london", "rotterdam", "hamburg"],
  rotterdam:      ["london", "amsterdam", "antwerp"],
  hamburg:        ["amsterdam", "copenhagen", "bergen", "antwerp"],
  antwerp:        ["london", "rotterdam", "hamburg", "le_havre"],
  le_havre:       ["london", "antwerp", "brest"],
  brest:          ["le_havre", "bilbao", "lisbon"],
  bilbao:         ["brest", "lisbon", "barcelona"],
  lisbon:         ["brest", "bilbao", "casablanca", "dakar"],  // CHOKEPOINT: Atlantic ↔ Med via casablanca

  // ─── MEDITERRANEAN (Western) ───────────────────────────────
  barcelona:      ["bilbao", "marseille", "algiers", "valletta"],
  marseille:      ["barcelona", "genoa"],
  genoa:          ["marseille", "naples", "venice"],
  venice:         ["genoa", "dubrovnik"],
  naples:         ["genoa", "valletta", "tunis", "dubrovnik"],
  valletta:       ["barcelona", "naples", "tunis", "algiers", "alexandria"],
  dubrovnik:      ["venice", "naples", "piraeus"],

  // ─── MEDITERRANEAN (Eastern & Southern) ────────────────────
  piraeus:        ["dubrovnik", "istanbul", "alexandria", "beirut", "valletta"],
  algiers:        ["barcelona", "valletta", "tunis", "casablanca"],
  tunis:          ["naples", "valletta", "algiers"],
  alexandria:     ["valletta", "piraeus", "beirut", "haifa", "jeddah"],  // CHOKEPOINT: Med ↔ Red Sea via jeddah

  // ─── BLACK SEA (through Bosporus only) ─────────────────────
  istanbul:       ["piraeus", "constanta", "odesa", "batumi"],  // CHOKEPOINT: Bosporus
  odesa:          ["istanbul", "constanta"],
  constanta:      ["istanbul", "odesa", "batumi"],
  batumi:         ["istanbul", "constanta"],

  // ─── MIDDLE EAST (Eastern Med + Red Sea + Gulf) ────────────
  beirut:         ["piraeus", "alexandria", "haifa"],
  haifa:          ["alexandria", "beirut", "jeddah"],
  jeddah:         ["alexandria", "haifa", "aden"],               // CHOKEPOINT: Red Sea
  aden:           ["jeddah", "djibouti", "muscat", "mogadishu"], // CHOKEPOINT: Bab el-Mandeb
  dubai:          ["muscat"],
  muscat:         ["aden", "dubai", "mombasa"],                  // Arabian Sea → Indian Ocean

  // ─── EAST AFRICA (Indian Ocean coast, south) ───────────────
  djibouti:       ["aden", "mogadishu"],                         // CHOKEPOINT: Bab el-Mandeb
  mogadishu:      ["aden", "djibouti", "mombasa"],
  mombasa:        ["mogadishu", "muscat", "dar_es_salaam", "zanzibar"],
  dar_es_salaam:  ["mombasa", "zanzibar", "maputo", "port_louis"],
  zanzibar:       ["mombasa", "dar_es_salaam"],
  maputo:         ["dar_es_salaam", "durban"],

  // ─── SOUTHERN AFRICA (around the Cape) ─────────────────────
  durban:         ["maputo", "cape_town", "port_louis"],
  cape_town:      ["durban", "walvis_bay"],                      // CHOKEPOINT: Cape of Good Hope
  walvis_bay:     ["cape_town", "luanda"],
  port_louis:     ["dar_es_salaam", "durban"],                   // Mauritius — Indian Ocean hub

  // ─── WEST AFRICA (Atlantic coast, north to south) ──────────
  casablanca:     ["lisbon", "algiers", "dakar"],                // CHOKEPOINT: Gibraltar corridor
  dakar:          ["lisbon", "casablanca", "abidjan"],
  abidjan:        ["dakar", "accra"],
  accra:          ["abidjan", "lagos"],
  lagos:          ["accra", "douala"],
  douala:         ["lagos", "luanda"],

  // ─── SOUTHERN AFRICA (Atlantic coast) ──────────────────────
  luanda:         ["douala", "walvis_bay"]
};

/**
 * Chokepoint ports — strategically critical, corruption target priority
 */
const CHOKEPOINTS = ["istanbul", "alexandria", "aden", "djibouti", "casablanca", "cape_town", "lisbon", "london"];

/**
 * Travel events — random encounters during sea voyages
 */
const TRAVEL_EVENTS = [
  {
    title: "Dead Calm",
    text: "The wind dies. The sea becomes a mirror. In the perfect stillness, you hear something breathing beneath the hull — vast, slow, patient.",
    choices: [
      { text: "Wait in silence", effect: "sanity", value: -3 },
      { text: "Start the engine and push through", effect: "nothing", value: 0 }
    ]
  },
  {
    title: "The Ghost Light",
    text: "A light appears on the horizon — not a lighthouse, not a ship. It pulses with the rhythm of a heartbeat and seems to be keeping pace with you.",
    choices: [
      { text: "Sail toward it", effect: "sanity", value: -8, bonus: "ghost_light" },
      { text: "Change course away", effect: "sanity", value: -2 }
    ]
  },
  {
    title: "Flotsam",
    text: "You pass through a debris field — splintered wood, torn canvas, a ship's wheel still spinning slowly. The wreckage is fresh. There was no storm.",
    choices: [
      { text: "Search the wreckage", effect: "sanity", value: -5, bonus: "wreck_log" },
      { text: "Sail through quickly", effect: "nothing", value: 0 }
    ]
  },
  {
    title: "The Other Ship",
    text: "A vessel appears off your port bow, matching your heading exactly. Its crew stands at the rail, motionless. Through binoculars, you see they are all looking at you. They are all smiling.",
    choices: [
      { text: "Signal them", effect: "sanity", value: -10, bonus: "phantom_signal" },
      { text: "Full speed ahead", effect: "sanity", value: -3 }
    ]
  },
  {
    title: "Smooth Passage",
    text: "Fair winds and following seas. The charts are true, the stars are right, and for a few blessed hours the world makes sense.",
    choices: [
      { text: "Enjoy the peace (+3 Sanity)", effect: "sanity", value: 3 }
    ]
  },
  {
    title: "The Depth Below",
    text: "Your depth sounder spikes — then drops to zero — then shows a reading so deep it exceeds the instrument's range. The water beneath you is darker than it should be.",
    choices: [
      { text: "Note the coordinates", effect: "sanity", value: -4, bonus: "depth_anomaly" },
      { text: "Don't look down", effect: "sanity", value: -1 }
    ]
  },
  {
    title: "Singing on the Wind",
    text: "A melody carries across the water — no words, no language, just a tone that makes your fillings ache and your compass needle tremble.",
    choices: [
      { text: "Transcribe the melody", effect: "sanity", value: -7, bonus: "sea_hymn" },
      { text: "Plug your ears and steer", effect: "sanity", value: -2 }
    ]
  },
  {
    title: "Storm Warning",
    text: "The barometer drops. The sky turns the color of a bruise. But the storm doesn't break — it hangs overhead, watching, as if deciding whether you're worth the effort.",
    choices: [
      { text: "Ride it out", effect: "sanity", value: -4 },
      { text: "Pray to whatever's listening", effect: "sanity", value: -6, bonus: "storm_prayer" }
    ]
  }
];

// Regions and their thematic colors
const REGION_COLORS = {
  "Northern Europe": "#6699cc",
  "Western Europe":  "#8b7355",
  "Mediterranean":   "#c4a35a",
  "Black Sea":       "#7a6699",
  "Middle East":     "#cc8844",
  "East Africa":     "#55aa77",
  "West Africa":     "#aa7744",
  "Southern Africa": "#669977"
};
