import { Stop } from './types';

/**
 * Puntos de despacho / control de Socobuses publicados públicamente.
 * Las coordenadas son aproximadas (barrios/sectores reales de Manizales)
 * usadas solo para ubicar el punto en el mapa; no son una geocodificación
 * oficial verificada.
 *
 * rawCodes conserva los códigos tal como los publica Socobuses (algunos sin
 * distinguir claramente ida/regreso, ej. "603V", "607", "612").
 */
export const stops: Stop[] = [
  {
    id: 'despachadero-aranjuez',
    name: 'Despachadero Aranjuez',
    kind: 'despacho',
    coordinates: { latitude: 5.0752, longitude: -75.5057 },
    coordinatesApproximate: true,
    rawCodes: ['603V', '618V'],
    routeIds: [],
    verified: true,
  },
  {
    id: 'enea',
    name: 'Enea',
    kind: 'despacho',
    coordinates: { latitude: 5.0357, longitude: -75.5127 },
    coordinatesApproximate: true,
    rawCodes: ['607', '606'],
    routeIds: [],
    verified: true,
  },
  {
    id: 'puerta-del-sol',
    name: 'Puerta del Sol',
    kind: 'despacho',
    coordinates: { latitude: 5.0611, longitude: -75.4855 },
    coordinatesApproximate: true,
    rawCodes: ['626R', '625I', '627I'],
    routeIds: ['626r', '625i', '627i'],
    verified: true,
  },
  {
    id: 'guamal',
    name: 'Guamal',
    kind: 'despacho',
    coordinates: { latitude: 5.0295, longitude: -75.4939 },
    coordinatesApproximate: true,
    rawCodes: ['620R'],
    routeIds: ['620r'],
    verified: true,
  },
  {
    id: 'morro-gacho',
    name: 'Morro Gacho',
    kind: 'despacho',
    coordinates: { latitude: 5.0836, longitude: -75.4936 },
    coordinatesApproximate: true,
    rawCodes: ['601I', '619I'],
    routeIds: ['601i', '619i'],
    verified: true,
  },
  {
    id: 'malteria',
    name: 'Maltería',
    kind: 'despacho',
    coordinates: { latitude: 5.0442, longitude: -75.4820 },
    coordinatesApproximate: true,
    rawCodes: ['614R', '614VR', '627R'],
    routeIds: ['614r', '614vr', '627r'],
    verified: true,
  },
  {
    id: 'sultana',
    name: 'Sultana',
    kind: 'despacho',
    coordinates: { latitude: 5.0813, longitude: -75.5041 },
    coordinatesApproximate: true,
    rawCodes: ['601R', '613R', '613VR', '621R', '622R'],
    routeIds: ['601r', '613r', '613vr', '621r', '622r'],
    verified: true,
  },
  {
    id: 'colinas',
    name: 'Colinas',
    kind: 'despacho',
    coordinates: { latitude: 5.0812, longitude: -75.5285 },
    coordinatesApproximate: true,
    rawCodes: ['608R', '619R', '616R'],
    routeIds: ['608r', '619r', '616r'],
    verified: true,
  },
  {
    id: 'villapilar',
    name: 'Villapilar',
    kind: 'despacho',
    coordinates: { latitude: 5.0917, longitude: -75.5197 },
    coordinatesApproximate: true,
    rawCodes: [
      '602I', '603I', '604I', '605I', '606I', '607I', '608I', '609I', '610I', '611I',
      '613I', '613VI', '614I', '614VI', '615I', '616I', '620I', '624I', '626I', '626VI',
    ],
    routeIds: [
      '602i', '603i', '604i', '605i', '606i', '607i', '608i', '609i', '610i', '611i',
      '613i', '613vi', '614i', '614vi', '615i', '616i', '620i', '624i', '626i', '626vi',
    ],
    verified: true,
  },
  {
    id: 'liborio',
    name: 'Liborio',
    kind: 'despacho',
    coordinates: { latitude: 5.0655, longitude: -75.5361 },
    coordinatesApproximate: true,
    rawCodes: ['617I', '618I', '623I'],
    routeIds: ['617i', '618i', '623i'],
    verified: true,
  },
  {
    id: 'palermo',
    name: 'Palermo',
    kind: 'despacho',
    coordinates: { latitude: 5.0263, longitude: -75.4967 },
    coordinatesApproximate: true,
    rawCodes: ['612', '611', '610R'],
    routeIds: ['610r'],
    verified: true,
    note: 'Los códigos "612" y "611" publicados por Socobuses no especifican sentido; se muestran como referencia sin resolver a un ID de ruta específico.',
  },
];

export function getStopById(id: string): Stop | undefined {
  return stops.find((s) => s.id === id);
}

export function getStopsForRoute(routeId: string): Stop[] {
  return stops.filter((s) => s.routeIds.includes(routeId));
}
