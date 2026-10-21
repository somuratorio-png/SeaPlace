import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Portada from '../comunes/Portada'
import ContenidoRefugio from './ContenidoRefugio'
import RefugioPendiente from './RefugioPendiente'
import ResumenRefugio from './ResumenRefugio'
import { useGestionRefugio } from '../../hooks/useGestionRefugio'
import { useSesion } from '../../hooks/useSesion'

const PanelRefugio = () => {
  const { usuario } = useSesion()
  const gestion = useGestionRefugio()

  if (!usuario.aprobado) {
    return <RefugioPendiente usuario={usuario} />
  }

  if (gestion.cargando) {
    return <Cargando texto="Cargando tu refugio…" />
  }

  const { propios, apadrinamientos } = gestion
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
          onGuardarDatos={gestion.guardarDatos}
          onPublicarNovedad={gestion.publicarNovedad}
          onRegistrarUbicacion={gestion.registrarUbicacion}
        />
      </div>
    </>
  )
}

export default PanelRefugio