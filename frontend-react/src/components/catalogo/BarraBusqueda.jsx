import Icono from '../comunes/Icono'

// Buscador por texto + filtro por urgencia médica.
// No guarda estado propio: recibe los valores y avisa los cambios al Catálogo (componente controlado).
const BarraBusqueda = ({ busqueda, onBusqueda, urgencia, onUrgencia }) => {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-space-md">
      <label className="relative">
        <Icono nombre="search" clase="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
        <input
          type="text"
          value={busqueda}
          onChange={(evento) => onBusqueda(evento.target.value)}
          placeholder="Buscar por nombre, especie o lugar..."
          className="w-full bg-surface-container-low pl-10 pr-4 py-2.5 rounded-lg font-body-sm text-body-sm"
        />
      </label>

      <select
        value={urgencia}
        onChange={(evento) => onUrgencia(evento.target.value)}
        className="w-full bg-surface-container-low px-3 py-2.5 rounded-lg font-body-sm text-body-sm"
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
