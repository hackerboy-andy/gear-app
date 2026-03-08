import { supabase } from "./supabase";

// ── Equipment CRUD ──

export async function fetchEquipment() {
  const { data: equipment, error } = await supabase
    .from("equipment")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;

  const { data: parts, error: partsError } = await supabase
    .from("wear_parts")
    .select("*")
    .order("created_at", { ascending: true });
  if (partsError) throw partsError;

  return equipment.map((eq) => ({
    id: eq.id,
    category: eq.category,
    name: eq.name,
    subtype: eq.subtype || "",
    image: eq.image,
    serialNumber: eq.serial_number || "",
    purchaseDate: eq.purchase_date || "",
    purchasePrice: Number(eq.purchase_price) || 0,
    retailer: eq.retailer || "",
    notes: eq.notes || "",
    stravaGearId: eq.strava_gear_id || null,
    specs: eq.specs || {},
    totalKm: Number(eq.total_km) || 0,
    wearParts: parts
      .filter((p) => p.equipment_id === eq.id)
      .map((p) => ({
        id: p.id,
        name: p.name,
        icon: p.icon || "",
        brand: p.brand || "–",
        km: Number(p.km) || 0,
        maxKm: Number(p.max_km) || 1000,
        date: p.date || "",
        cost: Number(p.cost) || 0,
      })),
  }));
}

export async function insertEquipment(eq, userId) {
  const { data, error } = await supabase
    .from("equipment")
    .insert({
      user_id: userId,
      category: eq.category,
      name: eq.name,
      subtype: eq.subtype || "",
      serial_number: eq.serialNumber || "",
      purchase_date: eq.purchaseDate || null,
      purchase_price: eq.purchasePrice || 0,
      retailer: eq.retailer || "",
      notes: eq.notes || "",
      strava_gear_id: eq.stravaGearId || null,
      specs: eq.specs || {},
      total_km: eq.totalKm || 0,
    })
    .select()
    .single();
  if (error) throw error;

  if (eq.wearParts && eq.wearParts.length > 0) {
    const partsToInsert = eq.wearParts.map((w) => ({
      equipment_id: data.id,
      user_id: userId,
      name: w.name,
      icon: w.icon || "",
      brand: w.brand || "–",
      km: w.km || 0,
      max_km: w.maxKm || 1000,
      date: w.date || new Date().toISOString().split("T")[0],
      cost: w.cost || 0,
    }));
    const { error: partsError } = await supabase
      .from("wear_parts")
      .insert(partsToInsert);
    if (partsError) throw partsError;
  }

  return data.id;
}

export async function updateEquipment(eqId, fields) {
  const mapping = {};
  if ("name" in fields) mapping.name = fields.name;
  if ("subtype" in fields) mapping.subtype = fields.subtype;
  if ("serialNumber" in fields) mapping.serial_number = fields.serialNumber;
  if ("purchaseDate" in fields) mapping.purchase_date = fields.purchaseDate || null;
  if ("purchasePrice" in fields) mapping.purchase_price = fields.purchasePrice;
  if ("retailer" in fields) mapping.retailer = fields.retailer;
  if ("notes" in fields) mapping.notes = fields.notes;
  if ("specs" in fields) mapping.specs = fields.specs;
  if ("stravaGearId" in fields) mapping.strava_gear_id = fields.stravaGearId;
  if ("totalKm" in fields) mapping.total_km = fields.totalKm;

  if (Object.keys(mapping).length === 0) return;
  const { error } = await supabase
    .from("equipment")
    .update(mapping)
    .eq("id", eqId);
  if (error) throw error;
}

// Keep backward compat alias
export const updateEquipmentField = updateEquipment;

export async function deleteEquipment(eqId) {
  const { error } = await supabase
    .from("equipment")
    .delete()
    .eq("id", eqId);
  if (error) throw error;
}

// ── Wear Parts ──

export async function resetWearPart(wearPartId) {
  const { error } = await supabase
    .from("wear_parts")
    .update({
      km: 0,
      date: new Date().toISOString().split("T")[0],
    })
    .eq("id", wearPartId);
  if (error) throw error;
}

export async function updateWearPart(partId, fields) {
  const mapping = {};
  if ("name" in fields) mapping.name = fields.name;
  if ("icon" in fields) mapping.icon = fields.icon;
  if ("brand" in fields) mapping.brand = fields.brand;
  if ("km" in fields) mapping.km = fields.km;
  if ("maxKm" in fields) mapping.max_km = fields.maxKm;
  if ("date" in fields) mapping.date = fields.date;
  if ("cost" in fields) mapping.cost = fields.cost;

  if (Object.keys(mapping).length === 0) return;
  const { error } = await supabase
    .from("wear_parts")
    .update(mapping)
    .eq("id", partId);
  if (error) throw error;
}

export async function addWearPart(part, equipmentId, userId) {
  const { data, error } = await supabase
    .from("wear_parts")
    .insert({
      equipment_id: equipmentId,
      user_id: userId,
      name: part.name,
      icon: part.icon || "",
      brand: part.brand || "–",
      km: part.km || 0,
      max_km: part.maxKm || 1000,
      date: part.date || new Date().toISOString().split("T")[0],
      cost: part.cost || 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data.id;
}

export async function deleteWearPart(partId) {
  const { error } = await supabase
    .from("wear_parts")
    .delete()
    .eq("id", partId);
  if (error) throw error;
}
