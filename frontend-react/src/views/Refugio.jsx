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
import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'
import { recaudacionMensual } from '../utils/precios'

const secciones = [
  { id: 'animales', nombre: 'Mis animales', icono: 'pets' },
  { id: 'padrinos', nombre: 'Padrinos', icono: 'group' },
  { id: 'publicar', nombre: 'Publicar un animal', icono: 'add_circle' },
]

// Panel del refugio. Tiene un menú lateral y muestra una sola sección por vez:
// sus animales (ofertas, novedades y fotos), sus padrinos, o el formulario para publicar uno nuevo.
const Refugio = ({ usuario, usuarios, animales, apadrinamientos, onAgregar, onQuitar, onEditarAnimal, onPublicarNovedad, onVerAnimal }) => {
  const [seccion, setSeccion] = useState('animales')
  const moneda = useContext(ContextoMoneda)

  const propios = animales.filter((animal) => animal.refugio === usuario.nombreUsuario)

  // Apadrinamientos activos de los animales de este refugio
  const susApadrinamientos = apadrinamientos.filter((a) => a.activo && a.animal.refugio === usuario.nombreUsuario)
  const cantidadPadrinos = new Set(susApadrinamientos.map((a) => a.usuario)).size

  // Arma el animal completo a partir del formulario. Devuelve un mensaje de error, o null si salió bien.
  const guardar = (datos, fotos) => {
    const id = datos.nombre.trim().toLowerCase().replaceAll(' ', '-')
    if (animales.some((animal) => animal.id === id)) {
      return `Ya hay un animal llamado ${datos.nombre}`
    }
    if (Number(datos.precio) <= 0) {
      return 'La cuota mensual tiene que ser mayor a 0'
    }
    // Misma regla que el backend: los cupos tienen que ser un número entero mayor a 0
    const cupos = Number(datos.cuposTotales)
    if (!Number.isInteger(cupos) || cupos <= 0) {
      return 'Los cupos tienen que ser un número entero mayor a 0'
    }

    // Si no subió ninguna foto, se usa una genérica
    const fotosDelAnimal = fotos.length > 0 ? fotos : [heroFoca]

    onAgregar({
      ...datos,
      id,
      refugio: usuario.nombreUsuario,
      estado: urgencias.find((urgencia) => urgencia.id === datos.urgencia).estado,
      // El precio se guarda siempre en dólares; la pantalla lo convierte a pesos si hace falta
      precio: Number(datos.precio),
      // Al publicarlo, todos los cupos están disponibles
      cuposTotales: cupos,
      cuposDisponibles: cupos,
      progreso: 0,
      destacado: false,
      imagen: fotosDelAnimal[0],
      fotos: fotosDelAnimal,
    })
    // Una vez publicado, se muestra la lista para que lo vea
    setSeccion('animales')
    return null
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
              />
            )}
            {seccion === 'padrinos' && (
              <section className="space-y-space-md">
                <TituloSeccion>Padrinos</TituloSeccion>
                <ListaPadrinos apadrinamientos={susApadrinamientos} usuarios={usuarios} />
              </section>
            )}
            {seccion === 'publicar' && <FormularioAnimal onGuardar={guardar} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default Refugio
