import Icono from '../components/comunes/Icono'
import Portada from '../components/comunes/Portada'
import Precio from '../components/comunes/Precio'

// Se muestra después de zarpar (confirmar el muelle). zarpar = { apadrinados, total }
// Acá mismo se entrega el certificado de cada animal apadrinado.
const Gracias = ({ zarpar, onVerCertificado, onVerPanel, onVerCatalogo }) => {
  const cantidad = zarpar.apadrinados.length

  return (
    <>
      <Portada
        icono="sailing"
        etiqueta="¡Zarpaste!"
        titulo="¡Gracias por sumarte!"
        texto={`Ya sos protector de ${cantidad} ${cantidad === 1 ? 'animal' : 'animales'} del Pacífico.`}
      />

      <div className="max-w-3xl mx-auto px-margin-mobile py-space-lg space-y-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-xl text-center space-y-space-md">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary-container text-secondary flex items-center justify-center">
            <Icono nombre="check_circle" clase="text-[36px]" />
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Registramos tu pago de{' '}
            <b className="text-primary">
              <Precio valor={zarpar.total} />
            </b>
            . Tus certificados ya están listos.
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-lg space-y-space-md">
          <h2 className="font-headline-sm text-headline-sm text-primary">Tus certificados de apadrinamiento</h2>
          {zarpar.apadrinados.map((item) => (
            <div key={item.id} className="flex flex-wrap items-center gap-space-md">
              <img src={item.animal.imagen} alt={`Foto de ${item.animal.nombre}`} className="w-16 h-16 object-cover rounded-full" />
              <div className="flex-1 min-w-40">
                <p className="font-title-lg text-title-lg text-on-surface">{item.animal.nombre}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Plan {item.plan.nombre}</p>
              </div>
              <button
                onClick={() => onVerCertificado(item)}
                className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container"
              >
                <Icono nombre="workspace_premium" clase="text-[20px]" /> Ver certificado
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-space-md">
          <button onClick={onVerPanel} className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
            Ir a mi panel
          </button>
          <button onClick={onVerCatalogo} className="bg-primary-fixed text-on-primary-fixed-variant font-label-lg text-label-lg px-space-lg py-space-sm rounded-full">
            Seguir viendo animales
          </button>
        </div>
      </div>
    </>
  )
}

export default Gracias
