import { useState } from 'react'
import CampoArchivo from '../comunes/CampoArchivo'
import CampoTextarea from '../comunes/CampoTextarea'
import MensajeError from '../comunes/MensajeError'
import CamposAnimal from './CamposAnimal'
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
  precio: '',
  cuposTotales: '',
  descripcion: '',
}

// Formulario para publicar un animal nuevo en el catálogo. "categorias" son las del backend.
// onGuardar lo manda al backend y devuelve un mensaje de error, o null si salió bien.
const FormularioAnimal = ({ categorias, onGuardar }) => {
  const { datos, cambiar, reiniciar } = useFormulario(formularioVacio)
  const [fotos, setFotos] = useState([]) // [{ archivo, vistaPrevia }]: cada archivo elegido y una dirección temporal para mostrarlo
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false) // true mientras se espera la respuesta del backend
  const [claveFotos, setClaveFotos] = useState(0) // cambia al guardar: React vuelve a crear el selector de archivos, vacío

  // Se guardan los archivos originales (el backend se encarga de achicarlos). URL.createObjectURL
  // da una dirección temporal del archivo que sirve como src de la miniatura.
  const elegirFotos = (evento) => {
    setFotos([...evento.target.files].map((archivo) => ({ archivo, vistaPrevia: URL.createObjectURL(archivo) })))
  }

  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    setEnviando(true)
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
        reiniciar()
        setFotos([])
        setClaveFotos((actual) => actual + 1)
      }
    })
  }

  return (
    <form onSubmit={enviar} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-title-lg text-title-lg text-on-surface">Publicar un animal</h2>

      <CamposAnimal datos={datos} categorias={categorias} onCambiar={cambiar} />

      <CampoTextarea etiqueta="Su historia" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />
      <CampoArchivo key={claveFotos} etiqueta="Fotos (opcional, podés elegir varias)" nombre="fotos" aceptar="image/*" multiple onCambiar={elegirFotos} />
      {fotos.length > 0 && <VistaPreviaFotos fotos={fotos} />}

      {error && <MensajeError mensaje={error} />}

      <button type="submit" disabled={enviando} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-tertiary-container disabled:opacity-60">
        {enviando ? 'Publicando…' : 'Publicar animal'}
      </button>
    </form>
  )
}

export default FormularioAnimal