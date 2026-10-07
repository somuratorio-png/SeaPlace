import Buscador from '../comunes/Buscador'

// Buscador por texto + filtro por urgencia médica.
// No guarda estado propio: recibe los valores y avisa los cambios al Catálogo (componente controlado).
const BarraBusqueda = ({ busqueda, onBusqueda, urgencia, onUrgencia }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
      <div className="md:col-span-2">
        <Buscador valor={busqueda} onCambiar={onBusqueda} textoAyuda="Buscar por nombre, especie o lugar..." />
      </div>

      <select
        value={urgencia}
        onChange={(evento) => onUrgencia(evento.target.value)}
        aria-label="Filtrar por condición"
        className="w-full bg-surface-container-lowest px-space-md py-3 rounded-full font-body-sm text-body-sm shadow-sm ring-1 ring-primary-fixed focus:outline-none focus:ring-2 focus:ring-secondary"
      >
        <option value="todas">Todas las condiciones</option>
        <option value="critico">🚨 Crítico</option>
        <option value="recuperacion">🌿 En recuperación</option>
        <option value="listo">🌊 Listo para liberación</option>
      </select>
    </div>
  )
}

export default BarraBusqueda
