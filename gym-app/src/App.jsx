import { useState, useEffect } from "react";

// ─── Storage (localStorage) ───────────────────────────────────────────────────
const S = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── Exercise database ────────────────────────────────────────────────────────
const DEFAULT_EXERCISES = [
  { id:"e1",  name:"Sentadilla Búlgara",     muscle:"cuadriceps",      muscle2:"gluteo",       weighted:true,  desc:"Una pierna apoyada atrás en un banco; bajas con la otra." },
  { id:"e2",  name:"Peso Muerto",             muscle:"isquiotibiales",  muscle2:"lumbar",       weighted:true,  desc:"Levantar la barra desde el suelo manteniendo espalda recta." },
  { id:"e3",  name:"Hip Thrust",              muscle:"gluteo",          muscle2:null,           weighted:true,  desc:"Espalda en banco, barra en la cadera; empuje hacia arriba." },
  { id:"e4",  name:"Sentadilla con Barra",    muscle:"cuadriceps",      muscle2:"gluteo",       weighted:true,  desc:"Flexión de rodilla con barra tras nuca o frontal." },
  { id:"e5",  name:"Sentadilla Sumo",         muscle:"aductores",       muscle2:"gluteo",       weighted:true,  desc:"Sentadilla con pies abiertos y puntas hacia afuera." },
  { id:"e6",  name:"Abducciones con Banda",   muscle:"gluteo_medio",    muscle2:null,           weighted:false, desc:"Desplazamiento lateral resistido por la banda." },
  { id:"e7",  name:"Extensión de Cuádriceps", muscle:"cuadriceps",      muscle2:null,           weighted:true,  desc:"Sentado en máquina, estiras las piernas hacia arriba." },
  { id:"e8",  name:"Prensa de Piernas",       muscle:"cuadriceps",      muscle2:"gluteo",       weighted:true,  desc:"Empujar una plataforma cargada con los pies." },
  { id:"e9",  name:"Vuelos Laterales",        muscle:"deltoides_lateral",muscle2:null,          weighted:true,  desc:"Elevar mancuernas hacia los lados hasta altura de hombros." },
  { id:"e10", name:"Vuelos Frontales",        muscle:"deltoides_anterior",muscle2:null,         weighted:true,  desc:"Elevar mancuernas hacia adelante." },
  { id:"e11", name:"Press de Hombros",        muscle:"deltoides",       muscle2:null,           weighted:true,  desc:"Empuje vertical de mancuernas o barra sobre la cabeza." },
  { id:"e12", name:"Vuelos en Polea",         muscle:"deltoides_lateral",muscle2:null,          weighted:true,  desc:"Elevación lateral usando el cable de la polea baja." },
  { id:"e13", name:"Extensión de Tríceps",    muscle:"triceps",         muscle2:null,           weighted:true,  desc:"Empujar la barra o soga de la polea hacia el suelo." },
  { id:"e14", name:"Patada de Tríceps",       muscle:"triceps",         muscle2:null,           weighted:true,  desc:"Inclinar el torso y estirar el brazo hacia atrás." },
  { id:"e15", name:"Fondos en Paralelas",     muscle:"triceps",         muscle2:"pecho",        weighted:false, desc:"Bajar y subir tu cuerpo apoyado en barras paralelas." },
  { id:"e16", name:"Curl de Bíceps",          muscle:"biceps",          muscle2:null,           weighted:true,  desc:"Flexión de codo con mancuernas de pie." },
  { id:"e17", name:"Curl Predicador",         muscle:"biceps",          muscle2:null,           weighted:true,  desc:"Bíceps con barra apoyando brazos en banco inclinado." },
  { id:"e18", name:"Curl en Banco Inclinado", muscle:"biceps",          muscle2:null,           weighted:true,  desc:"Sentado inclinado, dejas caer los brazos y flexionas." },
  { id:"e19", name:"Curl en Polea",           muscle:"biceps",          muscle2:null,           weighted:true,  desc:"Flexión de codos usando la polea baja." },
  { id:"e20", name:"Remo en Polea Baja",      muscle:"espalda_media",   muscle2:"dorsal",       weighted:true,  desc:"Tirar de la polea hacia el abdomen sentado." },
  { id:"e21", name:"Remo con Barra",          muscle:"espalda_media",   muscle2:null,           weighted:true,  desc:"Inclinado, tiras la barra hacia el ombligo." },
  { id:"e22", name:"Dominadas",               muscle:"dorsal",          muscle2:"espalda_alta", weighted:false, desc:"Colgarse de una barra y subir el pecho hacia ella." },
  { id:"e23", name:"Jalón al Pecho",          muscle:"dorsal",          muscle2:"espalda_alta", weighted:true,  desc:"Tirar de la barra de la polea alta hacia el pecho." },
  { id:"e24", name:"Jalón Tras Nuca",         muscle:"espalda_alta",    muscle2:null,           weighted:true,  desc:"Tirar de la barra por detrás de la cabeza." },
  { id:"e25", name:"Face Pull",               muscle:"espalda_alta",    muscle2:"deltoides",    weighted:true,  desc:"Tirar de la soga hacia la frente separando manos." },
  { id:"e26", name:"Pullover en Polea",       muscle:"dorsal",          muscle2:null,           weighted:true,  desc:"Brazos casi rectos, bajar la barra hacia los muslos." },
  { id:"e27", name:"Remo en Máquina",         muscle:"espalda_media",   muscle2:null,           weighted:true,  desc:"Tracción horizontal apoyando el pecho en la máquina." },
  { id:"e28", name:"Press Inclinado",         muscle:"pecho",           muscle2:null,           weighted:true,  desc:"Empuje de barra en banco a 45 grados. Trabaja pecho superior." },
  { id:"e29", name:"Press de Banca Plano",    muscle:"pecho",           muscle2:null,           weighted:true,  desc:"Empuje de barra acostado horizontalmente." },
  { id:"e30", name:"Aperturas con Mancuerna", muscle:"pecho",           muscle2:null,           weighted:true,  desc:"Abrir y cerrar brazos como un abrazo acostado." },
  { id:"e31", name:"Cruces en Poleas",        muscle:"pecho",           muscle2:null,           weighted:true,  desc:"Similar a las aperturas pero con cables." },
  { id:"e32", name:"Crunches",               muscle:"abs",              muscle2:null,           weighted:false, desc:"Elevación pequeña del tronco apretando el abdomen." },
  { id:"e33", name:"Crunches de Oblicuos",   muscle:"oblicuos",         muscle2:null,           weighted:false, desc:"Codo busca la rodilla contraria de forma alterna." },
  { id:"e34", name:"Bicicletas",             muscle:"oblicuos",         muscle2:"abs",          weighted:false, desc:"Tumbado, simular pedaleo tocando rodilla-codo." },
  { id:"e35", name:"Elevación de Piernas",   muscle:"abs",              muscle2:null,           weighted:false, desc:"Acostado, subir y bajar piernas estiradas." },
  { id:"e36", name:"Giros Rusos",            muscle:"oblicuos",         muscle2:null,           weighted:false, desc:"Sentado, rotar el torso con o sin peso." },
  { id:"e37", name:"Rueda Abdominal",        muscle:"abs",              muscle2:"lumbar",       weighted:false, desc:"Rodar hacia adelante y volver manteniendo el core." },
  { id:"e38", name:"L-Sit",                  muscle:"abs",              muscle2:null,           weighted:false, desc:"Sostener el cuerpo con brazos, piernas en 90 grados." },
  { id:"e39", name:"Farmer Walk",            muscle:"abs",              muscle2:null,           weighted:true,  desc:"Caminar cargando pesas pesadas a los costados." },
  { id:"e40", name:"Crunch en Polea",        muscle:"abs",              muscle2:null,           weighted:true,  desc:"De rodillas, encoger el torso con peso de polea." },
  { id:"e41", name:"Crunch con Disco",       muscle:"abs",              muscle2:null,           weighted:true,  desc:"Crunch tradicional sosteniendo un disco." },
  { id:"e42", name:"Woodchoppers",           muscle:"oblicuos",         muscle2:null,           weighted:true,  desc:"Movimiento de hachazo diagonal en polea." },
];

const MUSCLE_GROUPS = [
  { id:"cuadriceps",        label:"Cuádriceps",       category:"Piernas" },
  { id:"isquiotibiales",    label:"Isquiotibiales",   category:"Piernas" },
  { id:"gluteo",            label:"Glúteo",           category:"Piernas" },
  { id:"gluteo_medio",      label:"Glúteo Medio",     category:"Piernas" },
  { id:"aductores",         label:"Aductores",        category:"Piernas" },
  { id:"deltoides",         label:"Deltoides",        category:"Hombros" },
  { id:"deltoides_lateral", label:"Deltoides Lateral",category:"Hombros" },
  { id:"deltoides_anterior",label:"Deltoides Anterior",category:"Hombros"},
  { id:"triceps",           label:"Tríceps",          category:"Brazos"  },
  { id:"biceps",            label:"Bíceps",           category:"Brazos"  },
  { id:"dorsal",            label:"Dorsal Ancho",     category:"Espalda" },
  { id:"espalda_alta",      label:"Espalda Alta",     category:"Espalda" },
  { id:"espalda_media",     label:"Espalda Media",    category:"Espalda" },
  { id:"lumbar",            label:"Lumbar",           category:"Espalda" },
  { id:"pecho",             label:"Pecho",            category:"Pecho"   },
  { id:"abs",               label:"Abdomen",          category:"Core"    },
  { id:"oblicuos",          label:"Oblicuos",         category:"Core"    },
];

const MC = {
  cuadriceps:"#f97316", isquiotibiales:"#fb923c", gluteo:"#f59e0b",
  gluteo_medio:"#fbbf24", aductores:"#fde68a",
  deltoides:"#a78bfa", deltoides_lateral:"#c4b5fd", deltoides_anterior:"#7c3aed",
  triceps:"#f43f5e", biceps:"#06b6d4",
  dorsal:"#10b981", espalda_alta:"#34d399", espalda_media:"#6ee7b7", lumbar:"#a7f3d0",
  pecho:"#3b82f6",
  abs:"#facc15", oblicuos:"#fde047",
};

function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ─── BODY MAP SVG ─────────────────────────────────────────────────────────────
function BodyMap({ muscles, heatmap }) {
  const active = [...new Set((muscles||[]).filter(Boolean))];
  const getFill = (m) => {
    if (heatmap) {
      const count = heatmap[m] || 0;
      if (!count) return "#1a1a1a";
      const maxVal = Math.max(...Object.values(heatmap), 1);
      return hexAlpha(MC[m] || "#888", 0.15 + (count/maxVal)*0.85);
    }
    return active.includes(m) ? MC[m] : "#1a1a1a";
  };
  const getStroke = (m) => {
    if (heatmap) return (heatmap[m]||0) > 0 ? MC[m] : "#2a2a2a";
    return active.includes(m) ? MC[m] : "#2a2a2a";
  };
  const c = getFill, s = getStroke;

  return (
    <div style={{ display:"flex", gap:"12px", justifyContent:"center", alignItems:"flex-start", margin:"14px 0", flexWrap:"wrap" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px", marginBottom:"4px", fontFamily:"'Bebas Neue', sans-serif" }}>FRENTE</div>
        <svg width="110" height="260" viewBox="0 0 110 260" fill="none">
          <ellipse cx="55" cy="16" rx="14" ry="15" fill="#161616" stroke="#2a2a2a" strokeWidth="1.2"/>
          <rect x="49" y="30" width="12" height="9" rx="2" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M35 39 Q55 36 75 39 L78 115 Q55 120 32 115 Z" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
          <ellipse cx="28" cy="50" rx="11" ry="8" fill={c("deltoides_anterior")} stroke={s("deltoides_anterior")} strokeWidth="1.2"/>
          <ellipse cx="82" cy="50" rx="11" ry="8" fill={c("deltoides_anterior")} stroke={s("deltoides_anterior")} strokeWidth="1.2"/>
          <ellipse cx="21" cy="57" rx="7" ry="7" fill={c("deltoides_lateral")} stroke={s("deltoides_lateral")} strokeWidth="1.2"/>
          <ellipse cx="89" cy="57" rx="7" ry="7" fill={c("deltoides_lateral")} stroke={s("deltoides_lateral")} strokeWidth="1.2"/>
          <path d="M38 40 Q55 38 72 40 L74 68 Q55 74 36 68 Z" fill={c("pecho")} stroke={s("pecho")} strokeWidth="1.2"/>
          <rect x="44" y="70" width="9" height="11" rx="2.5" fill={c("abs")} stroke={s("abs")} strokeWidth="1"/>
          <rect x="57" y="70" width="9" height="11" rx="2.5" fill={c("abs")} stroke={s("abs")} strokeWidth="1"/>
          <rect x="44" y="85" width="9" height="11" rx="2.5" fill={c("abs")} stroke={s("abs")} strokeWidth="1"/>
          <rect x="57" y="85" width="9" height="11" rx="2.5" fill={c("abs")} stroke={s("abs")} strokeWidth="1"/>
          <rect x="44" y="100" width="9" height="10" rx="2.5" fill={c("abs")} stroke={s("abs")} strokeWidth="1"/>
          <rect x="57" y="100" width="9" height="10" rx="2.5" fill={c("abs")} stroke={s("abs")} strokeWidth="1"/>
          <path d="M36 68 Q33 88 36 112 L44 110 L44 70Z" fill={c("oblicuos")} stroke={s("oblicuos")} strokeWidth="1"/>
          <path d="M74 68 Q77 88 74 112 L66 110 L66 70Z" fill={c("oblicuos")} stroke={s("oblicuos")} strokeWidth="1"/>
          <path d="M12 63 Q9 75 10 90 L21 90 Q22 75 21 63Z" fill={c("biceps")} stroke={s("biceps")} strokeWidth="1.2"/>
          <path d="M98 63 Q101 75 100 90 L89 90 Q88 75 89 63Z" fill={c("biceps")} stroke={s("biceps")} strokeWidth="1.2"/>
          <path d="M11 90 Q9 103 11 115 L20 115 Q22 103 21 90Z" fill={c("triceps")} stroke={s("triceps")} strokeWidth="1"/>
          <path d="M99 90 Q101 103 99 115 L90 115 Q88 103 89 90Z" fill={c("triceps")} stroke={s("triceps")} strokeWidth="1"/>
          <path d="M11 116 Q9 128 12 138 L20 138 Q23 128 20 116Z" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M99 116 Q101 128 98 138 L90 138 Q87 128 90 116Z" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="15" cy="142" rx="6" ry="7" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="95" cy="142" rx="6" ry="7" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M36 112 Q32 120 34 130 L46 130 L55 115Z" fill={c("aductores")} stroke={s("aductores")} strokeWidth="1"/>
          <path d="M74 112 Q78 120 76 130 L64 130 L55 115Z" fill={c("aductores")} stroke={s("aductores")} strokeWidth="1"/>
          <path d="M34 130 Q30 155 32 178 L47 178 L50 130Z" fill={c("cuadriceps")} stroke={s("cuadriceps")} strokeWidth="1.5"/>
          <path d="M76 130 Q80 155 78 178 L63 178 L60 130Z" fill={c("cuadriceps")} stroke={s("cuadriceps")} strokeWidth="1.5"/>
          <ellipse cx="40" cy="182" rx="8" ry="6" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="70" cy="182" rx="8" ry="6" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M33 188 Q31 210 33 232 L47 232 L47 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <path d="M77 188 Q79 210 77 232 L63 232 L63 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <ellipse cx="40" cy="236" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="70" cy="236" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
        </svg>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px", marginBottom:"4px", fontFamily:"'Bebas Neue', sans-serif" }}>ESPALDA</div>
        <svg width="110" height="260" viewBox="0 0 110 260" fill="none">
          <ellipse cx="55" cy="16" rx="14" ry="15" fill="#161616" stroke="#2a2a2a" strokeWidth="1.2"/>
          <rect x="49" y="30" width="12" height="9" rx="2" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M40 39 Q55 32 70 39 L74 60 Q55 54 36 60 Z" fill={c("espalda_alta")} stroke={s("espalda_alta")} strokeWidth="1.2"/>
          <ellipse cx="22" cy="53" rx="9" ry="8" fill={c("deltoides_lateral")} stroke={s("deltoides_lateral")} strokeWidth="1.2"/>
          <ellipse cx="88" cy="53" rx="9" ry="8" fill={c("deltoides_lateral")} stroke={s("deltoides_lateral")} strokeWidth="1.2"/>
          <path d="M36 60 Q24 78 28 108 L46 108 L46 60Z" fill={c("dorsal")} stroke={s("dorsal")} strokeWidth="1.2"/>
          <path d="M74 60 Q86 78 82 108 L64 108 L64 60Z" fill={c("dorsal")} stroke={s("dorsal")} strokeWidth="1.2"/>
          <path d="M46 60 Q55 57 64 60 L64 90 Q55 93 46 90 Z" fill={c("espalda_media")} stroke={s("espalda_media")} strokeWidth="1.2"/>
          <path d="M46 90 Q55 93 64 90 L64 112 Q55 116 46 112 Z" fill={c("lumbar")} stroke={s("lumbar")} strokeWidth="1.2"/>
          <path d="M13 63 Q11 77 12 92 L21 92 Q22 77 22 63Z" fill={c("triceps")} stroke={s("triceps")} strokeWidth="1.2"/>
          <path d="M97 63 Q99 77 98 92 L89 92 Q88 77 88 63Z" fill={c("triceps")} stroke={s("triceps")} strokeWidth="1.2"/>
          <path d="M12 93 Q10 106 13 118 L21 118 Q24 106 21 93Z" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M98 93 Q100 106 97 118 L89 118 Q86 106 89 93Z" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="16" cy="122" rx="6" ry="7" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="94" cy="122" rx="6" ry="7" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="38" cy="115" rx="9" ry="6" fill={c("gluteo_medio")} stroke={s("gluteo_medio")} strokeWidth="1.2"/>
          <ellipse cx="72" cy="115" rx="9" ry="6" fill={c("gluteo_medio")} stroke={s("gluteo_medio")} strokeWidth="1.2"/>
          <path d="M36 112 Q34 130 38 142 L55 142 L55 112Z" fill={c("gluteo")} stroke={s("gluteo")} strokeWidth="1.5"/>
          <path d="M74 112 Q76 130 72 142 L55 142 L55 112Z" fill={c("gluteo")} stroke={s("gluteo")} strokeWidth="1.5"/>
          <path d="M38 142 Q34 162 36 180 L50 180 L55 142Z" fill={c("isquiotibiales")} stroke={s("isquiotibiales")} strokeWidth="1.5"/>
          <path d="M72 142 Q76 162 74 180 L60 180 L55 142Z" fill={c("isquiotibiales")} stroke={s("isquiotibiales")} strokeWidth="1.5"/>
          <ellipse cx="42" cy="183" rx="8" ry="5" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="68" cy="183" rx="8" ry="5" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M34 188 Q31 210 34 230 L50 230 L50 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <path d="M76 188 Q79 210 76 230 L60 230 L60 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <ellipse cx="42" cy="233" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="68" cy="233" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
        </svg>
      </div>
      {active.length > 0 && !heatmap && (
        <div style={{ display:"flex", flexDirection:"column", gap:"5px", justifyContent:"center" }}>
          {active.map(m => {
            const mg = MUSCLE_GROUPS.find(g => g.id===m);
            return (
              <div key={m} style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                <div style={{ width:"9px", height:"9px", borderRadius:"2px", background:MC[m], flexShrink:0 }}/>
                <span style={{ fontSize:"11px", color:"#bbb" }}>{mg?.label||m}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ seconds, onDone }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) { onDone(); return; }
    const t = setTimeout(() => setLeft(l => l-1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  const pct = ((seconds-left)/seconds)*100;
  return (
    <div style={{ position:"fixed", inset:0, background:"#000000cc", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#111", borderRadius:"24px", padding:"40px 48px", textAlign:"center", border:"1px solid #2a2a2a" }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"11px", color:"#555", letterSpacing:"4px", marginBottom:"8px" }}>DESCANSO</div>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"88px", color:"#c8f135", lineHeight:1 }}>{left}s</div>
        <div style={{ background:"#1a1a1a", borderRadius:"99px", height:"5px", margin:"18px 0", overflow:"hidden" }}>
          <div style={{ height:"100%", width:pct+"%", background:"#c8f135", transition:"width 1s linear", borderRadius:"99px" }}/>
        </div>
        <button onClick={onDone} style={{ background:"transparent", border:"1px solid #2a2a2a", color:"#555", borderRadius:"8px", padding:"8px 24px", cursor:"pointer" }}>Saltar</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]         = useState("home");
  const [screenData, setScreenData] = useState(null);
  const [exercises, setExercises]   = useState(() => S.get("exercises_v2") || DEFAULT_EXERCISES);
  const [plans, setPlans]           = useState(() => S.get("plans_v3")     || []);
  const [history, setHistory]       = useState(() => S.get("history_v2")   || []);
  const [lastWeights, setLastWeights] = useState(() => S.get("lastWeights") || {});

  const saveExercises   = v => { setExercises(v);   S.set("exercises_v2", v); };
  const savePlans       = v => { setPlans(v);       S.set("plans_v3", v); };
  const saveHistory     = v => { setHistory(v);     S.set("history_v2", v); };
  const saveLastWeights = v => { setLastWeights(v); S.set("lastWeights", v); };

  const goTo = (s, data=null) => { setScreen(s); setScreenData(data); };

  const p = { exercises, plans, history, lastWeights, saveExercises, savePlans, saveHistory, saveLastWeights, goTo };
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#f0f0f0" }}>
      {screen==="home"        && <HomeScreen {...p}/>}
      {screen==="newPlan"     && <PlanEditor {...p} editPlan={null}/>}
      {screen==="editPlan"    && <PlanEditor {...p} editPlan={screenData}/>}
      {screen==="newExercise" && <NewExerciseScreen {...p}/>}
      {screen==="doPlans"     && <DoPlansScreen {...p}/>}
      {screen==="analytics"   && <AnalyticsScreen {...p}/>}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ goTo, history, plans, exercises }) {
  return (
    <div style={{ maxWidth:"500px", margin:"0 auto", padding:"32px 20px" }}>
      <div style={{ marginBottom:"36px" }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"10px", letterSpacing:"4px", color:"#c8f135", marginBottom:"4px" }}>TU GYM APP</div>
        <h1 style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"50px", margin:0, lineHeight:1 }}>WORKOUT<br/><span style={{ color:"#c8f135" }}>TRACKER</span></h1>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", marginBottom:"32px" }}>
        <MainBtn label="HACER PLAN"      sub="Seleccioná y ejecutá una rutina"    accent="#c8f135" onClick={()=>goTo("doPlans")}/>
        <MainBtn label="ANÁLISIS"        sub="Historial y mapa de calor corporal" accent="#f97316" onClick={()=>goTo("analytics")}/>
        <MainBtn label="NUEVO PLAN"      sub="Armá una nueva rutina"              accent="#a78bfa" onClick={()=>goTo("newPlan")}/>
        <MainBtn label="NUEVO EJERCICIO" sub="Agregá un ejercicio a tu base"      accent="#06b6d4" onClick={()=>goTo("newExercise")}/>
      </div>

      {plans.length > 0 && (
        <div style={{ marginBottom:"28px" }}>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"13px", letterSpacing:"3px", color:"#333", marginBottom:"10px" }}>TUS PLANES</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
            {plans.map(p => {
              const ms = [...new Set(p.rows.filter(r=>r.type==="exercise").flatMap(r=>{
                const ex=exercises.find(e=>e.id===r.exerciseId);
                return [ex?.muscle,ex?.muscle2].filter(Boolean);
              }))];
              return (
                <div key={p.id} style={{ background:"#0e0e0e", border:"1px solid #1a1a1a", borderRadius:"10px", padding:"11px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"15px", letterSpacing:"1px" }}>{p.name}</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"5px" }}>
                      {ms.slice(0,4).map(m=><span key={m} style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"99px", background:(MC[m]||"#333")+"18", color:MC[m]||"#666" }}>{MUSCLE_GROUPS.find(g=>g.id===m)?.label}</span>)}
                    </div>
                  </div>
                  <button onClick={()=>goTo("editPlan",p)}
                    style={{ background:"transparent", border:"1px solid #2a2a2a", color:"#666", borderRadius:"7px", padding:"6px 12px", cursor:"pointer", fontSize:"11px", fontFamily:"'Bebas Neue', sans-serif", letterSpacing:"1px", flexShrink:0, marginLeft:"10px" }}>
                    EDITAR
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"13px", letterSpacing:"3px", color:"#333", marginBottom:"10px" }}>HISTORIAL RECIENTE</div>
        {history.length===0 ? (
          <div style={{ color:"#222", fontSize:"13px", textAlign:"center", padding:"28px", border:"1px dashed #161616", borderRadius:"12px" }}>
            Todavía no hay entrenamientos registrados
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
            {[...history].reverse().slice(0,5).map((h,i)=><HistoryCard key={i} h={h}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

function MainBtn({ label, sub, accent, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ background:h?accent+"10":"#0e0e0e", border:`1px solid ${h?accent:"#1a1a1a"}`, borderRadius:"13px", padding:"18px 20px", cursor:"pointer", textAlign:"left", transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"20px", letterSpacing:"2px", color:h?accent:"#e8e8e8" }}>{label}</div>
        <div style={{ fontSize:"12px", color:"#444", marginTop:"2px" }}>{sub}</div>
      </div>
      <div style={{ color:accent, fontSize:"20px", opacity:h?1:0.2 }}>→</div>
    </button>
  );
}

function HistoryCard({ h }) {
  const muscles=[...new Set((h.rows||[]).filter(r=>r.type==="exercise").flatMap(r=>[r.muscle,r.muscle2]).filter(Boolean))];
  return (
    <div style={{ background:"#0e0e0e", border:"1px solid #161616", borderRadius:"9px", padding:"10px 14px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"14px", letterSpacing:"1px" }}>{h.planName}</div>
        <div style={{ fontSize:"10px", color:"#333" }}>{new Date(h.date).toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"})}</div>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginTop:"6px" }}>
        {muscles.slice(0,5).map(m=>{
          const mg=MUSCLE_GROUPS.find(g=>g.id===m);
          return <span key={m} style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"99px", background:(MC[m]||"#333")+"18", color:MC[m]||"#666" }}>{mg?.label||m}</span>;
        })}
      </div>
    </div>
  );
}

// ─── PLAN EDITOR ──────────────────────────────────────────────────────────────
function PlanEditor({ goTo, exercises, plans, savePlans, editPlan }) {
  const isEdit = !!editPlan;
  const [planName, setPlanName] = useState(editPlan?.name || "");
  const [rows, setRows] = useState(editPlan?.rows ? editPlan.rows.map(r=>({...r,id:r.id||Date.now()+Math.random()})) : []);
  const cats = [...new Set(MUSCLE_GROUPS.map(g=>g.category))];

  const addEx   = () => setRows(r=>[...r,{id:Date.now(),type:"exercise",muscleFilter:"cuadriceps",exerciseId:"",sets:"3",reps:"12",weight:""}]);
  const addRest = () => setRows(r=>[...r,{id:Date.now(),type:"rest",duration:30}]);
  const removeRow = id => setRows(r=>r.filter(x=>x.id!==id));
  const updateRow = (id,f,v) => setRows(r=>r.map(x=>{
    if(x.id!==id) return x;
    const u={...x,[f]:v};
    if(f==="muscleFilter") u.exerciseId="";
    return u;
  }));

  const activeMuscles = () => {
    const ms=[];
    rows.filter(r=>r.type==="exercise"&&r.exerciseId).forEach(r=>{
      const ex=exercises.find(e=>e.id===r.exerciseId);
      if(ex){ms.push(ex.muscle);if(ex.muscle2)ms.push(ex.muscle2);}
    });
    return [...new Set(ms)];
  };

  const save = () => {
    if(!planName.trim()||rows.length===0) return;
    let updated;
    if(isEdit) updated=plans.map(p=>p.id===editPlan.id?{...p,name:planName.trim(),rows}:p);
    else updated=[...plans,{id:"p"+Date.now(),name:planName.trim(),rows,createdAt:Date.now()}];
    savePlans(updated);
    goTo("home");
  };

  const deletePlan = () => {
    if(!window.confirm("¿Eliminar este plan?")) return;
    savePlans(plans.filter(p=>p.id!==editPlan.id));
    goTo("home");
  };

  return (
    <div style={{ maxWidth:"500px", margin:"0 auto", padding:"24px 20px" }}>
      <TopBar title={isEdit?"EDITAR PLAN":"NUEVO PLAN"} onBack={()=>goTo("home")}/>
      <input value={planName} onChange={e=>setPlanName(e.target.value)} placeholder="Nombre del plan" style={IS}/>
      {activeMuscles().length>0 && <BodyMap muscles={activeMuscles()}/>}
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", margin:"14px 0" }}>
        {rows.map((row,i)=>row.type==="exercise"
          ?<ExRow key={row.id} row={row} exercises={exercises} index={i+1} onUpdate={(f,v)=>updateRow(row.id,f,v)} onRemove={()=>removeRow(row.id)} cats={cats}/>
          :<RestRow key={row.id} row={row} onUpdate={(f,v)=>updateRow(row.id,f,v)} onRemove={()=>removeRow(row.id)}/>
        )}
      </div>
      <div style={{ display:"flex", gap:"10px", marginBottom:"20px" }}>
        <AddBtn label="+ Ejercicio" onClick={addEx} color="#c8f135"/>
        <AddBtn label="⏱ Descanso" onClick={addRest} color="#06b6d4"/>
      </div>
      <button onClick={save} disabled={!planName.trim()||rows.length===0}
        style={{ width:"100%", padding:"15px", borderRadius:"12px", background:planName.trim()&&rows.length>0?"#c8f135":"#161616", color:planName.trim()&&rows.length>0?"#0a0a0a":"#333", border:"none", cursor:planName.trim()&&rows.length>0?"pointer":"default", fontFamily:"'Bebas Neue', sans-serif", fontSize:"19px", letterSpacing:"2px" }}>
        {isEdit?"GUARDAR CAMBIOS":"GUARDAR PLAN"}
      </button>
      {isEdit && (
        <button onClick={deletePlan}
          style={{ width:"100%", padding:"12px", marginTop:"10px", borderRadius:"12px", background:"transparent", color:"#f43f5e44", border:"1px solid #f43f5e22", cursor:"pointer", fontFamily:"'Bebas Neue', sans-serif", fontSize:"15px", letterSpacing:"2px" }}
          onMouseEnter={e=>{e.currentTarget.style.color="#f43f5e";e.currentTarget.style.borderColor="#f43f5e55";}}
          onMouseLeave={e=>{e.currentTarget.style.color="#f43f5e44";e.currentTarget.style.borderColor="#f43f5e22";}}>
          ELIMINAR PLAN
        </button>
      )}
    </div>
  );
}

function ExRow({ row, exercises, onUpdate, onRemove, index, cats }) {
  const filtered=exercises.filter(e=>e.muscle===row.muscleFilter||e.muscle2===row.muscleFilter);
  const selected=exercises.find(e=>e.id===row.exerciseId);
  const accent=MC[row.muscleFilter]||"#333";
  return (
    <div style={{ background:"#0e0e0e", border:`1px solid ${accent}33`, borderRadius:"12px", padding:"13px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"9px" }}>
        <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"11px", color:"#444", letterSpacing:"2px" }}>EJ {index}</span>
        <button onClick={onRemove} style={{ background:"none", border:"none", color:"#f43f5e", cursor:"pointer", fontSize:"15px" }}>✕</button>
      </div>
      <div style={{ display:"flex", gap:"7px", marginBottom:"9px", flexWrap:"wrap" }}>
        <select value={row.muscleFilter} onChange={e=>onUpdate("muscleFilter",e.target.value)} style={SS}>
          {cats.map(cat=>(
            <optgroup key={cat} label={cat}>
              {MUSCLE_GROUPS.filter(g=>g.category===cat).map(g=><option key={g.id} value={g.id}>{g.label}</option>)}
            </optgroup>
          ))}
        </select>
        <select value={row.exerciseId} onChange={e=>onUpdate("exerciseId",e.target.value)} style={{...SS,flex:1,minWidth:"130px"}}>
          <option value="">— Elegí —</option>
          {filtered.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      {selected?.desc && <div style={{ fontSize:"11px", color:"#444", marginBottom:"9px" }}>{selected.desc}</div>}
      <div style={{ display:"flex", gap:"7px" }}>
        <SInput label="Series" value={row.sets} onChange={v=>onUpdate("sets",v)}/>
        <SInput label="Reps"   value={row.reps} onChange={v=>onUpdate("reps",v)}/>
        {(!selected||selected.weighted) && <SInput label="Kg" value={row.weight} onChange={v=>onUpdate("weight",v)}/>}
      </div>
    </div>
  );
}

function RestRow({ row, onUpdate, onRemove }) {
  return (
    <div style={{ background:"#0a1414", border:"1px solid #06b6d420", borderRadius:"12px", padding:"13px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <span style={{ color:"#06b6d4" }}>⏱</span>
        <span style={{ fontFamily:"'Bebas Neue', sans-serif", color:"#06b6d4", letterSpacing:"1px", fontSize:"15px" }}>DESCANSO</span>
        <select value={row.duration} onChange={e=>onUpdate("duration",Number(e.target.value))} style={{...SS,color:"#06b6d4",border:"1px solid #06b6d430"}}>
          <option value={15}>15s</option><option value={30}>30s</option><option value={45}>45s</option><option value={60}>1 min</option>
        </select>
      </div>
      <button onClick={onRemove} style={{ background:"none", border:"none", color:"#f43f5e", cursor:"pointer", fontSize:"15px" }}>✕</button>
    </div>
  );
}

// ─── NEW EXERCISE ─────────────────────────────────────────────────────────────
function NewExerciseScreen({ goTo, exercises, saveExercises }) {
  const [name, setName]       = useState("");
  const [muscle, setMuscle]   = useState("cuadriceps");
  const [muscle2, setMuscle2] = useState("");
  const [weighted, setWeighted] = useState(true);
  const [desc, setDesc]       = useState("");
  const [saved, setSaved]     = useState(false);
  const cats = [...new Set(MUSCLE_GROUPS.map(g=>g.category))];

  const save = () => {
    if(!name.trim()) return;
    saveExercises([...exercises,{id:"e"+Date.now(),name:name.trim(),muscle,muscle2:muscle2||null,weighted,desc}]);
    setSaved(true);
    setTimeout(()=>{setSaved(false);setName("");setDesc("");setMuscle2("");},1500);
  };

  return (
    <div style={{ maxWidth:"500px", margin:"0 auto", padding:"24px 20px" }}>
      <TopBar title="NUEVO EJERCICIO" onBack={()=>goTo("home")}/>
      <div style={{ display:"flex", flexDirection:"column", gap:"13px" }}>
        <div><Label>Nombre</Label><input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej: Curl predicador" style={IS}/></div>
        <div><Label>Descripción breve</Label><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Cómo se hace" style={IS}/></div>
        <div style={{ display:"flex", gap:"10px" }}>
          <div style={{ flex:1 }}><Label>Músculo principal</Label>
            <select value={muscle} onChange={e=>setMuscle(e.target.value)} style={{...IS,cursor:"pointer"}}>
              {cats.map(cat=><optgroup key={cat} label={cat}>{MUSCLE_GROUPS.filter(g=>g.category===cat).map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</optgroup>)}
            </select>
          </div>
          <div style={{ flex:1 }}><Label>Músculo secundario</Label>
            <select value={muscle2} onChange={e=>setMuscle2(e.target.value)} style={{...IS,cursor:"pointer"}}>
              <option value="">— Ninguno —</option>
              {cats.map(cat=><optgroup key={cat} label={cat}>{MUSCLE_GROUPS.filter(g=>g.category===cat).map(g=><option key={g.id} value={g.id}>{g.label}</option>)}</optgroup>)}
            </select>
          </div>
        </div>
        <div><Label>Tipo</Label>
          <div style={{ display:"flex", gap:"10px" }}>
            <TypeBtn label="Con peso"     active={weighted}  onClick={()=>setWeighted(true)}  color="#c8f135"/>
            <TypeBtn label="Peso corporal" active={!weighted} onClick={()=>setWeighted(false)} color="#a78bfa"/>
          </div>
        </div>
        <button onClick={save} disabled={!name.trim()}
          style={{ width:"100%", padding:"15px", borderRadius:"12px", background:saved?"#10b981":name.trim()?"#c8f135":"#161616", color:saved?"#fff":name.trim()?"#0a0a0a":"#333", border:"none", cursor:name.trim()?"pointer":"default", fontFamily:"'Bebas Neue', sans-serif", fontSize:"19px", letterSpacing:"2px", transition:"all 0.3s" }}>
          {saved?"✓ GUARDADO":"GUARDAR EJERCICIO"}
        </button>
      </div>
      <div style={{ marginTop:"28px" }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"12px", letterSpacing:"3px", color:"#333", marginBottom:"10px" }}>BASE ({exercises.length} ejercicios)</div>
        {[...new Set(MUSCLE_GROUPS.map(g=>g.category))].map(cat=>{
          const exs=exercises.filter(e=>MUSCLE_GROUPS.find(g=>g.id===e.muscle)?.category===cat);
          if(!exs.length) return null;
          return (
            <div key={cat} style={{ marginBottom:"10px" }}>
              <div style={{ fontSize:"9px", color:"#444", letterSpacing:"3px", fontFamily:"'Bebas Neue', sans-serif", marginBottom:"5px" }}>{cat.toUpperCase()}</div>
              {exs.map(e=>(
                <div key={e.id} style={{ background:"#0e0e0e", borderLeft:`3px solid ${MC[e.muscle]||"#333"}`, borderRadius:"0 7px 7px 0", padding:"7px 11px", marginBottom:"3px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"13px", color:"#ddd" }}>{e.name}</div>
                    {e.desc&&<div style={{ fontSize:"10px", color:"#3a3a3a", marginTop:"1px" }}>{e.desc}</div>}
                  </div>
                  <span style={{ fontSize:"9px", padding:"1px 6px", borderRadius:"99px", background:(MC[e.muscle]||"#333")+"20", color:MC[e.muscle]||"#666", flexShrink:0, marginLeft:"8px" }}>
                    {MUSCLE_GROUPS.find(g=>g.id===e.muscle)?.label}
                  </span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DO PLANS ─────────────────────────────────────────────────────────────────
function DoPlansScreen({ goTo, plans, exercises, history, saveHistory, lastWeights, saveLastWeights }) {
  const [selected, setSelected]     = useState(null);
  const [sessionRows, setSessionRows] = useState([]);
  const [restTimer, setRestTimer]   = useState(null);
  const [done, setDone]             = useState(false);

  const startPlan = plan => {
    setSelected(plan);
    setSessionRows(plan.rows.map(r=>{
      if(r.type!=="exercise") return r;
      const prev=lastWeights[r.exerciseId];
      return {
        ...r,
        prevSets: prev?.sets||null,
        sessionSets: Array.from({length:Math.max(Number(r.sets)||1,1)},(_,i)=>({
          weight: prev?.sets?.[i]?.weight || r.weight || "",
          reps:   prev?.sets?.[i]?.reps   || r.reps   || "",
          done:   false,
        }))
      };
    }));
    setDone(false);
  };

  const updateSet = (rowId,si,f,v) => setSessionRows(rows=>rows.map(r=>{
    if(r.id!==rowId) return r;
    return {...r,sessionSets:r.sessionSets.map((s,i)=>i===si?{...s,[f]:v}:s)};
  }));
  const toggleSet = (rowId,si) => setSessionRows(rows=>rows.map(r=>{
    if(r.id!==rowId) return r;
    return {...r,sessionSets:r.sessionSets.map((s,i)=>i===si?{...s,done:!s.done}:s)};
  }));

  const finish = () => {
    const newLW={...lastWeights};
    sessionRows.filter(r=>r.type==="exercise"&&r.exerciseId).forEach(r=>{
      newLW[r.exerciseId]={sets:r.sessionSets.map(s=>({weight:s.weight,reps:s.reps}))};
    });
    saveLastWeights(newLW);
    const entry={
      planName:selected.name, date:Date.now(),
      rows:sessionRows.map(r=>{
        if(r.type!=="exercise") return r;
        const ex=exercises.find(e=>e.id===r.exerciseId);
        return {type:"exercise",muscle:ex?.muscle||r.muscleFilter,muscle2:ex?.muscle2,exerciseId:r.exerciseId,name:ex?.name||"",sets:r.sessionSets};
      })
    };
    saveHistory([...history,entry]);
    setDone(true);
  };

  if(!selected){
    return (
      <div style={{ maxWidth:"500px", margin:"0 auto", padding:"24px 20px" }}>
        <TopBar title="HACER PLAN" onBack={()=>goTo("home")}/>
        {plans.length===0?(
          <div style={{ color:"#2a2a2a", textAlign:"center", padding:"48px", border:"1px dashed #161616", borderRadius:"12px", fontSize:"13px" }}>
            No tenés planes guardados.<br/>
            <span style={{ color:"#c8f135", cursor:"pointer" }} onClick={()=>goTo("newPlan")}>Creá uno →</span>
          </div>
        ):(
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {plans.map(p=>{
              const ms=[...new Set(p.rows.filter(r=>r.type==="exercise").flatMap(r=>{
                const ex=exercises.find(e=>e.id===r.exerciseId);
                return [ex?.muscle,ex?.muscle2].filter(Boolean);
              }))];
              return (
                <button key={p.id} onClick={()=>startPlan(p)}
                  style={{ background:"#0e0e0e", border:"1px solid #161616", borderRadius:"14px", padding:"18px", cursor:"pointer", textAlign:"left", transition:"border-color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#c8f13555"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#161616"}>
                  <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"19px", letterSpacing:"1px", marginBottom:"10px" }}>{p.name}</div>
                  <BodyMap muscles={ms}/>
                  <div style={{ fontSize:"11px", color:"#333", marginTop:"6px" }}>{p.rows.filter(r=>r.type==="exercise").length} ejercicios</div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if(done){
    return (
      <div style={{ maxWidth:"500px", margin:"0 auto", padding:"24px 20px", textAlign:"center", paddingTop:"80px" }}>
        <div style={{ fontSize:"64px", marginBottom:"12px" }}>🏋️</div>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"40px", color:"#c8f135", letterSpacing:"2px", lineHeight:1.1 }}>¡ENTRENAMIENTO<br/>COMPLETADO!</div>
        <div style={{ color:"#444", marginTop:"10px", marginBottom:"30px", fontSize:"14px" }}>{selected.name}</div>
        <div style={{ display:"flex", gap:"10px", justifyContent:"center" }}>
          <button onClick={()=>{setSelected(null);setDone(false);}} style={{ background:"#c8f135", color:"#0a0a0a", border:"none", borderRadius:"12px", padding:"13px 28px", fontFamily:"'Bebas Neue', sans-serif", fontSize:"17px", letterSpacing:"2px", cursor:"pointer" }}>OTRO PLAN</button>
          <button onClick={()=>goTo("home")} style={{ background:"transparent", color:"#444", border:"1px solid #2a2a2a", borderRadius:"12px", padding:"13px 28px", fontFamily:"'Bebas Neue', sans-serif", fontSize:"17px", letterSpacing:"2px", cursor:"pointer" }}>INICIO</button>
        </div>
      </div>
    );
  }

  const activeMuscles=[...new Set(sessionRows.filter(r=>r.type==="exercise").flatMap(r=>{
    const ex=exercises.find(e=>e.id===r.exerciseId);
    return [ex?.muscle,ex?.muscle2].filter(Boolean);
  }))];

  return (
    <div style={{ maxWidth:"500px", margin:"0 auto", padding:"24px 20px" }}>
      {restTimer&&<RestTimer seconds={restTimer} onDone={()=>setRestTimer(null)}/>}
      <TopBar title={selected.name} onBack={()=>setSelected(null)}/>
      <BodyMap muscles={activeMuscles}/>
      <div style={{ display:"flex", flexDirection:"column", gap:"10px", margin:"12px 0 22px" }}>
        {sessionRows.map(row=>{
          if(row.type==="rest") return (
            <button key={row.id} onClick={()=>setRestTimer(row.duration)}
              style={{ background:"#0a1414", border:"1px solid #06b6d420", borderRadius:"12px", padding:"13px 16px", display:"flex", alignItems:"center", gap:"10px", cursor:"pointer" }}>
              <span style={{ color:"#06b6d4" }}>⏱</span>
              <span style={{ fontFamily:"'Bebas Neue', sans-serif", color:"#06b6d4", letterSpacing:"1px" }}>INICIAR DESCANSO · {row.duration}s</span>
            </button>
          );
          const ex=exercises.find(e=>e.id===row.exerciseId);
          return (
            <div key={row.id} style={{ background:"#0e0e0e", border:`1px solid ${MC[ex?.muscle]||"#1a1a1a"}20`, borderRadius:"12px", padding:"13px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"3px" }}>
                <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:MC[ex?.muscle]||"#444", display:"inline-block", flexShrink:0 }}/>
                <span style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"16px", letterSpacing:"1px" }}>{ex?.name||"Ejercicio"}</span>
              </div>
              {ex?.desc&&<div style={{ fontSize:"11px", color:"#333", marginBottom:"9px", paddingLeft:"14px" }}>{ex.desc}</div>}
              {row.prevSets&&(
                <div style={{ background:"#0a1a0a", border:"1px solid #10b98120", borderRadius:"8px", padding:"7px 10px", marginBottom:"9px", fontSize:"11px", color:"#10b981" }}>
                  <span style={{ fontFamily:"'Bebas Neue', sans-serif", letterSpacing:"1px", fontSize:"10px", opacity:0.7, marginRight:"6px" }}>ÚLTIMA VEZ:</span>
                  {row.prevSets.map((s,i)=>(
                    <span key={i} style={{ marginRight:"10px" }}>S{i+1}: {s.weight&&`${s.weight}kg`} {s.reps&&`× ${s.reps}`}</span>
                  ))}
                </div>
              )}
              <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
                {row.sessionSets.map((s,si)=>(
                  <div key={si} style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                    <span style={{ fontFamily:"'Bebas Neue', sans-serif", color:"#333", fontSize:"13px", width:"22px", flexShrink:0 }}>S{si+1}</span>
                    {ex?.weighted!==false&&<input value={s.weight} onChange={e=>updateSet(row.id,si,"weight",e.target.value)} placeholder="Kg" style={{...MI,width:"54px"}}/>}
                    <input value={s.reps} onChange={e=>updateSet(row.id,si,"reps",e.target.value)} placeholder="Reps" style={{...MI,width:"54px"}}/>
                    <button onClick={()=>toggleSet(row.id,si)}
                      style={{ marginLeft:"auto", width:"32px", height:"32px", borderRadius:"50%", border:`2px solid ${s.done?"#c8f135":"#222"}`, background:s.done?"#c8f13515":"transparent", cursor:"pointer", color:s.done?"#c8f135":"#2a2a2a", fontSize:"15px", flexShrink:0, transition:"all 0.15s" }}>
                      ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={finish} style={{ width:"100%", padding:"15px", borderRadius:"12px", background:"#c8f135", color:"#0a0a0a", border:"none", cursor:"pointer", fontFamily:"'Bebas Neue', sans-serif", fontSize:"19px", letterSpacing:"2px" }}>
        TERMINAR ENTRENAMIENTO
      </button>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsScreen({ goTo, history }) {
  const [range, setRange] = useState(30);
  const cutoff = Date.now() - range*24*60*60*1000;
  const filtered = history.filter(h=>h.date>=cutoff);

  const heatmap={};
  filtered.forEach(h=>{
    (h.rows||[]).filter(r=>r.type==="exercise").forEach(r=>{
      if(r.muscle)  heatmap[r.muscle]  =(heatmap[r.muscle] ||0)+1;
      if(r.muscle2) heatmap[r.muscle2]=(heatmap[r.muscle2]||0)+1;
    });
  });

  const muscleRanking=MUSCLE_GROUPS.map(g=>({...g,count:heatmap[g.id]||0})).sort((a,b)=>b.count-a.count);
  const maxCount=Math.max(...muscleRanking.map(m=>m.count),1);

  const today=new Date(); today.setHours(0,0,0,0);
  const startOfWeek=new Date(today); startOfWeek.setDate(today.getDate()-today.getDay());
  const weeks=[];
  for(let w=11;w>=0;w--){
    const week=[];
    for(let d=0;d<7;d++){
      const day=new Date(startOfWeek);
      day.setDate(startOfWeek.getDate()-w*7+d);
      const dayTs=day.getTime();
      const trained=history.some(h=>{const hd=new Date(h.date);hd.setHours(0,0,0,0);return hd.getTime()===dayTs;});
      week.push({date:day,trained,isFuture:day>today});
    }
    weeks.push(week);
  }

  const totalSessions=filtered.length;
  const trainedDays=new Set(filtered.map(h=>{const d=new Date(h.date);d.setHours(0,0,0,0);return d.getTime();})).size;
  const totalExercises=filtered.reduce((acc,h)=>acc+(h.rows||[]).filter(r=>r.type==="exercise").length,0);
  let streak=0,check=new Date(today);
  while(true){
    const ts=check.getTime();
    const found=history.some(h=>{const hd=new Date(h.date);hd.setHours(0,0,0,0);return hd.getTime()===ts;});
    if(!found) break; streak++; check.setDate(check.getDate()-1);
  }

  return (
    <div style={{ maxWidth:"500px", margin:"0 auto", padding:"24px 20px" }}>
      <TopBar title="ANÁLISIS" onBack={()=>goTo("home")}/>
      <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>
        {[7,30,90].map(r=>(
          <button key={r} onClick={()=>setRange(r)}
            style={{ flex:1, padding:"9px", borderRadius:"8px", border:`1px solid ${range===r?"#c8f135":"#1a1a1a"}`, background:range===r?"#c8f13515":"transparent", color:range===r?"#c8f135":"#444", cursor:"pointer", fontFamily:"'Bebas Neue', sans-serif", fontSize:"13px", letterSpacing:"1px" }}>
            {r===7?"7 DÍAS":r===30?"30 DÍAS":"3 MESES"}
          </button>
        ))}
      </div>
      <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>
        {[{label:"SESIONES",value:totalSessions},{label:"DÍAS",value:trainedDays},{label:"EJERCICIOS",value:totalExercises},{label:"RACHA",value:`${streak}🔥`}].map(s=>(
          <div key={s.label} style={{ flex:1, background:"#0e0e0e", border:"1px solid #1a1a1a", borderRadius:"10px", padding:"12px 8px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"26px", color:"#c8f135", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px", marginTop:"4px" }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"#0e0e0e", border:"1px solid #1a1a1a", borderRadius:"12px", padding:"16px", marginBottom:"20px" }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"12px", letterSpacing:"3px", color:"#444", marginBottom:"12px" }}>DÍAS ENTRENADOS</div>
        <div style={{ display:"flex", gap:"3px", overflowX:"auto" }}>
          {weeks.map((week,wi)=>(
            <div key={wi} style={{ display:"flex", flexDirection:"column", gap:"3px" }}>
              {week.map((day,di)=>(
                <div key={di} style={{ width:"14px", height:"14px", borderRadius:"3px", background:day.isFuture?"transparent":day.trained?"#c8f135":"#1a1a1a", border:day.isFuture?"none":"1px solid #222", opacity:day.isFuture?0:1 }}/>
              ))}
            </div>
          ))}
        </div>
        <div style={{ display:"flex", gap:"4px", marginTop:"8px", justifyContent:"flex-end", alignItems:"center" }}>
          <div style={{ width:"10px", height:"10px", borderRadius:"2px", background:"#1a1a1a", border:"1px solid #222" }}/><span style={{ fontSize:"9px", color:"#444" }}>Sin entreno</span>
          <div style={{ width:"10px", height:"10px", borderRadius:"2px", background:"#c8f135", marginLeft:"8px" }}/><span style={{ fontSize:"9px", color:"#444" }}>Entrenado</span>
        </div>
      </div>
      <div style={{ background:"#0e0e0e", border:"1px solid #1a1a1a", borderRadius:"12px", padding:"16px", marginBottom:"20px" }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"12px", letterSpacing:"3px", color:"#444", marginBottom:"4px" }}>MAPA DE CALOR MUSCULAR</div>
        <div style={{ fontSize:"11px", color:"#333", marginBottom:"8px" }}>Más brillante = más entrenado</div>
        {Object.keys(heatmap).length===0
          ?<div style={{ textAlign:"center", color:"#2a2a2a", fontSize:"13px", padding:"24px" }}>Sin datos para este período</div>
          :<BodyMap heatmap={heatmap}/>
        }
      </div>
      <div style={{ background:"#0e0e0e", border:"1px solid #1a1a1a", borderRadius:"12px", padding:"16px", marginBottom:"20px" }}>
        <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"12px", letterSpacing:"3px", color:"#444", marginBottom:"14px" }}>RANKING MUSCULAR</div>
        {muscleRanking.filter(m=>m.count>0).length===0
          ?<div style={{ textAlign:"center", color:"#2a2a2a", fontSize:"13px", padding:"16px" }}>Sin datos</div>
          :<div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {muscleRanking.filter(m=>m.count>0).map((m,i)=>(
              <div key={m.id}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <span style={{ fontFamily:"'Bebas Neue', sans-serif", color:"#444", fontSize:"12px", width:"18px" }}>#{i+1}</span>
                    <div style={{ width:"8px", height:"8px", borderRadius:"2px", background:MC[m.id]||"#555" }}/>
                    <span style={{ fontSize:"13px", color:"#ccc" }}>{m.label}</span>
                  </div>
                  <span style={{ fontSize:"12px", color:MC[m.id]||"#555", fontFamily:"'Bebas Neue', sans-serif" }}>{m.count}x</span>
                </div>
                <div style={{ background:"#161616", borderRadius:"99px", height:"4px", overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${(m.count/maxCount)*100}%`, background:MC[m.id]||"#555", borderRadius:"99px" }}/>
                </div>
              </div>
            ))}
          </div>
        }
        {muscleRanking.filter(m=>m.count===0).length>0&&(
          <div style={{ marginTop:"16px", paddingTop:"16px", borderTop:"1px solid #161616" }}>
            <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"10px", letterSpacing:"2px", color:"#444", marginBottom:"8px" }}>SIN TRABAJAR ⚠️</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
              {muscleRanking.filter(m=>m.count===0).map(m=>(
                <span key={m.id} style={{ fontSize:"10px", padding:"3px 9px", borderRadius:"99px", background:"#1a1a1a", color:"#555", border:"1px solid #222" }}>{m.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      {history.length>0&&(
        <div>
          <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"12px", letterSpacing:"3px", color:"#333", marginBottom:"10px" }}>HISTORIAL COMPLETO</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
            {[...history].reverse().map((h,i)=>(
              <div key={i} style={{ background:"#0e0e0e", border:"1px solid #161616", borderRadius:"9px", padding:"10px 14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"14px" }}>{h.planName}</div>
                  <div style={{ fontSize:"10px", color:"#333" }}>{new Date(h.date).toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"})}</div>
                </div>
                {(h.rows||[]).filter(r=>r.type==="exercise").map((r,j)=>(
                  <div key={j} style={{ fontSize:"11px", color:"#3a3a3a", marginTop:"3px", display:"flex", alignItems:"center", gap:"6px" }}>
                    <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:MC[r.muscle]||"#333", display:"inline-block", flexShrink:0 }}/>
                    {r.name}
                    {r.sets&&r.sets.some(s=>s.weight||s.reps)&&(
                      <span style={{ color:"#444" }}>— {r.sets.filter(s=>s.weight||s.reps).map(s=>`${s.weight||"?"}kg×${s.reps||"?"}`).join(", ")}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function TopBar({ title, onBack }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"26px" }}>
      <button onClick={onBack} style={{ background:"#0e0e0e", border:"1px solid #1a1a1a", borderRadius:"8px", width:"34px", height:"34px", cursor:"pointer", color:"#e0e0e0", fontSize:"15px", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>←</button>
      <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:"19px", letterSpacing:"2px" }}>{title}</div>
    </div>
  );
}
function Label({ children }) {
  return <div style={{ fontSize:"9px", color:"#444", letterSpacing:"2px", marginBottom:"5px", fontFamily:"'Bebas Neue', sans-serif" }}>{children}</div>;
}
function SInput({ label, value, onChange }) {
  return (
    <div style={{ flex:1 }}>
      <div style={{ fontSize:"9px", color:"#333", marginBottom:"3px", letterSpacing:"1px" }}>{label}</div>
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder="—" style={{...MI,width:"100%",boxSizing:"border-box"}}/>
    </div>
  );
}
function AddBtn({ label, onClick, color }) {
  return (
    <button onClick={onClick}
      style={{ flex:1, padding:"11px", borderRadius:"9px", background:"transparent", border:`1px solid ${color}33`, color, cursor:"pointer", fontFamily:"'Bebas Neue', sans-serif", fontSize:"13px", letterSpacing:"1px" }}
      onMouseEnter={e=>e.currentTarget.style.background=color+"0e"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      {label}
    </button>
  );
}
function TypeBtn({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{ flex:1, padding:"11px", borderRadius:"9px", background:active?color+"15":"transparent", border:`1px solid ${active?color:"#1e1e1e"}`, color:active?color:"#333", cursor:"pointer", fontFamily:"'Bebas Neue', sans-serif", fontSize:"13px", letterSpacing:"1px", transition:"all 0.2s" }}>
      {label}
    </button>
  );
}
const IS={width:"100%",boxSizing:"border-box",background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"10px",padding:"11px 13px",color:"#e8e8e8",fontSize:"13px",outline:"none",fontFamily:"'DM Sans', sans-serif"};
const SS={background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"7px",padding:"7px 9px",color:"#e0e0e0",fontSize:"12px",outline:"none",fontFamily:"'DM Sans', sans-serif",cursor:"pointer"};
const MI={background:"#080808",border:"1px solid #1a1a1a",borderRadius:"6px",padding:"5px 9px",color:"#e0e0e0",fontSize:"12px",outline:"none",fontFamily:"'DM Sans', sans-serif"};
