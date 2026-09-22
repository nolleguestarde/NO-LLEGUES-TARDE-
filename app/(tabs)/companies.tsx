import { router } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CompanyBadge } from '@/components/app/company-badge';
import { companies } from '@/data/companies';
import { getRoutesForCompany } from '@/data/routes';

export default function CompaniesScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Empresas</Text>
        <Text style={styles.subtitle}>Operadores de transporte colectivo de Manizales</Text>
      </View>
      <FlatList
        data={companies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const routeCount = getRoutesForCompany(item.id).length;
          return (
            <Pressable
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() => router.push(`/company/${item.id}`)}>
              <CompanyBadge company={item} />
              <Text style={styles.routeCount}>
                {routeCount > 0
                  ? `${routeCount} rutas verificadas registradas`
                  : 'Rutas por verificar en esta app'}
              </Text>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12, gap: 6 },
  title: { fontSize: 26, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770' },
  list: { paddingHorizontal: 20, paddingBottom: 30, gap: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#eef1f3',
  },
  pressed: { opacity: 0.7 },
  routeCount: { fontSize: 12, color: '#5b6770' },
});
