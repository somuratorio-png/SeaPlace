import Icono from './Icono'

// Barra de búsqueda con lupa. Es "controlada": el texto lo guarda la página que la usa.
const Buscador = ({ valor, onCambiar, textoAyuda }) => {
  return (
    <label className="relative block">
      <Icono nombre="search" clase="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
      <input
        type="text"
        value={valor}
        onChange={(evento) => onCambiar(evento.target.value)}
        placeholder={textoAyuda}
        className="w-full bg-surface-container-lowest pl-12 pr-4 py-3 rounded-full font-body-sm text-body-sm shadow-sm ring-1 ring-primary-fixed focus:outline-none focus:ring-2 focus:ring-secondary"
      />
    </label>
  )
}

export default Buscador
