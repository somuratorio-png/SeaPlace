import { useNavigate } from 'react-router-dom'
import { useFavoritos } from '../../hooks/useFavoritos'
import { useSesion } from '../../hooks/useSesion'
import BotonFavorito from './BotonFavorito'

const FavoritoAnimal = ({ animal, onError, clase }) => {
  const navigate = useNavigate()
  const { usuario } = useSesion()
  const { esFavorito, alternarFavorito } = useFavoritos()

  const handleCambiar = () => {
    if (!usuario) {
      navigate('/panel')
      return
    }
    onError(null)
    alternarFavorito(animal).catch((falla) => {
      onError(falla.message)
    })
  }

  return <BotonFavorito esFavorito={esFavorito(animal.id)} onCambiar={handleCambiar} clase={clase} />
}

export default FavoritoAnimal