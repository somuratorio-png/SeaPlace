import { planesDe } from '../utils/precios'
import { animalesDeDemo } from './animales'

// Apadrinamientos y novedades de ejemplo (mock), para que los paneles no arranquen vacíos.
// Un apadrinamiento guarda quién apadrina, una copia del animal, el plan, cuántos cupos tomó y los pagos hechos.

const crear = (id, usuario, idAnimal, indicePlan, fechasDePago) => {
  const animal = animalesDeDemo.find((a) => a.id === idAnimal)
  const plan = planesDe(animal)[indicePlan]
  return {
    id,
    usuario,
    animal,
    plan,
    cupos: 1,
    desde: fechasDePago[0],
    activo: true,
    pagos: fechasDePago.map((fecha) => ({ fecha, monto: plan.precio })),
  }
}

export const apadrinamientosDeDemo = [
  crear('demo-1', 'marina', 'jacinta', 2, ['2026-07-10', '2026-08-10', '2026-09-10']),
  crear('demo-2', 'marina', 'kelp', 1, ['2026-08-22', '2026-09-22']),
  crear('demo-3', 'tomas', 'jacinta', 0, ['2026-09-03']),
  crear('demo-4', 'tomas', 'luna', 1, ['2026-06-15', '2026-07-15', '2026-08-15', '2026-09-15']),
  crear('demo-5', 'tomas', 'mar', 2, ['2026-08-01', '2026-09-01']),
]

export const novedadesDeDemo = [
  { id: 'nov-1', animalId: 'jacinta', fecha: '2026-09-28', texto: 'Hoy comió sola por primera vez: tres arenques enteros sin ayuda.' },
  { id: 'nov-2', animalId: 'jacinta', fecha: '2026-09-12', texto: 'Subió 1,2 kg esta semana. Ya nada en la pileta grande con otras dos crías.' },
  { id: 'nov-3', animalId: 'kelp', fecha: '2026-09-20', texto: 'El rastreador muestra que amplió su zona de buceo hacia el arrecife norte.' },
  { id: 'nov-4', animalId: 'luna', fecha: '2026-09-25', texto: 'Terminó el tratamiento con antibióticos. La herida del cuello cerró bien.' },
  { id: 'nov-5', animalId: 'mar', fecha: '2026-09-18', texto: 'Cruzó sin problemas una ruta de barcos comerciales. Sigue rumbo al sur.' },
]
