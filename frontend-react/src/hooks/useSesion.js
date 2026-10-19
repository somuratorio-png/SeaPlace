import { useContext } from 'react'
import { ContextoSesion } from '../contexto/Sesion'
import { esAdmin, esRefugio, puedeApadrinar } from '../utils/roles'

export const useSesion = () => {
  const { usuario, token, cargando, sinConexion, reintentar, entrar, salir, guardarPerfil } = useContext(ContextoSesion)

  return {
    usuario,
    token, // el de quien inició sesión (o null): cada llamada al backend lo recibe
    esAdmin: esAdmin(usuario),
    esRefugio: esRefugio(usuario),
    puedeApadrinar: puedeApadrinar(usuario),
    cargando,
    sinConexion,
    reintentar,
    entrar,
    salir,
    guardarPerfil,
  }
}