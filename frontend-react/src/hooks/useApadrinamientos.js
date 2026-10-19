import { traerApadrinamientos } from '../services/apadrinar'
import { useConsulta } from './useConsulta'
import { usePlanes } from './usePlanes'

// Los apadrinamientos del usuario (el backend manda también los cancelados, para el historial).
// Los planes llegan una sola vez al abrir la página, así que esto sigue siendo un solo pedido.
export const useApadrinamientos = () => useConsulta(traerApadrinamientos, usePlanes(), [])