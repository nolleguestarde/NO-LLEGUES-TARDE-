import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Coordinates } from '@/data/types';
import { MapBusMarker, MapPlaceMarker } from './manizales-map';

export interface ManizalesMapProps {
  places?: MapPlaceMarker[];
  stops?: MapPlaceMarker[];
  routePath?: Coordinates[];
  buses?: MapBusMarker[];
  onSelectPlace?: (id: string) => void;
  style?: object;
}

/**
 * En web, react-native-maps no está soportado sin configuración adicional
 * (Google Maps JS API). Para no romper la experiencia, mostramos un listado
 * esquemático de los mismos puntos que se verían en el mapa nativo. La
 * versión móvil (iOS/Android) usa el mapa real de Manizales.
 */
export function ManizalesMap({ places = [], stops = [], buses = [], style }: ManizalesMapProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.notice}>
        Vista de mapa simplificada para web. Abre la app en Android/iOS (Expo Go) para ver el
        mapa interactivo de Manizales.
      </Text>
      <ScrollView>
        {places.map((p) => (
          <View key={p.id} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: p.color ?? '#0a7ea4' }]} />
            <Text style={styles.rowText}>{p.title}</Text>
          </View>
        ))}
        {stops.map((s) => (
          <View key={s.id} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: '#e65100' }]} />
            <Text style={styles.rowText}>{s.title}</Text>
          </View>
        ))}
        {buses.map((b) => (
          <View key={b.id} style={styles.row}>
            <View style={[styles.dot, { backgroundColor: '#2e7d32' }]} />
            <Text style={styles.rowText}>{b.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f0f4f7', borderRadius: 16, padding: 14 },
  notice: { fontSize: 12, color: '#5b6770', marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  rowText: { fontSize: 13, color: '#11181C' },
});
