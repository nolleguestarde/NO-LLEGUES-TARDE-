import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompanyBadge } from '@/components/app/company-badge';
import { ManizalesMap } from '@/components/app/manizales-map';
import { OccupancyBadge } from '@/components/app/occupancy-badge';
import { RouteBadge } from '@/components/app/route-badge';
import { SimulatedTag, VerifiedTag } from '@/components/app/simulated-tag';
import { getCompanyById } from '@/data/companies';
import { getPlaceById } from '@/data/places';
import { getRouteById } from '@/data/routes';
import { getScheduleForRoute } from '@/data/schedules';
import { getStopById } from '@/data/stops';
import { useSimulatedBuses } from '@/hooks/use-simulated-buses';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const route = getRouteById(id ?? '');

  const buses = useSimulatedBuses(route, 2);

  if (!route) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Ruta no encontrada.</Text>
      </SafeAreaView>
    );
  }

  const company = getCompanyById(route.companyId);
  const schedule = getScheduleForRoute(route.id);
  const stopEntities = route.stopIds.map((sid) => getStopById(sid)).filter(Boolean);
  const placeEntities = route.placeIds.map((pid) => getPlaceById(pid)).filter(Boolean);
  const routePath = [...stopEntities, ...placeEntities].map((e) => e!.coordinates);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#11181C" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <View style={styles.headerRow}>
          <RouteBadge route={route} size="lg" />
          <VerifiedTag verified={route.verified} />
        </View>

        {company && (
          <View style={styles.section}>
            <CompanyBadge company={company} />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>Origen</Text>
          <Text style={styles.value}>{route.origin}</Text>
          <Text style={styles.label}>Destino</Text>
          <Text style={styles.value}>{route.destination}</Text>
          {route.note && <Text style={styles.note}>{route.note}</Text>}
        </View>

        <View style={styles.mapWrap}>
          <ManizalesMap
            routePath={routePath}
            places={placeEntities.map((p) => ({ id: p!.id, coordinate: p!.coordinates, title: p!.name }))}
            stops={stopEntities.map((s) => ({ id: s!.id, coordinate: s!.coordinates, title: s!.name }))}
            buses={buses.map((b) => ({ id: b.id, coordinate: b.simulatedLocation, title: `Buseta ${b.plate}` }))}
          />
        </View>

        <Text style={styles.sectionTitle}>Busetas simuladas</Text>
        {buses.map((bus) => (
          <View key={bus.id} style={styles.busCard}>
            <View style={styles.busRow}>
              <Ionicons name="bus" size={18} color="#0a7ea4" />
              <Text style={styles.busPlate}>{bus.plate}</Text>
              <Text style={styles.busArrival}>{bus.estimatedArrivalMinutes} min</Text>
            </View>
            <OccupancyBadge level={bus.occupancy} />
            <SimulatedTag label="Posición y llegada simuladas" />
          </View>
        ))}

        <Text style={styles.sectionTitle}>Paraderos y puntos de despacho</Text>
        {stopEntities.length === 0 ? (
          <Text style={styles.note}>Sin paraderos verificados registrados para esta ruta.</Text>
        ) : (
          stopEntities.map((s) => (
            <View key={s!.id} style={styles.listItem}>
              <Ionicons name="location" size={16} color="#e65100" />
              <Text style={styles.listItemText}>{s!.name}</Text>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Lugares por los que pasa</Text>
        {placeEntities.map((p) => (
          <TouchableOpacity key={p!.id} style={styles.listItem} onPress={() => router.push(`/place/${p!.id}`)}>
            <Ionicons name="pin" size={16} color="#0a7ea4" />
            <Text style={styles.listItemText}>{p!.name}</Text>
          </TouchableOpacity>
        ))}

        {schedule && (
          <>
            <Text style={styles.sectionTitle}>Horarios de demostración</Text>
            {schedule.entries.map((entry) => (
              <View key={entry.day} style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>{entry.day}</Text>
                <Text style={styles.scheduleValue}>
                  {entry.firstDeparture} - {entry.lastDeparture} · cada {entry.frequencyMinutes} min
                </Text>
              </View>
            ))}
            <SimulatedTag label="Horario simulado (franjas de demostración)" />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  container: { padding: 20, paddingBottom: 40, gap: 10 },
  notFound: { textAlign: 'center', marginTop: 60, color: '#5b6770' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  backText: { fontSize: 14, color: '#11181C', fontWeight: '600' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  section: { gap: 4, backgroundColor: '#fff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#eef1f3' },
  label: { fontSize: 11, color: '#9aa5ab', marginTop: 6, textTransform: 'uppercase', fontWeight: '700' },
  value: { fontSize: 14, color: '#11181C', fontWeight: '600' },
  note: { fontSize: 12, color: '#b26a00', marginTop: 6, fontStyle: 'italic' },
  mapWrap: { height: 260, borderRadius: 16, overflow: 'hidden' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginTop: 14, color: '#11181C' },
  busCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  busRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  busPlate: { fontWeight: '700', fontSize: 14, flex: 1, color: '#11181C' },
  busArrival: { fontWeight: '800', fontSize: 14, color: '#0a7ea4' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  listItemText: { fontSize: 13, color: '#11181C', flex: 1 },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  scheduleDay: { fontWeight: '700', fontSize: 13, color: '#11181C', textTransform: 'capitalize' },
  scheduleValue: { fontSize: 12, color: '#5b6770' },
});

