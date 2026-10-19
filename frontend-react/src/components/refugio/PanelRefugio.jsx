import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Portada from '../comunes/Portada'
import ContenidoRefugio from './ContenidoRefugio'
import RefugioPendiente from './RefugioPendiente'
import ResumenRefugio from './ResumenRefugio'
import { useGestionRefugio } from '../../hooks/useGestionRefugio'
import { useSesion } from '../../hooks/useSesion'

// Panel del refugio: muestra el resumen y el contenido (sus animales, sus padrinos o el formulario para
// publicar uno). Lo que pide al backend y las acciones que cambian los datos están en useGestionRefugio.
const PanelRefugio = () => {
  const { usuario } = useSesion()
  const gestion = useGestionRefugio()

  // Un refugio recién registrado no puede publicar hasta que un administrador lo apruebe
  if (!usuario.aprobado) {
    return <RefugioPendiente usuario={usuario} />
  }

  if (gestion.cargando) {
    return <Cargando texto="Cargando tu refugio…" />
  }

  const { propios, apadrinamientos } = gestion
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
        {gestion.error && <AvisoError mensaje={gestion.error} />}
        {gestion.errorAccion && <AvisoError mensaje={gestion.errorAccion} onCerrar={gestion.cerrarErrorAccion} />}

        <ResumenRefugio cantidadAnimales={enCatalogo} apadrinamientos={apadrinamientos} />

        <ContenidoRefugio
          animales={propios}
          apadrinamientos={apadrinamientos}
          categorias={gestion.categorias}
          onPublicar={gestion.publicar}
          onQuitar={gestion.quitar}
          onEditar={gestion.editar}
          onPublicarNovedad={gestion.publicarNovedad}
          onRegistrarUbicacion={gestion.registrarUbicacion}
        />
      </div>
    </>
  )
}

export default PanelRefugio