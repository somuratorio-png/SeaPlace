import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Icono from '../comunes/Icono'
import Portada from '../comunes/Portada'
import Precio from '../comunes/Precio'
import AccionesGracias from './AccionesGracias'
import FilaCertificado from './FilaCertificado'
import TransicionZarpar from './TransicionZarpar'

const AgradecimientoZarpar = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  if (state === null) {
    return <Navigate to="/panel" replace />
  }

  const zarpar = state.zarpar
  const cantidad = zarpar.apadrinados.length

  const verCertificado = (item) => {
    navigate(`/panel/${item.animal.id}/certificado`)
  }

  return (
    <>
      <TransicionZarpar />
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
            <FilaCertificado key={item.id} item={item} onVer={verCertificado} />
          ))}
        </div>

        <AccionesGracias onPanel={() => navigate('/panel')} onCatalogo={() => navigate('/catalogo')} />
      </div>
    </>
  )
}

export default AgradecimientoZarpar