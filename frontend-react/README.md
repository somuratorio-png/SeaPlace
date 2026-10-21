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
- `src/App.jsx` — solo las rutas (`Routes`/`Route`), envueltas en los proveedores de moneda, sesión y
  notificaciones. No tiene estado ni lógica.
- `src/views/` — una pantalla por archivo (Inicio, Catalogo, Detalle, Muelle, Zarpar, Panel, Admin, Refugio...).
  Cada vista es de una línea: dibuja un solo componente y nada más.
- `src/components/` — las piezas, agrupadas en una carpeta por pantalla (`comunes/` son las que usa todo el sitio).
  - El componente principal de cada pantalla (por ejemplo `PanelRefugio` o `CatalogoAnimales`) pide sus datos
    al backend y los reparte por props al resto, que solo muestra y no sabe nada del backend.
  - `proveedores/` — los proveedores de contexto: `ProveedorSesion`, `ProveedorMoneda` y `ProveedorNotificaciones`.
  - `rutas/` — las guardas de acceso: `ConSesion` (hay que estar logueado), `SoloPadrinos`, `SoloRefugio` y `SoloAdmin`.
- `src/services/` — las llamadas a la API. El único `fetch` está en `api.js`; el resto arma cada pedido
  y pasa la respuesta al formato que usan las pantallas. Los componentes no tienen URLs.
- `src/contexto/` — los contextos (`Sesion`, `Moneda`, `Planes`, `Notificaciones`). Son solo archivos `.js`:
  los proveedores, que son componentes, están en `components/proveedores/`.
- `src/hooks/` — los hooks que usan los componentes: `useSesion`, `useFavoritos`, `useMuelle`, `usePlanes`,
  `useMoneda`, `useNotificaciones`, `useConsulta`, `useFormulario`, `useGestionRefugio`, entre otros.
- `src/utils/` — funciones sueltas (precios, fechas, paginación, roles, validaciones).
- `src/data/` — lo que es fijo en las pantallas (las urgencias y las imágenes del diseño).
- `src/index.css` — Tailwind y los colores/tipografías del diseño.

## Cómo se habla con el backend

- `ProveedorSesion` pide una sola cosa al abrir la página (`/inicio`): los planes. Si falla, se muestra la
  pantalla de "sin conexión" con un botón para volver a intentar.
- Cada pantalla pide lo suyo en un `useEffect` al montarse, un GET por listado: el catálogo pide los
  animales y las categorías, el panel los apadrinamientos, y en el panel del administrador cada sección
  del menú pide sus propias listas cuando se abre.
- Las notificaciones las pide `ProveedorNotificaciones` cuando alguien inicia sesión, y las comparten la
  campanita del header y el panel del refugio.
- El login y el registro devuelven la sesión (quién es el usuario, sus favoritos y su muelle) y con eso se
  llena el estado.
- Cada POST, PUT o DELETE devuelve lo que cambió y con eso se actualiza el estado: no se vuelve a pedir
  la lista ni hace falta recargar.
- Si un pedido falla, se muestra en pantalla el mensaje que manda el backend.
- La sesión es el token y vive solo en memoria: al recargar la página hay que volver a iniciar sesión.