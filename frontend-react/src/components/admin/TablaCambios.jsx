import Precio from '../comunes/Precio'

// Qué pide cambiar el refugio en una publicación ya aprobada: cada campo como está hoy y como quedaría.
// "cambios" = [{ campo, antes, despues, esPrecio }], ver diferencias en services/animales.js
const TablaCambios = ({ cambios }) => {
  if (cambios.length === 0) {
    return <p className="px-space-md font-body-sm text-body-sm text-on-surface-variant">Mandó el formulario sin cambiar nada: podés aprobarlo o rechazarlo igual.</p>
  }

  const mostrar = (cambio, valor) => (cambio.esPrecio && typeof valor === 'number' ? <Precio valor={valor} /> : valor)

  return (
    <div className="px-space-md overflow-x-auto">
      <table className="w-full font-body-sm text-body-sm text-left">
        <thead>
          <tr className="text-on-surface-variant">
            <th className="py-1 pr-space-md font-label-md text-label-md">Campo</th>
            <th className="py-1 pr-space-md font-label-md text-label-md">Hoy</th>
            <th className="py-1 font-label-md text-label-md">Pide cambiarlo por</th>
          </tr>
        </thead>
        <tbody>
          {cambios.map((cambio) => (
            <tr key={cambio.campo} className="border-t border-primary-fixed align-top">
              <td className="py-1.5 pr-space-md font-label-lg text-label-lg text-on-surface whitespace-nowrap">{cambio.campo}</td>
              <td className="py-1.5 pr-space-md text-on-surface-variant line-through">{mostrar(cambio, cambio.antes)}</td>
              <td className="py-1.5 text-on-surface">{mostrar(cambio, cambio.despues)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TablaCambios
