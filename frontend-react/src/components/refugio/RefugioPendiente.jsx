import Icono from '../comunes/Icono'
import Portada from '../comunes/Portada'

// Lo que ve un refugio recién registrado: no puede publicar hasta que un administrador lo apruebe
const RefugioPendiente = ({ usuario }) => {
  return (
    <>
      <Portada icono="hourglass_top" etiqueta="Mi refugio" titulo={`${usuario.nombre} ${usuario.apellido}`} texto="Tu refugio está esperando la aprobación de SeaPlace." />
      <div className="max-w-2xl mx-auto px-margin-mobile py-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-xl text-center space-y-space-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
            <Icono nombre="pending_actions" clase="text-[32px]" />
          </div>
          <h2 className="font-headline-sm text-headline-sm text-primary">Solicitud pendiente</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Un administrador tiene que revisar tu solicitud. Apenas la apruebe, vas a poder publicar animales y recibir padrinos desde acá.
          </p>
        </div>
      </div>
    </>
  )
}

export default RefugioPendiente