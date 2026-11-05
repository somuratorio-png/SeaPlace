// Los casos "pending" y "rejected" se repiten en todas las acciones asíncronas: se escriben una vez acá
// y cada slice los registra en sus extraReducers. El "fulfilled" sí cambia: cada slice escribe el suyo.
//
// Hay dos juegos de estados, para no pisarse:
// - loading / error: los GET que llenan la pantalla (mientras cargan se muestra "Cargando…").
// - enviando / errorAccion: los POST, PUT y DELETE. Si usaran loading, la pantalla entera pasaría a
//   "Cargando…" en cada clic y se cerrarían los formularios que estaban abiertos.

// GET pending: arranca el pedido y se limpia el error viejo
export const alEmpezar = (state) => {
  state.loading = true
  state.error = null
}

// GET rejected: terminó mal; el mensaje sale del backend (action.payload.mensaje, ver rejectWithValue en los thunks)
// o, si el thunk no lo manda, del genérico de axios en action.error.message
export const alFallar = (state, action) => {
  state.loading = false
  state.error = action.payload ? action.payload.mensaje : action.error.message
}

// POST/PUT/DELETE pending
export const alEnviar = (state) => {
  state.enviando = true
  state.errorAccion = null
}

// POST/PUT/DELETE rejected
export const alFallarEnvio = (state, action) => {
  state.enviando = false
  state.errorAccion = action.payload ? action.payload.mensaje : action.error.message
}
