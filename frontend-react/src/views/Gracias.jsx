import Icono from '../components/comunes/Icono'
import Portada from '../components/comunes/Portada'
import Precio from '../components/comunes/Precio'

// Se muestra después de pagar. compra = { cantidad, total }
const Gracias = ({ compra, onVerPanel, onVerCatalogo }) => {
  return (
    <>
      <Portada
        icono="celebration"
        etiqueta="Pago confirmado"
        titulo="¡Gracias por sumarte!"
        texto={`Ya sos protector de ${compra.cantidad} ${compra.cantidad === 1 ? 'animal' : 'animales'} del Pacífico.`}
      />

      <div className="max-w-2xl mx-auto px-margin-mobile py-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-xl text-center space-y-space-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <Icono nombre="check_circle" clase="text-[36px]" />
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Registramos tu primer pago de{' '}
            <b className="text-primary">
              <Precio valor={compra.total} />
            </b>
            . Desde tu panel podés ver su bitácora, descargar el certificado y seguir cómo se recupera.
          </p>
          <div className="flex flex-wrap justify-center gap-space-sm">
            <button onClick={onVerPanel} className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-surface-tint">
              Ir a mi panel
            </button>
            <button onClick={onVerCatalogo} className="bg-primary-fixed text-on-primary-fixed-variant font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
              Seguir viendo animales
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Gracias
