// Etiqueta redondeada de color. tono: 'verde' | 'azul' | 'coral' | 'rojo'
const tonos = {
  verde: 'bg-secondary-container text-on-secondary-fixed-variant',
  azul: 'bg-primary-fixed text-on-primary-fixed-variant',
  coral: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  rojo: 'bg-error-container text-on-error-container',
}

const Chip = ({ texto, tono }) => {
  return <span className={`inline-block rounded-full px-space-sm py-0.5 font-label-md text-label-md ${tonos[tono]}`}>{texto}</span>
}

export default Chip
