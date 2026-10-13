// Espera un pedido al backend y devuelve una promesa con lo que necesitan los formularios:
// null si salió bien, o el mensaje de error que mandó el backend.
// "mostrarError" es opcional: si se pasa, además se le avisa el mensaje (App lo muestra arriba de la página).
export const intentar = (pedido, mostrarError) =>
  pedido
    .then(() => null)
    .catch((falla) => {
      if (mostrarError) {
        mostrarError(falla.message)
      }
      return falla.message
    })
