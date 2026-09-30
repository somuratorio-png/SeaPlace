# SeaPlace — Frontend (React + Vite)

Frontend de SeaPlace. Reemplaza a los HTML sueltos de `../frontend/`.
La guía completa (qué se hizo, cómo y por qué) está en `../Guia-React-Vite-SeaPlace.pdf`.

## Cómo correrlo

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
```

El backend (Spring Boot, puerto 8080) se levanta aparte. Vite reenvía todo lo que empieza con `/api`
a `http://localhost:8080` (ver `vite.config.js`), así que no hace falta configurar CORS.
Si el backend está apagado o no tiene animales cargados, el catálogo muestra datos de ejemplo.

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
- `src/api/` — única capa que habla con Spring (`apiFetch` agrega el JWT y maneja errores)
- `src/context/` — sesión (`AuthContext`) y carrito (`CartContext`)
- `src/data/` — imágenes y animales de ejemplo
- `src/index.css` — Tailwind v4 y el tema del diseño (`@theme`)
