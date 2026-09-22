import { getPlaceById } from './places';
import { getStopById } from './stops';
import { Coordinates, OccupancyLevel, Route, SimulatedBus } from './types';

/**
 * Simulación de posición y estado de las busetas.
 *
 * IMPORTANTE (arquitectura preparada para el futuro):
 * Esta capa expone una interfaz simple (`BusLocationProvider`) que hoy se
 * resuelve con `simulatedLocationProvider` (interpolación entre paraderos
 * conocidos). El día que exista una fuente real de GPS/API, basta con crear
 * un nuevo proveedor que cumpla la misma interfaz y reemplazar
 * `activeLocationProvider` — nada en las pantallas necesita cambiar.
 */
export interface BusLocationProvider {
  /** Devuelve la posición interpolada de una ruta según su progreso 0..1 */
  getPositionAlongRoute(route: Route, progress: number): Coordinates;
}

function routeWaypoints(route: Route): Coordinates[] {
  const fromPlaces = route.placeIds
    .map((id) => getPlaceById(id)?.coordinates)
    .filter((c): c is Coordinates => !!c);
  const fromStops = route.stopIds
    .map((id) => getStopById(id)?.coordinates)
    .filter((c): c is Coordinates => !!c);
  const points = [...fromStops, ...fromPlaces];
  return points.length > 0 ? points : [{ latitude: 5.0689, longitude: -75.5174 }];
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export const simulatedLocationProvider: BusLocationProvider = {
  getPositionAlongRoute(route, progress) {
    const points = routeWaypoints(route);
    if (points.length === 1) return points[0];
    const clamped = Math.max(0, Math.min(1, progress));
    const segmentCount = points.length - 1;
    const scaled = clamped * segmentCount;
    const index = Math.min(Math.floor(scaled), segmentCount - 1);
    const localT = scaled - index;
    const a = points[index];
    const b = points[index + 1];
    return {
      latitude: lerp(a.latitude, b.latitude, localT),
      longitude: lerp(a.longitude, b.longitude, localT),
    };
  },
};

/** Proveedor activo. Cambiar esta referencia conecta una fuente real en el futuro. */
export const activeLocationProvider: BusLocationProvider = simulatedLocationProvider;

const OCCUPANCY_LEVELS: OccupancyLevel[] = ['baja', 'media', 'alta'];
const PLATE_LETTERS = ['ABC', 'MZL', 'SBS', 'CAL', 'NLT'];

function randomPlate(seed: number): string {
  const letters = PLATE_LETTERS[seed % PLATE_LETTERS.length];
  const numbers = String((seed * 137) % 900 + 100);
  return `${letters}-${numbers}`;
}

/**
 * Genera N busetas simuladas distribuidas a lo largo de una ruta.
 * simulated: true siempre — nunca se debe interpretar como GPS real.
 */
export function generateSimulatedBuses(route: Route, count = 2): SimulatedBus[] {
  const buses: SimulatedBus[] = [];
  for (let i = 0; i < count; i++) {
    const progress = count === 1 ? 0.3 : i / count;
    const seed = route.id.charCodeAt(0) + route.id.charCodeAt(route.id.length - 1) + i;
    buses.push({
      id: `${route.id}-bus-${i + 1}`,
      routeId: route.id,
      companyId: route.companyId,
      progress,
      simulatedLocation: activeLocationProvider.getPositionAlongRoute(route, progress),
      occupancy: OCCUPANCY_LEVELS[seed % OCCUPANCY_LEVELS.length],
      estimatedArrivalMinutes: 2 + (seed % 15),
      direction: i % 2 === 0 ? 1 : -1,
      plate: randomPlate(seed + Date.now() % 1000),
      simulated: true,
    });
  }
  return buses;
}

/**
 * Avanza la simulación de un conjunto de busetas un "tick". Pensado para
 * usarse dentro de un `setInterval` en la pantalla de mapa / detalle de ruta.
 */
export function tickSimulatedBuses(route: Route, buses: SimulatedBus[]): SimulatedBus[] {
  return buses.map((bus) => {
    let next = bus.progress + bus.direction * 0.02;
    let direction = bus.direction;
    if (next >= 1) {
      next = 1;
      direction = -1;
    } else if (next <= 0) {
      next = 0;
      direction = 1;
    }
    const arrival = Math.max(1, Math.round((1 - next) * 18) + (direction === -1 ? 1 : 0));
    return {
      ...bus,
      progress: next,
      direction,
      simulatedLocation: activeLocationProvider.getPositionAlongRoute(route, next),
      estimatedArrivalMinutes: arrival,
    };
  });
}
