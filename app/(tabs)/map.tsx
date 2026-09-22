import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ManizalesMap } from '@/components/app/manizales-map';
import { places } from '@/data/places';
import { stops } from '@/data/stops';
import { getRouteById, routes } from '@/data/routes';

const FEATURED_ROUTE_IDS = ['601i', '603i', '620r', '614r', '626i'];

export default function MapScreen() {
  const [selectedRouteId, setSelectedRouteId] = React.useState<string | null>(null);
  const selectedRoute = selectedRouteId ? getRouteById(selectedRouteId) : undefined;

  const visiblePlaces = selectedRoute
    ? places.filter((p) => selectedRoute.placeIds.includes(p.id))
    : places;
  const visibleStops = selectedRoute
    ? stops.filter((s) => selectedRoute.stopIds.includes(s.id))
    : stops;

  const routePath = selectedRoute
    ? [
        ...visibleStops.map((s) => s.coordinates),
        ...visiblePlaces.map((p) => p.coordinates),
      ]
    : undefined;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Manizales</Text>
        <Text style={styles.subtitle}>
          {selectedRoute
            ? `Ruta ${selectedRoute.number} · ${selectedRoute.direction}`
            : 'Lugares y paraderos verificados por Socobuses'}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow} contentContainerStyle={styles.chipsContent}>
        <TouchableOpacity
          style={[styles.chip, !selectedRouteId && styles.chipActive]}
          onPress={() => setSelectedRouteId(null)}>
          <Text style={[styles.chipText, !selectedRouteId && styles.chipTextActive]}>Todos</Text>
        </TouchableOpacity>
        {FEATURED_ROUTE_IDS.map((id) => {
          const r = routes.find((rt) => rt.id === id);
          if (!r) return null;
          const active = selectedRouteId === id;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedRouteId(id)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {r.number} {r.direction === 'IDA' ? 'IDA' : 'REG'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.mapWrap}>
        <ManizalesMap
          places={visiblePlaces.map((p) => ({ id: p.id, coordinate: p.coordinates, title: p.name }))}
          stops={visibleStops.map((s) => ({ id: s.id, coordinate: s.coordinates, title: s.name }))}
          routePath={routePath}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8, gap: 4 },
  title: { fontSize: 24, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770' },
  chipsRow: { maxHeight: 46, paddingLeft: 20 },
  chipsContent: { gap: 8, paddingRight: 20, alignItems: 'center' },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8ed',
  },
  chipActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#39505c' },
  chipTextActive: { color: '#fff' },
  mapWrap: { flex: 1, margin: 16, borderRadius: 16, overflow: 'hidden' },
});
