// Para comparar textos sin importar mayúsculas ni tildes: "Cañón" y "canon" quedan iguales.
// normalize('NFD') separa cada letra de su tilde y el replace borra las tildes sueltas.
export const paraBuscar = (texto) => texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()