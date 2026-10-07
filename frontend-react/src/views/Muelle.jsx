import MuelleDetalle from '../components/muelle/MuelleDetalle'
import ResumenMuelle from '../components/muelle/ResumenMuelle'
import Portada from '../components/comunes/Portada'

const Muelle = ({ muelle, conBotiquin, onBotiquin, onCantidad, onQuitar, onZarpar, onVerCatalogo }) => {
  if (muelle.length === 0) {
    return (
      <>
        <Portada icono="anchor" etiqueta="Muelle de apadrinamiento" titulo="Tu muelle está vacío" texto="Todavía no elegiste a quién apadrinar." />
        <div className="text-center py-space-lg px-margin-mobile">
          <button onClick={onVerCatalogo} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
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

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Tus elegidos</h2>
          <ul className="divide-y divide-outline-variant">
            {muelle.map((item) => (
              <MuelleDetalle
                key={item.animal.id}
                item={item}
                onCantidad={(cantidad) => onCantidad(item.animal.id, cantidad)}
                onQuitar={() => onQuitar(item.animal.id)}
              />
            ))}
          </ul>
          <button onClick={onVerCatalogo} className="mt-space-md font-label-lg text-label-lg text-secondary hover:underline">
            + Apadrinar otro animal
          </button>
        </div>

        <div className="lg:col-span-5">
          <ResumenMuelle muelle={muelle} conBotiquin={conBotiquin} onBotiquin={onBotiquin} onZarpar={onZarpar} />
        </div>
      </div>
    </>
  )
}

export default Muelle
