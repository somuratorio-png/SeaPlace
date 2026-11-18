# SeaPlace — Frontend (React + Vite)

Frontend de SeaPlace: una SPA hecha con React, `react-router-dom`, Redux Toolkit, `axios` y Tailwind CSS,
conectada a la API de Spring. No usa datos de ejemplo: todo lo que se ve viene del backend.

## Cómo correrlo

Primero tiene que estar levantado el backend (Spring, puerto 8080). Después:

```bash
npm install      # solo la primera vez
npm run dev      # http://localhost:5173
npm run lint     # ESLint
npm run build    # versión para producción en dist/
```

Vite reenvía al backend todo lo que empieza con `/api` (ver `vite.config.js`), sacándole el prefijo, así que
el navegador siempre le habla a `localhost:5173`.

Los usuarios de demo están en el README de la raíz del repo.

## Cómo está armado

- `src/main.jsx` — punto de entrada: `Provider` de Redux y `BrowserRouter` envolviendo a `<App />`.
- `src/App.jsx` — solo las rutas (`Routes`/`Route`), dentro del proveedor de moneda y del `Layout`. No tiene
  estado ni lógica.
- `src/views/` — una pantalla por archivo (Inicio, Catalogo, Detalle, Muelle, Zarpar, Panel, Admin, Refugio...).
  Cada vista es de una línea: dibuja un solo componente y nada más.
- `src/components/` — las piezas, agrupadas en una carpeta por pantalla (`comunes/` son las que usa todo el sitio).
  - El componente principal de cada pantalla (por ejemplo `PanelRefugio` o `CatalogoAnimales`) despacha los
    pedidos al backend al montarse y reparte los datos por props al resto, que solo muestra y no sabe nada
    del backend.
  - `layout/` — `Layout` (header, contenido y footer) y `PantallaArranque` (aviso de "cargando" o "sin
    conexión" hasta que el backend contesta el primer pedido).
  - `proveedores/` — `ProveedorMoneda`, el proveedor del contexto de moneda.
  - `rutas/` — las guardas de acceso: `ConSesion` (hay que estar logueado; si no, muestra el login),
    `SoloPadrinos`, `SoloRefugio`, `SoloAdmin` y `SoloPatrocinador` (cada rol va a su panel).
  - `comunes/Modal.jsx` — el cartel de confirmación. No se usa `alert`, `confirm` ni `prompt`.
- `src/Redux/` — el estado global: un slice por tema (animales, categorías, planes, muelle, apadrinamientos,
  favoritos, notificaciones, comentarios, patrocinadores, campañas, métricas, usuario y roles) y `store.js`.
  - `api.js` — lo que comparten todos los slices para hablarle al backend con axios: la URL base (`/api`),
    el token (`conToken`) y la conversión de errores en mensajes (`conError`).
  - `casos.js` — los casos `pending` y `rejected` que se repiten en todos los pedidos.
- `src/services/` — conversores: pasan lo que manda el backend al formato que usan los componentes (y al
  revés). No le hablan al backend: los pedidos los hacen los slices.
- `src/contexto/` — el contexto de moneda (`Moneda.js`). Son solo archivos `.js`: el proveedor, que es un
  componente, está en `components/proveedores/`.
- `src/hooks/` — `useMoneda`, `useFormulario`, `useBusquedaPaginada` y `useGestionRefugio`.
- `src/utils/` — funciones sueltas (precios, fechas, paginación, roles, validaciones, formato de tarjeta,
  orden de animales y el simulador de rastreo).
- `src/data/` — lo que es fijo en las pantallas (las urgencias y las imágenes del diseño).
- `src/index.css` — Tailwind v4 y los colores/tipografías del diseño (se configura desde CSS, no hay
  `tailwind.config.js`).

## Cómo se habla con el backend

- Todos los pedidos los hacen los slices de `src/Redux/` con `axios` y `createAsyncThunk`. Los componentes
  no tienen URLs: despachan la acción y leen el resultado con `useSelector`.
- Al abrir la página, `Layout` pide los planes (hacen falta en cualquier pantalla para armar los precios).
  Hasta que contestan, `PantallaArranque` muestra "Cargando SeaPlace…"; si falla, muestra la pantalla de
  "sin conexión" con un botón para reintentar.
- Cada pantalla pide lo suyo en un `useEffect` al montarse: el catálogo pide los animales y las categorías,
  el panel del padrino sus apadrinamientos, y en el panel del administrador cada sección pide sus listas.
- El login y el registro devuelven la sesión (quién es el usuario, sus favoritos y su muelle) y con eso se
  llenan `usuario`, `favoritos` y `muelle`. Al cerrar sesión esos estados vuelven a su valor inicial.
- Las notificaciones las pide la campanita del header cuando hay alguien logueado, y las comparte el panel
  del refugio a través del estado global.
- Cada POST, PUT o DELETE devuelve lo que cambió y con eso se actualiza el estado: no se vuelve a pedir la
  lista ni hace falta recargar.
- Cada slice separa el estado de los GET (`loading` / `error`, que llenan la pantalla) del de los POST, PUT y
  DELETE (`errorAccion`), para que un fallo al guardar no borre lo que ya estaba en pantalla.
- Si un pedido falla, se muestra en pantalla el mensaje que manda el backend. Si el backend no contesta o
  responde sin cuerpo (por ejemplo un 401/403), `conError` arma un mensaje claro.
- La sesión es el token y vive solo en memoria (en el slice `usuario`): al recargar la página hay que volver
  a iniciar sesión. La moneda elegida (ARS/USD) también se reinicia.