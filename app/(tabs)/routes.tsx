import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteCard } from '@/components/app/route-card';
import { SearchBar } from '@/components/app/search-bar';
import { searchRoutes } from '@/data/routes';

export default function RoutesScreen() {
  const [query, setQuery] = React.useState('');
  const results = React.useMemo(() => searchRoutes(query), [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Rutas</Text>
        <Text style={styles.subtitle}>{results.length} rutas de Socobuses en Manizales</Text>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Buscar por número, origen o destino..." />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <RouteCard route={item} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No se encontraron rutas para “{query}”.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, gap: 10 },
  title: { fontSize: 26, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770' },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  empty: { textAlign: 'center', color: '#5b6770', marginTop: 40 },
});
