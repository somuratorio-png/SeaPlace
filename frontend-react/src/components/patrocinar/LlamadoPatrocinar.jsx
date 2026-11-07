import Icono from '../comunes/Icono'
import { esPatrocinador } from '../../utils/roles'

// El cierre de la página: invitar a la empresa a registrarse. Si ya es patrocinador, lo lleva a su panel;
// si entró con otro tipo de cuenta, le avisa que la empresa necesita su propia cuenta.
const LlamadoPatrocinar = ({ usuario, onPatrocinar }) => {
  const otraCuenta = usuario !== null && !esPatrocinador(usuario)

  return (
    <section className="bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl p-space-lg lg:p-space-xl shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-lg">
      <div className="space-y-space-xs max-w-2xl">
        <h2 className="font-headline-md text-headline-md">Sumá tu marca a la ola</h2>
        <p className="font-body-md text-body-md">
          {otraCuenta
            ? 'Tu empresa necesita su propia cuenta de patrocinador: cerrá sesión y registrala desde acá.'
            : 'Creá la cuenta de tu empresa y armá tu primera campaña hoy mismo. Sin intermediarios ni aprobaciones.'}
        </p>
      </div>
      {!otraCuenta && (
        <button onClick={onPatrocinar} className="brillo shrink-0 whitespace-nowrap inline-flex items-center gap-space-sm bg-tertiary text-on-tertiary font-title-lg text-title-lg px-space-xl py-space-md rounded-full shadow-md hover:bg-tertiary-container">
          <Icono nombre="handshake" clase="text-[24px]" />
          {esPatrocinador(usuario) ? 'Ir a mi panel' : 'Quiero patrocinar'}
        </button>
      )}
    </section>
  )
}

export default LlamadoPatrocinar
