// Los animales, las categorías y los planes vienen del backend (ver src/services).
// Acá queda solo lo que es fijo en las pantallas.

// Las urgencias médicas que puede tener un animal. El id es el que usan los filtros del catálogo
// (el backend lo guarda en mayúsculas) y "estado" es el texto que se muestra en el cartelito
// cuando el refugio no escribió uno propio.
export const urgencias = [
  { id: 'critico', estado: 'Peligro Crítico' },
  { id: 'recuperacion', estado: 'En Recuperación' },
  { id: 'listo', estado: 'Listo para Liberación' },
]
