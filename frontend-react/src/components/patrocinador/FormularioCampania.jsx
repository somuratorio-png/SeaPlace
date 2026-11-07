import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BotonFormulario from '../comunes/BotonFormulario'
import CampoSelect from '../comunes/CampoSelect'
import CampoTexto from '../comunes/CampoTexto'
import MensajeError from '../comunes/MensajeError'
import Precio from '../comunes/Precio'
import { crearCampania } from '../../Redux/patrocinioSlice'
import { useFormulario } from '../../hooks/useFormulario'
import { hoy } from '../../utils/fechas'
import { intentar } from '../../utils/intentar'

const vacio = { idAnimal: '', tope: '', hasta: '' }

// Una campaña nueva: elegir el animal, hasta cuánto duplicar (en dólares) y hasta cuándo.
// Se ofrecen los animales publicados que todavía no tienen una campaña vigente (de nadie).
// El error del backend lo muestra la página (errorAccion); acá solo el de validar.
const FormularioCampania = ({ campanias }) => {
  const dispatch = useDispatch()
  const { items: animales } = useSelector((state) => state.animales)
  const { datos, cambiar, reiniciar } = useFormulario(vacio)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [creada, setCreada] = useState(false)

  // Los animales con una campaña mía en curso (duplicando o esperando al refugio) no se ofrecen
  const mios = campanias.filter((campania) => campania.vigente || campania.pendiente).map((campania) => campania.idAnimal)
  const disponibles = animales.filter((animal) => animal.publicacion === 'ACTIVA' && animal.patrocinio === null && !mios.includes(animal.id))
  const opciones = [{ valor: '', texto: 'Elegí un animal' }, ...disponibles.map((animal) => ({ valor: String(animal.id), texto: `${animal.nombre} · ${animal.especie}` }))]

  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (datos.idAnimal === '' || datos.tope === '' || datos.hasta === '') {
      setError('Completá todos los campos')
      return
    }
    if (Number(datos.tope) < 50) {
      setError('El tope mínimo es US$ 50')
      return
    }
    setError(null)
    setCreada(false)
    setEnviando(true)
    intentar(dispatch(crearCampania({ idAnimal: Number(datos.idAnimal), tope: Number(datos.tope), hasta: datos.hasta }))).then((mensaje) => {
      setEnviando(false)
      if (mensaje === null) {
        reiniciar()
        setCreada(true)
      }
    })
  }

  return (
    <form onSubmit={enviar} className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Nueva campaña</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        El refugio del animal la tiene que aceptar. Desde ese día, cada peso que un padrino aporte para ese animal lo duplicás vos, hasta llegar al tope. Montos en US$.
      </p>
      <CampoSelect etiqueta="Animal" nombre="idAnimal" valor={datos.idAnimal} onCambiar={cambiar} opciones={opciones} />
      <CampoTexto etiqueta="Tope a duplicar (US$)" nombre="tope" tipo="number" valor={datos.tope} onCambiar={cambiar} ejemplo="500" />
      {datos.tope !== '' && Number(datos.tope) > 0 && (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Equivale a <Precio valor={Number(datos.tope)} />, y moviliza el doble.
        </p>
      )}
      <label htmlFor="hasta" className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-on-surface">Hasta</span>
        <input type="date" id="hasta" name="hasta" min={hoy()} required value={datos.hasta} onChange={cambiar} className="w-full bg-surface-container-low rounded-lg px-space-md py-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40" />
      </label>
      {error && <MensajeError mensaje={error} />}
      {creada && <p className="font-label-md text-label-md text-secondary">¡Propuesta enviada! Cuando el refugio la acepte, aparece el sello y empieza a duplicar.</p>}
      <BotonFormulario deshabilitado={enviando}>Proponer campaña</BotonFormulario>
    </form>
  )
}

export default FormularioCampania
