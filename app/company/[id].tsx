import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteCard } from '@/components/app/route-card';
import { VerifiedTag } from '@/components/app/simulated-tag';
import { getCompanyById } from '@/data/companies';
import { getRoutesForCompany } from '@/data/routes';

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const company = getCompanyById(id ?? '');
  const companyRoutes = company ? getRoutesForCompany(company.id) : [];

  if (!company) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Empresa no encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#11181C" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <View style={styles.headerCard}>
        <View style={[styles.avatar, { backgroundColor: company.color }]}>
          <Text style={styles.avatarText}>{company.initials}</Text>
        </View>
        <Text style={styles.name}>{company.name}</Text>
        <Text style={styles.city}>{company.city}, Colombia</Text>
        <VerifiedTag verified={company.status === 'activa'} />
        <Text style={styles.description}>{company.description}</Text>
      </View>

      <Text style={styles.sectionTitle}>
        {companyRoutes.length > 0
          ? `Rutas verificadas (${companyRoutes.length})`
          : 'Sin rutas verificadas registradas todavía'}
      </Text>

      <FlatList
        data={companyRoutes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <RouteCard route={item} />}
        ListEmptyComponent={
          <Text style={styles.note}>
            Esta empresa opera en Manizales, pero sus rutas específicas todavía no han sido
            verificadas con una fuente oficial dentro de esta app.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 20, paddingBottom: 0 },
  backText: { fontSize: 14, color: '#11181C', fontWeight: '600' },
  headerCard: { alignItems: 'center', padding: 20, gap: 6 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  name: { fontSize: 20, fontWeight: '900', color: '#11181C' },
  city: { fontSize: 13, color: '#5b6770' },
  description: { fontSize: 13, color: '#5b6770', textAlign: 'center', marginTop: 6, lineHeight: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#11181C', paddingHorizontal: 20, marginBottom: 6 },
  list: { paddingHorizontal: 20, paddingBottom: 30 },
  note: { textAlign: 'center', color: '#5b6770', marginTop: 10, fontSize: 13, lineHeight: 18 },
  notFound: { textAlign: 'center', marginTop: 60, color: '#5b6770' },
});
