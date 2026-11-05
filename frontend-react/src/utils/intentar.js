// dispatch(accionAsincronica()) devuelve una promesa con la action con la que terminó el thunk:
// la "fulfilled" (con lo que contestó el backend en action.payload) o la "rejected" (con el mensaje
// del backend en action.payload.mensaje, ver rejectWithValue en los thunks, o el genérico de axios
// en action.error.message si el thunk no lo manda). Esto la convierte en lo que necesitan los formularios:
// null si salió bien, o el mensaje de error.
// "mostrarError" es opcional: si se pasa, además se le avisa el mensaje (la página lo muestra arriba).
// Ejemplo: intentar(dispatch(crearRol(nombre))).then((mensaje) => { if (mensaje === null) ... })
export const intentar = (despacho, mostrarError) =>
  despacho.then((accion) => {
    if (accion.error) {
      if (mostrarError) {
        mostrarError(accion.payload ? accion.payload.mensaje : accion.error.message)
      }
      return accion.payload ? accion.payload.mensaje : accion.error.message
    }
    return null
  })
