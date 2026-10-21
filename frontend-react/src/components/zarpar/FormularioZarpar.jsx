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

const FormularioZarpar = () => {
  const { token } = useSesion()
  const navigate = useNavigate()
  const { state } = useLocation()
  const { idMuelle, items: muelle, vaciar } = useMuelle()
  const conBotiquin = state !== null && state.conBotiquin === true

  const [datos, setDatos] = useState(formularioVacio)
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [zarpado, setZarpado] = useState(false)

  const cambiar = (evento) => {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: limpiarCampoTarjeta[name](value) })
  }

  const confirmar = (evento) => {
    evento.preventDefault()

    const errorTarjeta = validarTarjeta(datos)
    if (errorTarjeta !== null) {
      setError(errorTarjeta)
      return
    }

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