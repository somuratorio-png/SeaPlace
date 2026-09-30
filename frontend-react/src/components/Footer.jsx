import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

export default function Footer() {
  const [suscripto, setSuscripto] = useState(false)

  return (
    <footer className="w-full bg-surface-container-low mt-space-xl">
      <div className="max-w-7xl mx-auto px-margin py-space-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg mb-space-xl">
          <div className="md:col-span-5 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-3 h-3 rounded-full bg-secondary" />
              <span className="font-headline-sm text-headline-sm text-primary">SeaPlace</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              Custodia meditativa y científica de mamíferos marinos, quelonios y ecosistemas del Pacífico costero.
              Fomentando vínculos directos de protección y preservación ambiental.
            </p>
            <div className="flex flex-wrap gap-space-sm pt-space-xs">
              <Sello icon="verified" color="text-secondary">Santuario Protegido</Sello>
              <Sello icon="waves" color="text-tertiary">Telemetría Satelital</Sello>
              <Sello icon="spa" color="text-primary">Huella de Carbono Neutral</Sello>
            </div>
          </div>

          <div className="md:col-span-3 space-y-space-sm">
            <span className="font-title-lg text-title-lg text-on-surface block mb-space-sm">Explorar Santuario</span>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" to="/catalogo">Focas Comunes &amp; Elefantes Marinos</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/catalogo">Nutrias de Mar &amp; Bosques de Quelpos</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/catalogo">Tortugas Carey del Pacífico</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/#kit-protector">Expediciones &amp; Reportes Oceanográficos</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-space-sm">
            <span className="font-title-lg text-title-lg text-on-surface block">Ecos del Océano</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Recibe bitácoras de migración quincenales, temperaturas de marea y actualizaciones de rescates costeros.
            </p>
            {suscripto ? (
              <p className="font-label-lg text-label-lg text-secondary flex items-center gap-1 pt-space-xs">
                <Icon name="check_circle" className="text-[18px]" /> ¡Listo! Te vamos a escribir pronto.
              </p>
            ) : (
              <form
                className="flex flex-col sm:flex-row gap-space-xs pt-space-xs"
                onSubmit={(e) => {
                  e.preventDefault()
                  setSuscripto(true)
                }}
              >
                <input
                  className="flex-1 bg-surface rounded-lg px-space-md py-space-sm font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="correo@pacifico.org"
                  type="email"
                  required
                  aria-label="Tu correo electrónico"
                />
                <button
                  className="bg-primary text-on-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-lg hover:bg-surface-tint transition-all"
                  type="submit"
                >
                  Suscribirme
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
          <p>© 2026 SeaPlace. Todos los derechos reservados.</p>
          <span className="font-label-md text-label-md text-tertiary">Conservación Biológica Activa</span>
        </div>
      </div>
    </footer>
  )
}

function Sello({ icon, color, children }) {
  return (
    <span className={`inline-flex items-center gap-1 font-label-md text-label-md bg-surface-container px-space-sm py-1 rounded-full ${color}`}>
      <Icon name={icon} className="text-sm" />
      {children}
    </span>
  )
}
