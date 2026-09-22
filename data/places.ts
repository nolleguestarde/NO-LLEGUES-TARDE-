import { Place } from './types';

/**
 * Lugares reales de Manizales publicados por Socobuses como referencias de
 * paso de sus rutas. Los routeIds se completan en routes.ts (relación
 * bidireccional derivada de esta misma lista, sin duplicar información).
 *
 * Las coordenadas son aproximadas (coordinatesApproximate: true): permiten
 * ubicar el punto en el mapa de Manizales para esta primera versión, pero no
 * provienen de una geocodificación oficial verificada.
 */
export const places: Place[] = [
  {
    id: 'ecoparque-los-yarumos',
    name: 'Ecoparque Los Yarumos',
    city: 'Manizales',
    category: 'parque',
    coordinates: { latitude: 5.0821, longitude: -75.5223 },
    coordinatesApproximate: true,
    routeIds: ['604i'],
    verified: true,
  },
  {
    id: 'parque-del-agua',
    name: 'Parque del Agua',
    city: 'Manizales',
    category: 'parque',
    coordinates: { latitude: 5.0645, longitude: -75.5104 },
    coordinatesApproximate: true,
    routeIds: [
      '601i', '601r', '602i', '602r', '603i', '603r', '604i', '604r', '605i', '605r',
      '606i', '606r', '607i', '607r', '608i', '608r', '609i', '609r', '610i', '611i',
      '611r', '612i', '613i', '613r', '613vi', '614i', '614r', '614vi', '614vr', '615i',
      '615r', '616i', '616r', '617i', '617r', '618i', '619i', '619r', '620i', '620r',
      '621i', '622i', '622r', '623i', '623r', '624i', '624r', '626i', '626vi',
    ],
    verified: true,
  },
  {
    id: 'cc-cable-plaza',
    name: 'C.C. Cable Plaza',
    city: 'Manizales',
    category: 'centro comercial',
    coordinates: { latitude: 5.0578, longitude: -75.4934 },
    coordinatesApproximate: true,
    routeIds: ['601i', '603r', '619r', '620r'],
    verified: true,
  },
  {
    id: 'cc-fundadores',
    name: 'C.C. Fundadores',
    city: 'Manizales',
    category: 'centro comercial',
    coordinates: { latitude: 5.0687, longitude: -75.5169 },
    coordinatesApproximate: true,
    routeIds: [
      '601i', '601r', '602i', '602r', '603i', '603r', '604i', '604r', '605i', '605r',
      '606i', '606r', '607i', '607r', '608i', '608r', '609i', '609r', '610i', '610r',
      '611i', '611r', '612i', '612r', '613i', '613r', '613vi', '613vr', '614i', '614r',
      '614vi', '614vr', '615i', '615r', '616i', '616r', '618i', '618r', '619i', '619r',
      '620i', '620r', '621i', '621r', '622i', '622r', '624i', '624r', '626i', '626r',
      '626vi', '626vr',
    ],
    verified: true,
  },
  {
    id: 'milan',
    name: 'Milán',
    city: 'Manizales',
    category: 'lugar',
    coordinates: { latitude: 5.0788, longitude: -75.5086 },
    coordinatesApproximate: true,
    routeIds: ['601i', '613i', '613r', '613vi', '613vr', '622i', '622r'],
    verified: true,
  },
  {
    id: 'estadio-palogrande',
    name: 'Estadio Palogrande',
    city: 'Manizales',
    category: 'estadio',
    coordinates: { latitude: 5.0509, longitude: -75.4938 },
    coordinatesApproximate: true,
    routeIds: [
      '601r', '602i', '602r', '603i', '603r', '608i', '608r', '609i', '609r', '610i',
      '610r', '611i', '611r', '612i', '612r', '619i', '619r', '620r', '625i', '625r',
    ],
    verified: true,
  },
  {
    id: 'iglesia-de-chipre',
    name: 'Iglesia de Chipre',
    city: 'Manizales',
    category: 'iglesia',
    coordinates: { latitude: 5.0731, longitude: -75.5219 },
    coordinatesApproximate: true,
    routeIds: [
      '602i', '603i', '603r', '604r', '605r', '606i', '606r', '607i', '607r', '608i',
      '608r', '609i', '609r', '611r', '613r', '614r', '614vr', '615r', '617r', '620i',
      '620r', '622r', '624r', '616r',
    ],
    verified: true,
  },
  {
    id: 'cc-parque-caldas',
    name: 'C.C. Parque Caldas',
    city: 'Manizales',
    category: 'parque',
    coordinates: { latitude: 5.0689, longitude: -75.5174 },
    coordinatesApproximate: true,
    routeIds: [
      '602i', '602r', '603i', '603r', '604i', '604r', '605i', '605r', '606i', '606r',
      '607i', '607r', '608i', '608r', '609i', '609r', '610i', '610r', '611i', '611r',
      '612i', '612r', '613i', '613r', '613vi', '613vr', '614i', '614r', '614vi', '614vr',
      '615i', '615r', '616i', '616r', '618i', '618r', '619i', '619r', '620i', '620r',
      '621i', '621r', '622i', '622r', '624i', '624r', '626i', '626r', '626vi', '626vr',
    ],
    verified: true,
  },
  {
    id: 'iglesia-la-inmaculada',
    name: 'Iglesia La Inmaculada',
    city: 'Manizales',
    category: 'iglesia',
    coordinates: { latitude: 5.0695, longitude: -75.5163 },
    coordinatesApproximate: true,
    routeIds: [
      '602i', '602r', '603i', '603r', '604i', '604r', '605i', '605r', '606i', '606r',
      '607i', '607r', '608i', '608r', '609i', '609r', '610i', '611i', '611r', '612i',
      '613i', '613r', '613vi', '613vr', '614i', '614r', '614vi', '614vr', '615i', '615r',
      '616i', '616r', '618i', '618r', '619i', '619r', '620i', '620r', '621i', '622i',
      '622r', '624i', '624r', '626i', '626r', '626vi', '626vr',
    ],
    verified: true,
  },
  {
    id: 'parroquia-de-fatima',
    name: 'Parroquia de Fátima',
    city: 'Manizales',
    category: 'iglesia',
    coordinates: { latitude: 5.0447, longitude: -75.4988 },
    coordinatesApproximate: true,
    routeIds: ['602i', '602r', '603i', '603r', '608i', '608r', '609i', '609r', '610i', '610r', '619i', '619r'],
    verified: true,
  },
  {
    id: 'bosque-popular-el-prado',
    name: 'Bosque Popular El Prado',
    city: 'Manizales',
    category: 'parque',
    coordinates: { latitude: 5.0403, longitude: -75.4884 },
    coordinatesApproximate: true,
    routeIds: ['606i', '606r', '607i', '607r', '614i', '614r', '614vi', '614vr', '627i', '627r'],
    verified: true,
  },
  {
    id: 'terminal-los-cambulos',
    name: 'Terminal de Transportes Los Cámbulos',
    city: 'Manizales',
    category: 'terminal',
    coordinates: { latitude: 5.0779, longitude: -75.5316 },
    coordinatesApproximate: true,
    routeIds: ['608i', '608r', '617i', '617r'],
    verified: true,
  },
  {
    id: 'cc-mall-plaza',
    name: 'C.C. Mall Plaza Manizales',
    city: 'Manizales',
    category: 'centro comercial',
    coordinates: { latitude: 5.0478, longitude: -75.4847 },
    coordinatesApproximate: true,
    routeIds: ['621i', '621r'],
    verified: true,
  },
  {
    id: 'san-peregrino',
    name: 'San Peregrino',
    city: 'Manizales',
    category: 'lugar',
    coordinates: { latitude: 5.0376, longitude: -75.4786 },
    coordinatesApproximate: true,
    routeIds: ['623i', '623r'],
    verified: true,
  },
];

export function getPlaceById(id: string): Place | undefined {
  return places.find((p) => p.id === id);
}

export function searchPlaces(query: string): Place[] {
  const q = query.trim().toLowerCase();
  if (!q) return places;
  return places.filter(
    (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
}

export function getPlacesForRoute(routeId: string): Place[] {
  return places.filter((p) => p.routeIds.includes(routeId));
}

