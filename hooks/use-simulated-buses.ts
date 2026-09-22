import React from 'react';

import { generateSimulatedBuses, tickSimulatedBuses } from '@/data/buses';
import { Route, SimulatedBus } from '@/data/types';

/**
 * Hook que mantiene un arreglo de busetas simuladas "vivas" para una ruta,
 * avanzando su posición cada cierto intervalo. Aislado en un hook para que
 * el día de mañana se pueda reemplazar por una suscripción a datos reales
 * (GPS/API) sin tocar las pantallas que lo consumen.
 */
export function useSimulatedBuses(route: Route | undefined, count = 2, intervalMs = 2500) {
  const [buses, setBuses] = React.useState<SimulatedBus[]>(() =>
    route ? generateSimulatedBuses(route, count) : []
  );

  React.useEffect(() => {
    if (!route) {
      setBuses([]);
      return;
    }
    setBuses(generateSimulatedBuses(route, count));

    const interval = setInterval(() => {
      setBuses((prev) => tickSimulatedBuses(route, prev));
    }, intervalMs);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route?.id, count, intervalMs]);

  return buses;
}
