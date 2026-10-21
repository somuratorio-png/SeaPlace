const BotonFormulario = ({ children, deshabilitado = false }) => {
  return (
    <button type="submit" disabled={deshabilitado} className="brillo w-full bg-tertiary text-on-tertiary font-title-lg text-title-lg py-3 rounded-full hover:bg-tertiary-container disabled:opacity-60">
      {children}
    </button>
  )
}

export default BotonFormulario