import { ReportItem, ReportType } from './types';

/**
 * Reportes de novedades enviados por el usuario. En esta primera versión se
 * guardan en memoria (simulated: true); están preparados para conectarse a
 * un backend real en el futuro (mismo shape de datos).
 */
export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  retraso: 'Retraso',
  desvio: 'Desvío',
  cambio_ruta: 'Cambio de ruta',
  problema_servicio: 'Problema del servicio',
  buseta_llena: 'Buseta llena',
  otra: 'Otra novedad',
};

export const initialReports: ReportItem[] = [
  {
    id: 'rpt-1',
    routeId: '603i',
    type: 'buseta_llena',
    description: 'La buseta llegó con ocupación alta cerca de Iglesia de Chipre.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    simulated: true,
  },
  {
    id: 'rpt-2',
    routeId: '614r',
    type: 'retraso',
    description: 'Retraso simulado por obras cerca de Maltería.',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    simulated: true,
  },
];

export function createReport(
  type: ReportType,
  description: string,
  routeId?: string
): ReportItem {
  return {
    id: `rpt-${Date.now()}`,
    routeId,
    type,
    description,
    createdAt: new Date().toISOString(),
    simulated: true,
  };
}
