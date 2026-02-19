# 🏋️ Workout Tracker

App personal para armar rutinas de gym, registrar pesos y analizar progreso.

## Cómo correr localmente

Necesitás tener [Node.js](https://nodejs.org/) instalado (versión 18 o superior).

```bash
# 1. Instalá las dependencias
npm install

# 2. Corré el servidor de desarrollo
npm run dev
```

Luego abrí http://localhost:5173 en tu navegador.

## Cómo hacer el build para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para deployar.

## Deploy en Vercel

1. Subí este repo a GitHub
2. Entrá a [vercel.com](https://vercel.com) y conectá tu cuenta de GitHub
3. Importá el repositorio
4. Vercel detecta automáticamente que es un proyecto Vite/React
5. Click en Deploy — listo!

## Features

- 📋 Crear y editar planes de entrenamiento
- 💪 Base de 42 ejercicios con grupos musculares
- 🗺️ Mapa corporal SVG que muestra músculos activos
- ⏱️ Timer de descanso entre series
- 📊 Pantalla de análisis con mapa de calor muscular
- 📅 Historial de entrenamientos con calendario
- 🔁 Memoria de pesos de la sesión anterior
- 💾 Datos guardados en localStorage (por dispositivo)
