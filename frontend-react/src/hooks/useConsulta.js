import { useEffect, useState } from 'react'
import { useSesion } from './useSesion'

export const useConsulta = (pedido, argumento, inicial = null) => {
  const [datos, setDatos] = useState(inicial)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [estadoError, setEstadoError] = useState(null)
  const { token } = useSesion()

  useEffect(() => {
    pedido(token, argumento)
      .then((respuesta) => {
        setDatos(respuesta)
      })
      .catch((falla) => {
        setError(falla.message)
        setEstadoError(falla.estado ?? null)
      })
      .then(() => {
        setCargando(false)
      })
  }, [pedido, argumento, token])

  return { datos, setDatos, cargando, error, estadoError }
}