import { useState } from 'react'
import { Link } from 'react-router-dom'
import BarraProgreso from '../components/BarraProgreso'
import Icon from '../components/Icon'
import { useAuth } from '../context/AuthContext'
import { useMuelle } from '../context/MuelleContext'
import { muelleDefault } from '../data/imagenes'

const BOTIQUIN = 5
const SUFIJOS = { monthly: { corto: '/mes', largo: 'USD / mensual' }, yearly: { corto: '/año', largo: 'USD / anual' }, once: { corto: '', largo: 'USD / pago único' } }

// Los items viejos de cart.js guardaban el precio como texto: parseFloat lo cubre
const precioDe = (item) => parseFloat(item.price) || 0
const sufijoDe = (item) => SUFIJOS[item.frequency] ?? SUFIJOS.monthly

const Muelle = () => {
  const { items, quitar, vaciar } = useMuelle()
  const [confirmados, setConfirmados] = useState(null) // los items confirmados, para mostrar el mensaje final

  if (confirmados) return <Confirmacion items={confirmados} />
  if (items.length === 0) return <MuelleVacio />

  return (
    <Checkout
      items={items}
      onRetirar={quitar}
      onConfirmado={() => {
        setConfirmados(items)
        vaciar()
      }}
    />
  )
}

const Checkout = ({ items, onRetirar, onConfirmado }) => {
  const { usuario } = useAuth()

  const [botiquin, setBotiquin] = useState(true)
  const [nombreCertificado, setNombreCertificado] = useState(
    items.find((i) => i.gift?.nombre)?.gift.nombre || usuario?.nombre || usuario?.nombreUsuario || '',
  )
  const [idioma, setIdioma] = useState('es')
  const [entrega, setEntrega] = useState('digital')
  const [metodo, setMetodo] = useState('tarjeta')
  const [enviando, setEnviando] = useState(false)

  // El total se deriva del estado en cada render: suma de todos los animales + botiquín
  const subtotal = items.reduce((suma, item) => suma + precioDe(item), 0)
  const total = subtotal + (botiquin ? BOTIQUIN : 0)
  const nombres = items.map((i) => i.name).join(', ')

  const confirmar = () => {
    setEnviando(true)
    // Mock: el pago se simula con una demora (como en el HTML original); no se envía nada a ningún servidor.
    setTimeout(onConfirmado, 1200)
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin py-space-lg" style={{ background: 'linear-gradient(rgb(252, 249, 243) 0%, rgb(244, 248, 246) 30%, rgb(247, 244, 237) 70%, rgb(252, 249, 243) 100%)' }}>
      <Pasos actual={1} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <div className="lg:col-span-7 space-y-space-lg">
          {/* Animales elegidos */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/30 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex items-center justify-between pb-space-md gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <Icon name="water_drop" filled className="text-secondary text-2xl" />
                <h2 className="font-headline-sm text-headline-sm text-primary">
                  {items.length === 1 ? 'Mamífero Marino Seleccionado' : `${items.length} Animales Seleccionados`}
                </h2>
              </div>
              <span className="font-label-md text-label-md bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" /> Telemetría Activa
              </span>
            </div>

            <ul className="divide-y divide-outline-variant/40">
              {items.map((item) => (
                <ItemMuelle key={item.animalId ?? item.name} item={item} onRetirar={() => onRetirar(item)} />
              ))}
            </ul>

            <div className="pt-space-md flex justify-end">
              <Link to="/catalogo" className="font-label-lg text-label-lg text-secondary hover:underline inline-flex items-center gap-1">
                <Icon name="add" className="text-[18px]" /> Apadrinar otro animal
              </Link>
            </div>
          </div>

          {/* Botiquín */}
          <label className="block bg-surface-container-lowest rounded-xl p-space-lg shadow-sm cursor-pointer">
            <div className="flex items-start justify-between gap-space-md">
              <div className="flex items-start gap-space-md">
                <input
                  checked={botiquin}
                  onChange={(e) => setBotiquin(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-secondary rounded cursor-pointer"
                  type="checkbox"
                />
                <div>
                  <div className="flex items-center gap-space-xs">
                    <Icon name="medical_services" className="text-secondary text-lg" />
                    <span className="font-title-lg text-title-lg text-on-surface">Soporte Extra: Botiquín Costero de Urgencia</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                    Añade un insumo de rescate inmediato (gasas hemostáticas de alginato, electrolitos isotónicos marinos y
                    manta térmica para cachorros varados por marejada).
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-title-lg text-title-lg text-secondary font-semibold">+${BOTIQUIN.toFixed(2)}</span>
                <span className="block font-label-md text-label-md text-outline">USD</span>
              </div>
            </div>
          </label>

          {/* Certificado */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
            <div className="flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <Icon name="workspace_premium" className="text-primary text-xl" />
                <h3 className="font-title-lg text-title-lg text-primary">Personalización del Certificado Oficial</h3>
              </div>
              <span className="font-label-md text-label-md text-secondary bg-secondary-container px-2 py-0.5 rounded-full font-medium">Firma Biológica Sellada</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Se emitirá un documento de tutela por cada animal, avalado con coordenadas de inserción oceánica y folio único de conservación costera.
            </p>
            <label className="block">
              <span className="block font-label-lg text-label-lg text-on-surface mb-space-xs">Nombre del Protector o Homenajeado en el Diploma</span>
              <div className="relative">
                <Icon name="badge" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />
                <input
                  className="w-full bg-surface-container-low rounded-lg pl-10 pr-space-md py-space-sm font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary transition-all placeholder:text-outline"
                  type="text"
                  placeholder="Ej. Sofía Morales & Familia"
                  value={nombreCertificado}
                  onChange={(e) => setNombreCertificado(e.target.value)}
                />
              </div>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <Opciones
                titulo="Idioma del Certificado"
                valor={idioma}
                onChange={setIdioma}
                opciones={[{ id: 'es', label: 'Español' }, { id: 'en', label: 'English' }]}
              />
              <Opciones
                titulo="Modalidad de Entrega"
                valor={entrega}
                onChange={setEntrega}
                activo="bg-secondary-container text-on-secondary-container font-semibold"
                opciones={[{ id: 'digital', label: 'Digital 0% Co2', icon: 'eco' }, { id: 'postal', label: 'Alga Reciclada', icon: 'markunread_mailbox' }]}
              />
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="lg:col-span-5">
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md space-y-space-md lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-primary">Resumen</h3>
              <span className="font-label-md text-label-md text-secondary bg-secondary-container px-2.5 py-0.5 rounded-full font-semibold">Suscripción Segura</span>
            </div>
            <div className="space-y-space-sm text-body-sm font-body-sm">
              {items.map((item) => (
                <Linea
                  key={item.animalId ?? item.name}
                  label={`Apadrinamiento ${item.name}${item.plan ? ` (${item.plan})` : ''}`}
                  valor={`$${precioDe(item).toFixed(2)}${sufijoDe(item).corto}`}
                />
              ))}
              {botiquin && <Linea label="Botiquín de Rescate Costero" valor={`$${BOTIQUIN.toFixed(2)}`} />}
              <Linea label="Custodia Telemetría & Actualizaciones" valor="Gratuito" gratis />
              <Linea label="Emisión de Certificados Oficiales" valor="Incluido" gratis />
              <div className="pt-space-sm mt-space-sm flex items-baseline justify-between">
                <div>
                  <span className="font-title-lg text-title-lg text-on-surface block">Total a pagar hoy</span>
                  <span className="font-label-md text-label-md text-outline">Primer cobro de cada apadrinamiento</span>
                </div>
                <div className="text-right">
                  <div className="font-display-lg-mobile text-display-lg-mobile text-primary leading-tight font-bold">${total.toFixed(2)}</div>
                  <span className="font-label-md text-label-md text-tertiary">USD</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg space-y-space-xs">
              <div className="flex items-center gap-space-xs text-primary font-title-lg text-body-sm">
                <Icon name="waves" filled className="text-base text-secondary" />
                <span>Impacto Garantizado</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                Tu aporte cubre la bioseguridad, el filtrado de piscinas de agua salada y revisiones ecográficas para {nombres}.
              </p>
              <BarraProgreso valor={82} fondo="bg-surface-container-highest" />
            </div>

            <div className="space-y-space-sm pt-space-xs">
              <span className="font-label-lg text-label-lg text-on-surface block">Seleccionar Método de Custodia</span>
              <div className="grid grid-cols-3 gap-space-xs">
                {[
                  { id: 'tarjeta', icon: 'credit_card', label: 'Tarjeta' },
                  { id: 'wallet', icon: 'account_balance_wallet', label: 'Apple / GPay' },
                  { id: 'paypal', icon: 'paid', label: 'PayPal' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMetodo(m.id)}
                    aria-pressed={metodo === m.id}
                    className={`py-space-sm rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                      metodo === m.id ? 'bg-surface-container-high text-on-surface shadow-sm ring-1 ring-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <Icon name={m.icon} className={`text-xl ${metodo === m.id ? 'text-primary' : ''}`} />
                    <span className="font-label-md text-label-md">{m.label}</span>
                  </button>
                ))}
              </div>
              {metodo === 'tarjeta' && (
                <div className="space-y-space-xs pt-space-xs">
                  <Campo label="Número de Tarjeta" icon="credit_card" placeholder="4500 •••• •••• 1982" autoComplete="cc-number" />
                  <div className="grid grid-cols-2 gap-space-xs">
                    <Campo label="Vencimiento" placeholder="MM/AA" autoComplete="cc-exp" />
                    <Campo label="CVC / CVV" placeholder="•••" type="password" maxLength={4} autoComplete="cc-csc" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={confirmar}
              disabled={enviando}
              className="w-full bg-primary hover:bg-surface-tint active:scale-[0.99] disabled:opacity-80 text-on-primary py-space-md rounded-lg font-headline-sm text-headline-sm transition-all shadow-md flex items-center justify-center gap-space-sm group"
            >
              {enviando ? (
                <>
                  <Icon name="progress_activity" className="animate-spin text-xl" />
                  <span>Cargando custodia oceánica...</span>
                </>
              ) : (
                <>
                  <Icon name="shield" className="text-secondary-fixed-dim group-hover:scale-110 transition-transform" />
                  <span>Confirmar (${total.toFixed(2)})</span>
                </>
              )}
            </button>
            <p className="font-label-md text-label-md text-outline text-center">
              Cancela o pausa tu apadrinamiento con 1 solo clic desde tu Área de Protector cuando lo desees.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Un animal dentro del muelle
const ItemMuelle = ({ item, onRetirar }) => {
  const sufijo = sufijoDe(item)
  return (
    <li className="py-space-md first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-space-md items-start">
      <div className="relative w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
        <img className="w-full h-full object-cover" alt={`Foto de ${item.name}`} src={item.image || muelleDefault} />
      </div>
      <div className="flex-1 space-y-space-xs min-w-0 w-full">
        <div className="flex items-start justify-between gap-space-sm">
          <div className="min-w-0">
            <h3 className="font-title-lg text-title-lg text-on-surface">
              {item.name}
              {item.species && <span className="text-on-surface-variant font-normal"> • {item.species}</span>}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              <strong className="text-primary">{item.plan || 'Apadrinamiento Estándar'}</strong>
            </p>
            {item.gift?.nombre && (
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <Icon name="featured_seasonal_and_gifts" className="text-sm text-tertiary" /> Regalo para {item.gift.nombre}
              </p>
            )}
          </div>
          <div className="text-right shrink-0">
            <div className="font-headline-sm text-headline-sm text-primary">${precioDe(item).toFixed(2)}</div>
            <span className="font-label-md text-label-md text-outline">{sufijo.largo}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-space-sm">
          {item.animalId && (
            <>
              <Link to={`/animales/${item.animalId}`} className="font-label-md text-label-md text-tertiary hover:text-primary transition-colors flex items-center gap-0.5">
                <Icon name="tune" className="text-base" /> Cambiar Plan
              </Link>
              <span className="text-surface-container-highest">•</span>
            </>
          )}
          <button type="button" onClick={onRetirar} className="font-label-md text-label-md text-error hover:text-on-error-container transition-colors flex items-center gap-0.5">
            <Icon name="delete" className="text-base" /> Retirar
          </button>
        </div>
      </div>
    </li>
  )
}

const Pasos = ({ actual }) => {
  const pasos = ['Resumen de Apadrinamiento', 'Datos del Protector', 'Certificado & Paz']
  return (
    <div className="w-full max-w-3xl mx-auto mb-space-xl">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-5 w-full h-1 bg-surface-container-high rounded-full" />
        <div className="absolute left-0 top-5 h-1 bg-secondary rounded-full transition-all duration-500" style={{ width: `${(actual / pasos.length) * 100}%` }} />
        {pasos.map((p, i) => {
          const n = i + 1
          const hecho = n <= actual
          return (
            <div key={p} className="relative z-10 flex flex-col items-center gap-space-xs text-center">
              <div className={`w-10 h-10 rounded-full font-headline-sm text-headline-sm flex items-center justify-center ${hecho ? 'bg-primary text-on-primary shadow-md' : 'bg-surface-container text-on-surface-variant'}`}>
                {n}
              </div>
              <span className={`font-label-lg text-label-lg ${hecho ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>{p}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const Opciones = ({ titulo, valor, onChange, opciones, activo = 'bg-primary text-on-primary shadow-sm' }) => {
  return (
    <div>
      <span className="block font-label-lg text-label-lg text-on-surface mb-space-xs">{titulo}</span>
      <div className="grid grid-cols-2 gap-space-xs" role="group" aria-label={titulo}>
        {opciones.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={valor === o.id}
            className={`py-space-sm px-space-xs rounded-lg font-label-lg text-label-lg text-center flex items-center justify-center gap-1 transition-all ${
              valor === o.id ? activo : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {o.icon && <Icon name={o.icon} className="text-sm" />} {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

const Linea = ({ label, valor, gratis = false }) => {
  return (
    <div className="flex justify-between gap-space-sm text-on-surface-variant">
      <span>{label}</span>
      <span className={gratis ? 'text-secondary font-medium' : 'font-title-lg text-body-sm text-on-surface font-semibold'}>{valor}</span>
    </div>
  )
}

const Campo = ({ label, icon, ...inputProps }) => {
  return (
    <label className="block">
      <span className="block font-label-md text-label-md text-on-surface-variant mb-1">{label}</span>
      <div className="relative">
        {icon && <Icon name={icon} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg" />}
        <input
          type="text"
          {...inputProps}
          className={`w-full bg-surface-container-low rounded-lg ${icon ? 'pl-10' : 'px-space-md'} pr-space-md py-space-sm font-body-sm text-body-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-secondary placeholder:text-outline`}
        />
      </div>
    </label>
  )
}

const MuelleVacio = () => {
  return (
    <div className="max-w-2xl text-center bg-surface-container-lowest rounded-xl p-space-xl shadow-sm my-space-xl mx-margin-mobile sm:mx-auto">
      <Icon name="shopping_cart" className="text-5xl text-outline" />
      <h2 className="font-headline-sm text-headline-sm text-primary mt-space-md">Tu carrito está vacío</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
        Todavía no elegiste a quién apadrinar. Volvé al catálogo y elegí un animal para continuar.
      </p>
      <Link className="inline-flex items-center gap-1.5 bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-surface-tint transition-all mt-space-md" to="/catalogo">
        <Icon name="pets" className="text-[18px]" />
        <span>Ver catálogo</span>
      </Link>
    </div>
  )
}

const Confirmacion = ({ items }) => {
  return (
    <div className="max-w-2xl mx-auto text-center bg-surface-container-lowest rounded-xl p-space-xl shadow-sm my-space-xl">
      <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container text-secondary flex items-center justify-center">
        <Icon name="check_circle" className="text-4xl" />
      </div>
      <h2 className="font-headline-md text-headline-md text-primary mt-space-md">¡Apadrinamiento exitoso!</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
        Gracias por sumarte a la custodia de {items.map((i) => i.name).join(", ")}. Te vamos a enviar {items.length === 1 ? "el certificado" : "los certificados"} y las primeras novedades.
      </p>
      <div className="flex flex-wrap justify-center gap-space-sm mt-space-md">
        <Link className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-surface-tint" to="/panel">
          Ir a mi Área de Protector
        </Link>
        <Link className="bg-surface-container text-on-surface font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-surface-container-high" to="/catalogo">
          Apadrinar otro animal
        </Link>
      </div>
    </div>
  )
}

export default Muelle
