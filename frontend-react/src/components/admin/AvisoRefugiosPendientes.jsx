// Avisa cuántos refugios esperan la aprobación del administrador
const AvisoRefugiosPendientes = ({ cantidad }) => {
  return (
    <p className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl px-space-lg py-space-md font-body-md text-body-md">
      Hay {cantidad} {cantidad === 1 ? 'refugio que espera' : 'refugios que esperan'} tu aprobación. Aparecen primero en la lista.
    </p>
  )
}

export default AvisoRefugiosPendientes