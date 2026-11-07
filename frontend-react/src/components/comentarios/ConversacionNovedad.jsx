import { useDispatch, useSelector } from 'react-redux'
import ComentarioNovedad from './ComentarioNovedad'
import FormularioComentario from './FormularioComentario'
import { borrarComentarioNovedad, comentarNovedad } from '../../Redux/apadrinamientosSlice'
import { puedeBorrar } from '../../services/comentarios'
import { intentar } from '../../utils/intentar'

// Los comentarios de una novedad de la bitácora y el formulario para sumar uno.
// Ahí conversan los padrinos del animal y su refugio. Los comentarios ya llegaron con el apadrinamiento:
// acá no se pide nada al backend, solo se manda lo nuevo y se actualiza el estado con lo que contesta.
// Si algo falla, el mensaje lo muestra arriba DetalleApadrinado (errorAccion de apadrinamientos).
const ConversacionNovedad = ({ idAnimal, novedad }) => {
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.usuario)

  const comentar = (texto) => intentar(dispatch(comentarNovedad({ idAnimal, idNovedad: novedad.id, texto })))

  const borrar = (comentario) => {
    dispatch(borrarComentarioNovedad({ idNovedad: novedad.id, idComentario: comentario.id }))
  }

  return (
    <div className="space-y-space-sm pt-space-sm">
      {novedad.comentarios.map((comentario) => (
        <ComentarioNovedad
          key={comentario.id}
          comentario={comentario}
          onBorrar={puedeBorrar(usuario, comentario) ? () => borrar(comentario) : null}
        />
      ))}
      <FormularioComentario compacto onEnviar={comentar} placeholder="Escribile al refugio o a los otros padrinos…" />
    </div>
  )
}

export default ConversacionNovedad
