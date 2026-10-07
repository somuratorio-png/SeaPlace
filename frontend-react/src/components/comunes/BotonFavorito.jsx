// Corazón para guardar un animal en favoritos. Relleno = ya es favorito.
const BotonFavorito = ({ esFavorito, onCambiar, clase = '' }) => {
  return (
    <button
      onClick={onCambiar}
      aria-pressed={esFavorito}
      aria-label={esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      title={esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center transition hover:scale-110 ${clase}`}
    >
      <span
        className={`material-symbols-outlined text-[22px] ${esFavorito ? 'text-tertiary' : 'text-on-surface-variant'}`}
        style={{ fontVariationSettings: esFavorito ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  )
}

export default BotonFavorito
