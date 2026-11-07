import Icono from '../comunes/Icono'
import TituloSeccion from '../comunes/TituloSeccion'

const pasos = [
  { icono: 'badge', titulo: 'Creás la cuenta de tu empresa', texto: 'En un minuto, sin esperar aprobación. Elegís el símbolo de tu marca y, si querés, un beneficio para los padrinos.' },
  { icono: 'target', titulo: 'Proponés una campaña', texto: 'Elegís el animal que querés acompañar, hasta cuánto duplicar y hasta cuándo. Su refugio la acepta y aparece tu sello.' },
  { icono: 'trending_up', titulo: 'Duplicás y medís', texto: 'Cada aporte de un padrino para ese animal se duplica con tu campaña, y en tu panel ves el impacto crecer.' },
]

// Cómo funciona el patrocinio, en tres pasos
const PasosPatrocinio = () => {
  return (
    <section className="space-y-space-lg">
      <TituloSeccion>Cómo funciona</TituloSeccion>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {pasos.map((paso, indice) => (
          <li key={paso.titulo} className="relative bg-surface-container-lowest rounded-2xl p-space-lg space-y-space-sm shadow-sm">
            <span className="absolute top-space-md right-space-md font-headline-lg text-headline-lg text-primary-fixed-dim">{indice + 1}</span>
            <Icono nombre={paso.icono} clase="text-secondary text-[32px]" />
            <h3 className="font-title-lg text-title-lg text-primary">{paso.titulo}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{paso.texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default PasosPatrocinio
