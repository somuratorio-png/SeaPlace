import { heroFoca } from '../../data/imagenes'
import Icono from '../comunes/Icono'
import Olas from '../comunes/Olas'

// Portada del inicio: título, texto y botón hacia el catálogo, sobre un fondo de mar
const Hero = ({ onVerCatalogo }) => {
  return (
    <section className="fondo-mar text-on-primary relative overflow-hidden">
      <span className="burbuja w-40 h-40 -left-10 top-10" />
      <span className="burbuja w-14 h-14 left-[42%] top-16" style={{ animationDelay: '2s' }} />
      <span className="burbuja w-24 h-24 right-[6%] bottom-32" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin pt-space-xl pb-24 lg:pb-32 grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-center">
        <div className="space-y-space-md">
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
            className="inline-flex items-center gap-space-xs bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-3 rounded-full shadow-lg transition hover:bg-tertiary-container hover:-translate-y-0.5"
          >
            <Icono nombre="cruelty_free" />
            Explorar Animales
          </button>
        </div>

        <img
          src={heroFoca}
          alt="Foca joven descansando en la arena de la costa"
          className="w-full aspect-[4/3] object-cover rounded-[2rem] shadow-2xl ring-4 ring-white/40 lg:rotate-2"
        />
      </div>

      <div className="absolute bottom-0 inset-x-0">
        <Olas />
      </div>
    </section>
  )
}

export default Hero
