import { traerApadrinamientos } from '../services/apadrinar'
import { useConsulta } from './useConsulta'

// Los apadrinamientos del usuario (el backend manda también los cancelados, para el historial)
export const useApadrinamientos = () => useConsulta(traerApadrinamientos, undefined, [])