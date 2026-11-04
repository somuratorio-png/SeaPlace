// Los casos "pending" y "rejected" son iguales en todas las acciones asíncronas: se escriben una vez acá
// y cada slice los registra en sus extraReducers. El "fulfilled" sí cambia: cada slice escribe el suyo.

// pending: arranca el pedido y se limpia el error viejo
export const alEmpezar = (state) => {
  state.loading = true
  state.error = null
}

// rejected: terminó mal; el mensaje ya viene armado con el del backend (ver api.js)
export const alFallar = (state, action) => {
  state.loading = false
  state.error = action.error.message
}
