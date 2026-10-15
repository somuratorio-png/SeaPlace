import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ContextoPlanes } from '../../contexto/Planes'
import { ContextoSesion } from '../../contexto/Sesion'
import { ponerEnElMuelle } from '../../services/apadrinar'
import { traerInicio } from '../../services/inicio'
import * as usuariosApi from '../../services/usuarios'
import { SIN_MUELLE } from '../../utils/muelle'
import { puedeApadrinar } from '../../utils/roles'

const ProveedorSesion = ({ children }) => {
  const [planes, setPlanes] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [muelle, setMuelle] = useState(SIN_MUELLE)
  const [cargando, setCargando] = useState(true)
  const [sinConexion, setSinConexion] = useState(null)
  const [intento, setIntento] = useState(0)

  const navigate = useNavigate()
  const { state } = useLocation()

  // Una sola vez al abrir la página (y de nuevo solo con "Volver a intentar"): planes y sesión guardada
  useEffect(() => {
    traerInicio()
      .then((inicio) => {
        setPlanes(inicio.planes)

        const sesion = inicio.sesion
        if (!sesion) {
          usuariosApi.salir()
          return
        }
        setFavoritos(sesion.favoritos)
        setMuelle(sesion.muelle)
        setUsuario(sesion.usuario)
      })
      .catch((falla) => {
        setSinConexion(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [intento])

  const reintentar = () => {
    setSinConexion(null)
    setCargando(true)
    setIntento(intento + 1)
  }

  // La llama el login cuando el backend aceptó los datos. Si antes de entrar había elegido
  // un animal (viaja en la navegación), se lo agrega al muelle y lo lleva ahí.
  const entrar = (sesion) => {
    setFavoritos(sesion.favoritos)
    setMuelle(sesion.muelle)
    setUsuario(sesion.usuario)

    if (state !== null && state.pendiente && puedeApadrinar(sesion.usuario)) {
      ponerEnElMuelle(sesion.muelle, state.pendiente.idAnimal, state.pendiente.codigoPlan)
        .then((muelleNuevo) => {
          setMuelle(muelleNuevo)
          navigate('/muelle')
        })
        .catch((falla) => {
          navigate('/panel', { replace: true, state: { error: falla.message } })
        })
    }
  }

  const salir = () => {
    usuariosApi.salir()
    setUsuario(null)
    setFavoritos([])
    setMuelle(SIN_MUELLE)
    navigate('/')
  }

  const sesion = { usuario, favoritos, setFavoritos, muelle, setMuelle, cargando, sinConexion, reintentar, entrar, salir, guardarPerfil: setUsuario }

  return (
    <ContextoSesion.Provider value={sesion}>
      <ContextoPlanes.Provider value={planes}>{children}</ContextoPlanes.Provider>
    </ContextoSesion.Provider>
  )
}

export default ProveedorSesion