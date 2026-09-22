/**
 * NO LLEGUES TARDE — Modelos de datos
 * ------------------------------------------------------------------
 * Toda la información de transporte público de Manizales vive en /data.
 * Las pantallas (app/) y componentes (components/) NUNCA deben tener
 * datos "quemados": siempre consultan estas estructuras.
 *
 * Reglas de veracidad de los datos (ver AGENTS del proyecto):
 * - verified: true  -> dato confirmado con una fuente real (Socobuses,
 *                       nombres reales de empresas/lugares/rutas).
 * - verified: false -> todavía no hay fuente oficial confirmada.
 * - simulated: true -> el valor es generado/demostrativo (posición de
 *                       buseta, ocupación, tiempos, notificaciones,
 *                       reportes). NUNCA se debe mostrar como dato
 *                       oficial en tiempo real.
 */

export type DirectionCode = 'i' | 'r' | 'vi' | 'vr';
export type DirectionLabel = 'IDA' | 'REGRESO';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Company {
  id: string;
  name: string;
  city: string;
  /** true = empresa real confirmada de Manizales */
  verified: boolean;
  /** Estado operativo mostrado en la app (simulado, no oficial) */
  status: 'activa' | 'por verificar';
  description: string;
  /** Iniciales para el badge visual cuando no hay logo real */
  initials: string;
  /** Color de marca aproximado usado solo para identificación visual */
  color: string;
}

export interface Route {
  id: string; // ej: "603i"
  number: string; // ej: "603"
  directionCode: DirectionCode;
  direction: DirectionLabel;
  /** true cuando la variante es una "vía" (vi/vr) distinta del recorrido base */
  isVariant: boolean;
  companyId: string;
  origin: string;
  destination: string;
  /** IDs de lugares reales por los que pasa esta ruta (verificados por Socobuses) */
  placeIds: string[];
  /** IDs de paraderos/puntos de despacho asociados */
  stopIds: string[];
  verified: boolean;
  simulated: boolean;
  /** Nota corta visible en la UI cuando el dato es parcial */
  note?: string;
}

export interface Place {
  id: string;
  name: string;
  city: string;
  coordinates: Coordinates;
  routeIds: string[];
  verified: boolean;
  /** Las coordenadas son aproximadas para visualización, no geocodificación oficial */
  coordinatesApproximate?: boolean;
  category: 'lugar' | 'centro comercial' | 'parque' | 'iglesia' | 'terminal' | 'estadio';
}

export type StopKind = 'paradero' | 'despacho';

export interface Stop {
  id: string;
  name: string;
  kind: StopKind;
  coordinates: Coordinates;
  /** IDs de rutas ya resueltas contra el catálogo de rutas */
  routeIds: string[];
  /** Códigos crudos tal cual los publica Socobuses (útil cuando no se pudo resolver el sentido) */
  rawCodes?: string[];
  verified: boolean;
  coordinatesApproximate?: boolean;
  note?: string;
}

export interface ScheduleEntry {
  day: 'lunes a viernes' | 'sábado' | 'domingo y festivos';
  firstDeparture: string; // HH:mm
  lastDeparture: string; // HH:mm
  frequencyMinutes: number;
}

export interface Schedule {
  id: string;
  routeId: string;
  entries: ScheduleEntry[];
  verified: boolean;
  simulated: boolean;
}

export type OccupancyLevel = 'baja' | 'media' | 'alta';

export interface SimulatedBus {
  id: string;
  routeId: string;
  companyId: string;
  /** Posición actual a lo largo del recorrido (0 a 1) */
  progress: number;
  simulatedLocation: Coordinates;
  occupancy: OccupancyLevel;
  estimatedArrivalMinutes: number;
  /** Sentido de avance a lo largo del arreglo de paraderos */
  direction: 1 | -1;
  plate: string;
  simulated: true;
}

export type NotificationKind = 'retraso' | 'cambio' | 'novedad' | 'llegada';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  message: string;
  routeId?: string;
  createdAt: string; // ISO
  simulated: true;
}

export type ReportType =
  | 'retraso'
  | 'desvio'
  | 'cambio_ruta'
  | 'problema_servicio'
  | 'buseta_llena'
  | 'otra';

export interface ReportItem {
  id: string;
  routeId?: string;
  type: ReportType;
  description: string;
  createdAt: string; // ISO
  simulated: true;
}
