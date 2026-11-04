import { useDispatch, useSelector } from 'react-redux'
import { quitarAnimal } from '../../Redux/animalesSlice'
import { aprobarRefugio } from '../../Redux/usuariosSlice'
import { intentar } from '../../utils/intentar'
import { useBusquedaPaginada } from '../../hooks/useBusquedaPaginada'
import EstadoCarga from '../comunes/EstadoCarga'
import Buscador from '../comunes/Buscador'
import Paginacion from '../comunes/Paginacion'
import EncabezadoLista from './EncabezadoLista'
import MensajeVacio from '../comunes/MensajeVacio'
import TarjetaRefugio from './TarjetaRefugio'
import AvisoRefugiosPendientes from './AvisoRefugiosPendientes'

const REFUGIOS_POR_PAGINA = 4
const textoDelRefugio = (r) => `${r.nombre} ${r.apellido} ${r.mail}`

// Sección "Refugios" del administrador: los busca, los muestra de a una página y permite
// aprobarlos, darlos de baja y ver sus animales.
// Los usuarios y las publicaciones (activas, pausadas y pendientes) se leen del estado global.
// Cada acción llama al backend y, con lo que contesta, se actualiza el estado global. Al dar de baja
// a un refugio, el backend pausa sus publicaciones: animalesSlice también lo refleja.
const SeccionRefugios = ({ onCambiarActivo, onError }) => {
  const dispatch = useDispatch()
  const { items: usuarios } = useSelector((state) => state.usuarios)
  const { publicaciones: animales, loading: cargando, error } = useSelector((state) => state.animales)

  const aprobar = (nombreUsuario) => {
    const elegido = usuarios.find((u) => u.nombreUsuario === nombreUsuario)
    onError(null)
    intentar(dispatch(aprobarRefugio(elegido.idRefugio)), onError)
  }

  // No lo borra de la base: la publicación queda eliminada y deja de verse
  const quitar = (idAnimal) => {
    onError(null)
    intentar(dispatch(quitarAnimal(idAnimal)), onError)
  }

  const pendientes = usuarios.filter((u) => u.rol === 'refugio' && !u.aprobado)
  // Los que esperan aprobación van primero en la lista
  const refugios = [...pendientes, ...usuarios.filter((u) => u.rol === 'refugio' && u.aprobado)]
  const { busqueda, buscar, encontrados, items, paginaActual, totalPaginas, setPagina } = useBusquedaPaginada(refugios, textoDelRefugio, REFUGIOS_POR_PAGINA)

  if (cargando || error) {
    return <EstadoCarga cargando={cargando} error={error} texto="Cargando los refugios…" />
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
          onCambiarActivo={onCambiarActivo}
          onAprobar={aprobar}
          onQuitarAnimal={quitar}
        />
      ))}

      <Paginacion pagina={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </section>
  )
}

export default SeccionRefugios
