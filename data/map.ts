import { MANIZALES_CENTER } from './manizales';
import { places } from './places';
import { routes } from './routes';
import { stops } from './stops';
import { Coordinates, Place, Route, Stop } from './types';

/**
 * NO LLEGUES TARDE — Capa geográfica unificada para el mapa
 * ------------------------------------------------------------------
 * Este módulo NO declara lugares, paraderos ni rutas nuevas: deriva TODO
 * de `places.ts`, `stops.ts` y `routes.ts`. Así el mapa, las listas, la
 * búsqueda y las pantallas de detalle consumen exactamente los mismos
 * datos (sin duplicarlos ni contradecirlos).
 *
 * Aporta únicamente información de presentación cartográfica:
 * - categorías de marcador (icono/color por tipo de lugar o paradero),
 * - trazado aproximado del recorrido de cada ruta,
 * - color estable por ruta para distinguirlas en el mapa.
 */

/** Categorías de marcador. Se derivan de Place.category y Stop.kind. */
export type MapCategoryId =
  | 'paradero'
  | 'despacho'
  | 'lugar'
  | 'centro comercial'
  | 'parque'
  | 'iglesia'
  | 'terminal'
  | 'estadio';

export type MapFeatureKind = 'place' | 'stop';

export interface MapCategoryMeta {
  id: MapCategoryId;
  /** Texto corto para chips/filtros */
  label: string;
  /** Icono mostrado dentro del marcador (emoji, sin assets extra) */
  emoji: string;
  /** Color del marcador */
  color: string;
  /** A qué conjunto de datos pertenece la categoría */
  kind: MapFeatureKind;
}

export const MAP_CATEGORIES: MapCategoryMeta[] = [
  { id: 'paradero', label: 'Paraderos', emoji: '🚏', color: '#e65100', kind: 'stop' },
  { id: 'despacho', label: 'Paraderos de despacho', emoji: '🚌', color: '#e65100', kind: 'stop' },
  { id: 'lugar', label: 'Lugares de referencia', emoji: '📍', color: '#0a7ea4', kind: 'place' },
  { id: 'parque', label: 'Parques', emoji: '🏞️', color: '#2e7d32', kind: 'place' },
  { id: 'centro comercial', label: 'Centros comerciales', emoji: '🛍️', color: '#6a1b9a', kind: 'place' },
  { id: 'iglesia', label: 'Iglesias', emoji: '⛪', color: '#8d6e63', kind: 'place' },
  { id: 'terminal', label: 'Terminales', emoji: '🚉', color: '#00838f', kind: 'place' },
  { id: 'estadio', label: 'Estadios', emoji: '🏟️', color: '#ad1457', kind: 'place' },
];

const CATEGORY_BY_ID = new Map<MapCategoryId, MapCategoryMeta>(MAP_CATEGORIES.map((c) => [c.id, c]));

export function getMapCategory(id: MapCategoryId): MapCategoryMeta {
  return CATEGORY_BY_ID.get(id) ?? MAP_CATEGORIES[2];
}

/**
 * Punto del mapa: un lugar de `places.ts` o un paradero/despachadero de
 * `stops.ts`, normalizado para poder pintarse y filtrarse igual.
 */
export interface MapFeature {
  /** ID único dentro del mapa ("place:xxx" / "stop:xxx") */
  id: string;
  /** ID original en places.ts o stops.ts */
  entityId: string;
  kind: MapFeatureKind;
  category: MapCategoryId;
  name: string;
  city: string;
  coordinates: Coordinates;
  /** Rutas que pasan por este punto (relación ya declarada en los datos) */
  routeIds: string[];
  verified: boolean;
  approximate: boolean;
  note?: string;
  /** Códigos crudos publicados por Socobuses (solo paraderos) */
  rawCodes?: string[];
}

export function featureIdForPlace(placeId: string): string {
  return `place:${placeId}`;
}

export function featureIdForStop(stopId: string): string {
  return `stop:${stopId}`;
}

function placeToFeature(p: Place): MapFeature {
  return {
    id: featureIdForPlace(p.id),
    entityId: p.id,
    kind: 'place',
    category: p.category,
    name: p.name,
    city: p.city,
    coordinates: p.coordinates,
    routeIds: p.routeIds,
    verified: p.verified,
    approximate: p.coordinatesApproximate === true,
  };
}

function stopToFeature(s: Stop): MapFeature {
  return {
    id: featureIdForStop(s.id),
    entityId: s.id,
    kind: 'stop',
    category: s.kind,
    name: s.name,
    city: 'Manizales',
    coordinates: s.coordinates,
    routeIds: s.routeIds,
    verified: s.verified,
    approximate: s.coordinatesApproximate === true,
    note: s.note,
    rawCodes: s.rawCodes,
  };
}

/** Todos los puntos georreferenciados del proyecto (lugares + paraderos). */
export const mapFeatures: MapFeature[] = [
  ...places.map(placeToFeature),
  ...stops.map(stopToFeature),
];

export function getFeatureById(id: string): MapFeature | undefined {
  return mapFeatures.find((f) => f.id === id);
}

/** Categorías que realmente existen en los datos (para no mostrar filtros vacíos). */
export function getAvailableCategories(): MapCategoryMeta[] {
  const present = new Set(mapFeatures.map((f) => f.category));
  return MAP_CATEGORIES.filter((c) => present.has(c.id));
}

export function getFeaturesForRoute(routeId: string): MapFeature[] {
  return mapFeatures.filter((f) => f.routeIds.includes(routeId));
}

/** Búsqueda sobre los mismos puntos que se pintan en el mapa. */
export function searchFeatures(query: string): MapFeature[] {
  const q = query.trim().toLowerCase();
  if (!q) return mapFeatures;
  return mapFeatures.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.routeIds.some((id) => id.toLowerCase().includes(q))
  );
}

/** Rutas que pasan por un punto del mapa, ya resueltas contra el catálogo. */
export function getRoutesForFeature(feature: MapFeature): Route[] {
  return feature.routeIds
    .map((id) => routes.find((r) => r.id === id))
    .filter((r): r is Route => Boolean(r));
}

/* ------------------------------------------------------------------ */
/* Trazado de rutas                                                    */
/* ------------------------------------------------------------------ */

function distance(a: Coordinates, b: Coordinates): number {
  const dLat = a.latitude - b.latitude;
  const dLon = (a.longitude - b.longitude) * Math.cos((a.latitude * Math.PI) / 180);
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

/**
 * Ordena los puntos de una ruta en una secuencia coherente (vecino más
 * cercano) partiendo del paradero de despacho de la ruta cuando existe, o
 * del punto más alejado del centro en caso contrario.
 *
 * IMPORTANTE: Socobuses publica los lugares de paso y los despachaderos de
 * cada ruta, pero NO la geometría calle a calle del recorrido. Por eso el
 * trazado es una APROXIMACIÓN que une en orden geográfico los puntos ya
 * verificados en `places.ts`/`stops.ts`; la UI lo etiqueta como aproximado
 * y no se inventa ningún punto nuevo.
 */
export function getRouteFeatures(route: Route): MapFeature[] {
  const pool: MapFeature[] = [
    ...route.stopIds
      .map((id) => stops.find((s) => s.id === id))
      .filter((s): s is Stop => Boolean(s))
      .map(stopToFeature),
    ...route.placeIds
      .map((id) => places.find((p) => p.id === id))
      .filter((p): p is Place => Boolean(p))
      .map(placeToFeature),
  ];
  if (pool.length <= 2) return pool;

  const startIndex = (() => {
    const stopIdx = pool.findIndex((f) => f.kind === 'stop');
    if (stopIdx >= 0) return stopIdx;
    let farthest = 0;
    pool.forEach((f, i) => {
      if (
        distance(f.coordinates, MANIZALES_CENTER) >
        distance(pool[farthest].coordinates, MANIZALES_CENTER)
      ) {
        farthest = i;
      }
    });
    return farthest;
  })();

  const remaining = [...pool];
  const ordered: MapFeature[] = [remaining.splice(startIndex, 1)[0]];

  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    let best = 0;
    for (let i = 1; i < remaining.length; i += 1) {
      if (
        distance(remaining[i].coordinates, last.coordinates) <
        distance(remaining[best].coordinates, last.coordinates)
      ) {
        best = i;
      }
    }
    ordered.push(remaining.splice(best, 1)[0]);
  }

  return ordered;
}

/** Coordenadas del trazado aproximado de la ruta (para la polilínea). */
export function getRoutePath(route: Route): Coordinates[] {
  return getRouteFeatures(route).map((f) => f.coordinates);
}

const ROUTE_PALETTE = [
  '#e6194b', '#3cb44b', '#0a7ea4', '#f58231', '#911eb4',
  '#008080', '#9a6324', '#800000', '#808000', '#000075',
  '#ad1457', '#2e7d32', '#6a1b9a', '#00838f', '#c62828',
];

/** Color estable (mismo ID → mismo color) para distinguir rutas en el mapa. */
export function getRouteColor(routeId: string): string {
  let hash = 0;
  for (let i = 0; i < routeId.length; i += 1) {
    hash = (hash * 31 + routeId.charCodeAt(i)) >>> 0;
  }
  return ROUTE_PALETTE[hash % ROUTE_PALETTE.length];
}

export interface MapBounds {
  south: number;
  north: number;
  west: number;
  east: number;
}

/** Caja que encuadra un conjunto de puntos (para el "ajustar al contenido"). */
export function getFeaturesBounds(features: MapFeature[] = mapFeatures): MapBounds {
  if (features.length === 0) {
    return {
      south: MANIZALES_CENTER.latitude,
      north: MANIZALES_CENTER.latitude,
      west: MANIZALES_CENTER.longitude,
      east: MANIZALES_CENTER.longitude,
    };
  }
  const lats = features.map((f) => f.coordinates.latitude);
  const lons = features.map((f) => f.coordinates.longitude);
  return {
    south: Math.min(...lats),
    north: Math.max(...lats),
    west: Math.min(...lons),
    east: Math.max(...lons),
  };
}
