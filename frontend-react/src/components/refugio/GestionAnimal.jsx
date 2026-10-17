import FormularioNovedad from './FormularioNovedad'
import FormularioOferta from './FormularioOferta'
import FormularioUbicacion from './FormularioUbicacion'
import SumarFotos from './SumarFotos'

// Lo que se despliega al gestionar un animal: ponerlo en oferta, publicar novedades,
// informar su ubicación y sumarle fotos.
const GestionAnimal = ({ animal, onEditar, onPublicarNovedad, onRegistrarUbicacion }) => {
  return (
    <div className="px-space-md pb-space-md grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
      <FormularioOferta animal={animal} onEditar={onEditar} />
      <FormularioNovedad animal={animal} onPublicar={onPublicarNovedad} />
      <FormularioUbicacion animal={animal} onRegistrar={onRegistrarUbicacion} />
      <SumarFotos animal={animal} onEditar={onEditar} />
    </div>
  )
}

export default GestionAnimal