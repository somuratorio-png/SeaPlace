import { heroFoca } from '../../data/imagenes'
import Icono from '../comunes/Icono'

// Portada del inicio: título, texto y botón hacia el catálogo
const Hero = ({ onVerCatalogo }) => {
  return (
    <section className="bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 lg:grid-cols-2 gap-space-xl items-center">
        <div className="space-y-space-md">
          <span className="font-label-md text-label-md text-secondary uppercase tracking-wider">
            Custodia Viva del Pacífico
          </span>
          <h1 className="font-display-lg text-display-lg-mobile lg:text-display-lg text-primary">
            Conecta tu corazón con el latido del Pacífico.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Apadriná un animal marino hoy. Cuidamos a cachorros de foca, nutrias y tortugas que necesitan refugio,
            nutrición especializada y un horizonte libre para volver a nadar.
          </p>
          <button
            onClick={onVerCatalogo}
            className="inline-flex items-center gap-space-xs bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-3 rounded-lg hover:bg-surface-tint"
          >
            <Icono nombre="cruelty_free" />
            Explorar Animales
          </button>
        </div>

        <img src={heroFoca} alt="Foca joven descansando en la arena de la costa" className="w-full aspect-[4/3] object-cover rounded-2xl shadow-xl" />
      </div>
    </section>
  )
}

export default Hero
