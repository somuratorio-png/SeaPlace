import { useState } from 'react'
import MensajeError from '../comunes/MensajeError'

const FormularioNovedad = ({ animal, onPublicar }) => {
  const [texto, setTexto] = useState('')
  const [publicada, setPublicada] = useState(false)
  const [error, setError] = useState(null)

  const publicar = (evento) => {
    evento.preventDefault()
    if (!texto.trim()) {
      setError('Completá todos los campos')
      return
    }
    setError(null)
    onPublicar(animal.id, texto.trim()).then((mensaje) => {
      if (mensaje === null) {
        setTexto('')
        setPublicada(true)
      }
    })
  }

  return (
    <form onSubmit={publicar} className="space-y-space-sm">
      <h4 className="font-label-lg text-label-lg text-on-surface">Publicar novedad para sus padrinos</h4>
      <textarea
        name="texto"
        aria-label="Novedad"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        required
        rows="2"
        placeholder={`¿Cómo está ${animal.nombre} hoy?`}
        className="w-full bg-surface-container-lowest rounded-lg px-space-md py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
      />
      {error && <MensajeError mensaje={error} />}
      <div className="flex flex-wrap items-center gap-space-md">
        <button type="submit" className="bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full">
          Publicar
        </button>
        {publicada && <span className="font-label-md text-label-md text-secondary">¡Publicada! Ya la ven sus padrinos.</span>}
      </div>
    </form>
  )
}

export default FormularioNovedad
