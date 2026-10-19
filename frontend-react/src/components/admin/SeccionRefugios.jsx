import { quitarAnimal, traerPublicaciones } from '../../services/animales'
import { aprobarRefugio } from '../../services/usuarios'
import { useSesion } from '../../hooks/useSesion'
import { sacarDe } from '../../utils/listas'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'
import EstadoCarga from '../comunes/EstadoCarga'
import Buscador from '../comunes/Buscador'
import Paginacion from '../comunes/Paginacion'
import EncabezadoLista from './EncabezadoLista'
import { useConsulta } from '../../hooks/useConsulta'
import MensajeVacio from '../comunes/MensajeVacio'
import TarjetaRefugio from './TarjetaRefugio'
import AvisoRefugiosPendientes from './AvisoRefugiosPendientes'

const REFUGIOS_POR_PAGINA = 4
const textoDelRefugio = (r) => `${r.nombre} ${r.apellido} ${r.mail}`

// Sección "Refugios" del administrador: los busca, los muestra de a una página y permite
// aprobarlos, darlos de baja y ver sus animales.
// "usuarios" los tiene el panel. Las publicaciones (activas y pausadas) las pide esta sección al backend
// cuando se abre. Cada acción llama al backend y, con lo que contesta, actualiza el estado.
const SeccionRefugios = ({ usuarios, onCambiarActivo, onGuardarUsuario, onError }) => {
  const { token } = useSesion()
  const { datos: animales, setDatos: setAnimales, cargando, error: errorAlCargar } = useConsulta(traerPublicaciones, undefined, [])

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
    aprobarRefugio(token, elegido.idRefugio)
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
    quitarAnimal(token, idAnimal)
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
  const { busqueda, buscar, encontrados, items, paginaActual, totalPaginas, setPagina } = useBusquedaPaginada(refugios, textoDelRefugio, REFUGIOS_POR_PAGINA)

  if (cargando || errorAlCargar) {
    return <EstadoCarga cargando={cargando} error={errorAlCargar} texto="Cargando los refugios…" />
  }

  return (
    <section className="space-y-space-md">
      <EncabezadoLista titulo="Refugios" nombre="refugios" mostrando={items.length} total={encontrados.length} />

      {pendientes.length > 0 && <AvisoRefugiosPendientes cantidad={pendientes.length} />}

      <Buscador valor={busqueda} onCambiar={buscar} textoAyuda="Buscar refugio por nombre o correo..." />

      {encontrados.length === 0 && (
        <MensajeVacio clase="bg-surface-container rounded-2xl p-space-lg">Ningún refugio coincide con esa búsqueda.</MensajeVacio>
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
