import CampoSelect from '../comunes/CampoSelect'
import CampoTexto from '../comunes/CampoTexto'
import { urgencias } from '../../data/animales'

// Los siete campos cortos del formulario de un animal, en dos columnas (los precios van aparte, en PreciosPlanes). "categorias" son las del backend.
const CamposAnimal = ({ datos, categorias, onCambiar }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
      <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={onCambiar} />
      <CampoTexto etiqueta="Especie" nombre="especie" valor={datos.especie} onCambiar={onCambiar} />

      <CampoSelect etiqueta="Categoría" nombre="categoria" valor={datos.categoria} onCambiar={onCambiar} opciones={categorias.map((categoria) => ({ valor: categoria.id, texto: categoria.nombre }))} />
      <CampoSelect etiqueta="Condición" nombre="urgencia" valor={datos.urgencia} onCambiar={onCambiar} opciones={urgencias.map((urgencia) => ({ valor: urgencia.id, texto: urgencia.estado }))} />

      <CampoTexto etiqueta="Edad" nombre="edad" valor={datos.edad} onCambiar={onCambiar} />
      <CampoTexto etiqueta="Ubicación" nombre="ubicacion" valor={datos.ubicacion} onCambiar={onCambiar} />
      <CampoTexto etiqueta="Cupos (cuántos padrinos admite)" nombre="cuposTotales" tipo="number" valor={datos.cuposTotales} onCambiar={onCambiar} />
    </div>
  )
}

export default CamposAnimal