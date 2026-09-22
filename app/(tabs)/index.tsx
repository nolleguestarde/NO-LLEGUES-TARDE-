import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/app/search-bar';
import { companies } from '@/data/companies';
import { routes } from '@/data/routes';

const ACTIONS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  href: '/routes' | '/map' | '/places' | '/schedules' | '/(tabs)/alerts' | '/reports';
  color: string;
}[] = [
  { icon: 'navigate', label: 'Buscar destino', description: 'Encuentra lugares y sus rutas', href: '/places', color: '#0a7ea4' },
  { icon: 'bus', label: 'Buscar ruta', description: 'Por número de ruta', href: '/routes', color: '#2e7d32' },
  { icon: 'list', label: 'Ver rutas', description: 'Todas las rutas de Manizales', href: '/routes', color: '#6a1b9a' },
  { icon: 'map', label: 'Ver mapa', description: 'Recorridos sobre el mapa', href: '/map', color: '#e65100' },
  { icon: 'time', label: 'Horarios', description: 'Franjas de servicio', href: '/schedules', color: '#00838f' },
  { icon: 'notifications', label: 'Avisos', description: 'Novedades simuladas', href: '/(tabs)/alerts', color: '#ad1457' },
  { icon: 'alert-circle', label: 'Reportar novedad', description: 'Retraso, desvío, etc.', href: '/reports', color: '#c62828' },
];

export default function HomeScreen() {
  const [query, setQuery] = React.useState('');

  const submitSearch = () => {
    if (query.trim()) {
      router.push({ pathname: '/search', params: { q: query.trim() } });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Manizales, Caldas</Text>
          <Text style={styles.title}>NO LLEGUES TARDE</Text>
          <Text style={styles.subtitle}>
            Transporte público colectivo de Manizales: rutas, paraderos, horarios y busetas
            simuladas en un solo lugar.
          </Text>
        </View>

        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar destino o número de ruta..." />
        <TouchableOpacity style={styles.searchButton} onPress={submitSearch}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{routes.length}</Text>
            <Text style={styles.statLabel}>Rutas registradas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{companies.length}</Text>
            <Text style={styles.statLabel}>Empresas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Socobuses</Text>
            <Text style={styles.statLabel}>Rutas verificadas</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        <View style={styles.grid}>
          {ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionCard}
              onPress={() => router.push(action.href)}>
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon} size={20} color="#fff" />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.notice}>
          <Ionicons name="information-circle" size={18} color="#0a7ea4" />
          <Text style={styles.noticeText}>
            Esta versión usa datos simulados de posición, ocupación, tiempos y notificaciones.
            Las empresas, lugares y rutas de Socobuses referenciadas están verificadas con
            información pública.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  container: { padding: 20, paddingBottom: 40, gap: 14 },
  hero: { gap: 6, marginBottom: 6 },
  kicker: { color: '#0a7ea4', fontWeight: '700', fontSize: 12, letterSpacing: 1 },
  title: { fontSize: 30, fontWeight: '900', color: '#11181C' },
  subtitle: { color: '#5b6770', fontSize: 14, lineHeight: 20 },
  searchButton: { backgroundColor: '#0a7ea4', borderRadius: 14, paddingVertical: 12, alignItems: 'center' },
  searchButtonText: { color: '#fff', fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  statValue: { fontWeight: '800', fontSize: 16, color: '#11181C' },
  statLabel: { fontSize: 11, color: '#5b6770', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '800', marginTop: 10, color: '#11181C' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard: {
    width: '47.5%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  actionIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontWeight: '700', fontSize: 14, color: '#11181C' },
  actionDescription: { fontSize: 11, color: '#5b6770' },
  notice: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#eef6fb',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
  },
  noticeText: { flex: 1, fontSize: 12, color: '#39505c', lineHeight: 17 },
});

