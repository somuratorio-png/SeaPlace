import { loginFondo } from '../../data/imagenes'

// Mitad izquierda del login: foto de fondo con una frase
const Bienvenida = () => {
  return (
    <div className="relative min-h-64 lg:min-h-full rounded-xl overflow-hidden">
      <img src={loginFondo} alt="Foca descansando en la arena del Pacífico" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="relative p-space-xl text-on-primary space-y-space-md">
        <span className="font-headline-sm text-headline-sm">SeaPlace</span>
        <blockquote className="font-headline-md text-headline-md">
          "Proteger a nuestras focas en las orillas del Pacífico es custodiar el latido vivo del océano."
        </blockquote>
      </div>
    </div>
  )
}

export default Bienvenida
