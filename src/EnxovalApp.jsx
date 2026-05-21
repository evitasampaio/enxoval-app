import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "./supabase";

// ─────────────────────────────────────────────────────────────────────────────
// PROPOSTA A — SOFT NURSERY DESIGN SYSTEM
// Paleta terracota/creme, tipografia serifada afetiva, cantos generosos
// ─────────────────────────────────────────────────────────────────────────────

const ACCENT_PALETTES = {
  terracota: {
    id:"terracota", label:"Terracota",
    accent:"#C9856B", accentL:"#E8B9A8", accentDim:"#FBF0EB",
    accentBg:"rgba(201,133,107,0.10)", accentText:"#3A1A0F",
    tabActive:"#FBF8F3", tabBorder:"#C9856B",
  },
  sage: {
    id:"sage", label:"Sálvia",
    accent:"#5A9068", accentL:"#9CC4A8", accentDim:"#EBF3EC",
    accentBg:"rgba(90,144,104,0.10)", accentText:"#0F2A15",
    tabActive:"#F5F8F5", tabBorder:"#5A9068",
  },
  dustyrose: {
    id:"dustyrose", label:"Rosa pó",
    accent:"#C47A90", accentL:"#E4AABB", accentDim:"#FCEEF2",
    accentBg:"rgba(196,122,144,0.10)", accentText:"#3A0F1E",
    tabActive:"#FDF6F8", tabBorder:"#C47A90",
  },
  ocean: {
    id:"ocean", label:"Oceano",
    accent:"#5472A8", accentL:"#94AACC", accentDim:"#EBF0F8",
    accentBg:"rgba(84,114,168,0.10)", accentText:"#0F1E3A",
    tabActive:"#F5F7FB", tabBorder:"#5472A8",
  },
  lavanda: {
    id:"lavanda", label:"Lavanda",
    accent:"#7A6AAC", accentL:"#B4A8D4", accentDim:"#F0EEFB",
    accentBg:"rgba(122,106,172,0.10)", accentText:"#1A0F3A",
    tabActive:"#F7F5FC", tabBorder:"#7A6AAC",
  },
};

// LIGHT — Soft Nursery base (único modo no redesign)
const LIGHT = {
  bg:         "#FBF8F3",
  bgCard:     "#FFFFFF",
  bgCardAlt:  "#F5F0E8",
  bgSurf:     "#F0EBE2",
  border:     "#E8DDD0",
  borderL:    "#EEE6DA",
  ink:        "#2A1F18",
  inkL:       "#4A3A30",
  inkLL:      "#8A7060",
  ghost:      "#C0AFA0",
  amber:      "#A07828",
  amberDim:   "#FBF4E0",
  lavender:   "#6A58A0",
  lavenderDim:"#EDE8FA",
  success:    "#3A7850",
  successDim: "#E8F3EC",
  rose:       "#A83030",
};

let T = LIGHT;

const TAM_COLORS = {
  "RN":{ color:"#A05820", bg:"#FBF0E4", border:"#F0CBA8" },
  "P": { color:"#5472A8", bg:"#EBF0F8", border:"#AABCE0" },
  "M": { color:"#7A6AAC", bg:"#F0EEFB", border:"#C4B8E8" },
  "G": { color:"#3A7850", bg:"#E8F3EC", border:"#9CCAB0" },
  "GG":{ color:"#A07828", bg:"#FBF4E0", border:"#D4B870" },
  "—": { color:"#8A7060", bg:"#F5F0E8", border:"#D4C8BC" },
};

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CATEGORIES = [
  { id:"roupinhas",   label:"Roupinhas"         },
  { id:"banho",       label:"Banho & Higiene"   },
  { id:"fraldas",     label:"Fraldas"           },
  { id:"sono",        label:"Sono & Descanso"   },
  { id:"alimentacao", label:"Alimentação"       },
  { id:"saude",       label:"Saúde & Segurança" },
  { id:"mobilidade",  label:"Mobilidade"        },
];

const DEFAULT_ITEMS = [
  { id:"r1",  catId:"roupinhas",   name:"Body manga curta",         priority:"essencial", sizes:[{tam:"RN",qty:3},{tam:"P",qty:5},{tam:"M",qty:5},{tam:"G",qty:4}] },
  { id:"r2",  catId:"roupinhas",   name:"Body manga longa",         priority:"essencial", sizes:[{tam:"RN",qty:2},{tam:"P",qty:4},{tam:"M",qty:4},{tam:"G",qty:3}] },
  { id:"r3",  catId:"roupinhas",   name:"Macacão c/ zíper",         priority:"essencial", sizes:[{tam:"RN",qty:3},{tam:"P",qty:4},{tam:"M",qty:4},{tam:"G",qty:3}] },
  { id:"r4",  catId:"roupinhas",   name:"Macacão com pé",           priority:"desejavel", sizes:[{tam:"RN",qty:2},{tam:"P",qty:2},{tam:"M",qty:3},{tam:"G",qty:3}] },
  { id:"r5",  catId:"roupinhas",   name:"Calça legging / mijão",    priority:"essencial", sizes:[{tam:"P",qty:4},{tam:"M",qty:4},{tam:"G",qty:3}] },
  { id:"r6",  catId:"roupinhas",   name:"Agasalho / moletom",       priority:"essencial", sizes:[{tam:"P",qty:2},{tam:"M",qty:2},{tam:"G",qty:2}] },
  { id:"r7",  catId:"roupinhas",   name:"Meia antiderrapante",      priority:"essencial", sizes:[{tam:"RN",qty:4},{tam:"P",qty:4},{tam:"M",qty:4},{tam:"G",qty:4}] },
  { id:"r8",  catId:"roupinhas",   name:"Touca de malha fina",      priority:"essencial", sizes:[{tam:"RN",qty:3},{tam:"P",qty:2}] },
  { id:"r9",  catId:"roupinhas",   name:"Luva de algodão",          priority:"essencial", sizes:[{tam:"RN",qty:3}] },
  { id:"r10", catId:"roupinhas",   name:"Conjunto passeio",         priority:"desejavel", sizes:[{tam:"P",qty:2},{tam:"M",qty:2},{tam:"G",qty:2}] },
  { id:"r11", catId:"roupinhas",   name:"Casaco de malha",          priority:"desejavel", sizes:[{tam:"P",qty:1},{tam:"M",qty:2},{tam:"G",qty:2}] },
  { id:"r12", catId:"roupinhas",   name:"Sapatinho soft",           priority:"desejavel", sizes:[{tam:"P",qty:3},{tam:"G",qty:3}] },
  { id:"b1",  catId:"banho",       name:"Toalha com capuz",         priority:"essencial", sizes:[{tam:"—",qty:5}] },
  { id:"b2",  catId:"banho",       name:"Fralda de pano multiúso",  priority:"essencial", sizes:[{tam:"—",qty:12}] },
  { id:"b3",  catId:"banho",       name:"Kit higiene",              priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"b4",  catId:"banho",       name:"Termômetro digital",       priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"b5",  catId:"banho",       name:"Banheira c/ suporte",      priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"b6",  catId:"banho",       name:"Sabonete neutro bebê",     priority:"essencial", sizes:[{tam:"—",qty:4}] },
  { id:"b7",  catId:"banho",       name:"Shampoo neutro bebê",      priority:"essencial", sizes:[{tam:"—",qty:4}] },
  { id:"b8",  catId:"banho",       name:"Hidratante bebê",          priority:"essencial", sizes:[{tam:"—",qty:4}] },
  { id:"b9",  catId:"banho",       name:"Pomada assadura",          priority:"essencial", sizes:[{tam:"—",qty:4}] },
  { id:"b10", catId:"banho",       name:"Aspirador nasal",          priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"b11", catId:"banho",       name:"Assento de banho",         priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"f1",  catId:"fraldas",     name:"Fralda descartável",       priority:"essencial", sizes:[{tam:"RN",qty:1},{tam:"P",qty:4},{tam:"M",qty:4},{tam:"G",qty:4}] },
  { id:"f2",  catId:"fraldas",     name:"Lenço umedecido",          priority:"essencial", sizes:[{tam:"—",qty:12}] },
  { id:"f3",  catId:"fraldas",     name:"Trocador portátil",        priority:"essencial", sizes:[{tam:"—",qty:2}] },
  { id:"f4",  catId:"fraldas",     name:"Saco impermeável",         priority:"essencial", sizes:[{tam:"—",qty:10}] },
  { id:"f5",  catId:"fraldas",     name:"Lixeira higiênica",        priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"s1",  catId:"sono",        name:"Berço / mini-berço",       priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"s2",  catId:"sono",        name:"Colchão firme",            priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"s3",  catId:"sono",        name:"Lençol c/ elástico",       priority:"essencial", sizes:[{tam:"—",qty:5}] },
  { id:"s4",  catId:"sono",        name:"Manta leve de malha",      priority:"essencial", sizes:[{tam:"—",qty:4}] },
  { id:"s5",  catId:"sono",        name:"Protetor mesh",            priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"s6",  catId:"sono",        name:"Saco de dormir",           priority:"desejavel", sizes:[{tam:"—",qty:2}] },
  { id:"s7",  catId:"sono",        name:"Projetor / luminária",     priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"a1",  catId:"alimentacao", name:"Babador impermeável",      priority:"essencial", sizes:[{tam:"—",qty:10}] },
  { id:"a2",  catId:"alimentacao", name:"Almofada amamentação",     priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"a3",  catId:"alimentacao", name:"Absorvente para seio",     priority:"essencial", sizes:[{tam:"—",qty:3}] },
  { id:"a4",  catId:"alimentacao", name:"Bomba tira-leite",         priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"a5",  catId:"alimentacao", name:"Mamadeira BPA free",       priority:"desejavel", sizes:[{tam:"—",qty:4}] },
  { id:"a6",  catId:"alimentacao", name:"Esterilizador",            priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"a7",  catId:"alimentacao", name:"Kit papinha completo",     priority:"essencial", sizes:[{tam:"—",qty:2}] },
  { id:"a8",  catId:"alimentacao", name:"Cadeirinha alimentação",   priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"sa1", catId:"saude",       name:"Dosador / seringa",        priority:"essencial", sizes:[{tam:"—",qty:2}] },
  { id:"sa2", catId:"saude",       name:"Nebulizador",              priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"sa3", catId:"saude",       name:"Umidificador de ar",       priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"sa4", catId:"saude",       name:"Monitor de bebê",          priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"sa5", catId:"saude",       name:"Travas e proteções casa",  priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"m1",  catId:"mobilidade",  name:"Cadeirinha carro Gr.0",    priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"m2",  catId:"mobilidade",  name:"Carrinho reclinável",      priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"m3",  catId:"mobilidade",  name:"Bebê-conforto",            priority:"desejavel", sizes:[{tam:"—",qty:1}] },
  { id:"m4",  catId:"mobilidade",  name:"Bolsa maternidade",        priority:"essencial", sizes:[{tam:"—",qty:1}] },
  { id:"m5",  catId:"mobilidade",  name:"Sling / porta-bebê",       priority:"desejavel", sizes:[{tam:"—",qty:1}] },
];

const PRESET_TAGS = [
  { id:"basico",   label:"Básico",   color:"#5A9068" },
  { id:"passeio",  label:"Passeio",  color:"#5472A8" },
  { id:"dormir",   label:"Dormir",   color:"#7A6AAC" },
  { id:"especial", label:"Especial", color:"#A07828" },
  { id:"presente", label:"Presente", color:"#C47A90" },
  { id:"urgente",  label:"Urgente",  color:"#A83030" },
  { id:"inverno",  label:"Inverno",  color:"#5492A8" },
];

function buildDefaultPriorities(accent) {
  return [
    { id:"essencial", label:"Essencial", color:accent.accent,  bg:accent.accentDim },
    { id:"desejavel", label:"Desejável", color:"#A07828",      bg:"#FBF4E0"        },
    { id:"adicional", label:"Adicional", color:"#7A6AAC",      bg:"#F0EEFB"        },
  ];
}

function getPrio(priorities, id) {
  return priorities.find(p => p.id === id) || { id, label: id, color: T.inkLL, bg: T.bgSurf };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────
function buildInitialApp(accentId = "terracota") {
  const accent = ACCENT_PALETTES[accentId];
  const entries = {};
  DEFAULT_ITEMS.forEach(item => item.sizes.forEach(sz => {
    entries[`${item.id}_${sz.tam}`] = { units: [] };
  }));
  return {
    accentId,
    babyName: "",
    categories: DEFAULT_CATEGORIES,
    priorities: buildDefaultPriorities(accent),
    items: DEFAULT_ITEMS.map(i => ({ ...i, price: "" })),
    customTags: [],
    entries,
    budgetTotal: "",
    budgetByCategory: {},
  };
}

function makeUnit() { return { photo: null, noPhoto: false, tags: [], note: "", price: "" }; }
function unitDone(u) { return !!u.photo || u.noPhoto; }

async function loadApp(userId) {
  try {
    const { data, error } = await supabase
      .from("app_data").select("data").eq("user_id", userId).single();
    if (error || !data) return buildInitialApp();
    return { ...buildInitialApp(), ...JSON.parse(data.data) };
  } catch { return buildInitialApp(); }
}

async function saveApp(state, userId) {
  try {
    await supabase.from("app_data").upsert(
      { user_id: userId, data: JSON.stringify(state), updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  } catch (e) { console.error("saveApp error:", e); }
}

function fileToDataUrl(f) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
  });
}

function allTags(ct) { return [...PRESET_TAGS, ...ct]; }
function tagById(id, ct) { return allTags(ct).find(t => t.id === id); }
function fmtBRL(v) {
  const n = parseFloat(v);
  if (isNaN(n) || n === 0) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function uid() { return Math.random().toString(36).slice(2, 9); }

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS — Soft Nursery
// ─────────────────────────────────────────────────────────────────────────────
const serif  = { fontFamily: "'Lora','Georgia',serif" };
const sans   = { fontFamily: "'DM Sans','Helvetica Neue',sans-serif" };
const mono   = { fontFamily: "'DM Mono','Courier New',monospace" };

// Radius tokens
const R = { sm: 6, md: 10, lg: 14, xl: 18, pill: 99 };

// Shadow tokens
const shadow = {
  card: "0 1px 4px rgba(42,31,24,0.06), 0 0 0 0.5px rgba(42,31,24,0.08)",
  lifted: "0 4px 16px rgba(42,31,24,0.10), 0 0 0 0.5px rgba(42,31,24,0.06)",
};

// ─────────────────────────────────────────────────────────────────────────────
// MICRO COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Chip({ label, color, bg, onRemove, xs }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: bg || color + "22", color,
      border: `0.5px solid ${color}55`,
      borderRadius: R.sm,
      padding: xs ? "3px 8px" : "4px 10px",
      fontSize: xs ? 10 : 11,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      ...mono,
      whiteSpace: "nowrap",
      fontWeight: 500,
    }}>
      {label}
      {onRemove && (
        <span onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ cursor: "pointer", opacity: 0.5, fontSize: 11, lineHeight: 1 }}>×</span>
      )}
    </span>
  );
}

function TamBadge({ tam }) {
  const s = TAM_COLORS[tam] || TAM_COLORS["—"];
  return (
    <span style={{
      ...mono,
      background: s.bg, color: s.color,
      border: `0.5px solid ${s.border}`,
      borderRadius: R.sm,
      padding: "4px 9px",
      fontSize: 11, fontWeight: 700,
      minWidth: 28, textAlign: "center", flexShrink: 0,
      display: "inline-block",
    }}>{tam}</span>
  );
}

// UX IMPROVEMENT: inline size status chips shown without expanding
function SizeStatusChip({ sz, entry, accent }) {
  const units  = entry?.units || [];
  const bought = units.length;
  const done   = units.filter(unitDone).length;
  const s      = TAM_COLORS[sz.tam] || TAM_COLORS["—"];
  const full   = bought >= sz.qty && bought > 0;
  const partial = bought > 0 && !full;

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: full ? T.successDim : partial ? s.bg : T.bgSurf,
      color: full ? T.success : partial ? s.color : T.ghost,
      border: `0.5px solid ${full ? T.success + "44" : partial ? s.border : T.border}`,
      borderRadius: R.sm,
      padding: "4px 9px",
      fontSize: 10, fontWeight: 600,
      ...mono,
      whiteSpace: "nowrap",
      minHeight: 28,
    }}>
      {sz.tam !== "—" && <span>{sz.tam}</span>}
      {full
        ? <span>✓</span>
        : <span>{bought}/{sz.qty}</span>
      }
    </span>
  );
}

function ProgressRing({ pct, size = 40, stroke = 3, accent }) {
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  const done = pct >= 100;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.bgSurf} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={done ? T.success : accent}
          strokeWidth={stroke}
          strokeDasharray={`${circ * pct / 100} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray .5s ease" }} />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex",
        alignItems: "center", justifyContent: "center",
        ...mono, fontSize: 10, fontWeight: 700,
        color: done ? T.success : accent,
      }}>
        {done ? "✓" : `${pct}%`}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CELEBRATION — UX improvement: microfeedback on category completion
// ─────────────────────────────────────────────────────────────────────────────
function CelebrationBanner({ catLabel, onClose }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, #FBF4E0 0%, #FBF0EB 100%)`,
      border: `1px solid #E8C890`,
      borderRadius: R.lg,
      padding: "14px 16px",
      marginBottom: 12,
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: shadow.card,
      animation: "fadeSlideIn .4s ease",
    }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>🎉</span>
      <div style={{ flex: 1 }}>
        <div style={{ ...serif, fontSize: 14, color: T.inkL, fontStyle: "italic", fontWeight: 400 }}>
          <strong style={{ fontWeight: 600, color: "#A07828" }}>{catLabel}</strong> completo!
        </div>
        <div style={{ ...sans, fontSize: 11, color: T.inkLL, marginTop: 2 }}>
          Parabéns, mais uma categoria concluída ✨
        </div>
      </div>
      <button onClick={onClose} style={{
        background: "none", border: "none", color: T.ghost,
        cursor: "pointer", fontSize: 16, padding: "4px", lineHeight: 1,
        flexShrink: 0,
      }}>×</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAG PICKER
// ─────────────────────────────────────────────────────────────────────────────
function TagPicker({ selected, customTags, onToggle }) {
  return (
    <div>
      <div style={{ ...mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.inkLL, marginBottom: 6 }}>Tags</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
        {allTags(customTags).map(tag => {
          const on = selected.includes(tag.id);
          return (
            <button key={tag.id} onClick={() => onToggle(tag.id)} style={{
              background: on ? tag.color : tag.color + "18",
              color: on ? "#FFF" : tag.color,
              border: `0.5px solid ${tag.color}55`,
              borderRadius: R.pill,
              padding: "6px 12px",
              ...sans, fontSize: 11, letterSpacing: 0.3,
              cursor: "pointer", transition: "all .15s",
              fontWeight: on ? 600 : 400,
              display: "inline-flex", alignItems: "center", gap: 5,
              minHeight: 32,
            }}>
              {tag.label}
              {on && <span style={{ opacity: 0.7, fontSize: 10 }}>✕</span>}
            </button>
          );
        })}
      </div>
      <div style={{ ...sans, fontSize: 11, color: T.ghost, marginTop: 4 }}>
        Gerencie tags em Gerenciar → Tags
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIT CARD
// ─────────────────────────────────────────────────────────────────────────────
function UnitCard({ index, unit, customTags, onChange, onRemove, accent }) {
  const inputRef = useRef();
  const done = unitDone(unit);

  const handleFile = async e => {
    const f = e.target.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    onChange({ ...unit, photo: await fileToDataUrl(f), noPhoto: false });
    e.target.value = "";
  };

  return (
    <div style={{
      border: `0.5px solid ${done ? accent + "55" : T.border}`,
      borderRadius: R.md,
      background: done ? accent + "0A" : T.bgCard,
      padding: "14px",
      marginBottom: 8,
      transition: "all .2s",
      boxShadow: done ? shadow.card : "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{
          width: 26, height: 26, borderRadius: "50%", flexShrink: 0,
          background: done ? accent : T.bgSurf,
          border: `0.5px solid ${done ? accent : T.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          ...mono, fontSize: 11, color: done ? "#FFF" : T.inkLL, fontWeight: 700,
        }}>{done ? "✓" : index + 1}</div>
        <span style={{ ...serif, fontSize: 13, color: T.inkL, flex: 1, fontStyle: "italic" }}>
          Unidade {index + 1}
          {done && (
            <span style={{ ...mono, fontSize: 10, color: accent, marginLeft: 8, letterSpacing: 0.5 }}>
              {unit.photo ? "· com foto" : "· sem foto"}
            </span>
          )}
        </span>
        <button onClick={onRemove} style={{
          background: "none", border: "none", color: T.ghost,
          cursor: "pointer", ...sans, fontSize: 11, padding: "4px 8px",
          borderRadius: R.sm,
        }}>remover</button>
      </div>

      {/* price per unit */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: T.bgSurf, border: `0.5px solid ${T.border}`,
        borderRadius: R.md, padding: "10px 12px", marginBottom: 12,
      }}>
        <span style={{ ...mono, fontSize: 10, color: T.inkLL, letterSpacing: 0.8, textTransform: "uppercase", flexShrink: 0 }}>
          Valor pago
        </span>
        <span style={{ ...mono, fontSize: 11, color: T.inkLL, flexShrink: 0 }}>R$</span>
        <input type="number" step="0.01"
          value={unit.price || ""}
          onChange={e => onChange({ ...unit, price: e.target.value })}
          placeholder="0,00"
          style={{
            flex: 1, background: "transparent", border: "none",
            ...mono, fontSize: 15, color: accent, outline: "none", fontWeight: 500, minWidth: 0,
          }} />
        {parseFloat(unit.price) > 0 && (
          <span style={{ ...mono, fontSize: 11, color: accent, flexShrink: 0 }}>
            {fmtBRL(unit.price)}
          </span>
        )}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <div style={{
          width: 80, height: 80, borderRadius: R.md, flexShrink: 0, overflow: "hidden",
          border: `0.5px solid ${unit.photo ? accent + "66" : T.border}`,
          background: unit.noPhoto ? accent + "10" : T.bgSurf,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: unit.noPhoto ? "default" : "pointer", position: "relative",
        }} onClick={() => !unit.noPhoto && inputRef.current.click()}>
          {unit.photo
            ? <img src={unit.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span style={{ fontSize: unit.noPhoto ? 24 : 20, opacity: 0.25 }}>{unit.noPhoto ? "○" : "◫"}</span>
          }
          {unit.photo && (
            <button onClick={e => { e.stopPropagation(); onChange({ ...unit, photo: null }); }} style={{
              position: "absolute", top: 4, right: 4,
              background: "#FFF",
              border: `0.5px solid ${T.border}`,
              borderRadius: "50%", color: T.inkL,
              width: 18, height: 18, cursor: "pointer", fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          )}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {!unit.photo && (
            <button onClick={() => inputRef.current.click()} style={{
              background: accent + "15", color: accent,
              border: `0.5px solid ${accent}44`,
              borderRadius: R.md, padding: "10px 0",
              ...sans, fontSize: 12, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              minHeight: 40,
            }}>📷 Adicionar foto</button>
          )}
          {unit.photo && (
            <button onClick={() => inputRef.current.click()} style={{
              background: T.bgSurf, color: T.inkL,
              border: `0.5px solid ${T.border}`,
              borderRadius: R.md, padding: "10px 0",
              ...sans, fontSize: 12, cursor: "pointer",
              minHeight: 40,
            }}>↺ Trocar foto</button>
          )}
          <button onClick={() => { if (unit.photo) return; onChange({ ...unit, noPhoto: !unit.noPhoto }); }} style={{
            background: unit.noPhoto ? accent + "15" : "transparent",
            color: unit.noPhoto ? accent : T.inkLL,
            border: `0.5px ${unit.noPhoto ? "solid" : "dashed"} ${unit.noPhoto ? accent + "44" : T.border}`,
            borderRadius: R.md, padding: "10px 0",
            ...sans, fontSize: 12, cursor: "pointer", transition: "all .2s",
            minHeight: 40,
          }}>{unit.noPhoto ? "✓ Sem foto (ok)" : "○ Marcar sem foto"}</button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
      </div>

      <TagPicker selected={unit.tags || []} customTags={customTags}
        onToggle={id => onChange({
          ...unit,
          tags: (unit.tags || []).includes(id)
            ? (unit.tags || []).filter(x => x !== id)
            : [...(unit.tags || []), id],
        })} />

      <textarea
        value={unit.note || ""}
        onChange={e => onChange({ ...unit, note: e.target.value })}
        placeholder="Observação — marca, loja, presenteado por…"
        style={{
          width: "100%", marginTop: 10, padding: "10px 12px",
          border: `0.5px solid ${T.border}`, borderRadius: R.md, resize: "vertical",
          ...serif, fontSize: 13, color: T.inkL, background: T.bg,
          outline: "none", boxSizing: "border-box", minHeight: 40,
        }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIZE ROW
// ─────────────────────────────────────────────────────────────────────────────
function SizeRow({ sz, entryKey, entry, customTags, onChange, accent, onQuickPhoto }) {
  const [open, setOpen] = useState(false);
  const units  = entry?.units || [];
  const bought = units.length;
  const completed = units.filter(unitDone).length;
  const pct    = sz.qty > 0 ? Math.min(100, Math.round(bought / sz.qty * 100)) : 100;
  const full   = bought >= sz.qty && completed === bought && sz.qty > 0;
  const update = (f, v) => onChange(entryKey, { ...(entry || {}), [f]: v });
  const upUnits = u => update("units", u);
  const pending = units.filter(u => !unitDone(u)).length;

  return (
    <div style={{ borderBottom: `0.5px solid ${T.borderL}`, padding: "10px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => setOpen(x => !x)}>
        {sz.tam !== "—" && <TamBadge tam={sz.tam} />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ ...mono, fontSize: 11, color: T.inkLL }}>{bought} / {sz.qty}</span>
            <div style={{ display: "flex", gap: 5 }}>
              {pending > 0 && <span style={{ ...mono, fontSize: 10, color: T.amber }}>◌{pending}</span>}
            </div>
          </div>
          <div style={{ height: 3, background: T.bgSurf, borderRadius: R.pill, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: R.pill,
              background: full ? T.success : accent,
              width: `${pct}%`, transition: "width .4s ease",
            }} />
          </div>
        </div>

        {/* UX: quick camera button directly on size row */}
        {bought < sz.qty && (
          <button
            onClick={e => { e.stopPropagation(); onQuickPhoto(entryKey); }}
            title="Foto rápida"
            style={{
              background: accent + "18", color: accent,
              border: `0.5px solid ${accent}44`,
              borderRadius: R.md, padding: "8px 10px",
              ...sans, fontSize: 13, cursor: "pointer", flexShrink: 0,
              minWidth: 40, minHeight: 40, display: "flex", alignItems: "center", justifyContent: "center",
            }}>📷</button>
        )}
        {bought < sz.qty && (
          <button onClick={e => { e.stopPropagation(); upUnits([...units, makeUnit()]); }} style={{
            background: accent + "18", color: accent,
            border: `0.5px solid ${accent}44`,
            borderRadius: R.md, padding: "8px 10px",
            ...mono, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase",
            cursor: "pointer", flexShrink: 0,
            minHeight: 40,
          }}>+ Reg.</button>
        )}
        <span style={{
          color: T.ghost, fontSize: 10,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform .2s", flexShrink: 0,
        }}>▾</span>
      </div>

      {open && (
        <div style={{ paddingTop: 10 }}>
          {units.length === 0
            ? (
              <div style={{
                textAlign: "center", padding: "18px",
                ...sans, fontSize: 12, color: T.ghost,
                background: T.bgSurf, borderRadius: R.md, border: `0.5px dashed ${T.border}`,
              }}>
                Clique em + REG. para registrar a 1ª unidade
              </div>
            )
            : units.map((u, i) => (
              <UnitCard key={i} index={i} unit={u} accent={accent}
                customTags={customTags}
                onChange={val => { const n = [...units]; n[i] = val; upUnits(n); }}
                onRemove={() => upUnits(units.filter((_, j) => j !== i))} />
            ))
          }
          {bought < sz.qty && (
            <button onClick={() => upUnits([...units, makeUnit()])} style={{
              width: "100%", padding: "10px",
              background: accent + "15", color: accent,
              border: `0.5px solid ${accent}44`, borderRadius: R.md,
              ...sans, fontSize: 12, cursor: "pointer", marginTop: 4,
              minHeight: 44,
            }}>+ Registrar unidade {bought + 1} de {sz.qty}</button>
          )}
          {bought >= sz.qty && pending > 0 && (
            <div style={{
              background: T.amberDim, border: `0.5px solid ${T.amber}44`,
              borderRadius: R.md, padding: "10px 12px",
              ...sans, fontSize: 12, color: T.amber, marginTop: 4,
            }}>
              ◌ {pending} unidade{pending > 1 ? "s" : ""} aguardam conclusão
            </div>
          )}
          {full && (
            <div style={{
              background: T.successDim, border: `0.5px solid ${T.success}44`,
              borderRadius: R.md, padding: "10px 12px",
              ...sans, fontSize: 12, color: T.success, marginTop: 4,
            }}>
              ✓ {sz.qty} unidade{sz.qty > 1 ? "s" : ""} registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUICK PHOTO MODAL — UX improvement: 2-step photo from collapsed card
// ─────────────────────────────────────────────────────────────────────────────
function QuickPhotoModal({ entryKey, entry, onSave, onClose, accent }) {
  const inputRef = useRef();
  const units  = entry?.units || [];
  const [photo, setPhoto] = useState(null);
  const [noPhoto, setNoPhoto] = useState(false);
  const [price, setPrice] = useState("");

  const handleFile = async e => {
    const f = e.target.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    setPhoto(await fileToDataUrl(f));
    e.target.value = "";
  };

  const save = () => {
    if (!photo && !noPhoto) return;
    const newUnit = { ...makeUnit(), photo, noPhoto, price };
    onSave(entryKey, { units: [...units, newUnit] });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 300,
      background: "rgba(42,31,24,0.5)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        width: "100%", maxWidth: 520,
        background: T.bgCard, borderRadius: "16px 16px 0 0",
        padding: "20px 18px 32px",
        border: `0.5px solid ${T.border}`,
        boxShadow: shadow.lifted,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ ...serif, fontSize: 17, color: T.ink, fontStyle: "italic", marginBottom: 4 }}>
          Foto rápida
        </div>
        <div style={{ ...sans, fontSize: 12, color: T.inkLL, marginBottom: 16 }}>
          Registrar nova unidade
        </div>

        {/* photo area */}
        <div style={{
          width: "100%", height: 160, borderRadius: R.lg,
          border: `0.5px dashed ${photo ? accent + "66" : T.border}`,
          background: photo ? "transparent" : T.bgSurf,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", marginBottom: 12, cursor: "pointer", position: "relative",
        }} onClick={() => inputRef.current.click()}>
          {photo
            ? <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : (
              <div style={{ textAlign: "center", color: T.ghost }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📷</div>
                <div style={{ ...sans, fontSize: 12 }}>Toque para fotografar</div>
              </div>
            )
          }
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />

        <button onClick={() => { setNoPhoto(!noPhoto); setPhoto(null); }} style={{
          width: "100%", padding: "10px",
          background: noPhoto ? T.successDim : T.bgSurf,
          color: noPhoto ? T.success : T.inkLL,
          border: `0.5px solid ${noPhoto ? T.success + "44" : T.border}`,
          borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer",
          marginBottom: 12, minHeight: 44,
        }}>{noPhoto ? "✓ Sem foto marcado" : "○ Marcar sem foto"}</button>

        {/* price */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: T.bgSurf, border: `0.5px solid ${T.border}`,
          borderRadius: R.md, padding: "10px 12px", marginBottom: 16,
        }}>
          <span style={{ ...mono, fontSize: 10, color: T.inkLL, letterSpacing: 0.8, textTransform: "uppercase", flexShrink: 0 }}>
            Valor pago
          </span>
          <span style={{ ...mono, fontSize: 11, color: T.inkLL }}>R$</span>
          <input type="number" step="0.01" value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="0,00"
            style={{
              flex: 1, background: "transparent", border: "none",
              ...mono, fontSize: 15, color: accent, outline: "none",
            }} />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={save} disabled={!photo && !noPhoto} style={{
            flex: 1, padding: "13px",
            background: (photo || noPhoto) ? accent : T.bgSurf,
            color: (photo || noPhoto) ? "#FFF" : T.ghost,
            border: "none", borderRadius: R.md,
            ...sans, fontSize: 13, fontWeight: 600, cursor: (photo || noPhoto) ? "pointer" : "not-allowed",
            minHeight: 48, transition: "all .2s",
          }}>Salvar unidade</button>
          <button onClick={onClose} style={{
            padding: "13px 18px",
            background: T.bgSurf, color: T.inkL,
            border: `0.5px solid ${T.border}`, borderRadius: R.md,
            ...sans, fontSize: 13, cursor: "pointer",
            minHeight: 48,
          }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ITEM CARD — with inline size status (UX improvement)
// ─────────────────────────────────────────────────────────────────────────────
function ItemCard({ item, priorities, entries, customTags, onChangeEntry, onDeleteItem, onUpdateItem, accent }) {
  const [open, setOpen] = useState(false);
  const [quickPhotoKey, setQuickPhotoKey] = useState(null);
  const pm = getPrio(priorities, item.priority);

  const totalSug    = item.sizes.reduce((s, sz) => s + sz.qty, 0);
  const totalBought = item.sizes.reduce((s, sz) => s + (entries[`${item.id}_${sz.tam}`]?.units?.length || 0), 0);
  const totalDone   = item.sizes.reduce((s, sz) => s + (entries[`${item.id}_${sz.tam}`]?.units?.filter(unitDone).length || 0), 0);
  const pct         = totalSug > 0 ? Math.min(100, Math.round(totalBought / totalSug * 100)) : 100;
  const complete    = totalBought >= totalSug && totalDone === totalBought && totalSug > 0;
  const pending     = totalBought - totalDone;
  const unitSpent   = item.sizes.reduce((s, sz) =>
    s + (entries[`${item.id}_${sz.tam}`]?.units || []).reduce((a, u) => a + (parseFloat(u.price) || 0), 0), 0);

  return (
    <>
      {quickPhotoKey && (
        <QuickPhotoModal
          entryKey={quickPhotoKey}
          entry={entries[quickPhotoKey] || { units: [] }}
          accent={accent}
          onSave={(key, val) => onChangeEntry(key, val)}
          onClose={() => setQuickPhotoKey(null)} />
      )}
      <div style={{
        background: complete ? T.successDim : T.bgCard,
        border: `0.5px solid ${complete ? T.success + "44" : T.border}`,
        borderRadius: R.lg,
        marginBottom: 8,
        overflow: "hidden",
        transition: "background .3s, border .3s",
        boxShadow: shadow.card,
      }}>
        <div style={{ padding: "13px 14px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}
          onClick={() => setOpen(x => !x)}>
          <ProgressRing pct={pct} accent={accent} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...serif, fontSize: 15, color: T.ink, fontWeight: 400, marginBottom: 6, lineHeight: 1.3, fontStyle: "italic" }}>
              {item.name}
            </div>
            {/* UX: size status inline without expanding */}
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 5 }}>
              {item.sizes.map(sz => (
                <SizeStatusChip
                  key={sz.tam}
                  sz={sz}
                  entry={entries[`${item.id}_${sz.tam}`]}
                  accent={accent} />
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <Chip label={pm.label} color={pm.color} bg={pm.bg} xs />
              {pending > 0 && <span style={{ ...mono, fontSize: 10, color: T.amber }}>◌{pending} pend.</span>}
              {unitSpent > 0 && <span style={{ ...mono, fontSize: 11, color: accent }}>{fmtBRL(unitSpent)}</span>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            <button
              onClick={e => { e.stopPropagation(); if (confirm(`Remover "${item.name}"?`)) onDeleteItem(item.id); }}
              style={{ background: "none", border: "none", color: T.ghost, cursor: "pointer", fontSize: 14, padding: "6px 8px", minHeight: 36 }}>✕</button>
            <span style={{
              color: T.ghost, fontSize: 10,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform .2s",
            }}>▾</span>
          </div>
        </div>

        {open && (
          <div style={{ padding: "0 14px 14px", borderTop: `0.5px solid ${T.borderL}` }}>
            {item.sizes.map(sz => {
              const key = `${item.id}_${sz.tam}`;
              return (
                <SizeRow key={key} sz={sz} entryKey={key} accent={accent}
                  entry={entries[key] || { units: [] }}
                  customTags={customTags}
                  onChange={onChangeEntry}
                  onQuickPhoto={k => setQuickPhotoKey(k)} />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST — with "o que falta" sort + celebration
// ─────────────────────────────────────────────────────────────────────────────
function Checklist({ categories, items, priorities, entries, customTags, accent, onChangeEntry, onDeleteItem, onUpdateItem }) {
  const [filterPrio, setFilterPrio]     = useState("todos");
  const [filterCat,  setFilterCat]      = useState(null);
  const [search, setSearch]             = useState("");
  const [celebrations, setCelebrations] = useState({});

  // track category completions for celebration banner
  const prevCatComplete = useRef({});

  const getCatCompletion = (catId) => {
    const catItems = items.filter(i => i.catId === catId);
    if (!catItems.length) return false;
    return catItems.every(item => {
      const totalSug    = item.sizes.reduce((s, sz) => s + sz.qty, 0);
      const totalBought = item.sizes.reduce((s, sz) => s + (entries[`${item.id}_${sz.tam}`]?.units?.length || 0), 0);
      const totalDone   = item.sizes.reduce((s, sz) => s + (entries[`${item.id}_${sz.tam}`]?.units?.filter(unitDone).length || 0), 0);
      return totalBought >= totalSug && totalDone === totalBought && totalSug > 0;
    });
  };

  useEffect(() => {
    categories.forEach(cat => {
      const isNowComplete = getCatCompletion(cat.id);
      if (isNowComplete && !prevCatComplete.current[cat.id]) {
        setCelebrations(c => ({ ...c, [cat.id]: true }));
      }
      prevCatComplete.current[cat.id] = isNowComplete;
    });
  }, [entries]);

  // UX: sort — incomplete items first, then by priority, completed items last
  function sortItems(arr) {
    const prioOrder = { essencial: 0, desejavel: 1, adicional: 2 };
    return [...arr].sort((a, b) => {
      const aDone = a.sizes.every(sz => {
        const units = (entries[`${a.id}_${sz.tam}`]?.units || []);
        return units.length >= sz.qty && units.every(unitDone);
      });
      const bDone = b.sizes.every(sz => {
        const units = (entries[`${b.id}_${sz.tam}`]?.units || []);
        return units.length >= sz.qty && units.every(unitDone);
      });
      if (aDone !== bDone) return aDone ? 1 : -1;
      return (prioOrder[a.priority] ?? 9) - (prioOrder[b.priority] ?? 9);
    });
  }

  const visible = categories.map(cat => ({
    ...cat,
    items: sortItems(items.filter(i => i.catId === cat.id).filter(item => {
      if (filterCat && item.catId !== filterCat) return false;
      if (filterPrio !== "todos" && item.priority !== filterPrio) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })),
  })).filter(c => c.items.length > 0);

  return (
    <div>
      {/* celebrations */}
      {categories.map(cat => celebrations[cat.id] && (
        <CelebrationBanner
          key={cat.id}
          catLabel={cat.label}
          onClose={() => setCelebrations(c => ({ ...c, [cat.id]: false }))} />
      ))}

      {/* search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: T.bgCard, border: `0.5px solid ${T.border}`,
        borderRadius: R.md, padding: "10px 13px", marginBottom: 10,
        boxShadow: shadow.card,
      }}>
        <span style={{ color: T.ghost, fontSize: 16 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar item…"
          style={{
            flex: 1, background: "transparent", border: "none",
            ...sans, fontSize: 13, color: T.inkL, outline: "none",
          }} />
        {search && (
          <button onClick={() => setSearch("")} style={{
            background: "none", border: "none", color: T.ghost, cursor: "pointer", fontSize: 14,
          }}>✕</button>
        )}
      </div>

      {/* priority filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        {[["todos", "Todos", null, null], ...priorities.map(p => [p.id, p.label, p.color, p.bg])].map(([id, lbl, col, bg]) => {
          const isActive = filterPrio === id;
          return (
            <button key={id} onClick={() => setFilterPrio(id)} style={{
              padding: "6px 13px", borderRadius: R.pill, border: "none",
              background: isActive ? (id === "todos" ? T.ink : col) : (bg || T.bgSurf),
              color: isActive ? (id === "todos" ? T.bg : "#FFF") : (col || T.inkL),
              ...sans, fontSize: 11, cursor: "pointer", transition: "all .15s",
              fontWeight: isActive ? 600 : 400,
              minHeight: 32,
            }}>{lbl}</button>
          );
        })}
      </div>

      {/* category filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }}>
        <button onClick={() => setFilterCat(null)} style={{
          padding: "6px 13px", borderRadius: R.pill, border: "none", whiteSpace: "nowrap",
          background: !filterCat ? accent : T.bgSurf,
          color: !filterCat ? "#FFF" : T.inkL,
          ...sans, fontSize: 11, cursor: "pointer", minHeight: 32,
        }}>Todas</button>
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setFilterCat(filterCat === cat.id ? null : cat.id)} style={{
            padding: "6px 13px", borderRadius: R.pill, border: "none", whiteSpace: "nowrap",
            background: filterCat === cat.id ? accent : T.bgSurf,
            color: filterCat === cat.id ? "#FFF" : T.inkL,
            ...sans, fontSize: 11, cursor: "pointer", minHeight: 32,
          }}>{cat.label}</button>
        ))}
      </div>

      {visible.length === 0
        ? (
          <div style={{
            textAlign: "center", padding: "48px 20px",
            ...sans, fontSize: 13, color: T.ghost,
            background: T.bgCard, borderRadius: R.lg,
            border: `0.5px dashed ${T.border}`,
          }}>
            Nenhum item encontrado
          </div>
        )
        : visible.map(cat => (
          <div key={cat.id} style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ ...serif, fontSize: 13, letterSpacing: 0.8, color: accent, textTransform: "uppercase", fontWeight: 600, fontStyle: "italic" }}>
                {cat.label}
              </span>
              <div style={{ height: 0.5, flex: 1, background: T.border }} />
            </div>
            {cat.items.map(item => (
              <ItemCard key={item.id} item={item} priorities={priorities} accent={accent}
                entries={entries} customTags={customTags}
                onChangeEntry={onChangeEntry}
                onDeleteItem={onDeleteItem}
                onUpdateItem={onUpdateItem} />
            ))}
          </div>
        ))
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINANCE
// ─────────────────────────────────────────────────────────────────────────────
const FINANCE_BUCKETS = [
  { id: "essencial", label: "Essencial", matchFn: p => p.id === "essencial" },
  { id: "desejavel", label: "Desejável",  matchFn: p => p.id === "desejavel" },
  { id: "outros",    label: "Outros",     matchFn: p => p.id !== "essencial" && p.id !== "desejavel" },
];

function Finance({ categories, items, entries, priorities, accent, budgetTotal, budgetByCategory, onSetBudgetTotal, onSetBudgetCategory }) {
  const [showBudgetPanel, setShowBudgetPanel] = useState(false);
  const [budgetMode, setBudgetMode]           = useState("total");
  const [editBudgetTotal, setEditBudgetTotal] = useState(budgetTotal || "");
  const [editBudgetCat, setEditBudgetCat]     = useState({ ...budgetByCategory });

  useEffect(() => { setEditBudgetTotal(budgetTotal || ""); }, [budgetTotal]);
  useEffect(() => { setEditBudgetCat({ ...budgetByCategory }); }, [JSON.stringify(budgetByCategory)]);

  const itemSpentFn = item => item.sizes.reduce((s, sz) =>
    s + (entries[`${item.id}_${sz.tam}`]?.units || []).reduce((a, u) => a + (parseFloat(u.price) || 0), 0), 0);

  let grandTotal = 0;
  const catMap = {};
  categories.forEach(cat => {
    let ct = 0;
    items.filter(i => i.catId === cat.id).forEach(item => { ct += itemSpentFn(item); });
    grandTotal += ct;
    catMap[cat.id] = { total: ct, items: items.filter(i => i.catId === cat.id) };
  });

  const btNum = parseFloat(budgetTotal) || 0;
  const catBudget = catId => { const v = parseFloat((budgetByCategory || {})[catId]); return isNaN(v) ? 0 : v; };
  const grandBudget = btNum > 0 ? btNum : categories.reduce((s, c) => s + catBudget(c.id), 0);
  const pct = grandBudget > 0 ? Math.round(grandTotal / grandBudget * 100) : 0;

  const buckets = FINANCE_BUCKETS.map(bk => {
    let total = 0;
    items.forEach(item => {
      const pObj = priorities.find(p => p.id === item.priority) || { id: item.priority };
      if (!bk.matchFn(pObj)) return;
      total += itemSpentFn(item);
    });
    const refPrio = priorities.find(p => p.id === bk.id);
    const color = refPrio?.color || T.inkLL;
    const bg    = refPrio?.bg    || T.bgSurf;
    return { ...bk, total, color, bg };
  });

  const saveBudget = () => {
    if (budgetMode === "total") { onSetBudgetTotal(editBudgetTotal); }
    else { onSetBudgetCategory({ ...editBudgetCat }); }
    setShowBudgetPanel(false);
  };

  return (
    <div>
      {/* hero card */}
      <div style={{
        background: T.bgCard,
        border: `0.5px solid ${T.border}`,
        borderRadius: R.xl,
        padding: "20px",
        marginBottom: 12,
        boxShadow: shadow.card,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <div style={{ ...sans, fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: T.inkLL, marginBottom: 4 }}>Total investido</div>
            <div style={{ ...serif, fontSize: 34, color: accent, fontWeight: 300, letterSpacing: -1, fontStyle: "italic" }}>
              {fmtBRL(grandTotal)}
            </div>
            {grandBudget > 0 && (
              <div style={{ ...sans, fontSize: 12, color: T.inkLL, marginTop: 4 }}>
                de {fmtBRL(grandBudget)} orçados · {pct}% executado
              </div>
            )}
          </div>
          <button onClick={() => setShowBudgetPanel(x => !x)} style={{
            background: showBudgetPanel ? accent : accent + "18",
            color: showBudgetPanel ? "#FFF" : accent,
            border: `0.5px solid ${accent}44`, borderRadius: R.md,
            ...sans, fontSize: 11, letterSpacing: 0.8, textTransform: "uppercase",
            padding: "8px 13px", cursor: "pointer", flexShrink: 0, marginTop: 2,
            transition: "all .2s", minHeight: 40,
          }}>
            {grandBudget > 0 ? "Editar orçamento" : "Definir orçamento"}
          </button>
        </div>
        <div style={{ height: 4, background: T.bgSurf, borderRadius: R.pill, overflow: "hidden" }}>
          <div style={{ height: "100%", background: accent, width: `${pct}%`, borderRadius: R.pill, transition: "width .5s" }} />
        </div>
      </div>

      {/* budget panel */}
      {showBudgetPanel && (
        <div style={{
          background: T.bgCard, border: `0.5px solid ${accent}44`,
          borderRadius: R.lg, padding: "16px", marginBottom: 12,
          boxShadow: shadow.card,
        }}>
          <div style={{ ...serif, fontSize: 14, color: T.ink, fontStyle: "italic", marginBottom: 12 }}>Definir orçamento</div>
          <div style={{ display: "flex", gap: 0, marginBottom: 12, border: `0.5px solid ${T.border}`, borderRadius: R.md, overflow: "hidden" }}>
            {[["total", "Valor total"], ["categoria", "Por categoria"]].map(([id, lbl]) => (
              <button key={id} onClick={() => setBudgetMode(id)} style={{
                flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
                background: budgetMode === id ? accent : T.bgSurf,
                color: budgetMode === id ? "#FFF" : T.inkL,
                ...sans, fontSize: 12, transition: "all .15s", minHeight: 40,
              }}>{lbl}</button>
            ))}
          </div>
          {budgetMode === "total" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "12px", marginBottom: 12 }}>
              <span style={{ ...mono, fontSize: 10, color: T.inkLL, flexShrink: 0 }}>R$</span>
              <input type="number" step="100" value={editBudgetTotal}
                onChange={e => setEditBudgetTotal(e.target.value)}
                placeholder="Ex: 8000"
                style={{ flex: 1, background: "transparent", border: "none", ...mono, fontSize: 18, color: accent, outline: "none", fontWeight: 500 }} />
            </div>
          )}
          {budgetMode === "categoria" && (
            <div style={{ marginBottom: 12 }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 0", borderBottom: `0.5px solid ${T.borderL}` }}>
                  <span style={{ ...serif, fontSize: 13, color: T.inkL, fontStyle: "italic", flex: 1 }}>{cat.label}</span>
                  <span style={{ ...mono, fontSize: 11, color: T.inkLL }}>R$</span>
                  <input type="number" step="50" value={editBudgetCat[cat.id] || ""}
                    onChange={e => setEditBudgetCat(prev => ({ ...prev, [cat.id]: e.target.value }))}
                    placeholder="0"
                    style={{ width: 90, background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.sm, ...mono, fontSize: 13, color: accent, outline: "none", padding: "6px 8px", textAlign: "right", minHeight: 36 }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={saveBudget} style={{
              flex: 1, padding: "11px", background: accent, color: "#FFF", border: "none",
              borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", fontWeight: 600, minHeight: 44,
            }}>Salvar</button>
            <button onClick={() => setShowBudgetPanel(false)} style={{
              padding: "11px 14px", background: T.bgSurf, color: T.inkL, border: "none",
              borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", minHeight: 44,
            }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* 3-bucket */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 14 }}>
        {buckets.map(bk => (
          <div key={bk.id} style={{
            background: bk.bg, border: `0.5px solid ${bk.color}33`,
            borderRadius: R.md, padding: "12px 10px", textAlign: "center",
            boxShadow: shadow.card,
          }}>
            <div style={{ ...sans, fontSize: 10, letterSpacing: 0.7, textTransform: "uppercase", color: bk.color, marginBottom: 4 }}>{bk.label}</div>
            <div style={{ ...serif, fontSize: 16, color: bk.color, fontWeight: 300, fontStyle: "italic" }}>{fmtBRL(bk.total)}</div>
          </div>
        ))}
      </div>

      {/* by category */}
      {categories.map(cat => {
        const cd = catMap[cat.id];
        if (!cd || cd.items.length === 0) return null;
        const cBudget = catBudget(cat.id);
        const catPct  = cBudget > 0 ? Math.round(cd.total / cBudget * 100) : 0;
        const [exp, setExp] = useState(false);
        return (
          <div key={cat.id} style={{ marginBottom: 8, border: `0.5px solid ${T.border}`, borderRadius: R.lg, overflow: "hidden", boxShadow: shadow.card }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", cursor: "pointer", background: T.bgCard }}
              onClick={() => setExp(x => !x)}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 5 }}>
                  <span style={{ ...serif, fontSize: 14, color: T.ink, fontStyle: "italic" }}>{cat.label}</span>
                  <span style={{ ...sans, fontSize: 11, color: T.inkLL }}>
                    {cd.items.filter(r => parseFloat(r.price) > 0).length}/{cd.items.length} c/ preço
                  </span>
                </div>
                <div style={{ height: 3, background: T.bgSurf, borderRadius: R.pill, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: accent, width: `${catPct}%`, borderRadius: R.pill }} />
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ ...serif, fontSize: 14, color: T.ink, fontStyle: "italic" }}>{fmtBRL(cd.total)}</div>
                {cBudget > 0 && <div style={{ ...sans, fontSize: 11, color: T.inkLL }}>{fmtBRL(cBudget)} orçado</div>}
              </div>
              <span style={{ color: T.ghost, fontSize: 10, transform: exp ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>▾</span>
            </div>
            {exp && (
              <div style={{ borderTop: `0.5px solid ${T.borderL}` }}>
                {cd.items.map((item, i) => {
                  const pm = getPrio(priorities, item.priority);
                  const itemSpent = itemSpentFn(item);
                  const bought = item.sizes.reduce((s, sz) => s + (entries[`${item.id}_${sz.tam}`]?.units?.length || 0), 0);
                  const totalQty = item.sizes.reduce((s, sz) => s + sz.qty, 0);
                  return (
                    <div key={item.id} style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
                      borderBottom: i < cd.items.length - 1 ? `0.5px solid ${T.borderL}` : "none",
                      background: i % 2 === 0 ? T.bg : T.bgCard,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ ...serif, fontSize: 13, color: T.inkL, fontStyle: "italic" }}>{item.name}</div>
                        {itemSpent > 0 && <div style={{ ...sans, fontSize: 11, color: T.inkLL, marginTop: 2 }}>{bought}/{totalQty} · {fmtBRL(itemSpent)}</div>}
                      </div>
                      <Chip label={pm.label} color={pm.color} bg={pm.bg} xs />
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ ...mono, fontSize: 11, color: itemSpent > 0 ? accent : T.ghost, fontWeight: itemSpent > 0 ? 500 : 400 }}>
                          {itemSpent > 0 ? fmtBRL(itemSpent) : "—"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {grandTotal === 0 && (
        <div style={{
          textAlign: "center", padding: "40px",
          ...sans, fontSize: 12, color: T.ghost,
          border: `0.5px dashed ${T.border}`, borderRadius: R.lg,
          background: T.bgCard,
        }}>
          Cadastre preços nos itens do Checklist<br />para visualizar o resumo financeiro
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────────────────────
function Gallery({ categories, items, entries, customTags, priorities, accent }) {
  const [filters, setFilters] = useState({});
  const [showF, setShowF]     = useState(false);

  const allPhotos = [];
  categories.forEach(cat => items.filter(i => i.catId === cat.id).forEach(item =>
    item.sizes.forEach(sz => {
      const key = `${item.id}_${sz.tam}`;
      (entries[key]?.units || []).forEach((u, ui) => {
        if (u.photo || u.noPhoto) allPhotos.push({
          src: u.photo, noPhoto: u.noPhoto, unitIndex: ui + 1,
          itemName: item.name, priority: item.priority, tam: sz.tam,
          catId: cat.id, catLabel: cat.label, tags: u.tags || [], note: u.note || "",
        });
      });
    })
  ));

  const toggle = (k, v) => setFilters(f => {
    const c = f[k] || [];
    return { ...f, [k]: c.includes(v) ? c.filter(x => x !== v) : [...c, v] };
  });

  const filtered = allPhotos.filter(p => {
    if ((filters.tams  || []).length && !filters.tams.includes(p.tam))           return false;
    if ((filters.prios || []).length && !filters.prios.includes(p.priority))     return false;
    if ((filters.cats  || []).length && !filters.cats.includes(p.catId))         return false;
    if ((filters.tags  || []).length && !filters.tags.some(t => p.tags.includes(t))) return false;
    return true;
  });

  const allTams   = [...new Set(items.flatMap(i => i.sizes.map(s => s.tam)))];
  const activeF   = Object.values(filters).flat().length;

  const FPill = ({ label, active, onClick, color = accent }) => (
    <button onClick={onClick} style={{
      padding: "6px 12px", borderRadius: R.pill, border: `0.5px solid ${color}44`,
      background: active ? color : color + "18",
      color: active ? "#FFF" : color,
      ...sans, fontSize: 11, cursor: "pointer", transition: "all .15s",
      minHeight: 32,
    }}>{label}</button>
  );

  if (allPhotos.length === 0) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: T.ghost }}>
      <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.2 }}>◫</div>
      <div style={{ ...sans, fontSize: 12 }}>Nenhum registro ainda</div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <button onClick={() => setShowF(x => !x)} style={{
          display: "flex", alignItems: "center", gap: 6,
          background: showF ? accent : accent + "15",
          color: showF ? "#FFF" : accent,
          border: `0.5px solid ${accent}44`, borderRadius: R.md,
          padding: "8px 14px", ...sans, fontSize: 12, cursor: "pointer", transition: "all .2s",
          minHeight: 40,
        }}>
          ⊞ Filtros{activeF > 0 && ` (${activeF})`}
        </button>
        <span style={{ ...sans, fontSize: 12, color: T.inkLL }}>{filtered.length} de {allPhotos.length}</span>
      </div>

      {showF && (
        <div style={{ background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: R.lg, padding: "14px", marginBottom: 14, boxShadow: shadow.card }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ ...serif, fontSize: 13, color: T.ink, fontStyle: "italic" }}>Filtros</span>
            <button onClick={() => setFilters({})} style={{ ...sans, fontSize: 12, color: T.inkLL, background: "none", border: "none", cursor: "pointer" }}>Limpar</button>
          </div>
          {[
            ["Tamanho",    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{allTams.map(t => { const ts = TAM_COLORS[t] || TAM_COLORS["—"]; return <FPill key={t} label={t} active={(filters.tams || []).includes(t)} onClick={() => toggle("tams", t)} color={ts.color} />; })}</div>],
            ["Prioridade", <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{priorities.map(p => <FPill key={p.id} label={p.label} active={(filters.prios || []).includes(p.id)} onClick={() => toggle("prios", p.id)} color={p.color} />)}</div>],
            ["Categoria",  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{categories.map(c => <FPill key={c.id} label={c.label} active={(filters.cats || []).includes(c.id)} onClick={() => toggle("cats", c.id)} />)}</div>],
            ["Tags",       <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{allTags(customTags).map(t => <FPill key={t.id} label={t.label} active={(filters.tags || []).includes(t.id)} onClick={() => toggle("tags", t.id)} color={t.color} />)}</div>],
          ].map(([lbl, content]) => (
            <div key={lbl} style={{ marginBottom: 10 }}>
              <div style={{ ...mono, fontSize: 10, letterSpacing: 1.2, textTransform: "uppercase", color: T.inkLL, marginBottom: 6 }}>{lbl}</div>
              {content}
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0
        ? <div style={{ textAlign: "center", padding: "40px", ...sans, fontSize: 12, color: T.ghost }}>Nenhuma foto para esses filtros</div>
        : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))", gap: 10 }}>
            {filtered.map((p, i) => {
              const pm  = getPrio(priorities, p.priority);
              const ts  = TAM_COLORS[p.tam] || TAM_COLORS["—"];
              const tgs = p.tags.map(id => tagById(id, customTags)).filter(Boolean);
              return (
                <div key={i} style={{ borderRadius: R.lg, overflow: "hidden", border: `0.5px solid ${T.border}`, background: T.bgCard, boxShadow: shadow.card }}>
                  <div style={{ aspectRatio: "1", background: T.bgSurf, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
                    {p.src
                      ? <img src={p.src} alt={p.itemName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <div style={{ textAlign: "center", color: T.ghost }}><div style={{ fontSize: 28, opacity: 0.2 }}>○</div><div style={{ ...sans, fontSize: 10, marginTop: 4 }}>sem foto</div></div>
                    }
                    {p.tam !== "—" && <span style={{ position: "absolute", top: 5, left: 5, ...mono, background: ts.bg, color: ts.color, fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: R.sm }}>{p.tam}</span>}
                    <span style={{ position: "absolute", bottom: 4, right: 4, ...mono, background: "#FFF", color: T.inkLL, fontSize: 10, padding: "2px 5px", borderRadius: R.sm, opacity: 0.85 }}>#{p.unitIndex}</span>
                  </div>
                  <div style={{ padding: "10px 10px" }}>
                    <div style={{ ...serif, fontSize: 13, color: T.ink, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{p.itemName}</div>
                    <div style={{ ...sans, fontSize: 11, color: T.inkLL, marginBottom: 5 }}>{p.catLabel}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                      <Chip label={pm.label} color={pm.color} bg={pm.bg} xs />
                      {tgs.slice(0, 2).map(t => <Chip key={t.id} label={t.label} color={t.color} xs />)}
                    </div>
                    {p.note && <div style={{ ...serif, fontSize: 11, color: T.inkLL, marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontStyle: "italic" }}>{p.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MANAGER
// ─────────────────────────────────────────────────────────────────────────────
function ManagerItemRow({ item, pm, onDelete, onUpdateSizes }) {
  const [expanded, setExpanded] = useState(false);
  const [sizes, setSizes]       = useState(item.sizes);

  const updateQty = (idx, val) => {
    const n = [...sizes]; n[idx] = { ...n[idx], qty: Math.max(0, parseInt(val) || 0) };
    setSizes(n); onUpdateSizes(n);
  };
  const addSize = () => {
    const n = [...sizes, { tam: "—", qty: 1 }];
    setSizes(n); onUpdateSizes(n);
  };
  const removeSize = idx => {
    const n = sizes.filter((_, i) => i !== idx);
    setSizes(n); onUpdateSizes(n);
  };
  const updateTam = (idx, val) => {
    const n = [...sizes]; n[idx] = { ...n[idx], tam: val };
    setSizes(n); onUpdateSizes(n);
  };

  return (
    <div style={{ background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: R.md, marginBottom: 5, overflow: "hidden", boxShadow: shadow.card }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 13px", cursor: "pointer" }}
        onClick={() => setExpanded(x => !x)}>
        <div style={{ flex: 1 }}>
          <div style={{ ...serif, fontSize: 14, color: T.ink, fontStyle: "italic" }}>{item.name}</div>
          <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
            <Chip label={pm.label} color={pm.color} bg={pm.bg} xs />
            {sizes.map((s, i) => (
              <span key={i} style={{ ...mono, fontSize: 10, color: T.inkLL, background: T.bgSurf, borderRadius: R.sm, padding: "3px 7px" }}>
                {s.tam !== "—" ? `${s.tam}×${s.qty}` : `×${s.qty}`}
              </span>
            ))}
          </div>
        </div>
        <span style={{ ...sans, fontSize: 11, color: T.inkLL, marginRight: 2 }}>Editar</span>
        <span style={{ color: T.ghost, fontSize: 13, transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}>▾</span>
        <button onClick={e => { e.stopPropagation(); onDelete(); }}
          style={{ background: "none", border: "none", color: T.ghost, cursor: "pointer", fontSize: 14, padding: "6px 8px", minHeight: 36 }}>✕</button>
      </div>

      {expanded && (
        <div style={{ padding: "4px 13px 13px", borderTop: `0.5px solid ${T.border}` }}>
          <div style={{ ...mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.inkLL, marginBottom: 8, marginTop: 8 }}>
            Tamanhos e quantidades
          </div>
          {sizes.map((sz, i) => (
            <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
              <select value={sz.tam} onChange={e => updateTam(i, e.target.value)} style={{
                background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.sm,
                padding: "8px 8px", ...sans, fontSize: 12, color: T.ink, cursor: "pointer", outline: "none", width: 76, minHeight: 40,
              }}>
                {["—", "RN", "P", "M", "G", "GG"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span style={{ ...mono, fontSize: 13, color: T.inkLL }}>×</span>
              <input type="number" min={0} value={sz.qty}
                onChange={e => updateQty(i, e.target.value)}
                style={{
                  width: 68, background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.sm,
                  padding: "8px", ...mono, fontSize: 14, color: T.ink, outline: "none", textAlign: "center", minHeight: 40,
                }} />
              {sizes.length > 1 && (
                <button onClick={() => removeSize(i)}
                  style={{ background: "none", border: "none", color: T.ghost, cursor: "pointer", fontSize: 14, padding: "6px 8px", minHeight: 36 }}>✕</button>
              )}
            </div>
          ))}
          <button onClick={addSize} style={{
            background: "transparent", color: T.inkLL, border: `0.5px dashed ${T.border}`,
            borderRadius: R.sm, padding: "6px 12px", ...sans, fontSize: 11, cursor: "pointer", marginTop: 2, minHeight: 36,
          }}>+ Tamanho</button>
        </div>
      )}
    </div>
  );
}

function TagManagerRow({ tag, isPreset, onEdit, onDelete, accent }) {
  const [editing, setEditing] = useState(false);
  const [lbl, setLbl]         = useState(tag.label);
  const [col, setCol]         = useState(tag.color);
  const save = () => { if (lbl.trim()) { onEdit(lbl.trim(), col); setEditing(false); } };
  return (
    <div style={{ background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: R.md, marginBottom: 5, overflow: "hidden", boxShadow: shadow.card }}>
      {editing ? (
        <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input autoFocus value={lbl} onChange={e => setLbl(e.target.value)}
              onKeyDown={e => e.key === "Enter" && save()}
              style={{ flex: 1, background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "9px 12px", ...serif, fontSize: 13, color: T.ink, outline: "none", minHeight: 40 }} />
            <input type="color" value={col} onChange={e => setCol(e.target.value)}
              style={{ width: 40, height: 40, border: `0.5px solid ${T.border}`, borderRadius: R.sm, cursor: "pointer", padding: 2 }} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={save} style={{ flex: 1, padding: "9px", background: accent, color: "#FFF", border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", fontWeight: 600, minHeight: 40 }}>Salvar</button>
            <button onClick={() => setEditing(false)} style={{ padding: "9px 13px", background: T.bgSurf, color: T.inkL, border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", minHeight: 40 }}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: tag.color, flexShrink: 0 }} />
          <Chip label={tag.label} color={tag.color} />
          {isPreset && <span style={{ ...sans, fontSize: 10, color: T.ghost }}>padrão</span>}
          <span style={{ flex: 1 }} />
          <button onClick={() => { setLbl(tag.label); setCol(tag.color); setEditing(true); }} style={{
            background: T.bgSurf, color: T.inkL, border: `0.5px solid ${T.border}`,
            borderRadius: R.sm, ...sans, fontSize: 11, padding: "5px 11px", cursor: "pointer", minHeight: 32,
          }}>Editar</button>
          {!isPreset && (
            <button onClick={onDelete} style={{ background: "none", border: "none", color: T.ghost, cursor: "pointer", fontSize: 14, padding: "6px 8px", minHeight: 36 }}>✕</button>
          )}
        </div>
      )}
    </div>
  );
}

function AddTagForm({ onAdd, accent }) {
  const [open, setOpen] = useState(false);
  const [lbl, setLbl]   = useState("");
  const [col, setCol]   = useState("#C9856B");
  const add = () => {
    if (!lbl.trim()) return;
    onAdd({ id: "c_" + uid(), label: lbl.trim(), color: col });
    setLbl(""); setOpen(false);
  };
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      width: "100%", marginTop: 6, padding: "11px",
      background: accent + "15", color: accent,
      border: `0.5px solid ${accent}44`, borderRadius: R.md,
      ...sans, fontSize: 12, cursor: "pointer", minHeight: 44,
    }}>+ Nova tag</button>
  );
  return (
    <div style={{ background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.lg, padding: "14px", marginTop: 8 }}>
      <div style={{ ...serif, fontSize: 14, color: T.ink, fontStyle: "italic", marginBottom: 10 }}>Nova tag</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
        <input autoFocus value={lbl} onChange={e => setLbl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()} placeholder="Nome da tag…"
          style={{ flex: 1, background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "10px 12px", ...serif, fontSize: 13, color: T.ink, outline: "none", minHeight: 40 }} />
        <input type="color" value={col} onChange={e => setCol(e.target.value)}
          style={{ width: 40, height: 40, border: `0.5px solid ${T.border}`, borderRadius: R.sm, cursor: "pointer", padding: 2 }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={add} style={{ flex: 1, padding: "10px", background: accent, color: "#FFF", border: "none", borderRadius: R.md, ...sans, fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 44 }}>Criar</button>
        <button onClick={() => { setOpen(false); setLbl(""); }} style={{ padding: "10px 14px", background: T.bgSurf, color: T.inkL, border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", minHeight: 44 }}>Cancelar</button>
      </div>
    </div>
  );
}

function Manager({ categories, items, priorities, customTags, accent, onAddCat, onDeleteCat, onAddItem, onDeleteItem, onUpdateItem, onSetPriorities, onShowTheme, onCreateTag, onDeleteTag, onEditTag }) {
  const [section, setSection]         = useState("itens");
  const [activeCat, setActiveCat]     = useState(categories[0]?.id || "");
  const [newCatLabel, setNewCatLabel] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrio, setNewItemPrio] = useState(priorities[0]?.id || "essencial");
  const [newItemSizes, setNewItemSizes] = useState([{ tam: "—", qty: 1 }]);
  const [addingCat,   setAddingCat]   = useState(false);
  const [addingItem,  setAddingItem]  = useState(false);
  const [editPrioId,  setEditPrioId]  = useState(null);
  const [editLbl,     setEditLbl]     = useState("");
  const [editCol,     setEditCol]     = useState("");
  const [newPrioLbl,  setNewPrioLbl]  = useState("");
  const [newPrioCol,  setNewPrioCol]  = useState(accent);
  const [addingPrio,  setAddingPrio]  = useState(false);
  const catItems = items.filter(i => i.catId === activeCat);

  const updSzTam = (idx, v) => setNewItemSizes(s => { const n = [...s]; n[idx] = { ...n[idx], tam: v }; return n; });
  const updSzQty = (idx, v) => setNewItemSizes(s => { const n = [...s]; n[idx] = { ...n[idx], qty: parseInt(v) || 1 }; return n; });

  const saveEditPrio = () => {
    if (!editLbl.trim()) return;
    const r = parseInt(editCol.slice(1, 3), 16), g = parseInt(editCol.slice(3, 5), 16), b = parseInt(editCol.slice(5, 7), 16);
    onSetPriorities(priorities.map(p => p.id === editPrioId ? { ...p, label: editLbl.trim(), color: editCol, bg: `rgba(${r},${g},${b},0.15)` } : p));
    setEditPrioId(null);
  };
  const deletePrio = id => {
    if (priorities.length <= 1) { alert("Deve existir ao menos uma prioridade."); return; }
    if (items.some(i => i.priority === id) && !confirm("Itens usam esta prioridade. Continuar?")) return;
    onSetPriorities(priorities.filter(p => p.id !== id));
  };
  const addPrio = () => {
    if (!newPrioLbl.trim()) return;
    const id = "prio_" + uid();
    const r = parseInt(newPrioCol.slice(1, 3), 16), g = parseInt(newPrioCol.slice(3, 5), 16), b = parseInt(newPrioCol.slice(5, 7), 16);
    onSetPriorities([...priorities, { id, label: newPrioLbl.trim(), color: newPrioCol, bg: `rgba(${r},${g},${b},0.15)` }]);
    setNewPrioLbl(""); setAddingPrio(false);
  };

  const STab = ({ id, lbl }) => (
    <button onClick={() => setSection(id)} style={{
      flex: 1, padding: "9px 0", border: "none", cursor: "pointer",
      background: section === id ? accent : T.bgSurf,
      color: section === id ? "#FFF" : T.inkL,
      ...sans, fontSize: 11, transition: "all .15s", minHeight: 40,
    }}>{lbl}</button>
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 18, border: `0.5px solid ${T.border}`, borderRadius: R.md, overflow: "hidden" }}>
        <STab id="itens" lbl="Itens & Cat." />
        <STab id="prioridades" lbl="Prioridades" />
        <STab id="tags" lbl="Tags" />
        <STab id="aparencia" lbl="Aparência" />
      </div>

      {/* PRIORITIES */}
      {section === "prioridades" && (
        <div>
          <div style={{ ...serif, fontSize: 18, color: T.ink, fontStyle: "italic", marginBottom: 4 }}>Prioridades</div>
          <div style={{ ...sans, fontSize: 12, color: T.inkLL, marginBottom: 12, lineHeight: 1.6 }}>
            Personalize as prioridades dos itens. <span style={{ color: accent }}>Essencial</span> e <span style={{ color: T.amber }}>Desejável</span> são fixos nos totais de Finanças.
          </div>
          {priorities.map(p => {
            const locked = p.id === "essencial" || p.id === "desejavel";
            return (
              <div key={p.id} style={{ background: T.bgCard, border: `0.5px solid ${locked ? p.color + "33" : T.border}`, borderRadius: R.md, marginBottom: 5, overflow: "hidden", boxShadow: shadow.card }}>
                {editPrioId === p.id ? (
                  <div style={{ padding: "13px", display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <div style={{ ...mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.inkLL }}>Editar cor</div>
                      {locked && <span style={{ ...sans, fontSize: 10, color: p.color }}>— nome protegido</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {locked
                        ? <div style={{ flex: 1, background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "9px 12px", ...serif, fontSize: 13, color: T.inkLL, fontStyle: "italic", minHeight: 40, display: "flex", alignItems: "center" }}>{p.label}</div>
                        : <input value={editLbl} onChange={e => setEditLbl(e.target.value)} style={{ flex: 1, background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "9px 12px", ...serif, fontSize: 13, color: T.ink, outline: "none", minHeight: 40 }} />
                      }
                      <input type="color" value={editCol} onChange={e => setEditCol(e.target.value)}
                        style={{ width: 40, height: 40, border: `0.5px solid ${T.border}`, borderRadius: R.sm, cursor: "pointer", padding: 2 }} />
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={saveEditPrio} style={{ flex: 1, padding: "9px", background: accent, color: "#FFF", border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", fontWeight: 600, minHeight: 40 }}>Salvar</button>
                      <button onClick={() => setEditPrioId(null)} style={{ padding: "9px 13px", background: T.bgSurf, color: T.inkL, border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", minHeight: 40 }}>Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 13px" }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                    <Chip label={p.label} color={p.color} bg={p.bg} />
                    {locked && <span style={{ ...sans, fontSize: 10, color: T.ghost }}>fixo</span>}
                    <span style={{ ...sans, fontSize: 11, color: T.inkLL, flex: 1 }}>
                      {items.filter(i => i.priority === p.id).length} item{items.filter(i => i.priority === p.id).length !== 1 ? "s" : ""}
                    </span>
                    <button onClick={() => { setEditPrioId(p.id); setEditLbl(p.label); setEditCol(p.color); }} style={{
                      background: T.bgSurf, color: T.inkL, border: `0.5px solid ${T.border}`,
                      borderRadius: R.sm, ...sans, fontSize: 11, padding: "5px 10px", cursor: "pointer", minHeight: 32,
                    }}>{locked ? "Cor" : "Editar"}</button>
                    {!locked && (
                      <button onClick={() => deletePrio(p.id)} style={{ background: "none", border: "none", color: T.ghost, cursor: "pointer", fontSize: 14, padding: "6px 8px", minHeight: 36 }}>✕</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
          {addingPrio ? (
            <div style={{ background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.lg, padding: "13px", marginTop: 8 }}>
              <div style={{ ...serif, fontSize: 14, color: T.ink, fontStyle: "italic", marginBottom: 10 }}>Nova prioridade</div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                <input autoFocus value={newPrioLbl} onChange={e => setNewPrioLbl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addPrio()} placeholder="Nome…"
                  style={{ flex: 1, background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "9px 12px", ...serif, fontSize: 13, color: T.ink, outline: "none", minHeight: 40 }} />
                <input type="color" value={newPrioCol} onChange={e => setNewPrioCol(e.target.value)}
                  style={{ width: 40, height: 40, border: `0.5px solid ${T.border}`, borderRadius: R.sm, cursor: "pointer", padding: 2 }} />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={addPrio} style={{ flex: 1, padding: "9px", background: accent, color: "#FFF", border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", fontWeight: 600, minHeight: 40 }}>Criar</button>
                <button onClick={() => { setAddingPrio(false); setNewPrioLbl(""); }} style={{ padding: "9px 13px", background: T.bgSurf, color: T.inkL, border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", minHeight: 40 }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAddingPrio(true)} style={{
              width: "100%", marginTop: 6, padding: "10px",
              background: "transparent", color: T.inkLL,
              border: `0.5px dashed ${T.border}`, borderRadius: R.md,
              ...sans, fontSize: 12, cursor: "pointer", minHeight: 44,
            }}>+ Nova prioridade</button>
          )}
        </div>
      )}

      {/* TAGS */}
      {section === "tags" && (
        <div>
          <div style={{ ...serif, fontSize: 18, color: T.ink, fontStyle: "italic", marginBottom: 4 }}>Tags</div>
          <div style={{ ...sans, fontSize: 12, color: T.inkLL, marginBottom: 14, lineHeight: 1.6 }}>
            Gerencie as tags disponíveis para classificar as unidades do enxoval.
          </div>
          {allTags(customTags).map(tag => (
            <TagManagerRow key={tag.id} tag={tag}
              isPreset={PRESET_TAGS.some(p => p.id === tag.id)}
              onEdit={(newLabel, newColor) => onEditTag(tag.id, newLabel, newColor)}
              onDelete={() => onDeleteTag(tag.id)}
              accent={accent} />
          ))}
          <AddTagForm onAdd={onCreateTag} accent={accent} />
        </div>
      )}

      {/* APPEARANCE */}
      {section === "aparencia" && (
        <div>
          <div style={{ ...serif, fontSize: 18, color: T.ink, fontStyle: "italic", marginBottom: 14 }}>Aparência</div>
          <div style={{ ...mono, fontSize: 10, letterSpacing: 1.5, textTransform: "uppercase", color: T.inkLL, marginBottom: 10 }}>Cor de destaque</div>
          <button onClick={onShowTheme} style={{
            width: "100%", padding: "16px",
            border: `0.5px solid ${T.border}`, borderRadius: R.lg,
            background: T.bgCard, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 14,
            transition: "all .2s", boxShadow: shadow.card,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: accent,
              border: `2px solid ${accent}44`, flexShrink: 0,
            }} />
            <div style={{ textAlign: "left" }}>
              <div style={{ ...sans, fontSize: 13, color: T.ink, fontWeight: 600 }}>Alterar cor de destaque</div>
              <div style={{ ...sans, fontSize: 11, color: T.inkLL, marginTop: 2 }}>Terracota · Sálvia · Rosa pó · Oceano · Lavanda</div>
            </div>
            <div style={{ marginLeft: "auto", color: T.inkLL, fontSize: 16 }}>›</div>
          </button>
        </div>
      )}

      {/* ITEMS & CATEGORIES */}
      {section === "itens" && (
        <div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{
                padding: "6px 13px", borderRadius: R.pill, border: "none", cursor: "pointer",
                background: activeCat === cat.id ? accent : T.bgSurf,
                color: activeCat === cat.id ? "#FFF" : T.inkL,
                ...sans, fontSize: 11, transition: "all .15s", minHeight: 32,
              }}>{cat.label}</button>
            ))}
            {!addingCat && (
              <button onClick={() => setAddingCat(true)} style={{
                padding: "6px 13px", borderRadius: R.pill, border: `0.5px dashed ${T.border}`,
                background: "transparent", color: T.inkLL, cursor: "pointer",
                ...sans, fontSize: 11, minHeight: 32,
              }}>+ Categ.</button>
            )}
          </div>

          {addingCat && (
            <div style={{ display: "flex", gap: 6, marginBottom: 12, padding: "10px 12px", background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.md }}>
              <input autoFocus value={newCatLabel} onChange={e => setNewCatLabel(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && newCatLabel.trim()) {
                    const id = "cat_" + uid();
                    onAddCat({ id, label: newCatLabel.trim() });
                    setNewCatLabel(""); setAddingCat(false); setActiveCat(id);
                  }
                }}
                placeholder="Nome da categoria…"
                style={{ flex: 1, background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "8px 12px", ...serif, fontSize: 13, color: T.ink, outline: "none", minHeight: 40 }} />
              <button onClick={() => {
                if (!newCatLabel.trim()) return;
                const id = "cat_" + uid();
                onAddCat({ id, label: newCatLabel.trim() });
                setNewCatLabel(""); setAddingCat(false); setActiveCat(id);
              }} style={{ background: accent, color: "#FFF", border: "none", borderRadius: R.md, padding: "8px 14px", ...sans, fontSize: 12, cursor: "pointer", fontWeight: 600, minHeight: 40 }}>Criar</button>
              <button onClick={() => { setAddingCat(false); setNewCatLabel(""); }} style={{ background: T.bgSurf, color: T.inkL, border: "none", borderRadius: R.md, padding: "8px 12px", ...sans, fontSize: 12, cursor: "pointer", minHeight: 40 }}>✕</button>
            </div>
          )}

          <div style={{ height: 0.5, background: T.border, marginBottom: 12 }} />

          {(() => {
            const cat = categories.find(c => c.id === activeCat);
            if (!cat) return null;
            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ ...serif, fontSize: 17, color: T.ink, fontStyle: "italic" }}>{cat.label}</div>
                <button onClick={() => {
                  if (catItems.length > 0) { alert("Remova os itens antes de excluir."); return; }
                  if (confirm(`Excluir "${cat.label}"?`)) { onDeleteCat(cat.id); setActiveCat(categories.find(c => c.id !== cat.id)?.id || ""); }
                }} style={{
                  background: "none", border: `0.5px solid ${T.rose}44`,
                  borderRadius: R.sm, color: T.rose, cursor: "pointer",
                  ...sans, fontSize: 11, padding: "5px 11px", minHeight: 32,
                }}>Excluir</button>
              </div>
            );
          })()}

          {catItems.length === 0
            ? <div style={{ textAlign: "center", padding: "28px", ...sans, fontSize: 12, color: T.ghost, background: T.bgSurf, borderRadius: R.md, border: `0.5px dashed ${T.border}` }}>Nenhum item nesta categoria</div>
            : catItems.map(item => {
              const pm = getPrio(priorities, item.priority);
              return (
                <ManagerItemRow key={item.id} item={item} pm={pm}
                  onDelete={() => { if (confirm(`Remover "${item.name}"?`)) onDeleteItem(item.id); }}
                  onUpdateSizes={sizes => onUpdateItem(item.id, { ...item, sizes })} />
              );
            })
          }

          <div style={{ marginTop: 10 }}>
            {!addingItem ? (
              <button onClick={() => setAddingItem(true)} style={{
                width: "100%", padding: "11px",
                background: accent + "15", color: accent,
                border: `0.5px solid ${accent}44`, borderRadius: R.md,
                ...sans, fontSize: 12, cursor: "pointer", minHeight: 44,
              }}>+ Adicionar item em {categories.find(c => c.id === activeCat)?.label}</button>
            ) : (
              <div style={{ background: T.bgCard, border: `0.5px solid ${T.border}`, borderRadius: R.lg, padding: "14px", boxShadow: shadow.card }}>
                <div style={{ ...mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.inkLL, marginBottom: 6 }}>Nome do item</div>
                <input value={newItemName} onChange={e => setNewItemName(e.target.value)}
                  placeholder="Ex: Macacão térmico" autoFocus
                  style={{ width: "100%", background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.md, padding: "10px 12px", ...serif, fontSize: 13, color: T.ink, outline: "none", boxSizing: "border-box", marginBottom: 12, minHeight: 40 }} />
                <div style={{ ...mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.inkLL, marginBottom: 6 }}>Prioridade</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
                  {priorities.map(p => (
                    <button key={p.id} onClick={() => setNewItemPrio(p.id)} style={{
                      padding: "6px 13px", borderRadius: R.pill, border: "none", cursor: "pointer",
                      background: newItemPrio === p.id ? p.color : p.bg,
                      color: newItemPrio === p.id ? "#FFF" : p.color,
                      ...sans, fontSize: 11, transition: "all .15s", minHeight: 32,
                    }}>{p.label}</button>
                  ))}
                </div>
                <div style={{ ...mono, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", color: T.inkLL, marginBottom: 6 }}>Tamanhos e quantidades</div>
                {newItemSizes.map((sz, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 6 }}>
                    <select value={sz.tam} onChange={e => updSzTam(i, e.target.value)} style={{
                      background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.sm,
                      padding: "8px", ...sans, fontSize: 12, color: T.ink, cursor: "pointer", outline: "none", width: 76, minHeight: 40,
                    }}>
                      {["—", "RN", "P", "M", "G", "GG"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={{ ...mono, fontSize: 13, color: T.inkLL }}>×</span>
                    <input type="number" min={1} value={sz.qty} onChange={e => updSzQty(i, e.target.value)}
                      style={{ width: 68, background: T.bgSurf, border: `0.5px solid ${T.border}`, borderRadius: R.sm, padding: "8px", ...mono, fontSize: 13, color: T.ink, outline: "none", textAlign: "center", minHeight: 40 }} />
                    {newItemSizes.length > 1 && (
                      <button onClick={() => setNewItemSizes(s => s.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: T.ghost, cursor: "pointer", fontSize: 14, padding: "6px 8px", minHeight: 36 }}>✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => setNewItemSizes(s => [...s, { tam: "—", qty: 1 }])} style={{
                  background: "transparent", color: T.inkLL, border: `0.5px dashed ${T.border}`,
                  borderRadius: R.sm, padding: "6px 12px", ...sans, fontSize: 11, cursor: "pointer", marginBottom: 12, minHeight: 36,
                }}>+ Tamanho</button>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => {
                    if (!newItemName.trim()) return;
                    const id = "u_" + uid();
                    const ne = {};
                    newItemSizes.forEach(sz => { ne[`${id}_${sz.tam}`] = { units: [] }; });
                    onAddItem({ id, catId: activeCat, name: newItemName.trim(), priority: newItemPrio, sizes: newItemSizes, price: "" });
                    setNewItemName(""); setNewItemSizes([{ tam: "—", qty: 1 }]); setAddingItem(false);
                  }} style={{ flex: 1, padding: "11px", background: accent, color: "#FFF", border: "none", borderRadius: R.md, ...sans, fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 44 }}>Salvar item</button>
                  <button onClick={() => { setAddingItem(false); setNewItemName(""); setNewItemSizes([{ tam: "—", qty: 1 }]); }} style={{ padding: "11px 14px", background: T.bgSurf, color: T.inkL, border: "none", borderRadius: R.md, ...sans, fontSize: 12, cursor: "pointer", minHeight: 44 }}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THEME PICKER
// ─────────────────────────────────────────────────────────────────────────────
function ThemePicker({ currentId, onSelect, onClose, accent }) {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      display: "flex", alignItems: "flex-end",
      background: "rgba(42,31,24,0.5)",
    }} onClick={onClose}>
      <div style={{
        width: "100%", maxWidth: 520, margin: "0 auto",
        background: T.bgCard, borderRadius: "16px 16px 0 0",
        border: `0.5px solid ${T.border}`,
        padding: "22px 18px 36px",
        boxShadow: shadow.lifted,
      }} onClick={e => e.stopPropagation()}>
        <div style={{ ...mono, fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: T.inkLL, marginBottom: 4 }}>Tema de cor</div>
        <div style={{ ...serif, fontSize: 18, color: T.ink, fontStyle: "italic", marginBottom: 20 }}>Escolha o seu accent</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          {Object.values(ACCENT_PALETTES).map(p => {
            const on = p.id === currentId;
            return (
              <button key={p.id} onClick={() => { onSelect(p.id); onClose(); }} style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                background: on ? p.accentDim : T.bgSurf,
                border: `${on ? 2 : 0.5}px solid ${on ? p.accent : T.border}`,
                borderRadius: R.xl, padding: "16px 18px", cursor: "pointer",
                transition: "all .2s", minWidth: 84,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: p.accent,
                  boxShadow: on ? `0 0 0 4px ${p.accent}33` : "none",
                  transition: "box-shadow .2s",
                }} />
                <span style={{ ...sans, fontSize: 11, color: on ? p.accent : T.inkLL, fontWeight: on ? 600 : 400 }}>
                  {p.label}
                </span>
                {on && <span style={{ ...mono, fontSize: 10, color: p.accent }}>✓ ativo</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "checklist",  label: "Checklist" },
  { id: "financeiro", label: "Finanças"  },
  { id: "galeria",    label: "Galeria"   },
  { id: "gerenciar",  label: "Gerenciar" },
];

export default function App({ user, onLogout }) {
  const [app, setApp]             = useState(() => buildInitialApp());
  const [tab, setTab]             = useState("checklist");
  const [saving, setSaving]       = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState("");

  useEffect(() => { if (user?.id) loadApp(user.id).then(s => setApp(s)); }, [user?.id]);

  const persist = useCallback(next => {
    if (!user?.id) return;
    setSaving(true); saveApp(next, user.id).then(() => setSaving(false));
  }, [user?.id]);

  const update = useCallback(fn => {
    setApp(prev => { const next = fn(prev); persist(next); return next; });
  }, []);

  const updateEntry   = useCallback((key, val)  => { update(prev => ({ ...prev, entries: { ...prev.entries, [key]: val } })); }, []);
  const createTag     = useCallback(t           => { update(prev => ({ ...prev, customTags: [...(prev.customTags || []), t] })); }, []);
  const deleteTag     = useCallback(id          => { update(prev => ({ ...prev, customTags: (prev.customTags || []).filter(t => t.id !== id) })); }, []);
  const editTag       = useCallback((id, label, color) => {
    update(prev => ({
      ...prev,
      customTags: (prev.customTags || []).map(t => t.id === id ? { ...t, label, color } : t),
    }));
  }, []);
  const addCat        = useCallback(cat   => { update(prev => ({ ...prev, categories: [...prev.categories, cat] })); }, []);
  const deleteCat     = useCallback(id    => { update(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) })); }, []);
  const addItem       = useCallback(item  => {
    const ne = {};
    item.sizes.forEach(sz => { ne[`${item.id}_${sz.tam}`] = { units: [] }; });
    update(prev => ({ ...prev, items: [...prev.items, item], entries: { ...prev.entries, ...ne } }));
  }, []);
  const deleteItem    = useCallback(id    => { update(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) })); }, []);
  const updateItem    = useCallback((id, val) => { update(prev => ({ ...prev, items: prev.items.map(i => i.id === id ? val : i) })); }, []);
  const setPriorities = useCallback(prios => { update(prev => ({ ...prev, priorities: prios })); }, []);
  const setBudgetTotal = useCallback(v   => { update(prev => ({ ...prev, budgetTotal: v })); }, []);
  const setBudgetCat   = useCallback(v   => { update(prev => ({ ...prev, budgetByCategory: v })); }, []);
  const setBabyName    = useCallback(v   => { update(prev => ({ ...prev, babyName: v })); }, []);
  const setAccentId    = useCallback(id  => {
    update(prev => {
      const pal = ACCENT_PALETTES[id];
      const updPrios = (prev.priorities || []).map(p =>
        p.id === "essencial" ? { ...p, color: pal.accent, bg: pal.accentDim } : p
      );
      return { ...prev, accentId: id, priorities: updPrios };
    });
  }, []);

  const {
    categories = [], items = [], entries = {},
    customTags = [],
    priorities = buildDefaultPriorities(ACCENT_PALETTES.terracota),
    accentId = "terracota",
    budgetTotal = "", budgetByCategory = {},
    babyName = "",
  } = app;

  const pal    = ACCENT_PALETTES[accentId] || ACCENT_PALETTES.terracota;
  const accent = pal.accent;
  T = LIGHT; // Soft Nursery is always light

  // global stats
  let totalSug = 0, totalBought = 0, totalPending = 0, grandSpent = 0;
  items.forEach(item => {
    item.sizes.forEach(sz => {
      const units = (entries[`${item.id}_${sz.tam}`] || {}).units || [];
      totalSug += sz.qty;
      totalBought += units.length;
      totalPending += units.filter(u => !unitDone(u)).length;
      units.forEach(u => { grandSpent += parseFloat(u.price) || 0; });
    });
  });
  const globalPct = totalSug > 0 ? Math.round(totalBought / totalSug * 100) : 0;

  return (
    <div style={{
      fontFamily: "'DM Sans','Helvetica Neue',sans-serif",
      background: T.bg,
      minHeight: "100vh",
      maxWidth: 520,
      margin: "0 auto",
      color: T.ink,
    }}>
      {/* ── HEADER ── */}
      <div style={{
        background: T.bg,
        padding: "18px 16px 0",
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: `0.5px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
          {/* editable name */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {editingName ? (
              <input autoFocus
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onBlur={() => { setBabyName(nameInput); setEditingName(false); }}
                onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") { setBabyName(nameInput); setEditingName(false); } }}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: `1.5px solid ${accent}`,
                  ...serif, fontSize: 24, color: accent, fontStyle: "italic",
                  fontWeight: 300, letterSpacing: "-0.5px", outline: "none",
                  width: "100%", maxWidth: 240, padding: "2px 0",
                }} />
            ) : (
              <div
                onClick={() => { setNameInput(babyName || "Enxoval"); setEditingName(true); }}
                style={{
                  ...serif, fontSize: 24, color: accent, fontStyle: "italic",
                  fontWeight: 300, letterSpacing: "-0.5px", lineHeight: 1,
                  cursor: "text", display: "flex", alignItems: "center", gap: 6,
                }}>
                {babyName || "Enxoval"}
                <span style={{ fontSize: 12, color: T.ghost, fontStyle: "normal" }}>✎</span>
              </div>
            )}
            {grandSpent > 0 && (
              <div style={{ ...sans, fontSize: 11, color: T.inkLL, marginTop: 3 }}>
                {fmtBRL(grandSpent)} investidos
              </div>
            )}
          </div>

          {/* global ring + stats */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ ...mono, fontSize: 11, color: T.inkLL }}>{totalBought}/{totalSug} un</div>
              {totalPending > 0 && <div style={{ ...mono, fontSize: 10, color: T.amber, marginTop: 1 }}>◌{totalPending} pend.</div>}
            </div>
            <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
              <svg width={52} height={52} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={26} cy={26} r={22} fill="none" stroke={T.bgSurf} strokeWidth={4} />
                <circle cx={26} cy={26} r={22} fill="none"
                  stroke={globalPct >= 100 ? T.success : accent}
                  strokeWidth={4}
                  strokeDasharray={`${2 * Math.PI * 22 * globalPct / 100} ${2 * Math.PI * 22}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray .5s ease" }} />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ ...mono, fontSize: 12, fontWeight: 700, color: globalPct >= 100 ? T.success : accent }}>
                  {globalPct >= 100 ? "✓" : `${globalPct}%`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* progress bar */}
        <div style={{ height: 3, background: T.bgSurf, overflow: "hidden", borderRadius: R.pill, marginBottom: 0 }}>
          <div style={{
            height: "100%", background: globalPct >= 100 ? T.success : accent,
            width: `${globalPct}%`, transition: "width .5s ease", borderRadius: R.pill,
          }} />
        </div>

        {saving && (
          <div style={{ ...sans, fontSize: 10, color: T.ghost, textAlign: "right", padding: "3px 0 0" }}>
            salvando…
          </div>
        )}

        {/* tabs */}
        <div style={{ display: "flex", marginTop: saving ? 0 : 3 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "12px 4px 11px",
              border: "none", background: "transparent",
              color: tab === t.id ? accent : T.ghost,
              ...sans, fontSize: 11, letterSpacing: 0.3,
              cursor: "pointer", fontWeight: tab === t.id ? 600 : 400,
              borderBottom: tab === t.id ? `2px solid ${accent}` : "2px solid transparent",
              transition: "all .15s",
              minHeight: 44,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "18px 14px 80px" }}>
        {tab === "checklist" && (
          <Checklist categories={categories} items={items} priorities={priorities}
            entries={entries} customTags={customTags} accent={accent}
            onChangeEntry={updateEntry}
            onDeleteItem={deleteItem}
            onUpdateItem={updateItem} />
        )}
        {tab === "financeiro" && (
          <Finance categories={categories} items={items} entries={entries}
            priorities={priorities} accent={accent}
            budgetTotal={budgetTotal} budgetByCategory={budgetByCategory}
            onSetBudgetTotal={setBudgetTotal} onSetBudgetCategory={setBudgetCat} />
        )}
        {tab === "galeria" && (
          <Gallery categories={categories} items={items} entries={entries}
            customTags={customTags} priorities={priorities} accent={accent} />
        )}
        {tab === "gerenciar" && (
          <Manager categories={categories} items={items} priorities={priorities}
            customTags={customTags} accent={accent}
            onAddCat={addCat} onDeleteCat={deleteCat}
            onAddItem={addItem} onDeleteItem={deleteItem}
            onSetPriorities={setPriorities}
            onShowTheme={() => setShowTheme(true)}
            onCreateTag={createTag}
            onDeleteTag={deleteTag}
            onEditTag={editTag}
            onUpdateItem={updateItem} />
        )}
      </div>

      {/* logout — bottom floating */}
      <div style={{
        position: "fixed", bottom: 16, right: 16, zIndex: 50,
      }}>
        <button onClick={onLogout} style={{
          background: T.bgCard,
          border: `0.5px solid ${T.border}`,
          borderRadius: R.md,
          padding: "8px 14px",
          ...sans, fontSize: 11, color: T.inkLL,
          cursor: "pointer", boxShadow: shadow.card,
        }}>⎋ Sair</button>
      </div>

      {/* theme picker overlay */}
      {showTheme && (
        <ThemePicker currentId={accentId} accent={accent}
          onSelect={setAccentId} onClose={() => setShowTheme(false)} />
      )}

      {/* keyframe for celebration */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}