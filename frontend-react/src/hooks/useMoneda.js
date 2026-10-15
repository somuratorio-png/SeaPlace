import { useContext } from 'react'
import { ContextoMoneda } from '../contexto/Moneda'

export const useMoneda = () => useContext(ContextoMoneda)