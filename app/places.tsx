import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SearchBar } from '@/components/app/search-bar';
import { searchPlaces } from '@/data/places';

export default function PlacesScreen() {
  const [query, setQuery] = React.useState('');
  const results = React.useMemo(() => searchPlaces(query), [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Lugares</Text>
        <Text style={styles.subtitle}>Busca un lugar de Manizales y ve las rutas que pasan por él</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Ej. Parque Caldas, Chipre..." />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            onPress={() => router.push(`/place/${item.id}`)}>
            <Ionicons name="location" size={20} color="#0a7ea4" />
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>
                {item.routeIds.length} ruta{item.routeIds.length === 1 ? '' : 's'} pasan por aquí
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9aa5ab" />
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No se encontraron lugares para “{query}”.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, gap: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770' },
  list: { paddingHorizontal: 20, paddingBottom: 30, gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  pressed: { opacity: 0.7 },
  cardTextCol: { flex: 1 },
  cardTitle: { fontWeight: '700', fontSize: 14, color: '#11181C' },
  cardSubtitle: { fontSize: 12, color: '#5b6770', marginTop: 2 },
  empty: { textAlign: 'center', color: '#5b6770', marginTop: 40 },
});
