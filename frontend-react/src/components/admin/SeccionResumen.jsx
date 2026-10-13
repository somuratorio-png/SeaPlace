import { useEffect, useState } from 'react'
import { traerAnimales } from '../../services/animales'
import { traerApadrinamientos } from '../../services/apadrinar'
import { recaudacionMensual } from '../../utils/precios'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import GraficoRecaudacion from './GraficoRecaudacion'
import TarjetaDato from './TarjetaDato'

// Sección "Resumen" del administrador: los números generales y el gráfico de recaudación.
// "usuarios" los tiene el panel. Los animales publicados y los apadrinamientos los pide esta
// sección al backend cuando se abre, un pedido por lista.
const SeccionResumen = ({ usuarios }) => {
  const [animales, setAnimales] = useState([])
  const [apadrinamientos, setApadrinamientos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorAlCargar, setErrorAlCargar] = useState(null)

  // Los animales publicados
  useEffect(() => {
    traerAnimales()
      .then((lista) => {
        setAnimales(lista)
      })
      .catch((falla) => {
        setErrorAlCargar(falla.message)
      })
  }, [])

  // Todos los apadrinamientos, para la recaudación
  useEffect(() => {
    traerApadrinamientos()
      .then((lista) => {
        setApadrinamientos(lista)
      })
      .catch((falla) => {
        setErrorAlCargar(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [])

  const refugios = usuarios.filter((u) => u.rol === 'refugio')
  const dadosDeBaja = usuarios.filter((u) => !u.activo)

  // Un renglón del gráfico por cada refugio aprobado
  const recaudacionPorRefugio = refugios
    .filter((refugio) => refugio.aprobado)
    .map((refugio) => {
      const suyos = apadrinamientos.filter((a) => a.activo && a.animal.idRefugio === refugio.idRefugio)
      return { nombre: `${refugio.nombre} ${refugio.apellido}`, valor: recaudacionMensual(suyos), padrinos: suyos.length }
    })

  if (cargando) {
    return <Cargando texto="Cargando el resumen…" />
  }
  if (errorAlCargar) {
    return <AvisoError mensaje={errorAlCargar} />
  }

  return (
    <div className="space-y-space-lg">
      <div className="escalonar grid grid-cols-2 xl:grid-cols-4 gap-space-md">
        <TarjetaDato icono="home_health" valor={refugios.length} titulo="Refugios" clase="bg-secondary-container text-on-secondary-fixed-variant" />
        <TarjetaDato icono="pets" valor={animales.length} titulo="Animales publicados" clase="bg-primary-fixed text-on-primary-fixed-variant" />
        <TarjetaDato icono="group" valor={usuarios.length} titulo="Usuarios" clase="bg-tertiary-fixed text-on-tertiary-fixed-variant" />
        <TarjetaDato icono="person_off" valor={dadosDeBaja.length} titulo="Dados de baja" clase="bg-error-container text-on-error-container" />
      </div>

      <GraficoRecaudacion datos={recaudacionPorRefugio} />
    </div>
  )
}

export default SeccionResumen
