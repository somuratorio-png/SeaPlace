import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import Icono from '../comunes/Icono'
import LogoPatrocinador from '../comunes/LogoPatrocinador'

// "Club del Protector": los beneficios que ofrecen los patrocinadores a quienes apadrinan, con su cupón.
// El backend solo los da si hay algún apadrinamiento activo, así que los pide PanelProtector cuando ya sabe
// que lo hay. "apadrina": null mientras no se sabe, true o false después. Si es false, se invita a apadrinar.
const SeccionBeneficios = ({ apadrina }) => {
  const { beneficios, cargandoBeneficios, errorBeneficios } = useSelector((state) => state.patrocinadores)

  const elegirContenido = () => {
    if (apadrina === null) {
      return <Cargando texto="Buscando tus beneficios…" />
    }
    if (!apadrina) {
      return (
        <p className="font-body-md text-body-md text-on-surface-variant">
          Cuando apadrines a un animal vas a tener descuentos exclusivos de nuestros patrocinadores.{' '}
          <Link to="/catalogo" className="text-secondary underline">Elegí a tu compañero</Link>.
        </p>
      )
    }
    if (cargandoBeneficios) {
      return <Cargando texto="Buscando tus beneficios…" />
    }
    if (errorBeneficios) {
      return <AvisoError mensaje={errorBeneficios} />
    }
    if (beneficios.length === 0) {
      return <p className="font-body-md text-body-md text-on-surface-variant">Pronto vas a tener beneficios de nuestros patrocinadores.</p>
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {beneficios.map((beneficio) => (
          <div key={beneficio.id} className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
            <LogoPatrocinador nombre={beneficio.empresa} icono={beneficio.icono} tamanio="chico" />
            <p className="font-body-md text-body-md text-on-surface">{beneficio.beneficio}</p>
            <p className="font-label-md text-label-md text-on-surface-variant">
              Usá el código <span className="font-label-lg text-label-lg text-primary bg-primary-fixed rounded-md px-2 py-0.5 tracking-wider">{beneficio.cupon}</span>
            </p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="inline-flex items-center gap-space-sm font-headline-sm text-headline-sm text-primary">
        <Icono nombre="redeem" clase="text-[28px]" /> Club del Protector
      </h2>
      {elegirContenido()}
    </section>
  )
}

export default SeccionBeneficios
