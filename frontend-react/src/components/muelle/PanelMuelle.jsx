import MuelleDetalle from './MuelleDetalle'
import ResumenMuelle from './ResumenMuelle'
import Portada from '../comunes/Portada'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import { useMuelle } from '../../hooks/useMuelle'

// El muelle del usuario: los animales que eligió, con cuántos cupos toma de cada uno.
// "muelle" son sus ítems, que tiene App. Cada cambio llama al backend y, con lo que contesta, le pasa
// a Sitio los ítems como quedaron (onCambiar). Si falla, onError muestra el mensaje arriba de la página.
const PanelMuelle = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  const { items: muelle, cambiarCantidad, quitar } = useMuelle()

  // El botiquín viaja con la navegación: si se vuelve desde zarpar, queda como estaba
  const [conBotiquin, setConBotiquin] = useState(state !== null && state.conBotiquin === true)
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló

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
    return (
      <>
        <Portada icono="anchor" etiqueta="Muelle de apadrinamiento" titulo="Tu muelle está vacío" texto="Todavía no elegiste a quién apadrinar." />
        <div className="text-center py-space-lg px-margin-mobile">
          <button onClick={verCatalogo} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
            Ver catálogo
          </button>
        </div>
      </>
    )
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
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Tus elegidos</h2>
          <ul className="divide-y divide-outline-variant">
            {muelle.map((item) => (
              <MuelleDetalle
                key={item.animal.id}
                item={item}
                onCantidad={(cantidad) => handleCantidad(item, cantidad)}
                onQuitar={() => handleQuitar(item)}
              />
            ))}
          </ul>
          <button onClick={verCatalogo} className="mt-space-md font-label-lg text-label-lg text-secondary hover:underline">
            + Apadrinar otro animal
          </button>
        </div>

        <div className="lg:col-span-5">
          <ResumenMuelle 
            muelle={muelle}
            conBotiquin={conBotiquin}
            onBotiquin={setConBotiquin}
            onZarpar={() => navigate('/zarpar', { state: { conBotiquin } })}
          />
        </div>
      </div>
    </>
  )
}

export default PanelMuelle
