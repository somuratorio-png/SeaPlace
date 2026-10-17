import { crearCategoria, traerAnimales, traerCategorias } from '../../services/animales'
import { intentar } from '../../utils/intentar'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import FormularioCategoria from './FormularioCategoria'
import TarjetaCategoria from './TarjetaCategoria'
import { useConsulta } from '../../hooks/useConsulta'

// Sección "Categorías" del administrador: las que existen (con cuántos animales tiene cada una)
// y el formulario para crear una nueva.
// Las categorías y los animales publicados los pide esta sección al backend cuando se abre, un pedido por lista.
const SeccionCategorias = () => {
  const { datos: categorias, setDatos: setCategorias, cargando, error: errorCategorias } = useConsulta(traerCategorias, undefined, [])
  const { datos: animales, error: errorAnimales } = useConsulta(traerAnimales, undefined, [])
  const errorAlCargar = errorCategorias ?? errorAnimales

  // La categoría nueva se agrega a la lista con lo que devuelve el backend.
  // Devuelve una promesa con el mensaje de error (lo muestra el formulario), o null si salió bien.
  const crear = (nombre, descripcion) =>
    intentar(
      crearCategoria(nombre, descripcion).then((nueva) => {
        setCategorias((actuales) => [...actuales, nueva])
      }),
    )

  if (cargando || errorAlCargar) {
    return <EstadoCarga cargando={cargando} error={errorAlCargar} texto="Cargando las categorías…" />
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Categorías</TituloSeccion>

      {categorias.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">Todavía no hay categorías. Creá la primera con el formulario de abajo.</MensajeVacio>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {categorias.map((categoria) => (
          <TarjetaCategoria key={categoria.id} categoria={categoria} cantidad={animales.filter((animal) => animal.categoria === categoria.id).length} />
        ))}
      </div>

      <FormularioCategoria onCrear={crear} />
    </section>
  )
}

export default SeccionCategorias