import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BarraProgreso from '../components/BarraProgreso'
import Icon from '../components/Icon'
import { useMuelle } from '../context/MuelleContext'
import { CATEGORIAS } from '../data/animales'
import { mapaRescate, webcam } from '../data/imagenes'
import { getAnimal } from '../services/animalesService'

// Los 3 niveles de custodia se calculan a partir de la cuota del animal
// (con Nori, cuota $24, dan exactamente los precios del diseño original: 12 / 24 / 45).
function armarPlanes(precio) {
  const niveles = [
    { id: 'brisa', nombre: 'Brisa Marina', factor: 0.5, texto: 'Certificado digital y bitácora mensual de evolución por correo.' },
    { id: 'guardian', nombre: 'Guardián de la Bahía', factor: 1, recomendado: true, texto: 'Todo lo anterior + webcam 24/7 y kit de bienvenida con parche.' },
    { id: 'profunda', nombre: 'Marea Profunda', factor: 1.875, texto: 'Todo lo anterior + sesión virtual con biólogos y diploma enmarcado.' },
  ]
  return niveles.map((n) => {
    const mensual = Math.round(precio * n.factor)
    return {
      ...n,
      precios: {
        monthly: mensual,
        yearly: Math.round(mensual * 12 * 0.85), // 15% de descuento anual
        once: Math.round((mensual * 4) / 10) * 10,
      },
    }
  })
}

const FRECUENCIAS = [
  { id: 'monthly', label: 'Mensual', sufijo: '/mes' },
  { id: 'yearly', label: 'Anual', sufijo: '/año', badge: '-15%' },
  { id: 'once', label: 'Aporte Único', sufijo: '' },
]

export default function DetalleAnimal() {
  // useParams lee la parte variable de la URL: en /animales/nori, id = "nori"
  const { id } = useParams()
  const navigate = useNavigate()
  const { setSponsorship } = useMuelle()

  // Guardamos también de qué id es la respuesta: si el usuario navega a otro animal,
  // la respuesta vieja deja de coincidir y se muestra "Cargando..." sin tener que resetear nada.
  const [respuesta, setRespuesta] = useState({ id: null, animal: null, error: null })

  // Pedimos el animal al servicio (mockeado) cada vez que cambia el id de la URL
  useEffect(() => {
    let cancelado = false
    getAnimal(id)
      .then((animal) => !cancelado && setRespuesta({ id, animal, error: null }))
      .catch((e) => !cancelado && setRespuesta({ id, animal: null, error: e.message }))
    return () => {
      cancelado = true
    }
  }, [id])

  const { animal, error } = respuesta.id === id ? respuesta : { animal: null, error: null }
  if (error) {
    return <Aviso titulo="No pudimos encontrar a este animal" texto={error} />
  }
  if (!animal) {
    return <Aviso titulo="Cargando..." />
  }
  // key={animal.id} hace que, al pasar de un animal a otro, la ficha arranque de cero
  // (foto, plan y frecuencia elegidos vuelven a sus valores iniciales)
  return <Ficha key={animal.id} animal={animal} onApadrinar={(item) => { setSponsorship(item); navigate('/muelle') }} />
}

function Ficha({ animal, onApadrinar }) {
  const detalle = animal.detalle
  const galeria = detalle?.galeria ?? [{ src: animal.imagen, alt: animal.alt }]
  const planes = armarPlanes(animal.precio)

  const [fotoActiva, setFotoActiva] = useState(0)
  const [frecuencia, setFrecuencia] = useState('monthly')
  const [planId, setPlanId] = useState('guardian')
  const [esRegalo, setEsRegalo] = useState(false)
  const [regalo, setRegalo] = useState({ nombre: '', mensaje: '' })

  const plan = planes.find((p) => p.id === planId)
  const sufijo = FRECUENCIAS.find((f) => f.id === frecuencia).sufijo
  const categoriaLabel = CATEGORIAS[animal.categoria]?.label ?? animal.categoria

  function apadrinar() {
    onApadrinar({
      animalId: animal.id,
      name: animal.nombre,
      species: animal.especie,
      price: plan.precios[frecuencia],
      frequency: frecuencia,
      plan: plan.nombre,
      image: galeria[0].src,
      gift: esRegalo ? regalo : null,
    })
  }

  return (
    <div style={{ background: 'linear-gradient(rgb(252, 249, 243) 0%, rgb(246, 243, 237) 25%, rgb(237, 247, 245) 55%, rgb(246, 243, 237) 80%, rgb(252, 249, 243) 100%)' }}>
      {/* Migas de pan */}
      <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-md">
        <nav className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md" aria-label="Ubicación">
          <Link className="hover:text-primary transition-colors" to="/">Inicio</Link>
          <Icon name="chevron_right" className="text-[14px]" />
          <Link className="hover:text-primary transition-colors" to="/catalogo">{categoriaLabel}</Link>
          <Icon name="chevron_right" className="text-[14px]" />
          <span className="text-primary font-body-md font-semibold">
            {animal.nombre}
            {detalle?.nombreCientifico && ` • ${detalle.nombreCientifico}`}
          </span>
        </nav>
      </div>

      <div className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg xl:gap-space-xl items-start">
          {/* Columna izquierda */}
          <div className="lg:col-span-7 flex flex-col gap-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-sm sm:p-space-md shadow-[0_12px_32px_-4px_rgba(140,106,82,0.06)] flex flex-col gap-space-md">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-high group">
                <img
                  alt={galeria[fotoActiva].alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={galeria[fotoActiva].src}
                />
                <div className="absolute top-space-md left-space-md flex flex-wrap gap-space-xs">
                  <span className="inline-flex items-center gap-1 bg-surface/90 backdrop-blur-md px-space-md py-1 rounded-full text-secondary font-label-md text-label-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                    <span>{animal.estado.label}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 bg-surface-container-highest/90 backdrop-blur-md px-space-md py-1 rounded-full text-on-surface-variant font-label-md text-label-md shadow-sm">
                    <Icon name={animal.ubicacion.icon} className="text-[14px]" /> {animal.ubicacion.label}
                  </span>
                </div>
              </div>
              {/* Miniaturas: antes solo cambiaban el borde; ahora cambian la foto grande de verdad */}
              {galeria.length > 1 && (
                <div className="grid grid-cols-4 gap-space-sm">
                  {galeria.slice(1).map((foto, i) => {
                    const indice = i + 1
                    const activa = fotoActiva === indice
                    return (
                      <button
                        key={foto.src}
                        type="button"
                        onClick={() => setFotoActiva(activa ? 0 : indice)}
                        aria-pressed={activa}
                        aria-label={`Ver foto: ${foto.alt}`}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-low transition-all ${
                          activa ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img alt="" className="w-full h-full object-cover" src={foto.src} />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {detalle ? (
              <FichaClinica />
            ) : (
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_12px_32px_-4px_rgba(140,106,82,0.06)] space-y-space-sm">
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Su historia</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">{animal.descripcion}</p>
                <div className="pt-space-sm space-y-1">
                  <div className="flex justify-between font-label-lg text-label-lg">
                    <span className="text-on-surface">{animal.fondo.label}</span>
                    <span className="text-secondary font-bold">{animal.fondo.progreso}%</span>
                  </div>
                  <BarraProgreso valor={animal.fondo.progreso} alto="h-3" fondo="bg-surface-container-highest" />
                </div>
              </div>
            )}
            {detalle && <MapaRescate />}
          </div>

          {/* Columna derecha: panel de apadrinamiento */}
          <div className="lg:col-span-5 flex flex-col gap-space-md lg:sticky lg:top-24">
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_12px_32px_-4px_rgba(140,106,82,0.08)] flex flex-col gap-space-md">
              <div className="flex flex-col gap-space-xs">
                <div className="inline-flex items-center gap-1.5 self-start bg-primary-fixed text-on-primary-fixed px-space-md py-1 rounded-full font-label-md text-label-md">
                  <Icon name="eco" className="text-[15px]" />
                  <span>{detalle?.origen ?? animal.especie}</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mt-space-xs leading-tight">
                  {animal.nombre}{' '}
                  {detalle?.lema && (
                    <span className="font-body-lg text-body-lg text-on-surface-variant font-normal block sm:inline">— {detalle.lema}</span>
                  )}
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs leading-relaxed">
                  Tu apadrinamiento financia su alimentación, control de temperatura y cuidados biológicos hasta su retorno al mar.
                </p>
              </div>

              {/* Frecuencia */}
              <div className="bg-surface-container-low p-1 rounded-lg flex items-center justify-between text-center mt-space-xs" role="group" aria-label="Frecuencia del aporte">
                {FRECUENCIAS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrecuencia(f.id)}
                    aria-pressed={frecuencia === f.id}
                    className={`flex-1 py-2 rounded-md font-label-lg text-label-lg transition-all ${
                      frecuencia === f.id ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {f.label}
                    {f.badge && (
                      <span className="text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full ml-1 font-bold">{f.badge}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Planes: un radio controlado; la tarjeta resaltada sale del estado planId */}
              <fieldset className="flex flex-col gap-space-sm mt-space-xs">
                <legend className="font-label-md text-label-md text-on-surface-variant font-semibold uppercase tracking-wider mb-space-sm">
                  Selecciona tu nivel de custodia
                </legend>
                {planes.map((p) => {
                  const activo = p.id === planId
                  return (
                    <label
                      key={p.id}
                      className={`relative flex items-start p-space-md rounded-xl cursor-pointer transition-all ${
                        activo ? 'bg-surface-container-lowest shadow-md ring-2 ring-primary' : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      {p.recomendado && (
                        <div className="absolute -top-3 right-space-md bg-primary text-on-primary font-label-md text-label-md py-0.5 px-3 rounded-full shadow-sm font-semibold tracking-wide">
                          Recomendado
                        </div>
                      )}
                      <input
                        className="mt-1 accent-primary"
                        name="nivel"
                        type="radio"
                        value={p.id}
                        checked={activo}
                        onChange={() => setPlanId(p.id)}
                      />
                      <div className="ml-space-md flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-title-lg text-title-lg ${activo ? 'text-primary font-bold' : 'text-on-surface font-semibold'}`}>{p.nombre}</span>
                          <span className="font-headline-sm text-headline-sm text-primary font-bold">
                            ${p.precios[frecuencia]}
                            <span className="text-xs font-normal text-on-surface-variant">{sufijo}</span>
                          </span>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{p.texto}</p>
                      </div>
                    </label>
                  )
                })}
              </fieldset>

              {/* Regalo (colapsable) */}
              <div className="bg-surface-container-low/70 rounded-lg p-space-md flex flex-col gap-space-sm">
                <button type="button" className="flex items-center justify-between text-left" onClick={() => setEsRegalo(!esRegalo)} aria-expanded={esRegalo}>
                  <span className="flex items-center gap-space-xs">
                    <Icon name="featured_seasonal_and_gifts" className="text-primary text-[20px]" />
                    <span className="font-title-lg text-title-lg text-on-surface font-medium">¿Es un regalo para alguien especial?</span>
                  </span>
                  <Icon name={esRegalo ? 'expand_less' : 'expand_more'} className="text-on-surface-variant" />
                </button>
                {esRegalo && (
                  <div className="flex flex-col gap-space-sm pt-space-xs">
                    <label className="block">
                      <span className="font-label-md text-label-md text-on-surface-variant block mb-1">Nombre del homenajeado/a</span>
                      <input
                        className="w-full bg-surface-container-lowest rounded-md px-space-md py-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="Ej. Camila Valenzuela"
                        type="text"
                        value={regalo.nombre}
                        onChange={(e) => setRegalo({ ...regalo, nombre: e.target.value })}
                      />
                    </label>
                    <label className="block">
                      <span className="font-label-md text-label-md text-on-surface-variant block mb-1">Mensaje personalizado para su certificado</span>
                      <textarea
                        className="w-full bg-surface-container-lowest rounded-md px-space-md py-2 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary"
                        placeholder="Que la fuerza del océano te acompañe siempre..."
                        rows={2}
                        value={regalo.mensaje}
                        onChange={(e) => setRegalo({ ...regalo, mensaje: e.target.value })}
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-space-xs pt-space-xs">
                <button
                  type="button"
                  onClick={apadrinar}
                  className="w-full bg-primary hover:bg-surface-tint text-on-primary font-title-lg text-title-lg py-space-md rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-space-sm group"
                >
                  <Icon name="favorite" className="group-hover:scale-110 transition-transform" />
                  <span>Apadrinar a {animal.nombre} Ahora</span>
                </button>
                <div className="flex items-center justify-center gap-space-md pt-2 text-on-surface-variant font-label-md text-label-md">
                  <span className="flex items-center gap-1"><Icon name="verified_user" className="text-[15px] text-secondary" /> Transparencia 100%</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Icon name="lock" className="text-[15px] text-secondary" /> Pago Seguro SSL</span>
                  <span>•</span>
                  <span>Deducible</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="w-full py-space-xl" style={{ background: 'linear-gradient(rgba(237, 248, 255, 0.7) 0%, rgba(235, 248, 243, 0.85) 50%, rgba(240, 238, 232, 0.95) 100%)' }}>
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin flex flex-col gap-space-xl">
          {detalle && <Webcam nombre={animal.nombre} />}
          <Preguntas nombre={animal.nombre} />
        </div>
      </div>
    </div>
  )
}

// ---- Bloques que solo tiene Nori (datos del diseño original) ----

function FichaClinica() {
  const datos = [
    { titulo: 'Peso Actual', valor: '11.2 kg', clase: 'font-headline-md text-headline-md text-primary', nota: <><Icon name="arrow_upward" className="text-[14px]" /> +850g esta semana</>, notaClase: 'text-secondary' },
    { titulo: 'Edad Estimada', valor: '4 meses', clase: 'font-headline-md text-headline-md text-primary', nota: 'Nacimiento: Noviembre' },
    { titulo: 'Dieta Marina', valor: 'Arenque & Suero', clase: 'font-title-lg text-title-lg text-primary leading-tight', nota: '4 tomas balanceadas' },
    { titulo: 'Altas de Nado', valor: '82%', clase: 'font-headline-md text-headline-md text-secondary', nota: 'Reflejo de inmersión pleno' },
  ]
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_12px_32px_-4px_rgba(140,106,82,0.06)]">
      <div className="flex items-center justify-between pb-space-sm mb-space-md gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
            <Icon name="vital_signs" className="text-[22px]" />
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Bitácora Clínica y Biometría</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Revisión veterinaria: hace 18 horas por Dra. Arantza Solís</p>
          </div>
        </div>
        <span className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-space-md py-1 rounded-full flex items-center gap-1">
          <Icon name="check_circle" className="text-[16px]" /> Estable
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
        {datos.map((d) => (
          <div key={d.titulo} className="bg-surface-container-low rounded-lg p-space-md flex flex-col">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{d.titulo}</span>
            <span className={`${d.clase} mt-space-xs font-semibold`}>{d.valor}</span>
            <span className={`font-body-sm mt-1 flex items-center text-xs ${d.notaClase ?? 'text-on-surface-variant'}`}>{d.nota}</span>
          </div>
        ))}
      </div>
      <div className="mt-space-md bg-surface-container-low/50 rounded-lg p-space-md flex flex-col gap-space-xs">
        <div className="flex justify-between items-center">
          <span className="font-label-lg text-label-lg text-on-surface">Progreso hacia liberación en mar abierto</span>
          <span className="font-label-lg text-label-lg text-secondary font-bold">82% de autonomía</span>
        </div>
        <BarraProgreso valor={82} alto="h-3" fondo="bg-surface-container-highest" />
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Próximo hito: pruebas de caza autónoma previa a la suelta.</p>
      </div>
    </div>
  )
}

function MapaRescate() {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-[0_12px_32px_-4px_rgba(140,106,82,0.06)] flex flex-col gap-space-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div>
          <span className="font-label-md text-label-md text-secondary tracking-widest uppercase font-semibold">Telemetría de Origen y Hábitat</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Bahía de los Cantos, Pacífico Noroeste</h2>
        </div>
        <div className="flex items-center gap-space-xs text-xs font-label-md text-on-surface-variant bg-surface-container px-space-md py-1 rounded-full self-start sm:self-auto">
          <Icon name="satellite_alt" className="text-[16px] text-tertiary" /> Lat: 28°14'N • Long: 115°30'W
        </div>
      </div>
      <div
        className="relative w-full h-56 rounded-lg bg-tertiary-container bg-cover bg-center overflow-hidden flex items-end p-space-md"
        style={{ backgroundImage: `url("${mapaRescate}")` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-inverse-surface/80 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex items-center justify-between w-full">
          <div className="flex items-center gap-space-xs">
            <div className="w-3 h-3 rounded-full bg-tertiary-fixed animate-ping" />
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg font-semibold text-surface-container-lowest">Punto de Rescate 04-B</span>
              <span className="font-body-sm text-surface-container-high text-xs">Arrecife de San Jerónimo</span>
            </div>
          </div>
          <span className="bg-surface-container-lowest/90 text-on-surface font-label-md text-label-md px-space-md py-1 rounded-full backdrop-blur-md shadow-sm">
            Santuario a 14.8 mn
          </span>
        </div>
      </div>
    </div>
  )
}

function Webcam({ nombre }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
      <div className="md:col-span-6 relative aspect-video rounded-lg overflow-hidden bg-inverse-surface group">
        <img alt="Vista de la cámara en vivo de la pileta de rehabilitación" className="w-full h-full object-cover" src={webcam} />
        <div className="absolute top-space-md left-space-md bg-error text-on-error px-space-sm py-0.5 rounded font-label-md text-label-md flex items-center gap-1 uppercase tracking-wider font-bold">
          <span className="w-2 h-2 rounded-full bg-on-error animate-ping" /> En Directo
        </div>
        <div className="absolute inset-0 bg-inverse-surface/30 flex items-center justify-center group-hover:bg-inverse-surface/10 transition-all">
          <div className="w-14 h-14 rounded-full bg-surface-container-lowest/90 text-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <Icon name="play_arrow" className="text-[32px]" />
          </div>
        </div>
      </div>
      <div className="md:col-span-6 flex flex-col gap-space-sm">
        <span className="font-label-md text-label-md text-secondary uppercase tracking-widest font-semibold">Ventana al Santuario</span>
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold leading-tight">Observa la recuperación de {nombre} en tiempo real</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Disponible para patrocinadores del nivel <em>Guardián de la Bahía</em> y superior.
        </p>
        <div className="flex flex-wrap items-center gap-space-md pt-space-xs font-label-md text-label-md text-on-surface">
          <span className="flex items-center gap-1.5"><Icon name="schedule" className="text-primary text-[18px]" /> Alimentación: 08:30 y 16:00 UTC</span>
          <span className="flex items-center gap-1.5"><Icon name="signal_cellular_alt" className="text-secondary text-[18px]" /> Señal HD Satelital</span>
        </div>
      </div>
    </div>
  )
}

// ---- Preguntas frecuentes: acordeón donde se abre de a una ----

function Preguntas({ nombre }) {
  const preguntas = [
    { p: `¿Puedo visitar a ${nombre} en el centro?`, r: 'Para evitar el acostumbramiento humano, el acceso está restringido a personal médico. Los reportes en video te mantienen conectado.' },
    { p: `¿Qué ocurre cuando ${nombre} sea liberado/a?`, r: 'Seguís en directo su liberación y tu apadrinamiento se transfiere a otra cría o se pausa cuando quieras.' },
    { p: '¿Cuánto tiempo dura el compromiso?', r: 'Sin plazos forzosos: modificá, pausá o cancelá tu suscripción cuando quieras.' },
    { p: '¿El aporte es deducible de impuestos?', r: 'Sí. Emitimos el comprobante fiscal correspondiente cada mes o año.' },
  ]
  const [abierta, setAbierta] = useState(null)

  return (
    <div className="flex flex-col gap-space-md">
      <div className="text-center max-w-2xl mx-auto mb-space-sm">
        <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold">Dudas Comunes</span>
        <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">¿Cómo funciona tu apadrinamiento de {nombre}?</h2>
      </div>
      <div className="flex flex-col gap-space-sm max-w-3xl mx-auto w-full">
        {preguntas.map((item, i) => {
          const estaAbierta = abierta === i
          return (
            <div key={item.p} className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => setAbierta(estaAbierta ? null : i)}
                aria-expanded={estaAbierta}
                className="w-full flex items-center justify-between gap-2 p-space-md text-left"
              >
                <span className="font-title-lg text-title-lg text-primary font-semibold flex items-center gap-2">
                  <Icon name="help" className="text-secondary" />
                  {item.p}
                </span>
                <Icon name="expand_more" className={`text-on-surface-variant transition-transform ${estaAbierta ? 'rotate-180' : ''}`} />
              </button>
              {estaAbierta && <p className="font-body-md text-body-md text-on-surface-variant px-space-md pb-space-md">{item.r}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Aviso({ titulo, texto }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-space-xl px-margin-mobile">
      <h1 className="font-headline-md text-headline-md text-primary">{titulo}</h1>
      {texto && <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">{texto}</p>}
      <Link to="/catalogo" className="inline-block mt-space-md bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg">
        Volver al catálogo
      </Link>
    </div>
  )
}
