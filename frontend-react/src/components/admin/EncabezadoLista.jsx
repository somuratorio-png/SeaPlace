import TituloSeccion from '../comunes/TituloSeccion'

const EncabezadoLista = ({ titulo, nombre, mostrando, total }) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-space-sm">
      <TituloSeccion>{titulo}</TituloSeccion>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Mostrando {mostrando} de {total} {nombre}
      </p>
    </div>
  )
}

export default EncabezadoLista