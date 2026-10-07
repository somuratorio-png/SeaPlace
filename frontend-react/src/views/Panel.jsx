import TarjetaApadrinado from '../components/panel/TarjetaApadrinado'

// Área del protector: muestra los animales que el usuario ya apadrinó
const Panel = ({ usuario, apadrinados, onVerCatalogo, onVerApadrinado }) => {
  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary">¡Hola de nuevo, {usuario.nombre}!</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Tenés {apadrinados.length} {apadrinados.length === 1 ? 'animal apadrinado' : 'animales apadrinados'}.
        </p>
      </div>

      {apadrinados.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-xl p-space-xl text-center space-y-space-md">
          <p className="font-body-md text-body-md text-on-surface-variant">Todavía no apadrinaste a ningún animal.</p>
          <button onClick={onVerCatalogo} className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg">
            Elegir un animal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {apadrinados.map((item) => (
            <TarjetaApadrinado key={item.animal.id} item={item} onVer={onVerApadrinado} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Panel
