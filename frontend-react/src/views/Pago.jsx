import { useState } from 'react'
import Icono from '../components/comunes/Icono'
import Portada from '../components/comunes/Portada'
import Precio from '../components/comunes/Precio'
import CampoTexto from '../components/login/CampoTexto'
import { PRECIO_BOTIQUIN, totalCarrito } from '../utils/precios'

const formularioVacio = { titular: '', numero: '', vencimiento: '', codigo: '' }

// Pantalla de pago (mock): no se cobra nada ni se guardan los datos de la tarjeta.
// Solo se revisa que los campos tengan la forma correcta antes de confirmar.
const Pago = ({ carrito, conBotiquin, onConfirmar, onVolver }) => {
  const [datos, setDatos] = useState(formularioVacio)
  const [error, setError] = useState(null)

  const cambiar = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  const pagar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const soloNumeros = datos.numero.replaceAll(' ', '')

    if (!/^\d{16}$/.test(soloNumeros)) {
      setError('El número de tarjeta tiene que tener 16 dígitos')
      return
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(datos.vencimiento)) {
      setError('El vencimiento va con el formato MM/AA, por ejemplo 08/29')
      return
    }
    if (!/^\d{3}$/.test(datos.codigo)) {
      setError('El código de seguridad son los 3 dígitos del dorso')
      return
    }
    onConfirmar()
  }

  return (
    <>
      <Portada icono="credit_card" etiqueta="Último paso" titulo="Pagá tu apadrinamiento" texto="Es una simulación: no se realiza ningún cobro ni se guardan los datos de la tarjeta." />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <form onSubmit={pagar} className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
          <h2 className="font-headline-sm text-headline-sm text-primary">Datos de la tarjeta</h2>

          <CampoTexto etiqueta="Nombre del titular" nombre="titular" valor={datos.titular} onCambiar={cambiar} />
          <CampoTexto etiqueta="Número de tarjeta (16 dígitos)" nombre="numero" valor={datos.numero} onCambiar={cambiar} />
          <div className="grid grid-cols-2 gap-space-md">
            <CampoTexto etiqueta="Vencimiento (MM/AA)" nombre="vencimiento" valor={datos.vencimiento} onCambiar={cambiar} />
            <CampoTexto etiqueta="Código de seguridad" nombre="codigo" tipo="password" valor={datos.codigo} onCambiar={cambiar} />
          </div>

          {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}

          <div className="flex flex-wrap items-center gap-space-md">
            <button type="submit" className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary font-title-lg text-title-lg px-space-lg py-space-sm rounded-full shadow-md hover:bg-tertiary-container">
              <Icono nombre="lock" clase="text-[20px]" />
              Pagar <Precio valor={totalCarrito(carrito, conBotiquin)} />
            </button>
            <button type="button" onClick={onVolver} className="font-label-lg text-label-lg text-secondary hover:underline">
              Volver al carrito
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Tu pedido</h2>
          {carrito.map((item) => (
            <div key={item.animal.id} className="flex justify-between gap-space-md font-body-md text-body-md">
              <span>
                {item.animal.nombre} · {item.plan.nombre}
              </span>
              <span className="text-primary">
                <Precio valor={item.plan.precio} />
              </span>
            </div>
          ))}
          {conBotiquin && (
            <div className="flex justify-between gap-space-md font-body-md text-body-md">
              <span>Botiquín de rescate</span>
              <span className="text-primary">
                <Precio valor={PRECIO_BOTIQUIN} />
              </span>
            </div>
          )}
          <div className="flex justify-between items-baseline pt-space-sm border-t border-outline-variant">
            <span className="font-title-lg text-title-lg">Total mensual</span>
            <span className="font-headline-md text-headline-md text-primary">
              <Precio valor={totalCarrito(carrito, conBotiquin)} />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Pago
