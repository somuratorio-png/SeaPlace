// Para comparar textos sin importar mayúsculas ni tildes: "Cañón" y "canon" quedan iguales.
// normalize('NFD') separa cada letra de su tilde y el replace borra las tildes sueltas.
export const paraBuscar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

// El texto de un animal sobre el que se busca: su nombre, su especie y dónde está
export const textoDelAnimal = (animal) => `${animal.nombre} ${animal.especie} ${animal.ubicacion}`