import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Portada from '../comunes/Portada'
import ListaMuelle from './ListaMuelle'
import MuelleVacio from './MuelleVacio'
import ResumenMuelle from './ResumenMuelle'
import { cambiarCantidad, quitarDelMuelle } from '../../Redux/muelleSlice'
import { intentar } from '../../utils/intentar'

// El muelle del usuario: los animales que eligió, con cuántos cupos toma de cada uno.
// Llegó con la sesión, así que no hay nada que pedir al montarse. Cada cambio llama al backend
// (muelleSlice) y, con lo que contesta, se actualizan los ítems. Si falla, el mensaje se muestra arriba de la página.
const PanelMuelle = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { state } = useLocation()
  const { items: muelle } = useSelector((state) => state.muelle)

  // El botiquín viaja con la navegación: si se vuelve desde zarpar, queda como estaba
  const [conBotiquin, setConBotiquin] = useState(state !== null && state.conBotiquin === true)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

  const verCatalogo = () => {
    navigate('/catalogo')
  }

  const handleCantidad = (item, cantidad) => {
    setErrorAccion(null)
    intentar(dispatch(cambiarCantidad({ item, cantidad })), setErrorAccion)
  }

  const handleQuitar = (item) => {
    setErrorAccion(null)
    intentar(dispatch(quitarDelMuelle(item.animal.id)), setErrorAccion)
  }

  if (muelle.length === 0) {
    return <MuelleVacio onVerCatalogo={verCatalogo} />
  }

  return (
    <>
      <Portada
        icono="anchor"
        etiqueta="Muelle de apadrinamiento"
        titulo="Ya casi son parte de tu familia"
        texto={`Tenés ${muelle.length} ${muelle.length === 1 ? 'animal' : 'animales'} esperando tu confirmación.`}
      />

      {errorAccion && (
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin pt-space-lg">
          <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <ListaMuelle muelle={muelle} onCantidad={handleCantidad} onQuitar={handleQuitar} onVerCatalogo={verCatalogo} />

        <div className="lg:col-span-5">
          <ResumenMuelle muelle={muelle} conBotiquin={conBotiquin} onBotiquin={setConBotiquin} onZarpar={() => navigate('/zarpar', { state: { conBotiquin } })} />
        </div>
      </div>
    </>
  )
}

export default PanelMuelle