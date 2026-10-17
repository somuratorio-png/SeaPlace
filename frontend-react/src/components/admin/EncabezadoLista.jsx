import TituloSeccion from '../comunes/TituloSeccion'

// El título de una sección de la administración y, al lado, cuántos de sus elementos se muestran.
// "nombre" va en plural (por ejemplo "usuarios"): "Mostrando 5 de 12 usuarios".
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