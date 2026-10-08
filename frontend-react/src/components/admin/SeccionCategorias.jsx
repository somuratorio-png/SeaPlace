import { useState } from 'react'
import Icono from '../comunes/Icono'
import TituloSeccion from '../comunes/TituloSeccion'
import CampoTexto from '../login/CampoTexto'

// Sección "Categorías" del administrador: las que existen (con cuántos animales tiene cada una)
// y el formulario para crear una nueva. onCrear devuelve el mensaje de error del backend, o null si salió bien.
const SeccionCategorias = ({ categorias, animales, onCrear }) => {
  const [datos, setDatos] = useState({ nombre: '', descripcion: '' })
  const [error, setError] = useState(null)

  const cambiar = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  const crear = async (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const mensaje = await onCrear(datos.nombre, datos.descripcion)
    setError(mensaje)
    if (mensaje === null) {
      setDatos({ nombre: '', descripcion: '' })
    }
  }

  return (
    <section className="space-y-space-md">
      <TituloSeccion>Categorías</TituloSeccion>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
        {categorias.map((categoria) => {
          const cantidad = animales.filter((animal) => animal.categoria === categoria.id).length
          return (
            <div key={categoria.id} className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-md flex items-center gap-space-md">
              <div className="w-12 h-12 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center">
                <Icono nombre={categoria.icono} />
              </div>
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface">{categoria.nombre}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {cantidad} {cantidad === 1 ? 'animal' : 'animales'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={crear} className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md">
        <h3 className="font-title-lg text-title-lg text-on-surface">Nueva categoría</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
          <CampoTexto etiqueta="Descripción" nombre="descripcion" valor={datos.descripcion} onCambiar={cambiar} />
        </div>
        {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}
        <button type="submit" className="bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
          Crear categoría
        </button>
      </form>
    </section>
  )
}

export default SeccionCategorias
