import { useState } from 'react'
import TarjetaDato from '../admin/TarjetaDato'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import MenuLateral from '../comunes/MenuLateral'
import Portada from '../comunes/Portada'
import TituloSeccion from '../comunes/TituloSeccion'
import FormularioAnimal from './FormularioAnimal'
import ListaPadrinos from './ListaPadrinos'
import SeccionAnimales from './SeccionAnimales'
import { formatearPrecio } from '../../contexto/Moneda'
import * as animalesApi from '../../services/animales'
import { intentar } from '../../utils/intentar'
import { ponerEn, sacarDe } from '../../utils/listas'
import { recaudacionMensual } from '../../utils/precios'
import { useMoneda } from '../../hooks/useMoneda'
import { useSesion } from '../../hooks/useSesion'
import { useConsulta } from '../../hooks/useConsulta'
import { useApadrinamientos } from '../../hooks/useApadrinamientos'

const secciones = [
  { id: 'animales', nombre: 'Mis animales', icono: 'pets' },
  { id: 'padrinos', nombre: 'Padrinos', icono: 'group' },
  { id: 'publicar', nombre: 'Publicar un animal', icono: 'add_circle' },
]

// Panel del refugio. Tiene un menú lateral y muestra una sola sección por vez:
// sus animales (ofertas, novedades, fotos y ubicación), sus padrinos, o el formulario para publicar uno nuevo.
// Esta página pide al backend, cuando se monta, lo que muestra: las publicaciones de este refugio (activas
// y pausadas), los apadrinamientos de sus animales y las categorías para el formulario. Un pedido por lista.
// Cada acción llama al backend y, con lo que contesta, actualiza el estado: el cambio se ve sin volver
// a pedir la lista. Si una acción falla, onError muestra el mensaje arriba de la página.
const PanelRefugio = () => {
  const { usuario } = useSesion()
  const [seccion, setSeccion] = useState('animales')
  const { datos: animales, setDatos: setAnimales, cargando, error: errorAnimales } = useConsulta(animalesApi.traerPublicaciones, usuario.idRefugio, [])
  const { datos: apadrinamientos, error: errorApadrinamientos } = useApadrinamientos()
  const { datos: categorias, error: errorCategorias } = useConsulta(animalesApi.traerCategorias, undefined, [])
  const error = errorAnimales ?? errorApadrinamientos ?? errorCategorias
  const [errorAccion, setErrorAccion] = useState(null) // mensaje de una acción que falló
  const { moneda } = useMoneda()

  // Pone en la lista al animal como lo devolvió el backend
  const guardarAnimal = (animal) => {
    setAnimales((actuales) => ponerEn(actuales, animal))
  }

  const propios = animales.filter((animal) => animal.idRefugio === usuario.idRefugio)

  // Apadrinamientos activos de los animales de este refugio
  const susApadrinamientos = apadrinamientos.filter((a) => a.activo && a.animal.idRefugio === usuario.idRefugio)
  const cantidadPadrinos = new Set(susApadrinamientos.map((a) => a.usuario)).size

  // Sube las fotos de a una y en orden: cada una espera a que termine la anterior.
  // Cada vez que el backend guarda una, el animal se actualiza en pantalla con esa foto.
  const subirFotos = (animal, archivos) =>
    archivos.reduce(
      (anterior, archivo) =>
        anterior
          .then((actual) => animalesApi.subirFoto(actual, archivo))
          .then((conFoto) => {
            guardarAnimal(conFoto)
            return conFoto
          }),
      Promise.resolve(animal),
    )

  // Revisa lo básico antes de mandar el animal al backend (que valida todo de nuevo), lo publica
  // y después le sube las fotos elegidas.
  // Devuelve una promesa con un mensaje de error (lo muestra el formulario), o null si salió bien.
  const publicar = (datos, fotos) => {
    if (Number(datos.precio) <= 0) {
      return Promise.resolve('La cuota mensual tiene que ser mayor a 0')
    }
    // Misma regla que el backend: los cupos tienen que ser un número entero mayor a 0
    const cupos = Number(datos.cuposTotales)
    if (!Number.isInteger(cupos) || cupos <= 0) {
      return Promise.resolve('Los cupos tienen que ser un número entero mayor a 0')
    }

    return intentar(
      animalesApi
        .crearAnimal(datos)
        .then((nuevo) => {
          guardarAnimal(nuevo)
          return subirFotos(nuevo, fotos)
        })
        .then(() => {
          // Una vez publicado, se muestra la lista para que lo vea
          setSeccion('animales')
        }),
    )
  }

  // No lo borra de la base: la publicación queda eliminada y deja de verse
  const quitar = (idAnimal) => {
    setErrorAccion(null)
    animalesApi
      .quitarAnimal(idAnimal)
      .then(() => {
        setAnimales((actuales) => sacarDe(actuales, idAnimal))
      })
      .catch((falla) => {
        setErrorAccion(falla.message)
      })
  }

  // "cambios" trae lo que se modifica, y cada cosa va a su propio endpoint:
  // { descuento: { porcentaje, hasta } } pone una oferta y { descuento: null } la quita,
  // { fotos: [...] } sube los archivos de fotos nuevos (tal como vienen del <input type="file">)
  // y { publicacion: 'PAUSADA' | 'ACTIVA' } pausa o republica.
  const editar = (idAnimal, cambios) => {
    const animal = propios.find((a) => a.id === idAnimal)

    const elegirPedido = () => {
      if (cambios.descuento) {
        return animalesApi.ponerOferta(animal, cambios.descuento.porcentaje, cambios.descuento.hasta)
      }
      if (cambios.descuento === null) {
        return animalesApi.quitarOferta(animal)
      }
      if (cambios.fotos) {
        return subirFotos(animal, cambios.fotos)
      }
      return animalesApi.cambiarPublicacion(idAnimal, cambios.publicacion)
    }
    const pedido = elegirPedido()

    setErrorAccion(null)
    pedido.then(guardarAnimal).catch((falla) => {
      setErrorAccion(falla.message)
    })
  }

  // Las dos devuelven una promesa con el mensaje de error, o null si salió bien
  const publicarNovedad = (idAnimal, texto) => intentar(animalesApi.publicarNovedad(idAnimal, texto), setErrorAccion)

  const registrarUbicacion = (idAnimal, latitud, longitud) => intentar(animalesApi.registrarUbicacion(idAnimal, latitud, longitud), setErrorAccion)

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

  if (cargando) {
    return <Cargando texto="Cargando tu refugio…" />
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
        {/* Si alguna lista no llegó, se avisa y el resto del panel sigue funcionando */}
        {error && <AvisoError mensaje={error} />}
        {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => setErrorAccion(null)} />}

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
                onQuitar={quitar}
                onEditar={editar}
                onPublicarNovedad={publicarNovedad}
                onRegistrarUbicacion={registrarUbicacion}
              />
            )}
            {seccion === 'padrinos' && (
              <section className="space-y-space-md">
                <TituloSeccion>Padrinos</TituloSeccion>
                <ListaPadrinos apadrinamientos={susApadrinamientos} />
              </section>
            )}
            {seccion === 'publicar' && <FormularioAnimal categorias={categorias} onGuardar={publicar} />}
          </div>
        </div>
      </div>
    </>
  )
}

export default PanelRefugio
