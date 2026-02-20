import { useState, useEffect, useRef } from "react";

// ─── Storage ──────────────────────────────────────────────────────────────────
const S = {
  get: (k) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
  es: {
    appSub:"TU GYM APP", title1:"WORKOUT", title2:"TRACKER",
    doPlan:"HACER PLAN", doSub:"Seleccioná y ejecutá una rutina",
    analytics:"ANÁLISIS", analyticsSub:"Historial y mapa de calor corporal",
    newPlan:"NUEVO PLAN", newPlanSub:"Armá una nueva rutina",
    newExercise:"NUEVO EJERCICIO", newExerciseSub:"Agregá un ejercicio a tu base",
    personalData:"DATOS PERSONALES", personalDataSub:"Edad, peso, altura y seguimiento",
    yourPlans:"TUS PLANES", recentHistory:"HISTORIAL RECIENTE",
    edit:"EDITAR", noHistory:"Todavía no hay entrenamientos registrados",
    editPlan:"EDITAR PLAN", savePlan:"GUARDAR PLAN", saveChanges:"GUARDAR CAMBIOS",
    deletePlan:"ELIMINAR PLAN", confirmDelete:"¿Eliminar este plan?",
    addExercise:"+ Ejercicio", addRest:"⏱ Descanso",
    planName:"Nombre del plan", exerciseN:"EJ",
    muscleMain:"Músculo principal", muscleSecond:"Músculo secundario",
    none:"— Ninguno —", pick:"— Elegí —",
    sets:"Series", reps:"Reps", kg:"Kg",
    weighted:"Con peso", bodyweight:"Peso corporal",
    saveExercise:"GUARDAR EJERCICIO", saved:"✓ GUARDADO",
    exerciseName:"Nombre", descLabel:"Descripción breve",
    base:"BASE", exercises:"ejercicios",
    restLabel:"DESCANSO", skipRest:"Saltar",
    lastTime:"ÚLTIMA VEZ:", finishWorkout:"TERMINAR ENTRENAMIENTO",
    workoutDone:"¡ENTRENAMIENTO\nCOMPLETADO!", finish:"TERMINAR",
    sessions:"SESIONES", days:"DÍAS", exercisesCount:"EJERCICIOS", streak:"RACHA",
    trainedDays:"DÍAS ENTRENADOS", noData:"Sin datos para este período",
    heatmapTitle:"MAPA DE CALOR MUSCULAR", heatmapSub:"Más brillante = más entrenado",
    rankingTitle:"RANKING MUSCULAR", noWorked:"SIN TRABAJAR ⚠️",
    fullHistory:"HISTORIAL COMPLETO", front:"FRENTE", back:"ESPALDA",
    days7:"7 DÍAS", days30:"30 DÍAS", months3:"3 MESES",
    avgTime:"TIEMPO PROMEDIO POR PLAN", avgGeneral:"PROMEDIO GENERAL",
    noTime:"Sin tiempo registrado",
    personalTitle:"DATOS PERSONALES",
    age:"Edad", weight:"Peso (kg)", height:"Altura (cm)",
    gender:"Género", male:"Masculino", female:"Femenino",
    trackWeight:"Seguimiento de peso semanal",
    saveData:"GUARDAR DATOS",
    weightHistory:"HISTORIAL DE PESO",
    logWeight:"REGISTRAR PESO",
    weightReminder:"¡Recordatorio! Registrá tu peso de esta semana 📊",
    workoutTime:"DURACIÓN", close:"CERRAR",
    noPlans:"No tenés planes guardados.",
    createOne:"Creá uno →",
  },
  en: {
    appSub:"YOUR GYM APP", title1:"WORKOUT", title2:"TRACKER",
    doPlan:"DO PLAN", doSub:"Select and run a routine",
    analytics:"ANALYTICS", analyticsSub:"History and body heatmap",
    newPlan:"NEW PLAN", newPlanSub:"Build a new routine",
    newExercise:"NEW EXERCISE", newExerciseSub:"Add an exercise to your base",
    personalData:"PERSONAL DATA", personalDataSub:"Age, weight, height & tracking",
    yourPlans:"YOUR PLANS", recentHistory:"RECENT HISTORY",
    edit:"EDIT", noHistory:"No workouts registered yet",
    editPlan:"EDIT PLAN", savePlan:"SAVE PLAN", saveChanges:"SAVE CHANGES",
    deletePlan:"DELETE PLAN", confirmDelete:"Delete this plan?",
    addExercise:"+ Exercise", addRest:"⏱ Rest",
    planName:"Plan name", exerciseN:"EX",
    muscleMain:"Primary muscle", muscleSecond:"Secondary muscle",
    none:"— None —", pick:"— Pick one —",
    sets:"Sets", reps:"Reps", kg:"Kg",
    weighted:"Weighted", bodyweight:"Bodyweight",
    saveExercise:"SAVE EXERCISE", saved:"✓ SAVED",
    exerciseName:"Name", descLabel:"Brief description",
    base:"BASE", exercises:"exercises",
    restLabel:"REST", skipRest:"Skip",
    lastTime:"LAST TIME:", finishWorkout:"FINISH WORKOUT",
    workoutDone:"WORKOUT\nCOMPLETED!", finish:"FINISH",
    sessions:"SESSIONS", days:"DAYS", exercisesCount:"EXERCISES", streak:"STREAK",
    trainedDays:"TRAINED DAYS", noData:"No data for this period",
    heatmapTitle:"MUSCLE HEATMAP", heatmapSub:"Brighter = more trained",
    rankingTitle:"MUSCLE RANKING", noWorked:"NOT WORKED ⚠️",
    fullHistory:"FULL HISTORY", front:"FRONT", back:"BACK",
    days7:"7 DAYS", days30:"30 DAYS", months3:"3 MONTHS",
    avgTime:"AVG TIME PER PLAN", avgGeneral:"OVERALL AVERAGE",
    noTime:"No time recorded",
    personalTitle:"PERSONAL DATA",
    age:"Age", weight:"Weight (kg)", height:"Height (cm)",
    gender:"Gender", male:"Male", female:"Female",
    trackWeight:"Weekly weight tracking",
    saveData:"SAVE DATA",
    weightHistory:"WEIGHT HISTORY",
    logWeight:"LOG WEIGHT",
    weightReminder:"Reminder! Log your weight this week 📊",
    workoutTime:"DURATION", close:"CLOSE",
    noPlans:"No saved plans.",
    createOne:"Create one →",
  }
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const DEFAULT_EXERCISES = [
  { id:"e1",  name:"Sentadilla Búlgara",     muscle:"cuadriceps",       muscle2:"gluteo",       weighted:true,  desc:"Una pierna apoyada atrás en un banco; bajas con la otra." },
  { id:"e2",  name:"Peso Muerto",             muscle:"isquiotibiales",   muscle2:"lumbar",       weighted:true,  desc:"Levantar la barra desde el suelo manteniendo espalda recta." },
  { id:"e3",  name:"Hip Thrust",              muscle:"gluteo",           muscle2:null,           weighted:true,  desc:"Espalda en banco, barra en la cadera; empuje hacia arriba." },
  { id:"e4",  name:"Sentadilla con Barra",    muscle:"cuadriceps",       muscle2:"gluteo",       weighted:true,  desc:"Flexión de rodilla con barra tras nuca o frontal." },
  { id:"e5",  name:"Sentadilla Sumo",         muscle:"aductores",        muscle2:"gluteo",       weighted:true,  desc:"Sentadilla con pies abiertos y puntas hacia afuera." },
  { id:"e6",  name:"Abducciones con Banda",   muscle:"gluteo_medio",     muscle2:null,           weighted:false, desc:"Desplazamiento lateral resistido por la banda." },
  { id:"e7",  name:"Extensión de Cuádriceps", muscle:"cuadriceps",       muscle2:null,           weighted:true,  desc:"Sentado en máquina, estiras las piernas hacia arriba." },
  { id:"e8",  name:"Prensa de Piernas",       muscle:"cuadriceps",       muscle2:"gluteo",       weighted:true,  desc:"Empujar una plataforma cargada con los pies." },
  { id:"e9",  name:"Vuelos Laterales",        muscle:"deltoides_lateral",muscle2:null,           weighted:true,  desc:"Elevar mancuernas hacia los lados hasta altura de hombros." },
  { id:"e10", name:"Vuelos Frontales",        muscle:"deltoides_anterior",muscle2:null,          weighted:true,  desc:"Elevar mancuernas hacia adelante." },
  { id:"e11", name:"Press de Hombros",        muscle:"deltoides",        muscle2:null,           weighted:true,  desc:"Empuje vertical de mancuernas o barra sobre la cabeza." },
  { id:"e12", name:"Vuelos en Polea",         muscle:"deltoides_lateral",muscle2:null,           weighted:true,  desc:"Elevación lateral usando el cable de la polea baja." },
  { id:"e13", name:"Extensión de Tríceps",    muscle:"triceps",          muscle2:null,           weighted:true,  desc:"Empujar la barra o soga de la polea hacia el suelo." },
  { id:"e14", name:"Patada de Tríceps",       muscle:"triceps",          muscle2:null,           weighted:true,  desc:"Inclinar el torso y estirar el brazo hacia atrás." },
  { id:"e15", name:"Fondos en Paralelas",     muscle:"triceps",          muscle2:"pecho",        weighted:false, desc:"Bajar y subir tu cuerpo apoyado en barras paralelas." },
  { id:"e16", name:"Curl de Bíceps",          muscle:"biceps",           muscle2:null,           weighted:true,  desc:"Flexión de codo con mancuernas de pie." },
  { id:"e17", name:"Curl Predicador",         muscle:"biceps",           muscle2:null,           weighted:true,  desc:"Bíceps con barra apoyando brazos en banco inclinado." },
  { id:"e18", name:"Curl en Banco Inclinado", muscle:"biceps",           muscle2:null,           weighted:true,  desc:"Sentado inclinado, dejas caer los brazos y flexionas." },
  { id:"e19", name:"Curl en Polea",           muscle:"biceps",           muscle2:null,           weighted:true,  desc:"Flexión de codos usando la polea baja." },
  { id:"e20", name:"Remo en Polea Baja",      muscle:"espalda_media",    muscle2:"dorsal",       weighted:true,  desc:"Tirar de la polea hacia el abdomen sentado." },
  { id:"e21", name:"Remo con Barra",          muscle:"espalda_media",    muscle2:null,           weighted:true,  desc:"Inclinado, tiras la barra hacia el ombligo." },
  { id:"e22", name:"Dominadas",               muscle:"dorsal",           muscle2:"espalda_alta", weighted:false, desc:"Colgarse de una barra y subir el pecho hacia ella." },
  { id:"e23", name:"Jalón al Pecho",          muscle:"dorsal",           muscle2:"espalda_alta", weighted:true,  desc:"Tirar de la barra de la polea alta hacia el pecho." },
  { id:"e24", name:"Jalón Tras Nuca",         muscle:"espalda_alta",     muscle2:null,           weighted:true,  desc:"Tirar de la barra por detrás de la cabeza." },
  { id:"e25", name:"Face Pull",               muscle:"espalda_alta",     muscle2:"deltoides",    weighted:true,  desc:"Tirar de la soga hacia la frente separando manos." },
  { id:"e26", name:"Pullover en Polea",       muscle:"dorsal",           muscle2:null,           weighted:true,  desc:"Brazos casi rectos, bajar la barra hacia los muslos." },
  { id:"e27", name:"Remo en Máquina",         muscle:"espalda_media",    muscle2:null,           weighted:true,  desc:"Tracción horizontal apoyando el pecho en la máquina." },
  { id:"e28", name:"Press Inclinado",         muscle:"pecho",            muscle2:null,           weighted:true,  desc:"Empuje de barra en banco a 45 grados." },
  { id:"e29", name:"Press de Banca Plano",    muscle:"pecho",            muscle2:null,           weighted:true,  desc:"Empuje de barra acostado horizontalmente." },
  { id:"e30", name:"Aperturas con Mancuerna", muscle:"pecho",            muscle2:null,           weighted:true,  desc:"Abrir y cerrar brazos como un abrazo acostado." },
  { id:"e31", name:"Cruces en Poleas",        muscle:"pecho",            muscle2:null,           weighted:true,  desc:"Similar a las aperturas pero con cables." },
  { id:"e32", name:"Crunches",                muscle:"abs",              muscle2:null,           weighted:false, desc:"Elevación pequeña del tronco apretando el abdomen." },
  { id:"e33", name:"Crunches de Oblicuos",    muscle:"oblicuos",         muscle2:null,           weighted:false, desc:"Codo busca la rodilla contraria de forma alterna." },
  { id:"e34", name:"Bicicletas",              muscle:"oblicuos",         muscle2:"abs",          weighted:false, desc:"Tumbado, simular pedaleo tocando rodilla-codo." },
  { id:"e35", name:"Elevación de Piernas",    muscle:"abs",              muscle2:null,           weighted:false, desc:"Acostado, subir y bajar piernas estiradas." },
  { id:"e36", name:"Giros Rusos",             muscle:"oblicuos",         muscle2:null,           weighted:false, desc:"Sentado, rotar el torso con o sin peso." },
  { id:"e37", name:"Rueda Abdominal",         muscle:"abs",              muscle2:"lumbar",       weighted:false, desc:"Rodar hacia adelante y volver manteniendo el core." },
  { id:"e38", name:"L-Sit",                   muscle:"abs",              muscle2:null,           weighted:false, desc:"Sostener el cuerpo con brazos, piernas en 90 grados." },
  { id:"e39", name:"Farmer Walk",             muscle:"abs",              muscle2:null,           weighted:true,  desc:"Caminar cargando pesas pesadas a los costados." },
  { id:"e40", name:"Crunch en Polea",         muscle:"abs",              muscle2:null,           weighted:true,  desc:"De rodillas, encoger el torso con peso de polea." },
  { id:"e41", name:"Crunch con Disco",        muscle:"abs",              muscle2:null,           weighted:true,  desc:"Crunch tradicional sosteniendo un disco." },
  { id:"e42", name:"Woodchoppers",            muscle:"oblicuos",         muscle2:null,           weighted:true,  desc:"Movimiento de hachazo diagonal en polea." },
];

const MUSCLE_GROUPS = [
  { id:"cuadriceps",         label:"Cuádriceps",        labelEn:"Quadriceps",      category:"Piernas",  categoryEn:"Legs"      },
  { id:"isquiotibiales",     label:"Isquiotibiales",    labelEn:"Hamstrings",      category:"Piernas",  categoryEn:"Legs"      },
  { id:"gluteo",             label:"Glúteo",            labelEn:"Glutes",          category:"Piernas",  categoryEn:"Legs"      },
  { id:"gluteo_medio",       label:"Glúteo Medio",      labelEn:"Glute Med.",      category:"Piernas",  categoryEn:"Legs"      },
  { id:"aductores",          label:"Aductores",         labelEn:"Adductors",       category:"Piernas",  categoryEn:"Legs"      },
  { id:"deltoides",          label:"Deltoides",         labelEn:"Deltoid",         category:"Hombros",  categoryEn:"Shoulders" },
  { id:"deltoides_lateral",  label:"Deltoides Lateral", labelEn:"Lateral Deltoid", category:"Hombros",  categoryEn:"Shoulders" },
  { id:"deltoides_anterior", label:"Deltoides Anterior",labelEn:"Front Deltoid",   category:"Hombros",  categoryEn:"Shoulders" },
  { id:"triceps",            label:"Tríceps",           labelEn:"Triceps",         category:"Brazos",   categoryEn:"Arms"      },
  { id:"biceps",             label:"Bíceps",            labelEn:"Biceps",          category:"Brazos",   categoryEn:"Arms"      },
  { id:"dorsal",             label:"Dorsal Ancho",      labelEn:"Lats",            category:"Espalda",  categoryEn:"Back"      },
  { id:"espalda_alta",       label:"Espalda Alta",      labelEn:"Upper Back",      category:"Espalda",  categoryEn:"Back"      },
  { id:"espalda_media",      label:"Espalda Media",     labelEn:"Mid Back",        category:"Espalda",  categoryEn:"Back"      },
  { id:"lumbar",             label:"Lumbar",            labelEn:"Lower Back",      category:"Espalda",  categoryEn:"Back"      },
  { id:"pecho",              label:"Pecho",             labelEn:"Chest",           category:"Pecho",    categoryEn:"Chest"     },
  { id:"abs",                label:"Abdomen",           labelEn:"Abs",             category:"Core",     categoryEn:"Core"      },
  { id:"oblicuos",           label:"Oblicuos",          labelEn:"Obliques",        category:"Core",     categoryEn:"Core"      },
];

const MC = {
  cuadriceps:"#f97316", isquiotibiales:"#fb923c", gluteo:"#f59e0b",
  gluteo_medio:"#fbbf24", aductores:"#fde68a",
  deltoides:"#a78bfa", deltoides_lateral:"#c4b5fd", deltoides_anterior:"#7c3aed",
  triceps:"#f43f5e", biceps:"#06b6d4",
  dorsal:"#10b981", espalda_alta:"#34d399", espalda_media:"#6ee7b7", lumbar:"#a7f3d0",
  pecho:"#3b82f6", abs:"#facc15", oblicuos:"#fde047",
};

const REPS_OPTIONS   = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","20","25","30","40","50"];
const WEIGHT_OPTIONS = ["—","2.5","5","7.5","10","12.5","15","17.5","20","22.5","25","27.5","30","32.5","35","37.5","40","42.5","45","47.5","50","55","60","65","70","75","80","85","90","95","100","110","120","130","140","150"];

function hexAlpha(hex, a) {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
}
function fmtTime(ms) {
  if (!ms || ms<=0) return "—";
  const m=Math.floor(ms/60000), s=Math.floor((ms%60000)/1000);
  return `${m}:${String(s).padStart(2,"0")}`;
}

// ─── BODY MAP ─────────────────────────────────────────────────────────────────
function BodyMap({ muscles, heatmap, gender }) {
  const active=[...new Set((muscles||[]).filter(Boolean))];
  const isFemale = gender==="female";
  const gc=(m)=>{
    if(heatmap){const cnt=heatmap[m]||0;if(!cnt)return"#1a1a1a";const mx=Math.max(...Object.values(heatmap),1);return hexAlpha(MC[m]||"#888",0.15+(cnt/mx)*0.85);}
    return active.includes(m)?MC[m]:"#1a1a1a";
  };
  const gs=(m)=>{
    if(heatmap)return(heatmap[m]||0)>0?MC[m]:"#2a2a2a";
    return active.includes(m)?MC[m]:"#2a2a2a";
  };
  const c=gc, s=gs;
  return (
    <div style={{display:"flex",gap:"12px",justifyContent:"center",alignItems:"flex-start",margin:"14px 0",flexWrap:"wrap"}}>
      {/* FRONT */}
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"4px",fontFamily:"'Bebas Neue',sans-serif"}}>FRENTE</div>
        <svg width="110" height="260" viewBox="0 0 110 260" fill="none">
          <ellipse cx="55" cy="16" rx="14" ry="15" fill="#161616" stroke="#2a2a2a" strokeWidth="1.2"/>
          <rect x="49" y="30" width="12" height="9" rx="2" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M35 39 Q55 36 75 39 L78 115 Q55 120 32 115 Z" fill="#111" stroke="#1a1a1a" strokeWidth="1"/>
          <ellipse cx="28" cy="50" rx="11" ry="8" fill={c("deltoides_anterior")} stroke={s("deltoides_anterior")} strokeWidth="1.2"/>
          <ellipse cx="82" cy="50" rx="11" ry="8" fill={c("deltoides_anterior")} stroke={s("deltoides_anterior")} strokeWidth="1.2"/>
          <ellipse cx="21" cy="57" rx="7" ry="7" fill={c("deltoides_lateral")} stroke={s("deltoides_lateral")} strokeWidth="1.2"/>
          <ellipse cx="89" cy="57" rx="7" ry="7" fill={c("deltoides_lateral")} stroke={s("deltoides_lateral")} strokeWidth="1.2"/>
          {isFemale
            ?<><ellipse cx="46" cy="58" rx="11" ry="12" fill={c("pecho")} stroke={s("pecho")} strokeWidth="1.2"/><ellipse cx="64" cy="58" rx="11" ry="12" fill={c("pecho")} stroke={s("pecho")} strokeWidth="1.2"/></>
            :<path d="M38 40 Q55 38 72 40 L74 68 Q55 74 36 68 Z" fill={c("pecho")} stroke={s("pecho")} strokeWidth="1.2"/>
          }
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
          {isFemale
            ?<><path d="M32 112 Q28 122 30 132 L47 132 L55 115Z" fill={c("aductores")} stroke={s("aductores")} strokeWidth="1"/><path d="M78 112 Q82 122 80 132 L63 132 L55 115Z" fill={c("aductores")} stroke={s("aductores")} strokeWidth="1"/></>
            :<><path d="M36 112 Q32 120 34 130 L46 130 L55 115Z" fill={c("aductores")} stroke={s("aductores")} strokeWidth="1"/><path d="M74 112 Q78 120 76 130 L64 130 L55 115Z" fill={c("aductores")} stroke={s("aductores")} strokeWidth="1"/></>
          }
          {isFemale
            ?<><path d="M30 132 Q26 158 28 178 L46 178 L47 132Z" fill={c("cuadriceps")} stroke={s("cuadriceps")} strokeWidth="1.5"/><path d="M80 132 Q84 158 82 178 L64 178 L63 132Z" fill={c("cuadriceps")} stroke={s("cuadriceps")} strokeWidth="1.5"/></>
            :<><path d="M34 130 Q30 155 32 178 L47 178 L50 130Z" fill={c("cuadriceps")} stroke={s("cuadriceps")} strokeWidth="1.5"/><path d="M76 130 Q80 155 78 178 L63 178 L60 130Z" fill={c("cuadriceps")} stroke={s("cuadriceps")} strokeWidth="1.5"/></>
          }
          <ellipse cx="40" cy="182" rx="8" ry="6" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="70" cy="182" rx="8" ry="6" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M33 188 Q31 210 33 232 L47 232 L47 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <path d="M77 188 Q79 210 77 232 L63 232 L63 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <ellipse cx="40" cy="236" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="70" cy="236" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
        </svg>
      </div>
      {/* BACK */}
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"4px",fontFamily:"'Bebas Neue',sans-serif"}}>ESPALDA</div>
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
          {isFemale
            ?<><path d="M32 112 Q28 132 33 148 L55 148 L55 112Z" fill={c("gluteo")} stroke={s("gluteo")} strokeWidth="1.5"/><path d="M78 112 Q82 132 77 148 L55 148 L55 112Z" fill={c("gluteo")} stroke={s("gluteo")} strokeWidth="1.5"/><path d="M33 148 Q28 168 30 182 L49 182 L55 148Z" fill={c("isquiotibiales")} stroke={s("isquiotibiales")} strokeWidth="1.5"/><path d="M77 148 Q82 168 80 182 L61 182 L55 148Z" fill={c("isquiotibiales")} stroke={s("isquiotibiales")} strokeWidth="1.5"/></>
            :<><path d="M36 112 Q34 130 38 142 L55 142 L55 112Z" fill={c("gluteo")} stroke={s("gluteo")} strokeWidth="1.5"/><path d="M74 112 Q76 130 72 142 L55 142 L55 112Z" fill={c("gluteo")} stroke={s("gluteo")} strokeWidth="1.5"/><path d="M38 142 Q34 162 36 180 L50 180 L55 142Z" fill={c("isquiotibiales")} stroke={s("isquiotibiales")} strokeWidth="1.5"/><path d="M72 142 Q76 162 74 180 L60 180 L55 142Z" fill={c("isquiotibiales")} stroke={s("isquiotibiales")} strokeWidth="1.5"/></>
          }
          <ellipse cx="42" cy="183" rx="8" ry="5" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="68" cy="183" rx="8" ry="5" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <path d="M34 188 Q31 210 34 230 L50 230 L50 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <path d="M76 188 Q79 210 76 230 L60 230 L60 188Z" fill="#161616" stroke="#1a1a1a" strokeWidth="1"/>
          <ellipse cx="42" cy="233" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
          <ellipse cx="68" cy="233" rx="9" ry="4" fill="#161616" stroke="#2a2a2a" strokeWidth="1"/>
        </svg>
      </div>
      {active.length>0&&!heatmap&&(
        <div style={{display:"flex",flexDirection:"column",gap:"5px",justifyContent:"center"}}>
          {active.map(m=>{const mg=MUSCLE_GROUPS.find(g=>g.id===m);return(<div key={m} style={{display:"flex",alignItems:"center",gap:"7px"}}><div style={{width:"9px",height:"9px",borderRadius:"2px",background:MC[m],flexShrink:0}}/><span style={{fontSize:"11px",color:"#bbb"}}>{mg?.label||m}</span></div>);})}
        </div>
      )}
    </div>
  );
}

// ─── REST TIMER ───────────────────────────────────────────────────────────────
function RestTimer({ seconds, onDone, t }) {
  const [left,setLeft]=useState(seconds);
  useEffect(()=>{if(left<=0){onDone();return;}const tm=setTimeout(()=>setLeft(l=>l-1),1000);return()=>clearTimeout(tm);},[left]);
  const pct=((seconds-left)/seconds)*100;
  return (
    <div style={{position:"fixed",inset:0,background:"#000000cc",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#111",borderRadius:"24px",padding:"40px 48px",textAlign:"center",border:"1px solid #2a2a2a"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"11px",color:"#555",letterSpacing:"4px",marginBottom:"8px"}}>{t.restLabel}</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"88px",color:"#c8f135",lineHeight:1}}>{left}s</div>
        <div style={{background:"#1a1a1a",borderRadius:"99px",height:"5px",margin:"18px 0",overflow:"hidden"}}>
          <div style={{height:"100%",width:pct+"%",background:"#c8f135",transition:"width 1s linear",borderRadius:"99px"}}/>
        </div>
        <button onClick={onDone} style={{background:"transparent",border:"1px solid #2a2a2a",color:"#555",borderRadius:"8px",padding:"8px 24px",cursor:"pointer"}}>{t.skipRest}</button>
      </div>
    </div>
  );
}

// ─── HISTORY DETAIL MODAL ─────────────────────────────────────────────────────
function HistoryModal({ h, onClose, t, lang }) {
  const muscles=[...new Set((h.rows||[]).filter(r=>r.type==="exercise").flatMap(r=>[r.muscle,r.muscle2]).filter(Boolean))];
  const lk=lang==="en"?"labelEn":"label";
  return (
    <div style={{position:"fixed",inset:0,background:"#000000dd",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#111",borderRadius:"20px 20px 0 0",padding:"24px 20px",width:"100%",maxWidth:"500px",maxHeight:"80vh",overflowY:"auto",border:"1px solid #2a2a2a"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
          <div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",color:"#c8f135"}}>{h.planName}</div>
            <div style={{fontSize:"11px",color:"#444"}}>{new Date(h.date).toLocaleDateString(lang==="es"?"es-AR":"en-US",{day:"2-digit",month:"long",year:"numeric"})}</div>
          </div>
          <button onClick={onClose} style={{background:"#1a1a1a",border:"1px solid #2a2a2a",color:"#888",borderRadius:"8px",padding:"6px 14px",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"1px"}}>{t.close}</button>
        </div>
        {h.duration&&(
          <div style={{background:"#0e0e0e",border:"1px solid #c8f13522",borderRadius:"10px",padding:"10px 14px",marginBottom:"14px",display:"flex",alignItems:"center",gap:"10px"}}>
            <span style={{color:"#c8f135",fontSize:"20px"}}>⏱</span>
            <div>
              <div style={{fontSize:"9px",color:"#555",letterSpacing:"2px",fontFamily:"'Bebas Neue',sans-serif"}}>{t.workoutTime}</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"24px",color:"#c8f135"}}>{fmtTime(h.duration)}</div>
            </div>
          </div>
        )}
        <div style={{display:"flex",flexWrap:"wrap",gap:"5px",marginBottom:"16px"}}>
          {muscles.map(m=>{const mg=MUSCLE_GROUPS.find(g=>g.id===m);return<span key={m} style={{fontSize:"10px",padding:"2px 8px",borderRadius:"99px",background:(MC[m]||"#333")+"20",color:MC[m]||"#666"}}>{mg?.[lk]||m}</span>;})}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
          {(h.rows||[]).filter(r=>r.type==="exercise").map((r,i)=>(
            <div key={i} style={{background:"#0e0e0e",borderLeft:`3px solid ${MC[r.muscle]||"#333"}`,borderRadius:"0 8px 8px 0",padding:"9px 12px"}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"14px",letterSpacing:"1px",marginBottom:"5px"}}>{r.name}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                {(r.sets||[]).map((s,si)=>(
                  <span key={si} style={{fontSize:"11px",color:"#888",background:"#161616",padding:"2px 8px",borderRadius:"6px"}}>
                    S{si+1}: {s.weight&&s.weight!=="—"?`${s.weight}kg `:""}×{s.reps||"?"}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,setScreen]             = useState("home");
  const [screenData,setScreenData]     = useState(null);
  const [lang,setLang]                 = useState(()=>S.get("lang")||"es");
  const [exercises,setExercises]       = useState(()=>S.get("exercises_v2")||DEFAULT_EXERCISES);
  const [plans,setPlans]               = useState(()=>S.get("plans_v3")||[]);
  const [history,setHistory]           = useState(()=>S.get("history_v2")||[]);
  const [lastWeights,setLastWeights]   = useState(()=>S.get("lastWeights")||{});
  const [profile,setProfile]           = useState(()=>S.get("profile")||{age:"",weight:"",height:"",gender:"female",trackWeight:false});
  const [weightLog,setWeightLog]       = useState(()=>S.get("weightLog")||[]);
  const [weightBanner,setWeightBanner] = useState(false);

  const t = T[lang];

  useEffect(()=>{
    if(!profile.trackWeight) return;
    const last=weightLog[weightLog.length-1];
    if(!last||(Date.now()-last.date)>=7*24*60*60*1000) setWeightBanner(true);
  },[]);

  const saveLang       = v=>{setLang(v);       S.set("lang",v);};
  const saveExercises  = v=>{setExercises(v);  S.set("exercises_v2",v);};
  const savePlans      = v=>{setPlans(v);      S.set("plans_v3",v);};
  const saveHistory    = v=>{setHistory(v);    S.set("history_v2",v);};
  const saveLastWeights= v=>{setLastWeights(v);S.set("lastWeights",v);};
  const saveProfile    = v=>{setProfile(v);    S.set("profile",v);};
  const saveWeightLog  = v=>{setWeightLog(v);  S.set("weightLog",v);};

  const goTo=(s,d=null)=>{setScreen(s);setScreenData(d);};
  const p={exercises,plans,history,lastWeights,profile,weightLog,lang,t,
           saveExercises,savePlans,saveHistory,saveLastWeights,saveProfile,saveWeightLog,saveLang,goTo};

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0a",color:"#f0f0f0"}}>
      {/* Weight reminder banner */}
      {weightBanner&&profile.trackWeight&&(
        <div style={{position:"sticky",top:0,zIndex:50,background:"#0a1a0a",borderBottom:"1px solid #10b98133",padding:"10px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:"13px",color:"#10b981"}}>{t.weightReminder}</span>
          <button onClick={()=>{setWeightBanner(false);goTo("personal");}} style={{background:"#10b981",color:"#000",border:"none",borderRadius:"6px",padding:"5px 12px",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"12px",letterSpacing:"1px",flexShrink:0,marginLeft:"10px"}}>
            {t.logWeight}
          </button>
        </div>
      )}
      {screen==="home"        && <HomeScreen {...p}/>}
      {screen==="newPlan"     && <PlanEditor {...p} editPlan={null}/>}
      {screen==="editPlan"    && <PlanEditor {...p} editPlan={screenData}/>}
      {screen==="newExercise" && <NewExerciseScreen {...p}/>}
      {screen==="doPlans"     && <DoPlansScreen {...p}/>}
      {screen==="analytics"   && <AnalyticsScreen {...p}/>}
      {screen==="personal"    && <PersonalScreen {...p} dismissBanner={()=>setWeightBanner(false)}/>}
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ goTo,history,plans,exercises,t,lang,saveLang }) {
  const [modal,setModal]=useState(null);
  return (
    <div style={{maxWidth:"500px",margin:"0 auto",padding:"32px 20px"}}>
      {modal&&<HistoryModal h={modal} onClose={()=>setModal(null)} t={t} lang={lang}/>}
      {/* Lang */}
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:"16px",gap:"6px"}}>
        {["es","en"].map(l=>(
          <button key={l} onClick={()=>saveLang(l)} style={{padding:"4px 10px",borderRadius:"6px",border:`1px solid ${lang===l?"#c8f135":"#1a1a1a"}`,background:lang===l?"#c8f13520":"transparent",color:lang===l?"#c8f135":"#444",cursor:"pointer",fontSize:"11px",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"1px"}}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{marginBottom:"32px"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"10px",letterSpacing:"4px",color:"#c8f135",marginBottom:"4px"}}>{t.appSub}</div>
        <h1 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"50px",margin:0,lineHeight:1}}>{t.title1}<br/><span style={{color:"#c8f135"}}>{t.title2}</span></h1>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"32px"}}>
        <MainBtn label={t.doPlan}       sub={t.doSub}          accent="#c8f135" onClick={()=>goTo("doPlans")}/>
        <MainBtn label={t.analytics}    sub={t.analyticsSub}   accent="#f97316" onClick={()=>goTo("analytics")}/>
        <MainBtn label={t.newPlan}      sub={t.newPlanSub}     accent="#a78bfa" onClick={()=>goTo("newPlan")}/>
        <MainBtn label={t.newExercise}  sub={t.newExerciseSub} accent="#06b6d4" onClick={()=>goTo("newExercise")}/>
        <MainBtn label={t.personalData} sub={t.personalDataSub}accent="#10b981" onClick={()=>goTo("personal")}/>
      </div>
      {plans.length>0&&(
        <div style={{marginBottom:"28px"}}>
          <SectionTitle>{t.yourPlans}</SectionTitle>
          <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
            {plans.map(p=>{
              const ms=[...new Set(p.rows.filter(r=>r.type==="exercise").flatMap(r=>{const ex=exercises.find(e=>e.id===r.exerciseId);return[ex?.muscle,ex?.muscle2].filter(Boolean);}))];
              return (
                <div key={p.id} style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"10px",padding:"11px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"15px",letterSpacing:"1px",color:"#c8f135"}}>{p.name}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"5px"}}>
                      {ms.slice(0,4).map(m=>{const mg=MUSCLE_GROUPS.find(g=>g.id===m);return<span key={m} style={{fontSize:"9px",padding:"1px 6px",borderRadius:"99px",background:(MC[m]||"#333")+"18",color:MC[m]||"#666"}}>{lang==="en"?mg?.labelEn:mg?.label}</span>;})}
                    </div>
                  </div>
                  <button onClick={()=>goTo("editPlan",p)} style={{background:"transparent",border:"1px solid #2a2a2a",color:"#666",borderRadius:"7px",padding:"6px 12px",cursor:"pointer",fontSize:"11px",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"1px",flexShrink:0,marginLeft:"10px"}}>{t.edit}</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div>
        <SectionTitle>{t.recentHistory}</SectionTitle>
        {history.length===0
          ?<div style={{color:"#222",fontSize:"13px",textAlign:"center",padding:"28px",border:"1px dashed #161616",borderRadius:"12px"}}>{t.noHistory}</div>
          :<div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
            {[...history].reverse().slice(0,5).map((h,i)=><HistoryCard key={i} h={h} onClick={()=>setModal(h)} lang={lang}/>)}
          </div>
        }
      </div>
    </div>
  );
}

function MainBtn({ label, sub, accent, onClick }) {
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{background:h?accent+"10":"#0e0e0e",border:`1px solid ${h?accent:"#1a1a1a"}`,borderRadius:"13px",padding:"18px 20px",cursor:"pointer",textAlign:"left",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",letterSpacing:"2px",color:h?accent:"#e8e8e8",transition:"color 0.2s"}}>{label}</div>
        <div style={{fontSize:"12px",color:h?accent:"#444",marginTop:"2px",transition:"color 0.2s"}}>{sub}</div>
      </div>
      <div style={{color:accent,fontSize:"20px",opacity:h?1:0.2,transition:"opacity 0.2s"}}>→</div>
    </button>
  );
}

function HistoryCard({ h, onClick, lang }) {
  const muscles=[...new Set((h.rows||[]).filter(r=>r.type==="exercise").flatMap(r=>[r.muscle,r.muscle2]).filter(Boolean))];
  return (
    <div onClick={onClick} style={{background:"#0e0e0e",border:"1px solid #161616",borderRadius:"9px",padding:"10px 14px",cursor:"pointer",transition:"border-color 0.2s"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor="#c8f13544"}
      onMouseLeave={e=>e.currentTarget.style.borderColor="#161616"}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"14px",letterSpacing:"1px",color:"#c8f135"}}>{h.planName}</div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          {h.duration&&<span style={{fontSize:"10px",color:"#555"}}>⏱ {fmtTime(h.duration)}</span>}
          <div style={{fontSize:"10px",color:"#333"}}>{new Date(h.date).toLocaleDateString(lang==="es"?"es-AR":"en-US",{day:"2-digit",month:"short"})}</div>
        </div>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:"4px",marginTop:"6px"}}>
        {muscles.slice(0,5).map(m=>{const mg=MUSCLE_GROUPS.find(g=>g.id===m);return<span key={m} style={{fontSize:"9px",padding:"1px 6px",borderRadius:"99px",background:(MC[m]||"#333")+"18",color:MC[m]||"#666"}}>{lang==="en"?mg?.labelEn:mg?.label}</span>;})}
      </div>
    </div>
  );
}

// ─── PERSONAL SCREEN ─────────────────────────────────────────────────────────
function PersonalScreen({ goTo,profile,saveProfile,weightLog,saveWeightLog,t,lang,dismissBanner }) {
  const [form,setForm]     = useState({...profile});
  const [newW,setNewW]     = useState("");
  const [savedOk,setSavedOk] = useState(false);

  const save=()=>{ saveProfile(form); setSavedOk(true); setTimeout(()=>setSavedOk(false),1500); };
  const logW=()=>{
    if(!newW) return;
    saveWeightLog([...weightLog,{date:Date.now(),weight:parseFloat(newW)}]);
    setNewW(""); dismissBanner();
  };

  return (
    <div style={{maxWidth:"500px",margin:"0 auto",padding:"24px 20px"}}>
      <TopBar title={t.personalTitle} onBack={()=>goTo("home")}/>
      <div style={{display:"flex",justifyContent:"center",marginBottom:"16px"}}>
        <BodyMap muscles={[]} gender={form.gender}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"13px",marginBottom:"24px"}}>
        <div>
          <Label>{t.gender}</Label>
          <div style={{display:"flex",gap:"10px"}}>
            <TypeBtn label={t.female} active={form.gender==="female"} onClick={()=>setForm(f=>({...f,gender:"female"}))} color="#f43f5e"/>
            <TypeBtn label={t.male}   active={form.gender==="male"}   onClick={()=>setForm(f=>({...f,gender:"male"}))}   color="#06b6d4"/>
          </div>
        </div>
        <div style={{display:"flex",gap:"10px"}}>
          <div style={{flex:1}}><Label>{t.age}</Label>    <input value={form.age}    onChange={e=>setForm(f=>({...f,age:e.target.value}))}    placeholder="25"  type="number" style={{...IS,fontSize:"16px"}}/></div>
          <div style={{flex:1}}><Label>{t.height}</Label> <input value={form.height} onChange={e=>setForm(f=>({...f,height:e.target.value}))} placeholder="170" type="number" style={{...IS,fontSize:"16px"}}/></div>
          <div style={{flex:1}}><Label>{t.weight}</Label> <input value={form.weight} onChange={e=>setForm(f=>({...f,weight:e.target.value}))} placeholder="70"  type="number" style={{...IS,fontSize:"16px"}}/></div>
        </div>
        <div onClick={()=>setForm(f=>({...f,trackWeight:!f.trackWeight}))}
          style={{background:form.trackWeight?"#0a1a0a":"#0e0e0e",border:`1px solid ${form.trackWeight?"#10b98144":"#1a1a1a"}`,borderRadius:"10px",padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:"12px",transition:"all 0.2s"}}>
          <div style={{width:"20px",height:"20px",borderRadius:"5px",border:`2px solid ${form.trackWeight?"#10b981":"#333"}`,background:form.trackWeight?"#10b981":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s"}}>
            {form.trackWeight&&<span style={{color:"#000",fontSize:"12px",fontWeight:"bold"}}>✓</span>}
          </div>
          <span style={{fontSize:"13px",color:form.trackWeight?"#10b981":"#555"}}>{t.trackWeight}</span>
        </div>
        <button onClick={save} style={{width:"100%",padding:"15px",borderRadius:"12px",background:savedOk?"#10b981":"#c8f135",color:savedOk?"#fff":"#0a0a0a",border:"none",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",letterSpacing:"2px",transition:"all 0.3s"}}>
          {savedOk?"✓ GUARDADO":t.saveData}
        </button>
      </div>
      {form.trackWeight&&(
        <div>
          <SectionTitle>{t.weightHistory}</SectionTitle>
          <div style={{display:"flex",gap:"8px",marginBottom:"14px"}}>
            <input value={newW} onChange={e=>setNewW(e.target.value)} placeholder="kg" type="number" style={{...IS,flex:1,fontSize:"16px"}}/>
            <button onClick={logW} style={{background:"#10b981",color:"#000",border:"none",borderRadius:"10px",padding:"0 18px",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"14px",letterSpacing:"1px",flexShrink:0}}>{t.logWeight}</button>
          </div>
          {weightLog.length===0
            ?<div style={{color:"#222",fontSize:"13px",textAlign:"center",padding:"20px",border:"1px dashed #161616",borderRadius:"10px"}}>Sin registros</div>
            :<div style={{display:"flex",flexDirection:"column",gap:"6px"}}>
              {[...weightLog].reverse().map((w,i)=>(
                <div key={i} style={{background:"#0e0e0e",border:"1px solid #161616",borderRadius:"8px",padding:"9px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"20px",color:"#10b981"}}>{w.weight} kg</span>
                  <span style={{fontSize:"11px",color:"#444"}}>{new Date(w.date).toLocaleDateString(lang==="es"?"es-AR":"en-US",{day:"2-digit",month:"short",year:"numeric"})}</span>
                </div>
              ))}
            </div>
          }
        </div>
      )}
    </div>
  );
}

// ─── PLAN EDITOR ──────────────────────────────────────────────────────────────
function PlanEditor({ goTo,exercises,plans,savePlans,editPlan,t,lang }) {
  const isEdit=!!editPlan;
  const [planName,setPlanName]=useState(editPlan?.name||"");
  const [rows,setRows]=useState(editPlan?.rows?editPlan.rows.map(r=>({...r,id:r.id||Date.now()+Math.random()})):[]);
  const gk=lang==="en"?"categoryEn":"category", lk=lang==="en"?"labelEn":"label";
  const cats=[...new Set(MUSCLE_GROUPS.map(g=>g[gk]))];

  const addEx  =()=>setRows(r=>[...r,{id:Date.now(),type:"exercise",muscleFilter:"cuadriceps",exerciseId:"",sets:"3",reps:"12",weight:""}]);
  const addRest=()=>setRows(r=>[...r,{id:Date.now(),type:"rest",duration:30}]);
  const removeRow=id=>setRows(r=>r.filter(x=>x.id!==id));
  const updateRow=(id,f,v)=>setRows(r=>r.map(x=>{if(x.id!==id)return x;const u={...x,[f]:v};if(f==="muscleFilter")u.exerciseId="";return u;}));

  const activeMuscles=()=>{const ms=[];rows.filter(r=>r.type==="exercise"&&r.exerciseId).forEach(r=>{const ex=exercises.find(e=>e.id===r.exerciseId);if(ex){ms.push(ex.muscle);if(ex.muscle2)ms.push(ex.muscle2);}});return[...new Set(ms)];};

  const save=()=>{
    if(!planName.trim()||rows.length===0) return;
    const updated=isEdit?plans.map(p=>p.id===editPlan.id?{...p,name:planName.trim(),rows}:p):[...plans,{id:"p"+Date.now(),name:planName.trim(),rows,createdAt:Date.now()}];
    savePlans(updated); goTo("home");
  };
  const del=()=>{if(!window.confirm(t.confirmDelete))return;savePlans(plans.filter(p=>p.id!==editPlan.id));goTo("home");};

  return (
    <div style={{maxWidth:"500px",margin:"0 auto",padding:"24px 20px"}}>
      <TopBar title={isEdit?t.editPlan:t.newPlan} onBack={()=>goTo("home")}/>
      <input value={planName} onChange={e=>setPlanName(e.target.value)} placeholder={t.planName} style={IS}/>
      {activeMuscles().length>0&&<BodyMap muscles={activeMuscles()}/>}
      <div style={{display:"flex",flexDirection:"column",gap:"10px",margin:"14px 0"}}>
        {rows.map((row,i)=>row.type==="exercise"
          ?<ExRow key={row.id} row={row} exercises={exercises} index={i+1} onUpdate={(f,v)=>updateRow(row.id,f,v)} onRemove={()=>removeRow(row.id)} cats={cats} t={t} gk={gk} lk={lk}/>
          :<RestRow key={row.id} row={row} onUpdate={(f,v)=>updateRow(row.id,f,v)} onRemove={()=>removeRow(row.id)} t={t}/>
        )}
      </div>
      <div style={{display:"flex",gap:"10px",marginBottom:"20px"}}>
        <AddBtn label={t.addExercise} onClick={addEx}   color="#c8f135"/>
        <AddBtn label={t.addRest}     onClick={addRest} color="#06b6d4"/>
      </div>
      <button onClick={save} disabled={!planName.trim()||rows.length===0}
        style={{width:"100%",padding:"15px",borderRadius:"12px",background:planName.trim()&&rows.length>0?"#c8f135":"#161616",color:planName.trim()&&rows.length>0?"#0a0a0a":"#333",border:"none",cursor:planName.trim()&&rows.length>0?"pointer":"default",fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",letterSpacing:"2px"}}>
        {isEdit?t.saveChanges:t.savePlan}
      </button>
      {isEdit&&(
        <button onClick={del} style={{width:"100%",padding:"12px",marginTop:"10px",borderRadius:"12px",background:"transparent",color:"#f43f5e44",border:"1px solid #f43f5e22",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"15px",letterSpacing:"2px"}}
          onMouseEnter={e=>{e.currentTarget.style.color="#f43f5e";e.currentTarget.style.borderColor="#f43f5e55";}}
          onMouseLeave={e=>{e.currentTarget.style.color="#f43f5e44";e.currentTarget.style.borderColor="#f43f5e22";}}>
          {t.deletePlan}
        </button>
      )}
    </div>
  );
}

function ExRow({ row,exercises,onUpdate,onRemove,index,cats,t,gk,lk }) {
  const filtered=exercises.filter(e=>e.muscle===row.muscleFilter||e.muscle2===row.muscleFilter);
  const selected=exercises.find(e=>e.id===row.exerciseId);
  const accent=MC[row.muscleFilter]||"#333";
  return (
    <div style={{background:"#0e0e0e",border:`1px solid ${accent}33`,borderRadius:"12px",padding:"13px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"9px"}}>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"11px",color:"#444",letterSpacing:"2px"}}>{t.exerciseN} {index}</span>
        <button onClick={onRemove} style={{background:"none",border:"none",color:"#f43f5e",cursor:"pointer",fontSize:"15px"}}>✕</button>
      </div>
      <div style={{display:"flex",gap:"7px",marginBottom:"9px",flexWrap:"wrap"}}>
        <select value={row.muscleFilter} onChange={e=>onUpdate("muscleFilter",e.target.value)} style={SS}>
          {cats.map(cat=><optgroup key={cat} label={cat}>{MUSCLE_GROUPS.filter(g=>g[gk]===cat).map(g=><option key={g.id} value={g.id}>{g[lk]}</option>)}</optgroup>)}
        </select>
        <select value={row.exerciseId} onChange={e=>onUpdate("exerciseId",e.target.value)} style={{...SS,flex:1,minWidth:"130px"}}>
          <option value="">{t.pick}</option>
          {filtered.map(e=><option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      {selected?.desc&&<div style={{fontSize:"11px",color:"#444",marginBottom:"9px"}}>{selected.desc}</div>}
      <div style={{display:"flex",gap:"7px"}}>
        <div style={{flex:1}}>
          <div style={{fontSize:"9px",color:"#333",marginBottom:"3px",letterSpacing:"1px"}}>{t.sets}</div>
          <select value={row.sets} onChange={e=>onUpdate("sets",e.target.value)} style={{...SS,width:"100%",boxSizing:"border-box"}}>
            {["1","2","3","4","5","6"].map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:"9px",color:"#333",marginBottom:"3px",letterSpacing:"1px"}}>{t.reps}</div>
          <select value={row.reps} onChange={e=>onUpdate("reps",e.target.value)} style={{...SS,width:"100%",boxSizing:"border-box"}}>
            {REPS_OPTIONS.map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        {(!selected||selected.weighted)&&(
          <div style={{flex:1}}>
            <div style={{fontSize:"9px",color:"#333",marginBottom:"3px",letterSpacing:"1px"}}>{t.kg}</div>
            <select value={row.weight||"—"} onChange={e=>onUpdate("weight",e.target.value==="—"?"":e.target.value)} style={{...SS,width:"100%",boxSizing:"border-box"}}>
              {WEIGHT_OPTIONS.map(n=><option key={n} value={n}>{n==="—"?"—":n+" kg"}</option>)}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}

function RestRow({ row,onUpdate,onRemove,t }) {
  return (
    <div style={{background:"#0a1414",border:"1px solid #06b6d420",borderRadius:"12px",padding:"13px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
        <span style={{color:"#06b6d4"}}>⏱</span>
        <span style={{fontFamily:"'Bebas Neue',sans-serif",color:"#06b6d4",letterSpacing:"1px",fontSize:"15px"}}>{t.restLabel}</span>
        <select value={row.duration} onChange={e=>onUpdate("duration",Number(e.target.value))} style={{...SS,color:"#06b6d4",border:"1px solid #06b6d430"}}>
          <option value={15}>15s</option><option value={30}>30s</option><option value={45}>45s</option><option value={60}>1 min</option>
        </select>
      </div>
      <button onClick={onRemove} style={{background:"none",border:"none",color:"#f43f5e",cursor:"pointer",fontSize:"15px"}}>✕</button>
    </div>
  );
}

// ─── NEW EXERCISE ─────────────────────────────────────────────────────────────
function NewExerciseScreen({ goTo,exercises,saveExercises,t,lang }) {
  const [name,setName]=[useState(""),v=>setName(v)][Symbol.iterator]?useState(""):useState("");
  const [nm,setNm]=useState(""); const [mu,setMu]=useState("cuadriceps"); const [mu2,setMu2]=useState("");
  const [w,setW]=useState(true); const [desc,setDesc]=useState(""); const [ok,setOk]=useState(false);
  const gk=lang==="en"?"categoryEn":"category", lk=lang==="en"?"labelEn":"label";
  const cats=[...new Set(MUSCLE_GROUPS.map(g=>g[gk]))];
  const save=()=>{if(!nm.trim())return;saveExercises([...exercises,{id:"e"+Date.now(),name:nm.trim(),muscle:mu,muscle2:mu2||null,weighted:w,desc}]);setOk(true);setTimeout(()=>{setOk(false);setNm("");setDesc("");setMu2("");},1500);};
  return (
    <div style={{maxWidth:"500px",margin:"0 auto",padding:"24px 20px"}}>
      <TopBar title={t.newExercise} onBack={()=>goTo("home")}/>
      <div style={{display:"flex",flexDirection:"column",gap:"13px"}}>
        <div><Label>{t.exerciseName}</Label><input value={nm} onChange={e=>setNm(e.target.value)} placeholder="Ej: Curl predicador" style={{...IS,fontSize:"16px"}}/></div>
        <div><Label>{t.descLabel}</Label><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Cómo se hace" style={{...IS,fontSize:"16px"}}/></div>
        <div style={{display:"flex",gap:"10px"}}>
          <div style={{flex:1}}><Label>{t.muscleMain}</Label>
            <select value={mu} onChange={e=>setMu(e.target.value)} style={{...IS,cursor:"pointer"}}>
              {cats.map(cat=><optgroup key={cat} label={cat}>{MUSCLE_GROUPS.filter(g=>g[gk]===cat).map(g=><option key={g.id} value={g.id}>{g[lk]}</option>)}</optgroup>)}
            </select>
          </div>
          <div style={{flex:1}}><Label>{t.muscleSecond}</Label>
            <select value={mu2} onChange={e=>setMu2(e.target.value)} style={{...IS,cursor:"pointer"}}>
              <option value="">{t.none}</option>
              {cats.map(cat=><optgroup key={cat} label={cat}>{MUSCLE_GROUPS.filter(g=>g[gk]===cat).map(g=><option key={g.id} value={g.id}>{g[lk]}</option>)}</optgroup>)}
            </select>
          </div>
        </div>
        <div><Label>{t.weighted}</Label>
          <div style={{display:"flex",gap:"10px"}}>
            <TypeBtn label={t.weighted}   active={w}  onClick={()=>setW(true)}  color="#c8f135"/>
            <TypeBtn label={t.bodyweight} active={!w} onClick={()=>setW(false)} color="#a78bfa"/>
          </div>
        </div>
        <button onClick={save} disabled={!nm.trim()} style={{width:"100%",padding:"15px",borderRadius:"12px",background:ok?"#10b981":nm.trim()?"#c8f135":"#161616",color:ok?"#fff":nm.trim()?"#0a0a0a":"#333",border:"none",cursor:nm.trim()?"pointer":"default",fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",letterSpacing:"2px",transition:"all 0.3s"}}>
          {ok?t.saved:t.saveExercise}
        </button>
      </div>
      <div style={{marginTop:"28px"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"12px",letterSpacing:"3px",color:"#333",marginBottom:"10px"}}>{t.base} ({exercises.length} {t.exercises})</div>
        {cats.map(cat=>{
          const exs=exercises.filter(e=>MUSCLE_GROUPS.find(g=>g.id===e.muscle)?.[gk]===cat);
          if(!exs.length)return null;
          return(<div key={cat} style={{marginBottom:"10px"}}>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"3px",fontFamily:"'Bebas Neue',sans-serif",marginBottom:"5px"}}>{cat.toUpperCase()}</div>
            {exs.map(e=>(<div key={e.id} style={{background:"#0e0e0e",borderLeft:`3px solid ${MC[e.muscle]||"#333"}`,borderRadius:"0 7px 7px 0",padding:"7px 11px",marginBottom:"3px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><div style={{fontSize:"13px",color:"#ddd"}}>{e.name}</div>{e.desc&&<div style={{fontSize:"10px",color:"#3a3a3a",marginTop:"1px"}}>{e.desc}</div>}</div>
              <span style={{fontSize:"9px",padding:"1px 6px",borderRadius:"99px",background:(MC[e.muscle]||"#333")+"20",color:MC[e.muscle]||"#666",flexShrink:0,marginLeft:"8px"}}>{MUSCLE_GROUPS.find(g=>g.id===e.muscle)?.[lk]}</span>
            </div>))}
          </div>);
        })}
      </div>
    </div>
  );
}

// ─── DO PLANS ─────────────────────────────────────────────────────────────────
function DoPlansScreen({ goTo,plans,exercises,history,saveHistory,lastWeights,saveLastWeights,profile,t,lang }) {
  const [selected,setSelected]     = useState(null);
  const [sessionRows,setSessionRows] = useState([]);
  const [restTimer,setRestTimer]   = useState(null);
  const [done,setDone]             = useState(false);
  const [duration,setDuration]     = useState(null);
  const [elapsed,setElapsed]       = useState(0);
  const startRef                   = useRef(null);
  const timerRef                   = useRef(null);
  const lk=lang==="en"?"labelEn":"label";

  const startPlan=plan=>{
    setSelected(plan);
    startRef.current=Date.now(); setElapsed(0);
    timerRef.current=setInterval(()=>setElapsed(Date.now()-startRef.current),1000);
    setSessionRows(plan.rows.map(r=>{
      if(r.type!=="exercise")return r;
      const prev=lastWeights[r.exerciseId];
      return{...r,prevSets:prev?.sets||null,
        sessionSets:Array.from({length:Math.max(Number(r.sets)||1,1)},(_,i)=>({
          weight:prev?.sets?.[i]?.weight||r.weight||"",
          reps:prev?.sets?.[i]?.reps||r.reps||"12",
          done:false,
        }))
      };
    }));
    setDone(false);
  };

  useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current);},[]);

  const updateSet=(rid,si,f,v)=>setSessionRows(rows=>rows.map(r=>{if(r.id!==rid)return r;return{...r,sessionSets:r.sessionSets.map((s,i)=>i===si?{...s,[f]:v}:s)};}));
  const toggleSet=(rid,si)=>setSessionRows(rows=>rows.map(r=>{if(r.id!==rid)return r;return{...r,sessionSets:r.sessionSets.map((s,i)=>i===si?{...s,done:!s.done}:s)};}));

  const finish=()=>{
    clearInterval(timerRef.current);
    const dur=Date.now()-startRef.current; setDuration(dur);
    const newLW={...lastWeights};
    sessionRows.filter(r=>r.type==="exercise"&&r.exerciseId).forEach(r=>{newLW[r.exerciseId]={sets:r.sessionSets.map(s=>({weight:s.weight,reps:s.reps}))};});
    saveLastWeights(newLW);
    saveHistory([...history,{
      planName:selected.name,date:Date.now(),duration:dur,
      rows:sessionRows.map(r=>{
        if(r.type!=="exercise")return r;
        const ex=exercises.find(e=>e.id===r.exerciseId);
        return{type:"exercise",muscle:ex?.muscle||r.muscleFilter,muscle2:ex?.muscle2,exerciseId:r.exerciseId,name:ex?.name||"",sets:r.sessionSets};
      })
    }]);
    setDone(true);
  };

  if(!selected){
    return(
      <div style={{maxWidth:"500px",margin:"0 auto",padding:"24px 20px"}}>
        <TopBar title={t.doPlan} onBack={()=>goTo("home")}/>
        {plans.length===0
          ?<div style={{color:"#2a2a2a",textAlign:"center",padding:"48px",border:"1px dashed #161616",borderRadius:"12px",fontSize:"13px"}}>
            {t.noPlans}<br/><span style={{color:"#c8f135",cursor:"pointer"}} onClick={()=>goTo("newPlan")}>{t.createOne}</span>
           </div>
          :<div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
            {plans.map(p=>{
              const ms=[...new Set(p.rows.filter(r=>r.type==="exercise").flatMap(r=>{const ex=exercises.find(e=>e.id===r.exerciseId);return[ex?.muscle,ex?.muscle2].filter(Boolean);}))];
              return(
                <button key={p.id} onClick={()=>startPlan(p)} style={{background:"#0e0e0e",border:"1px solid #161616",borderRadius:"14px",padding:"18px",cursor:"pointer",textAlign:"left",transition:"border-color 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor="#c8f13555"}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#161616"}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",letterSpacing:"1px",marginBottom:"10px",color:"#c8f135"}}>{p.name}</div>
                  <BodyMap muscles={ms} gender={profile.gender}/>
                  <div style={{fontSize:"11px",color:"#333",marginTop:"6px"}}>{p.rows.filter(r=>r.type==="exercise").length} {t.exercises}</div>
                </button>
              );
            })}
           </div>
        }
      </div>
    );
  }

  if(done){
    return(
      <div style={{maxWidth:"500px",margin:"0 auto",padding:"24px 20px",textAlign:"center",paddingTop:"80px"}}>
        <div style={{fontSize:"64px",marginBottom:"12px"}}>🏋️</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"40px",color:"#c8f135",letterSpacing:"2px",lineHeight:1.1}}>{t.workoutDone}</div>
        <div style={{color:"#444",marginTop:"10px",fontSize:"14px"}}>{selected.name}</div>
        {duration&&<div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"38px",color:"#c8f135",margin:"16px 0"}}>⏱ {fmtTime(duration)}</div>}
        <button onClick={()=>goTo("home")} style={{marginTop:"20px",background:"#c8f135",color:"#0a0a0a",border:"none",borderRadius:"12px",padding:"14px 40px",fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",letterSpacing:"2px",cursor:"pointer"}}>
          {t.finish}
        </button>
      </div>
    );
  }

  const activeMuscles=[...new Set(sessionRows.filter(r=>r.type==="exercise").flatMap(r=>{const ex=exercises.find(e=>e.id===r.exerciseId);return[ex?.muscle,ex?.muscle2].filter(Boolean);}))];

  return(
    <div style={{maxWidth:"500px",margin:"0 auto",padding:"24px 20px"}}>
      {restTimer&&<RestTimer seconds={restTimer} onDone={()=>setRestTimer(null)} t={t}/>}
      <TopBar title={selected.name} onBack={()=>{clearInterval(timerRef.current);setSelected(null);}}
        right={<span style={{fontFamily:"'Bebas Neue',sans-serif",color:"#c8f135",fontSize:"18px"}}>⏱ {fmtTime(elapsed)}</span>}/>
      <BodyMap muscles={activeMuscles} gender={profile.gender}/>
      <div style={{display:"flex",flexDirection:"column",gap:"10px",margin:"12px 0 22px"}}>
        {sessionRows.map(row=>{
          if(row.type==="rest")return(
            <button key={row.id} onClick={()=>setRestTimer(row.duration)} style={{background:"#0a1414",border:"1px solid #06b6d420",borderRadius:"12px",padding:"13px 16px",display:"flex",alignItems:"center",gap:"10px",cursor:"pointer"}}>
              <span style={{color:"#06b6d4"}}>⏱</span>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",color:"#06b6d4",letterSpacing:"1px"}}>{t.restLabel} · {row.duration}s</span>
            </button>
          );
          const ex=exercises.find(e=>e.id===row.exerciseId);
          return(
            <div key={row.id} style={{background:"#0e0e0e",border:`1px solid ${MC[ex?.muscle]||"#1a1a1a"}20`,borderRadius:"12px",padding:"13px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"3px"}}>
                <span style={{width:"7px",height:"7px",borderRadius:"50%",background:MC[ex?.muscle]||"#444",display:"inline-block",flexShrink:0}}/>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"16px",letterSpacing:"1px"}}>{ex?.name||"Ejercicio"}</span>
              </div>
              {ex?.desc&&<div style={{fontSize:"11px",color:"#333",marginBottom:"9px",paddingLeft:"14px"}}>{ex.desc}</div>}
              {row.prevSets&&(
                <div style={{background:"#0a1a0a",border:"1px solid #10b98120",borderRadius:"8px",padding:"7px 10px",marginBottom:"9px",fontSize:"11px",color:"#10b981"}}>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"1px",fontSize:"10px",opacity:0.7,marginRight:"6px"}}>{t.lastTime}</span>
                  {row.prevSets.map((s,i)=><span key={i} style={{marginRight:"10px"}}>S{i+1}: {s.weight&&s.weight!=="—"?`${s.weight}kg `:""}×{s.reps||"?"}</span>)}
                </div>
              )}
              <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
                {row.sessionSets.map((s,si)=>(
                  <div key={si} style={{display:"flex",alignItems:"center",gap:"7px"}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",color:"#333",fontSize:"13px",width:"22px",flexShrink:0}}>S{si+1}</span>
                    {ex?.weighted!==false&&(
                      <select value={s.weight||"—"} onChange={e=>updateSet(row.id,si,"weight",e.target.value==="—"?"":e.target.value)} style={{...SS,flex:1}}>
                        {WEIGHT_OPTIONS.map(n=><option key={n} value={n}>{n==="—"?"— kg":n+" kg"}</option>)}
                      </select>
                    )}
                    <select value={s.reps||"12"} onChange={e=>updateSet(row.id,si,"reps",e.target.value)} style={{...SS,flex:1}}>
                      {REPS_OPTIONS.map(n=><option key={n} value={n}>{n} reps</option>)}
                    </select>
                    <button onClick={()=>toggleSet(row.id,si)} style={{width:"32px",height:"32px",borderRadius:"50%",border:`2px solid ${s.done?"#c8f135":"#222"}`,background:s.done?"#c8f13515":"transparent",cursor:"pointer",color:s.done?"#c8f135":"#2a2a2a",fontSize:"15px",flexShrink:0,transition:"all 0.15s"}}>✓</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={finish} style={{width:"100%",padding:"15px",borderRadius:"12px",background:"#c8f135",color:"#0a0a0a",border:"none",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",letterSpacing:"2px"}}>
        {t.finishWorkout}
      </button>
    </div>
  );
}

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsScreen({ goTo,history,profile,weightLog,t,lang }) {
  const [range,setRange]=useState(30);
  const [modal,setModal]=useState(null);
  const cutoff=Date.now()-range*24*60*60*1000;
  const filtered=history.filter(h=>h.date>=cutoff);
  const lk=lang==="en"?"labelEn":"label";

  const heatmap={};
  filtered.forEach(h=>{(h.rows||[]).filter(r=>r.type==="exercise").forEach(r=>{if(r.muscle)heatmap[r.muscle]=(heatmap[r.muscle]||0)+1;if(r.muscle2)heatmap[r.muscle2]=(heatmap[r.muscle2]||0)+1;});});

  const muscleRanking=MUSCLE_GROUPS.map(g=>({...g,count:heatmap[g.id]||0})).sort((a,b)=>b.count-a.count);
  const maxCount=Math.max(...muscleRanking.map(m=>m.count),1);

  const today=new Date(); today.setHours(0,0,0,0);
  const sow=new Date(today); sow.setDate(today.getDate()-today.getDay());
  const weeks=[];
  for(let w=11;w>=0;w--){const week=[];for(let d=0;d<7;d++){const day=new Date(sow);day.setDate(sow.getDate()-w*7+d);const ts=day.getTime();const trained=history.some(h=>{const hd=new Date(h.date);hd.setHours(0,0,0,0);return hd.getTime()===ts;});week.push({date:day,trained,isFuture:day>today});}weeks.push(week);}

  const totalSessions=filtered.length;
  const trainedDays=new Set(filtered.map(h=>{const d=new Date(h.date);d.setHours(0,0,0,0);return d.getTime();})).size;
  const totalEx=filtered.reduce((a,h)=>a+(h.rows||[]).filter(r=>r.type==="exercise").length,0);
  let streak=0,chk=new Date(today);while(true){const ts=chk.getTime();const f=history.some(h=>{const hd=new Date(h.date);hd.setHours(0,0,0,0);return hd.getTime()===ts;});if(!f)break;streak++;chk.setDate(chk.getDate()-1);}

  // Avg time per plan
  const planTimes={};
  history.forEach(h=>{if(!h.duration)return;if(!planTimes[h.planName])planTimes[h.planName]=[];planTimes[h.planName].push(h.duration);});
  const withTime=history.filter(h=>h.duration);
  const overallAvg=withTime.length>0?withTime.reduce((a,h)=>a+h.duration,0)/withTime.length:0;

  return(
    <div style={{maxWidth:"500px",margin:"0 auto",padding:"24px 20px"}}>
      {modal&&<HistoryModal h={modal} onClose={()=>setModal(null)} t={t} lang={lang}/>}
      <TopBar title={t.analytics} onBack={()=>goTo("home")}/>

      {/* Range */}
      <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>
        {[7,30,90].map(r=>(
          <button key={r} onClick={()=>setRange(r)} style={{flex:1,padding:"9px",borderRadius:"8px",border:`1px solid ${range===r?"#c8f135":"#1a1a1a"}`,background:range===r?"#c8f13515":"transparent",color:range===r?"#c8f135":"#444",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"13px",letterSpacing:"1px"}}>
            {r===7?t.days7:r===30?t.days30:t.months3}
          </button>
        ))}
      </div>

      {/* Stats row */}
      <div style={{display:"flex",gap:"8px",marginBottom:"20px"}}>
        {[{l:t.sessions,v:totalSessions},{l:t.days,v:trainedDays},{l:t.exercisesCount,v:totalEx},{l:t.streak,v:`${streak}🔥`}].map(s=>(
          <div key={s.l} style={{flex:1,background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"10px",padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"26px",color:"#c8f135",lineHeight:1}}>{s.v}</div>
            <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginTop:"4px"}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Avg time */}
      <div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"12px",padding:"16px",marginBottom:"20px"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"12px",letterSpacing:"3px",color:"#444",marginBottom:"12px"}}>{t.avgTime}</div>
        {Object.keys(planTimes).length===0
          ?<div style={{color:"#2a2a2a",fontSize:"13px"}}>{t.noTime}</div>
          :<>
            {Object.entries(planTimes).map(([name,times])=>{
              const avg=times.reduce((a,b)=>a+b,0)/times.length;
              return(<div key={name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                <span style={{fontSize:"12px",color:"#ccc"}}>{name}</span>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"18px",color:"#c8f135"}}>{fmtTime(avg)}</span>
              </div>);
            })}
            <div style={{borderTop:"1px solid #1a1a1a",paddingTop:"10px",marginTop:"4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"12px",color:"#888",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:"1px"}}>{t.avgGeneral}</span>
              <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"22px",color:"#f97316"}}>{fmtTime(overallAvg)}</span>
            </div>
          </>
        }
      </div>

      {/* Calendar */}
      <div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"12px",padding:"16px",marginBottom:"20px"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"12px",letterSpacing:"3px",color:"#444",marginBottom:"12px"}}>{t.trainedDays}</div>
        <div style={{display:"flex",gap:"3px",overflowX:"auto"}}>
          {weeks.map((week,wi)=>(
            <div key={wi} style={{display:"flex",flexDirection:"column",gap:"3px"}}>
              {week.map((day,di)=><div key={di} style={{width:"14px",height:"14px",borderRadius:"3px",background:day.isFuture?"transparent":day.trained?"#c8f135":"#1a1a1a",border:day.isFuture?"none":"1px solid #222",opacity:day.isFuture?0:1}}/>)}
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:"4px",marginTop:"8px",justifyContent:"flex-end",alignItems:"center"}}>
          <div style={{width:"10px",height:"10px",borderRadius:"2px",background:"#1a1a1a",border:"1px solid #222"}}/><span style={{fontSize:"9px",color:"#444",marginRight:"8px"}}>—</span>
          <div style={{width:"10px",height:"10px",borderRadius:"2px",background:"#c8f135"}}/><span style={{fontSize:"9px",color:"#444"}}>✓</span>
        </div>
      </div>

      {/* Heatmap */}
      <div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"12px",padding:"16px",marginBottom:"20px"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"12px",letterSpacing:"3px",color:"#444",marginBottom:"4px"}}>{t.heatmapTitle}</div>
        <div style={{fontSize:"11px",color:"#333",marginBottom:"8px"}}>{t.heatmapSub}</div>
        {Object.keys(heatmap).length===0
          ?<div style={{textAlign:"center",color:"#2a2a2a",fontSize:"13px",padding:"24px"}}>{t.noData}</div>
          :<BodyMap heatmap={heatmap} gender={profile.gender}/>
        }
      </div>

      {/* Muscle ranking */}
      <div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"12px",padding:"16px",marginBottom:"20px"}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"12px",letterSpacing:"3px",color:"#444",marginBottom:"14px"}}>{t.rankingTitle}</div>
        {muscleRanking.filter(m=>m.count>0).length===0
          ?<div style={{textAlign:"center",color:"#2a2a2a",fontSize:"13px",padding:"16px"}}>{t.noData}</div>
          :<div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {muscleRanking.filter(m=>m.count>0).map((m,i)=>(
              <div key={m.id}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",color:"#444",fontSize:"12px",width:"18px"}}>#{i+1}</span>
                    <div style={{width:"8px",height:"8px",borderRadius:"2px",background:MC[m.id]||"#555"}}/>
                    <span style={{fontSize:"13px",color:"#ccc"}}>{m[lk]}</span>
                  </div>
                  <span style={{fontSize:"12px",color:MC[m.id]||"#555",fontFamily:"'Bebas Neue',sans-serif"}}>{m.count}x</span>
                </div>
                <div style={{background:"#161616",borderRadius:"99px",height:"4px",overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(m.count/maxCount)*100}%`,background:MC[m.id]||"#555",borderRadius:"99px"}}/>
                </div>
              </div>
            ))}
          </div>
        }
        {muscleRanking.filter(m=>m.count===0).length>0&&(
          <div style={{marginTop:"16px",paddingTop:"16px",borderTop:"1px solid #161616"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"10px",letterSpacing:"2px",color:"#444",marginBottom:"8px"}}>{t.noWorked}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
              {muscleRanking.filter(m=>m.count===0).map(m=><span key={m.id} style={{fontSize:"10px",padding:"3px 9px",borderRadius:"99px",background:"#1a1a1a",color:"#555",border:"1px solid #222"}}>{m[lk]}</span>)}
            </div>
          </div>
        )}
      </div>

      {/* Weight chart */}
      {weightLog.length>1&&(
        <div style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"12px",padding:"16px",marginBottom:"20px"}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"12px",letterSpacing:"3px",color:"#444",marginBottom:"14px"}}>{t.weightHistory}</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:"4px",height:"80px"}}>
            {weightLog.slice(-12).map((w,i)=>{
              const vals=weightLog.slice(-12).map(x=>x.weight);
              const mn=Math.min(...vals),mx=Math.max(...vals);
              const h=mx===mn?50:((w.weight-mn)/(mx-mn))*68+12;
              return(<div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
                <span style={{fontSize:"8px",color:"#c8f135"}}>{w.weight}</span>
                <div style={{width:"100%",height:`${h}px`,background:"#c8f13530",borderRadius:"3px 3px 0 0",border:"1px solid #c8f13560"}}/>
              </div>);
            })}
          </div>
        </div>
      )}

      {/* Full history - clickable */}
      {history.length>0&&(
        <div>
          <SectionTitle>{t.fullHistory}</SectionTitle>
          <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
            {[...history].reverse().map((h,i)=><HistoryCard key={i} h={h} onClick={()=>setModal(h)} lang={lang}/>)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────
function TopBar({ title, onBack, right }) {
  return(
    <div style={{display:"flex",alignItems:"center",gap:"11px",marginBottom:"26px"}}>
      <button onClick={onBack} style={{background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"8px",width:"34px",height:"34px",cursor:"pointer",color:"#e0e0e0",fontSize:"15px",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>←</button>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"19px",letterSpacing:"2px",flex:1}}>{title}</div>
      {right&&<div>{right}</div>}
    </div>
  );
}
function SectionTitle({ children }) {
  return <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:"13px",letterSpacing:"3px",color:"#c8f135",marginBottom:"10px"}}>{children}</div>;
}
function Label({ children }) {
  return <div style={{fontSize:"9px",color:"#444",letterSpacing:"2px",marginBottom:"5px",fontFamily:"'Bebas Neue',sans-serif"}}>{children}</div>;
}
function AddBtn({ label, onClick, color }) {
  return(
    <button onClick={onClick} style={{flex:1,padding:"11px",borderRadius:"9px",background:"transparent",border:`1px solid ${color}33`,color,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"13px",letterSpacing:"1px",transition:"background 0.2s"}}
      onMouseEnter={e=>e.currentTarget.style.background=color+"0e"}
      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      {label}
    </button>
  );
}
function TypeBtn({ label, active, onClick, color }) {
  return(
    <button onClick={onClick} style={{flex:1,padding:"11px",borderRadius:"9px",background:active?color+"15":"transparent",border:`1px solid ${active?color:"#1e1e1e"}`,color:active?color:"#333",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:"13px",letterSpacing:"1px",transition:"all 0.2s"}}>
      {label}
    </button>
  );
}
const IS={width:"100%",boxSizing:"border-box",background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"10px",padding:"11px 13px",color:"#e8e8e8",fontSize:"13px",outline:"none",fontFamily:"'DM Sans',sans-serif"};
const SS={background:"#0e0e0e",border:"1px solid #1a1a1a",borderRadius:"7px",padding:"7px 9px",color:"#e0e0e0",fontSize:"12px",outline:"none",fontFamily:"'DM Sans',sans-serif",cursor:"pointer"};
