import { ContextoMoneda } from '../../contexto/Moneda'
import { useEstadoGuardado } from '../../hooks/useEstadoGuardado'

const ProveedorMoneda = ({ children }) => {
  const [moneda, cambiarMoneda] = useEstadoGuardado('moneda', 'ARS') // 'ARS' | 'USD'

  return <ContextoMoneda.Provider value={{ moneda, cambiarMoneda }}>{children}</ContextoMoneda.Provider>
}

export default ProveedorMoneda