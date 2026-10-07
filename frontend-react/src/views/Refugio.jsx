import { useContext, useState } from 'react'
import TarjetaDato from '../components/admin/TarjetaDato'
import Buscador from '../components/comunes/Buscador'
import Icono from '../components/comunes/Icono'
import Portada from '../components/comunes/Portada'
import FormularioAnimal from '../components/refugio/FormularioAnimal'
import ListaPadrinos from '../components/refugio/ListaPadrinos'
import TarjetaMiAnimal from '../components/refugio/TarjetaMiAnimal'
import { ContextoMoneda, formatearPrecio } from '../contexto/Moneda'
import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'
import { recaudacionMensual } from '../utils/precios'

// Panel del refugio: sus animales, quiénes los apadrinan y cuánto recauda.
// Desde acá carga animales, los pone en oferta, publica novedades y suma fotos.
const Refugio = ({ usuario, usuarios, animales, apadrinamientos, onAgregar, onQuitar, onEditarAnimal, onPublicarNovedad, onVerAnimal }) => {
  const [busqueda, setBusqueda] = useState('')
  const moneda = useContext(ContextoMoneda)

  const propios = animales.filter((animal) => animal.refugio === usuario.nombreUsuario)
  const texto = busqueda.toLowerCase()
  const visibles = propios.filter((animal) => `${animal.nombre} ${animal.especie} ${animal.estado}`.toLowerCase().includes(texto))

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

    // Si no subió ninguna foto, se usa una genérica
    const fotosDelAnimal = fotos.length > 0 ? fotos : [heroFoca]

    onAgregar({
      ...datos,
      id,
      refugio: usuario.nombreUsuario,
      estado: urgencias.find((urgencia) => urgencia.id === datos.urgencia).estado,
      // El precio se guarda siempre en dólares; la pantalla lo convierte a pesos si hace falta
      precio: Number(datos.precio),
      progreso: 0,
      destacado: false,
      imagen: fotosDelAnimal[0],
      fotos: fotosDelAnimal,
    })
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
              Un administrador tiene que revisar tu solicitud. Apenas la apruebe, vas a poder cargar animales y recibir padrinos desde acá.
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

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <TarjetaDato icono="pets" valor={propios.length} titulo="Animales publicados" clase="bg-primary-fixed text-on-primary-fixed-variant" />
          <TarjetaDato icono="group" valor={cantidadPadrinos} titulo="Padrinos" clase="bg-secondary-container text-on-secondary-fixed-variant" />
          <TarjetaDato
            icono="payments"
            valor={formatearPrecio(recaudacionMensual(susApadrinamientos), moneda)}
            titulo="Recaudación mensual"
            clase="bg-tertiary-fixed text-on-tertiary-fixed-variant"
          />
        </div>

        <section className="space-y-space-md">
          <div className="flex flex-wrap items-end justify-between gap-space-sm">
            <h2 className="font-headline-md text-headline-md text-primary">Mis animales</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Mostrando {visibles.length} de {propios.length}
            </p>
          </div>
          <Buscador valor={busqueda} onCambiar={setBusqueda} textoAyuda="Buscar por nombre, especie o estado..." />

          {propios.length === 0 && (
            <p className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl text-center font-body-md text-body-md text-on-surface-variant">
              Todavía no cargaste ningún animal.
            </p>
          )}
          {propios.length > 0 && visibles.length === 0 && (
            <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-lg">
              Ningún animal coincide con esa búsqueda.
            </p>
          )}
          {visibles.map((animal) => (
            <TarjetaMiAnimal
              key={animal.id}
              animal={animal}
              apadrinamientos={susApadrinamientos.filter((a) => a.animal.id === animal.id)}
              onVer={onVerAnimal}
              onQuitar={onQuitar}
              onEditar={onEditarAnimal}
              onPublicarNovedad={onPublicarNovedad}
            />
          ))}
        </section>

        <section className="space-y-space-md">
          <h2 className="font-headline-md text-headline-md text-primary">Padrinos</h2>
          <ListaPadrinos apadrinamientos={susApadrinamientos} usuarios={usuarios} />
        </section>

        <FormularioAnimal onGuardar={guardar} />
      </div>
    </>
  )
}

export default Refugio
