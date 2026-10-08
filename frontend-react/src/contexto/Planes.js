import { createContext } from 'react'

// Contexto con los niveles de apadrinamiento que manda el backend (GET /planes):
// [{ codigo, nombre, multiplicador, texto, ubicacionEnVivo }]. App los pide una sola vez y los
// comparte con los componentes que arman los planes de un animal (ver planesDe en utils/precios.js).
export const ContextoPlanes = createContext([])
