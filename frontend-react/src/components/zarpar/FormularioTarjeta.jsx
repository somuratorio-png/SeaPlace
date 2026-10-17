import CampoTexto from '../comunes/CampoTexto'
import Icono from '../comunes/Icono'
import MensajeError from '../comunes/MensajeError'
import Precio from '../comunes/Precio'

// Los datos de la tarjeta y los botones para zarpar o volver al muelle. Es "controlado": los datos y el
// error los guarda el padre. "total" es lo que se muestra en el botón de zarpar.
const FormularioTarjeta = ({ datos, error, enviando, total, onCambiar, onConfirmar, onVolver }) => {
  return (
    <form onSubmit={onConfirmar} className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Datos de la tarjeta</h2>

      <CampoTexto etiqueta="Nombre del titular" nombre="titular" valor={datos.titular} onCambiar={onCambiar} />
      <CampoTexto etiqueta="Número de tarjeta (16 dígitos)" nombre="numero" valor={datos.numero} onCambiar={onCambiar} maximo={19} teclado="numeric" ejemplo="1234 5678 9012 3456" />
      <div className="grid grid-cols-2 gap-space-md">
        <CampoTexto etiqueta="Vencimiento (MM/AA)" nombre="vencimiento" valor={datos.vencimiento} onCambiar={onCambiar} maximo={5} teclado="numeric" ejemplo="08/29" />
        <CampoTexto etiqueta="Código de seguridad (3 dígitos)" nombre="codigo" tipo="password" valor={datos.codigo} onCambiar={onCambiar} maximo={3} teclado="numeric" />
      </div>

      {error && <MensajeError mensaje={error} />}

      <div className="flex flex-wrap items-center gap-space-md">
        <button type="submit" disabled={enviando} className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary font-title-lg text-title-lg px-space-lg py-space-sm rounded-full shadow-md hover:bg-tertiary-container disabled:opacity-60">
          <Icono nombre="lock" clase="text-[20px]" />
          Zarpar · <Precio valor={total} />
        </button>
        <button type="button" onClick={onVolver} className="font-label-lg text-label-lg text-secondary hover:underline">
          Volver al muelle
        </button>
      </div>
    </form>
  )
}

export default FormularioTarjeta