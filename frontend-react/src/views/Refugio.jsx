import { useContext, useState } from 'react'
import TarjetaDato from '../components/admin/TarjetaDato'
import Icono from '../components/comunes/Icono'
import MenuLateral from '../components/comunes/MenuLateral'
import Portada from '../components/comunes/Portada'
import TituloSeccion from '../components/comunes/TituloSeccion'
import FormularioAnimal from '../components/refugio/FormularioAnimal'
import ListaPadrinos from '../components/refugio/ListaPadrinos'
import SeccionAnimales from '../components/refugio/SeccionAnimales'
import { ContextoMoneda, formatearPrecio } from '../contexto/Moneda'
import { recaudacionMensual } from '../utils/precios'

const secciones = [
  { id: 'animales', nombre: 'Mis animales', icono: 'pets' },
  { id: 'padrinos', nombre: 'Padrinos', icono: 'group' },
  { id: 'publicar', nombre: 'Publicar un animal', icono: 'add_circle' },
]

// Panel del refugio. Tiene un menú lateral y muestra una sola sección por vez:
// sus animales (ofertas, novedades, fotos y ubicación), sus padrinos, o el formulario para publicar uno nuevo.
// "animales" trae las publicaciones activas de todos y las pausadas de este refugio;
// "apadrinamientos" son los de sus animales (el backend ya manda solo esos).
const Refugio = ({ usuario, animales, categorias, apadrinamientos, onAgregar, onQuitar, onEditarAnimal, onPublicarNovedad, onRegistrarUbicacion, onVerAnimal }) => {
  const [seccion, setSeccion] = useState('animales')
  const moneda = useContext(ContextoMoneda)

  const propios = animales.filter((animal) => animal.idRefugio === usuario.idRefugio)

  // Apadrinamientos activos de los animales de este refugio
  const susApadrinamientos = apadrinamientos.filter((a) => a.activo && a.animal.idRefugio === usuario.idRefugio)
  const cantidadPadrinos = new Set(susApadrinamientos.map((a) => a.usuario)).size

  // Revisa lo básico antes de mandar el animal al backend (que valida todo de nuevo).
  // Devuelve un mensaje de error, o null si salió bien.
  const guardar = async (datos, fotos) => {
    if (Number(datos.precio) <= 0) {
      return 'La cuota mensual tiene que ser mayor a 0'
    }
    // Misma regla que el backend: los cupos tienen que ser un número entero mayor a 0
    const cupos = Number(datos.cuposTotales)
    if (!Number.isInteger(cupos) || cupos <= 0) {
      return 'Los cupos tienen que ser un número entero mayor a 0'
    }

    const mensaje = await onAgregar(datos, fotos)
    if (mensaje === null) {
      // Una vez publicado, se muestra la lista para que lo vea
      setSeccion('animales')
    }
    return mensaje
  }

  // Un refugio recién registrado no puede publicar hasta que un administrador lo apruebe
  if (!usuario.aprobado) {
    return (
      <>
        <Portada icono="hourglass_top" etiqueta="Mi refugio" titulo={`${usuario.nombre} ${usuario.apellido}`} texto="Tu refugio está esperando la aprobación de SeaPlace." />
        <div className="max-w-2xl mx-auto px-margin-mobile py-space-lg">
          <div className="bg-surface-container-lowest rounded-2xl shadow-md p-space-xl text-center space-y-space-md">
            <div className="w-16 h-16 mx-auto rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center">
              <Icono nombre="pending_actions" clase="text-[32px]" />
            </div>
            <h2 className="font-headline-sm text-headline-sm text-primary">Solicitud pendiente</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Un administrador tiene que revisar tu solicitud. Apenas la apruebe, vas a poder publicar animales y recibir padrinos desde acá.
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Portada
        icono="home_health"
        etiqueta="Mi refugio"
        titulo={`${usuario.nombre} ${usuario.apellido}`}
        texto={`Tenés ${propios.length} ${propios.length === 1 ? 'animal publicado' : 'animales publicados'} en el catálogo.`}
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">
        <div className="escalonar grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <TarjetaDato icono="pets" valor={propios.length} titulo="Animales publicados" clase="bg-primary-fixed text-on-primary-fixed-variant" />
          <TarjetaDato icono="group" valor={cantidadPadrinos} titulo="Padrinos" clase="bg-secondary-container text-on-secondary-fixed-variant" />
          <TarjetaDato
            icono="payments"
            valor={formatearPrecio(recaudacionMensual(susApadrinamientos), moneda)}
            titulo="Recaudación mensual"
            clase="bg-tertiary-fixed text-on-tertiary-fixed-variant"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          <div className="lg:col-span-3">
            <MenuLateral secciones={secciones} activa={seccion} onCambiar={setSeccion} />
          </div>

          <div className="lg:col-span-9">
            {seccion === 'animales' && (
              <SeccionAnimales
                animales={propios}
                apadrinamientos={susApadrinamientos}
                onVer={onVerAnimal}
                onQuitar={onQuitar}
                onEditar={onEditarAnimal}
                onPublicarNovedad={onPublicarNovedad}
                onRegistrarUbicacion={onRegistrarUbicacion}
              />
            )}
            {seccion === 'padrinos' && (
              <section className="space-y-space-md">
                <TituloSeccion>Padrinos</TituloSeccion>
                <ListaPadrinos apadrinamientos={susApadrinamientos} />
              </section>
            )}
            {seccion === 'publicar' && <FormularioAnimal categorias={categorias} onGuardar={guardar} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Refugio
