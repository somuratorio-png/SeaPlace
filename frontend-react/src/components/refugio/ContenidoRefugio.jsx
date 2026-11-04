import { useState } from 'react'
import { useSelector } from 'react-redux'
import MenuLateral from '../comunes/MenuLateral'
import FormularioAnimal from './FormularioAnimal'
import SeccionAnimales from './SeccionAnimales'
import SeccionNotificaciones from './SeccionNotificaciones'
import SeccionPadrinos from './SeccionPadrinos'

// Menú lateral del refugio y la sección elegida (una sola por vez): sus animales, sus padrinos,
// el formulario para publicar uno nuevo o sus notificaciones. Todo lo que cambia datos sube por las funciones "on...".
const ContenidoRefugio = ({ animales, apadrinamientos, categorias, onPublicar, onQuitar, onEditar, onGuardarDatos, onPublicarNovedad, onRegistrarUbicacion }) => {
  const [seccion, setSeccion] = useState('animales')
  // Las notificaciones las pide la campanita del header: acá se leen del estado global para mostrar en el menú cuántas no leyó
  const { items: notificaciones } = useSelector((state) => state.notificaciones)
  const sinLeer = notificaciones.filter((notificacion) => !notificacion.leida).length

  const secciones = [
    { id: 'animales', nombre: 'Mis animales', icono: 'pets' },
    { id: 'padrinos', nombre: 'Padrinos', icono: 'group' },
    { id: 'publicar', nombre: 'Sumar un rescatado', icono: 'add_circle' },
    { id: 'notificaciones', nombre: 'Notificaciones', icono: 'notifications', aviso: sinLeer },
  ]

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
            categorias={categorias}
            onQuitar={onQuitar}
            onEditar={onEditar}
            onGuardarDatos={onGuardarDatos}
            onPublicarNovedad={onPublicarNovedad}
            onRegistrarUbicacion={onRegistrarUbicacion}
          />
        )}
        {seccion === 'padrinos' && <SeccionPadrinos apadrinamientos={apadrinamientos} />}
        {seccion === 'publicar' && <FormularioAnimal categorias={categorias} onGuardar={publicar} />}
        {seccion === 'notificaciones' && <SeccionNotificaciones />}
      </div>
    </div>
  )
}

export default ContenidoRefugio