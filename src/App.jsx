import { useState, useEffect, useCallback } from "react";
import { supabase } from "./lib/supabase";
import {
  fetchEquipment,
  insertEquipment,
  updateEquipmentField,
  deleteEquipment,
  resetWearPart,
} from "./lib/db";

/* ═══════════════════════════════════════════════════════
   SPORT EQUIPMENT DATABASE + WEAR TRACKER
   Light, athletic, clean design – with Supabase Auth
   ═══════════════════════════════════════════════════════ */

const C = {
  bg: "#F4F5F9", card: "#FFFFFF", text: "#1A1D26", sub: "#7B8794", muted: "#C1C7D0",
  border: "#E8ECF1", accent: "#2563EB", accentLight: "#2563EB10",
  green: "#10B981", greenLight: "#10B98110", orange: "#F59E0B", orangeLight: "#F59E0B10",
  red: "#EF4444", redLight: "#EF444410", purple: "#7C3AED",
};

// ── Sport Category Definitions ──
const CATEGORIES = {
  bike: {
    label: "Fahrrad", emoji: "🚲", color: "#2563EB",
    specFields: [
      { key: "frame_material", label: "Rahmenmaterial", type: "select", options: ["Carbon", "Aluminium", "Stahl", "Titan"] },
      { key: "frame_size", label: "Rahmengröße", type: "text", placeholder: "z.B. 56cm / M" },
      { key: "groupset", label: "Schaltgruppe", type: "text", placeholder: "z.B. Shimano Ultegra Di2" },
      { key: "wheelset", label: "Laufradsatz", type: "text", placeholder: "z.B. Zipp 303 Firecrest" },
      { key: "tires", label: "Bereifung", type: "text", placeholder: "z.B. Continental GP5000 25c" },
      { key: "saddle", label: "Sattel", type: "text", placeholder: "z.B. Fizik Arione R1" },
      { key: "handlebar", label: "Lenker", type: "text", placeholder: "z.B. Deda Superzero 42cm" },
      { key: "stem", label: "Vorbau", type: "text", placeholder: "z.B. 110mm -6°" },
      { key: "pedals", label: "Pedale", type: "text", placeholder: "z.B. Shimano SPD-SL" },
      { key: "weight", label: "Gewicht", type: "text", placeholder: "z.B. 7.2 kg" },
    ],
    wearParts: [
      { name: "Kette", icon: "⛓️", defaultMax: 5000 },
      { name: "Bremsbeläge vorne", icon: "🛑", defaultMax: 5000 },
      { name: "Bremsbeläge hinten", icon: "🛑", defaultMax: 5000 },
      { name: "Reifen vorne", icon: "◉", defaultMax: 6000 },
      { name: "Reifen hinten", icon: "◉", defaultMax: 6000 },
      { name: "Kassette", icon: "⚙️", defaultMax: 15000 },
      { name: "Lenkerband", icon: "🎗️", defaultMax: 3000 },
      { name: "Schaltzüge", icon: "🔗", defaultMax: 10000 },
    ],
  },
  running: {
    label: "Laufschuh", emoji: "👟", color: "#10B981",
    specFields: [
      { key: "shoe_size", label: "Größe", type: "text", placeholder: "z.B. 43 EU / 9.5 US" },
      { key: "shoe_type", label: "Typ", type: "select", options: ["Wettkampf", "Training", "Trail", "Stability", "Recovery"] },
      { key: "drop", label: "Sprengung (Drop)", type: "text", placeholder: "z.B. 8mm" },
      { key: "stack", label: "Stack Height", type: "text", placeholder: "z.B. 36mm" },
      { key: "shoe_weight", label: "Gewicht", type: "text", placeholder: "z.B. 198g" },
      { key: "cushioning", label: "Dämpfung", type: "select", options: ["Maximal", "Moderat", "Minimal", "Barfuß"] },
      { key: "upper", label: "Obermaterial", type: "text", placeholder: "z.B. Flyknit" },
      { key: "midsole", label: "Zwischensohle", type: "text", placeholder: "z.B. ZoomX + Carbon Plate" },
    ],
    wearParts: [
      { name: "Schuh gesamt", icon: "👟", defaultMax: 700 },
    ],
  },
  ski: {
    label: "Ski", emoji: "⛷️", color: "#EF4444",
    specFields: [
      { key: "ski_length", label: "Länge", type: "text", placeholder: "z.B. 170cm" },
      { key: "ski_radius", label: "Radius", type: "text", placeholder: "z.B. 14m" },
      { key: "ski_width", label: "Taillierung", type: "text", placeholder: "z.B. 120-68-104mm" },
      { key: "ski_type", label: "Typ", type: "select", options: ["Piste", "All-Mountain", "Freeride", "Touring", "Race"] },
      { key: "binding", label: "Bindung", type: "text", placeholder: "z.B. Marker Griffon 13" },
      { key: "boots", label: "Skischuhe", type: "text", placeholder: "z.B. Tecnica Mach1 MV 130" },
      { key: "boot_size", label: "Schuhgröße", type: "text", placeholder: "z.B. 27.5 Mondo" },
    ],
    wearParts: [
      { name: "Kanten", icon: "🔪", defaultMax: 100 },
      { name: "Belag", icon: "🧊", defaultMax: 30 },
      { name: "Bindung", icon: "🔧", defaultMax: 200 },
    ],
  },
  snowboard: {
    label: "Snowboard", emoji: "🏂", color: "#7C3AED",
    specFields: [
      { key: "board_length", label: "Länge", type: "text", placeholder: "z.B. 158cm" },
      { key: "board_width", label: "Breite", type: "text", placeholder: "z.B. 25.5cm Waist" },
      { key: "board_type", label: "Typ", type: "select", options: ["All-Mountain", "Freestyle", "Freeride", "Powder", "Park"] },
      { key: "board_flex", label: "Flex", type: "select", options: ["Soft (1-3)", "Medium (4-6)", "Stiff (7-10)"] },
      { key: "board_profile", label: "Profil", type: "select", options: ["Camber", "Rocker", "Flat", "Hybrid Camber", "Hybrid Rocker"] },
      { key: "sb_binding", label: "Bindung", type: "text", placeholder: "z.B. Union Force" },
      { key: "sb_boots", label: "Boots", type: "text", placeholder: "z.B. Burton Ion 43" },
    ],
    wearParts: [
      { name: "Kanten", icon: "🔪", defaultMax: 80 },
      { name: "Belag", icon: "🧊", defaultMax: 25 },
      { name: "Bindung", icon: "🔧", defaultMax: 150 },
    ],
  },
};

// ── Strava Simulated Data ──
const STRAVA_GEAR = [
  { strava_id: "b12345678", name: "Canyon Aeroad", type: "bike", distance: 12847000 },
  { strava_id: "b87654321", name: "Diverge Expert", type: "bike", distance: 4230000 },
  { strava_id: "g11223344", name: "Vaporfly 3", type: "shoes", distance: 487000 },
  { strava_id: "g44332211", name: "Gel Nimbus 26", type: "shoes", distance: 312000 },
];

const STRAVA_ACTIVITIES = [
  { id: "sa1", name: "Morgenrunde Isar", type: "Ride", date: "2026-03-05", distance: 62400, gear_id: "b12345678", trainer: false, elapsed: 7200 },
  { id: "sa2", name: "Tempo-Lauf Olympiapark", type: "Run", date: "2026-03-04", distance: 8200, gear_id: "g11223344", trainer: false, elapsed: 2400 },
  { id: "sa3", name: "Zwift – Watopia Flat", type: "Ride", date: "2026-03-03", distance: 35000, gear_id: "b12345678", trainer: true, elapsed: 3600 },
  { id: "sa4", name: "Gravel Isartrails", type: "Ride", date: "2026-03-02", distance: 44800, gear_id: "b87654321", trainer: false, elapsed: 6900 },
  { id: "sa5", name: "Easy Run Engl. Garten", type: "Run", date: "2026-03-01", distance: 6500, gear_id: "g44332211", trainer: false, elapsed: 2100 },
  { id: "sa6", name: "Intervalle Treadmill", type: "Run", date: "2026-02-28", distance: 10000, gear_id: "g11223344", trainer: true, elapsed: 2700 },
  { id: "sa7", name: "Sonntagsrunde", type: "Ride", date: "2026-02-27", distance: 88400, gear_id: "b12345678", trainer: false, elapsed: 10800 },
];

// ── Helpers ──
const fmtKm = (n) => n.toLocaleString("de-DE");
const fmtDate = (d) => d ? new Date(d).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) : "–";
const fmtMoney = (n) => n.toLocaleString("de-DE") + " €";
const pct = (km, mx) => mx > 0 ? Math.min(Math.round((km / mx) * 100), 100) : 0;
const wearColor = (p) => p >= 90 ? C.red : p >= 75 ? C.orange : p >= 50 ? "#FDCB6E" : C.green;
const worstWear = (eq) => eq.wearParts.length > 0 ? Math.max(...eq.wearParts.map(w => pct(w.km, w.maxKm))) : 0;

// ── Arc Progress ──
function Arc({ percent, size = 48, stroke = 4 }) {
  const c = wearColor(percent);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.border} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - Math.min(percent / 100, 1))}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }} />
    </svg>
  );
}

// ── Logo ──
function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs><linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={C.accent}/><stop offset="100%" stopColor={C.green}/></linearGradient></defs>
      <circle cx="50" cy="50" r="42" fill="none" stroke={C.border} strokeWidth="7" strokeDasharray="198 66" strokeLinecap="round" transform="rotate(-225 50 50)"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#lg1)" strokeWidth="7" strokeDasharray="165 99" strokeLinecap="round" transform="rotate(-225 50 50)"/>
      <circle cx="50" cy="50" r="10" fill="url(#lg1)" opacity="0.85"/>
    </svg>
  );
}

// ══════════════════════════════════════
//  AUTH SCREEN
// ══════════════════════════════════════
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup | reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const inp = {
    width: "100%", background: C.bg, border: "2px solid transparent", borderRadius: 12,
    padding: "13px 16px", color: C.text, fontSize: 15, outline: "none", boxSizing: "border-box",
    fontFamily: "'Satoshi', sans-serif", transition: "border-color 0.2s",
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Check deine E-Mails für den Bestätigungslink!");
        setMode("login");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage("Password-Reset Link gesendet!");
        setMode("login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Satoshi', 'DM Sans', -apple-system, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 24px" }}>
        {/* Logo + Title */}
        <div style={{ textAlign: "center", marginBottom: 36, animation: "si 0.4s both" }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <Logo size={48} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: C.text, letterSpacing: -0.5 }}>My Gear</h1>
          <p style={{ fontSize: 13, color: C.sub, marginTop: 6 }}>Sport Equipment Tracker</p>
        </div>

        {/* Form Card */}
        <div style={{ background: C.card, borderRadius: 20, padding: "28px 24px", border: `1px solid ${C.border}`, animation: "si 0.45s 0.05s both" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>
            {mode === "login" ? "Willkommen zurück" : mode === "signup" ? "Account erstellen" : "Passwort zurücksetzen"}
          </h2>
          <p style={{ fontSize: 12, color: C.sub, marginBottom: 20 }}>
            {mode === "login" ? "Melde dich an, um dein Gear zu verwalten" : mode === "signup" ? "Registriere dich kostenlos" : "Wir senden dir einen Reset-Link"}
          </p>

          {error && (
            <div style={{ background: C.redLight, border: `1px solid ${C.red}25`, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.red, fontWeight: 600 }}>{error}</div>
            </div>
          )}

          {message && (
            <div style={{ background: C.greenLight, border: `1px solid ${C.green}25`, borderRadius: 12, padding: "10px 14px", marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>{message}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 4 }}>E-Mail</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.de" required style={inp}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => e.target.style.borderColor = "transparent"}
              />
            </div>

            {mode !== "reset" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 4 }}>Passwort</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder={mode === "signup" ? "Min. 6 Zeichen" : "Dein Passwort"} required
                  minLength={mode === "signup" ? 6 : undefined} style={inp}
                  onFocus={e => e.target.style.borderColor = C.accent}
                  onBlur={e => e.target.style.borderColor = "transparent"}
                />
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: 14, borderRadius: 14, border: "none",
              background: loading ? C.muted : C.accent, color: "#fff",
              fontSize: 15, fontWeight: 700, cursor: loading ? "default" : "pointer",
              transition: "background 0.2s", marginBottom: 12,
            }}>
              {loading ? "Laden..." : mode === "login" ? "Anmelden" : mode === "signup" ? "Registrieren" : "Link senden"}
            </button>
          </form>

          {/* Mode switchers */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {mode === "login" && (
              <>
                <button onClick={() => { setMode("signup"); setError(null); setMessage(null); }} style={{ background: "none", border: "none", fontSize: 12, color: C.accent, fontWeight: 600, cursor: "pointer" }}>
                  Noch kein Account? Registrieren
                </button>
                <button onClick={() => { setMode("reset"); setError(null); setMessage(null); }} style={{ background: "none", border: "none", fontSize: 11, color: C.muted, cursor: "pointer" }}>
                  Passwort vergessen?
                </button>
              </>
            )}
            {(mode === "signup" || mode === "reset") && (
              <button onClick={() => { setMode("login"); setError(null); setMessage(null); }} style={{ background: "none", border: "none", fontSize: 12, color: C.accent, fontWeight: 600, cursor: "pointer" }}>
                Zurück zum Login
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 10, color: C.muted, marginTop: 20, animation: "si 0.5s 0.1s both" }}>
          Deine Daten werden sicher in der Cloud gespeichert
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  SCREEN: EQUIPMENT LIST (HOME)
// ══════════════════════════════════════
function EquipmentList({ equipment, onSelect, onAdd }) {
  const grouped = {};
  equipment.forEach(eq => {
    if (!grouped[eq.category]) grouped[eq.category] = [];
    grouped[eq.category].push(eq);
  });

  const totalValue = equipment.reduce((s, e) => s + (e.purchasePrice || 0), 0);
  const totalItems = equipment.length;
  const alerts = equipment.reduce((n, e) => n + e.wearParts.filter(w => pct(w.km, w.maxKm) >= 75).length, 0);

  return (
    <>
      {/* Summary bar */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 12px", animation: "si 0.35s both" }}>
        {[
          { v: totalItems, l: "Geräte", c: C.accent },
          { v: fmtMoney(totalValue), l: "Wert", c: C.purple },
          { v: alerts, l: "Alerts", c: alerts > 0 ? C.red : C.green },
        ].map(s => (
          <div key={s.l} style={{ flex: 1, background: C.card, borderRadius: 14, padding: "12px 10px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: s.c, fontFamily: "'JetBrains Mono', monospace" }}>{s.v}</div>
            <div style={{ fontSize: 9, color: C.sub, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Category groups */}
      {Object.entries(CATEGORIES).map(([catKey, catDef]) => {
        const items = grouped[catKey] || [];
        return (
          <div key={catKey} style={{ marginBottom: 16, animation: "si 0.4s 0.05s both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 18 }}>{catDef.emoji}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.sub, letterSpacing: 1, textTransform: "uppercase" }}>{catDef.label}e</span>
                <span style={{ fontSize: 10, color: C.muted, fontFamily: "'JetBrains Mono', monospace" }}>{items.length}</span>
              </div>
              <button onClick={() => onAdd(catKey)} style={{ background: catDef.color + "10", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 10, fontWeight: 700, color: catDef.color, cursor: "pointer" }}>+ Neu</button>
            </div>

            {items.length === 0 ? (
              <div style={{ margin: "0 16px", background: C.card, borderRadius: 14, padding: "20px", textAlign: "center", border: `2px dashed ${C.border}`, cursor: "pointer" }} onClick={() => onAdd(catKey)}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{catDef.emoji}</div>
                <div style={{ fontSize: 12, color: C.sub }}>Erstes {catDef.label} hinzufügen</div>
              </div>
            ) : (
              <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((eq, i) => {
                  const ww = worstWear(eq);
                  const wc = wearColor(ww);
                  return (
                    <div key={eq.id} onClick={() => onSelect(eq.id)} style={{
                      background: C.card, borderRadius: 16, padding: "14px 16px",
                      display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                      border: `1px solid ${ww >= 85 ? wc + '30' : C.border}`,
                      animation: `si 0.4s ${0.08 + i * 0.04}s both`,
                      transition: "box-shadow 0.2s",
                    }}>
                      <div style={{ position: "relative", flexShrink: 0 }}>
                        <Arc percent={ww} size={50} stroke={4} />
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{catDef.emoji}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{eq.name}</div>
                        <div style={{ fontSize: 10.5, color: C.sub, marginTop: 1 }}>{eq.subtype}</div>
                        <div style={{ display: "flex", gap: 10, marginTop: 4, fontSize: 10, color: C.muted, fontFamily: "'JetBrains Mono', monospace" }}>
                          {eq.totalKm > 0 && <span>{fmtKm(eq.totalKm)} km</span>}
                          <span>{eq.wearParts.length} Teile</span>
                          {eq.serialNumber && <span>SN: {eq.serialNumber.slice(0, 8)}…</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 17, fontWeight: 800, color: wc, fontFamily: "'JetBrains Mono', monospace" }}>{ww}%</div>
                        <div style={{ fontSize: 8, color: C.muted, marginTop: 1 }}>max wear</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

// ══════════════════════════════════════
//  SCREEN: EQUIPMENT DETAIL
// ══════════════════════════════════════
function EquipmentDetail({ eq, catDef, onBack, onResetWear }) {
  const [detailTab, setDetailTab] = useState("info");
  const totalPartsCost = eq.wearParts.reduce((s, w) => s + (w.cost || 0), 0);
  const avgWear = eq.wearParts.length > 0 ? Math.round(eq.wearParts.reduce((s, w) => s + pct(w.km, w.maxKm), 0) / eq.wearParts.length) : 0;

  return (
    <>
      {/* Back + Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px 12px", animation: "si 0.3s both" }}>
        <button onClick={onBack} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{eq.name}</div>
          <div style={{ fontSize: 11, color: C.sub }}>{eq.subtype} · {catDef.label}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: catDef.color + "10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{catDef.emoji}</div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px 12px", animation: "si 0.35s 0.03s both" }}>
        {[
          { v: fmtKm(eq.totalKm), l: "km", c: C.accent },
          { v: avgWear + "%", l: "Ø wear", c: wearColor(avgWear) },
          { v: fmtMoney(eq.purchasePrice || 0), l: "Kaufpreis", c: C.purple },
          { v: fmtMoney(totalPartsCost), l: "Teile", c: C.green },
        ].map(s => (
          <div key={s.l} style={{ flex: 1, background: C.card, borderRadius: 12, padding: "10px 6px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: s.c, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 8, color: C.sub, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase", marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, padding: "0 16px 10px", animation: "si 0.35s 0.06s both" }}>
        {[
          { id: "info", label: "📋 Stammdaten" },
          { id: "specs", label: "🔧 Ausstattung" },
          { id: "wear", label: "📊 Verschleiß" },
        ].map(t => (
          <button key={t.id} onClick={() => setDetailTab(t.id)} style={{
            flex: 1, padding: "9px 0", borderRadius: 10, border: "none",
            background: detailTab === t.id ? C.card : "transparent",
            color: detailTab === t.id ? C.text : C.muted,
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            boxShadow: detailTab === t.id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
            transition: "all 0.2s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── INFO TAB ── */}
      {detailTab === "info" && (
        <div style={{ padding: "0 16px", animation: "si 0.3s both" }}>
          <div style={{ background: C.card, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {[
              { label: "Marke / Modell", value: eq.name },
              { label: "Typ", value: eq.subtype },
              { label: "Seriennr. / Rahmennr.", value: eq.serialNumber || "–" },
              { label: "Kaufdatum", value: fmtDate(eq.purchaseDate) },
              { label: "Kaufpreis", value: eq.purchasePrice ? fmtMoney(eq.purchasePrice) : "–" },
              { label: "Händler", value: eq.retailer || "–" },
              { label: "Notizen", value: eq.notes || "–" },
            ].map((row, i, arr) => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none", gap: 16 }}>
                <span style={{ fontSize: 12, color: C.sub, flexShrink: 0, fontWeight: 600, minWidth: 110 }}>{row.label}</span>
                <span style={{ fontSize: 12.5, color: C.text, fontWeight: 600, textAlign: "right", wordBreak: "break-word" }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Strava pairing status */}
          {(eq.category === "bike" || eq.category === "running") && (
            <div style={{ marginTop: 12, background: eq.stravaGearId ? C.greenLight : C.orangeLight, borderRadius: 14, padding: "14px 16px", border: `1px solid ${eq.stravaGearId ? C.green + "25" : C.orange + "25"}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: "#FC4C0212", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#FC4C02" }}>S</div>
                <div style={{ flex: 1 }}>
                  {eq.stravaGearId ? (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.green }}>✓ Strava verbunden</div>
                      <div style={{ fontSize: 10, color: C.sub }}>Gear-ID: {eq.stravaGearId} · km werden automatisch gesynct</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.orange }}>Nicht mit Strava verbunden</div>
                      <div style={{ fontSize: 10, color: C.sub }}>Öffne Strava-Pairing in der Header-Leiste</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Image placeholder */}
          <div style={{ marginTop: 12, background: C.card, borderRadius: 16, padding: 24, textAlign: "center", border: `2px dashed ${C.border}`, cursor: "pointer" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
            <div style={{ fontSize: 12, color: C.sub }}>Foto hinzufügen</div>
            <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Für Versicherung & Dokumentation</div>
          </div>
        </div>
      )}

      {/* ── SPECS TAB ── */}
      {detailTab === "specs" && (
        <div style={{ padding: "0 16px", animation: "si 0.3s both" }}>
          <div style={{ background: C.card, borderRadius: 16, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {catDef.specFields.map((field, i, arr) => (
              <div key={field.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none", gap: 16 }}>
                <span style={{ fontSize: 12, color: C.sub, fontWeight: 600, flexShrink: 0 }}>{field.label}</span>
                <span style={{ fontSize: 12.5, color: eq.specs?.[field.key] ? C.text : C.muted, fontWeight: 600, textAlign: "right" }}>
                  {eq.specs?.[field.key] || "–"}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12, background: C.accentLight, borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14 }}>✏️</span>
            <div style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>Tippe auf ein Feld zum Bearbeiten</div>
          </div>
        </div>
      )}

      {/* ── WEAR TAB ── */}
      {detailTab === "wear" && (
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8, animation: "si 0.3s both" }}>
          {eq.wearParts.sort((a, b) => pct(b.km, b.maxKm) - pct(a.km, a.maxKm)).map((w, i) => {
            const p = pct(w.km, w.maxKm);
            const remaining = Math.max(0, w.maxKm - w.km);
            const c = wearColor(p);
            return (
              <div key={w.id} style={{
                background: C.card, borderRadius: 16, padding: "14px 16px",
                display: "flex", alignItems: "center", gap: 12,
                border: `1px solid ${p >= 85 ? c + '30' : C.border}`,
                position: "relative", overflow: "hidden",
                animation: `si 0.4s ${0.04 * i}s both`,
              }}>
                {p >= 85 && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3.5, background: c }} />}
                <div style={{ position: "relative" }}>
                  <Arc percent={p} size={48} stroke={4} />
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: c, fontFamily: "'JetBrains Mono', monospace" }}>{p}%</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                    <span style={{ fontSize: 12 }}>{w.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{w.name}</span>
                    {p >= 90 && <span style={{ fontSize: 8, fontWeight: 800, color: C.red, background: C.redLight, padding: "2px 7px", borderRadius: 6, letterSpacing: 0.4 }}>TAUSCH</span>}
                  </div>
                  <div style={{ fontSize: 10, color: C.sub, fontFamily: "'JetBrains Mono', monospace", marginBottom: 5 }}>{w.brand} · {fmtDate(w.date)}</div>
                  <div style={{ height: 4, background: C.bg, borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 2, width: `${Math.min(p, 100)}%`, background: c, transition: "width 0.8s cubic-bezier(.4,0,.2,1)" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 9, color: C.muted }}>
                    <span>{fmtKm(w.km)} km</span><span>{fmtKm(w.maxKm)} km</span>
                  </div>
                </div>
                <div style={{ textAlign: "center", flexShrink: 0, minWidth: 50 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: c, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{fmtKm(remaining)}</div>
                  <div style={{ fontSize: 8, color: C.muted, marginTop: 1 }}>km left</div>
                  <button onClick={() => onResetWear(eq.id, w.id)} style={{ marginTop: 5, fontSize: 9, fontWeight: 600, color: C.accent, background: C.accentLight, border: "none", borderRadius: 7, padding: "3px 9px", cursor: "pointer" }}>↻ Reset</button>
                </div>
              </div>
            );
          })}

          <div style={{ background: C.card, borderRadius: 14, padding: "14px", textAlign: "center", border: `2px dashed ${C.border}`, cursor: "pointer" }}>
            <span style={{ fontSize: 12, color: C.sub }}>+ Verschleißteil hinzufügen</span>
          </div>
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════
//  SCREEN: ADD EQUIPMENT
// ══════════════════════════════════════
function AddEquipmentSheet({ category, catDef, onClose, onSave }) {
  const [name, setName] = useState("");
  const [subtype, setSubtype] = useState("");
  const [serial, setSerial] = useState("");
  const [price, setPrice] = useState("");
  const [retailer, setRetailer] = useState("");
  const [notes, setNotes] = useState("");
  const [specs, setSpecs] = useState({});
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const inp = { width: "100%", background: C.bg, border: `2px solid transparent`, borderRadius: 12, padding: "11px 14px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Satoshi', sans-serif", transition: "border-color 0.2s" };

  async function handleSave() {
    if (!name.trim() || saving) return;
    setSaving(true);
    try {
      await onSave({
        category, name: name.trim(), subtype: subtype || catDef.label,
        serialNumber: serial, purchaseDate: new Date().toISOString().split("T")[0],
        purchasePrice: Number(price) || 0, retailer, notes, specs,
        totalKm: 0, wearParts: catDef.wearParts.map((wp, i) => ({
          id: "wnew" + Date.now() + i, name: wp.name, icon: wp.icon, brand: "–",
          km: 0, maxKm: wp.defaultMax, date: new Date().toISOString().split("T")[0], cost: 0,
        })),
      });
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, animation: "fi 0.2s" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", padding: "6px 22px 30px", width: "100%", maxWidth: 430, maxHeight: "88vh", overflowY: "auto", animation: "su 0.3s cubic-bezier(.4,0,.2,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 14px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: catDef.color + "10", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{catDef.emoji}</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Neues {catDef.label}</h3>
            <div style={{ fontSize: 11, color: C.sub }}>Schritt {step} von 2</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: C.accent }} />
          <div style={{ flex: 1, height: 3, borderRadius: 2, background: step >= 2 ? C.accent : C.border, transition: "background 0.3s" }} />
        </div>

        {step === 1 && (
          <>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 3 }}>Name / Modell *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={`z.B. ${category === "bike" ? "Canyon Aeroad CF SLX" : category === "running" ? "Nike Vaporfly 3" : category === "ski" ? "Atomic Redster S9i" : "Burton Custom X"}`} style={inp} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = "transparent"} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 3 }}>Typ / Kategorie</label>
              <input value={subtype} onChange={e => setSubtype(e.target.value)} placeholder={`z.B. ${category === "bike" ? "Rennrad / Gravel / MTB" : category === "running" ? "Wettkampf / Training" : "All-Mountain / Race"}`} style={inp} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = "transparent"} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 3 }}>Seriennummer / Rahmennummer</label>
              <input value={serial} onChange={e => setSerial(e.target.value)} placeholder="Optional – für Versicherung & Diebstahl" style={inp} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = "transparent"} />
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 3 }}>Kaufpreis (€)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" style={inp} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = "transparent"} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 3 }}>Händler</label>
                <input value={retailer} onChange={e => setRetailer(e.target.value)} placeholder="z.B. Canyon.com" style={inp} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = "transparent"} />
              </div>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 3 }}>Notizen</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Farbe, Besonderheiten..." style={inp} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = "transparent"} />
            </div>
            <button onClick={() => { if (name.trim()) setStep(2); }} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: name.trim() ? C.accent : C.border, color: "#fff", fontSize: 15, fontWeight: 700, cursor: name.trim() ? "pointer" : "default", transition: "background 0.2s" }}>Weiter → Ausstattung</button>
          </>
        )}

        {step === 2 && (
          <>
            {catDef.specFields.map(field => (
              <div key={field.key} style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.sub, display: "block", marginBottom: 3 }}>{field.label}</label>
                {field.type === "select" ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {field.options.map(opt => (
                      <button key={opt} onClick={() => setSpecs(s => ({ ...s, [field.key]: opt }))} style={{
                        background: specs[field.key] === opt ? C.accent + "12" : C.bg,
                        border: `1.5px solid ${specs[field.key] === opt ? C.accent : "transparent"}`,
                        borderRadius: 10, padding: "7px 12px", fontSize: 12, color: specs[field.key] === opt ? C.accent : C.sub,
                        cursor: "pointer", fontWeight: 600, transition: "all 0.15s",
                      }}>{opt}</button>
                    ))}
                  </div>
                ) : (
                  <input value={specs[field.key] || ""} onChange={e => setSpecs(s => ({ ...s, [field.key]: e.target.value }))} placeholder={field.placeholder} style={inp} onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = "transparent"} />
                )}
              </div>
            ))}

            <div style={{ fontSize: 11, color: C.sub, marginBottom: 14, background: C.greenLight, borderRadius: 10, padding: "10px 14px" }}>
              <strong style={{ color: C.green }}>✓</strong> Standard-Verschleißteile werden automatisch angelegt. Du kannst sie danach anpassen.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, borderRadius: 14, border: `1px solid ${C.border}`, background: "transparent", color: C.sub, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Zurück</button>
              <button onClick={handleSave} disabled={saving} style={{ flex: 2, padding: 14, borderRadius: 14, border: "none", background: saving ? C.muted : C.accent, color: "#fff", fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer" }}>{saving ? "Speichert..." : "Speichern ✓"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  STRAVA PAIRING SHEET
// ══════════════════════════════════════
function StravaPairingSheet({ equipment, stravaGear, onPair, onUnpair, onClose }) {
  const pairedIds = equipment.filter(e => e.stravaGearId).map(e => e.stravaGearId);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, animation: "fi 0.2s" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", padding: "6px 22px 30px", width: "100%", maxWidth: 430, maxHeight: "88vh", overflowY: "auto", animation: "su 0.3s cubic-bezier(.4,0,.2,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 14px" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FC4C0212", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#FC4C02" }}>S</div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text }}>Strava Gear-Pairing</h3>
            <div style={{ fontSize: 11, color: C.sub }}>Verbinde Strava-Gear mit deinem Equipment</div>
          </div>
        </div>

        <div style={{ background: "#FC4C0208", borderRadius: 12, padding: "12px 14px", marginBottom: 18, border: "1px solid #FC4C0215" }}>
          <div style={{ fontSize: 11, color: "#FC4C02", fontWeight: 600, marginBottom: 4 }}>So funktioniert's:</div>
          <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5 }}>
            Strava kennt deine Bikes & Schuhe. Verbinde jedes Strava-Gear mit dem passenden Equipment hier – danach werden neue Aktivitäten automatisch zugeordnet und km auf die richtigen Verschleißteile gebucht.
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: C.sub, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 8 }}>STRAVA GEAR ({stravaGear.length})</div>

        {stravaGear.map(sg => {
          const pairedEq = equipment.find(e => e.stravaGearId === sg.strava_id);
          const isPaired = !!pairedEq;
          const compatibleEquipment = equipment.filter(e =>
            !e.stravaGearId &&
            ((sg.type === "bike" && e.category === "bike") || (sg.type === "shoes" && e.category === "running"))
          );

          return (
            <div key={sg.strava_id} style={{
              background: isPaired ? C.greenLight : C.bg,
              borderRadius: 14, padding: "14px 16px", marginBottom: 10,
              border: `1px solid ${isPaired ? C.green + "30" : C.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: isPaired ? 8 : 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FC4C0210", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 16 }}>{sg.type === "bike" ? "🚲" : "👟"}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{sg.name}</div>
                  <div style={{ fontSize: 10, color: C.sub, fontFamily: "'JetBrains Mono', monospace" }}>
                    {fmtKm(Math.round(sg.distance / 1000))} km · Strava {sg.type === "bike" ? "Bike" : "Shoe"}
                  </div>
                </div>
                {isPaired && (
                  <div style={{ width: 22, height: 22, borderRadius: 11, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>
                  </div>
                )}
              </div>

              {isPaired ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.card, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 9, color: C.green, fontWeight: 700 }}>VERBUNDEN MIT</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{pairedEq.name}</span>
                  </div>
                  <button onClick={() => onUnpair(pairedEq.id)} style={{ fontSize: 10, color: C.red, background: C.redLight, border: "none", borderRadius: 8, padding: "4px 10px", cursor: "pointer", fontWeight: 600 }}>Trennen</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 10, color: C.sub, marginBottom: 6 }}>Zuordnen zu:</div>
                  {compatibleEquipment.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {compatibleEquipment.map(eq => (
                        <button key={eq.id} onClick={() => onPair(eq.id, sg.strava_id)} style={{
                          background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
                          padding: "10px 12px", cursor: "pointer", display: "flex",
                          alignItems: "center", justifyContent: "space-between", transition: "all 0.15s",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 14 }}>{CATEGORIES[eq.category]?.emoji}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{eq.name}</span>
                          </div>
                          <span style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>Verbinden →</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>
                      {pairedIds.includes(sg.strava_id) ? "Bereits verbunden" : "Kein passendes Equipment – erst anlegen"}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div style={{ background: C.accentLight, borderRadius: 12, padding: "12px 14px", marginTop: 8 }}>
          <div style={{ fontSize: 11, color: C.accent, fontWeight: 600 }}>ℹ️ Ski & Snowboard</div>
          <div style={{ fontSize: 11, color: C.sub, marginTop: 2, lineHeight: 1.4 }}>
            Strava unterstützt kein Ski/Snowboard-Gear nativ. Ski-Tage werden über die Aktivitätsart erkannt und müssen manuell zugeordnet werden.
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  ACTIVITY SYNC VIEW
// ══════════════════════════════════════
function SyncActivityView({ activities, equipment, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200, animation: "fi 0.2s" }} onClick={onClose}>
      <div style={{ background: C.card, borderRadius: "24px 24px 0 0", padding: "6px 22px 30px", width: "100%", maxWidth: 430, maxHeight: "85vh", overflowY: "auto", animation: "su 0.3s cubic-bezier(.4,0,.2,1)" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: C.border, borderRadius: 2, margin: "0 auto 14px" }} />

        <h3 style={{ fontSize: 18, fontWeight: 800, color: C.text, marginBottom: 4 }}>Letzte Sync-Aktivitäten</h3>
        <div style={{ fontSize: 11, color: C.sub, marginBottom: 16 }}>Automatisch von Strava importiert</div>

        {activities.map((act, i) => {
          const pairedEq = equipment.find(e => e.stravaGearId === act.gear_id);
          const isIndoor = act.trainer;
          const km = (act.distance / 1000).toFixed(1);
          const duration = `${Math.floor(act.elapsed / 3600)}h ${Math.floor((act.elapsed % 3600) / 60)}min`;

          return (
            <div key={act.id} style={{
              background: C.bg, borderRadius: 14, padding: "14px 16px", marginBottom: 8,
              border: `1px solid ${C.border}`, animation: `si 0.3s ${i * 0.04}s both`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: isIndoor ? C.accentLight : C.greenLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  {isIndoor ? "🖥️" : act.type === "Ride" ? "🚲" : "🏃"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{act.name}</div>
                  <div style={{ fontSize: 10, color: C.sub }}>{fmtDate(act.date)} · {duration} · {km} km</div>
                </div>
                {isIndoor && <span style={{ fontSize: 8, fontWeight: 800, color: C.accent, background: C.accentLight, padding: "3px 8px", borderRadius: 6 }}>INDOOR</span>}
              </div>

              {pairedEq ? (
                <div style={{ background: C.card, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: C.green }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>→ {pairedEq.name}</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.sub, lineHeight: 1.6 }}>
                    {isIndoor ? (
                      <>
                        <span style={{ color: C.green }}>✓</span> Kette, Kassette, Schaltung → +{km} km{"\n"}
                        <br/><span style={{ color: C.muted }}>✗</span> <span style={{ textDecoration: "line-through", color: C.muted }}>Reifen, Bremsbeläge</span> <span style={{ color: C.accent, fontWeight: 600 }}>(Indoor → kein Verschleiß)</span>
                      </>
                    ) : (
                      <><span style={{ color: C.green }}>✓</span> Alle Verschleißteile → +{km} km</>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ background: C.orangeLight, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, color: C.orange, fontWeight: 600 }}>⚠️ Strava-Gear nicht zugeordnet</div>
                  <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>Gear-ID: {act.gear_id} – bitte im Pairing verbinden</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════
//  MAIN APP (with Auth + Supabase)
// ══════════════════════════════════════
export default function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [addCategory, setAddCategory] = useState(null);
  const [toast, setToast] = useState(null);
  const [showStravaPairing, setShowStravaPairing] = useState(false);
  const [showSyncView, setShowSyncView] = useState(false);

  const selectedEq = equipment.find(e => e.id === selectedId);
  const selectedCat = selectedEq ? CATEGORIES[selectedEq.category] : null;

  // ── Auth listener ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load equipment when logged in ──
  const loadEquipment = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const data = await fetchEquipment();
      setEquipment(data);
    } catch (err) {
      console.error("Failed to load equipment:", err);
      flash("Fehler beim Laden");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) loadEquipment();
  }, [session, loadEquipment]);

  function handleSelect(id) { setSelectedId(id); setScreen("detail"); }
  function handleBack() { setScreen("list"); setSelectedId(null); }
  function handleAdd(catKey) { setAddCategory(catKey); }

  async function handleSaveNew(newEq) {
    try {
      await insertEquipment(newEq, session.user.id);
      await loadEquipment();
      flash("Equipment hinzugefügt ✓");
    } catch (err) {
      console.error("Insert failed:", err);
      flash("Fehler beim Speichern");
      throw err;
    }
  }

  async function handleResetWear(eqId, wearId) {
    try {
      await resetWearPart(wearId);
      // Optimistic update
      setEquipment(prev => prev.map(e => e.id !== eqId ? e : {
        ...e, wearParts: e.wearParts.map(w => w.id !== wearId ? w : { ...w, km: 0, date: new Date().toISOString().split("T")[0] }),
      }));
      flash("Zurückgesetzt ✓");
    } catch (err) {
      console.error("Reset failed:", err);
      flash("Fehler beim Zurücksetzen");
    }
  }

  async function handleStravaPair(eqId, stravaGearId) {
    try {
      await updateEquipmentField(eqId, { stravaGearId });
      setEquipment(prev => prev.map(e => e.id !== eqId ? e : { ...e, stravaGearId }));
      const sg = STRAVA_GEAR.find(s => s.strava_id === stravaGearId);
      flash(`Verbunden mit Strava: ${sg?.name || stravaGearId}`);
    } catch (err) {
      console.error("Pair failed:", err);
      flash("Fehler beim Verbinden");
    }
  }

  async function handleStravaUnpair(eqId) {
    try {
      await updateEquipmentField(eqId, { stravaGearId: null });
      setEquipment(prev => prev.map(e => e.id !== eqId ? e : { ...e, stravaGearId: null }));
      flash("Strava-Verbindung getrennt");
    } catch (err) {
      console.error("Unpair failed:", err);
      flash("Fehler beim Trennen");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setEquipment([]);
    setScreen("list");
    setSelectedId(null);
  }

  function flash(m) { setToast(m); setTimeout(() => setToast(null), 2500); }

  // ── Auth loading state ──
  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Satoshi', 'DM Sans', -apple-system, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <Logo size={48} />
          <div style={{ fontSize: 13, color: C.sub, marginTop: 12 }}>Laden...</div>
        </div>
      </div>
    );
  }

  // ── Not logged in → show auth ──
  if (!session) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
          @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
          @keyframes si{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          @keyframes fi{from{opacity:0}to{opacity:1}}
          *{box-sizing:border-box;margin:0;padding:0}
        `}</style>
        <AuthScreen />
      </>
    );
  }

  // ── Logged in → show app ──
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Satoshi', 'DM Sans', -apple-system, sans-serif", maxWidth: 430, margin: "0 auto", position: "relative", paddingBottom: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        @import url('https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap');
        @keyframes si{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        @keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{display:none}
      `}</style>

      {/* ═══ HEADER ═══ */}
      <div style={{ padding: "18px 16px 14px", background: C.card, borderBottom: `1px solid ${C.border}`, animation: "si 0.25s both" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Logo size={28} />
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: C.text, letterSpacing: -0.3 }}>
                {screen === "list" ? "My Gear" : ""}
              </h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div onClick={() => setShowSyncView(true)} style={{ background: C.bg, borderRadius: 10, padding: "6px 10px", display: "flex", alignItems: "center", gap: 5, border: `1px solid ${C.border}`, cursor: "pointer" }}>
              <span style={{ fontSize: 9, color: C.sub, fontWeight: 700 }}>↓ Sync</span>
            </div>
            <div onClick={() => setShowStravaPairing(true)} style={{ background: "#FC4C0208", borderRadius: 10, padding: "6px 10px", display: "flex", alignItems: "center", gap: 5, border: `1px solid #FC4C0215`, cursor: "pointer" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 9, color: "#FC4C02", fontWeight: 700 }}>Strava</span>
            </div>
            <button onClick={() => handleAdd("bike")} style={{ background: C.accent, border: "none", borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, cursor: "pointer", fontWeight: 300 }}>+</button>
          </div>
        </div>
        {/* User bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.sub, fontWeight: 500 }}>{session.user.email}</div>
          <button onClick={handleLogout} style={{ background: "none", border: "none", fontSize: 11, color: C.muted, cursor: "pointer", fontWeight: 600 }}>Abmelden</button>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div style={{ paddingTop: 14 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 13, color: C.sub }}>Daten werden geladen...</div>
          </div>
        ) : (
          <>
            {screen === "list" && (
              <EquipmentList equipment={equipment} onSelect={handleSelect} onAdd={handleAdd} />
            )}
            {screen === "detail" && selectedEq && selectedCat && (
              <EquipmentDetail eq={selectedEq} catDef={selectedCat} onBack={handleBack} onResetWear={handleResetWear} />
            )}
          </>
        )}
      </div>

      {/* ═══ ADD SHEET ═══ */}
      {addCategory && CATEGORIES[addCategory] && (
        <AddEquipmentSheet
          category={addCategory}
          catDef={CATEGORIES[addCategory]}
          onClose={() => setAddCategory(null)}
          onSave={handleSaveNew}
        />
      )}

      {/* ═══ STRAVA PAIRING ═══ */}
      {showStravaPairing && (
        <StravaPairingSheet
          equipment={equipment}
          stravaGear={STRAVA_GEAR}
          onPair={handleStravaPair}
          onUnpair={handleStravaUnpair}
          onClose={() => setShowStravaPairing(false)}
        />
      )}

      {/* ═══ SYNC VIEW ═══ */}
      {showSyncView && (
        <SyncActivityView
          activities={STRAVA_ACTIVITIES}
          equipment={equipment}
          onClose={() => setShowSyncView(false)}
        />
      )}

      {/* ═══ TOAST ═══ */}
      {toast && <div style={{ position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)", background: C.text, color: "#fff", padding: "11px 24px", borderRadius: 14, fontSize: 13, fontWeight: 600, boxShadow: "0 8px 24px rgba(0,0,0,0.15)", animation: "si 0.25s", zIndex: 300 }}>{toast}</div>}
    </div>
  );
}
