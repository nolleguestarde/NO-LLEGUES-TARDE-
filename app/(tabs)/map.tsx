import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ManizalesMap } from '@/components/app/manizales-map';
import { busesToPayload, featuresToMarkers, routeToPayload } from '@/components/app/map-payload';
import { SearchBar } from '@/components/app/search-bar';
import {
  getAvailableCategories,
  getFeatureById,
  getRouteFeatures,
  MapCategoryId,
  mapFeatures,
  searchFeatures,
} from '@/data/map';
import { getRouteById, routes } from '@/data/routes';
import { useSimulatedBuses } from '@/hooks/use-simulated-buses';

/** Rutas destacadas en el selector rápido (todas existen en data/routes.ts). */
const FEATURED_ROUTE_IDS = ['601i', '603i', '620r', '614r', '626i'];

export default function MapScreen() {
  // Parámetros de entrada: permiten que otras pantallas (lugares, búsqueda,
  // detalle de ruta) abran el mapa centrado en algo concreto.
  const params = useLocalSearchParams<{ focus?: string; route?: string; q?: string }>();

  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState<MapCategoryId | 'all'>('all');
  const [selectedRouteId, setSelectedRouteId] = React.useState<string | null>(null);
  const [focusedFeatureId, setFocusedFeatureId] = React.useState<string | null>(null);

  const categories = React.useMemo(() => getAvailableCategories(), []);

  // Sincroniza el estado con los parámetros de navegación entrantes.
  React.useEffect(() => {
    if (params.route) setSelectedRouteId(params.route);
    if (params.focus) setFocusedFeatureId(params.focus);
    if (params.q) setQuery(params.q);
  }, [params.route, params.focus, params.q]);

  const selectedRoute = selectedRouteId ? getRouteById(selectedRouteId) : undefined;
  const buses = useSimulatedBuses(selectedRoute, 2);

  // 1) Base: si hay ruta seleccionada, solo sus puntos; si no, todos.
  const baseFeatures = React.useMemo(
    () => (selectedRoute ? getRouteFeatures(selectedRoute) : mapFeatures),
    [selectedRoute]
  );

  // 2) Filtro por categoría (paraderos, parques, iglesias...).
  const byCategory = React.useMemo(
    () => (category === 'all' ? baseFeatures : baseFeatures.filter((f) => f.category === category)),
    [baseFeatures, category]
  );

  // 3) Búsqueda sobre los mismos puntos que se pintan.
  const matchedIds = React.useMemo(() => {
    if (!query.trim()) return new Set<string>();
    return new Set(searchFeatures(query).map((f) => f.id));
  }, [query]);

  const visibleFeatures = React.useMemo(
    () => (matchedIds.size > 0 ? byCategory.filter((f) => matchedIds.has(f.id)) : byCategory),
    [byCategory, matchedIds]
  );

  const focusedFeature = focusedFeatureId ? getFeatureById(focusedFeatureId) : undefined;

  const mapData = React.useMemo(
    () => ({
      markers: featuresToMarkers(visibleFeatures, {
        highlightedIds: focusedFeature ? new Set([focusedFeature.id, ...matchedIds]) : matchedIds,
      }),
      routes: selectedRoute ? [routeToPayload(selectedRoute, true)] : [],
      buses: selectedRoute ? busesToPayload(buses) : [],
      focus: focusedFeature ? { ...focusedFeature.coordinates, zoom: 16 } : null,
      fitToContent: true,
      openMarkerId: focusedFeature?.id ?? null,
    }),
    [visibleFeatures, selectedRoute, buses, focusedFeature, matchedIds]
  );

  const handleMarkerAction = (id: string) => {
    const feature = getFeatureById(id);
    if (feature) {
      if (feature.kind === 'place') {
        router.push(`/place/${feature.entityId}`);
      } else if (feature.routeIds.length > 0) {
        router.push(`/route/${feature.routeIds[0]}`);
      }
      return;
    }
    const route = getRouteById(id);
    if (route) {
      router.push(`/route/${route.id}`);
    }
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
    setSelectedRouteId(null);
    setFocusedFeatureId(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mapa de Manizales</Text>
        <Text style={styles.subtitle}>
          {selectedRoute
            ? `Ruta ${selectedRoute.number} · ${selectedRoute.direction} · ${visibleFeatures.length} punto(s)`
            : `${visibleFeatures.length} lugares y paraderos en el mapa`}
        </Text>
        <SearchBar
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            setFocusedFeatureId(null);
          }}
          placeholder="Buscar lugar, paradero o ruta en el mapa..."
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={styles.chipsContent}>
        <Chip label="Todos" active={category === 'all'} onPress={() => setCategory('all')} />
        {categories.map((c) => (
          <Chip
            key={c.id}
            label={`${c.emoji} ${c.label}`}
            active={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsRow}
        contentContainerStyle={styles.chipsContent}>
        <Chip
          label="Sin ruta"
          active={!selectedRouteId}
          onPress={() => {
            setSelectedRouteId(null);
            setFocusedFeatureId(null);
          }}
        />
        {FEATURED_ROUTE_IDS.map((id) => {
          const r = routes.find((rt) => rt.id === id);
          if (!r) return null;
          return (
            <Chip
              key={id}
              label={`🚌 ${r.number} ${r.direction === 'IDA' ? 'IDA' : 'REG'}`}
              active={selectedRouteId === id}
              onPress={() => {
                setSelectedRouteId(id);
                setFocusedFeatureId(null);
              }}
            />
          );
        })}
        <Chip label="Ver todas las rutas" active={false} onPress={() => router.push('/routes')} />
      </ScrollView>

      <View style={styles.mapWrap}>
        <ManizalesMap
          data={mapData}
          onSelectMarker={setFocusedFeatureId}
          onMarkerAction={handleMarkerAction}
          onSelectRoute={(id) => router.push(`/route/${id}`)}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={2}>
          {focusedFeature
            ? `📍 ${focusedFeature.name}`
            : 'Toca un marcador para ver su información y sus rutas.'}
        </Text>
        {selectedRoute && (
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => router.push(`/route/${selectedRoute.id}`)}>
            <Ionicons name="information-circle" size={16} color="#fff" />
            <Text style={styles.footerButtonText}>Detalle</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.footerGhost} onPress={resetFilters}>
          <Text style={styles.footerGhostText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8, gap: 6 },
  title: { fontSize: 24, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770' },
  chipsRow: { maxHeight: 46, paddingLeft: 20, flexGrow: 0, marginTop: 6 },
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
  mapWrap: {
    flex: 1,
    minHeight: 280,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#e8eef2',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  footerText: { flex: 1, fontSize: 12, color: '#39505c' },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  footerButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  footerGhost: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8ed',
    backgroundColor: '#fff',
  },
  footerGhostText: { fontSize: 12, fontWeight: '700', color: '#39505c' },
});
