import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import BarraProgreso from '../components/BarraProgreso'
import Icon from '../components/Icon'
import { useMuelle } from '../context/MuelleContext'
import { destacados } from '../data/animales'
import { heroFoca } from '../data/imagenes'

const estadisticas = [
  { icon: 'biotech', iconColor: 'text-secondary', tag: 'Especies', valor: '28', titulo: 'Especies Monitoreadas', texto: 'Desde pinnípedos costeros hasta tortugas oceánicas milenarias.' },
  { icon: 'home_health', iconColor: 'text-primary', tag: 'Clínicas', valor: '12', titulo: 'Centros de Rescate', texto: 'Estaciones de veterinaria marina a lo largo del litoral pacífico.' },
  { icon: 'water_drop', iconColor: 'text-tertiary', tag: 'Hábitat', valor: '1.8M', titulo: 'Litros de Refugio', texto: 'Piletas de agua salada filtrada por geotermia marina natural.' },
  { icon: 'volunteer_activism', iconColor: 'text-secondary', tag: 'Retorno', valor: '94%', valorColor: 'text-secondary', titulo: 'Tasa de Rehabilitación', texto: 'Animales devueltos a sus manadas con transmisores GPS.' },
]

const kit = [
  { icon: 'workspace_premium', fondo: 'bg-primary-fixed/40 text-primary', titulo: 'Certificado Oficial Personalizado', texto: 'Con la impresión gráfica de la huella de aleta o el contorno del hocico único de tu apadrinado, listo para enmarcar.', extra: 'Descarga digital & PDF HD' },
  { icon: 'satellite_alt', fondo: 'bg-secondary-container text-secondary', titulo: 'Telemetría GPS en Vivo', texto: 'Acceso a la plataforma cartográfica privada para seguir sus coordenadas satelitales, profundidades de inmersión y velocidad.', extra: 'Actualizaciones cada 48h' },
  { icon: 'clinical_notes', fondo: 'bg-tertiary-fixed text-tertiary', titulo: 'Bitácora Médica Exclusiva', texto: 'Reportes directos del equipo de biólogos marinos con curva de peso, evolución de heridas y fotos inéditas de su cuidado.', extra: 'Boletín quincenal a tu buzón' },
  { icon: 'redeem', fondo: 'bg-primary-fixed text-primary', titulo: 'Emblema Físico Artesanal', texto: 'Parche bordado en hilo de algodón orgánico o mini peluche ecológico tejido a mano por artesanas de caletas pesqueras aliadas.', extra: 'Envío postal sin plástico' },
]

const testimonios = [
  { iniciales: 'CL', avatar: 'bg-primary-fixed text-primary', nombre: 'Camila Lagos', rol: 'Madrina de Nori • Santiago, Chile', texto: 'Ver el mapa de telemetría de Nori cada semana con mis hijos ha sido la lección más hermosa de biología marina. Sabemos el valor de proteger el océano con acciones reales.' },
  { iniciales: 'MR', avatar: 'bg-secondary-container text-secondary', nombre: 'Mateo Restrepo', rol: 'Padrino de Kelp • Bogotá, Colombia', texto: 'La rigurosidad veterinaria y el respeto con que tratan a las nutrias en los bosques de macroalgas me conmovió. El certificado con la nariz de foca es una pequeña obra de arte.' },
  { iniciales: 'ES', avatar: 'bg-tertiary-fixed text-tertiary', nombre: 'Elena Solís', rol: 'Educadora Marina • Ensenada, México', texto: 'Apadriné en nombre de mi clase escolar. Los reportes sobre la ruta migratoria de la tortuga laúd en el Pacífico mexicano inspiraron a mis alumnos a limpiar las playas locales.' },
]

const Inicio = () => {
  const { agregar } = useMuelle()
  // toast = null (oculto) o { nombre, precio } (visible)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  // Si el usuario se va de la página con el toast abierto, cancelamos el timeout
  useEffect(() => () => clearTimeout(timer.current), [])

  const apadrinar = (animal) => {
    agregar({
      animalId: animal.id,
      name: animal.nombre,
      species: animal.especie,
      price: animal.precio,
      plan: 'Apadrinamiento Estándar',
      image: animal.imagen,
    })
    setToast({ nombre: animal.nombre, precio: animal.precio })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 4000)
  }

  return (
    <div
      className="flex flex-col w-full"
      style={{ background: 'radial-gradient(circle at 50% 0%, rgba(188, 237, 220, 0.35) 0%, rgba(246, 243, 237, 0.1) 60%, transparent 100%)' }}
    >
      {/* Hero */}
      <section className="relative w-full -mt-20 pt-28 pb-16 lg:pb-24 overflow-hidden bg-linear-to-b from-surface-container-low via-surface to-background">
        <div className="absolute -top-12 -left-20 w-96 h-96 rounded-full bg-secondary-container/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-24 w-[32rem] h-[32rem] rounded-full bg-primary-fixed/20 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-space-xl items-center">
            <div className="lg:col-span-7 space-y-space-md">
              <div className="inline-flex items-center gap-space-xs bg-surface-container-high px-space-md py-1.5 rounded-full shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Custodia Viva del Pacífico • Santuarios Costeros
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-primary tracking-tight leading-tight">
                Conecta tu corazón con el latido del Pacífico.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl font-light leading-relaxed">
                Apadrina un animal marino hoy. En el vaivén de la marea fría y los mantos de quelpos, cuidamos a cachorros
                de foca, nutrias y tortugas centinelas que necesitan refugio, nutrición especializada y un horizonte libre
                para volver a nadar.
              </p>
              <div className="pt-space-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-space-md">
                <a
                  className="inline-flex items-center justify-center gap-space-xs bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-3.5 rounded-lg shadow-md hover:bg-surface-tint hover:shadow-lg transition-all duration-300"
                  href="#animales"
                >
                  <Icon name="cruelty_free" className="text-[20px]" />
                  <span>Explorar Animales</span>
                </a>
                <a
                  className="inline-flex items-center justify-center gap-space-xs bg-secondary-container/60 text-on-secondary-container font-label-lg text-label-lg px-space-lg py-3.5 rounded-lg hover:bg-secondary-container transition-all duration-300"
                  href="#kit-protector"
                >
                  <Icon name="history_edu" className="text-[20px]" />
                  <span>Cómo Funciona el Apadrinamiento</span>
                </a>
              </div>
              <div className="pt-space-md flex items-center gap-space-md">
                <div className="flex -space-x-3 overflow-hidden p-1">
                  <Burbuja icon="pets" clase="bg-surface-container-highest text-primary" />
                  <Burbuja icon="waves" clase="bg-secondary-container text-secondary" />
                  <Burbuja icon="satellite_alt" clase="bg-tertiary-fixed text-tertiary" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1 text-primary">
                    <Icon name="verified" className="text-[16px]" />
                    <span className="font-title-lg text-title-lg leading-none">+4,200 vidas marinas</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    rescatadas, rehabilitadas y bajo telemetría activa
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden bg-surface-container-high shadow-xl aspect-[4/5] p-3">
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    className="w-full h-full object-cover"
                    alt="Foca de puerto joven descansando sobre la arena húmeda de la costa"
                    src={heroFoca}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-primary/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-space-md rounded-xl shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                        <Icon name="explore" className="text-[20px]" />
                      </div>
                      <div>
                        <div className="font-title-lg text-title-lg text-primary">Bahía de Monterey</div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant">Santuario Costero • Agua 11.4°C</div>
                      </div>
                    </div>
                    <span className="font-label-md text-label-md bg-secondary text-on-secondary px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-on-secondary animate-ping" />
                      En Vivo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="w-full bg-surface-container-low py-space-xl">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md lg:gap-space-lg">
            {estadisticas.map((e) => (
              <div key={e.titulo} className="bg-surface-container rounded-xl p-space-lg flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className={`flex items-center justify-between mb-space-sm ${e.iconColor}`}>
                  <Icon name={e.icon} className="text-[28px]" />
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">{e.tag}</span>
                </div>
                <div>
                  <div className={`font-headline-lg text-headline-lg ${e.valorColor ?? 'text-primary'}`}>{e.valor}</div>
                  <div className="font-title-lg text-title-lg text-on-surface">{e.titulo}</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{e.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animales destacados */}
      <section className="w-full py-space-xl lg:py-28 bg-surface scroll-mt-20" id="animales">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
            <div className="space-y-space-xs max-w-xl">
              <div className="inline-flex items-center gap-space-xs text-secondary font-label-md text-label-md uppercase tracking-widest">
                <Icon name="waves" className="text-[16px]" />
                <span>Historias de Superación Costera</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">
                Héroes del Agua Salada para Apadrinar
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Cada pequeño habitante tiene un expediente clínico, una personalidad única y un viaje hacia la libertad
                marina que puedes hacer posible con tu aporte mensual.
              </p>
            </div>
            <Link
              to="/catalogo"
              className="px-space-md py-space-sm bg-surface-container-high rounded-lg text-on-surface hover:bg-surface-container transition-colors font-label-lg text-label-lg self-start md:self-auto"
            >
              Ver Todos
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {destacados.map((animal) => (
              <TarjetaDestacada key={animal.id} animal={animal} onApadrinar={() => apadrinar(animal)} />
            ))}
          </div>
        </div>
      </section>

      {/* Kit del protector */}
      <section className="w-full py-space-xl bg-surface-container-low relative scroll-mt-20" id="kit-protector">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
          <div className="text-center max-w-2xl mx-auto space-y-space-xs">
            <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Vínculo Tangible &amp; Transparente</span>
            <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary">Tu Kit del Protector del Océano</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Tu madrinazgo o padrinazgo va más allá de una donación. Estableces una conexión documental, científica y
              afectiva con el habitante marino que elijas.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {kit.map((k) => (
              <div key={k.titulo} className="bg-surface rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
                <div className="space-y-space-md">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${k.fondo}`}>
                    <Icon name={k.icon} className="text-[32px]" />
                  </div>
                  <h3 className="font-title-lg text-title-lg text-primary">{k.titulo}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{k.texto}</p>
                </div>
                <div className="mt-space-md bg-surface-container-lowest rounded-lg p-space-sm flex items-center gap-2">
                  <Icon name="task_alt" className="text-secondary text-[18px]" />
                  <span className="font-label-md text-label-md text-on-surface">{k.extra}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="w-full py-space-xl lg:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest">Ecos de la Comunidad</span>
              <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary mt-1">
                Testimonios de Quienes Custodian el Mar
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Familias, profesores e investigadores que han adoptado un compromiso duradero con las especies del litoral
              pacífico.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            {testimonios.map((t) => (
              <div key={t.nombre} className="bg-surface-container-low rounded-xl p-space-lg flex flex-col justify-between shadow-sm">
                <div className="space-y-space-sm">
                  <div className="flex items-center gap-1 text-primary" aria-label="5 de 5 estrellas">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Icon key={n} name="star" className="text-[18px]" />
                    ))}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface italic">"{t.texto}"</p>
                </div>
                <div className="pt-space-md flex items-center gap-space-sm">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-title-lg ${t.avatar}`}>{t.iniciales}</div>
                  <div>
                    <span className="font-title-lg text-title-lg text-primary block leading-none">{t.nombre}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{t.rol}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Llamado final */}
      <section className="w-full pb-space-xl bg-surface">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin">
          <div className="bg-primary rounded-2xl p-space-lg lg:p-space-xl text-on-primary relative overflow-hidden shadow-xl">
            <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-primary-container/40 blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center">
              <div className="lg:col-span-8 space-y-space-sm">
                <span className="inline-block font-label-md text-label-md bg-secondary text-on-secondary px-3 py-1 rounded-full uppercase tracking-wider">
                  Compromiso por la Vida Marina
                </span>
                <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg tracking-tight">
                  ¿Listo para convertirte en el guardián de una nueva vida?
                </h2>
                <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-2xl font-light">
                  Las olas no descansan y la marea sigue trayendo cachorros desorientados y tortugas heridas. Cada
                  apadrinamiento financia medicamentos, rescate marítimo y la libertad de quienes no tienen voz.
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-space-sm justify-center">
                <Link
                  className="inline-flex items-center justify-center gap-space-xs bg-secondary-container text-on-secondary-container font-title-lg text-title-lg px-space-lg py-3.5 rounded-lg shadow-md hover:bg-secondary hover:text-on-secondary transition-all text-center"
                  to="/catalogo"
                >
                  <Icon name="favorite" />
                  <span>Apadrinar un Animal Hoy</span>
                </Link>
                <a
                  className="inline-flex items-center justify-center gap-space-xs text-on-primary bg-primary-container/40 hover:bg-primary-container/70 font-label-lg text-label-lg px-space-lg py-3 rounded-lg transition-colors text-center"
                  href="#kit-protector"
                >
                  <span>Conoce Más Sobre la Misión</span>
                  <Icon name="arrow_forward" className="text-[18px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast: se muestra u oculta según el estado, con las mismas clases de animación de antes */}
      <div
        className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0 pointer-events-none'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="bg-primary text-on-primary p-space-md rounded-xl shadow-xl flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
            <Icon name="check" className="text-[20px]" />
          </div>
          <div>
            <div className="font-title-lg text-title-lg">¡{toast?.nombre} seleccionado!</div>
            <div className="font-body-sm text-body-sm text-primary-fixed-dim">
              Aporte sugerido: ${toast?.precio}/mes guardado en tu carrito.
            </div>
          </div>
          <Link
            className="bg-secondary-container text-on-secondary-container px-space-md py-1.5 rounded-md font-label-md text-label-md hover:bg-secondary hover:text-on-secondary transition-colors"
            to="/muelle"
          >
            Finalizar
          </Link>
        </div>
      </div>
    </div>
  )
}

const Burbuja = ({ icon, clase }) => {
  return (
    <div className={`h-10 w-10 rounded-full ring-2 ring-surface flex items-center justify-center ${clase}`}>
      <Icon name={icon} className="text-[18px]" />
    </div>
  )
}

// Un componente = una tarjeta. Antes había 4 bloques HTML casi idénticos copiados;
// ahora hay uno solo que recibe el animal por "props".
const TarjetaDestacada = ({ animal, onApadrinar }) => {
  const { badge, edad } = animal.destacado
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-md flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
      <Link to={`/animales/${animal.id}`} className="relative aspect-square overflow-hidden bg-surface-container block">
        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={animal.alt} src={animal.imagen} />
        <div className="absolute top-3 left-3">
          <span className={`font-label-md text-label-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 ${badge.clase}`}>
            <Icon name={badge.icon} className="text-[14px]" />
            {badge.label}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-md px-2 py-1 rounded-md text-primary font-label-md text-label-md">
          {edad}
        </div>
      </Link>
      <div className="p-space-md space-y-space-sm flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm text-primary">{animal.nombre}</h3>
            <span className="font-label-md text-label-md text-on-surface-variant">{animal.especie}</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 line-clamp-2">{animal.descripcion}</p>
        </div>
        <div className="space-y-1 pt-space-xs">
          <div className="flex justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant">Meta mensual</span>
            <span className="text-secondary font-semibold">{animal.fondo.progreso}%</span>
          </div>
          <BarraProgreso valor={animal.fondo.progreso} />
        </div>
        <div className="pt-space-sm flex items-center justify-between">
          <div>
            <span className="font-label-md text-label-md text-on-surface-variant block">Cuota sugerida</span>
            <span className="font-title-lg text-title-lg text-primary font-bold">
              ${animal.precio} <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">/ mes</span>
            </span>
          </div>
          <button
            type="button"
            onClick={onApadrinar}
            className="bg-primary text-on-primary font-label-lg text-label-lg px-space-md py-2 rounded-lg hover:bg-surface-tint transition-colors flex items-center gap-1"
          >
            <Icon name="favorite" className="text-[18px]" />
            <span>Apadrinar</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Inicio
