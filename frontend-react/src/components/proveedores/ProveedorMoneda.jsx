import { ContextoMoneda } from '../../contexto/Moneda'
import { useState } from 'react'

const ProveedorMoneda = ({ children }) => {
  const [moneda, cambiarMoneda] = useState('ARS') // 'ARS' | 'USD'

  return <ContextoMoneda.Provider value={{ moneda, cambiarMoneda }}>{children}</ContextoMoneda.Provider>
}

export default ProveedorMoneda