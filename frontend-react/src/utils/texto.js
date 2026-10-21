export const paraBuscar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export const textoDelAnimal = (animal) => `${animal.nombre} ${animal.especie} ${animal.ubicacion}`