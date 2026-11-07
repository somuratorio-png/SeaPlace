import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import Portada from '../comunes/Portada'
import FormularioCampania from './FormularioCampania'
import FormularioPerfilPatrocinador from './FormularioPerfilPatrocinador'
import ImpactoPatrocinio from './ImpactoPatrocinio'
import ListaCampanias from './ListaCampanias'
import { traerAnimales } from '../../Redux/animalesSlice'
import { limpiarError, traerMiPatrocinio } from '../../Redux/patrocinioSlice'
import { nivelDe } from '../../services/patrocinadores'

// Panel de una empresa patrocinadora: su nivel, el impacto que lograron sus campañas, las campañas
// (con la opción de terminarlas), una campaña nueva y su perfil (con el beneficio para los padrinos).
// Al montarse pide su panel y el catálogo (para elegir el animal de una campaña nueva).
// Si una acción falla, el mensaje se muestra arriba de la página.
const PanelPatrocinador = () => {
  const dispatch = useDispatch()
  const { perfil, campanias, impacto, loading, error, errorAccion } = useSelector((state) => state.patrocinio)

  useEffect(() => {
    dispatch(limpiarError())
    dispatch(traerMiPatrocinio())
    dispatch(traerAnimales())
  }, [dispatch])

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg">
        <AvisoError mensaje={error} />
      </div>
    )
  }

  if (loading || perfil === null) {
    return <Cargando texto="Preparando tu panel…" />
  }

  const nivel = nivelDe(perfil.nivel)

  return (
    <>
      <Portada icono="handshake" etiqueta={`Patrocinador · Nivel ${nivel.nombre}`} titulo={perfil.nombre} texto="Gracias por duplicar el impacto de cada padrino." />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
        {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => dispatch(limpiarError())} />}

        <ImpactoPatrocinio perfil={perfil} impacto={impacto} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
          <div className="lg:col-span-7 space-y-space-md">
            <h2 className="font-headline-sm text-headline-sm text-primary">Tus campañas</h2>
            <ListaCampanias campanias={campanias} />
          </div>
          <div className="lg:col-span-5 space-y-space-md print:hidden">
            <FormularioCampania campanias={campanias} />
            <FormularioPerfilPatrocinador key={perfil.id} perfil={perfil} />
          </div>
        </div>

        <p className="inline-flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant print:hidden">
          <Icono nombre="print" clase="text-[18px]" /> ¿Necesitás el reporte para tu informe de sustentabilidad? Con Ctrl+P lo guardás como PDF.
        </p>
      </div>
    </>
  )
}

export default PanelPatrocinador
