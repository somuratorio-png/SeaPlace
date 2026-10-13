# SeaPlace — Frontend (React + Vite)

Frontend de SeaPlace: una SPA hecha con React, `react-router-dom` y `fetch`, conectada a la API de Spring.
No usa datos de ejemplo: todo lo que se ve viene del backend.

## Cómo correrlo

Primero tiene que estar levantado el backend (Spring, puerto 8080). Después:

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
```

Vite reenvía al backend todo lo que empieza con `/api` (ver `vite.config.js`), así que el navegador
siempre le habla a `localhost:5173`.

Los usuarios de demo están en el README de la raíz del repo.

## Cómo está armado

- `src/main.jsx` — punto de entrada: `BrowserRouter` envolviendo a `<App />`.
- `src/App.jsx` — el ruteo (`Routes`/`Route`) y lo que es de toda la app: quién está logueado, sus favoritos y su muelle.
- `src/views/` — una pantalla por archivo (Inicio, Catalogo, Detalle, Muelle, Zarpar, Panel, Admin, Refugio...).
  Cada una pide sus datos al backend cuando se monta, los guarda en su estado y los reparte por props.
- `src/components/` — las piezas, agrupadas en una carpeta por pantalla (`comunes/` son las que usa todo el sitio).
  Reciben props y muestran: no saben nada del backend.
- `src/services/` — las llamadas a la API. El único `fetch` está en `api.js`; el resto arma cada pedido
  y pasa la respuesta al formato que usan las pantallas. Los componentes no tienen URLs.
- `src/utils/` — funciones sueltas (precios, fechas, paginación).
- `src/contexto/` y `src/hooks/` — la moneda elegida y los planes.
- `src/data/` — lo que es fijo en las pantallas (las urgencias y las imágenes del diseño).
- `src/index.css` — Tailwind y los colores/tipografías del diseño.

## Cómo se habla con el backend

- Cada pantalla pide lo suyo en un `useEffect` al montarse, un GET por listado: el catálogo pide los
  animales y las categorías, el panel los apadrinamientos, y en el panel del administrador cada sección
  del menú pide sus propias listas cuando se abre.
- `App` pide una sola cosa al arrancar (`/inicio`): los planes y, si había una sesión guardada, quién es
  el usuario, sus favoritos y su muelle. El login y el registro devuelven eso mismo en su respuesta.
- Cada POST, PUT o DELETE devuelve lo que cambió y con eso se actualiza el estado: no se vuelve a pedir
  la lista ni hace falta recargar.
- Si un pedido falla, se muestra en pantalla el mensaje que manda el backend.
- La sesión es el token, que queda guardado en el navegador: al recargar se sigue logueado.
