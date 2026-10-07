import Icono from '../comunes/Icono'
import Olas from '../comunes/Olas'

const beneficios = [
  { icono: 'workspace_premium', titulo: 'Certificado Oficial', texto: 'Con la huella de aleta de tu apadrinado, listo para enmarcar.' },
  { icono: 'satellite_alt', titulo: 'Telemetría GPS', texto: 'Seguí sus coordenadas satelitales, profundidad de inmersión y velocidad.' },
  { icono: 'clinical_notes', titulo: 'Bitácora Médica', texto: 'Reportes del equipo de biólogos con curva de peso y fotos inéditas.' },
  { icono: 'redeem', titulo: 'Emblema Artesanal', texto: 'Parche bordado a mano por artesanas de caletas pesqueras aliadas.' },
]

const KitProtector = () => {
  return (
    <section>
      {/* Las olas abren una franja celeste, como agua baja sobre la arena */}
      <Olas clase="text-primary-fixed -mb-px" />

      <div className="bg-primary-fixed py-space-xl">
        <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin space-y-space-lg">
          <h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-primary text-center">
            Tu Kit del Protector del Océano
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {beneficios.map((beneficio) => (
              <div key={beneficio.titulo} className="bg-surface-container-lowest rounded-2xl p-space-lg space-y-space-sm shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="w-14 h-14 rounded-full fondo-mar text-on-primary flex items-center justify-center">
                  <Icono nombre={beneficio.icono} clase="text-[28px]" />
                </div>
                <h3 className="font-title-lg text-title-lg text-primary">{beneficio.titulo}</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{beneficio.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default KitProtector
