import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AvisoError from '../comunes/AvisoError'
import Cargando from '../comunes/Cargando'
import MensajeVacio from '../comunes/MensajeVacio'
import TituloSeccion from '../comunes/TituloSeccion'
import FormularioComentario from '../comentarios/FormularioComentario'
import TarjetaTestimonio from './TarjetaTestimonio'
import { borrarComentario, comentar, limpiarError, traerComentarios } from '../../Redux/comentariosSlice'
import { puedeBorrar } from '../../services/comentarios'
import { intentar } from '../../utils/intentar'

// Los comentarios que la comunidad deja sobre la página. Los ve cualquiera; para escribir hay que haber entrado.
// Se piden al backend una vez, al montarse; lo que se agrega o se borra después actualiza el estado sin volver a pedir.
const Testimonios = () => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.usuario)
  const { items: comentarios, loading: cargando, error, errorAccion } = useSelector((state) => state.comentarios)

  useEffect(() => {
    dispatch(limpiarError())
    dispatch(traerComentarios())
  }, [dispatch])

  const enviar = (texto) => intentar(dispatch(comentar(texto)))

  const borrar = (comentario) => {
    dispatch(borrarComentario(comentario.id))
  }

  // La grilla de comentarios: el aviso de espera, el error del backend, el mensaje de vacío o las tarjetas
  const elegirComentarios = () => {
    if (cargando) {
      return <Cargando texto="Buscando los comentarios…" />
    }
    if (error) {
      return <AvisoError mensaje={error} />
    }
    if (comentarios.length === 0) {
      return <MensajeVacio clase="py-space-lg">Todavía nadie comentó. ¡Sé la primera persona en hacerlo!</MensajeVacio>
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
        {comentarios.map((comentario) => (
          <TarjetaTestimonio
            key={comentario.id}
            comentario={comentario}
            onBorrar={puedeBorrar(usuario, comentario) ? () => borrar(comentario) : null}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <TituloSeccion>Testimonios de Quienes Custodian el Mar</TituloSeccion>

      {errorAccion && <AvisoError mensaje={errorAccion} onCerrar={() => dispatch(limpiarError())} />}

      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm space-y-space-sm">
        <h3 className="font-title-lg text-title-lg text-primary">Dejá tu comentario</h3>
        {usuario ? (
          <FormularioComentario onEnviar={enviar} placeholder="Contanos tu experiencia con SeaPlace…" textoBoton="Publicar comentario" />
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">
            <Link to="/cuenta" className="text-secondary font-label-lg text-label-lg underline">
              Iniciá sesión
            </Link>{' '}
            para contarnos tu experiencia.
          </p>
        )}
      </div>

      {elegirComentarios()}
    </section>
  )
}

export default Testimonios
