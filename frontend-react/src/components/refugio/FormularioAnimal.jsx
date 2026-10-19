import { useState } from 'react'
import CampoArchivo from '../comunes/CampoArchivo'
import CampoTextarea from '../comunes/CampoTextarea'
import MensajeError from '../comunes/MensajeError'
import CamposAnimal from './CamposAnimal'
import PreciosPlanes from './PreciosPlanes'
import VistaPreviaFotos from './VistaPreviaFotos'
import { useFormulario } from '../../hooks/useFormulario'

// categoria queda vacía hasta que se elige una: mientras tanto vale la primera de la lista
const formularioVacio = {
  nombre: '',
  especie: '',
  categoria: '',
  urgencia: 'recuperacion',
  edad: '',
  ubicacion: '',
  precioBrisa: '',
  precio: '', // el del plan Guardián de la Bahía
  precioMarea: '',
  cuposTotales: '',
  descripcion: '',
}

// Formulario para publicar un animal nuevo en el catálogo. "categorias" son las del backend.
// onGuardar lo manda al backend y devuelve un mensaje de error, o null si salió bien.
const FormularioAnimal = ({ categorias, onGuardar }) => {
  const { datos, cambiar, reiniciar } = useFormulario(formularioVacio)
  const [fotos, setFotos] = useState([]) // [{ archivo, vistaPrevia }]: cada archivo elegido y una dirección temporal para mostrarlo
  const [error, setError] = useState(null)
  const [publicado, setPublicado] = useState(false) // true después de publicar: se avisa que espera la aprobación
  const [enviando, setEnviando] = useState(false) // true mientras se espera la respuesta del backend
  const [claveFotos, setClaveFotos] = useState(0) // al cambiarla, React vuelve a crear el selector de archivos, vacío

  // Se guardan los archivos originales (el backend se encarga de achicarlos). URL.createObjectURL
  // da una dirección temporal del archivo que sirve como src de la miniatura.
  // Las fotos elegidas se suman a las que ya había y el selector se vacía: la lista de miniaturas
  // es la que manda, así el selector no queda diciendo "3 archivos" después de sacar uno.
  const elegirFotos = (evento) => {
    const nuevas = [...evento.target.files].map((archivo) => ({ archivo, vistaPrevia: URL.createObjectURL(archivo) }))
    setFotos((actuales) => [...actuales, ...nuevas])
    setClaveFotos((actual) => actual + 1)
  }

  // Saca una foto de la lista y libera su dirección temporal
  const quitarFoto = (indice) => {
    URL.revokeObjectURL(fotos[indice].vistaPrevia)
    setFotos((actuales) => actuales.filter((_, posicion) => posicion !== indice))
  }

  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (
      !datos.nombre.trim() ||
      !datos.especie.trim() ||
      !datos.edad.trim() ||
      !datos.ubicacion.trim() ||
      !datos.descripcion.trim() ||
      !datos.precioBrisa.trim() ||
      !datos.precio.trim() ||
      !datos.precioMarea.trim() ||
      !datos.cuposTotales.trim()
    ) {
      setError('Faltan algunos datos: revisá los campos vacíos.')
      return
    }
    if (!categorias.length) {
      setError('No hay categorías disponibles')
      return
    }
    setEnviando(true)
    setPublicado(false)
    // Si no tocó el selector de categoría, se manda la primera (la que se ve elegida)
    const limpios = {
      ...datos,
      nombre: datos.nombre.trim(),
      especie: datos.especie.trim(),
      edad: datos.edad.trim(),
      ubicacion: datos.ubicacion.trim(),
      descripcion: datos.descripcion.trim(),
      categoria: datos.categoria || categorias[0].id,
    }
    onGuardar(limpios, fotos.map((foto) => foto.archivo)).then((mensaje) => {
      setEnviando(false)
      setError(mensaje)
      if (mensaje === null) {
        setPublicado(true)
        reiniciar()
        setFotos([])
        setClaveFotos((actual) => actual + 1)
      }
    })
  }

  return (
    <form onSubmit={enviar} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
      <div className="space-y-1">
        <h2 className="font-title-lg text-title-lg text-on-surface">Sumá un nuevo rescatado</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Contanos quién es, cómo llegó y qué necesita. Con su historia y algunas fotos es más fácil que encuentre padrinos.
        </p>
      </div>

      <CamposAnimal datos={datos} categorias={categorias} onCambiar={cambiar} />
      <PreciosPlanes datos={datos} onCambiar={cambiar} />

      <CampoTextarea etiqueta="Su historia (cómo llegó, qué le pasó, cómo está hoy)" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />
      <CampoArchivo key={claveFotos} etiqueta="Fotos: la primera es la que se ve en el catálogo (opcional)" nombre="fotos" aceptar="image/*" multiple onCambiar={elegirFotos} />
      {fotos.length > 0 && <VistaPreviaFotos fotos={fotos} onQuitar={quitarFoto} />}

      {error && <MensajeError mensaje={error} />}
      {publicado && (
        <p className="bg-secondary-container text-on-secondary-container rounded-xl px-space-md py-space-sm font-body-sm text-body-sm">
          ¡Gracias! Ya nos llegó. Lo revisamos y, apenas lo aprobemos, te avisamos en Notificaciones y aparece en el catálogo.
        </p>
      )}

      <button type="submit" disabled={enviando} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-tertiary-container disabled:opacity-60">
        {enviando ? 'Enviando…' : 'Enviar a revisión'}
      </button>
    </form>
  )
}

export default FormularioAnimal