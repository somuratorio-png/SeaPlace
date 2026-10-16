const LARGO_MINIMO_CONTRASENIA = 8

// Devuelve el mensaje de error si la contraseña es muy corta, o null si está bien.
// "sujeto" es cómo se llama en el mensaje (por ejemplo "La contraseña nueva").
export const validarContrasenia = (contrasenia, sujeto = 'La contraseña') =>
  contrasenia.length < LARGO_MINIMO_CONTRASENIA ? `${sujeto} debe tener al menos ${LARGO_MINIMO_CONTRASENIA} caracteres` : null