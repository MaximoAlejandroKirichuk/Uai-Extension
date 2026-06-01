# Uai-Extension

Uai-Extension es un frontend institucional de UAI que centraliza listados y dashboards para multiples categorias del ecosistema: universidades, crowfunding, capital ventures, plataformas, organismos del estado, eventos e incubadoras. La aplicacion consume datos desde Firebase y utiliza autenticacion con Firebase Auth.

## Funcionalidades
- Navegacion por categorias con dashboards dedicados.
- Busqueda y gestion de registros en los listados disponibles.
- Integracion con Firebase (Auth, Firestore y Realtime Database).
- Estado global con Redux Toolkit.
- Estilos con Tailwind CSS sobre Vite.

## Stack
- React 19, TypeScript, Vite
- Redux Toolkit + React Redux
- React Router v7
- Firebase (Auth, Firestore, Realtime Database)
- Tailwind CSS (@tailwindcss/vite)

## Estructura del proyecto
- src/presentation/ - UI y pantallas
- src/core/entities/ - entidades del dominio
- src/store/ - store de Redux y slices
- src/hooks/ - hooks reutilizables
- src/firebase/ - configuracion de Firebase

## Variables de entorno
Crear un archivo .env a partir de .env.example y completar los valores:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## Scripts
- npm run dev - iniciar servidor de desarrollo
- npm run build - type-check y build
- npm run lint - ejecutar ESLint
- npm run preview - previsualizar build

## Inicio rapido
1. npm install
2. Copiar .env.example a .env y configurar Firebase
3. npm run dev
