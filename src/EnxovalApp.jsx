import { useState, useRef, useCallback, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// THEME SYSTEM — Midnight Garden + 5 accent palettes
// ─────────────────────────────────────────────────────────────────────────────
const ACCENT_PALETTES = {
  verde: {
    id:"verde", label:"Verde",
    accent:"#5ECBA0", accentL:"#A8E6CF", accentDim:"#1A3028",
    accentBg:"rgba(94,203,160,0.12)", accentText:"#E8F5EF",
    tabActive:"#131917", tabBorder:"#5ECBA0",
  },
  amarelo: {
    id:"amarelo", label:"Amarelo",
    accent:"#F0C060", accentL:"#FFE4A0", accentDim:"#2A2418",
    accentBg:"rgba(240,192,96,0.12)", accentText:"#FFF8E8",
    tabActive:"#1A1A10", tabBorder:"#F0C060",
  },
  rosa: {
    id:"rosa", label:"Rosa",
    accent:"#E879A0", accentL:"#F4B8CF", accentDim:"#2A1520",
    accentBg:"rgba(232,121,160,0.12)", accentText:"#FDE8F0",
    tabActive:"#1A1018", tabBorder:"#E879A0",
  },
  azul: {
    id:"azul", label:"Azul",
    accent:"#60B4E0", accentL:"#A8D8F0", accentDim:"#142030",
    accentBg:"rgba(96,180,224,0.12)", accentText:"#E8F4FF",
    tabActive:"#101824", tabBorder:"#60B4E0",
  },
  lavanda: {
    id:"lavanda", label:"Lavanda",
    accent:"#A080E0", accentL:"#CEB8F4", accentDim:"#1E1430",
    accentBg:"rgba(160,128,224,0.12)", accentText:"#F0EAFF",
    tabActive:"#141020", tabBorder:"#A080E0",
  },
};

// Midnight Garden base — same for all accents
const DARK = {
  bg:     "#111815",
  bgCard: "#1A2420",
  bgCardAlt: "#151E1A",
  bgSurf: "#1E2B25",
  border: "#1E2B25",
  borderL:"#243028",
  ink:    "#E8F5EF",
  inkL:   "#ACC8BC",
  inkLL:  "#5A7A6A",
  ghost:  "#2D4438",
  // priority accent colors (secondary, tertiary) — shift per palette
  amber:  "#F0C060",
  amberDim:"#2A2415",
  lavender:"#9B8FCF",
  lavenderDim:"#201E2A",
  success:"#5ECBA0",
  rose:   "#E07070",
};

const LIGHT = {
  bg:      "#F7F4EE",
  bgCard:  "#FFFFFF",
  bgCardAlt:"#F2EEE6",
  bgSurf:  "#EDE8DF",
  border:  "#DDD5C8",
  borderL: "#EDE8DF",
  ink:     "#1C1917",
  inkL:    "#44403C",
  inkLL:   "#78716C",
  ghost:   "#C4BAA8",
  amber:   "#B8860B",
  amberDim:"#FBF3DC",
  lavender:"#6B5FA0",
  lavenderDim:"#EEE8FF",
  success: "#2D7A4A",
  rose:    "#C0404A",
};

// Active theme — components read this; App updates it each render
let T = DARK;

// Tam colors stay consistent (dark variants)
const TAM = {
  "RN":{ color:"#F0A060", bg:"#281808", border:"#3A2010" },
  "P": { color:"#60B4E0", bg:"#102030", border:"#1A3040" },
  "M": { color:"#A080E0", bg:"#1A1030", border:"#281840" },
  "G": { color:"#5ECBA0", bg:"#0E2018", border:"#1A3028" },
  "—": { color:"#5A7A6A", bg:"#141E1A", border:"#1E2B25" },
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
  { id:"basico",   label:"Básico",   color:"#5ECBA0" },
  { id:"passeio",  label:"Passeio",  color:"#60B4E0" },
  { id:"dormir",   label:"Dormir",   color:"#A080E0" },
  { id:"especial", label:"Especial", color:"#F0C060" },
  { id:"presente", label:"Presente", color:"#E879A0" },
  { id:"urgente",  label:"Urgente",  color:"#E07070" },
  { id:"inverno",  label:"Inverno",  color:"#80C0E0" },
];

// Priorities — accent-aware (first uses theme accent, rest fixed)
function buildDefaultPriorities(accent) {
  return [
    { id:"essencial", label:"Essencial", color:accent.accent,    bg:accent.accentDim    },
    { id:"desejavel", label:"Desejável", color:T.amber,       bg:T.amberDim       },
    { id:"adicional", label:"Adicional", color:T.lavender,    bg:T.lavenderDim    },
  ];
}

function getPrio(priorities, id) {
  return priorities.find(p=>p.id===id) || { id, label:id, color:T.inkLL, bg:T.bgSurf };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE & STATE
// ─────────────────────────────────────────────────────────────────────────────
function buildInitialApp(accentId="verde") {
  const accent = ACCENT_PALETTES[accentId];
  const entries = {};
  DEFAULT_ITEMS.forEach(item => item.sizes.forEach(sz => {
    entries[`${item.id}_${sz.tam}`] = { units: [] };
  }));
  return {
    accentId,
    isDark: true,
    babyName: "",
    categories: DEFAULT_CATEGORIES,
    priorities: buildDefaultPriorities(accent),
    items: DEFAULT_ITEMS.map(i=>({...i, price:""})),
    customTags: [],
    entries,
    budgetTotal: "",
    budgetByCategory: {},
  };
}

function makeUnit() { return { photo:null, noPhoto:false, tags:[], note:"", price:"" }; }
function unitDone(u) { return !!u.photo || u.noPhoto; }

async function loadApp() {
  try { const r = await window.storage.get("enxoval_mg1"); return r ? JSON.parse(r.value) : buildInitialApp(); }
  catch { return buildInitialApp(); }
}
async function saveApp(s) { try { await window.storage.set("enxoval_mg1", JSON.stringify(s)); } catch {} }

function fileToDataUrl(f) {
  return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(f); });
}
function allTags(ct) { return [...PRESET_TAGS,...ct]; }
function tagById(id,ct) { return allTags(ct).find(t=>t.id===id); }
function fmtBRL(v) {
  const n=parseFloat(v);
  if(isNaN(n)||n===0) return "—";
  return n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
}
function uid() { return Math.random().toString(36).slice(2,9); }

// ─────────────────────────────────────────────────────────────────────────────
// MICRO COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const mono = { fontFamily:"'DM Mono','Courier New',monospace" };
const serif = { fontFamily:"'Fraunces','Georgia',serif" };

function Chip({ label, color, bg, onRemove, xs }) {
  const sz = xs ? 9 : 10;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:3,
      background: bg || color+"22", color,
      border:`1px solid ${color}44`, borderRadius:3,
      padding: xs ? "1px 6px" : "2px 9px",
      fontSize:sz, letterSpacing:.7, textTransform:"uppercase", ...mono,
      whiteSpace:"nowrap"
    }}>
      {label}
      {onRemove && <span onClick={e=>{e.stopPropagation();onRemove();}} style={{cursor:"pointer",opacity:.5,fontSize:8}}>×</span>}
    </span>
  );
}

function TamBadge({ tam }) {
  const s = TAM[tam]||TAM["—"];
  return (
    <span style={{
      ...mono, background:s.bg, color:s.color,
      border:`1px solid ${s.border}`, borderRadius:3,
      padding:"1px 7px", fontSize:9, fontWeight:700,
      minWidth:24, textAlign:"center", flexShrink:0
    }}>{tam}</span>
  );
}

function ProgressRing({ pct, size=38, stroke=3, accent }) {
  const r=(size-stroke)/2, circ=2*Math.PI*r;
  const done = pct>=100;
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.bgSurf} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={done ? T.success : accent}
          strokeWidth={stroke}
          strokeDasharray={`${circ*pct/100} ${circ}`}
          strokeLinecap="round"
          style={{transition:"stroke-dasharray .5s ease"}}/>
      </svg>
      <div style={{
        position:"absolute",inset:0,display:"flex",alignItems:"center",
        justifyContent:"center",...mono,fontSize:8,fontWeight:700,
        color:done?T.success:accent
      }}>{done?"✓":`${pct}%`}</div>
    </div>
  );
}

function DBtn({ children, onClick, variant="ghost", style, disabled }) {
  const vs = {
    ghost:   { background:"transparent", color:T.inkL,  border:`1px solid ${T.border}` },
    primary: { background:T.bgSurf,   color:T.inkL,  border:`1px solid ${T.borderL}` },
    danger:  { background:"transparent", color:T.rose,  border:`1px solid ${T.rose}44` },
  };
  const v = vs[variant]||vs.ghost;
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...v, borderRadius:3, padding:"6px 14px",
      fontSize:10, letterSpacing:.8, textTransform:"uppercase", ...mono,
      cursor:disabled?"not-allowed":"pointer", opacity:disabled?.4:1,
      transition:"all .15s", ...style
    }}>{children}</button>
  );
}

function DInput({ value, onChange, placeholder, style, type="text", step, autoFocus, onKeyDown }) {
  return (
    <input type={type} step={step} value={value} onChange={onChange}
      placeholder={placeholder} autoFocus={autoFocus} onKeyDown={onKeyDown}
      style={{
        width:"100%", padding:"8px 11px",
        background:T.bgCard, border:`1px solid ${T.border}`,
        borderRadius:3, ...serif, fontSize:14, color:T.ink,
        outline:"none", boxSizing:"border-box", ...style,
        "::placeholder":{ color:T.inkLL }
      }}/>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAG PICKER
// ─────────────────────────────────────────────────────────────────────────────
function TagPicker({ selected, customTags, onToggle, onCreateTag }) {
  const [creating, setCreating] = useState(false);
  const [lbl, setLbl] = useState(""); const [col, setCol] = useState("#5ECBA0");
  const create = () => {
    if(!lbl.trim()) return;
    const t={id:"c_"+uid(),label:lbl.trim(),color:col};
    onCreateTag(t); onToggle(t.id); setLbl(""); setCreating(false);
  };
  return (
    <div>
      <div style={{...mono,fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:T.inkLL,marginBottom:6}}>Tags</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:4}}>
        {allTags(customTags).map(tag=>{
          const on=selected.includes(tag.id);
          return (
            <button key={tag.id} onClick={()=>onToggle(tag.id)} style={{
              background:on?tag.color:tag.color+"20", color:on?"#111":tag.color,
              border:`1px solid ${tag.color}55`, borderRadius:3,
              padding:"2px 9px", ...mono, fontSize:9, letterSpacing:.7,
              textTransform:"uppercase", cursor:"pointer", transition:"all .15s"
            }}>{tag.label}</button>
          );
        })}
        <button onClick={()=>setCreating(x=>!x)} style={{
          background:"transparent", color:T.inkLL,
          border:`1px dashed ${T.border}`, borderRadius:3,
          padding:"2px 9px", ...mono, fontSize:9, letterSpacing:.7,
          textTransform:"uppercase", cursor:"pointer"
        }}>+ Nova</button>
      </div>
      {creating && (
        <div style={{display:"flex",gap:6,alignItems:"center",padding:"8px 10px",
          background:T.bg,border:`1px solid ${T.border}`,borderRadius:3}}>
          <input autoFocus value={lbl} onChange={e=>setLbl(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&create()} placeholder="Nome…"
            style={{flex:1,background:T.bgCard,border:`1px solid ${T.border}`,
              borderRadius:3,padding:"4px 8px",...mono,fontSize:11,
              color:T.ink,outline:"none"}}/>
          <input type="color" value={col} onChange={e=>setCol(e.target.value)}
            style={{width:28,height:28,border:"none",borderRadius:3,cursor:"pointer",padding:0,background:"transparent"}}/>
          <button onClick={create} style={{background:col,color:"#111",border:"none",
            borderRadius:3,padding:"4px 10px",...mono,fontSize:9,fontWeight:700,cursor:"pointer"}}>Ok</button>
          <button onClick={()=>setCreating(false)} style={{background:"transparent",
            color:T.inkLL,border:"none",cursor:"pointer",...mono,fontSize:10}}>✕</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// UNIT CARD
// ─────────────────────────────────────────────────────────────────────────────
function UnitCard({ index, unit, customTags, onChange, onRemove, onCreateTag, accent }) {
  const inputRef = useRef();
  const done = unitDone(unit);
  const handleFile = async e => {
    const f=e.target.files[0];
    if(!f||!f.type.startsWith("image/")) return;
    onChange({...unit,photo:await fileToDataUrl(f),noPhoto:false});
    e.target.value="";
  };
  return (
    <div style={{
      border:`1px solid ${done?accent+"44":T.border}`,
      borderRadius:5, background:done?accent+"0A":T.bgCard,
      padding:"12px 13px", marginBottom:8, transition:"all .2s"
    }}>
      {/* header row */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
        <div style={{
          width:22,height:22,borderRadius:"50%",flexShrink:0,
          background:done?accent:T.bgSurf,
          border:`1px solid ${done?accent:T.border}`,
          display:"flex",alignItems:"center",justifyContent:"center",
          ...mono,fontSize:9,color:done?"#111":T.inkLL,fontWeight:700
        }}>{done?"✓":index+1}</div>
        <span style={{...serif,fontSize:12,color:T.inkL,flex:1,fontStyle:"italic"}}>
          Unidade {index+1}
          {done&&<span style={{...mono,fontSize:9,color:accent,marginLeft:8,letterSpacing:.5}}>
            {unit.photo?"· foto":"· sem foto"}
          </span>}
        </span>
        <button onClick={onRemove} style={{background:"none",border:"none",
          color:T.ghost,cursor:"pointer",...mono,fontSize:9,letterSpacing:.5,textTransform:"uppercase"}}>remover</button>
      </div>

      {/* price per unit — the actual individual unit price */}
      <div style={{
        display:"flex",alignItems:"center",gap:7,
        background:T.bgSurf,border:`1px solid ${T.border}`,
        borderRadius:4,padding:"7px 10px",marginBottom:10
      }}>
        <span style={{...mono,fontSize:8,color:T.inkLL,letterSpacing:1,textTransform:"uppercase",flexShrink:0}}>
          Valor pago
        </span>
        <span style={{...mono,fontSize:9,color:T.inkLL,flexShrink:0}}>R$</span>
        <input type="number" step="0.01"
          value={unit.price||""}
          onChange={e=>onChange({...unit,price:e.target.value})}
          placeholder="0,00"
          style={{
            flex:1,background:"transparent",border:"none",
            ...mono,fontSize:14,color:accent,outline:"none",fontWeight:500,
            minWidth:0
          }}/>
        {parseFloat(unit.price)>0&&(
          <span style={{...mono,fontSize:8,color:accent,flexShrink:0}}>
            {fmtBRL(unit.price)}
          </span>
        )}
      </div>

      <div style={{display:"flex",gap:10,marginBottom:10}}>
        <div style={{
          width:76,height:76,borderRadius:4,flexShrink:0,overflow:"hidden",
          border:`1px solid ${unit.photo?accent+"66":T.border}`,
          background:unit.noPhoto?accent+"10":T.bg,
          display:"flex",alignItems:"center",justifyContent:"center",
          cursor:unit.noPhoto?"default":"pointer", position:"relative"
        }} onClick={()=>!unit.noPhoto&&inputRef.current.click()}>
          {unit.photo
            ? <img src={unit.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            : <span style={{fontSize:unit.noPhoto?22:18,opacity:.3}}>{unit.noPhoto?"○":"◫"}</span>
          }
          {unit.photo&&(
            <button onClick={e=>{e.stopPropagation();onChange({...unit,photo:null});}} style={{
              position:"absolute",top:3,right:3,background:T.bg+"CC",
              border:"none",borderRadius:"50%",color:T.inkL,
              width:16,height:16,cursor:"pointer",fontSize:8,
              display:"flex",alignItems:"center",justifyContent:"center"
            }}>✕</button>
          )}
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
          {!unit.photo&&(
            <button onClick={()=>inputRef.current.click()} style={{
              background:accent+"22",color:accent,border:`1px solid ${accent}44`,
              borderRadius:4,padding:"7px 0",...mono,fontSize:9,
              letterSpacing:.7,textTransform:"uppercase",cursor:"pointer"
            }}>◫ Adicionar foto</button>
          )}
          {unit.photo&&(
            <button onClick={()=>inputRef.current.click()} style={{
              background:T.bgSurf,color:T.inkL,border:`1px solid ${T.border}`,
              borderRadius:4,padding:"7px 0",...mono,fontSize:9,
              letterSpacing:.7,textTransform:"uppercase",cursor:"pointer"
            }}>⟳ Trocar foto</button>
          )}
          <button onClick={()=>{if(unit.photo)return;onChange({...unit,noPhoto:!unit.noPhoto});}} style={{
            background:unit.noPhoto?accent+"22":"transparent",
            color:unit.noPhoto?accent:T.inkLL,
            border:`1px ${unit.noPhoto?"solid":"dashed"} ${unit.noPhoto?accent+"44":T.border}`,
            borderRadius:4,padding:"7px 0",...mono,fontSize:9,
            letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",transition:"all .2s"
          }}>{unit.noPhoto?"✓ Sem foto (ok)":"○ Marcar sem foto"}</button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleFile}/>
      </div>

      <TagPicker selected={unit.tags||[]} customTags={customTags}
        onToggle={id=>onChange({...unit,tags:(unit.tags||[]).includes(id)?(unit.tags||[]).filter(x=>x!==id):[...(unit.tags||[]),id]})}
        onCreateTag={onCreateTag}/>
      <textarea value={unit.note||""} onChange={e=>onChange({...unit,note:e.target.value})}
        placeholder="Observação — marca, loja, presenteado por…"
        style={{
          width:"100%",marginTop:8,padding:"7px 10px",
          border:`1px solid ${T.border}`,borderRadius:4,resize:"vertical",
          ...serif,fontSize:12,color:T.inkL,background:T.bg,
          outline:"none",boxSizing:"border-box",minHeight:38,
          caretColor:T.ink
        }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIZE ROW
// ─────────────────────────────────────────────────────────────────────────────
function SizeRow({ sz, entryKey, entry, customTags, onChange, onCreateTag, accent }) {
  const [open, setOpen] = useState(false);
  const units = entry?.units||[];
  const bought = units.length;
  const completed = units.filter(unitDone).length;
  const pct = sz.qty>0 ? Math.min(100,Math.round(bought/sz.qty*100)):100;
  const full = bought>=sz.qty && completed===bought && sz.qty>0;
  const update = (f,v) => onChange(entryKey,{...(entry||{}),[f]:v});
  const upUnits = u => update("units",u);
  const photoN   = units.filter(u=>u.photo).length;
  const noPhotoN = units.filter(u=>u.noPhoto).length;
  const pending  = units.filter(u=>!unitDone(u)).length;
  const tagIds   = [...new Set(units.flatMap(u=>u.tags||[]))];
  const tagObjs  = tagIds.map(id=>tagById(id,customTags)).filter(Boolean);

  return (
    <div style={{borderBottom:`1px solid ${T.borderL}`,padding:"9px 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setOpen(x=>!x)}>
        {sz.tam!=="—"&&<TamBadge tam={sz.tam}/>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
            <span style={{...mono,fontSize:9,color:T.inkLL}}>{bought} / {sz.qty}</span>
            <div style={{display:"flex",gap:5}}>
              {photoN>0  &&<span style={{...mono,fontSize:8,color:accent}}>◫{photoN}</span>}
              {noPhotoN>0&&<span style={{...mono,fontSize:8,color:T.success}}>○{noPhotoN}</span>}
              {pending>0 &&<span style={{...mono,fontSize:8,color:T.amber}}>◌{pending}</span>}
            </div>
          </div>
          <div style={{height:2,background:T.bgSurf,borderRadius:99,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:99,
              background:full?T.success:accent,
              width:`${pct}%`,transition:"width .4s ease"}}/>
          </div>
          {tagObjs.length>0&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:3,marginTop:4}}>
              {tagObjs.slice(0,3).map(t=><Chip key={t.id} label={t.label} color={t.color} xs/>)}
              {tagObjs.length>3&&<span style={{...mono,fontSize:8,color:T.inkLL}}>+{tagObjs.length-3}</span>}
            </div>
          )}
        </div>
        {bought<sz.qty&&(
          <button onClick={e=>{e.stopPropagation();upUnits([...units,makeUnit()]);}} style={{
            background:accent+"22",color:accent,border:`1px solid ${accent}44`,
            borderRadius:3,padding:"3px 9px",...mono,fontSize:8,
            letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",flexShrink:0
          }}>+ Reg.</button>
        )}
        <span style={{color:T.ghost,fontSize:10,transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s",flexShrink:0}}>▾</span>
      </div>

      {open&&(
        <div style={{paddingTop:10}}>
          {units.length===0
            ?<div style={{textAlign:"center",padding:"14px",...mono,fontSize:9,
               color:T.ghost,letterSpacing:1}}>
               Clique em + REG. para registrar a 1ª unidade
             </div>
            :units.map((u,i)=>(
              <UnitCard key={i} index={i} unit={u} accent={accent}
                customTags={customTags}
                onChange={val=>{const n=[...units];n[i]=val;upUnits(n);}}
                onRemove={()=>upUnits(units.filter((_,j)=>j!==i))}
                onCreateTag={onCreateTag}/>
            ))
          }
          {bought<sz.qty&&(
            <button onClick={()=>upUnits([...units,makeUnit()])} style={{
              width:"100%",padding:"8px",background:accent+"22",
              color:accent,border:`1px solid ${accent}44`,borderRadius:4,
              ...mono,fontSize:9,letterSpacing:.8,textTransform:"uppercase",
              cursor:"pointer",marginTop:2
            }}>+ Registrar unidade {bought+1} de {sz.qty}</button>
          )}
          {bought>=sz.qty&&pending>0&&(
            <div style={{background:T.amberDim,border:`1px solid ${T.amber}44`,
              borderRadius:3,padding:"7px 11px",...mono,fontSize:9,color:T.amber,marginTop:3}}>
              ◌ {pending} unidade{pending>1?"s":""} aguardam conclusão
            </div>
          )}
          {full&&(
            <div style={{background:T.success+"15",border:`1px solid ${T.success}44`,
              borderRadius:3,padding:"7px 11px",...mono,fontSize:9,color:T.success,marginTop:3}}>
              ✓ {sz.qty} unidade{sz.qty>1?"s":""} registradas
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ITEM CARD
// ─────────────────────────────────────────────────────────────────────────────
function ItemCard({ item, priorities, entries, customTags, onChangeEntry, onCreateTag, onDeleteItem, onUpdateItem, accent }) {
  const [open, setOpen] = useState(false);
  const pm = getPrio(priorities,item.priority);
  const totalSug    = item.sizes.reduce((s,sz)=>s+sz.qty,0);
  const totalBought = item.sizes.reduce((s,sz)=>s+(entries[`${item.id}_${sz.tam}`]?.units?.length||0),0);
  const totalDone   = item.sizes.reduce((s,sz)=>s+(entries[`${item.id}_${sz.tam}`]?.units?.filter(unitDone).length||0),0);
  const pct = totalSug>0?Math.min(100,Math.round(totalBought/totalSug*100)):100;
  const complete = totalBought>=totalSug&&totalDone===totalBought&&totalSug>0;
  const pending = totalBought-totalDone;
  // Totals derived from individual unit prices (not a single item price)
  const unitSpent = item.sizes.reduce((s,sz)=>
    s+(entries[`${item.id}_${sz.tam}`]?.units||[]).reduce((a,u)=>a+(parseFloat(u.price)||0),0),0);
  const tagIds=[...new Set(item.sizes.flatMap(sz=>(entries[`${item.id}_${sz.tam}`]?.units||[]).flatMap(u=>u.tags||[])))];
  const tagObjs=tagIds.map(id=>tagById(id,customTags)).filter(Boolean);

  return (
    <div style={{
      background:complete?accent+"0A":T.bgCard,
      border:`1px solid ${complete?accent+"44":T.border}`,
      borderRadius:6,marginBottom:7,overflow:"hidden",
      transition:"background .3s,border .3s"
    }}>
      <div style={{padding:"11px 13px",cursor:"pointer",display:"flex",alignItems:"flex-start",gap:10}}
        onClick={()=>setOpen(x=>!x)}>
        <ProgressRing pct={pct} accent={accent}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{...serif,fontSize:15,color:T.ink,fontWeight:300,marginBottom:4,lineHeight:1.2,fontStyle:"italic"}}>
            {item.name}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
            <Chip label={pm.label} color={pm.color} bg={pm.bg} xs/>
            <span style={{...mono,fontSize:8,color:T.inkLL}}>{totalBought}/{totalSug} un</span>
            {pending>0&&<span style={{...mono,fontSize:8,color:T.amber}}>◌{pending}</span>}
            {unitSpent>0&&<span style={{...mono,fontSize:8,color:accent}}>{fmtBRL(unitSpent)}</span>}
            {tagObjs.slice(0,2).map(t=><Chip key={t.id} label={t.label} color={t.color} xs/>)}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5,flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();if(confirm(`Remover "${item.name}"?`))onDeleteItem(item.id);}}
            style={{background:"none",border:"none",color:T.ghost,cursor:"pointer",fontSize:12,padding:"2px 4px"}}>✕</button>
          <span style={{color:T.ghost,fontSize:10,transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>▾</span>
        </div>
      </div>

      {open&&(
        <div style={{padding:"0 13px 13px",borderTop:`1px solid ${T.borderL}`}}>
          {item.sizes.map(sz=>{
            const key=`${item.id}_${sz.tam}`;
            return (
              <SizeRow key={key} sz={sz} entryKey={key} accent={accent}
                entry={entries[key]||{units:[]}}
                customTags={customTags}
                onChange={onChangeEntry}
                onCreateTag={onCreateTag}/>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST
// ─────────────────────────────────────────────────────────────────────────────
function Checklist({ categories, items, priorities, entries, customTags, accent, onChangeEntry, onCreateTag, onDeleteItem, onUpdateItem }) {
  const [filterPrio, setFilterPrio] = useState("todos");
  const [filterCat,  setFilterCat]  = useState(null);
  const [search, setSearch] = useState("");

  const visible = categories.map(cat=>({
    ...cat,
    items: items.filter(i=>i.catId===cat.id).filter(item=>{
      if(filterCat&&item.catId!==filterCat) return false;
      if(filterPrio!=="todos"&&item.priority!==filterPrio) return false;
      if(search&&!item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
  })).filter(c=>c.items.length>0);

  return (
    <div>
      {/* search */}
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar item…"
        style={{
          width:"100%",padding:"9px 12px",background:T.bgCard,
          border:`1px solid ${T.border}`,borderRadius:4,
          ...mono,fontSize:12,color:T.inkL,outline:"none",
          boxSizing:"border-box",marginBottom:10
        }}/>

      {/* priority filter */}
      <div style={{display:"flex",gap:4,marginBottom:9,flexWrap:"wrap"}}>
        {[["todos","Todos",T.inkL,T.bgSurf],...priorities.map(p=>[p.id,p.label,p.color,p.bg])].map(([id,lbl,col,bg])=>(
          <button key={id} onClick={()=>setFilterPrio(id)} style={{
            padding:"3px 11px",borderRadius:3,border:"none",
            background:filterPrio===id?col:bg,
            color:filterPrio===id?"#111":col,
            ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",
            cursor:"pointer",transition:"all .15s"
          }}>{lbl}</button>
        ))}
      </div>

      {/* category filter */}
      <div style={{display:"flex",gap:4,marginBottom:14,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
        <button onClick={()=>setFilterCat(null)} style={{
          padding:"3px 10px",borderRadius:3,border:"none",whiteSpace:"nowrap",
          background:!filterCat?accent:T.bgSurf,
          color:!filterCat?"#111":T.inkL,
          ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer"
        }}>Todas</button>
        {categories.map(cat=>(
          <button key={cat.id} onClick={()=>setFilterCat(filterCat===cat.id?null:cat.id)} style={{
            padding:"3px 10px",borderRadius:3,border:"none",whiteSpace:"nowrap",
            background:filterCat===cat.id?accent:T.bgSurf,
            color:filterCat===cat.id?"#111":T.inkL,
            ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer"
          }}>{cat.label}</button>
        ))}
      </div>

      {visible.length===0
        ?<div style={{textAlign:"center",padding:"40px",...mono,fontSize:10,color:T.ghost,letterSpacing:1.5}}>
           Nenhum item encontrado
         </div>
        :visible.map(cat=>(
          <div key={cat.id} style={{marginBottom:22}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:9}}>
              <div style={{height:1,flex:1,background:T.border}}/>
              <span style={{...mono,fontSize:9,letterSpacing:2,color:accent,textTransform:"uppercase"}}>{cat.label}</span>
              <div style={{height:1,flex:1,background:T.border}}/>
            </div>
            {cat.items.map(item=>(
              <ItemCard key={item.id} item={item} priorities={priorities} accent={accent}
                entries={entries} customTags={customTags}
                onChangeEntry={onChangeEntry} onCreateTag={onCreateTag}
                onDeleteItem={onDeleteItem} onUpdateItem={onUpdateItem}/>
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
// FIXED priority buckets: essencial | desejavel | outros (everything else)
const FINANCE_BUCKETS = [
  { id:"essencial", label:"Essencial", matchFn:(p,prios)=>p.id==="essencial" },
  { id:"desejavel", label:"Desejável", matchFn:(p,prios)=>p.id==="desejavel" },
  { id:"outros",    label:"Outros",    matchFn:(p,prios)=>p.id!=="essencial"&&p.id!=="desejavel" },
];

function Finance({ categories, items, entries, priorities, accent,
                   budgetTotal, budgetByCategory, onSetBudgetTotal, onSetBudgetCategory }) {
  const [showBudgetPanel, setShowBudgetPanel] = useState(false);
  const [budgetMode, setBudgetMode] = useState("total"); // "total" | "categoria"
  const [editBudgetTotal, setEditBudgetTotal] = useState(budgetTotal||"");
  const [editBudgetCat, setEditBudgetCat] = useState({...budgetByCategory});
  // sync when external values change
  useEffect(()=>{ setEditBudgetTotal(budgetTotal||""); },[budgetTotal]);
  useEffect(()=>{ setEditBudgetCat({...budgetByCategory}); },[JSON.stringify(budgetByCategory)]);

  // ── spent totals ──
  // helper: sum unit prices for an item across all sizes
  const itemSpentFn = (item) =>
    item.sizes.reduce((s,sz)=>
      s+(entries[`${item.id}_${sz.tam}`]?.units||[]).reduce((a,u)=>a+(parseFloat(u.price)||0),0),0);

  let grandTotal=0;
  const catMap={};
  categories.forEach(cat=>{
    let ct=0;
    items.filter(i=>i.catId===cat.id).forEach(item=>{
      const spent=itemSpentFn(item);
      ct+=spent;
    });
    grandTotal+=ct;
    catMap[cat.id]={total:ct,items:items.filter(i=>i.catId===cat.id)};
  });

  // ── user-set budget ──
  const btNum = parseFloat(budgetTotal)||0;
  // per-category budget — user-set value; no auto-estimate (unit prices vary)
  const catBudget = (catId) => {
    const userVal = parseFloat((budgetByCategory||{})[catId]);
    return isNaN(userVal) ? 0 : userVal;
  };
  const grandBudget = btNum > 0
    ? btNum
    : categories.reduce((s,c)=>s+catBudget(c.id),0);
  const pct = grandBudget>0 ? Math.round(grandTotal/grandBudget*100) : 0;

  // ── fixed 3-bucket breakdown ──
  const buckets = FINANCE_BUCKETS.map(bk=>{
    let total=0, est=0;
    items.forEach(item=>{
      const pObj = priorities.find(p=>p.id===item.priority)||{id:item.priority};
      if(!bk.matchFn(pObj,priorities)) return;
      total+=itemSpentFn(item);
      // est: count registered units × average unit price (or 0 if no prices yet)
      const unitPrices = item.sizes.flatMap(sz=>(entries[`${item.id}_${sz.tam}`]?.units||[]).map(u=>parseFloat(u.price)||0)).filter(v=>v>0);
      const avgPrice = unitPrices.length>0 ? unitPrices.reduce((a,b)=>a+b,0)/unitPrices.length : 0;
      const totalQty=item.sizes.reduce((s,sz)=>s+sz.qty,0);
      est+=avgPrice*totalQty;
    });
    // color from priorities for essencial/desejavel; dim accent for outros
    const refPrio = priorities.find(p=>p.id===bk.id);
    const color = refPrio?.color || T.inkLL;
    const bg    = refPrio?.bg    || T.bgSurf;
    return {...bk,total,est,color,bg};
  });

  const saveBudget = () => {
    if(budgetMode==="total"){
      onSetBudgetTotal(editBudgetTotal);
    } else {
      onSetBudgetCategory({...editBudgetCat});
    }
    setShowBudgetPanel(false);
  };

  return (
    <div>
      {/* ── HERO ── */}
      <div style={{
        background:`linear-gradient(135deg, ${accent}22 0%, ${accent}08 100%)`,
        border:`1px solid ${accent}33`,borderRadius:8,
        padding:"18px 20px",marginBottom:14,position:"relative",overflow:"hidden"
      }}>
        <div style={{position:"absolute",top:-30,right:-30,width:100,height:100,background:accent+"15",borderRadius:"50%"}}/>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:10}}>
          <div>
            <div style={{...mono,fontSize:8,letterSpacing:2,textTransform:"uppercase",color:T.inkLL,marginBottom:5}}>Total investido</div>
            <div style={{...serif,fontSize:32,color:accent,fontWeight:300,letterSpacing:-1,fontStyle:"italic"}}>{fmtBRL(grandTotal)}</div>
            {grandBudget>0&&(
              <div style={{...mono,fontSize:8,color:T.inkLL,marginTop:4}}>
                de {fmtBRL(grandBudget)} orçados · {pct}% executado
              </div>
            )}
          </div>
          <button onClick={()=>setShowBudgetPanel(x=>!x)} style={{
            background:showBudgetPanel?accent:accent+"22",
            color:showBudgetPanel?"#111":accent,
            border:`1px solid ${accent}44`,borderRadius:4,
            ...mono,fontSize:8,letterSpacing:1,textTransform:"uppercase",
            padding:"6px 11px",cursor:"pointer",flexShrink:0,marginTop:2,transition:"all .2s"
          }}>
            {grandBudget>0?"Editar orçamento":"Definir orçamento"}
          </button>
        </div>
        <div style={{height:2,background:T.bgSurf,borderRadius:99,overflow:"hidden"}}>
          <div style={{height:"100%",background:accent,width:`${pct}%`,borderRadius:99,transition:"width .5s"}}/>
        </div>
      </div>

      {/* ── BUDGET PANEL ── */}
      {showBudgetPanel&&(
        <div style={{
          background:T.bgCard,border:`1px solid ${accent}33`,
          borderRadius:6,padding:"14px",marginBottom:14
        }}>
          <div style={{...mono,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:accent,marginBottom:10}}>Definir orçamento</div>

          {/* mode toggle */}
          <div style={{display:"flex",gap:0,marginBottom:12,border:`1px solid ${T.border}`,borderRadius:3,overflow:"hidden"}}>
            {[["total","Valor total"],["categoria","Por categoria"]].map(([id,lbl])=>(
              <button key={id} onClick={()=>setBudgetMode(id)} style={{
                flex:1,padding:"7px 0",border:"none",cursor:"pointer",
                background:budgetMode===id?accent:T.bgSurf,
                color:budgetMode===id?"#111":T.inkL,
                ...mono,fontSize:8,letterSpacing:.7,textTransform:"uppercase",transition:"all .15s"
              }}>{lbl}</button>
            ))}
          </div>

          {budgetMode==="total"&&(
            <div style={{display:"flex",alignItems:"center",gap:8,background:T.bg,border:`1px solid ${T.border}`,borderRadius:4,padding:"10px 12px",marginBottom:10}}>
              <span style={{...mono,fontSize:10,color:T.inkLL,flexShrink:0}}>R$</span>
              <input type="number" step="100" value={editBudgetTotal}
                onChange={e=>setEditBudgetTotal(e.target.value)}
                placeholder="Ex: 8000"
                style={{flex:1,background:"transparent",border:"none",...mono,fontSize:18,color:accent,outline:"none",fontWeight:500}}/>
              <span style={{...mono,fontSize:8,color:T.inkLL,flexShrink:0}}>orçamento total</span>
            </div>
          )}

          {budgetMode==="categoria"&&(
            <div style={{marginBottom:10}}>
              {categories.map(cat=>(
                <div key={cat.id} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.borderL}`}}>
                  <span style={{...serif,fontSize:12,color:T.inkL,fontStyle:"italic",flex:1}}>{cat.label}</span>
                  <span style={{...mono,fontSize:9,color:T.inkLL,flexShrink:0}}>R$</span>
                  <input type="number" step="50"
                    value={editBudgetCat[cat.id]||""}
                    onChange={e=>setEditBudgetCat(prev=>({...prev,[cat.id]:e.target.value}))}
                    placeholder={(catMap[cat.id]?.estTotal||0)>0?`≈ ${Math.round(catMap[cat.id].estTotal)}`:"0"}
                    style={{width:90,background:T.bg,border:`1px solid ${T.border}`,borderRadius:3,
                      ...mono,fontSize:12,color:accent,outline:"none",padding:"4px 7px",textAlign:"right"}}/>
                </div>
              ))}
            </div>
          )}

          <div style={{display:"flex",gap:6}}>
            <button onClick={saveBudget} style={{
              flex:1,padding:"8px",background:accent,color:"#111",border:"none",borderRadius:3,
              ...mono,fontSize:9,letterSpacing:.8,textTransform:"uppercase",cursor:"pointer",fontWeight:700
            }}>Salvar</button>
            <button onClick={()=>setShowBudgetPanel(false)} style={{
              padding:"8px 12px",background:T.bgSurf,color:T.inkL,border:"none",borderRadius:3,
              ...mono,fontSize:9,letterSpacing:.8,textTransform:"uppercase",cursor:"pointer"
            }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* ── 3-BUCKET PRIORITY BREAKDOWN ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginBottom:16}}>
        {buckets.map(bk=>(
          <div key={bk.id} style={{background:bk.bg,border:`1px solid ${bk.color}33`,borderRadius:5,padding:"11px 9px",textAlign:"center"}}>
            <div style={{...mono,fontSize:7,letterSpacing:.7,textTransform:"uppercase",color:bk.color,marginBottom:3}}>{bk.label}</div>
            <div style={{...serif,fontSize:15,color:bk.color,fontWeight:300,fontStyle:"italic"}}>{fmtBRL(bk.total)}</div>
            {bk.est>0&&bk.est!==bk.total&&<div style={{...mono,fontSize:7,color:T.inkLL,marginTop:2}}>{fmtBRL(bk.est)} est.</div>}
          </div>
        ))}
      </div>

      {/* ── BY CATEGORY ── */}
      {categories.map(cat=>{
        const cd=catMap[cat.id];
        if(!cd||cd.items.length===0) return null;
        const cBudget=catBudget(cat.id);
        const catPct=cBudget>0?Math.round(cd.total/cBudget*100):0;
        const [exp,setExp]=useState(false);
        return (
          <div key={cat.id} style={{marginBottom:7,border:`1px solid ${T.border}`,borderRadius:6,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",gap:11,padding:"11px 13px",cursor:"pointer",background:T.bgCard}}
              onClick={()=>setExp(x=>!x)}>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                  <span style={{...serif,fontSize:14,color:T.ink,fontStyle:"italic"}}>{cat.label}</span>
                  <span style={{...mono,fontSize:8,color:T.inkLL}}>
                    {cd.items.filter(r=>parseFloat(r.price)>0).length}/{cd.items.length} c/ preço
                  </span>
                </div>
                <div style={{height:2,background:T.bgSurf,borderRadius:99,overflow:"hidden"}}>
                  <div style={{height:"100%",background:accent,width:`${catPct}%`,borderRadius:99}}/>
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{...serif,fontSize:14,color:T.ink,fontStyle:"italic"}}>{fmtBRL(cd.total)}</div>
                {cBudget>0&&<div style={{...mono,fontSize:8,color:T.inkLL}}>{fmtBRL(cBudget)} orçado</div>}
              </div>
              <span style={{color:T.ghost,fontSize:10,transform:exp?"rotate(180deg)":"rotate(0deg)",transition:"transform .2s"}}>▾</span>
            </div>
            {exp&&(
              <div style={{borderTop:`1px solid ${T.borderL}`}}>
                {cd.items.map((item,i)=>{
                  const pm=getPrio(priorities,item.priority);
                  const itemSpent=itemSpentFn(item);
                  const bought=item.sizes.reduce((s,sz)=>s+(entries[`${item.id}_${sz.tam}`]?.units?.length||0),0);
                  const totalQty=item.sizes.reduce((s,sz)=>s+sz.qty,0);
                  return (
                    <div key={item.id} style={{
                      display:"flex",alignItems:"center",gap:8,padding:"8px 13px",
                      borderBottom:i<cd.items.length-1?`1px solid ${T.borderL}`:"none",
                      background:i%2===0?T.bg:T.bgCard
                    }}>
                      <div style={{flex:1}}>
                        <div style={{...serif,fontSize:12,color:T.inkL,fontStyle:"italic"}}>{item.name}</div>
                        {itemSpent>0&&<div style={{...mono,fontSize:8,color:T.inkLL,marginTop:1}}>{bought}/{totalQty} compradas · {fmtBRL(itemSpent)} gasto</div>}
                      </div>
                      <Chip label={pm.label} color={pm.color} bg={pm.bg} xs/>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <div style={{...mono,fontSize:11,color:itemSpent>0?accent:T.ghost,fontWeight:itemSpent>0?500:400}}>
                          {itemSpent>0?fmtBRL(itemSpent):"—"}
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

      {grandTotal===0&&(
        <div style={{textAlign:"center",padding:"32px",...mono,fontSize:9,color:T.ghost,letterSpacing:1.5,border:`1px dashed ${T.border}`,borderRadius:6}}>
          Cadastre preços nos itens do Checklist<br/>para visualizar o resumo financeiro
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY
// ─────────────────────────────────────────────────────────────────────────────
function Gallery({ categories, items, entries, customTags, priorities, accent }) {
  const [filters,setFilters]=useState({});
  const [showF,setShowF]=useState(false);
  const allPhotos=[];
  categories.forEach(cat=>items.filter(i=>i.catId===cat.id).forEach(item=>
    item.sizes.forEach(sz=>{
      const key=`${item.id}_${sz.tam}`;
      (entries[key]?.units||[]).forEach((u,ui)=>{
        if(u.photo||u.noPhoto) allPhotos.push({
          src:u.photo,noPhoto:u.noPhoto,unitIndex:ui+1,
          itemName:item.name,priority:item.priority,tam:sz.tam,
          catId:cat.id,catLabel:cat.label,tags:u.tags||[],note:u.note||""
        });
      });
    })
  ));
  const toggle=(k,v)=>setFilters(f=>{const c=f[k]||[];return{...f,[k]:c.includes(v)?c.filter(x=>x!==v):[...c,v]};});
  const filtered=allPhotos.filter(p=>{
    if((filters.tams||[]).length&&!filters.tams.includes(p.tam)) return false;
    if((filters.prios||[]).length&&!filters.prios.includes(p.priority)) return false;
    if((filters.cats||[]).length&&!filters.cats.includes(p.catId)) return false;
    if((filters.tags||[]).length&&!filters.tags.some(t=>p.tags.includes(t))) return false;
    if((filters.ps||[]).length){
      if(filters.ps.includes("foto")&&!p.src) return false;
      if(filters.ps.includes("sem")&&!p.noPhoto) return false;
    }
    return true;
  });
  const allTams=[...new Set(items.flatMap(i=>i.sizes.map(s=>s.tam)))];
  const activeF=Object.values(filters).flat().length;

  const FPill=({label,active,onClick,color=accent})=>(
    <button onClick={onClick} style={{
      padding:"3px 10px",borderRadius:3,border:`1px solid ${color}44`,
      background:active?color:color+"18",color:active?"#111":color,
      ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",transition:"all .15s"
    }}>{label}</button>
  );

  if(allPhotos.length===0) return (
    <div style={{textAlign:"center",padding:"60px 20px",color:T.ghost}}>
      <div style={{fontSize:40,marginBottom:12,opacity:.2}}>◫</div>
      <div style={{...mono,fontSize:9,letterSpacing:2}}>Nenhum registro ainda</div>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11}}>
        <button onClick={()=>setShowF(x=>!x)} style={{
          display:"flex",alignItems:"center",gap:5,
          background:showF?accent:accent+"18",color:showF?"#111":accent,
          border:`1px solid ${accent}44`,borderRadius:4,padding:"6px 12px",
          ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",transition:"all .2s"
        }}>
          ⊞ Filtros{activeF>0&&` (${activeF})`}
        </button>
        <span style={{...mono,fontSize:9,color:T.inkLL}}>{filtered.length} de {allPhotos.length}</span>
      </div>

      {showF&&(
        <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:5,padding:"12px 13px",marginBottom:13}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}>
            <span style={{...mono,fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:accent}}>Filtros</span>
            <button onClick={()=>setFilters({})} style={{...mono,fontSize:9,color:T.inkLL,background:"none",border:"none",cursor:"pointer"}}>Limpar</button>
          </div>
          {[
            ["Foto",<div style={{display:"flex",gap:4}}><FPill label="Com foto" active={(filters.ps||[]).includes("foto")} onClick={()=>toggle("ps","foto")}/><FPill label="Sem foto" active={(filters.ps||[]).includes("sem")} onClick={()=>toggle("ps","sem")} color={T.success}/></div>],
            ["Tamanho",<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{allTams.map(t=>{const ts=TAM[t]||TAM["—"];return<FPill key={t} label={t} active={(filters.tams||[]).includes(t)} onClick={()=>toggle("tams",t)} color={ts.color}/>;})}</div>],
            ["Prioridade",<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{priorities.map(p=><FPill key={p.id} label={p.label} active={(filters.prios||[]).includes(p.id)} onClick={()=>toggle("prios",p.id)} color={p.color}/>)}</div>],
            ["Categoria",<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{categories.map(c=><FPill key={c.id} label={c.label} active={(filters.cats||[]).includes(c.id)} onClick={()=>toggle("cats",c.id)}/>)}</div>],
            ["Tags",<div style={{display:"flex",flexWrap:"wrap",gap:4}}>{allTags(customTags).map(t=><button key={t.id} onClick={()=>toggle("tags",t.id)} style={{padding:"2px 9px",borderRadius:3,border:`1px solid ${t.color}55`,background:(filters.tags||[]).includes(t.id)?t.color:t.color+"18",color:(filters.tags||[]).includes(t.id)?"#111":t.color,...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",transition:"all .15s"}}>{t.label}</button>)}</div>],
          ].map(([lbl,content])=>(
            <div key={lbl} style={{marginBottom:9}}>
              <div style={{...mono,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:T.inkLL,marginBottom:5}}>{lbl}</div>
              {content}
            </div>
          ))}
        </div>
      )}

      {filtered.length===0
        ?<div style={{textAlign:"center",padding:"36px",...mono,fontSize:9,color:T.ghost}}>Nenhuma foto para esses filtros</div>
        :(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))",gap:10}}>
            {filtered.map((p,i)=>{
              const pm=getPrio(priorities,p.priority);
              const ts=TAM[p.tam]||TAM["—"];
              const tgs=p.tags.map(id=>tagById(id,customTags)).filter(Boolean);
              return (
                <div key={i} style={{borderRadius:5,overflow:"hidden",border:`1px solid ${T.border}`,background:T.bgCard,boxShadow:`0 2px 12px rgba(0,0,0,.3)`}}>
                  <div style={{aspectRatio:"1",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                    {p.src
                      ?<img src={p.src} alt={p.itemName} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      :<div style={{textAlign:"center",color:T.ghost}}><div style={{fontSize:28,opacity:.25}}>○</div><div style={{...mono,fontSize:7,letterSpacing:1,marginTop:4}}>sem foto</div></div>
                    }
                    {p.tam!=="—"&&<span style={{position:"absolute",top:5,left:5,...mono,background:ts.bg,color:ts.color,fontSize:8,fontWeight:700,padding:"1px 5px",borderRadius:2}}>{p.tam}</span>}
                    <span style={{position:"absolute",bottom:4,right:4,...mono,background:T.bg+"BB",color:T.inkLL,fontSize:7,padding:"1px 4px",borderRadius:2}}>#{p.unitIndex}</span>
                  </div>
                  <div style={{padding:"8px 9px"}}>
                    <div style={{...serif,fontSize:12,color:T.ink,fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{p.itemName}</div>
                    <div style={{...mono,fontSize:8,color:T.inkLL,marginBottom:4}}>{p.catLabel}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                      <Chip label={pm.label} color={pm.color} bg={pm.bg} xs/>
                      {tgs.slice(0,2).map(t=><Chip key={t.id} label={t.label} color={t.color} xs/>)}
                    </div>
                    {p.note&&<div style={{...serif,fontSize:10,color:T.inkLL,marginTop:4,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",fontStyle:"italic"}}>{p.note}</div>}
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
function Manager({ categories, items, priorities, accent, onAddCat, onDeleteCat, onAddItem, onDeleteItem, onSetPriorities }) {
  const [section,setSection]=useState("itens");
  const [activeCat,setActiveCat]=useState(categories[0]?.id||"");
  const [newCatLabel,setNewCatLabel]=useState("");
  const [newItemName,setNewItemName]=useState("");
  const [newItemPrio,setNewItemPrio]=useState(priorities[0]?.id||"essencial");
  const [newItemSizes,setNewItemSizes]=useState([{tam:"—",qty:1}]);
  const [addingCat,setAddingCat]=useState(false);
  const [addingItem,setAddingItem]=useState(false);
  const [editPrioId,setEditPrioId]=useState(null);
  const [editLbl,setEditLbl]=useState("");
  const [editCol,setEditCol]=useState("");
  const [newPrioLbl,setNewPrioLbl]=useState("");
  const [newPrioCol,setNewPrioCol]=useState(accent);
  const [addingPrio,setAddingPrio]=useState(false);
  const catItems=items.filter(i=>i.catId===activeCat);

  const updSzTam=(idx,v)=>setNewItemSizes(s=>{const n=[...s];n[idx]={...n[idx],tam:v};return n;});
  const updSzQty=(idx,v)=>setNewItemSizes(s=>{const n=[...s];n[idx]={...n[idx],qty:parseInt(v)||1};return n;});

  const saveEditPrio=()=>{
    if(!editLbl.trim()) return;
    const r=parseInt(editCol.slice(1,3),16),g=parseInt(editCol.slice(3,5),16),b=parseInt(editCol.slice(5,7),16);
    onSetPriorities(priorities.map(p=>p.id===editPrioId?{...p,label:editLbl.trim(),color:editCol,bg:`rgba(${r},${g},${b},0.15)`}:p));
    setEditPrioId(null);
  };
  const deletePrio=(id)=>{
    if(priorities.length<=1){alert("Deve existir ao menos uma prioridade.");return;}
    if(items.some(i=>i.priority===id)&&!confirm("Itens usam esta prioridade. Continuar?")) return;
    onSetPriorities(priorities.filter(p=>p.id!==id));
  };
  const addPrio=()=>{
    if(!newPrioLbl.trim()) return;
    const id="prio_"+uid();
    const r=parseInt(newPrioCol.slice(1,3),16),g=parseInt(newPrioCol.slice(3,5),16),b=parseInt(newPrioCol.slice(5,7),16);
    onSetPriorities([...priorities,{id,label:newPrioLbl.trim(),color:newPrioCol,bg:`rgba(${r},${g},${b},0.15)`}]);
    setNewPrioLbl(""); setAddingPrio(false);
  };

  // section toggle
  const STab=({id,lbl})=>(
    <button onClick={()=>setSection(id)} style={{
      flex:1,padding:"7px 0",border:"none",cursor:"pointer",
      background:section===id?accent:T.bgSurf,
      color:section===id?"#111":T.inkL,
      ...mono,fontSize:9,letterSpacing:.8,textTransform:"uppercase",transition:"all .15s"
    }}>{lbl}</button>
  );

  return (
    <div>
      <div style={{display:"flex",gap:0,marginBottom:16,border:`1px solid ${T.border}`,borderRadius:4,overflow:"hidden"}}>
        <STab id="itens" lbl="Itens & Categorias"/>
        <STab id="prioridades" lbl="Prioridades"/>
      </div>

      {/* PRIORITIES */}
      {section==="prioridades"&&(
        <div>
          <div style={{...serif,fontSize:17,color:T.ink,fontStyle:"italic",marginBottom:4}}>Prioridades</div>
          <div style={{...mono,fontSize:8,color:T.inkLL,letterSpacing:.5,marginBottom:10}}>
            Personalize as prioridades dos itens. <span style={{color:accent}}>Essencial</span> e <span style={{color:T.amber}}>Desejável</span> são fixos — podem ter a cor ajustada, mas não podem ser renomeados ou removidos (são usados nos totais de Finanças).
          </div>
          {priorities.map(p=>{
            const locked = p.id==="essencial"||p.id==="desejavel";
            return (
            <div key={p.id} style={{
              background:T.bgCard,
              border:`1px solid ${locked?p.color+"33":T.border}`,
              borderRadius:4,marginBottom:5,overflow:"hidden"
            }}>
              {editPrioId===p.id?(
                <div style={{padding:"11px 12px",display:"flex",flexDirection:"column",gap:7}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <div style={{...mono,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:T.inkLL}}>Editar cor</div>
                    {locked&&<span style={{...mono,fontSize:7,color:p.color,letterSpacing:.5}}>— nome protegido</span>}
                  </div>
                  <div style={{display:"flex",gap:7,alignItems:"center"}}>
                    {locked
                      ? <div style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,borderRadius:3,
                          padding:"6px 9px",...serif,fontSize:13,color:T.inkLL,fontStyle:"italic"}}>{p.label}</div>
                      : <input value={editLbl} onChange={e=>setEditLbl(e.target.value)}
                          style={{flex:1,background:T.bg,border:`1px solid ${T.border}`,borderRadius:3,
                            padding:"6px 9px",...serif,fontSize:13,color:T.ink,outline:"none"}}/>
                    }
                    <input type="color" value={editCol} onChange={e=>setEditCol(e.target.value)}
                      style={{width:32,height:32,border:"none",borderRadius:3,cursor:"pointer",padding:0,background:"transparent"}}/>
                  </div>
                  <div style={{display:"flex",gap:5}}>
                    <button onClick={saveEditPrio} style={{flex:1,padding:"7px",background:accent,color:"#111",border:"none",borderRadius:3,...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",fontWeight:700}}>Salvar</button>
                    <button onClick={()=>setEditPrioId(null)} style={{padding:"7px 11px",background:T.bgSurf,color:T.inkL,border:"none",borderRadius:3,...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer"}}>Cancelar</button>
                  </div>
                </div>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px"}}>
                  <div style={{width:9,height:9,borderRadius:"50%",background:p.color,flexShrink:0}}/>
                  <Chip label={p.label} color={p.color} bg={p.bg}/>
                  {locked&&<span style={{...mono,fontSize:7,color:T.ghost,letterSpacing:.5}}>fixo</span>}
                  <span style={{...mono,fontSize:8,color:T.inkLL,flex:1}}>
                    {items.filter(i=>i.priority===p.id).length} ite{items.filter(i=>i.priority===p.id).length!==1?"ns":"m"}
                  </span>
                  <button onClick={()=>{setEditPrioId(p.id);setEditLbl(p.label);setEditCol(p.color);}} style={{
                    background:T.bgSurf,color:T.inkL,border:`1px solid ${T.border}`,
                    borderRadius:3,...mono,fontSize:8,letterSpacing:.5,textTransform:"uppercase",
                    padding:"2px 8px",cursor:"pointer"
                  }}>{locked?"Cor":"Editar"}</button>
                  {!locked&&(
                    <button onClick={()=>deletePrio(p.id)} style={{background:"none",border:"none",color:T.ghost,cursor:"pointer",fontSize:12,padding:"2px 4px"}}>✕</button>
                  )}
                </div>
              )}
            </div>
            );
          })}
          {addingPrio?(
            <div style={{background:`${accent}0D`,border:`1px solid ${accent}33`,borderRadius:4,padding:"11px 12px",marginTop:7}}>
              <div style={{...mono,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:accent,marginBottom:8}}>Nova prioridade</div>
              <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:7}}>
                <input autoFocus value={newPrioLbl} onChange={e=>setNewPrioLbl(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addPrio()} placeholder="Nome…"
                  style={{flex:1,background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:3,
                    padding:"6px 9px",...serif,fontSize:13,color:T.ink,outline:"none"}}/>
                <input type="color" value={newPrioCol} onChange={e=>setNewPrioCol(e.target.value)}
                  style={{width:32,height:32,border:"none",borderRadius:3,cursor:"pointer",padding:0,background:"transparent"}}/>
              </div>
              <div style={{display:"flex",gap:5}}>
                <button onClick={addPrio} style={{flex:1,padding:"7px",background:accent,color:"#111",border:"none",borderRadius:3,...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",fontWeight:700}}>Criar</button>
                <button onClick={()=>{setAddingPrio(false);setNewPrioLbl("");}} style={{padding:"7px 11px",background:T.bgSurf,color:T.inkL,border:"none",borderRadius:3,...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer"}}>Cancelar</button>
              </div>
            </div>
          ):(
            <button onClick={()=>setAddingPrio(true)} style={{
              width:"100%",marginTop:6,padding:"8px",
              background:"transparent",color:T.inkLL,
              border:`1px dashed ${T.border}`,borderRadius:3,
              ...mono,fontSize:9,letterSpacing:.8,textTransform:"uppercase",cursor:"pointer"
            }}>+ Nova prioridade</button>
          )}
        </div>
      )}

      {/* ITEMS & CATEGORIES */}
      {section==="itens"&&(
        <div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:13}}>
            {categories.map(cat=>(
              <button key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{
                padding:"4px 11px",borderRadius:3,border:"none",cursor:"pointer",
                background:activeCat===cat.id?accent:T.bgSurf,
                color:activeCat===cat.id?"#111":T.inkL,
                ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",transition:"all .15s"
              }}>{cat.label}</button>
            ))}
            {!addingCat&&(
              <button onClick={()=>setAddingCat(true)} style={{
                padding:"4px 11px",borderRadius:3,border:`1px dashed ${T.border}`,
                background:"transparent",color:T.inkLL,cursor:"pointer",
                ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase"
              }}>+ Categ.</button>
            )}
          </div>
          {addingCat&&(
            <div style={{display:"flex",gap:5,marginBottom:11,padding:"9px 11px",background:`${accent}0D`,border:`1px solid ${accent}33`,borderRadius:3}}>
              <input autoFocus value={newCatLabel} onChange={e=>setNewCatLabel(e.target.value)}
                onKeyDown={e=>{if(e.key==="Enter"&&newCatLabel.trim()){const id="cat_"+uid();onAddCat({id,label:newCatLabel.trim()});setNewCatLabel("");setAddingCat(false);setActiveCat(id);}}}
                placeholder="Nome da categoria…"
                style={{flex:1,background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:3,padding:"6px 9px",...serif,fontSize:13,color:T.ink,outline:"none"}}/>
              <button onClick={()=>{if(!newCatLabel.trim())return;const id="cat_"+uid();onAddCat({id,label:newCatLabel.trim()});setNewCatLabel("");setAddingCat(false);setActiveCat(id);}} style={{background:accent,color:"#111",border:"none",borderRadius:3,padding:"6px 12px",...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",fontWeight:700}}>Criar</button>
              <button onClick={()=>{setAddingCat(false);setNewCatLabel("");}} style={{background:T.bgSurf,color:T.inkL,border:"none",borderRadius:3,padding:"6px 10px",...mono,fontSize:9,cursor:"pointer"}}>✕</button>
            </div>
          )}

          <div style={{height:1,background:T.border,marginBottom:11}}/>

          {/* cat header */}
          {(()=>{
            const cat=categories.find(c=>c.id===activeCat);
            if(!cat) return null;
            return (
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
                <div style={{...serif,fontSize:17,color:T.ink,fontStyle:"italic"}}>{cat.label}</div>
                <button onClick={()=>{
                  if(catItems.length>0){alert("Remova os itens antes de excluir.");return;}
                  if(confirm(`Excluir "${cat.label}"?`)){onDeleteCat(cat.id);setActiveCat(categories.find(c=>c.id!==cat.id)?.id||"");}
                }} style={{background:"none",border:`1px solid ${T.rose}44`,borderRadius:3,
                  color:T.rose,cursor:"pointer",...mono,fontSize:8,letterSpacing:.5,
                  textTransform:"uppercase",padding:"3px 9px"}}>Excluir</button>
              </div>
            );
          })()}

          {catItems.length===0
            ?<div style={{textAlign:"center",padding:"24px",...mono,fontSize:9,color:T.ghost,letterSpacing:1}}>Nenhum item nesta categoria</div>
            :catItems.map(item=>{
              const pm=getPrio(priorities,item.priority);
              return (
                <div key={item.id} style={{
                  display:"flex",alignItems:"center",gap:8,padding:"9px 11px",marginBottom:4,
                  background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:4
                }}>
                  <div style={{flex:1}}>
                    <div style={{...serif,fontSize:13,color:T.ink,fontStyle:"italic"}}>{item.name}</div>
                    <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                      <Chip label={pm.label} color={pm.color} bg={pm.bg} xs/>
                      {item.sizes.map((s,i)=>(
                        <span key={i} style={{...mono,fontSize:8,color:T.inkLL,background:T.bgSurf,borderRadius:2,padding:"1px 5px"}}>
                          {s.tam!=="—"?`${s.tam}×${s.qty}`:`×${s.qty}`}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>{if(confirm(`Remover "${item.name}"?`))onDeleteItem(item.id);}}
                    style={{background:"none",border:"none",color:T.ghost,cursor:"pointer",fontSize:13,padding:4}}>✕</button>
                </div>
              );
            })
          }

          <div style={{marginTop:9}}>
            {!addingItem?(
              <button onClick={()=>setAddingItem(true)} style={{
                width:"100%",padding:"9px",background:accent+"18",
                color:accent,border:`1px solid ${accent}44`,borderRadius:4,
                ...mono,fontSize:9,letterSpacing:.8,textTransform:"uppercase",cursor:"pointer"
              }}>+ Adicionar item em {categories.find(c=>c.id===activeCat)?.label}</button>
            ):(
              <div style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:5,padding:"13px"}}>
                <div style={{...mono,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:T.inkLL,marginBottom:6}}>Nome do item</div>
                <input value={newItemName} onChange={e=>setNewItemName(e.target.value)}
                  placeholder="Ex: Macacão térmico" autoFocus
                  style={{width:"100%",background:T.bg,border:`1px solid ${T.border}`,borderRadius:3,
                    padding:"7px 10px",...serif,fontSize:13,color:T.ink,outline:"none",boxSizing:"border-box",marginBottom:11}}/>
                <div style={{...mono,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:T.inkLL,marginBottom:6}}>Prioridade</div>
                <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:11}}>
                  {priorities.map(p=>(
                    <button key={p.id} onClick={()=>setNewItemPrio(p.id)} style={{
                      padding:"3px 11px",borderRadius:3,border:"none",cursor:"pointer",
                      background:newItemPrio===p.id?p.color:p.bg,
                      color:newItemPrio===p.id?"#111":p.color,
                      ...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",transition:"all .15s"
                    }}>{p.label}</button>
                  ))}
                </div>
                <div style={{...mono,fontSize:8,letterSpacing:1.5,textTransform:"uppercase",color:T.inkLL,marginBottom:6}}>Tamanhos e quantidades</div>
                {newItemSizes.map((sz,i)=>(
                  <div key={i} style={{display:"flex",gap:5,alignItems:"center",marginBottom:5}}>
                    <select value={sz.tam} onChange={e=>updSzTam(i,e.target.value)} style={{
                      background:T.bg,border:`1px solid ${T.border}`,borderRadius:3,
                      padding:"5px 7px",...mono,fontSize:10,color:T.inkL,cursor:"pointer",outline:"none",width:76
                    }}>
                      {["—","RN","P","M","G","GG"].map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                    <span style={{...mono,fontSize:9,color:T.inkLL}}>×</span>
                    <input type="number" min={1} value={sz.qty} onChange={e=>updSzQty(i,e.target.value)}
                      style={{width:54,background:T.bg,border:`1px solid ${T.border}`,borderRadius:3,
                        padding:"5px 7px",...mono,fontSize:10,color:T.inkL,outline:"none",textAlign:"center"}}/>
                    {newItemSizes.length>1&&<button onClick={()=>setNewItemSizes(s=>s.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:T.ghost,cursor:"pointer",fontSize:12}}>✕</button>}
                  </div>
                ))}
                <button onClick={()=>setNewItemSizes(s=>[...s,{tam:"—",qty:1}])} style={{
                  background:"transparent",color:T.inkLL,border:`1px dashed ${T.border}`,
                  borderRadius:3,padding:"3px 10px",...mono,fontSize:8,letterSpacing:.7,
                  textTransform:"uppercase",cursor:"pointer",marginBottom:11
                }}>+ Tamanho</button>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>{
                    if(!newItemName.trim()) return;
                    const ne={};
                    newItemSizes.forEach(sz=>{ne[`u_${uid()}_${sz.tam}`]={units:[]};});
                    const id="u_"+uid();
                    newItemSizes.forEach(sz=>{ne[`${id}_${sz.tam}`]={units:[]};});
                    onAddItem({id,catId:activeCat,name:newItemName.trim(),priority:newItemPrio,sizes:newItemSizes,price:""});
                    setNewItemName("");setNewItemSizes([{tam:"—",qty:1}]);setAddingItem(false);
                  }} style={{flex:1,padding:"8px",background:accent,color:"#111",border:"none",borderRadius:3,...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer",fontWeight:700}}>Salvar item</button>
                  <button onClick={()=>{setAddingItem(false);setNewItemName("");setNewItemSizes([{tam:"—",qty:1}]);}} style={{padding:"8px 12px",background:T.bgSurf,color:T.inkL,border:"none",borderRadius:3,...mono,fontSize:9,letterSpacing:.7,textTransform:"uppercase",cursor:"pointer"}}>Cancelar</button>
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
// THEME PICKER — appears on first tap of palette icon in header
// ─────────────────────────────────────────────────────────────────────────────
function ThemePicker({ currentId, onSelect, onClose, accent }) {
  return (
    <div style={{
      position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-end",
      background:"rgba(0,0,0,.6)",backdropFilter:"blur(4px)"
    }} onClick={onClose}>
      <div style={{
        width:"100%",maxWidth:520,margin:"0 auto",
        background:T.bgCard,borderRadius:"12px 12px 0 0",
        border:`1px solid ${T.border}`,padding:"20px 18px 32px"
      }} onClick={e=>e.stopPropagation()}>
        <div style={{...mono,fontSize:9,letterSpacing:2,textTransform:"uppercase",color:T.inkLL,marginBottom:4}}>Tema de cor</div>
        <div style={{...serif,fontSize:17,color:T.ink,fontStyle:"italic",marginBottom:18}}>Escolha o seu accent</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          {Object.values(ACCENT_PALETTES).map(p=>{
            const on = p.id===currentId;
            return (
              <button key={p.id} onClick={()=>{onSelect(p.id);onClose();}} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:8,
                background: on ? p.accentDim : T.bgSurf,
                border:`2px solid ${on?p.accent:T.border}`,
                borderRadius:8,padding:"14px 18px",cursor:"pointer",
                transition:"all .2s",minWidth:80
              }}>
                <div style={{
                  width:36,height:36,borderRadius:"50%",
                  background:`radial-gradient(circle at 35% 35%, ${p.accentL}, ${p.accent})`,
                  boxShadow: on?`0 0 16px ${p.accent}66`:"none",
                  transition:"box-shadow .2s"
                }}/>
                <span style={{...mono,fontSize:9,letterSpacing:1,textTransform:"uppercase",
                  color:on?p.accent:T.inkLL}}>
                  {p.label}
                </span>
                {on&&<span style={{...mono,fontSize:7,color:p.accent}}>✓ ativo</span>}
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
  {id:"checklist",label:"Checklist"},
  {id:"financeiro",label:"Finanças"},
  {id:"galeria",label:"Galeria"},
  {id:"gerenciar",label:"Gerenciar"},
];

export default function App() {
  const [app,setApp]=useState(()=>buildInitialApp());
  const [tab,setTab]=useState("checklist");
  const [saving,setSaving]=useState(false);
  const [showTheme,setShowTheme]=useState(false);
  const [editingName,setEditingName]=useState(false);
  const [nameInput,setNameInput]=useState("");

  useEffect(()=>{ loadApp().then(s=>setApp(s)); },[]);

  const persist=useCallback(next=>{
    setSaving(true); saveApp(next).then(()=>setSaving(false));
  },[]);
  const update=useCallback(fn=>{
    setApp(prev=>{const next=fn(prev);persist(next);return next;});
  },[]);

  const updateEntry   = useCallback((key,val)=>{ update(prev=>({...prev,entries:{...prev.entries,[key]:val}})); },[]);
  const createTag     = useCallback(t=>{ update(prev=>({...prev,customTags:[...(prev.customTags||[]),t]})); },[]);
  const addCat        = useCallback(cat=>{ update(prev=>({...prev,categories:[...prev.categories,cat]})); },[]);
  const deleteCat     = useCallback(id=>{ update(prev=>({...prev,categories:prev.categories.filter(c=>c.id!==id)})); },[]);
  const addItem       = useCallback(item=>{
    const ne={};
    item.sizes.forEach(sz=>{ne[`${item.id}_${sz.tam}`]={units:[]};});
    update(prev=>({...prev,items:[...prev.items,item],entries:{...prev.entries,...ne}}));
  },[]);
  const deleteItem    = useCallback(id=>{ update(prev=>({...prev,items:prev.items.filter(i=>i.id!==id)})); },[]);
  const updateItem    = useCallback((id,val)=>{ update(prev=>({...prev,items:prev.items.map(i=>i.id===id?val:i)})); },[]);
  const setPriorities = useCallback(prios=>{ update(prev=>({...prev,priorities:prios})); },[]);
  const setBudgetTotal= useCallback(v=>{ update(prev=>({...prev,budgetTotal:v})); },[]);
  const setBudgetCat  = useCallback(v=>{ update(prev=>({...prev,budgetByCategory:v})); },[]);
  const toggleDark    = useCallback(()=>{ update(prev=>({...prev,isDark:!prev.isDark})); },[]);
  const setBabyName   = useCallback(v=>{ update(prev=>({...prev,babyName:v})); },[]);
  const setAccentId   = useCallback(id=>{
    update(prev=>{
      const pal=ACCENT_PALETTES[id];
      // update essencial priority color to match new accent
      const updPrios = (prev.priorities||[]).map(p=>
        p.id==="essencial" ? {...p,color:pal.accent,bg:pal.accentDim} : p
      );
      return {...prev,accentId:id,priorities:updPrios};
    });
  },[]);

  const {categories=[],items=[],entries={},customTags=[],priorities=buildDefaultPriorities(ACCENT_PALETTES.verde),accentId="verde",budgetTotal="",budgetByCategory={},isDark=true,babyName=""} = app;
  const pal = ACCENT_PALETTES[accentId]||ACCENT_PALETTES.verde;
  const accent = pal.accent;
  T = isDark ? DARK : LIGHT; // update module-level theme

  // stats
  let totalSug=0,totalBought=0,totalPending=0,grandSpent=0;
  items.forEach(item=>{
    item.sizes.forEach(sz=>{
      const units=(entries[`${item.id}_${sz.tam}`]||{}).units||[];
      totalSug+=sz.qty; totalBought+=units.length;
      totalPending+=units.filter(u=>!unitDone(u)).length;
      // sum individual unit prices
      units.forEach(u=>{ grandSpent+=parseFloat(u.price)||0; });
    });
  });
  const globalPct=totalSug>0?Math.round(totalBought/totalSug*100):0;

  return (
    <div style={{
      fontFamily:"'Fraunces','Georgia',serif",
      background:T.bg, minHeight:"100vh",
      maxWidth:520, margin:"0 auto", color:T.ink
    }}>
      {/* HEADER */}
      <div style={{
        background:isDark?(pal.tabActive||T.bg):LIGHT.bg,
        padding:"20px 16px 0",
        position:"sticky",top:0,zIndex:100,
        borderBottom:`1px solid ${T.border}`
      }}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:10}}>
          {/* Editable baby name */}
          <div style={{flex:1,minWidth:0}}>
            {editingName ? (
              <input autoFocus
                value={nameInput}
                onChange={e=>setNameInput(e.target.value)}
                onBlur={()=>{ setBabyName(nameInput); setEditingName(false); }}
                onKeyDown={e=>{ if(e.key==="Enter"||e.key==="Escape"){ setBabyName(nameInput); setEditingName(false); }}}
                style={{
                  background:"transparent", border:"none",
                  borderBottom:`1px solid ${accent}`,
                  ...serif, fontSize:22, color:accent, fontStyle:"italic",
                  fontWeight:300, letterSpacing:"-0.5px", outline:"none",
                  width:"100%", maxWidth:220
                }}
              />
            ) : (
              <div
                onClick={()=>{ setNameInput(babyName||"Enxoval"); setEditingName(true); }}
                title="Toque para editar o nome"
                style={{
                  ...serif, fontSize:22, color:accent, fontStyle:"italic",
                  fontWeight:300, letterSpacing:"-0.5px", lineHeight:1,
                  cursor:"text", display:"flex", alignItems:"center", gap:6
                }}>
                {babyName||"Enxoval"}
                <span style={{fontSize:11, color:T.ghost, fontStyle:"normal"}}>✎</span>
              </div>
            )}
            <div style={{...mono,fontSize:8,color:T.ghost,letterSpacing:3,textTransform:"uppercase",marginTop:2}}>
              Setembro · São Paulo
            </div>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
            {/* dark/light toggle */}
            <button onClick={toggleDark} title={isDark?"Modo claro":"Modo escuro"} style={{
              width:28,height:28,borderRadius:"50%",
              background:isDark?"#1E2B25":"#EDE8DF",
              border:`1px solid ${T.border}`,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:13, transition:"all .2s", flexShrink:0
            }}>{isDark?"☀️":"🌙"}</button>
            {/* palette switcher */}
            <button onClick={()=>setShowTheme(true)} style={{
              width:28,height:28,borderRadius:"50%",
              background:`radial-gradient(circle at 35% 35%, ${pal.accentL}, ${accent})`,
              border:`2px solid ${accent}55`,cursor:"pointer",
              boxShadow:`0 0 10px ${accent}44`,
              transition:"box-shadow .2s",flexShrink:0
            }} title="Alterar cor"/>
            <div style={{textAlign:"right"}}>
              <div style={{...mono,fontSize:11,color:accent,letterSpacing:1}}>{globalPct}%</div>
              <div style={{...mono,fontSize:8,color:T.inkLL,marginTop:1}}>
                {totalBought}/{totalSug}{grandSpent>0?` · ${fmtBRL(grandSpent)}`:""}</div>
              {totalPending>0&&<div style={{...mono,fontSize:8,color:T.amber}}>◌{totalPending}</div>}
            </div>
          </div>
        </div>

        {/* progress */}
        <div style={{height:1,background:T.bgSurf,overflow:"hidden",marginBottom:0}}>
          <div style={{height:"100%",background:accent,width:`${globalPct}%`,transition:"width .5s ease"}}/>
        </div>
        {saving&&<div style={{...mono,fontSize:7,color:T.ghost,textAlign:"right",padding:"3px 0 0",letterSpacing:1}}>salvando…</div>}

        {/* tabs */}
        <div style={{display:"flex",marginTop:saving?0:3}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flex:1,padding:"11px 2px 10px",border:"none",background:"transparent",
              color:tab===t.id?accent:T.ghost,
              ...mono,fontSize:8,letterSpacing:1,textTransform:"uppercase",
              cursor:"pointer",
              borderBottom:tab===t.id?`2px solid ${accent}`:"2px solid transparent",
              transition:"all .15s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{padding:"18px 14px 80px"}}>
        {tab==="checklist"&&(
          <Checklist categories={categories} items={items} priorities={priorities}
            entries={entries} customTags={customTags} accent={accent}
            onChangeEntry={updateEntry} onCreateTag={createTag}
            onDeleteItem={deleteItem} onUpdateItem={updateItem}/>
        )}
        {tab==="financeiro"&&(
          <Finance categories={categories} items={items} entries={entries}
            priorities={priorities} accent={accent}
            budgetTotal={budgetTotal} budgetByCategory={budgetByCategory}
            onSetBudgetTotal={setBudgetTotal} onSetBudgetCategory={setBudgetCat}/>
        )}
        {tab==="galeria"&&(
          <Gallery categories={categories} items={items} entries={entries}
            customTags={customTags} priorities={priorities} accent={accent}/>
        )}
        {tab==="gerenciar"&&(
          <Manager categories={categories} items={items} priorities={priorities}
            accent={accent} onAddCat={addCat} onDeleteCat={deleteCat}
            onAddItem={addItem} onDeleteItem={deleteItem}
            onSetPriorities={setPriorities}/>
        )}
      </div>

      {/* THEME PICKER OVERLAY */}
      {showTheme&&(
        <ThemePicker currentId={accentId} accent={accent}
          onSelect={setAccentId} onClose={()=>setShowTheme(false)}/>
      )}
    </div>
  );
}
