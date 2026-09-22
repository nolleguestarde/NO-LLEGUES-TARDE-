import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteCard } from '@/components/app/route-card';
import { SearchBar } from '@/components/app/search-bar';
import { searchPlaces } from '@/data/places';
import { searchRoutes } from '@/data/routes';
import { Place, Route } from '@/data/types';

type ResultItem =
  | { key: string; kind: 'header'; label: string }
  | { key: string; kind: 'place'; place: Place }
  | { key: string; kind: 'route'; route: Route };

export default function SearchScreen() {
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = React.useState(params.q ?? '');

  const routeResults = React.useMemo(() => (query ? searchRoutes(query) : []), [query]);
  const placeResults = React.useMemo(() => (query ? searchPlaces(query) : []), [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#11181C" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Buscar</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Destino o número de ruta..." />
      </View>

      {query.length === 0 ? (
        <Text style={styles.hint}>Escribe un lugar (ej. “Chipre”) o un número de ruta (ej. “603”).</Text>
      ) : (
        <FlatList<ResultItem>
          data={[
            { key: 'places-title', kind: 'header' as const, label: `Lugares (${placeResults.length})` },
            ...placeResults.map((p): ResultItem => ({ key: `place-${p.id}`, kind: 'place', place: p })),
            { key: 'routes-title', kind: 'header' as const, label: `Rutas (${routeResults.length})` },
            ...routeResults.map((r): ResultItem => ({ key: `route-${r.id}`, kind: 'route', route: r })),
          ]}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            if (item.kind === 'header') {
              return <Text style={styles.sectionTitle}>{item.label}</Text>;
            }
            if (item.kind === 'place') {
              return (
                <Pressable style={styles.placeRow} onPress={() => router.push(`/place/${item.place.id}`)}>
                  <Ionicons name="location" size={18} color="#0a7ea4" />
                  <Text style={styles.placeText}>{item.place.name}</Text>
                </Pressable>
              );
            }
            return <RouteCard route={item.route} />;
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 20, paddingBottom: 0 },
  backText: { fontSize: 14, color: '#11181C', fontWeight: '600' },
  header: { padding: 20, paddingBottom: 10, gap: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#11181C' },
  hint: { textAlign: 'center', color: '#5b6770', marginTop: 30, paddingHorizontal: 30 },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#11181C', marginTop: 12, marginBottom: 6 },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef1f3',
    marginBottom: 8,
  },
  placeText: { fontSize: 13, color: '#11181C' },
});
