import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { agregarFavorito, quitarFavorito } from '../../Redux/favoritosSlice'
import { intentar } from '../../utils/intentar'
import BotonFavorito from './BotonFavorito'

// El corazón de un animal. Si no hay nadie logueado, lleva al login.
// Si el pedido falla, onError muestra el mensaje en la página.
const FavoritoAnimal = ({ animal, onError, clase }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { usuario } = useSelector((state) => state.usuario)
  const { items: favoritos } = useSelector((state) => state.favoritos)

  const esFavorito = favoritos.some((guardado) => guardado.id === animal.id)

  const handleCambiar = () => {
    if (!usuario) {
      navigate('/panel')
      return
    }
    onError(null)
    intentar(dispatch(esFavorito ? quitarFavorito(animal.id) : agregarFavorito(animal.id)), onError)
  }

  return <BotonFavorito esFavorito={esFavorito} onCambiar={handleCambiar} clase={clase} />
}

export default FavoritoAnimal
