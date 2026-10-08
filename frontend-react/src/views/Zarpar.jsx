import { useState } from 'react'
import Icono from '../components/comunes/Icono'
import Portada from '../components/comunes/Portada'
import Precio from '../components/comunes/Precio'
import CampoTexto from '../components/login/CampoTexto'
import { PRECIO_BOTIQUIN, totalMuelle } from '../utils/precios'

const formularioVacio = { titular: '', numero: '', vencimiento: '', codigo: '' }

// Zarpar = confirmar el muelle y pagar (igual que la clase Zarpar del backend).
// El pago es simulado: no se cobra nada ni se guardan los datos de la tarjeta (no se mandan al backend).
// Lo que sí es real es la confirmación: onConfirmar le pide al backend que registre el zarpar
// y devuelve su mensaje de error (por ejemplo, si a un animal ya no le quedan cupos), o null si salió bien.
// Los campos de la tarjeta no dejan escribir de más: solo números y hasta el largo justo.
// Antes de confirmar se revisa que el número esté completo, que la tarjeta no esté vencida y el código.

const soloDigitos = (texto) => texto.replace(/\D/g, '')

// Cómo se "limpia" lo que el usuario escribe en cada campo, mientras lo escribe
const limpiar = {
  // Solo letras y espacios
  titular: (texto) => texto.replace(/[^\p{L} ]/gu, '').slice(0, 40),
  // Hasta 16 números, separados de a 4: "1234 5678 9012 3456"
  numero: (texto) => soloDigitos(texto).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 '),
  // Hasta 4 números, con la barra puesta sola: "08/29"
  vencimiento: (texto) => soloDigitos(texto).slice(0, 4).replace(/(\d{2})(?=\d)/, '$1/'),
  // Hasta 3 números
  codigo: (texto) => soloDigitos(texto).slice(0, 3),
}

// Una tarjeta sirve hasta el último día del mes que figura. Devuelve true si ese mes ya pasó.
const estaVencida = (mes, anio) => {
  const hoy = new Date()
  const anioActual = hoy.getFullYear() % 100
  const mesActual = hoy.getMonth() + 1
  return anio < anioActual || (anio === anioActual && mes < mesActual)
}

const Zarpar = ({ muelle, conBotiquin, onConfirmar, onVolver }) => {
  const [datos, setDatos] = useState(formularioVacio)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false) // true mientras se espera la respuesta del backend

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: limpiar[name](value) })
  }

  const confirmar = async (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const mes = Number(datos.vencimiento.slice(0, 2))
    const anio = Number(datos.vencimiento.slice(3, 5))

    if (datos.titular.trim().length < 3) {
      setError('Escribí el nombre del titular como figura en la tarjeta')
      return
    }
    if (soloDigitos(datos.numero).length !== 16) {
      setError('El número de tarjeta tiene que tener 16 dígitos')
      return
    }
    if (datos.vencimiento.length !== 5 || mes < 1 || mes > 12) {
      setError('El vencimiento va con el formato MM/AA y un mes entre 01 y 12, por ejemplo 08/29')
      return
    }
    if (estaVencida(mes, anio)) {
      setError('La tarjeta está vencida')
      return
    }
    if (datos.codigo.length !== 3) {
      setError('El código de seguridad son los 3 dígitos del dorso')
      return
    }

    // Si sale bien, App pasa a la página de gracias y este formulario desaparece
    setEnviando(true)
    const mensaje = await onConfirmar()
    if (mensaje) {
      setError(mensaje)
      setEnviando(false)
    }
  }

  return (
    <>
      <Portada icono="sailing" etiqueta="Último paso" titulo="Todo listo para zarpar" texto="El pago es una simulación: no se realiza ningún cobro ni se guardan los datos de la tarjeta." />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <form onSubmit={confirmar} className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
          <h2 className="font-headline-sm text-headline-sm text-primary">Datos de la tarjeta</h2>

          <CampoTexto etiqueta="Nombre del titular" nombre="titular" valor={datos.titular} onCambiar={cambiar} />
          <CampoTexto etiqueta="Número de tarjeta (16 dígitos)" nombre="numero" valor={datos.numero} onCambiar={cambiar} maximo={19} teclado="numeric" ejemplo="1234 5678 9012 3456" />
          <div className="grid grid-cols-2 gap-space-md">
            <CampoTexto etiqueta="Vencimiento (MM/AA)" nombre="vencimiento" valor={datos.vencimiento} onCambiar={cambiar} maximo={5} teclado="numeric" ejemplo="08/29" />
            <CampoTexto etiqueta="Código de seguridad (3 dígitos)" nombre="codigo" tipo="password" valor={datos.codigo} onCambiar={cambiar} maximo={3} teclado="numeric" />
          </div>

          {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}

          <div className="flex flex-wrap items-center gap-space-md">
            <button type="submit" disabled={enviando} className="inline-flex items-center gap-1 bg-tertiary text-on-tertiary font-title-lg text-title-lg px-space-lg py-space-sm rounded-full shadow-md hover:bg-tertiary-container disabled:opacity-60">
              <Icono nombre="lock" clase="text-[20px]" />
              Zarpar · <Precio valor={totalMuelle(muelle, conBotiquin)} />
            </button>
            <button type="button" onClick={onVolver} className="font-label-lg text-label-lg text-secondary hover:underline">
              Volver al muelle
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-space-lg shadow-md space-y-space-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Tu pedido</h2>
          {muelle.map((item) => (
            <div key={item.animal.id} className="flex justify-between gap-space-md font-body-md text-body-md">
              <span>
                {item.animal.nombre} · {item.plan.nombre} × {item.cantidad} {item.cantidad === 1 ? 'cupo' : 'cupos'}
              </span>
              <span className="text-primary">
                <Precio valor={item.plan.precio * item.cantidad} />
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
              <Precio valor={totalMuelle(muelle, conBotiquin)} />
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Zarpar
