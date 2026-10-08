import { useState } from 'react'

// Publica una novedad del animal, que sus padrinos leen en la bitácora
const FormularioNovedad = ({ animal, onPublicar }) => {
  const [texto, setTexto] = useState('')
  const [publicada, setPublicada] = useState(false)

  // onPublicar la manda al backend y devuelve un mensaje de error, o null si salió bien
  const publicar = async (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const mensaje = await onPublicar(animal.id, texto.trim())
    if (mensaje === null) {
      setTexto('')
      setPublicada(true)
    }
  }

  return (
    <form onSubmit={publicar} className="space-y-space-sm">
      <h4 className="font-label-lg text-label-lg text-on-surface">Publicar novedad para sus padrinos</h4>
      <textarea
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
        required
        rows="2"
        placeholder={`¿Cómo está ${animal.nombre} hoy?`}
        className="w-full bg-surface-container-lowest rounded-lg px-space-md py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40"
      />
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
