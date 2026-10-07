import Icono from './Icono'

// Menú de secciones de un panel. En pantallas grandes queda fijo al costado (sidebar);
// en el celular se acomoda arriba, en una fila.
// secciones = [{ id, nombre, icono, aviso }]. "aviso" es un número opcional que se muestra en un globito.
const MenuLateral = ({ secciones, activa, onCambiar }) => {
  return (
    <nav className="lg:sticky lg:top-28 bg-surface-container-lowest rounded-2xl shadow-sm p-space-sm flex lg:flex-col flex-wrap gap-space-sm" aria-label="Secciones del panel">
      {secciones.map((seccion) => (
        <button
          key={seccion.id}
          onClick={() => onCambiar(seccion.id)}
          aria-current={seccion.id === activa ? 'page' : undefined}
          className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-xl font-label-lg text-label-lg text-left ${
            seccion.id === activa ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed-variant'
          }`}
        >
          <Icono nombre={seccion.icono} clase="text-[20px]" />
          <span className="flex-1">{seccion.nombre}</span>
          {seccion.aviso > 0 && (
            <span className="bg-tertiary text-on-tertiary rounded-full px-2 font-label-md text-label-md">{seccion.aviso}</span>
          )}
        </button>
      ))}
    </nav>
  )
}

export default MenuLateral
