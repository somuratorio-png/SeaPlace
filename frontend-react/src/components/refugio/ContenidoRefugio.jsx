import { useState } from 'react'
import MenuLateral from '../comunes/MenuLateral'
import FormularioAnimal from './FormularioAnimal'
import SeccionAnimales from './SeccionAnimales'
import SeccionNotificaciones from './SeccionNotificaciones'
import SeccionPadrinos from './SeccionPadrinos'
import { useNotificaciones } from '../../hooks/useNotificaciones'

const ContenidoRefugio = ({ animales, apadrinamientos, categorias, onPublicar, onQuitar, onEditar, onGuardarDatos, onPublicarNovedad, onRegistrarUbicacion }) => {
  const [seccion, setSeccion] = useState('animales')
  const avisos = useNotificaciones()

  const secciones = [
    { id: 'animales', nombre: 'Mis animales', icono: 'pets' },
    { id: 'padrinos', nombre: 'Padrinos', icono: 'group' },
    { id: 'publicar', nombre: 'Sumar un rescatado', icono: 'add_circle' },
    { id: 'notificaciones', nombre: 'Notificaciones', icono: 'notifications', aviso: avisos.sinLeer },
  ]

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
        {seccion === 'notificaciones' && (
          <SeccionNotificaciones notificaciones={avisos.notificaciones} cargando={avisos.cargando} error={avisos.error} errorAlMarcar={avisos.errorAlMarcar} onMarcarLeidas={avisos.marcarLeidas} />
        )}
      </div>
    </div>
  )
}

export default ContenidoRefugio