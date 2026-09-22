import { routes } from './routes';
import { Schedule } from './types';

/**
 * Horarios de demostración por ruta. El transporte colectivo de Manizales
 * opera en general entre ~05:00 y ~22:00 con alta frecuencia; estas franjas
 * son una aproximación razonable para todas las rutas urbanas de Socobuses,
 * pero los horarios EXACTOS por ruta no están verificados con una fuente
 * oficial en esta versión, por eso quedan marcados como simulated: true.
 */
function buildSchedule(routeId: string): Schedule {
  return {
    id: `sch-${routeId}`,
    routeId,
    verified: false,
    simulated: true,
    entries: [
      { day: 'lunes a viernes', firstDeparture: '05:00', lastDeparture: '22:00', frequencyMinutes: 12 },
      { day: 'sábado', firstDeparture: '05:30', lastDeparture: '21:30', frequencyMinutes: 15 },
      { day: 'domingo y festivos', firstDeparture: '06:00', lastDeparture: '20:30', frequencyMinutes: 20 },
    ],
  };
}

export const schedules: Schedule[] = routes.map((r) => buildSchedule(r.id));

export function getScheduleForRoute(routeId: string): Schedule | undefined {
  return schedules.find((s) => s.routeId === routeId);
}
