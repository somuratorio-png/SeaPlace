import { useState } from 'react'
import MensajeError from '../comunes/MensajeError'

const LARGO_MAXIMO = 500

// Escribir un comentario. onEnviar(texto) lo manda al backend y devuelve un mensaje de error, o null si salió bien.
// El error del backend lo muestra la página (lo lee de errorAccion en el store); acá solo se muestra
// el de validar, y si falló se deja el texto para no perder lo escrito.
// "compacto" es la versión chica que va debajo de cada novedad de la bitácora.
const FormularioComentario = ({ onEnviar, placeholder, textoBoton = 'Comentar', compacto = false }) => {
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (!texto.trim()) {
      setError('Escribí algo antes de comentar')
      return
    }
    setError(null)
    setEnviando(true)
    onEnviar(texto.trim()).then((mensaje) => {
      setEnviando(false)
      if (mensaje === null) {
        setTexto('')
      }
    })
  }

  return (
    <form onSubmit={enviar} className="space-y-space-sm">
      <textarea
        name="comentario"
        aria-label="Comentario"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        maxLength={LARGO_MAXIMO}
        rows={compacto ? 1 : 3}
        placeholder={placeholder}
        className="w-full bg-surface-container-low rounded-lg px-space-md py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
      />
      {error && <MensajeError mensaje={error} />}
      <div className="flex items-center justify-between gap-space-md">
        <span className="font-label-md text-label-md text-on-surface-variant">
          {texto.length}/{LARGO_MAXIMO}
        </span>
        <button
          type="submit"
          disabled={enviando}
          className={`bg-secondary text-on-secondary font-label-lg text-label-lg rounded-full disabled:opacity-60 ${compacto ? 'px-space-md py-1' : 'px-space-md py-space-sm'}`}
        >
          {enviando ? 'Enviando…' : textoBoton}
        </button>
      </div>
    </form>
  )
}

export default FormularioComentario
