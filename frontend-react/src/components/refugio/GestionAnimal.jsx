import { useState } from 'react'
import Icono from '../comunes/Icono'
import FormularioDatosAnimal from './FormularioDatosAnimal'
import FormularioNovedad from './FormularioNovedad'
import FormularioOferta from './FormularioOferta'
import FormularioUbicacion from './FormularioUbicacion'
import SumarFotos from './SumarFotos'

// Lo que se despliega al gestionar un animal: corregir sus datos (se abre aparte, porque es largo),
// ponerlo en oferta, publicar novedades, informar su ubicación y sumarle fotos.
const GestionAnimal = ({ animal, categorias, onEditar, onGuardarDatos, onPublicarNovedad, onRegistrarUbicacion }) => {
  const [editando, setEditando] = useState(false)

  return (
    <div className="px-space-md pb-space-md grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
      <div className="lg:col-span-2 space-y-space-md">
        <button onClick={() => setEditando(!editando)} className="inline-flex items-center gap-1 font-label-lg text-label-lg text-secondary hover:underline">
          <Icono nombre={editando ? 'expand_less' : 'edit'} clase="text-[18px]" />
          {editando ? 'Cerrar la edición' : 'Editar datos y precios'}
        </button>
        {editando && <FormularioDatosAnimal animal={animal} categorias={categorias} onGuardar={onGuardarDatos} />}
      </div>

      <FormularioOferta animal={animal} onEditar={onEditar} />
      <FormularioNovedad animal={animal} onPublicar={onPublicarNovedad} />
      <FormularioUbicacion animal={animal} onRegistrar={onRegistrarUbicacion} />
      <SumarFotos animal={animal} onEditar={onEditar} />
    </div>
  )
}

export default GestionAnimal
