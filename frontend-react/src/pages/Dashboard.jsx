import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { emblema, noriAsomandose, noriPrincipal } from '../data/imagenes'

// Panel del protector (antes comun/dashboard.html). Solo se ve logueado (ver RutaProtegida en App.jsx).
// Los datos de seguimiento siguen siendo de ejemplo: el backend todavía no expone
// "mis apadrinamientos" (haría falta GET /compras?idUsuario=... con el id del usuario logueado).

const metricas = [
  { titulo: 'Ahijados Activos', icon: 'pets', iconBg: 'bg-surface-container text-primary', valor: '2 Focas Protegidas', valorClase: 'text-primary', nota: <><Icon name="favorite" className="text-sm" /> Nori y Pelusa (Gorditas &amp; seguras)</>, notaClase: 'text-secondary' },
  { titulo: 'Biomasa Marina Suministrada', icon: 'water_voc', iconBg: 'bg-secondary-container text-secondary', valor: '142 kg Arenque Fresco', progreso: 80, nota: '80% de la meta calórica invernal' },
  { titulo: 'Días en Rehabilitación', icon: 'clinical_notes', iconBg: 'bg-surface-container text-tertiary', valor: '54 Días Costeros', nota: <><Icon name="check_circle" className="text-sm" /> 0 infecciones detectadas</>, notaClase: 'text-tertiary' },
  { titulo: 'Condiciones de Marea', icon: 'waves', iconBg: 'bg-tertiary-fixed text-on-tertiary-fixed', valor: 'Marea Baja • 0.4 m', nota: 'Bahía de Monterey • Niebla costera ligera' },
]

const hitos = [
  { icon: 'check_circle', color: 'text-secondary', titulo: 'Reflejo de Inmersión', texto: 'Hasta 9 minutos bajo el agua sin fatiga.' },
  { icon: 'scale', color: 'text-primary', titulo: 'Espesor Graso: 2.8 cm', texto: 'Protección ideal contra corrientes gélidas.' },
  { icon: 'rocket_launch', color: 'text-tertiary', titulo: 'Ventana de Liberación', texto: 'En 18 días, Reserva Marina Islas Coronados.' },
]

export default function Dashboard() {
  const { usuario } = useAuth()

  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute -top-24 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-48 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-gutter-mobile sm:px-gutter lg:px-margin pt-6 pb-space-xl relative">
        {/* Bienvenida */}
        <section className="relative bg-surface-container-lowest rounded-xl shadow-md p-space-md sm:p-space-lg mb-space-lg overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-linear-to-l from-secondary-container/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-surface-container-low flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
                <img alt="Emblema de SeaPlace" className="w-14 h-14 object-contain" src={emblema} />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-secondary ring-2 ring-surface-container-lowest" />
              </div>
              <div>
                <span className="inline-block font-label-md text-label-md bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Custodio de Agua Salada
                </span>
                {/* El nombre sale del token JWT (campo "sub") */}
                <h1 className="font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-primary leading-tight">
                  ¡Hola de nuevo, {usuario.nombreUsuario}!
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">Tus protegidas están tranquilas hoy en Ensenada.</p>
              </div>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-xs shrink-0 self-start md:self-auto">
              <button type="button" className="flex items-center gap-1.5 bg-primary text-on-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-lg hover:bg-surface-tint shadow-sm transition-all duration-200">
                <Icon name="badge" className="text-[18px]" />
                <span>Carnet Oficial de Padrino</span>
              </button>
              <button type="button" className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container font-label-lg text-label-lg px-space-md py-space-sm rounded-lg hover:bg-secondary hover:text-on-secondary transition-all duration-200">
                <Icon name="set_meal" className="text-[18px]" />
                <span>Ración Extra de Arenque</span>
              </button>
            </div>
          </div>
        </section>

        {/* Métricas */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-xl">
          {metricas.map((m) => (
            <div key={m.titulo} className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-space-xs gap-2">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{m.titulo}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${m.iconBg}`}>
                  <Icon name={m.icon} className="text-lg" />
                </div>
              </div>
              <div className={`font-headline-md text-headline-md font-bold ${m.valorClase ?? 'text-on-surface'}`}>{m.valor}</div>
              {m.progreso != null && (
                <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: `${m.progreso}%` }} />
                </div>
              )}
              <p className={`font-body-sm text-body-sm mt-1 flex items-center gap-1 ${m.notaClase ?? 'text-on-surface-variant'}`}>{m.nota}</p>
            </div>
          ))}
        </section>

        {/* Monitoreo */}
        <section className="mb-space-xl">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-space-md">
            <div>
              <span className="font-label-md text-label-md text-secondary tracking-widest uppercase font-semibold">Telemetría Biológica</span>
              <h2 className="font-headline-md text-headline-md text-primary">Mis Focas Ahijadas (Monitoreo en Directo)</h2>
            </div>
            <span className="inline-flex items-center gap-1.5 font-label-md text-label-md text-secondary bg-secondary-container/70 px-3 py-1 rounded-full self-start">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              2 Cámaras de Orilla Transmitiendo
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col group">
              <div className="relative w-full h-72 sm:h-84 overflow-hidden">
                <img alt="Nori y Pelusa descansando sobre arena húmeda del Pacífico" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={noriPrincipal} />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md bg-secondary text-on-secondary shadow-sm">
                    <Icon name="videocam" className="text-xs" /> Transmisión en Vivo: Playa La Misión
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-label-md text-label-md bg-surface/90 text-primary backdrop-blur-sm shadow-sm">
                    <Icon name="thermostat" className="text-xs" /> 16.2°C Arena
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
                  <div>
                    <span className="font-label-md text-label-md text-surface-container uppercase tracking-wider block">Focas de Puerto (Phoca vitulina)</span>
                    <span className="font-headline-sm text-headline-sm text-surface-container-lowest drop-shadow-sm font-bold">Nori &amp; Pelusa • Dúo Rollizo</span>
                  </div>
                  <span className="font-label-md text-label-md bg-primary-container/90 text-on-primary-container px-3 py-1 rounded-lg backdrop-blur-sm shrink-0">Fase 3: Pre-Liberación</span>
                </div>
              </div>
              <div className="p-space-lg flex-1 flex flex-col justify-between">
                <div className="space-y-space-md">
                  <div className="grid grid-cols-3 gap-space-sm bg-surface-container-low p-space-md rounded-xl text-center">
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant block">Peso Conjunto</span>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">34.8 kg</span>
                    </div>
                    <div className="bg-surface-container-lowest/50 rounded-lg py-1">
                      <span className="font-label-md text-label-md text-on-surface-variant block">Autonomía Acuática</span>
                      <span className="font-headline-sm text-headline-sm text-secondary font-bold">88%</span>
                    </div>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface-variant block">Actividad Actual</span>
                      <span className="font-title-lg text-title-lg text-on-surface font-semibold block truncate">Siesta en marea</span>
                    </div>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Excelente termorregulación y comportamiento social en ambas fócidas.</p>
                </div>
                <div className="flex items-center justify-between pt-space-md mt-space-md gap-space-sm">
                  <Link className="inline-flex items-center gap-1 font-label-lg text-label-lg text-primary hover:text-surface-tint font-semibold" to="/animales/nori">
                    <Icon name="history_edu" className="text-[18px]" />
                    <span>Bitácora Veterinaria Completa</span>
                  </Link>
                  <button type="button" className="inline-flex items-center gap-1.5 bg-primary text-on-primary px-space-md py-space-sm rounded-lg font-label-lg text-label-lg hover:bg-surface-tint shadow-sm transition-colors">
                    <Icon name="play_circle" className="text-[18px]" />
                    <span>Ver Cámara 24/7</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col group">
              <div className="relative w-full h-64 sm:h-72 overflow-hidden">
                <img alt="Nori asomándose detrás de una roca en la orilla" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={noriAsomandose} />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-md text-label-md bg-tertiary text-on-tertiary shadow-sm">
                    <Icon name="pin_drop" className="text-xs" /> Arrecife San Jerónimo
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="font-label-md text-label-md text-surface-container uppercase tracking-wider block">Cría Rescatada • 4 Semanas</span>
                  <span className="font-headline-sm text-headline-sm text-surface-container-lowest drop-shadow-sm font-bold">Nori (Cría Rechoncha)</span>
                </div>
              </div>
              <div className="p-space-lg flex-1 flex flex-col justify-between space-y-space-md">
                <div className="space-y-space-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-space-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-secondary" />
                      <span className="font-label-lg text-label-lg text-on-surface font-semibold">Estado: Soleado y descansando</span>
                    </div>
                    <span className="font-label-md text-label-md bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">14.5 kg (+1.8 kg/sem)</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Buen apetito y reflejos natatorios vigorosos esta semana.</p>
                </div>
                <div className="pt-space-sm flex items-center gap-space-xs">
                  <Link to="/animales/nori" className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg py-space-sm rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <Icon name="photo_library" className="text-[18px]" />
                    <span>Galería Diaria</span>
                  </Link>
                  <button type="button" className="flex-1 bg-secondary text-on-secondary hover:bg-on-secondary-container font-label-lg text-label-lg py-space-sm rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <Icon name="send" className="text-[18px]" />
                    <span>Enviar Cariño / Nota</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curva de crecimiento */}
        <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-md mb-space-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm mb-space-lg">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Icon name="trending_up" className="text-secondary text-xl" />
                <span className="font-label-md text-label-md text-secondary tracking-widest uppercase font-semibold">Evolución Nutricional y Biomasa</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary">Curva de Crecimiento • De Rescate a Rechonchas</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Monitoreo de ganancia de peso para asegurar reserva lipídica previa al retorno al Pacífico abierto.</p>
            </div>
            <div className="flex flex-wrap items-center gap-space-md bg-surface-container-low px-space-md py-space-xs rounded-lg self-start md:self-auto">
              <Leyenda punto="w-3 h-3 rounded-full bg-primary">Nori (Cría)</Leyenda>
              <Leyenda punto="w-3 h-3 rounded-full bg-secondary">Pelusa (Juvenil)</Leyenda>
              <Leyenda punto="w-2.5 h-0.5 bg-outline">Umbral Salida</Leyenda>
            </div>
          </div>

          <div className="w-full overflow-x-auto pb-space-sm">
            <div className="min-w-[620px]">
              <div className="relative h-64 w-full bg-surface-container-low/40 rounded-xl p-4 flex flex-col justify-between">
                <div className="absolute inset-0 px-8 py-6 flex flex-col justify-between pointer-events-none opacity-20">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="w-full border-b border-primary" />
                  ))}
                </div>
                {/* En JSX los atributos de SVG van en camelCase: stroke-width -> strokeWidth, stop-color -> stopColor */}
                <svg className="w-full h-44 overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 200" role="img" aria-label="Curva de peso de Nori y Pelusa desde el ingreso hasta hoy">
                  <defs>
                    <linearGradient id="gradPelusa" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#3a6759" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#3a6759" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="gradNori" x1="0%" x2="0%" y1="0%" y2="100%">
                      <stop offset="0%" stopColor="#8c6a52" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8c6a52" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <line opacity="0.6" stroke="#82756d" strokeDasharray="4 4" strokeWidth="1.5" x1="20" x2="680" y1="40" y2="40" />
                  <text className="font-label-md text-[11px]" fill="#82756d" x="600" y="32">Meta: 32+ kg</text>
                  <path d="M 30,160 Q 180,140 320,95 T 670,45 L 670,190 L 30,190 Z" fill="url(#gradPelusa)" />
                  <path d="M 30,160 Q 180,140 320,95 T 670,45" fill="none" stroke="#3a6759" strokeLinecap="round" strokeWidth="3.5" />
                  <path d="M 30,185 Q 180,175 320,150 T 670,110 L 670,190 L 30,190 Z" fill="url(#gradNori)" />
                  <path d="M 30,185 Q 180,175 320,150 T 670,110" fill="none" stroke="#8c6a52" strokeLinecap="round" strokeWidth="3" />
                  <circle cx="30" cy="160" fill="#3a6759" r="4.5" />
                  <circle cx="320" cy="95" fill="#3a6759" r="4.5" />
                  <circle cx="670" cy="45" fill="#3a6759" r="6" />
                  <circle cx="30" cy="185" fill="#8c6a52" r="4" />
                  <circle cx="320" cy="150" fill="#8c6a52" r="4" />
                  <circle cx="670" cy="110" fill="#8c6a52" r="5.5" />
                </svg>
                <div className="flex justify-between text-on-surface-variant font-label-md text-label-md px-4 pt-1">
                  <span>Día 1: Ingreso (Crítico)</span>
                  <span>Día 15: Destete &amp; Papilla</span>
                  <span>Día 30: Piscina de Marea</span>
                  <span>Día 45: Caza Autónoma</span>
                  <span className="text-secondary font-bold">Hoy (Día 54)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-md pt-space-sm">
            {hitos.map((h) => (
              <div key={h.titulo} className="flex items-start gap-space-xs bg-surface-container-low p-space-sm rounded-lg">
                <Icon name={h.icon} className={`${h.color} text-lg mt-0.5`} />
                <div>
                  <span className="font-title-lg text-title-lg text-on-surface block">{h.titulo}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{h.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bitácora + membresía */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-md">
            <div className="flex items-center justify-between mb-space-md gap-2">
              <div>
                <span className="font-label-md text-label-md text-tertiary uppercase tracking-wider font-semibold">Bitácora Científica</span>
                <h3 className="font-headline-sm text-headline-sm text-primary">Diario de Campo de los Biólogos</h3>
              </div>
              <Link className="font-label-lg text-label-lg text-secondary hover:underline flex items-center gap-1" to="/animales/nori">
                <span>Ver bitácora completa</span>
                <Icon name="arrow_forward" className="text-sm" />
              </Link>
            </div>
            <div className="bg-surface-container-low p-space-md rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="font-title-lg text-title-lg text-on-surface">Dra. Claudia Viteri • Jefa de Rescate Costero</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">Hoy • 08:30 AM</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                "Nori y Pelusa durmieron abrazaditas esta mañana. Ambas muestran excelente apetito y vigor en sus juegos en la orilla."
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 bg-linear-to-br from-surface-container-low via-surface-container-lowest to-surface-container rounded-xl p-space-md sm:p-space-lg shadow-md flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-space-sm">
                <Icon name="workspace_premium" className="text-2xl" />
              </div>
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-semibold">Membresía Guardián Activa</span>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-2">Comunidad de Marea Viva</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Gracias a tu apadrinamiento mensual, cubres el 100% de la alimentación biológica de Nori y aportas a la
                conservación de las colonias de focas de Ensenada y Bahía Tortugas.
              </p>
              <div className="mt-space-md space-y-2 bg-surface-container-lowest/60 p-space-sm rounded-lg">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface-variant">Próxima renovación de arenque:</span>
                  <span className="text-primary font-bold">12 de Noviembre</span>
                </div>
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface-variant">Certificado descargable:</span>
                  <span className="text-secondary font-bold">Válido 2026-2027</span>
                </div>
              </div>
            </div>
            <Link to="/catalogo" className="mt-space-md w-full bg-primary text-on-primary font-label-lg text-label-lg py-space-sm rounded-lg hover:bg-surface-tint transition-all shadow-sm flex items-center justify-center gap-2">
              <Icon name="volunteer_activism" className="text-[18px]" />
              <span>Apadrinar otra cría vulnerable</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function Leyenda({ punto, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className={punto} />
      <span className="font-label-md text-label-md text-on-surface">{children}</span>
    </div>
  )
}
