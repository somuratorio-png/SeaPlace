import { useState } from 'react'
import CampoTextarea from '../comunes/CampoTextarea'
import MensajeError from '../comunes/MensajeError'
import CamposAnimal from './CamposAnimal'
import PreciosPlanes from './PreciosPlanes'
import { useFormulario } from '../../hooks/useFormulario'

// Los campos que no pueden quedar vacíos (los mismos que al publicarlo)
const OBLIGATORIOS = ['nombre', 'especie', 'edad', 'ubicacion', 'descripcion', 'precio', 'precioMarea', 'cuposTotales']

// Los datos del animal tal como los cargó el refugio, en el formato del formulario.
// Se usa "ficha" y no especie/edad/ubicación directamente porque esos traen un texto de relleno cuando faltan.
const datosDe = (animal) => ({
  nombre: animal.nombre,
  especie: animal.ficha.especie,
  categoria: animal.categoria,
  urgencia: animal.urgencia,
  edad: animal.ficha.edad,
  ubicacion: animal.ficha.ubicacion,
  precio: String(animal.precio),
  precioMarea: String(animal.preciosPorPlan.MAREA_PROFUNDA ?? ''),
  cuposTotales: String(animal.cuposTotales),
  descripcion: animal.descripcion,
})

// Corrige los datos de un animal: su ficha, su historia, los precios de los planes y los cupos.
// Mientras espera la aprobación los cambios se aplican enseguida. Si ya está publicado, se mandan a revisión:
// un administrador los aprueba y, mientras tanto, la publicación se sigue viendo como está.
// onGuardar lo manda al backend y devuelve un mensaje de error, o null si salió bien.
const FormularioDatosAnimal = ({ animal, categorias, onGuardar }) => {
  const { datos, cambiar } = useFormulario(datosDe(animal))
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false) // true mientras se espera la respuesta del backend
  const [guardado, setGuardado] = useState(false)
  const conRevision = animal.publicacion !== 'PENDIENTE'

  const guardar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (OBLIGATORIOS.some((campo) => !String(datos[campo]).trim())) {
      setError('Faltan algunos datos: revisá los campos vacíos.')
      return
    }
    setEnviando(true)
    setGuardado(false)
    const limpios = {
      ...datos,
      nombre: datos.nombre.trim(),
      especie: datos.especie.trim(),
      edad: datos.edad.trim(),
      ubicacion: datos.ubicacion.trim(),
      descripcion: datos.descripcion.trim(),
    }
    onGuardar(animal.id, limpios).then((mensaje) => {
      setEnviando(false)
      setError(mensaje)
      setGuardado(mensaje === null)
    })
  }

  return (
    <form onSubmit={guardar} className="space-y-space-md">
      <h4 className="font-label-lg text-label-lg text-on-surface">Editar los datos de {animal.nombre}</h4>
      {conRevision && (
        <p className="bg-primary-fixed text-on-primary-fixed-variant rounded-xl px-space-md py-space-sm font-body-sm text-body-sm">
          Como {animal.nombre} ya está publicado, revisamos los cambios antes de aplicarlos. Mientras tanto se sigue viendo como está ahora.
          {animal.cambioPendiente && ' Ya tenés cambios esperando revisión: si mandás otros, reemplazan a los anteriores.'}
        </p>
      )}
      <CamposAnimal datos={datos} categorias={categorias} onCambiar={cambiar} />
      <PreciosPlanes datos={datos} onCambiar={cambiar} />
      <CampoTextarea etiqueta="Su historia (cómo llegó, qué le pasó, cómo está hoy)" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />

      {error && <MensajeError mensaje={error} />}
      <div className="flex flex-wrap items-center gap-space-md">
        <button type="submit" disabled={enviando} className="bg-secondary text-on-secondary font-label-lg text-label-lg px-space-md py-space-sm rounded-full disabled:opacity-60">
          {enviando ? 'Enviando…' : conRevision ? 'Enviar cambios a revisión' : 'Guardar cambios'}
        </button>
        {guardado && (
          <span className="font-label-md text-label-md text-secondary">
            {conRevision ? '¡Listo! Te avisamos en Notificaciones cuando los revisemos.' : '¡Listo! Ya se ven los datos nuevos.'}
          </span>
        )}
      </div>
    </form>
  )
}

export default FormularioDatosAnimal
