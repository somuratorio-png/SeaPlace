import FilaAnimal from '../components/refugio/FilaAnimal'
import FormularioAnimal from '../components/refugio/FormularioAnimal'
import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'

// Panel del refugio: muestra solo sus animales y permite cargar uno nuevo o quitarlo del catálogo
const Refugio = ({ usuario, animales, onAgregar, onQuitar, onVerAnimal }) => {
  const propios = animales.filter((animal) => animal.refugio === usuario.nombreUsuario)

  // Arma el animal completo a partir del formulario. Devuelve un mensaje de error, o null si salió bien.
  const guardar = (datos) => {
    const id = datos.nombre.trim().toLowerCase().replaceAll(' ', '-')
    if (animales.some((animal) => animal.id === id)) {
      return `Ya hay un animal llamado ${datos.nombre}`
    }
    if (Number(datos.precio) <= 0) {
      return 'La cuota mensual tiene que ser mayor a 0'
    }

    onAgregar({
      ...datos,
      id,
      refugio: usuario.nombreUsuario,
      estado: urgencias.find((urgencia) => urgencia.id === datos.urgencia).estado,
      precio: Number(datos.precio),
      progreso: 0,
      destacado: false,
      // Mock: todavía no se pueden subir fotos, así que se usa una genérica
      imagen: heroFoca,
      fotos: [heroFoca],
    })
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-xl space-y-space-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary">
          {usuario.nombre} {usuario.apellido}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Tenés {propios.length} {propios.length === 1 ? 'animal publicado' : 'animales publicados'}.
        </p>
      </div>

      {propios.length === 0 ? (
        <p className="bg-surface-container-lowest rounded-xl p-space-xl text-center font-body-md text-body-md text-on-surface-variant">
          Todavía no cargaste ningún animal.
        </p>
      ) : (
        <div className="space-y-space-sm">
          {propios.map((animal) => (
            <FilaAnimal key={animal.id} animal={animal} onVer={onVerAnimal} onQuitar={onQuitar} />
          ))}
        </div>
      )}

      <FormularioAnimal onGuardar={guardar} />
    </div>
  )
}

export default Refugio
