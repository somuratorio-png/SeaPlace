import Icono from '../comunes/Icono'
import TituloSeccion from '../comunes/TituloSeccion'

const razones = [
  { icono: 'visibility', titulo: 'Tu marca, donde mira tu público', texto: 'Tu sello aparece en la ficha y en la tarjeta de cada animal que acompañás, y tu logo en el inicio. Lo ven personas que eligen comprometerse todos los meses.' },
  { icono: 'insights', titulo: 'Impacto que se puede medir', texto: 'Tu panel muestra en tiempo real cuánta plata movilizaste, a cuántos padrinos llegaste y a qué animales ayudaste. Nada de promesas: números.' },
  { icono: 'workspace_premium', titulo: 'Listo para tu informe de sustentabilidad', texto: 'El reporte de impacto se guarda como PDF y suma a tu estrategia de responsabilidad social y a tus métricas de sustentabilidad.' },
  { icono: 'all_inclusive', titulo: 'Cada peso rinde el doble', texto: 'La duplicación motiva a los padrinos: cuando saben que su aporte se multiplica, se suman más. Tu inversión moviliza la de toda la comunidad.' },
  { icono: 'loyalty', titulo: 'Clientes que ya te eligen', texto: 'Con el Club del Protector les ofrecés un beneficio exclusivo a los padrinos: gente con valores afines que llega a tu marca con un cupón en la mano.' },
  { icono: 'verified', titulo: 'Transparencia total', texto: 'Trabajamos solo con refugios aprobados por nuestro equipo, y cada aporte queda registrado con su animal, su fecha y su monto.' },
]

// Las razones para patrocinar: lo que gana una empresa
const RazonesPatrocinio = () => {
  return (
    <section className="space-y-space-lg">
      <TituloSeccion>Lo que gana tu empresa</TituloSeccion>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {razones.map((razon) => (
          <div key={razon.titulo} className="revelar bg-surface-container-lowest rounded-2xl p-space-lg space-y-space-sm shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="w-12 h-12 rounded-full fondo-mar text-on-primary flex items-center justify-center">
              <Icono nombre={razon.icono} clase="text-[26px]" />
            </div>
            <h3 className="font-title-lg text-title-lg text-primary">{razon.titulo}</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">{razon.texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RazonesPatrocinio
