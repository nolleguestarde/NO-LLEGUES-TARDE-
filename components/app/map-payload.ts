import {
  getMapCategory,
  getRouteColor,
  getRoutePath,
  MapFeature,
} from '@/data/map';
import { Route, SimulatedBus } from '@/data/types';
import { MapBusPayload, MapMarkerPayload, MapRoutePayload } from './leaflet-map-html';

/**
 * Traduce las entidades del proyecto (MapFeature / Route / SimulatedBus) al
 * formato que entiende el lienzo Leaflet. No añade datos: solo formatea los
 * que ya existen en `data/`.
 */

export interface MarkerOptions {
  /** IDs de features resaltados (búsqueda, selección, favoritos) */
  highlightedIds?: Set<string> | string[];
  /** Texto del botón del globo de información */
  actionLabel?: string | null;
}

function toSet(value?: Set<string> | string[]): Set<string> {
  if (!value) return new Set();
  return value instanceof Set ? value : new Set(value);
}

export function featureToMarker(feature: MapFeature, options: MarkerOptions = {}): MapMarkerPayload {
  const category = getMapCategory(feature.category);
  const highlighted = toSet(options.highlightedIds).has(feature.id);

  const lines: string[] = [];
  if (feature.routeIds.length > 0) {
    lines.push(
      `${feature.routeIds.length} ruta${feature.routeIds.length === 1 ? '' : 's'}: ` +
        feature.routeIds.slice(0, 8).join(', ') +
        (feature.routeIds.length > 8 ? '…' : '')
    );
  } else if (feature.rawCodes && feature.rawCodes.length > 0) {
    lines.push(`Códigos publicados: ${feature.rawCodes.join(', ')}`);
  } else {
    lines.push('Sin rutas verificadas asociadas.');
  }
  lines.push(`${feature.city}, Caldas`);
  if (feature.approximate) lines.push('Ubicación aproximada (no oficial).');
  if (feature.note) lines.push(feature.note);

  return {
    id: feature.id,
    lat: feature.coordinates.latitude,
    lng: feature.coordinates.longitude,
    emoji: category.emoji,
    color: category.color,
    title: feature.name,
    category: category.label,
    lines,
    actionLabel:
      options.actionLabel === null
        ? undefined
        : options.actionLabel ??
          (feature.kind === 'place' ? 'Ver detalle del lugar' : 'Ver rutas del paradero'),
    highlighted,
  };
}

export function featuresToMarkers(
  features: MapFeature[],
  options: MarkerOptions = {}
): MapMarkerPayload[] {
  return features.map((f) => featureToMarker(f, options));
}

export function routeToPayload(route: Route, active = false): MapRoutePayload {
  return {
    id: route.id,
    color: getRouteColor(route.id),
    label: `Ruta ${route.number} · ${route.direction}`,
    path: getRoutePath(route),
    active,
    lines: [
      `Origen: ${route.origin}`,
      `Destino: ${route.destination}`,
      `${route.stopIds.length} paradero(s) · ${route.placeIds.length} lugar(es)`,
      'Trazado aproximado: une los puntos verificados de la ruta.',
    ],
  };
}

export function busesToPayload(buses: SimulatedBus[]): MapBusPayload[] {
  return buses.map((b) => ({
    id: b.id,
    lat: b.simulatedLocation.latitude,
    lng: b.simulatedLocation.longitude,
    title: `Buseta ${b.plate} · ${b.estimatedArrivalMinutes} min`,
    color: getRouteColor(b.routeId),
  }));
}
