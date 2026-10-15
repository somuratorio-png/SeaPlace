import { useEffect, useState } from 'react'
import { quitarAnimal, traerPublicaciones } from '../../services/animales'
import { aprobarRefugio } from '../../services/usuarios'
import { sacarDe } from '../../utils/listas'
import { paginar } from '../../utils/paginar'
import AvisoError from '../comunes/AvisoError'
import Buscador from '../comunes/Buscador'
import Cargando from '../comunes/Cargando'
import Paginacion from '../comunes/Paginacion'
import TituloSeccion from '../comunes/TituloSeccion'
import TarjetaRefugio from './TarjetaRefugio'

const REFUGIOS_POR_PAGINA = 4

// Sección "Refugios" del administrador: los busca, los muestra de a una página y permite
// aprobarlos, darlos de baja y ver sus animales.
// "usuarios" los tiene el panel. Las publicaciones (activas y pausadas) las pide esta sección al backend
// cuando se abre. Cada acción llama al backend y, con lo que contesta, actualiza el estado.
const SeccionRefugios = ({ usuarios, onCambiarActivo, onGuardarUsuario, onError }) => {
  const [animales, setAnimales] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorAlCargar, setErrorAlCargar] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [pagina, setPagina] = useState(0)

  // Las publicaciones de todos los refugios
  useEffect(() => {
    traerPublicaciones()
      .then((lista) => {
        setAnimales(lista)
      })
      .catch((falla) => {
        setErrorAlCargar(falla.message)
      })
      .then(() => {
        setCargando(false)
      })
  }, [])

  // Al dar de baja a un refugio, el backend pausa sus publicaciones: acá se reflejan pausadas
  const cambiarActivo = (nombreUsuario) => {
    onCambiarActivo(nombreUsuario).then((cambiado) => {
      if (cambiado && !cambiado.activo && cambiado.idRefugio) {
        setAnimales((actuales) => actuales.map((animal) => (animal.idRefugio === cambiado.idRefugio ? { ...animal, publicacion: 'PAUSADA' } : animal)))
      }
    })
  }

  const aprobar = (nombreUsuario) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    onError(null)
    aprobarRefugio(elegido.idRefugio)
      .then(() => {
        onGuardarUsuario({ ...elegido, aprobado: true })
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  // No lo borra de la base: la publicación queda eliminada y deja de verse
  const quitar = (idAnimal) => {
    onError(null)
    quitarAnimal(idAnimal)
      .then(() => {
        setAnimales((actuales) => sacarDe(actuales, idAnimal))
      })
      .catch((falla) => {
        onError(falla.message)
      })
  }

  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)
  // Los que esperan aprobación van primero en la lista
  const refugios = [...pendientes, ...usuarios.filter((u) => u.rol === 'refugio' && u.aprobado)]

  const texto = busqueda.toLowerCase()
  const encontrados = refugios.filter((r) => `${r.nombre} ${r.apellido} ${r.mail}`.toLowerCase().includes(texto))
  const { items, paginaActual, totalPaginas } = paginar(encontrados, pagina, REFUGIOS_POR_PAGINA)

  // Al buscar se vuelve a la primera página
  const buscar = (valor) => {
    setBusqueda(valor)
    setPagina(0)
  }

  if (cargando) {
    return <Cargando texto="Cargando los refugios…" />
  }
  if (errorAlCargar) {
    return <AvisoError mensaje={errorAlCargar} />
  }

  return (
    <section className="space-y-space-md">
      <div className="flex flex-wrap items-end justify-between gap-space-sm">
        <TituloSeccion>Refugios</TituloSeccion>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Mostrando {items.length} de {encontrados.length} refugios
        </p>
      </div>

      {pendientes.length > 0 && (
        <p className="bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-2xl px-space-lg py-space-md font-body-md text-body-md">
          Hay {pendientes.length} {pendientes.length === 1 ? 'refugio que espera' : 'refugios que esperan'} tu aprobación. Aparecen primero en la lista.
        </p>
      )}

      <Buscador valor={busqueda} onCambiar={buscar} textoAyuda="Buscar refugio por nombre o correo..." />

      {encontrados.length === 0 && (
        <p className="bg-surface-container rounded-2xl p-space-lg text-center font-body-md text-body-md text-on-surface-variant">
          Ningún refugio coincide con esa búsqueda.
        </p>
      )}
      {items.map((refugio) => (
        <TarjetaRefugio
          key={refugio.id}
          refugio={refugio}
          animales={animales.filter((animal) => animal.idRefugio === refugio.idRefugio)}
          onCambiarActivo={cambiarActivo}
          onAprobar={aprobar}
          onQuitarAnimal={quitar}
        />
      ))}

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionRefugios
