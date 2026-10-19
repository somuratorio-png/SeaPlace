import { useEffect, useState } from 'react'
import Pez from '../marino/Pez'

// Lo que dura la escena, en milisegundos. Las animaciones de index.css (navegar, desvanecer-zarpar, saltar-pez...)
// están pensadas para este tiempo: si se cambia acá, hay que cambiarlas allá.
const DURACION = 4000

// Una tira de olas que se repite: son dos copias de la misma curva, así al correrla media tira vuelve a empezar sin salto.
const TiraOlas = ({ clase, color }) => {
  const curva = 'Q 180 10 360 40 T 720 40 T 1080 40 T 1440 40'
  return (
    <svg viewBox="0 0 2880 90" preserveAspectRatio="none" aria-hidden="true" className={`olas-zarpar absolute bottom-0 left-0 w-[200%] ${clase}`}>
      <path fill={color} d={`M0 40 ${curva} L1440 90 L0 90 Z`} />
      <path fill={color} transform="translate(1440 0)" d={`M0 40 ${curva} L1440 90 L0 90 Z`} />
    </svg>
  )
}

// El velero, de costado y mirando a la derecha
const Velero = () => {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" className="w-full h-full">
      <path fill="#f4a95c" d="M61 6 L76 11 L61 16 Z" />
      <rect x="58" y="6" width="3" height="64" rx="1.5" fill="#3b2a4a" />
      <path fill="#fff6ea" d="M62 14 L62 66 L102 66 Z" />
      <path fill="#fff6ea" opacity="0.85" d="M57 22 L57 66 L26 66 Z" />
      <path fill="#3b2a4a" d="M14 70 L106 70 L92 90 L28 90 Z" />
      <rect x="22" y="72" width="76" height="3" fill="#a8506b" />
    </svg>
  )
}

// Los que saltan fuera del agua: dónde (desde la izquierda), cuándo empiezan (s) y de qué color
const pecesSaltando = [
  { izquierda: '22%', demora: '0.9s', color: '#8fdcd2' },
  { izquierda: '62%', demora: '2s', color: '#f4a95c' },
]

// Los que nadan bajo el agua: a qué altura, cuánto tardan en cruzar (s), cuándo arrancan y su tamaño
const pecesNadando = [
  { abajo: 'bottom-3', duracion: '4.5s', demora: '0s', clase: 'w-10' },
  { abajo: 'bottom-9', duracion: '5.5s', demora: '0.4s', clase: 'w-7' },
  { abajo: 'bottom-5', duracion: '3.8s', demora: '1.2s', clase: 'w-8' },
]

// Se muestra encima de la página de gracias apenas se zarpa: un velero cruza el mar al atardecer, unos peces
// saltan y nadan alrededor, y la escena se desvanece dejando ver los certificados. Tocándola se saltea.
// Si el usuario pidió menos movimiento, no aparece.
const TransicionZarpar = () => {
  const [visible, setVisible] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (!visible) {
      return
    }
    const temporizador = setTimeout(() => setVisible(false), DURACION)
    return () => clearTimeout(temporizador)
  }, [visible])

  if (!visible) {
    return null
  }

  return (
    <div
      role="status"
      aria-label="Zarpando hacia tus certificados"
      onClick={() => setVisible(false)}
      className="transicion-zarpar fondo-mar fixed inset-0 z-[100] overflow-hidden text-on-primary cursor-pointer"
    >
      <div className="resplandor absolute left-1/2 top-[38%] -translate-x-1/2 w-40 h-40 lg:w-56 lg:h-56 rounded-full bg-[#f4a95c]/70 blur-sm" />

      <p className="absolute inset-x-0 top-[18%] text-center px-margin-mobile font-headline-sm text-headline-sm">Zarpando hacia tus certificados…</p>

      <div className="absolute inset-x-0 bottom-0 h-56">
        <TiraOlas clase="h-32 olas-zarpar-lentas" color="#4a6a8f" />

        {/* Saltan desde atrás de la ola de adelante: así entran y salen del agua */}
        {pecesSaltando.map((pez) => (
          <div key={pez.izquierda} className="pez-saltando absolute bottom-10" style={{ left: pez.izquierda, animationDelay: pez.demora }}>
            <Pez clase="w-10 lg:w-12" color={pez.color} />
          </div>
        ))}

        <div className="barco-zarpar absolute bottom-16 left-0 w-28 h-24 lg:w-36 lg:h-32">
          <div className="mecer-barco w-full h-full">
            <Velero />
          </div>
        </div>

        <TiraOlas clase="h-24" color="#1d3f5e" />

        {pecesNadando.map((pez) => (
          <div key={pez.abajo} className={`pez-nadando absolute left-0 ${pez.abajo}`} style={{ animationDuration: pez.duracion, animationDelay: pez.demora }}>
            <Pez clase={pez.clase} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransicionZarpar
