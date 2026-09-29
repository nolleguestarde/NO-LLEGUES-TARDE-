import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ManizalesMap } from '@/components/app/manizales-map';
import { featuresToMarkers, routeToPayload } from '@/components/app/map-payload';
import { RouteCard } from '@/components/app/route-card';
import { VerifiedTag } from '@/components/app/simulated-tag';
import { featureIdForPlace, getFeatureById } from '@/data/map';
import { getPlaceById } from '@/data/places';
import { getRoutesForPlace } from '@/data/routes';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const place = getPlaceById(id ?? '');
  const placeRoutes = place ? getRoutesForPlace(place.id) : [];
  // El marcador del mapa se deriva del mismo lugar (sin duplicar datos).
  const feature = place ? getFeatureById(featureIdForPlace(place.id)) : undefined;

  if (!place) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Lugar no encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#11181C" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.subtitle}>{place.city}, Colombia · {place.category}</Text>
        <VerifiedTag verified={place.verified} />
      </View>

      <View style={styles.mapWrap}>
        <ManizalesMap
          data={{
            // Mismo lugar, mismos datos que la lista: solo se proyecta al mapa.
            markers: feature ? featuresToMarkers([feature], { actionLabel: null }) : [],
            // Recorridos de las rutas que pasan por este lugar.
            routes: placeRoutes.slice(0, 6).map((r) => routeToPayload(r)),
            buses: [],
            focus: { ...place.coordinates, zoom: 15 },
            fitToContent: false,
            openMarkerId: feature?.id ?? null,
          }}
          onSelectRoute={(routeId) => router.push(`/route/${routeId}`)}
          onMarkerAction={(routeId) => router.push(`/route/${routeId}`)}
        />
      </View>

      <TouchableOpacity
        style={styles.mapLink}
        onPress={() =>
          router.push({ pathname: '/(tabs)/map', params: { focus: featureIdForPlace(place.id) } })
        }>
        <Ionicons name="map" size={16} color="#0a7ea4" />
        <Text style={styles.mapLinkText}>Ver este lugar en el mapa completo</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Rutas que pasan por aquí ({placeRoutes.length})</Text>
      <FlatList
        data={placeRoutes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <RouteCard route={item} />}
        ListEmptyComponent={<Text style={styles.note}>No hay rutas verificadas registradas para este lugar.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 20, paddingBottom: 0 },
  backText: { fontSize: 14, color: '#11181C', fontWeight: '600' },
  header: { paddingHorizontal: 20, paddingTop: 10, gap: 6 },
  title: { fontSize: 22, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770', textTransform: 'capitalize' },
  mapWrap: { height: 200, marginHorizontal: 20, marginTop: 12, borderRadius: 16, overflow: 'hidden' },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 10,
    backgroundColor: '#eef6fb',
    borderRadius: 10,
  },
  mapLinkText: { fontSize: 13, fontWeight: '700', color: '#0a7ea4' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#11181C', paddingHorizontal: 20, marginTop: 14, marginBottom: 6 },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  note: { textAlign: 'center', color: '#5b6770', marginTop: 10 },
  notFound: { textAlign: 'center', marginTop: 60, color: '#5b6770' },
});
