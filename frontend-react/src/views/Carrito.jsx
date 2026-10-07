import ItemCarrito from '../components/carrito/ItemCarrito'
import ResumenCarrito from '../components/carrito/ResumenCarrito'
import Portada from '../components/comunes/Portada'

const Carrito = ({ carrito, onQuitar, onConfirmar, onVerCatalogo }) => {
  if (carrito.length === 0) {
    return (
      <>
        <Portada icono="shopping_cart" etiqueta="Carrito de apadrinamiento" titulo="Tu carrito está vacío" texto="Todavía no elegiste a quién apadrinar." />
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
        icono="shopping_cart"
        etiqueta="Carrito de apadrinamiento"
        titulo="Ya casi son parte de tu familia"
        texto={`Tenés ${carrito.length} ${carrito.length === 1 ? 'animal' : 'animales'} esperando tu confirmación.`}
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Tus elegidos</h2>
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
    </>
  )
}

export default Carrito
