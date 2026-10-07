import Icono from './Icono'

const claseBoton =
  'inline-flex items-center gap-1 bg-surface-container-lowest text-primary font-label-lg text-label-lg px-space-md py-space-sm rounded-full shadow-sm ring-1 ring-primary-fixed disabled:opacity-40'

// Botones "Anterior" y "Siguiente" con el número de página. "pagina" empieza en 0, como en el backend.
// Si todo entra en una sola página, no se muestra nada.
const Paginacion = ({ pagina, totalPaginas, onCambiar }) => {
  if (totalPaginas <= 1) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-sm">
      <button onClick={() => onCambiar(pagina - 1)} disabled={pagina === 0} className={claseBoton}>
        <Icono nombre="chevron_left" clase="text-[20px]" /> Anterior
      </button>
      <span className="font-body-sm text-body-sm text-on-surface-variant tabular-nums">
        Página {pagina + 1} de {totalPaginas}
      </span>
      <button onClick={() => onCambiar(pagina + 1)} disabled={pagina === totalPaginas - 1} className={claseBoton}>
        Siguiente <Icono nombre="chevron_right" clase="text-[20px]" />
      </button>
    </div>
  )
}

export default Paginacion
