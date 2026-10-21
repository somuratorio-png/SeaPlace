import { useState } from 'react'

const FormularioSuscripcion = () => {
  const [mail, setMail] = useState('')
  const [error, setError] = useState(null)
  const [suscripto, setSuscripto] = useState(false)

  const handleChange = (evento) => {
    setMail(evento.target.value)
  }

  const suscribirse = (evento) => {
    evento.preventDefault()
    if (mail.trim() === '') {
      setError('Escribí tu correo para suscribirte')
      return
    }
    setError(null)
    setMail('')
    setSuscripto(true)
  }

  return (
    <div className="space-y-space-sm">
      <span className="font-title-lg text-title-lg block">Ecos del Océano</span>
      <p className="font-body-sm text-body-sm text-primary-fixed">
        Recibí novedades de los rescates y de los animales que apadrinás.
      </p>
      {suscripto ? (
        <p className="font-label-lg text-label-lg text-secondary-fixed">¡Listo! Te vamos a escribir pronto.</p>
      ) : (
        <>
          <form onSubmit={suscribirse} className="flex gap-space-sm">
            <label htmlFor="mailSuscripcion" className="sr-only">Tu correo</label>
            <input
              id="mailSuscripcion"
              type="email"
              name="mail"
              value={mail}
              onChange={handleChange}
              placeholder="correo@pacifico.org"
              className="flex-1 min-w-0 bg-white/95 text-on-surface rounded-full px-space-md py-space-sm font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary-fixed"
            />
            <button type="submit" className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-md py-space-sm rounded-full hover:bg-tertiary-container">
              Suscribirme
            </button>
          </form>
          {error && <p className="font-label-lg text-label-lg text-error-container">{error}</p>}
        </>
      )}
    </div>
  )
}

export default FormularioSuscripcion