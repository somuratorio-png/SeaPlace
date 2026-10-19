import Buscador from '../comunes/Buscador'
import Icono from '../comunes/Icono'
import MensajeError from '../comunes/MensajeError'

const claseSelect =
  'w-full bg-surface-container-lowest px-space-md py-3 rounded-full font-body-sm text-body-sm shadow-sm ring-1 ring-primary-fixed focus:outline-none focus:ring-2 focus:ring-secondary'

// Buscador por texto + filtro por urgencia + orden + "solo favoritos" + rango de cuota mensual.
// No guarda estado propio: recibe los valores y avisa los cambios al Catálogo (componente controlado).
const BarraBusqueda = ({ busqueda, onBusqueda, urgencia, onUrgencia, orden, onOrden, soloFavoritos, onSoloFavoritos, precioMin, onPrecioMin, precioMax, onPrecioMax, errorPrecio, simboloMoneda }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md">
      <div className="md:col-span-2 lg:col-span-5">
        <Buscador valor={busqueda} onCambiar={onBusqueda} textoAyuda="Buscar por nombre, especie o lugar..." />
      </div>

      <select name="urgencia" value={urgencia} onChange={(evento) => onUrgencia(evento.target.value)} aria-label="Filtrar por condición" className={`lg:col-span-4 ${claseSelect}`}>
        <option value="todas">Todas las condiciones</option>
        <option value="critico">🚨 Crítico</option>
        <option value="recuperacion">🌿 En recuperación</option>
        <option value="listo">🌊 Listo para liberación</option>
      </select>

      <select name="orden" value={orden} onChange={(evento) => onOrden(evento.target.value)} aria-label="Ordenar" className={`lg:col-span-3 ${claseSelect}`}>
        <option value="recomendados">Recomendados</option>
        <option value="urgencia">Más urgentes</option>
        <option value="progreso">Menos financiados</option>
        <option value="precio-menor">Menor precio</option>
        <option value="precio-mayor">Mayor precio</option>
        <option value="nombre">Nombre (A-Z)</option>
      </select>

      <div className="lg:col-span-5 flex items-center gap-space-xs">
        <input
          type="number"
          name="precioMin"
          min={0}
          value={precioMin}
          onChange={(evento) => onPrecioMin(evento.target.value)}
          aria-label="Cuota mínima por mes"
          placeholder={`Cuota mínima (${simboloMoneda})`}
          className={claseSelect}
        />
        <span aria-hidden="true" className="font-body-sm text-on-surface-variant">—</span>
        <input
          type="number"
          name="precioMax"
          min={0}
          value={precioMax}
          onChange={(evento) => onPrecioMax(evento.target.value)}
          aria-label="Cuota máxima por mes"
          placeholder={`Cuota máxima (${simboloMoneda})`}
          className={claseSelect}
        />
      </div>

      <button
        onClick={() => onSoloFavoritos(!soloFavoritos)}
        aria-pressed={soloFavoritos}
        className={`md:col-span-2 lg:col-span-2 inline-flex items-center justify-center gap-1 px-space-md py-3 rounded-full font-label-lg text-label-lg shadow-sm transition ${
          soloFavoritos ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container-lowest text-on-surface-variant ring-1 ring-primary-fixed'
        }`}
      >
        <Icono nombre="favorite" clase="text-[18px]" /> Favoritos
      </button>

      {errorPrecio && (
        <div className="md:col-span-2 lg:col-span-5">
          <MensajeError mensaje={errorPrecio} />
        </div>
      )}
    </div>
  )
}

export default BarraBusqueda
