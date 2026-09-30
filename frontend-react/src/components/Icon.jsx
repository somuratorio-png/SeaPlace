// Ícono de Google Material Symbols.
// Antes: <span class="material-symbols-outlined text-lg">pets</span>
// Ahora: <Icon name="pets" className="text-lg" />
export default function Icon({ name, className = '', filled = false }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  )
}
