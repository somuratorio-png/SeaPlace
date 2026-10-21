import Icono from './Icono'

const MarcaFooter = () => {
  return (
    <div className="space-y-space-sm">
      <span className="inline-flex items-center gap-space-xs font-headline-sm text-headline-sm">
        <Icono nombre="sailing" /> SeaPlace
      </span>
      <p className="font-body-md text-body-md text-primary-fixed max-w-md">
        Custodia científica de mamíferos marinos, tortugas y ecosistemas del Pacífico costero.
      </p>
      <p className="font-body-sm text-body-sm text-primary-fixed-dim">© 2026 SeaPlace. Todos los derechos reservados.</p>
    </div>
  )
}

export default MarcaFooter