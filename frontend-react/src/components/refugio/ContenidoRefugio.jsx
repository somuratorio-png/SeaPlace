import { useState } from 'react'
import MenuLateral from '../comunes/MenuLateral'
import FormularioAnimal from './FormularioAnimal'
import SeccionAnimales from './SeccionAnimales'
import SeccionPadrinos from './SeccionPadrinos'

const secciones = [
  { id: 'animales', nombre: 'Mis animales', icono: 'pets' },
  { id: 'padrinos', nombre: 'Padrinos', icono: 'group' },
  { id: 'publicar', nombre: 'Publicar un animal', icono: 'add_circle' },
]

// Menú lateral del refugio y la sección elegida (una sola por vez): sus animales, sus padrinos
// o el formulario para publicar uno nuevo. Todo lo que cambia datos sube por las funciones "on...".
const ContenidoRefugio = ({ animales, apadrinamientos, categorias, onPublicar, onQuitar, onEditar, onPublicarNovedad, onRegistrarUbicacion }) => {
  const [seccion, setSeccion] = useState('animales')

  // Si el animal se publicó bien, se muestra la lista para que lo vea
  const publicar = (datos, fotos) =>
    onPublicar(datos, fotos).then((mensaje) => {
      if (mensaje === null) {
        setSeccion('animales')
      }
      return mensaje
    })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
      <div className="lg:col-span-3">
        <MenuLateral secciones={secciones} activa={seccion} onCambiar={setSeccion} />
      </div>

      <div className="lg:col-span-9">
        {seccion === 'animales' && (
          <SeccionAnimales
            animales={animales}
            apadrinamientos={apadrinamientos}
            onQuitar={onQuitar}
            onEditar={onEditar}
            onPublicarNovedad={onPublicarNovedad}
            onRegistrarUbicacion={onRegistrarUbicacion}
          />
        )}
        {seccion === 'padrinos' && <SeccionPadrinos apadrinamientos={apadrinamientos} />}
        {seccion === 'publicar' && <FormularioAnimal categorias={categorias} onGuardar={publicar} />}
      </div>
    </div>
  )
}

export default ContenidoRefugio