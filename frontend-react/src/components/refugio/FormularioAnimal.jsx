import { useState } from 'react'
import { urgencias } from '../../data/animales'
import CampoTexto from '../comunes/CampoTexto'
import { useFormulario } from '../../hooks/useFormulario'
import MensajeError from '../comunes/MensajeError'
import CampoSelect from '../comunes/CampoSelect'
import CampoTextarea from '../comunes/CampoTextarea'
import CampoArchivo from '../comunes/CampoArchivo'

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
        <CampoTexto etiqueta="Especie" nombre="especie" valor={datos.especie} onCambiar={cambiar} />

        <CampoSelect etiqueta="Categoría" nombre="categoria" valor={datos.categoria} onCambiar={cambiar} opciones={categorias.map((categoria) => ({ valor: categoria.id, texto: categoria.nombre }))} />
        <CampoSelect etiqueta="Condición" nombre="urgencia" valor={datos.urgencia} onCambiar={cambiar} opciones={urgencias.map((urgencia) => ({ valor: urgencia.id, texto: urgencia.estado }))} />

        <CampoTexto etiqueta="Edad" nombre="edad" valor={datos.edad} onCambiar={cambiar} />
        <CampoTexto etiqueta="Ubicación" nombre="ubicacion" valor={datos.ubicacion} onCambiar={cambiar} />
        <CampoTexto etiqueta="Cuota mensual (en US$)" nombre="precio" tipo="number" valor={datos.precio} onCambiar={cambiar} />
        <CampoTexto etiqueta="Cupos (cuántos padrinos admite)" nombre="cuposTotales" tipo="number" valor={datos.cuposTotales} onCambiar={cambiar} />
      </div>

      <CampoTextarea etiqueta="Su historia" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />
      <CampoArchivo key={claveFotos} etiqueta="Fotos (opcional, podés elegir varias)" nombre="fotos" aceptar="image/*" multiple onCambiar={elegirFotos} />
      
      {fotos.length > 0 && (
        <div className="flex flex-wrap gap-space-sm">
          {fotos.map((foto, indice) => (
            <img key={foto.vistaPrevia} src={foto.vistaPrevia} alt={`Foto elegida ${indice + 1}`} className="w-20 h-20 object-cover rounded-xl" />
          ))}
        </div>
      )}

      {error && <MensajeError mensaje={error} />}

      <button type="submit" disabled={enviando} className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-tertiary-container disabled:opacity-60">
        {enviando ? 'Publicando…' : 'Publicar animal'}
      </button>
    </form>
  )
}

export default FormularioAnimal
