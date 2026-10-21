export const intentar = (pedido, mostrarError) =>
  pedido
    .then(() => null)
    .catch((falla) => {
      if (mostrarError) {
        mostrarError(falla.message)
      }
      return falla.message
    })
