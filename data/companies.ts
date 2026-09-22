import { Company } from './types';

/**
 * Empresas de transporte público colectivo de Manizales.
 * Todas son empresas reales de la ciudad (verified: true a nivel de existencia).
 * Solo Socobuses tiene, por ahora, relaciones ruta → lugar verificadas mediante
 * su información pública. Las demás empresas existen realmente pero sus rutas
 * detalladas todavía no han sido verificadas dentro de esta app, por lo que
 * NO se les asignan rutas por suposición.
 */
export const companies: Company[] = [
  {
    id: 'socobuses',
    name: 'Socobuses',
    city: 'Manizales',
    verified: true,
    status: 'activa',
    initials: 'SB',
    color: '#0a7ea4',
    description:
      'Fuente principal de las relaciones lugar → ruta usadas en esta app. Sus rutas (601 a 627, con variantes) están documentadas públicamente con paraderos y puntos de despacho.',
  },
  {
    id: 'gran-caldas',
    name: 'Gran Caldas',
    city: 'Manizales',
    verified: true,
    status: 'por verificar',
    initials: 'GC',
    color: '#2e7d32',
    description:
      'Empresa real de transporte colectivo de Manizales. Sus rutas específicas todavía no están verificadas dentro de esta app: por ahora no se le asignan rutas por suposición.',
  },
  {
    id: 'autolegal',
    name: 'Autolegal',
    city: 'Manizales',
    verified: true,
    status: 'por verificar',
    initials: 'AL',
    color: '#6a1b9a',
    description:
      'Empresa real de transporte colectivo de Manizales. Sus rutas específicas están pendientes de verificación con fuentes oficiales.',
  },
  {
    id: 'sideral',
    name: 'Sideral',
    city: 'Manizales',
    verified: true,
    status: 'por verificar',
    initials: 'SD',
    color: '#e65100',
    description:
      'Empresa real de transporte colectivo de Manizales. Sus rutas específicas están pendientes de verificación con fuentes oficiales.',
  },
  {
    id: 'unitrans',
    name: 'Unitrans',
    city: 'Manizales',
    verified: true,
    status: 'por verificar',
    initials: 'UT',
    color: '#ad1457',
    description:
      'Empresa real de transporte colectivo de Manizales. Sus rutas específicas están pendientes de verificación con fuentes oficiales.',
  },
  {
    id: 'serviturismo',
    name: 'Serviturismo',
    city: 'Manizales',
    verified: true,
    status: 'por verificar',
    initials: 'SV',
    color: '#00838f',
    description:
      'Empresa real de transporte colectivo de Manizales. Sus rutas específicas están pendientes de verificación con fuentes oficiales.',
  },
  {
    id: 'flota-metropolitana',
    name: 'Flota Metropolitana S.A.',
    city: 'Manizales',
    verified: true,
    status: 'por verificar',
    initials: 'FM',
    color: '#455a64',
    description:
      'Empresa real de transporte colectivo de Manizales. Sus rutas específicas están pendientes de verificación con fuentes oficiales.',
  },
];

export function getCompanyById(id: string): Company | undefined {
  return companies.find((c) => c.id === id);
}
