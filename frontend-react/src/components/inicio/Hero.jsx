import { heroFoca } from '../../data/imagenes'
import Icono from '../comunes/Icono'
import Olas from '../comunes/Olas'
import Atardecer from '../marino/Atardecer'

// Portada del inicio: título, texto y botón hacia el catálogo, sobre un cielo de atardecer
const Hero = ({ onVerCatalogo }) => {
  return (
    <section className="fondo-mar text-on-primary relative overflow-hidden">
      <Atardecer />

      <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin pt-space-xl pb-24 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-center">
        <div className="escalonar space-y-space-md">
          <span className="inline-flex items-center gap-space-xs bg-white/15 ring-1 ring-white/30 rounded-full px-space-md py-1 font-label-md text-label-md uppercase tracking-wider">
            <Icono nombre="waves" clase="text-[16px]" />
            Custodia Viva del Pacífico
          </span>
          <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg">
            Conecta tu corazón con el latido del Pacífico.
          </h1>
          <p className="font-body-lg text-body-lg text-primary-fixed">
            Apadriná un animal marino hoy. Cuidamos a cachorros de foca, nutrias y tortugas que necesitan refugio,
            nutrición especializada y un horizonte libre para volver a nadar.
          </p>
          <button
            onClick={onVerCatalogo}
            className="brillo inline-flex items-center gap-space-xs bg-white text-tertiary font-label-lg text-label-lg px-space-lg py-3 rounded-full shadow-lg transition hover:bg-tertiary-fixed hover:-translate-y-0.5"
          >
            <Icono nombre="cruelty_free" />
            Explorar Animales
          </button>
        </div>

        <img
          src={heroFoca}
          alt="Foca joven descansando en la arena de la costa"
          className="w-full aspect-[4/3] object-cover rounded-[2rem] shadow-2xl ring-4 ring-white/40 mecer"
        />
      </div>

      <div className="absolute bottom-0 inset-x-0">
        <Olas />
      </div>
    </section>
  )
}

export default Hero
