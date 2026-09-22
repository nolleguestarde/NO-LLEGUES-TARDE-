import React from 'react';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { MANIZALES_REGION } from '@/data/manizales';
import { Coordinates } from '@/data/types';

export interface MapPlaceMarker {
  id: string;
  coordinate: Coordinates;
  title: string;
  description?: string;
  color?: string;
}

export interface MapBusMarker {
  id: string;
  coordinate: Coordinates;
  title: string;
}

export interface ManizalesMapProps {
  places?: MapPlaceMarker[];
  stops?: MapPlaceMarker[];
  routePath?: Coordinates[];
  buses?: MapBusMarker[];
  onSelectPlace?: (id: string) => void;
  style?: object;
}

/**
 * Mapa nativo (iOS/Android) centrado en Manizales, Caldas.
 * Usa react-native-maps (Google Maps / Apple Maps). No requiere API key
 * adicional para pruebas en Expo Go con el proveedor por defecto.
 */
export function ManizalesMap({ places = [], stops = [], routePath, buses = [], style }: ManizalesMapProps) {
  return (
    <MapView
      style={[styles.map, style]}
      provider={PROVIDER_DEFAULT}
      initialRegion={MANIZALES_REGION}>
      {routePath && routePath.length > 1 && (
        <Polyline coordinates={routePath} strokeColor="#0a7ea4" strokeWidth={4} />
      )}
      {places.map((p) => (
        <Marker key={`place-${p.id}`} coordinate={p.coordinate} title={p.title} description={p.description} pinColor={p.color ?? '#0a7ea4'} />
      ))}
      {stops.map((s) => (
        <Marker key={`stop-${s.id}`} coordinate={s.coordinate} title={s.title} description={s.description} pinColor="#e65100" />
      ))}
      {buses.map((b) => (
        <Marker key={`bus-${b.id}`} coordinate={b.coordinate} title={b.title} pinColor="#2e7d32" />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: '100%', height: '100%' },
});
