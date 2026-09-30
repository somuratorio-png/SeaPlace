import { useState } from 'react'

const Footer = () => {
  const [suscripto, setSuscripto] = useState(false)

  const suscribirse = (evento) => {
    evento.preventDefault()
    setSuscripto(true)
  }

  return (
    <footer className="w-full bg-surface-container-low mt-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        <div className="space-y-space-sm">
          <span className="font-headline-sm text-headline-sm text-primary">SeaPlace</span>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Custodia científica de mamíferos marinos, tortugas y ecosistemas del Pacífico costero.
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">© 2026 SeaPlace. Todos los derechos reservados.</p>
        </div>

        <div className="space-y-space-sm">
          <span className="font-title-lg text-title-lg text-on-surface block">Ecos del Océano</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Recibí novedades de los rescates y de los animales que apadrinás.
          </p>
          {suscripto ? (
            <p className="font-label-lg text-label-lg text-secondary">¡Listo! Te vamos a escribir pronto.</p>
          ) : (
            <form onSubmit={suscribirse} className="flex gap-space-xs">
              <input
                type="email"
                required
                placeholder="correo@pacifico.org"
                className="flex-1 bg-surface rounded-lg px-space-md py-space-sm font-body-sm text-body-sm"
              />
              <button type="submit" className="bg-primary text-on-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-lg">
                Suscribirme
              </button>
            </form>
          )}
        </div>
      </div>
    </footer>
  )
}

export default Footer
