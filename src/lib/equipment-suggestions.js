// ══════════════════════════════════════════════════
//  EQUIPMENT SUGGESTIONS DATABASE
//  Curated specs for popular models per category
// ══════════════════════════════════════════════════

export const EQUIPMENT_SUGGESTIONS = {
  bike: [
    { name: "Canyon Aeroad CF SLX", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Dura-Ace Di2", wheelset: "DT Swiss ARC 1100", tires: "Continental GP5000 S TR 25c", saddle: "Fizik Antares R1", weight: "6.8 kg" }},
    { name: "Canyon Ultimate CF SL", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Ultegra Di2", wheelset: "DT Swiss P1800 Spline", tires: "Continental GP5000 25c", saddle: "Fizik Antares R3", weight: "7.4 kg" }},
    { name: "Canyon Endurace CF", subtype: "Endurance Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano 105 Di2", wheelset: "DT Swiss E1800 Spline", tires: "Continental GP5000 28c", saddle: "Ergon SR Pro", weight: "8.1 kg" }},
    { name: "Canyon Grail CF SLX", subtype: "Gravel", specs: { frame_material: "Carbon", groupset: "SRAM Red XPLR AXS", wheelset: "DT Swiss GRC 1400", tires: "Schwalbe G-One R 40c", saddle: "Fizik Terra Argo X5", weight: "7.5 kg" }},
    { name: "Specialized S-Works Tarmac SL8", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Dura-Ace Di2", wheelset: "Roval Rapide CLX", tires: "S-Works Turbo 26c", saddle: "Body Geometry S-Works Power", weight: "6.7 kg" }},
    { name: "Specialized Diverge Expert", subtype: "Gravel", specs: { frame_material: "Carbon", groupset: "SRAM Rival XPLR AXS", wheelset: "DT Swiss G1800", tires: "Pathfinder Pro 42c", saddle: "Body Geometry Bridge Comp", weight: "9.0 kg" }},
    { name: "Trek Madone SLR", subtype: "Aero Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Dura-Ace Di2", wheelset: "Bontrager Aeolus RSL 51", tires: "Bontrager R4 320 25c", saddle: "Bontrager Aeolus Elite", weight: "7.0 kg" }},
    { name: "Trek Domane SL", subtype: "Endurance Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Ultegra Di2", wheelset: "Bontrager Paradigm Comp 25", tires: "Bontrager R3 Hard-Case Lite 28c", weight: "8.2 kg" }},
    { name: "BMC Teammachine SLR", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Ultegra Di2", wheelset: "DT Swiss PRC 1400", tires: "Vittoria Corsa Pro 25c", weight: "7.1 kg" }},
    { name: "Cervélo S5", subtype: "Aero Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Dura-Ace Di2", wheelset: "Reserve 52/63", tires: "Pirelli P Zero Race 26c", weight: "7.2 kg" }},
    { name: "Giant TCR Advanced Pro", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Ultegra Di2", wheelset: "Giant SLR 1 42", tires: "Giant Gavia Course 1 25c", weight: "7.3 kg" }},
    { name: "Giant Defy Advanced", subtype: "Endurance Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano 105 Di2", wheelset: "Giant P-R2 Disc", tires: "Giant Gavia Course 1 28c", weight: "8.4 kg" }},
    { name: "Cube Litening C:68X", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Ultegra Di2", wheelset: "Newmen Advanced SL", tires: "Continental GP5000 S TR 25c", weight: "7.2 kg" }},
    { name: "Scott Addict RC", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Dura-Ace Di2", wheelset: "Syncros Capital SL", tires: "Schwalbe Pro One 25c", weight: "6.8 kg" }},
    { name: "Rose Reveal", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "Shimano Ultegra Di2", wheelset: "DT Swiss ARC 1400", tires: "Continental GP5000 25c", weight: "7.0 kg" }},
    { name: "Focus Izalco Max", subtype: "Rennrad", specs: { frame_material: "Carbon", groupset: "SRAM Force AXS", tires: "Schwalbe Pro One 25c", weight: "7.3 kg" }},
    { name: "Canyon Spectral CF", subtype: "Trail MTB", specs: { frame_material: "Carbon", groupset: "SRAM GX Eagle AXS", wheelset: "DT Swiss XM 1700", tires: "Maxxis Minion DHF/DHR 29x2.5", weight: "13.5 kg" }},
    { name: "Canyon Lux Trail CF", subtype: "XC MTB", specs: { frame_material: "Carbon", groupset: "SRAM XX SL Eagle AXS", wheelset: "DT Swiss XRC 1200", tires: "Maxxis Aspen 29x2.25", weight: "10.2 kg" }},
    { name: "Specialized Epic", subtype: "XC MTB", specs: { frame_material: "Carbon", groupset: "SRAM XX SL Eagle AXS", wheelset: "Roval Control SL", tires: "Fast Trak / Fast Trak 29x2.2", weight: "10.0 kg" }},
    { name: "Trek Fuel EX", subtype: "Trail MTB", specs: { frame_material: "Carbon", groupset: "Shimano XT", wheelset: "Bontrager Kovee Elite 30", tires: "Bontrager XR4 29x2.4", weight: "13.0 kg" }},
  ],
  running: [
    { name: "Nike Vaporfly 3", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "8mm", stack: "40mm", shoe_weight: "198g", cushioning: "Maximal", midsole: "ZoomX + Carbon Plate" }},
    { name: "Nike Alphafly 3", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "4mm", stack: "40mm", shoe_weight: "215g", cushioning: "Maximal", midsole: "ZoomX + AtomKnit + Carbon Plate" }},
    { name: "Nike Pegasus 41", subtype: "Training", specs: { shoe_type: "Training", drop: "10mm", stack: "33mm", shoe_weight: "265g", cushioning: "Moderat", midsole: "React X" }},
    { name: "Nike Pegasus Trail 5", subtype: "Trail", specs: { shoe_type: "Trail", drop: "9mm", stack: "30mm", shoe_weight: "285g", cushioning: "Moderat", midsole: "React" }},
    { name: "Asics Gel Nimbus 26", subtype: "Training", specs: { shoe_type: "Training", drop: "8mm", stack: "37mm", shoe_weight: "290g", cushioning: "Maximal", midsole: "FF Blast+ Eco" }},
    { name: "Asics Metaspeed Sky Paris", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "5mm", stack: "39.5mm", shoe_weight: "190g", cushioning: "Moderat", midsole: "FF Turbo Plus + Carbon Plate" }},
    { name: "Asics Novablast 4", subtype: "Training", specs: { shoe_type: "Training", drop: "8mm", stack: "34mm", shoe_weight: "258g", cushioning: "Maximal", midsole: "FF Blast+ Eco" }},
    { name: "Asics GT-2000 12", subtype: "Stability", specs: { shoe_type: "Stability", drop: "8mm", stack: "32mm", shoe_weight: "275g", cushioning: "Moderat", midsole: "FF Blast+ Eco" }},
    { name: "Adidas Adizero Adios Pro 3", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "6.5mm", stack: "39mm", shoe_weight: "215g", cushioning: "Moderat", midsole: "Lightstrike Pro + EnergyRods" }},
    { name: "Adidas Ultraboost Light", subtype: "Training", specs: { shoe_type: "Training", drop: "10mm", stack: "32mm", shoe_weight: "290g", cushioning: "Maximal", midsole: "Light Boost" }},
    { name: "Adidas Adizero SL2", subtype: "Training", specs: { shoe_type: "Training", drop: "8.5mm", stack: "33mm", shoe_weight: "235g", cushioning: "Moderat", midsole: "Lightstrike Pro" }},
    { name: "HOKA Mach 6", subtype: "Training", specs: { shoe_type: "Training", drop: "5mm", stack: "35mm", shoe_weight: "232g", cushioning: "Moderat", midsole: "PEBA Foam" }},
    { name: "HOKA Clifton 9", subtype: "Training", specs: { shoe_type: "Training", drop: "5mm", stack: "34mm", shoe_weight: "248g", cushioning: "Maximal", midsole: "Komprimiertes EVA" }},
    { name: "HOKA Bondi 8", subtype: "Training", specs: { shoe_type: "Training", drop: "4mm", stack: "36mm", shoe_weight: "307g", cushioning: "Maximal", midsole: "Komprimiertes EVA" }},
    { name: "HOKA Rocket X 2", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "5mm", stack: "37mm", shoe_weight: "200g", cushioning: "Moderat", midsole: "PEBA + Carbon Plate" }},
    { name: "Saucony Endorphin Speed 4", subtype: "Tempo", specs: { shoe_type: "Training", drop: "8mm", stack: "35.5mm", shoe_weight: "218g", cushioning: "Moderat", midsole: "PWRRUN PB + Nylon Plate" }},
    { name: "Saucony Endorphin Pro 4", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "8mm", stack: "40mm", shoe_weight: "199g", cushioning: "Moderat", midsole: "PWRRUN HG + Carbon Plate" }},
    { name: "New Balance FuelCell SC Elite v4", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "6mm", stack: "39mm", shoe_weight: "195g", cushioning: "Moderat", midsole: "FuelCell + Carbon Plate" }},
    { name: "New Balance Fresh Foam X 1080v13", subtype: "Training", specs: { shoe_type: "Training", drop: "6mm", stack: "32mm", shoe_weight: "290g", cushioning: "Maximal", midsole: "Fresh Foam X" }},
    { name: "On Cloudboom Strike", subtype: "Wettkampf", specs: { shoe_type: "Wettkampf", drop: "9mm", stack: "37mm", shoe_weight: "195g", cushioning: "Moderat", midsole: "Pebax Speedboard + CloudTec" }},
    { name: "On Cloudmonster 2", subtype: "Training", specs: { shoe_type: "Training", drop: "6mm", stack: "35mm", shoe_weight: "260g", cushioning: "Maximal", midsole: "CloudTec Phase" }},
    { name: "Brooks Ghost 16", subtype: "Training", specs: { shoe_type: "Training", drop: "12mm", stack: "34mm", shoe_weight: "276g", cushioning: "Moderat", midsole: "DNA LOFT v2" }},
  ],
  ski: [
    { name: "Atomic Redster S9i", subtype: "Race Slalom", specs: { ski_type: "Race", ski_length: "165cm", ski_radius: "12.5m", ski_width: "118-68-103mm", binding: "X 14 VAR", boots: "Atomic Redster Club Sport" }},
    { name: "Atomic Redster G9i", subtype: "Race GS", specs: { ski_type: "Race", ski_length: "183cm", ski_radius: "21m", ski_width: "107-68-97mm", binding: "X 16 VAR" }},
    { name: "Völkl Racetiger SL", subtype: "Race Slalom", specs: { ski_type: "Race", ski_length: "165cm", ski_radius: "11.8m", ski_width: "121-68-103mm" }},
    { name: "Völkl Deacon 76", subtype: "Piste", specs: { ski_type: "Piste", ski_length: "172cm", ski_radius: "16.3m", ski_width: "123-76-105mm", binding: "rMotion3 12 GW" }},
    { name: "Rossignol Hero Elite ST Ti", subtype: "Race Slalom", specs: { ski_type: "Race", ski_length: "165cm", ski_radius: "12m", ski_width: "123-67-107mm" }},
    { name: "Head Supershape e-Speed", subtype: "Piste Sport", specs: { ski_type: "Piste", ski_length: "177cm", ski_radius: "14.2m", ski_width: "131-72-109mm", binding: "Protector PR 13 GW" }},
    { name: "Nordica Enforcer 100", subtype: "All-Mountain", specs: { ski_type: "All-Mountain", ski_length: "179cm", ski_radius: "18.5m", ski_width: "132-100-120mm" }},
    { name: "Blizzard Rustler 10", subtype: "Freeride", specs: { ski_type: "Freeride", ski_length: "180cm", ski_radius: "18m", ski_width: "134-102-122mm" }},
    { name: "Salomon QST 106", subtype: "Freeride", specs: { ski_type: "Freeride", ski_length: "181cm", ski_radius: "21m", ski_width: "137-106-126mm" }},
    { name: "Black Crows Camox", subtype: "All-Mountain", specs: { ski_type: "All-Mountain", ski_length: "178cm", ski_radius: "16m", ski_width: "128-97-117mm" }},
    { name: "Dynafit Blacklight 88", subtype: "Touring", specs: { ski_type: "Touring", ski_length: "173cm", ski_radius: "18m", ski_width: "113-88-103mm", binding: "Dynafit ST Rotation" }},
    { name: "Fischer Ranger 102 FR", subtype: "Freeride", specs: { ski_type: "Freeride", ski_length: "177cm", ski_radius: "17m", ski_width: "133-102-121mm" }},
    { name: "K2 Mindbender 99Ti", subtype: "Freeride", specs: { ski_type: "Freeride", ski_length: "177cm", ski_radius: "20m", ski_width: "134-99-120mm" }},
    { name: "Tecnica Mach1 MV 130", subtype: "Skischuh Race", specs: { boots: "Tecnica Mach1 MV 130", boot_size: "27.5 Mondo" }},
    { name: "Dalbello Cabrio LV 130", subtype: "Skischuh Freeride", specs: { boots: "Dalbello Cabrio LV 130", boot_size: "27.0 Mondo" }},
  ],
  snowboard: [
    { name: "Burton Custom X", subtype: "All-Mountain", specs: { board_type: "All-Mountain", board_length: "158cm", board_width: "25.6cm Waist", board_flex: "Stiff (7-10)", board_profile: "Camber" }},
    { name: "Burton Custom", subtype: "All-Mountain", specs: { board_type: "All-Mountain", board_length: "156cm", board_width: "25.2cm Waist", board_flex: "Medium (4-6)", board_profile: "Hybrid Camber" }},
    { name: "Burton Process", subtype: "Freestyle", specs: { board_type: "Freestyle", board_length: "155cm", board_width: "25.1cm Waist", board_flex: "Medium (4-6)", board_profile: "Hybrid Camber" }},
    { name: "Jones Mountain Twin", subtype: "All-Mountain", specs: { board_type: "All-Mountain", board_length: "157cm", board_width: "25.5cm Waist", board_flex: "Medium (4-6)", board_profile: "Camber" }},
    { name: "Jones Stratos", subtype: "All-Mountain/Freeride", specs: { board_type: "All-Mountain", board_length: "159cm", board_width: "25.3cm Waist", board_flex: "Medium (4-6)", board_profile: "Hybrid Camber" }},
    { name: "Jones Hovercraft", subtype: "Powder", specs: { board_type: "Powder", board_length: "156cm", board_width: "26.8cm Waist", board_flex: "Medium (4-6)", board_profile: "Hybrid Rocker" }},
    { name: "Capita DOA", subtype: "All-Mountain", specs: { board_type: "All-Mountain", board_length: "158cm", board_width: "25.5cm Waist", board_flex: "Medium (4-6)", board_profile: "Hybrid Camber" }},
    { name: "Capita Mercury", subtype: "All-Mountain", specs: { board_type: "All-Mountain", board_length: "159cm", board_width: "25.6cm Waist", board_flex: "Stiff (7-10)", board_profile: "Hybrid Camber" }},
    { name: "Lib Tech Skate Banana", subtype: "Freestyle", specs: { board_type: "Freestyle", board_length: "154cm", board_width: "25.1cm Waist", board_flex: "Soft (1-3)", board_profile: "Hybrid Rocker" }},
    { name: "Ride Algorythm", subtype: "All-Mountain", specs: { board_type: "All-Mountain", board_length: "158cm", board_width: "25.4cm Waist", board_flex: "Medium (4-6)", board_profile: "Hybrid Camber" }},
    { name: "Nitro Team", subtype: "All-Mountain", specs: { board_type: "All-Mountain", board_length: "157cm", board_width: "25.2cm Waist", board_flex: "Medium (4-6)", board_profile: "Camber" }},
    { name: "Union Force", subtype: "Bindung", specs: { sb_binding: "Union Force" }},
    { name: "Union Strata", subtype: "Bindung", specs: { sb_binding: "Union Strata" }},
    { name: "Burton Cartel X", subtype: "Bindung", specs: { sb_binding: "Burton Cartel X" }},
    { name: "Burton Step On", subtype: "Bindung", specs: { sb_binding: "Burton Step On" }},
  ],
};

/**
 * Simple fuzzy match – returns suggestions sorted by relevance
 * @param {string} query - user input
 * @param {string} category - equipment category key
 * @returns {Array} matching suggestions
 */
export function searchSuggestions(query, category) {
  if (!query || query.length < 2) return [];
  const items = EQUIPMENT_SUGGESTIONS[category] || [];
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/);

  return items
    .map((item) => {
      const name = item.name.toLowerCase();
      const subtype = (item.subtype || "").toLowerCase();
      const target = name + " " + subtype;

      // Score: exact start match > all words match > partial match
      let score = 0;
      if (name.startsWith(q)) score = 100;
      else if (name.includes(q)) score = 80;
      else {
        const matched = words.filter(
          (w) => target.includes(w)
        ).length;
        score = (matched / words.length) * 60;
      }

      return { ...item, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}
