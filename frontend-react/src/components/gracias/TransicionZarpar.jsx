import { useEffect, useState } from 'react'
import Pez from '../marino/Pez'

const DURACION = 4000

const TiraOlas = ({ clase, color }) => {
  const curva = 'Q 180 10 360 40 T 720 40 T 1080 40 T 1440 40'
  return (
    <svg viewBox="0 0 2880 90" preserveAspectRatio="none" aria-hidden="true" className={`olas-zarpar absolute bottom-0 left-0 w-[200%] ${clase}`}>
      <path fill={color} d={`M0 40 ${curva} L1440 90 L0 90 Z`} />
      <path fill={color} transform="translate(1440 0)" d={`M0 40 ${curva} L1440 90 L0 90 Z`} />
    </svg>
  )
}

const Velero = () => {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true" className="w-full h-full overflow-visible">
      <path fill="#e0714a" d="M60 4 Q 68 5 75 9 Q 68 10 60 12 Z" />
      <rect x="58" y="4" width="2.6" height="66" rx="1.3" fill="#3b2a4a" />

      <path fill="#fff6ea" d="M62 12 Q 86 36 101 64 L62 64 Z" />
      <path fill="#f1dcc6" d="M62 12 Q 70 36 72 64 L62 64 Z" />
      <path fill="#fff6ea" opacity="0.92" d="M56 20 Q 38 42 25 64 L56 64 Z" />

      <path fill="#3b2a4a" d="M8 67 Q 60 73 114 65 L100 86 Q 60 93 23 86 Z" />
      <path fill="#a8506b" d="M10 70 Q 60 76 112 68 L110 72 Q 60 80 12 74 Z" />
      <circle cx="44" cy="80" r="2.4" fill="#f4a95c" />
      <circle cx="58" cy="81" r="2.4" fill="#f4a95c" />
    </svg>
  )
}

const Estela = () => {
  return (
    <svg viewBox="0 0 80 20" aria-hidden="true" className="estela-zarpar absolute -left-14 bottom-[14%] w-20 h-5">
      <path d="M78 10 Q 60 4 40 9 T 2 8" fill="none" stroke="#fff6ea" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      <path d="M74 15 Q 56 11 36 15 T 10 14" fill="none" stroke="#fff6ea" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  )
}

const Gaviota = ({ clase }) => {
  return (
    <svg viewBox="0 0 24 10" aria-hidden="true" className={`planear absolute w-7 ${clase}`}>
      <path d="M1 7 Q 6 1 12 7 Q 18 1 23 7" fill="none" stroke="#fff6ea" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

const pecesSaltando = [
  { izquierda: '22%', demora: '0.9s', color: '#8fdcd2' },
  { izquierda: '62%', demora: '2s', color: '#f4a95c' },
]

const pecesNadando = [
  { abajo: 'bottom-3', duracion: '4.5s', demora: '0s', clase: 'w-10' },
  { abajo: 'bottom-9', duracion: '5.5s', demora: '0.4s', clase: 'w-7' },
  { abajo: 'bottom-5', duracion: '3.8s', demora: '1.2s', clase: 'w-8' },
]

const TransicionZarpar = () => {
  const [visible, setVisible] = useState(true)

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

      <Gaviota clase="left-[18%] top-[30%]" />
      <Gaviota clase="left-[72%] top-[24%] w-5" />

      <p className="absolute inset-x-0 top-[18%] text-center px-margin-mobile font-headline-sm text-headline-sm">Zarpando hacia tus certificados…</p>

      <div className="absolute inset-x-0 bottom-0 h-56">
        <TiraOlas clase="h-32 olas-zarpar-lentas" color="#4a6a8f" />

        {pecesSaltando.map((pez) => (
          <div key={pez.izquierda} className="pez-saltando absolute bottom-10" style={{ left: pez.izquierda, animationDelay: pez.demora }}>
            <Pez clase="w-10 lg:w-12" color={pez.color} />
          </div>
        ))}

        <div className="barco-zarpar absolute bottom-8 left-0 w-28 h-24 lg:w-36 lg:h-32">
          <div className="mecer-barco relative w-full h-full">
            <Estela />
            <Velero />
          </div>
        </div>

        <TiraOlas clase="h-24" color="#1d3f5e" />

        <div className="resplandor absolute left-1/2 bottom-2 -translate-x-1/2 flex flex-col items-center gap-1.5" aria-hidden="true">
          <span className="block h-1 w-28 rounded-full bg-[#f4a95c]/50" />
          <span className="block h-1 w-20 rounded-full bg-[#f4a95c]/40" />
          <span className="block h-1 w-12 rounded-full bg-[#f4a95c]/30" />
        </div>

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
