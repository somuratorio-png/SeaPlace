import { useNavigate } from 'react-router-dom'
import BotonFavorito from './BotonFavorito'
import * as apadrinarApi from '../../services/apadrinar'

// El corazón de un animal: lo guarda o lo saca de los favoritos de la cuenta.
// Si no hay nadie logueado, lleva al login. El cambio se ve con lo que contesta el backend,
// sin volver a pedir la lista.
const FavoritoAnimal = ({ animal, usuario, favoritos, onCambiarFavoritos, onError, clase }) => {
  const navigate = useNavigate()

  const esFavorito = favoritos.some((guardado) => guardado.id === animal.id)

  const handleCambiar = () => {
    if (!usuario) {
      navigate('/panel')
      return
    }
    onError(null)
    const pedido = esFavorito
      ? apadrinarApi.quitarFavorito(animal.id).then(() => favoritos.filter((guardado) => guardado.id !== animal.id))
      : apadrinarApi.agregarFavorito(animal.id).then((guardado) => [...favoritos, guardado])
    pedido.then(onCambiarFavoritos).catch((falla) => {
      onError(falla.message)
    })
  }

  return <BotonFavorito esFavorito={esFavorito} onCambiar={handleCambiar} clase={clase} />
}

export default FavoritoAnimal