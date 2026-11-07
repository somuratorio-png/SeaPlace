// Interruptor del registro: "Quiero apadrinar", "Soy un refugio" o "Soy una empresa".
// tipoCuenta es el elegido ('padrino' | 'refugio' | 'patrocinador'); onCambiar recibe el nuevo.
const opciones = [
  { tipo: 'padrino', texto: 'Quiero apadrinar' },
  { tipo: 'refugio', texto: 'Soy un refugio' },
  { tipo: 'patrocinador', texto: 'Soy una empresa' },
]

const SelectorTipoCuenta = ({ tipoCuenta, onCambiar }) => {
  return (
    <div className="grid grid-cols-3 gap-space-xs bg-primary-fixed/70 rounded-full p-1" role="group" aria-label="Tipo de cuenta">
      {opciones.map((opcion) => (
        <button
          key={opcion.tipo}
          type="button"
          onClick={() => onCambiar(opcion.tipo)}
          aria-pressed={tipoCuenta === opcion.tipo}
          className={`py-space-sm px-1 rounded-full font-label-lg text-label-lg transition ${tipoCuenta === opcion.tipo ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'}`}
        >
          {opcion.texto}
        </button>
      ))}
    </div>
  )
}

export default SelectorTipoCuenta
