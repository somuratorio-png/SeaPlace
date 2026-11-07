import { useState } from 'react'
import { useDispatch } from 'react-redux'
import BotonFormulario from '../comunes/BotonFormulario'
import CampoSelect from '../comunes/CampoSelect'
import LogoPatrocinador from '../comunes/LogoPatrocinador'
import MensajeError from '../comunes/MensajeError'
import { modificarMiPatrocinio } from '../../Redux/patrocinioSlice'
import { useFormulario } from '../../hooks/useFormulario'
import { claseCampo } from '../../utils/clasesCampo'
import { intentar } from '../../utils/intentar'

// Los símbolos que puede elegir una empresa para su marca (Material Symbols)
const iconos = [
  { valor: 'storefront', texto: 'Tienda' },
  { valor: 'local_cafe', texto: 'Café' },
  { valor: 'shield', texto: 'Escudo' },
  { valor: 'kayaking', texto: 'Kayak' },
  { valor: 'sailing', texto: 'Velero' },
  { valor: 'scuba_diving', texto: 'Buceo' },
  { valor: 'surfing', texto: 'Surf' },
  { valor: 'eco', texto: 'Hoja' },
  { valor: 'water_drop', texto: 'Gota' },
  { valor: 'restaurant', texto: 'Restaurante' },
]

// Un campo opcional (los de CampoTexto son obligatorios): todos los del perfil se pueden dejar vacíos
const CampoOpcional = ({ etiqueta, nombre, valor, onCambiar, ejemplo, maximo }) => (
  <label htmlFor={nombre} className="flex flex-col gap-1.5">
    <span className="font-label-lg text-label-lg text-on-surface">{etiqueta}</span>
    <input type="text" id={nombre} name={nombre} value={valor} onChange={onCambiar} placeholder={ejemplo} maxLength={maximo} className={claseCampo} />
  </label>
)

// El perfil de la empresa: cómo se ve en el sitio (símbolo, descripción, web) y el beneficio que les da
// a quienes apadrinan, con su cupón. El nombre de la empresa no se cambia.
const FormularioPerfilPatrocinador = ({ perfil }) => {
  const dispatch = useDispatch()
  const { datos, cambiar } = useFormulario({
    icono: perfil.icono,
    descripcion: perfil.descripcion,
    sitioWeb: perfil.sitioWeb,
    beneficio: perfil.beneficio,
    cupon: perfil.cupon,
  })
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [guardado, setGuardado] = useState(false)

  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    if (datos.beneficio.trim() && !datos.cupon.trim()) {
      setError('Si ofrecés un beneficio, indicá también el cupón para usarlo')
      return
    }
    setError(null)
    setGuardado(false)
    setEnviando(true)
    intentar(dispatch(modificarMiPatrocinio(datos))).then((mensaje) => {
      setEnviando(false)
      setGuardado(mensaje === null)
    })
  }

  return (
    <form onSubmit={enviar} className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-headline-sm text-headline-sm text-primary">Tu marca en SeaPlace</h2>
      <LogoPatrocinador nombre={perfil.nombre} icono={datos.icono} />
      <CampoSelect etiqueta="Símbolo" nombre="icono" valor={datos.icono} onCambiar={cambiar} opciones={iconos} />
      <label htmlFor="descripcion" className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-on-surface">Descripción</span>
        <textarea id="descripcion" name="descripcion" rows="3" maxLength={500} value={datos.descripcion} onChange={cambiar} className={claseCampo} />
      </label>
      <CampoOpcional etiqueta="Sitio web" nombre="sitioWeb" valor={datos.sitioWeb} onCambiar={cambiar} ejemplo="tuempresa.com" maximo={255} />

      <h3 className="font-title-lg text-title-lg text-on-surface pt-space-sm">Beneficio para padrinos</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">Lo ven en su panel, en el "Club del Protector", quienes apadrinan un animal.</p>
      <CampoOpcional etiqueta="Beneficio" nombre="beneficio" valor={datos.beneficio} onCambiar={cambiar} ejemplo="15% off en tu primera compra" maximo={300} />
      <CampoOpcional etiqueta="Cupón" nombre="cupon" valor={datos.cupon} onCambiar={cambiar} ejemplo="SEAPLACE15" maximo={255} />

      {error && <MensajeError mensaje={error} />}
      {guardado && <p className="font-label-md text-label-md text-secondary">¡Guardado!</p>}
      <BotonFormulario deshabilitado={enviando}>Guardar</BotonFormulario>
    </form>
  )
}

export default FormularioPerfilPatrocinador
