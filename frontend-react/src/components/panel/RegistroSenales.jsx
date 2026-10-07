import { conductas, coordenadasDe, horaDe } from '../../utils/telemetria'

// Lista de las últimas señales recibidas, de la más nueva a la más vieja.
// También aparecen las que se perdieron, para que se entienda por qué hay huecos en el mapa.
const RegistroSenales = ({ senales }) => {
  const recientes = [...senales].reverse()

  return (
    <div className="space-y-space-xs">
      <h3 className="font-title-lg text-title-lg text-on-surface">Registro de señales</h3>

      {recientes.map((senal) => (
        <div key={senal.n} className="escalonar">
          <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 bg-surface-container-low rounded-xl px-space-md py-space-sm font-body-sm text-body-sm">
            <span className="font-label-lg text-label-lg text-primary tabular-nums w-28">{horaDe(senal)}</span>

            {senal.perdida ? (
              <span className="text-on-surface-variant italic">Sin señal: estaba sumergido y el transmisor no llegó a la superficie.</span>
            ) : (
              <>
                <span className="inline-flex items-center gap-1.5 w-36">
                  <span className="w-2.5 h-2.5 rounded-full ring-1 ring-outline" style={{ backgroundColor: conductas[senal.conducta].color }} />
                  {conductas[senal.conducta].nombre}
                </span>
                <span className="text-on-surface-variant tabular-nums">{coordenadasDe(senal)}</span>
                <span className="text-on-surface-variant tabular-nums ml-auto">{senal.profundidad.toFixed(0)} m de profundidad</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default RegistroSenales
