// dispatch(accionAsincronica()) devuelve una promesa con la action con la que terminó el thunk:
// la "fulfilled" (con lo que contestó el backend en action.payload) o la "rejected" (con el mensaje
// en action.error.message). Esto la convierte en lo que necesitan los formularios:
// null si salió bien, o el mensaje de error.
// "mostrarError" es opcional: si se pasa, además se le avisa el mensaje (la página lo muestra arriba).
// Ejemplo: intentar(dispatch(crearRol(nombre))).then((mensaje) => { if (mensaje === null) ... })
export const intentar = (despacho, mostrarError) =>
  despacho.then((accion) => {
    if (accion.error) {
      if (mostrarError) {
        mostrarError(accion.error.message)
      }
      return accion.error.message
    }
    return null
  })
