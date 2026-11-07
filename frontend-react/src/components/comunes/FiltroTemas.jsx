import Icono from './Icono'
import { temasPresentes } from '../../services/notificaciones'

// Pestañas para ver las notificaciones por tema: "Todas" y un botón por cada tema que tenga alguna.
// El número es cuántas nuevas hay en ese tema. "elegido" es el código del tema, o null para todas.
// "compacto" es la versión chica de la campanita del header.
const FiltroTemas = ({ notificaciones, elegido, onElegir, compacto = false }) => {
  const presentes = temasPresentes(notificaciones)

  // Con un solo tema no hace falta filtrar
  if (presentes.length < 2) {
    return null
  }

  const clase = (activo) =>
    `inline-flex items-center gap-1 rounded-full font-label-md text-label-md transition ${compacto ? 'px-2.5 py-1' : 'px-space-md py-1.5'} ${
      activo ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-primary-fixed'
    }`

  return (
    <div className="flex flex-wrap gap-space-xs" role="group" aria-label="Filtrar notificaciones por tema">
      <button type="button" onClick={() => onElegir(null)} aria-pressed={elegido === null} className={clase(elegido === null)}>
        Todas
      </button>
      {presentes.map((tema) => (
        <button key={tema.codigo} type="button" onClick={() => onElegir(tema.codigo)} aria-pressed={elegido === tema.codigo} className={clase(elegido === tema.codigo)}>
          <Icono nombre={tema.icono} clase="text-[16px]" />
          {tema.nombre}
          {tema.nuevas > 0 && <span className="bg-tertiary text-on-tertiary rounded-full px-1.5 min-w-5 text-center">{tema.nuevas}</span>}
        </button>
      ))}
    </div>
  )
}

export default FiltroTemas
