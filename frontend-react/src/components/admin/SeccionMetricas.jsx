import { useSelector } from 'react-redux'
import EstadoCarga from '../comunes/EstadoCarga'
import Precio from '../comunes/Precio'
import GraficoIngresos, { COLOR_PADRINOS, COLOR_PATROCINADORES } from './GraficoIngresos'
import TarjetaMetrica from './TarjetaMetrica'

// Desde qué porcentaje de bajas en 30 días se marca como algo a vigilar
const BAJAS_A_VIGILAR = 10

// Sección "Métricas comerciales" del administrador: de qué vive SeaPlace y cómo viene.
// Las métricas las pidió SeccionesAdmin al montarse: acá se leen del estado global.
const SeccionMetricas = () => {
  const { datos, loading, error } = useSelector((state) => state.metricas)

  if (loading || error || datos === null) {
    return <EstadoCarga cargando={loading || datos === null} error={error} texto="Calculando las métricas…" />
  }

  const totalFuentes = datos.aportePadrinos + datos.aportePatrocinadores
  const partePadrinos = totalFuentes > 0 ? Math.round((datos.aportePadrinos * 100) / totalFuentes) : 0

  return (
    <div className="space-y-space-lg">
      <div className="escalonar grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <TarjetaMetrica
          icono="autorenew"
          valor={<Precio valor={datos.recurrente} />}
          titulo="Ingreso mensual recurrente"
          detalle={`${datos.apadrinamientosActivos} apadrinamientos activos`}
        />
        <TarjetaMetrica
          icono="group"
          valor={datos.padrinosActivos}
          titulo="Padrinos activos"
          detalle={<>Cada uno aporta <Precio valor={datos.porPadrino} /> por mes</>}
        />
        <TarjetaMetrica
          icono="receipt_long"
          valor={<Precio valor={datos.ticketPromedio} />}
          titulo="Ticket promedio"
          detalle={`Sobre ${datos.pagos} ${datos.pagos === 1 ? 'pago' : 'pagos'} confirmados`}
        />
        <TarjetaMetrica
          icono="shopping_cart_checkout"
          valor={`${datos.conversion}%`}
          titulo="Conversión del muelle"
          detalle={`${datos.muellesAbandonados} ${datos.muellesAbandonados === 1 ? 'muelle quedó' : 'muelles quedaron'} sin pagar`}
        />
      </div>

      <GraficoIngresos meses={datos.meses} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl shadow-sm p-space-lg space-y-space-md">
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface">De dónde viene la plata</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Todo lo cobrado desde el inicio. {datos.patrocinadores} patrocinadores, {datos.campaniasVigentes} {datos.campaniasVigentes === 1 ? 'campaña vigente' : 'campañas vigentes'}.
            </p>
          </div>
          {/* Una sola barra partida en dos, con 2px de separación entre las partes */}
          <div className="flex h-4 gap-0.5" role="img" aria-label={`Padrinos ${partePadrinos}%, patrocinadores ${100 - partePadrinos}%`}>
            {partePadrinos > 0 && <span className="h-full rounded-l" style={{ width: `${partePadrinos}%`, backgroundColor: COLOR_PADRINOS }} />}
            {partePadrinos < 100 && <span className="h-full rounded-r" style={{ width: `${100 - partePadrinos}%`, backgroundColor: COLOR_PATROCINADORES }} />}
          </div>
          <div className="flex flex-wrap justify-between gap-space-md font-body-md text-body-md text-on-surface">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLOR_PADRINOS }} />
              Padrinos: <b><Precio valor={datos.aportePadrinos} /></b> ({partePadrinos}%)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLOR_PATROCINADORES }} />
              Patrocinadores: <b><Precio valor={datos.aportePatrocinadores} /></b> ({100 - partePadrinos}%)
            </span>
          </div>
        </div>

        <TarjetaMetrica
          icono="trending_down"
          valor={`${datos.tasaDeBajas}%`}
          titulo="Bajas en los últimos 30 días"
          detalle={`${datos.bajas} ${datos.bajas === 1 ? 'apadrinamiento cancelado' : 'apadrinamientos cancelados'}`}
          alerta={datos.tasaDeBajas >= BAJAS_A_VIGILAR}
        />
      </div>
    </div>
  )
}

export default SeccionMetricas
