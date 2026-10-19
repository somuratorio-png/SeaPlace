import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ContextoPlanes } from '../../contexto/Planes'
import { ContextoSesion } from '../../contexto/Sesion'
import { ponerEnElMuelle } from '../../services/apadrinar'
import { traerInicio } from '../../services/inicio'
import { SIN_MUELLE } from '../../utils/muelle'
import { puedeApadrinar } from '../../utils/roles'

const ProveedorSesion = ({ children }) => {
  const [planes, setPlanes] = useState([])
  const [usuario, setUsuario] = useState(null)
  // El token de quien inició sesión. Vive solo en memoria: al recargar la página se pierde y hay que volver a entrar.
  const [token, setToken] = useState(null)
  const [favoritos, setFavoritos] = useState([])
  const [muelle, setMuelle] = useState(SIN_MUELLE)
  const [cargando, setCargando] = useState(true)
  const [sinConexion, setSinConexion] = useState(null)
  const [intento, setIntento] = useState(0)

  const navigate = useNavigate()
  const { state } = useLocation()

  // Una sola vez al abrir la página (y de nuevo solo con "Volver a intentar"): los planes.
  // Al abrir la página nunca hay nadie logueado (el token se pierde al recargar), así que no hay sesión que recuperar.
  useEffect(() => {
    traerInicio()
      .then((inicio) => {
        setPlanes(inicio.planes)
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

  // La llama el login cuando el backend aceptó los datos, con { token, sesion }. Si antes de entrar había
  // elegido un animal (viaja en la navegación), se lo agrega al muelle y lo lleva ahí.
  const entrar = ({ token: tokenNuevo, sesion }) => {
    setToken(tokenNuevo)
    setFavoritos(sesion.favoritos)
    setMuelle(sesion.muelle)
    setUsuario(sesion.usuario)

    if (state !== null && state.pendiente && puedeApadrinar(sesion.usuario)) {
      ponerEnElMuelle(tokenNuevo, planes, sesion.muelle, state.pendiente.idAnimal, state.pendiente.codigoPlan)
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
    setToken(null)
    setUsuario(null)
    setFavoritos([])
    setMuelle(SIN_MUELLE)
    navigate('/')
  }

  const sesion = { usuario, token, favoritos, setFavoritos, muelle, setMuelle, cargando, sinConexion, reintentar, entrar, salir, guardarPerfil: setUsuario }

  return (
    <ContextoSesion.Provider value={sesion}>
      <ContextoPlanes.Provider value={planes}>{children}</ContextoPlanes.Provider>
    </ContextoSesion.Provider>
  )
}

export default ProveedorSesion