import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Portada from '../comunes/Portada'
import ListaMuelle from './ListaMuelle'
import MuelleVacio from './MuelleVacio'
import ResumenMuelle from './ResumenMuelle'
import { useMuelle } from '../../hooks/useMuelle'

const PanelMuelle = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { items: muelle, cambiarCantidad, quitar } = useMuelle()

  const [conBotiquin, setConBotiquin] = useState(state !== null && state.conBotiquin === true)
  const [errorAccion, setErrorAccion] = useState(null)

  const verCatalogo = () => {
    navigate('/catalogo')
  }

  const handleCantidad = (item, cantidad) => {
    setErrorAccion(null)
    cambiarCantidad(item, cantidad).catch((falla) => {
      setErrorAccion(falla.message)
    })
  }

  const handleQuitar = (item) => {
    setErrorAccion(null)
    quitar(item).catch((falla) => {
      setErrorAccion(falla.message)
    })
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