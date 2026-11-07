import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import LogoPatrocinador from '../comunes/LogoPatrocinador'
import TituloSeccion from '../comunes/TituloSeccion'
import { traerPatrocinadores } from '../../Redux/patrocinadoresSlice'
import { niveles } from '../../services/patrocinadores'

// Tamaño del logo según el nivel: cuanto más se comprometió la empresa, más grande se ve
const tamanioPorNivel = { OCEANO: 'grande', ARRECIFE: 'mediano', CORAL: 'chico' }

// "Nos acompañan": las empresas que patrocinan SeaPlace, agrupadas por nivel (Océano primero).
// Se piden al backend una vez, al montarse. Si todavía no hay ninguna, solo queda la invitación a sumarse.
const NosAcompanian = () => {
  const dispatch = useDispatch()
  const { items: patrocinadores, loading: cargando, error } = useSelector((state) => state.patrocinadores)

  useEffect(() => {
    dispatch(traerPatrocinadores())
  }, [dispatch])

  const grupos = niveles
    .map((nivel) => ({ ...nivel, patrocinadores: patrocinadores.filter((patrocinador) => patrocinador.nivel === nivel.codigo) }))
    .filter((grupo) => grupo.patrocinadores.length > 0)

  const elegirLogos = () => {
    if (cargando) {
      return <Cargando texto="Buscando a quienes nos acompañan…" />
    }
    if (error) {
      return <AvisoError mensaje={error} />
    }
    return grupos.map((grupo) => (
      <div key={grupo.codigo} className="space-y-space-sm">
        <p className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          <Icono nombre={grupo.icono} clase="text-[18px]" /> Nivel {grupo.nombre}
        </p>
        <div className="flex flex-wrap items-center gap-x-space-xl gap-y-space-md">
          {grupo.patrocinadores.map((patrocinador) => (
            <LogoPatrocinador key={patrocinador.id} nombre={patrocinador.nombre} icono={patrocinador.icono} tamanio={tamanioPorNivel[grupo.codigo]} />
          ))}
        </div>
      </div>
    ))
  }

  return (
    <section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <TituloSeccion>Nos acompañan</TituloSeccion>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg items-start">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-lg">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Estas empresas duplican los aportes de nuestros padrinos: cuando ves su sello en un animal, cada peso que ponés rinde el doble.
          </p>
          {elegirLogos()}
        </div>

        <div className="fondo-mar text-on-primary rounded-2xl p-space-lg shadow-md space-y-space-md">
          <Icono nombre="handshake" clase="text-[36px]" />
          <h3 className="font-headline-sm text-headline-sm">¿Tu empresa quiere sumarse?</h3>
          <p className="font-body-md text-body-md text-primary-fixed">Tu marca junto a una causa real, con impacto que se puede medir.</p>
          <Link to="/patrocinar" className="inline-block bg-tertiary text-on-tertiary font-label-lg text-label-lg px-space-lg py-space-sm rounded-full hover:bg-tertiary-container">
            ¿Por qué patrocinarnos?
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NosAcompanian
