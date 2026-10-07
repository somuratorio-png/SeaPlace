import { useState } from 'react'
import { reiniciarDatos } from '../../hooks/useEstadoGuardado'
import Algas from '../marino/Algas'
import Concha from '../marino/Concha'
import Estrella from '../marino/Estrella'
import Pez from '../marino/Pez'
import Icono from './Icono'
import Olas from './Olas'

const Footer = () => {
  const [suscripto, setSuscripto] = useState(false)

  const suscribirse = (evento) => {
    evento.preventDefault()
    setSuscripto(true)
  }

  return (
    <footer className="w-full mt-space-xl print:hidden">
      {/* Las olas tienen el mismo color con el que arranca el fondo del footer */}
      <Olas clase="text-primary -mb-px" />

      <div className="fondo-mar-profundo text-on-primary relative overflow-hidden">
        {/* Fondo del mar: peces que cruzan, algas en los costados, una estrella y una concha sobre el fondo */}
        <div className="nadar top-6">
          <Pez clase="w-12" />
        </div>
        <div className="nadar top-24" style={{ animationDelay: '-17s', animationDuration: '52s' }}>
          <Pez clase="w-8" color="#ffb59e" />
        </div>
        <Algas clase="w-16 lg:w-24 absolute left-2 bottom-0 opacity-70" />
        <Algas clase="w-14 lg:w-20 absolute right-6 bottom-0 opacity-70" />
        <Estrella clase="w-10 absolute left-24 lg:left-32 bottom-3 opacity-90" />
        <Concha clase="w-9 absolute right-28 lg:right-36 bottom-3 opacity-90" />

        <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <div className="space-y-space-sm">
            <span className="inline-flex items-center gap-space-xs font-headline-sm text-headline-sm">
              <Icono nombre="sailing" /> SeaPlace
            </span>
            <p className="font-body-md text-body-md text-primary-fixed max-w-md">
              Custodia científica de mamíferos marinos, tortugas y ecosistemas del Pacífico costero.
            </p>
            <p className="font-body-sm text-body-sm text-primary-fixed-dim">© 2026 SeaPlace. Todos los derechos reservados.</p>
            {/* Como los datos de prueba quedan guardados en el navegador, este botón los vuelve al estado inicial */}
            <button onClick={reiniciarDatos} className="font-body-sm text-body-sm text-primary-fixed-dim underline hover:text-on-primary">
              Reiniciar datos de demo
            </button>
          </div>

          <div className="space-y-space-sm">
            <span className="font-title-lg text-title-lg block">Ecos del Océano</span>
            <p className="font-body-sm text-body-sm text-primary-fixed">
              Recibí novedades de los rescates y de los animales que apadrinás.
            </p>
            {suscripto ? (
              <p className="font-label-lg text-label-lg text-secondary-fixed">¡Listo! Te vamos a escribir pronto.</p>
            ) : (
              <form onSubmit={suscribirse} className="flex gap-space-sm">
                <input
                  type="email"
                  required
                  placeholder="correo@pacifico.org"
                  className="flex-1 min-w-0 bg-white/95 text-on-surface rounded-full px-space-md py-space-sm font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-fixed"
                />
                <button type="submit" className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-tertiary-container">
                  Suscribirme
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
