// Cartel de confirmación sobre toda la pantalla. Se cierra con "Cancelar", con Escape o tocando el fondo.
// "children" es opcional: lo que haga falta completar antes de confirmar (por ejemplo, un campo de texto).
// Se dibuja con React (un fondo fijo y la caja encima), sin tocar el DOM a mano. autoFocus pone el foco
// en "Cancelar" al abrirlo, así Escape funciona enseguida y Enter no confirma algo peligroso sin querer.
const Modal = ({ titulo, mensaje, textoConfirmar, textoCancelar = 'Cancelar', onConfirmar, onCancelar, peligro = false, children }) => {
  const alTeclear = (evento) => {
    if (evento.key === 'Escape') {
      onCancelar()
    }
  }

  // Solo cuenta si se tocó el fondo, no la caja
  const alClicDeFondo = (evento) => {
    if (evento.target === evento.currentTarget) {
      onCancelar()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
      onClick={alClicDeFondo}
      onKeyDown={alTeclear}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 px-space-md text-left font-normal normal-case tracking-normal"
    >
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-md p-space-lg space-y-space-md">
        <h3 className="font-title-lg text-title-lg text-on-surface">{titulo}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">{mensaje}</p>
        {children}
        <div className="flex flex-wrap justify-end gap-space-sm">
          <button
            type="button"
            autoFocus
            onClick={onCancelar}
            className="font-label-lg text-label-lg px-space-md py-space-sm rounded-full bg-surface-container-lowest text-on-surface-variant ring-1 ring-primary-fixed"
          >
            {textoCancelar}
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className={`font-label-lg text-label-lg px-space-md py-space-sm rounded-full ${peligro ? 'bg-error text-on-error' : 'bg-primary text-on-primary'}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal
