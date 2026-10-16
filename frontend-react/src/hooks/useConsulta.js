import { useEffect, useState } from 'react'

// Pide datos al backend una sola vez, cuando el componente se monta (y de nuevo solo si cambia "argumento").
// "pedido" es una función de services (por ejemplo traerAnimales) y "inicial" es el valor mientras no llegan los datos.
// Devuelve los datos, setDatos (para actualizarlos después de un POST/PUT/DELETE sin volver a pedirlos),
// si todavía está cargando y el mensaje (y el estado HTTP) del error, si lo hubo.
export const useConsulta = (pedido, argumento, inicial = null) => {
  const [datos, setDatos] = useState(inicial)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [estadoError, setEstadoError] = useState(null)

  useEffect(() => {
    pedido(argumento)
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
  }, [pedido, argumento])

  return { datos, setDatos, cargando, error, estadoError }
}