import { useState } from 'react'

const claseCampo = 'w-full bg-surface-container-lowest rounded-lg px-space-md py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary/40'

// Informa la última posición conocida del animal (la que marca su transmisor).
// Es la que ven en el mapa de rastreo los padrinos con el plan más alto.
const FormularioUbicacion = ({ animal, onRegistrar }) => {
  const [latitud, setLatitud] = useState('')
  const [longitud, setLongitud] = useState('')
  const [registrada, setRegistrada] = useState(false)

  // onRegistrar la manda al backend y devuelve un mensaje de error, o null si salió bien
  const registrar = async (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const mensaje = await onRegistrar(animal.id, Number(latitud), Number(longitud))
    if (mensaje === null) {
      setLatitud('')
      setLongitud('')
      setRegistrada(true)
    }
  }

  return (
    <form onSubmit={registrar} className="space-y-space-sm">
      <h4 className="font-label-lg text-label-lg text-on-surface">Informar su ubicación</h4>
      <div className="grid grid-cols-2 gap-space-sm">
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Latitud</span>
          <input type="number" step="any" min="-90" max="90" required placeholder="-33.16" value={latitud} onChange={(evento) => setLatitud(evento.target.value)} className={claseCampo} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-label-md text-label-md text-on-surface-variant">Longitud</span>
          <input type="number" step="any" min="-180" max="180" required placeholder="-71.99" value={longitud} onChange={(evento) => setLongitud(evento.target.value)} className={claseCampo} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-space-md">
        <button type="submit" className="bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full">
          Registrar
        </button>
        {registrada && <span className="font-label-md text-label-md text-secondary">¡Registrada!</span>}
      </div>
    </form>
  )
}

export default FormularioUbicacion
