import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Portada from '../comunes/Portada'
import ContenidoRefugio from './ContenidoRefugio'
import RefugioPendiente from './RefugioPendiente'
import ResumenRefugio from './ResumenRefugio'
import { traerPublicaciones } from '../../Redux/animalesSlice'
import { traerApadrinamientos } from '../../Redux/apadrinamientosSlice'
import { traerCategorias } from '../../Redux/categoriasSlice'
import { useGestionRefugio } from '../../hooks/useGestionRefugio'

// Panel del refugio: muestra el resumen y el contenido (sus animales, sus padrinos o el formulario para
// publicar uno). Al montarse pide las publicaciones de este refugio, sus apadrinamientos y las categorías
// (un pedido por lista). Las acciones que cambian los datos están en useGestionRefugio.
const PanelRefugio = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.usuario)
  const { publicaciones, loading: cargando, error: errorAnimales } = useSelector((state) => state.animales)
  const { items: todos, error: errorApadrinamientos } = useSelector((state) => state.apadrinamientos)
  const { items: categorias, error: errorCategorias } = useSelector((state) => state.categorias)
  const error = errorAnimales || errorApadrinamientos || errorCategorias

  const propios = publicaciones.filter((animal) => animal.idRefugio === usuario.idRefugio)
  // Apadrinamientos activos de los animales de este refugio
  const apadrinamientos = todos.filter((a) => a.activo && a.animal.idRefugio === usuario.idRefugio)

  const gestion = useGestionRefugio(propios)

  // Un refugio que todavía no fue aprobado no puede pedir nada de esto: no se pide
  useEffect(() => {
    if (usuario.aprobado) {
      dispatch(traerPublicaciones(usuario.idRefugio))
      dispatch(traerApadrinamientos())
      dispatch(traerCategorias())
    }
  }, [dispatch, usuario.aprobado, usuario.idRefugio])

  // Un refugio recién registrado no puede publicar hasta que un administrador lo apruebe
  if (!usuario.aprobado) {
    return <RefugioPendiente usuario={usuario} />
  }

  if (cargando) {
    return <Cargando texto="Cargando tu refugio…" />
  }

  // En el catálogo solo están las activas: las pausadas y las que esperan aprobación no se cuentan
  const enCatalogo = propios.filter((animal) => animal.publicacion === 'ACTIVA').length

  return (
    <>
      <Portada
        icono="home_health"
        etiqueta="Mi refugio"
        titulo={`${usuario.nombre} ${usuario.apellido}`}
        texto={`Tenés ${enCatalogo} ${enCatalogo === 1 ? 'animal publicado' : 'animales publicados'} en el catálogo.`}
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">
        {/* Si alguna lista no llegó, se avisa y el resto del panel sigue funcionando */}
        {error && <AvisoError mensaje={error} />}
        {gestion.errorAccion && <AvisoError mensaje={gestion.errorAccion} onCerrar={gestion.cerrarErrorAccion} />}

        <ResumenRefugio cantidadAnimales={enCatalogo} apadrinamientos={apadrinamientos} />

        <ContenidoRefugio
          animales={propios}
          apadrinamientos={apadrinamientos}
          categorias={categorias}
          onPublicar={gestion.publicar}
          onQuitar={gestion.quitar}
          onEditar={gestion.editar}
          onGuardarDatos={gestion.guardarDatos}
          onPublicarNovedad={gestion.publicarNovedad}
          onRegistrarUbicacion={gestion.registrarUbicacion}
        />
      </div>
    </>
  )
}

export default PanelRefugio
