import Icono from './Icono'
import Olas from './Olas'

// Franja de mar con el título de la página, que termina en olas sobre la arena
const Portada = ({ icono, etiqueta, titulo, texto }) => {
  return (
    <section className="fondo-mar text-on-primary relative overflow-hidden">
      <span className="burbuja w-24 h-24 right-[8%] top-6" />
      <span className="burbuja w-10 h-10 right-[22%] top-24" style={{ animationDelay: '2s' }} />
      <span className="burbuja w-16 h-16 right-[38%] -top-4" style={{ animationDelay: '4s' }} />

      <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin pt-space-xl pb-20 lg:pb-24 flex flex-wrap items-center gap-space-lg">
        <div className="w-16 h-16 shrink-0 rounded-full bg-white/15 ring-1 ring-white/30 flex items-center justify-center">
          <Icono nombre={icono} clase="text-[32px]" />
        </div>
        <div className="max-w-2xl space-y-space-xs">
          <span className="font-label-md text-label-md uppercase tracking-wider text-secondary-fixed">{etiqueta}</span>
          <h1 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg">{titulo}</h1>
          <p className="font-body-md text-body-md text-primary-fixed">{texto}</p>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0">
        <Olas />
      </div>
    </section>
  )
}

export default Portada
