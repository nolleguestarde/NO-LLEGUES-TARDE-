import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CompanyBadge } from '@/components/app/company-badge';
import { RouteBadge } from '@/components/app/route-badge';
import { getCompanyById } from '@/data/companies';
import { Route } from '@/data/types';
import { generateSimulatedBuses } from '@/data/buses';
import { SimulatedTag } from '@/components/app/simulated-tag';

export function RouteCard({ route }: { route: Route }) {
  const company = getCompanyById(route.companyId);
  const buses = generateSimulatedBuses(route, 1);
  const nextArrival = buses[0]?.estimatedArrivalMinutes;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/route/${route.id}`)}>
      <View style={styles.headerRow}>
        <RouteBadge route={route} />
        <View style={styles.arrivalCol}>
          <Text style={styles.arrivalValue}>{nextArrival} min</Text>
          <SimulatedTag label="Simulado" />
        </View>
      </View>

      {company && <CompanyBadge company={company} compact />}

      <View style={styles.originDestRow}>
        <Text style={styles.originDest} numberOfLines={1}>
          {route.origin}
        </Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.originDest} numberOfLines={1}>
          {route.destination}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#eef1f3',
    marginBottom: 12,
  },
  pressed: { opacity: 0.7 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  arrivalCol: { alignItems: 'flex-end', gap: 4 },
  arrivalValue: { fontWeight: '800', fontSize: 16, color: '#0a7ea4' },
  originDestRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  originDest: { flex: 1, fontSize: 12, color: '#5b6770' },
  arrow: { color: '#9aa5ab' },
});
