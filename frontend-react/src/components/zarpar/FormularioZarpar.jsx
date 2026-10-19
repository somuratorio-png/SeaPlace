import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Portada from '../comunes/Portada'
import FormularioTarjeta from './FormularioTarjeta'
import ResumenPedido from './ResumenPedido'
import { zarpar } from '../../services/apadrinar'
import { useSesion } from '../../hooks/useSesion'
import { totalMuelle } from '../../utils/precios'
import { limpiarCampoTarjeta, validarTarjeta } from '../../utils/tarjeta'
import { useMuelle } from '../../hooks/useMuelle'

const formularioVacio = { titular: '', numero: '', vencimiento: '', codigo: '' }

// Zarpar = confirmar el muelle y pagar (igual que la clase Zarpar del backend).
// El pago es simulado: no se cobra nada ni se guardan los datos de la tarjeta (no se mandan al backend).
// Lo que sí es real es la confirmación: se le pide al backend que registre el zarpar. Si falla (por ejemplo,
// si a un animal ya no le quedan cupos) se muestra su mensaje; si sale bien, se pasa a la página de gracias.
// Los campos de la tarjeta no dejan escribir de más: solo números y hasta el largo justo.
// Antes de confirmar se revisa que el número esté completo, que la tarjeta no esté vencida y el código.
const FormularioZarpar = () => {
  const { token } = useSesion()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { idMuelle, items: muelle, vaciar } = useMuelle()
  const conBotiquin = state !== null && state.conBotiquin === true

  const [datos, setDatos] = useState(formularioVacio)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false) // true mientras se espera la respuesta del backend
  const [zarpado, setZarpado] = useState(false) // true cuando el pago salió bien y ya se va a gracias

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: limpiarCampoTarjeta[name](value) })
  }

  const confirmar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página

    const errorTarjeta = validarTarjeta(datos)
    if (errorTarjeta !== null) {
      setError(errorTarjeta)
      return
    }

    // El backend vuelve a validar los cupos, convierte cada ítem en un apadrinamiento y cierra el muelle.
    // Si sale bien, se pasa a la página de gracias y este formulario desaparece
    setEnviando(true)
    zarpar(token, idMuelle, conBotiquin)
      .then((totalPagado) => {
        const apadrinados = muelle.map((item) => ({ id: item.animal.id, animal: item.animal, plan: item.plan }))
        setZarpado(true)
        vaciar()
        navigate('/gracias', { state: { zarpar: { apadrinados, total: totalPagado } } })
      })
      .catch((falla) => {
        setError(falla.message)
        setEnviando(false)
      })
  }

  // Con el muelle vacío no hay nada que pagar. Justo después de zarpar también queda vacío,
  // pero ahí ya se está yendo a la página de gracias.
  if (muelle.length === 0) {
    return zarpado ? null : <Navigate to="/muelle" replace />
  }

  const total = totalMuelle(muelle, conBotiquin)

  return (
    <>
      <Portada icono="sailing" etiqueta="Último paso" titulo="Todo listo para zarpar" texto="El pago es una simulación: no se realiza ningún cobro ni se guardan los datos de la tarjeta." />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        <FormularioTarjeta
          datos={datos}
          error={error}
          enviando={enviando}
          total={total}
          onCambiar={cambiar}
          onConfirmar={confirmar}
          onVolver={() => navigate('/muelle', { state: { conBotiquin } })}
        />
        <ResumenPedido muelle={muelle} conBotiquin={conBotiquin} total={total} />
      </div>
    </>
  )
}

export default FormularioZarpar