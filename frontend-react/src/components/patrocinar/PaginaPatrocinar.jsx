import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Portada from '../comunes/Portada'
import LlamadoPatrocinar from './LlamadoPatrocinar'
import NivelesPatrocinio from './NivelesPatrocinio'
import NumerosSeaPlace from './NumerosSeaPlace'
import PasosPatrocinio from './PasosPatrocinio'
import RazonesPatrocinio from './RazonesPatrocinio'
import SimuladorImpacto from './SimuladorImpacto'
import { traerAnimales } from '../../Redux/animalesSlice'
import { traerPatrocinadores } from '../../Redux/patrocinadoresSlice'
import { esPatrocinador } from '../../utils/roles'

// "¿Por qué patrocinarnos?": la página para empresas. Cuenta qué gana una marca, cómo funciona la duplicación,
// los niveles y un simulador; los números salen del catálogo y de los patrocinadores (se piden al montarse).
// "Quiero patrocinar" lleva al registro de empresa (o al panel, si ya es patrocinador).
const PaginaPatrocinar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { usuario } = useSelector((state) => state.usuario)

  useEffect(() => {
    dispatch(traerAnimales())
    dispatch(traerPatrocinadores())
  }, [dispatch])

  const quieroPatrocinar = () => {
    navigate('/patrocinador', esPatrocinador(usuario) ? undefined : { state: { registro: 'patrocinador' } })
  }

  return (
    <>
      <Portada
        icono="handshake"
        etiqueta="Para empresas"
        titulo="¿Por qué patrocinar SeaPlace?"
        texto="Tu marca junto a los animales que rescatamos, frente a una comunidad que se compromete todos los meses. Y con un impacto que se puede medir."
      />
      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-xl">
        <NumerosSeaPlace />
        <RazonesPatrocinio />
        <PasosPatrocinio />
        <SimuladorImpacto />
        <NivelesPatrocinio />
        <LlamadoPatrocinar usuario={usuario} onPatrocinar={quieroPatrocinar} />
      </div>
    </>
  )
}

export default PaginaPatrocinar
