import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteBadge } from '@/components/app/route-badge';
import { SearchBar } from '@/components/app/search-bar';
import { SimulatedTag } from '@/components/app/simulated-tag';
import { getScheduleForRoute } from '@/data/schedules';
import { searchRoutes } from '@/data/routes';

export default function SchedulesScreen() {
  const [query, setQuery] = React.useState('');
  const results = React.useMemo(() => searchRoutes(query), [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#11181C" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Horarios</Text>
        <Text style={styles.subtitle}>Franjas de demostración organizadas por ruta</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar ruta..." />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const schedule = getScheduleForRoute(item.id);
          return (
            <View style={styles.card}>
              <RouteBadge route={item} size="sm" />
              {schedule?.entries.map((entry) => (
                <View key={entry.day} style={styles.row}>
                  <Text style={styles.day}>{entry.day}</Text>
                  <Text style={styles.value}>
                    {entry.firstDeparture} - {entry.lastDeparture} · cada {entry.frequencyMinutes} min
                  </Text>
                </View>
              ))}
              <SimulatedTag label="Horario simulado" />
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 20, paddingBottom: 0 },
  backText: { fontSize: 14, color: '#11181C', fontWeight: '600' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, gap: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770' },
  list: { paddingHorizontal: 20, paddingBottom: 30, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  day: { fontSize: 12, fontWeight: '700', color: '#11181C', textTransform: 'capitalize' },
  value: { fontSize: 12, color: '#5b6770' },
});
