import { useState } from 'react'
import Buscador from '../components/comunes/Buscador'
import Portada from '../components/comunes/Portada'
import FilaAnimal from '../components/refugio/FilaAnimal'
import FormularioAnimal from '../components/refugio/FormularioAnimal'
import { urgencias } from '../data/animales'
import { heroFoca } from '../data/imagenes'

// Panel del refugio: muestra solo sus animales y permite cargar uno nuevo o quitarlo del catálogo
const Refugio = ({ usuario, animales, onAgregar, onQuitar, onVerAnimal }) => {
  const [busqueda, setBusqueda] = useState('')

  const propios = animales.filter((animal) => animal.refugio === usuario.nombreUsuario)
  const texto = busqueda.toLowerCase()
  const visibles = propios.filter((animal) => `${animal.nombre} ${animal.especie} ${animal.estado}`.toLowerCase().includes(texto))

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
      // El precio se guarda siempre en dólares; la pantalla lo convierte a pesos si hace falta
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
    <>
      <Portada
        icono="home_health"
        etiqueta="Mi refugio"
        titulo={`${usuario.nombre} ${usuario.apellido}`}
        texto={`Tenés ${propios.length} ${propios.length === 1 ? 'animal publicado' : 'animales publicados'} en el catálogo.`}
      />

      <div className="max-w-7xl mx-auto px-margin-mobile lg:px-margin py-space-lg space-y-space-lg">
        <section className="space-y-space-md">
          <div className="flex flex-wrap items-end justify-between gap-space-sm">
            <h2 className="font-headline-md text-headline-md text-primary">Mis animales</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Mostrando {visibles.length} de {propios.length}
            </p>
          </div>
          <Buscador valor={busqueda} onCambiar={setBusqueda} textoAyuda="Buscar por nombre, especie o estado..." />

          {propios.length === 0 && (
            <p className="bg-surface-container-lowest rounded-2xl shadow-sm p-space-xl text-center font-body-md text-body-md text-on-surface-variant">
              Todavía no cargaste ningún animal.
            </p>
          )}
          {propios.length > 0 && visibles.length === 0 && (
            <p className="text-center font-body-md text-body-md text-on-surface-variant py-space-lg">
              Ningún animal coincide con esa búsqueda.
            </p>
          )}
          {visibles.map((animal) => (
            <FilaAnimal key={animal.id} animal={animal} onVer={onVerAnimal} onQuitar={onQuitar} />
          ))}
        </section>

        <FormularioAnimal onGuardar={guardar} />
      </div>
    </>
  )
}

export default Refugio
