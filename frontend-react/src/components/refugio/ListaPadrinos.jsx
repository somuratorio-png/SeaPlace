import { formatearFecha } from '../../utils/fechas'
import Precio from '../comunes/Precio'

// Tabla con quién apadrina a cada animal del refugio, con qué plan y desde cuándo.
// "usuarios" se usa para mostrar el nombre completo de cada padrino.
const ListaPadrinos = ({ apadrinamientos, usuarios }) => {
  const nombreDe = (nombreUsuario) => {
    const padrino = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    return padrino ? `${padrino.nombre} ${padrino.apellido}` : nombreUsuario
  }

  if (apadrinamientos.length === 0) {
    return (
      <p className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
        Todavía nadie apadrinó a tus animales.
      </p>
    )
  }

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-primary-fixed font-label-md text-label-md text-on-primary-fixed-variant uppercase tracking-wider">
            <th className="p-space-sm">Padrino</th>
            <th className="p-space-sm">Animal</th>
            <th className="p-space-sm">Plan</th>
            <th className="p-space-sm">Cupos</th>
            <th className="p-space-sm">Desde</th>
            <th className="p-space-sm text-right">Aporte mensual</th>
          </tr>
        </thead>
        <tbody>
          {apadrinamientos.map((a) => (
            <tr key={a.id} className="border-t border-outline-variant hover:bg-surface-container-low">
              <td className="p-space-sm font-body-md text-body-md text-on-surface">{nombreDe(a.usuario)}</td>
              <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{a.animal.nombre}</td>
              <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{a.plan.nombre}</td>
              <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant tabular-nums">{a.cupos}</td>
              <td className="p-space-sm font-body-sm text-body-sm text-on-surface-variant">{formatearFecha(a.desde)}</td>
              <td className="p-space-sm font-label-lg text-label-lg text-primary text-right tabular-nums">
                <Precio valor={a.plan.precio * a.cupos} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ListaPadrinos
