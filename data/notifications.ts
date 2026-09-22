import { AppNotification, NotificationKind } from './types';

/**
 * Notificaciones/avisos simulados de demostración. En una versión futura,
 * este arreglo sería reemplazado por eventos reales (push notifications /
 * websocket) sin cambiar la forma de consumirlo desde las pantallas.
 */
export const initialNotifications: AppNotification[] = [
  {
    id: 'ntf-1',
    kind: 'retraso',
    title: 'Retraso simulado en la ruta 601i',
    message: 'La buseta ABC-104 presenta un retraso aproximado de 6 minutos por tráfico en Morro Gacho.',
    routeId: '601i',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    simulated: true,
  },
  {
    id: 'ntf-2',
    kind: 'llegada',
    title: 'Buseta próxima a llegar — Ruta 620r',
    message: 'Una buseta de la ruta 620r llegará en aproximadamente 3 minutos a Parque del Agua.',
    routeId: '620r',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    simulated: true,
  },
  {
    id: 'ntf-3',
    kind: 'cambio',
    title: 'Cambio simulado de horario — Ruta 617i',
    message: 'Se simula un ajuste temporal en la frecuencia de la ruta 617i por mantenimiento vial en Liborio.',
    routeId: '617i',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    simulated: true,
  },
  {
    id: 'ntf-4',
    kind: 'novedad',
    title: 'Novedad simulada — Terminal Los Cámbulos',
    message: 'Usuarios reportaron alta afluencia simulada cerca de la Terminal de Transportes Los Cámbulos.',
    routeId: '608i',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    simulated: true,
  },
];

export function createNotification(
  kind: NotificationKind,
  title: string,
  message: string,
  routeId?: string
): AppNotification {
  return {
    id: `ntf-${Date.now()}`,
    kind,
    title,
    message,
    routeId,
    createdAt: new Date().toISOString(),
    simulated: true,
  };
}
