import { traerApadrinamientos } from '../services/apadrinar'
import { useConsulta } from './useConsulta'
import { usePlanes } from './usePlanes'

export const useApadrinamientos = () => useConsulta(traerApadrinamientos, usePlanes(), [])