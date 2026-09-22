import { places } from './places';
import { stops } from './stops';
import { DirectionCode, DirectionLabel, Route } from './types';

/**
 * Catálogo de rutas de Socobuses.
 *
 * En vez de escribir manualmente cada relación ruta → lugar/paradero (lo que
 * duplicaría la información ya declarada en places.ts y stops.ts), este
 * archivo DERIVA el catálogo de rutas a partir de los routeIds ya presentes
 * en lugares y paraderos. Así se respeta "no dupliques información
 * innecesariamente" y cualquier corrección futura en un solo lugar
 * (places.ts / stops.ts) se refleja automáticamente aquí.
 *
 * Nombres de despachaderos/paraderos reales conocidos por sentido (según la
 * publicación de Socobuses) se usan para inferir origen/destino cuando es
 * posible. Cuando no hay suficiente información, el campo queda marcado
 * como "Centro de Manizales" (destino habitual de la mayoría de rutas
 * urbanas) o "Por confirmar".
 */

function parseCode(code: string): { number: string; directionCode: DirectionCode; isVariant: boolean } {
  const match = code.match(/^(\d+)(vi|vr|i|r)$/i);
  if (!match) {
    return { number: code, directionCode: 'i', isVariant: false };
  }
  const [, number, dir] = match;
  const directionCode = dir.toLowerCase() as DirectionCode;
  return { number, directionCode, isVariant: directionCode === 'vi' || directionCode === 'vr' };
}

function directionLabel(code: DirectionCode): DirectionLabel {
  return code === 'i' || code === 'vi' ? 'IDA' : 'REGRESO';
}

// Recolecta todos los códigos de ruta que aparecen en lugares o paraderos.
const allCodes = new Set<string>();
places.forEach((p) => p.routeIds.forEach((id) => allCodes.add(id)));
stops.forEach((s) => s.routeIds.forEach((id) => allCodes.add(id)));

// Despachaderos conocidos por código crudo (sentido explícito según Socobuses).
const dispatchByCode = new Map<string, string>();
stops.forEach((s) => {
  (s.rawCodes ?? []).forEach((raw) => {
    dispatchByCode.set(raw.toLowerCase(), s.name);
  });
});

const CENTRAL_DESTINATION = 'Centro de Manizales (C.C. Parque Caldas / C.C. Fundadores)';

export const routes: Route[] = Array.from(allCodes)
  .sort()
  .map((code) => {
    const { number, directionCode, isVariant } = parseCode(code);
    const direction = directionLabel(directionCode);
    const placeIds = places.filter((p) => p.routeIds.includes(code)).map((p) => p.id);
    const stopIds = stops.filter((s) => s.routeIds.includes(code)).map((s) => s.id);
    const dispatchName = dispatchByCode.get(code.toLowerCase());

    const origin = direction === 'IDA' ? dispatchName ?? 'Punto de despacho por confirmar' : CENTRAL_DESTINATION;
    const destination = direction === 'IDA' ? CENTRAL_DESTINATION : dispatchName ?? 'Punto de despacho por confirmar';

    const route: Route = {
      id: code,
      number,
      directionCode,
      direction,
      isVariant,
      companyId: 'socobuses',
      origin,
      destination,
      placeIds,
      stopIds,
      verified: true,
      simulated: false,
      note:
        !dispatchName
          ? 'Origen/destino exacto por confirmar; el recorrido y los lugares de paso sí están verificados con Socobuses.'
          : undefined,
    };
    return route;
  });

export function getRouteById(id: string): Route | undefined {
  return routes.find((r) => r.id === id);
}

export function getRoutesByNumber(number: string): Route[] {
  return routes.filter((r) => r.number === number);
}

export function getRoutesForCompany(companyId: string): Route[] {
  return routes.filter((r) => r.companyId === companyId);
}

export function getRoutesForPlace(placeId: string): Route[] {
  return routes.filter((r) => r.placeIds.includes(placeId));
}

export function searchRoutes(query: string): Route[] {
  const q = query.trim().toLowerCase();
  if (!q) return routes;
  return routes.filter(
    (r) =>
      r.number.includes(q) ||
      r.id.toLowerCase().includes(q) ||
      r.origin.toLowerCase().includes(q) ||
      r.destination.toLowerCase().includes(q)
  );
}

/** Números de ruta únicos, ordenados numéricamente, para listados agrupados. */
export function getUniqueRouteNumbers(): string[] {
  return Array.from(new Set(routes.map((r) => r.number))).sort((a, b) => Number(a) - Number(b));
}
