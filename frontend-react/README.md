# SeaPlace — Frontend (React + Vite)

Frontend de SeaPlace. Reemplaza a los HTML sueltos de `../frontend/`.
La guía completa (qué se hizo, cómo y por qué) está en un PDF aparte, fuera del repo.

## Cómo correrlo

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
```

El front está **100% mockeado**: no se conecta al backend ni necesita Spring o MySQL corriendo.
Los datos salen de `src/data/` a través de los servicios de `src/services/`, que simulan una API
(responden con una pequeña demora). El login, el registro y el carrito se guardan en el `localStorage` del navegador.

Usuario de demo: `marina` / `foquita123` (definido en `src/data/usuarios.js`).

## Scripts

| Comando           | Qué hace                              |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Servidor de desarrollo                |
| `npm run build`   | Build de producción en `dist/`        |
| `npm run preview` | Sirve el build para probarlo          |
| `npm run lint`    | Linter (oxlint)                       |

## Estructura

- `src/pages/` — una pantalla por URL (las rutas están en `src/App.jsx`)
- `src/components/` — piezas compartidas (Header, Footer, Layout…)
- `src/services/` — servicios mock (auth y animales): la única capa que las páginas usan para pedir datos
- `src/context/` — sesión (`AuthContext`) y muelle/carrito (`MuelleContext`)
- `src/data/` — datos mock: animales, usuarios de demo e imágenes
- `src/index.css` — Tailwind v4 y el tema del diseño (`@theme`)
