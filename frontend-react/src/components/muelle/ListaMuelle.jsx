import MuelleDetalle from './MuelleDetalle'

// La tarjeta "Tus elegidos": los animales del muelle y un botón para sumar otro.
// onCantidad recibe el ítem y la cantidad nueva; onQuitar recibe el ítem.
const ListaMuelle = ({ muelle, onCantidad, onQuitar, onVerCatalogo }) => {
  return (
    <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm">
      <h2 className="font-headline-sm text-headline-sm text-primary">Tus elegidos</h2>
      <ul className="divide-y divide-outline-variant">
        {muelle.map((item) => (
          <MuelleDetalle key={item.animal.id} item={item} onCantidad={(cantidad) => onCantidad(item, cantidad)} onQuitar={() => onQuitar(item)} />
        ))}
      </ul>
      <button onClick={onVerCatalogo} className="mt-space-md font-label-lg text-label-lg text-secondary hover:underline">
        + Apadrinar otro animal
      </button>
    </div>
  )
}

export default ListaMuelle