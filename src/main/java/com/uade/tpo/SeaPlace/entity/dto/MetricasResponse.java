package com.uade.tpo.SeaPlace.entity.dto;

import java.util.List;

import lombok.Data;

// Las metricas comerciales del panel del administrador. Los montos van en dolares, como las cuotas.
@Data
public class MetricasResponse {
    // Lo que entra por mes con los apadrinamientos activos (cuota del plan x cupos)
    private double ingresoMensualRecurrente;
    private int apadrinamientosActivos;
    private int padrinosActivos;
    // Lo que entra por mes, en promedio, por cada padrino activo
    private double ingresoPorPadrino;

    // Pagos confirmados: cuantos, cuanto sumaron y cuanto deja cada uno en promedio
    private int pagos;
    private double ticketPromedio;

    // Bajas de los ultimos 30 dias, y que porcentaje representan sobre los que habia al empezar ese periodo
    private int bajasUltimoMes;
    private double tasaDeBajas;

    // De los muelles con algo adentro, que porcentaje termino en un pago; los que quedaron sin pagar
    private double conversion;
    private int muellesAbandonados;

    // De donde vino la plata: lo que pagaron los padrinos y lo que sumaron los patrocinadores
    private double aportePadrinos;
    private double aportePatrocinadores;
    private int patrocinadores;
    private int campaniasVigentes;

    // Los ultimos 6 meses, del mas viejo al mas nuevo
    private List<IngresoMes> ingresosPorMes;

    @Data
    public static class IngresoMes {
        // "AAAA-MM"
        private String mes;
        private double padrinos;
        private double patrocinadores;
        private int pagos;
    }
}
