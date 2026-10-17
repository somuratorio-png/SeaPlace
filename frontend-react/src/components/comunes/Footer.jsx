import FondoMarino from './FondoMarino'
import FormularioSuscripcion from './FormularioSuscripcion'
import MarcaFooter from './MarcaFooter'
import Olas from './Olas'

const Footer = () => {
  return (
    <footer className="w-full mt-space-xl print:hidden">
      {/* Las olas tienen el mismo color con el que arranca el fondo del footer */}
      <Olas clase="text-primary -mb-px" />

      <div className="fondo-mar-profundo text-on-primary relative overflow-hidden">
        <FondoMarino />

        <div className="relative max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <MarcaFooter />
          <FormularioSuscripcion />
        </div>
      </div>
    </footer>
  )
}

export default Footer