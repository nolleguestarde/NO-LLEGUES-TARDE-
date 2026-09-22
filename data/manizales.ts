import { Coordinates } from './types';

/**
 * Configuración geográfica de referencia para centrar el mapa en
 * Manizales, Caldas, Colombia (no una ciudad genérica).
 */
export const MANIZALES_CENTER: Coordinates = {
  latitude: 5.0689,
  longitude: -75.5174, // centro histórico, cerca de Parque Caldas
};

export const MANIZALES_REGION = {
  ...MANIZALES_CENTER,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};
