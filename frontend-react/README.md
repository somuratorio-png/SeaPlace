# SeaPlace — Frontend (React + Vite)

Frontend de SeaPlace hecho con React básico: **componentes funcionales, props y `useState`**.
Todos los datos son de ejemplo (mock): no se conecta al backend.

## Cómo correrlo

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
```

Usuario de prueba: `marina` / `foquita123` (en `src/data/usuarios.js`).

## Cómo está armado

- `src/App.jsx` — componente principal. Guarda en `useState` la página actual, el carrito, los animales
  apadrinados y el usuario logueado, y se los pasa a cada página por props.
- `src/pages/` — una página por archivo (Inicio, Catalogo, Detalle, Carrito, Login, Panel).
- `src/components/` — componentes chicos, agrupados en una carpeta por página (`comunes/` son los que usa todo el sitio).
- `src/data/` — datos mock: animales, usuarios de prueba e imágenes.
- `src/index.css` — Tailwind y los colores/tipografías del diseño.

Como todo vive en el estado de React, al recargar la página se vuelve al inicio con el carrito vacío.
