import { useEffect, useRef } from 'react'

const Modal = ({ titulo, mensaje, textoConfirmar, textoCancelar = 'Cancelar', onConfirmar, onCancelar, peligro = false }) => {
  const caja = useRef(null)

  useEffect(() => {
    caja.current.showModal()
  }, [])

  const alClicDeFondo = (evento) => {
    if (evento.target === caja.current) {
      onCancelar()
    }
  }

  const alEscape = (evento) => {
    evento.preventDefault()
    onCancelar()
  }

  return (
    <dialog
      ref={caja}
      aria-label={titulo}
      onClick={alClicDeFondo}
      onCancel={alEscape}
      className="m-auto w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-md p-space-lg text-left font-normal normal-case tracking-normal backdrop:bg-black/40"
    >
      <div className="space-y-space-md">
        <h3 className="font-title-lg text-title-lg text-on-surface">{titulo}</h3>
        <p className="font-body-md text-body-md text-on-surface-variant">{mensaje}</p>
        <div className="flex flex-wrap justify-end gap-space-sm">
          <button
            type="button"
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
    </dialog>
  )
}

export default Modal
