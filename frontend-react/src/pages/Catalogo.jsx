import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BarraProgreso from '../components/BarraProgreso'
import Icon from '../components/Icon'
import { useMuelle } from '../context/MuelleContext'
import { categoriasDe } from '../data/animales'
import { getAnimales } from '../services/animalesService'

const ORDEN_URGENCIA = { critical: 0, recovering: 1, ready: 2 }

// La función de orden que antes faltaba (el <select> "Ordenar" no hacía nada)
const ORDENAMIENTOS = {
  urgentes: { label: 'Más urgentes primero', fn: (a, b) => (ORDEN_URGENCIA[a.urgencia] ?? 9) - (ORDEN_URGENCIA[b.urgencia] ?? 9) },
  jovenes: { label: 'Crías más jóvenes', fn: (a, b) => (a.edadMeses ?? Infinity) - (b.edadMeses ?? Infinity) },
  progreso: { label: 'Mayor progreso de meta', fn: (a, b) => b.fondo.progreso - a.fondo.progreso },
  recientes: { label: 'Recientes ingresos', fn: (a, b) => String(b.ingreso).localeCompare(String(a.ingreso)) },
}

const Catalogo = () => {
  const navigate = useNavigate()
  const { agregar } = useMuelle()

  // --- Datos ---
  const [animales, setAnimales] = useState([])
  const [cargando, setCargando] = useState(true)

  // useEffect con [] se ejecuta una sola vez, cuando la página aparece: ahí pedimos los datos
  // al servicio (mockeado: responde con datos locales después de una pequeña demora).
  useEffect(() => {
    let cancelado = false
    getAnimales().then((lista) => {
      if (cancelado) return
      setAnimales(lista)
      setCargando(false)
    })
    // Si el usuario se va antes de que llegue la respuesta, no tocamos el estado
    return () => {
      cancelado = true
    }
  }, [])

  // --- Filtros (cada control del formulario es un pedazo de estado) ---
  const [categoria, setCategoria] = useState('all')
  const [busqueda, setBusqueda] = useState('')
  const [urgencia, setUrgencia] = useState('all')
  const [orden, setOrden] = useState('urgentes')

  const categorias = useMemo(() => categoriasDe(animales), [animales])

  // La lista visible se CALCULA a partir del estado; no se ocultan tarjetas con classList.
  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase()
    return animales
      .filter((a) => categoria === 'all' || a.categoria === categoria)
      .filter((a) => urgencia === 'all' || a.urgencia === urgencia)
      .filter(
        (a) =>
          !texto ||
          [a.nombre, a.especie, a.ubicacion.label, a.descripcion].some((campo) => campo.toLowerCase().includes(texto)),
      )
      .toSorted(ORDENAMIENTOS[orden].fn)
  }, [animales, categoria, urgencia, busqueda, orden])

  const apadrinar = (animal) => {
    agregar({
      animalId: animal.id,
      name: animal.nombre,
      species: animal.especie,
      price: animal.precio,
      plan: 'Apadrinamiento Estándar',
      image: animal.imagen,
    })
    navigate('/muelle')
  }

  return (
    <div className="w-full relative px-margin-mobile md:px-margin py-space-xl max-w-7xl mx-auto space-y-space-xl">
      {/* Fondos decorativos */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-80 left-0 w-96 h-96 rounded-full bg-primary/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-tertiary/10 blur-3xl pointer-events-none -z-10" />

      {/* Encabezado + filtros de categoría */}
      <section className="space-y-space-md">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="space-y-space-xs max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container shadow-sm border border-secondary/20">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              <span className="font-label-md text-label-md uppercase tracking-wider">Custodia &amp; Rehabilitación Activa • Océano Pacífico</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Encuentra a tu compañero del océano</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Acompaña a crías huérfanas, ejemplares vulnerables y mamíferos en proceso de sanación costera. Tu aportación
              mensual cubre nutrición salina, chequeos satelitales y medicación especializada hasta su liberación.
            </p>
          </div>
          <div className="flex items-center gap-space-md bg-surface-container-lowest/90 backdrop-blur-md p-space-md rounded-xl shadow-sm border border-outline-variant/40 self-start md:self-auto">
            <div className="w-12 h-12 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
              <Icon name="water_ec" className="text-2xl" />
            </div>
            <div>
              <span className="font-headline-sm text-headline-sm text-primary block leading-none">{animales.length}</span>
              <span className="font-label-md text-label-md text-on-surface-variant">Ejemplares bajo cuidado en 2026</span>
            </div>
          </div>
        </div>

        <div className="pt-space-xs flex items-center gap-space-xs overflow-x-auto pb-2">
          <PillCategoria activa={categoria === 'all'} onClick={() => setCategoria('all')} icon="grid_view" label="Todas las especies" cantidad={animales.length} />
          {categorias.map((c) => (
            <PillCategoria
              key={c.key}
              activa={categoria === c.key}
              onClick={() => setCategoria(c.key)}
              icon={c.icon}
              label={c.label}
              cantidad={c.cantidad}
            />
          ))}
        </div>
      </section>

      {/* Barra de búsqueda, urgencia y orden */}
      <section className="bg-surface-container-lowest/90 backdrop-blur-md p-space-md rounded-xl shadow-sm border border-outline-variant/30">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
          <div className="md:col-span-5 relative">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none" />
            <input
              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-all"
              placeholder="Buscar por nombre, santuario o bahía..."
              type="text"
              aria-label="Buscar animal"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 flex items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap hidden sm:inline">Urgencia médica:</span>
            <Select value={urgencia} onChange={setUrgencia} icon="expand_more" label="Urgencia médica">
              <option value="all">Todas las condiciones</option>
              <option value="critical">🚨 Crítico (Cuidados intensivos)</option>
              <option value="recovering">🌿 En recuperación nutricional</option>
              <option value="ready">🌊 Listo para liberación</option>
            </Select>
          </div>
          <div className="md:col-span-3 flex items-center gap-2 justify-end">
            <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap hidden sm:inline">Ordenar:</span>
            <Select value={orden} onChange={setOrden} icon="sort" label="Ordenar">
              {Object.entries(ORDENAMIENTOS).map(([key, o]) => (
                <option key={key} value={key}>
                  {o.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </section>

      {/* Grilla */}
      {cargando ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant text-center">Cargando animales...</p>
      ) : visibles.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest/70 border border-outline-variant/30 rounded-lg p-space-md text-center">
          Ningún animal coincide con esos filtros. Probá con otra categoría o urgencia.
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {visibles.map((animal) => (
            <TarjetaCatalogo key={animal.id} animal={animal} onApadrinar={() => apadrinar(animal)} />
          ))}
        </section>
      )}

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Mostrando <span className="font-semibold text-on-surface">{visibles.length}</span> de{' '}
        <span className="font-semibold text-on-surface">{animales.length}</span> animales bajo custodia activa
      </p>

      {/* Regalo */}
      <section className="relative rounded-xl overflow-hidden bg-linear-to-r from-surface-container to-secondary-container p-space-lg md:p-space-xl shadow-sm border border-secondary/20">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full text-secondary" fill="currentColor" viewBox="0 0 200 200" aria-hidden="true">
            <path
              d="M42.7,-64C54.9,-54.6,64.2,-41.8,70.5,-27.6C76.8,-13.4,80.1,2.1,76.5,16.5C72.9,30.9,62.3,44.1,49.8,55.1C37.3,66,22.9,74.7,6.8,77.7C-9.3,80.6,-27.1,77.9,-42.6,69.5C-58.1,61.1,-71.3,47.1,-77.9,30.6C-84.5,14.1,-84.5,-4.9,-77.8,-20.9C-71.1,-36.8,-57.8,-49.6,-43.3,-58.5C-28.7,-67.4,-12.9,-72.4,1.8,-75C16.5,-77.5,30.5,-73.4,42.7,-64Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-space-lg">
          <div className="flex items-start sm:items-center gap-space-md">
            <div className="w-14 h-14 rounded-xl bg-surface-container-lowest flex items-center justify-center text-primary shadow-sm shrink-0">
              <Icon name="card_giftcard" className="text-3xl" />
            </div>
            <div className="space-y-1">
              <h2 className="font-headline-sm text-headline-sm text-primary">¿Buscas un apadrinamiento para regalar?</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
                Dedica un vínculo protector a un ser querido. Incluye certificado oficial ilustrado, coordenadas GPS de
                liberación y reporte quincenal con fotos exclusivas.
              </p>
            </div>
          </div>
          <Link
            to="/animales/nori"
            className="w-full md:w-auto bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-3 rounded-lg hover:bg-surface-tint transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            <Icon name="featured_seasonal_and_gifts" className="text-lg" />
            <span>Regalar un apadrinamiento</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

const PillCategoria = ({ activa, onClick, icon, label, cantidad }) => {
  const clases = activa
    ? 'bg-primary text-on-primary shadow-sm'
    : 'bg-surface-container-lowest/80 backdrop-blur-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-outline-variant/30'
  const clasesContador = activa ? 'bg-primary-container/40 text-on-primary' : 'bg-surface-container-highest text-on-surface-variant'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={activa}
      className={`px-space-md py-2.5 rounded-lg font-label-lg text-label-lg flex items-center gap-2 whitespace-nowrap transition-all ${clases}`}
    >
      <Icon name={icon} className="text-lg" />
      <span>{label}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full font-label-md ${clasesContador}`}>{cantidad}</span>
    </button>
  )
}

const Select = ({ value, onChange, icon, label, children }) => {
  return (
    <div className="relative w-full">
      <select
        className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm px-3 py-2.5 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {children}
      </select>
      <Icon name={icon} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-sm" />
    </div>
  )
}

const TarjetaCatalogo = ({ animal, onApadrinar }) => {
  const { estado, ubicacion, fondo } = animal
  const cubierto = fondo.progreso >= 100
  return (
    <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group border border-outline-variant/30">
      <div className="relative w-full h-64 overflow-hidden bg-surface-container">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={animal.alt} src={animal.imagen} />
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
          <span className={`w-2 h-2 rounded-full ${estado.dot} ${estado.pulse ? 'animate-pulse' : ''}`} />
          <span className={`font-label-md text-label-md ${estado.text}`}>{estado.label}</span>
        </div>
        <div
          className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm ${
            ubicacion.destacada ? 'bg-secondary/90 text-on-secondary' : 'bg-surface-container-lowest/90 text-on-surface-variant'
          }`}
        >
          <Icon name={ubicacion.icon} className="text-xs" />
          <span className="font-label-md text-label-md">{ubicacion.label}</span>
        </div>
      </div>
      <div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-headline-sm text-headline-sm text-primary">{animal.nombre}</h3>
            <span className="font-label-md text-label-md text-tertiary bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">{animal.especie}</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">{animal.descripcion}</p>
        </div>
        <div className="space-y-1.5 bg-surface-container-low p-space-sm rounded-lg">
          <div className="flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">{fondo.label}</span>
            <span className="text-primary font-semibold">{fondo.progreso}% financiado</span>
          </div>
          <BarraProgreso valor={fondo.progreso} fondo="bg-surface-container-highest" />
          {cubierto && (
            <div className="flex justify-end text-xs font-body-sm pt-0.5">
              <span className="text-secondary font-medium">¡Meta alcanzada!</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-space-xs pt-space-xs">
          {/* "Historia" antes no hacía nada; ahora lleva al detalle del animal */}
          <Link
            to={`/animales/${animal.id}`}
            className="w-full py-2.5 px-3 rounded-lg bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1 text-center"
          >
            Historia
          </Link>
          {cubierto ? (
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-3 rounded-lg bg-surface-container-highest text-on-surface-variant font-label-lg text-label-lg cursor-not-allowed flex items-center justify-center gap-1 text-center"
            >
              Meta Cubierta
            </button>
          ) : (
            <button
              type="button"
              onClick={onApadrinar}
              className="w-full py-2.5 px-3 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-surface-tint transition-all shadow-sm flex items-center justify-center gap-1 text-center"
            >
              Apadrinar ${animal.precio}/m
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default Catalogo
