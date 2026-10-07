import { useState } from 'react'
import { categorias, urgencias } from '../../data/animales'
import { leerFotos } from '../../utils/imagenes'
import CampoTexto from '../login/CampoTexto'

const formularioVacio = {
  nombre: '',
  especie: '',
  categoria: 'focas',
  urgencia: 'recuperacion',
  edad: '',
  ubicacion: '',
  precio: '',
  descripcion: '',
}

const claseCampo = 'w-full bg-surface-container-low rounded-lg px-space-md py-3 font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/40'

// Formulario para cargar un animal nuevo. onGuardar devuelve un mensaje de error, o null si salió bien.
const FormularioAnimal = ({ onGuardar }) => {
  const [datos, setDatos] = useState(formularioVacio)
  const [fotos, setFotos] = useState([]) // las fotos elegidas, ya convertidas a texto
  const [error, setError] = useState(null)

  const cambiar = (evento) => {
    setDatos({ ...datos, [evento.target.name]: evento.target.value })
  }

  // Leer las fotos tarda un instante, por eso se espera con "await"
  const elegirFotos = async (evento) => {
    setFotos(await leerFotos(evento.target.files))
  }

  const enviar = (evento) => {
    evento.preventDefault() // evita que el formulario recargue la página
    const mensaje = onGuardar(datos, fotos)
    setError(mensaje)
    if (mensaje === null) {
      setDatos(formularioVacio)
      setFotos([])
      evento.target.reset() // vacía el selector de archivos
    }
  }

  return (
    <form onSubmit={enviar} className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md">
      <h2 className="font-title-lg text-title-lg text-on-surface">Cargar un animal</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        <CampoTexto etiqueta="Nombre" nombre="nombre" valor={datos.nombre} onCambiar={cambiar} />
        <CampoTexto etiqueta="Especie" nombre="especie" valor={datos.especie} onCambiar={cambiar} />

        <label className="flex flex-col gap-1.5">
          <span className="font-label-lg text-label-lg text-on-surface">Categoría</span>
          <select name="categoria" value={datos.categoria} onChange={cambiar} className={claseCampo}>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="font-label-lg text-label-lg text-on-surface">Condición</span>
          <select name="urgencia" value={datos.urgencia} onChange={cambiar} className={claseCampo}>
            {urgencias.map((urgencia) => (
              <option key={urgencia.id} value={urgencia.id}>
                {urgencia.estado}
              </option>
            ))}
          </select>
        </label>

        <CampoTexto etiqueta="Edad" nombre="edad" valor={datos.edad} onCambiar={cambiar} />
        <CampoTexto etiqueta="Ubicación" nombre="ubicacion" valor={datos.ubicacion} onCambiar={cambiar} />
        <CampoTexto etiqueta="Cuota mensual (en US$)" nombre="precio" tipo="number" valor={datos.precio} onCambiar={cambiar} />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-on-surface">Su historia</span>
        <textarea name="descripcion" value={datos.descripcion} onChange={cambiar} required rows="3" className={claseCampo} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="font-label-lg text-label-lg text-on-surface">Fotos (opcional, podés elegir varias)</span>
        <input type="file" accept="image/*" multiple onChange={elegirFotos} className={claseCampo} />
      </label>
      {fotos.length > 0 && (
        <div className="flex flex-wrap gap-space-sm">
          {fotos.map((foto, indice) => (
            <img key={foto} src={foto} alt={`Foto elegida ${indice + 1}`} className="w-20 h-20 object-cover rounded-xl" />
          ))}
        </div>
      )}

      {error && <p className="bg-error-container text-on-error-container rounded-lg px-space-md py-space-sm font-body-sm text-body-sm">{error}</p>}

      <button type="submit" className="bg-primary text-on-primary font-label-lg text-label-lg px-space-lg py-space-sm rounded-lg hover:bg-surface-tint">
        Cargar animal
      </button>
    </form>
  )
}

export default FormularioAnimal
