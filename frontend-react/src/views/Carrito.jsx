import ItemCarrito from '../components/carrito/ItemCarrito'
import ResumenCarrito from '../components/carrito/ResumenCarrito'

const Carrito = ({ carrito, onQuitar, onConfirmar, onVerCatalogo }) => {
  if (carrito.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-space-xl px-margin-mobile space-y-space-md">
        <h1 className="font-headline-md text-headline-md text-primary">Tu carrito está vacío</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Todavía no elegiste a quién apadrinar.</p>
        <button onClick={onVerCatalogo} className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg">
          Ver catálogo
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
      <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
        <h1 className="font-headline-sm text-headline-sm text-primary">Carrito de Apadrinamiento</h1>
        <ul className="divide-y divide-outline-variant">
          {carrito.map((item) => (
            <ItemCarrito key={item.animal.id} item={item} onQuitar={() => onQuitar(item.animal.id)} />
          ))}
        </ul>
        <button onClick={onVerCatalogo} className="mt-space-md font-label-lg text-label-lg text-secondary hover:underline">
          + Apadrinar otro animal
        </button>
      </div>

      <div className="lg:col-span-5">
        <ResumenCarrito carrito={carrito} onConfirmar={onConfirmar} />
      </div>
    </div>
  )
}

export default Carrito
