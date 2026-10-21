import { crearCategoria } from '../../services/animales'
import { useSesion } from '../../hooks/useSesion'
import { intentar } from '../../utils/intentar'
import EstadoCarga from '../comunes/EstadoCarga'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import FormularioCategoria from './FormularioCategoria'
import TarjetaCategoria from './TarjetaCategoria'

const SeccionCategorias = ({ categorias, setCategorias, publicados, cargando, error }) => {
  const { token } = useSesion()

  const crear = (nombre, descripcion) =>
    intentar(
      crearCategoria(token, nombre, descripcion).then((nueva) => {
        setCategorias((actuales) => [...actuales, nueva])
      }),
    )

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando las categorías…" />
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Categorías</TituloSeccion>

      {categorias.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">Todavía no hay categorías. Creá la primera con el formulario de abajo.</MensajeVacio>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {categorias.map((categoria) => (
          <TarjetaCategoria key={categoria.id} categoria={categoria} cantidad={publicados.filter((animal) => animal.categoria === categoria.id).length} />
        ))}
      </div>

      <FormularioCategoria onCrear={crear} />
    </section>
  )
}

export default SeccionCategorias