package com.uade.tpo.SeaPlace.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.uade.tpo.SeaPlace.entity.Apadrinamiento;
import com.uade.tpo.SeaPlace.entity.Muelle;
import com.uade.tpo.SeaPlace.entity.Zarpar;
import com.uade.tpo.SeaPlace.entity.ZarparDetalle;
import com.uade.tpo.SeaPlace.entity.dto.MetricasResponse;
import com.uade.tpo.SeaPlace.repository.ApadrinamientoRepository;
import com.uade.tpo.SeaPlace.repository.CampaniaRepository;
import com.uade.tpo.SeaPlace.repository.MuelleRepository;
import com.uade.tpo.SeaPlace.repository.PatrocinadorRepository;
import com.uade.tpo.SeaPlace.repository.ZarparDetalleRepository;
import com.uade.tpo.SeaPlace.repository.ZarparRepository;

// Calcula las metricas comerciales del panel del administrador a partir de los apadrinamientos,
// los pagos (zarpar), los muelles y las campañas de los patrocinadores.
@Service
public class MetricasService {

    private static final String ZARPAR_CONFIRMADA = "CONFIRMADA";
    private static final String MUELLE_CONFIRMADO = "CONFIRMADO";
    private static final int MESES_DEL_GRAFICO = 6;
    private static final int DIAS_PARA_BAJAS = 30;

    @Autowired
    private ApadrinamientoRepository apadrinamientoRepository;

    @Autowired
    private ZarparRepository zarparRepository;

    @Autowired
    private ZarparDetalleRepository zarparDetalleRepository;

    @Autowired
    private MuelleRepository muelleRepository;

    @Autowired
    private PatrocinadorRepository patrocinadorRepository;

    @Autowired
    private CampaniaRepository campaniaRepository;

    @Autowired
    private AutorizacionService autorizacionService;

    public MetricasResponse getMetricas() {
        if (!autorizacionService.esAdmin()) {
            throw new AccessDeniedException("Las metricas comerciales son solo para administradores");
        }

        MetricasResponse r = new MetricasResponse();
        LocalDateTime ahora = LocalDateTime.now();

        // ---------- Ingreso recurrente ----------
        List<Apadrinamiento> apadrinamientos = apadrinamientoRepository.findAll();
        List<Apadrinamiento> activos = apadrinamientos.stream().filter(Apadrinamiento::isActivo).toList();
        double recurrente = activos.stream()
                .mapToDouble(a -> a.getAnimal().precioDelPlan(a.getPlan()) * a.getCupos())
                .sum();
        int padrinosActivos = (int) activos.stream().map(a -> a.getUsuario().getIdUsuario()).distinct().count();
        r.setIngresoMensualRecurrente(redondear(recurrente));
        r.setApadrinamientosActivos(activos.size());
        r.setPadrinosActivos(padrinosActivos);
        r.setIngresoPorPadrino(padrinosActivos == 0 ? 0 : redondear(recurrente / padrinosActivos));

        // ---------- Bajas de los ultimos 30 dias ----------
        // Tasa = bajas del periodo / (activos de hoy + bajas del periodo), o sea sobre los que habia al empezar
        LocalDateTime desde = ahora.minusDays(DIAS_PARA_BAJAS);
        int bajas = (int) apadrinamientos.stream()
                .filter(a -> !a.isActivo() && a.getFechaCancelacion() != null && a.getFechaCancelacion().isAfter(desde))
                .count();
        int base = activos.size() + bajas;
        r.setBajasUltimoMes(bajas);
        r.setTasaDeBajas(base == 0 ? 0 : redondear(bajas * 100.0 / base));

        // ---------- Pagos ----------
        List<Zarpar> pagos = zarparRepository.findAll().stream()
                .filter(z -> ZARPAR_CONFIRMADA.equals(z.getEstado()))
                .toList();
        double totalPadrinos = pagos.stream().mapToDouble(Zarpar::getTotal).sum();
        r.setPagos(pagos.size());
        r.setTicketPromedio(pagos.isEmpty() ? 0 : redondear(totalPadrinos / pagos.size()));
        r.setAportePadrinos(redondear(totalPadrinos));

        // ---------- Conversion del muelle ----------
        // Un muelle confirmado termino en un pago; uno activo con algo adentro quedo sin pagar
        List<Muelle> muelles = muelleRepository.findAll();
        int confirmados = (int) muelles.stream().filter(m -> MUELLE_CONFIRMADO.equals(m.getEstado())).count();
        int abandonados = (int) muelles.stream()
                .filter(m -> !MUELLE_CONFIRMADO.equals(m.getEstado()) && m.getDetalles() != null && !m.getDetalles().isEmpty())
                .count();
        r.setMuellesAbandonados(abandonados);
        r.setConversion(confirmados + abandonados == 0 ? 0 : redondear(confirmados * 100.0 / (confirmados + abandonados)));

        // ---------- Patrocinadores ----------
        List<ZarparDetalle> duplicados = zarparDetalleRepository.findAll().stream()
                .filter(d -> d.getAportePatrocinador() != null)
                .toList();
        r.setAportePatrocinadores(redondear(duplicados.stream().mapToDouble(ZarparDetalle::getAportePatrocinador).sum()));
        r.setPatrocinadores((int) patrocinadorRepository.count());
        LocalDate hoy = LocalDate.now();
        r.setCampaniasVigentes((int) campaniaRepository.findAll().stream().filter(c -> c.estaVigente(hoy)).count());

        // ---------- Ultimos meses ----------
        List<MetricasResponse.IngresoMes> meses = new ArrayList<>();
        YearMonth actual = YearMonth.from(ahora);
        for (int atras = MESES_DEL_GRAFICO - 1; atras >= 0; atras--) {
            YearMonth mes = actual.minusMonths(atras);
            MetricasResponse.IngresoMes dato = new MetricasResponse.IngresoMes();
            dato.setMes(mes.toString());
            List<Zarpar> delMes = pagos.stream().filter(z -> YearMonth.from(z.getFechaZarpar()).equals(mes)).toList();
            dato.setPagos(delMes.size());
            dato.setPadrinos(redondear(delMes.stream().mapToDouble(Zarpar::getTotal).sum()));
            dato.setPatrocinadores(redondear(duplicados.stream()
                    .filter(d -> YearMonth.from(d.getZarpar().getFechaZarpar()).equals(mes))
                    .map(ZarparDetalle::getAportePatrocinador)
                    .filter(Objects::nonNull)
                    .mapToDouble(Double::doubleValue)
                    .sum()));
            meses.add(dato);
        }
        r.setIngresosPorMes(meses);
        return r;
    }

    private static double redondear(double valor) {
        return Math.round(valor * 100.0) / 100.0;
    }
}
