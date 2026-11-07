import BarraProgreso from '../comunes/BarraProgreso'
import Precio from '../comunes/Precio'
import TarjetaDato from '../comunes/TarjetaDato'
import { niveles, nivelDe } from '../../services/patrocinadores'

// Los números del patrocinador: lo que movilizó, a cuántos padrinos llegó, a cuántos animales acompañó,
// y su nivel con lo que le falta para el siguiente (según lo comprometido en sus campañas).
const ImpactoPatrocinio = ({ perfil, impacto }) => {
  const nivel = nivelDe(perfil.nivel)
  // niveles va de mayor a menor: el siguiente es el que está antes en la lista
  const siguiente = niveles[niveles.indexOf(nivel) - 1] || null
  const avance = siguiente ? Math.min(100, Math.round((perfil.comprometido * 100) / siguiente.desde)) : 100

  return (
    <section className="space-y-space-md">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
        <TarjetaDato icono="payments" valor={<Precio valor={impacto.plata} />} titulo="Movilizados con tus campañas" clase="bg-primary text-on-primary" />
        <TarjetaDato icono="volunteer_activism" valor={<Precio valor={perfil.aportado} />} titulo="Tu aporte" clase="bg-tertiary-fixed text-on-tertiary-fixed" />
        <TarjetaDato icono="groups" valor={impacto.padrinos} titulo="Padrinos alcanzados" clase="bg-secondary-container text-on-secondary-container" />
        <TarjetaDato icono="pets" valor={perfil.animales} titulo="Animales acompañados" clase="bg-surface-container-lowest text-primary" />
      </div>

      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <span className={`px-space-md py-1 rounded-full font-label-lg text-label-lg ${nivel.clase}`}>Nivel {nivel.nombre}</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Comprometido: <Precio valor={perfil.comprometido} />
          </span>
        </div>
        <BarraProgreso porcentaje={avance} />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {siguiente ? (
            <>
              Te faltan <Precio valor={siguiente.desde - perfil.comprometido} /> en campañas para llegar a {siguiente.nombre}.
            </>
          ) : (
            'Estás en el nivel más alto: tu marca va primera en el inicio.'
          )}
        </p>
      </div>
    </section>
  )
}

export default ImpactoPatrocinio
