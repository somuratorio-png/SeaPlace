import NovedadBitacora from './NovedadBitacora'

// Novedades que el refugio fue publicando sobre el animal, de la más nueva a la más vieja
const Bitacora = ({ nombre, novedades }) => {
  // Las fechas son texto 'AAAA-MM-DD', así que se pueden ordenar comparándolas como texto
  const ordenadas = [...novedades].sort((a, b) => b.fecha.localeCompare(a.fecha))

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Bitácora de {nombre}</h2>

      {ordenadas.length === 0 && (
        <p className="font-body-md text-body-md text-on-surface-variant">El refugio todavía no publicó novedades.</p>
      )}

      {ordenadas.map((novedad) => (
        <NovedadBitacora key={novedad.id} novedad={novedad} />
      ))}
    </div>
  )
}

export default Bitacora
