import { StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { Route } from '@/data/types';

/**
 * Insignia visual compacta de una ruta: número + sentido (IDA/REGRESO).
 * Reutilizable en listas, tarjetas y detalle.
 */
export function RouteBadge({ route, size = 'md' }: { route: Route; size?: 'sm' | 'md' | 'lg' }) {
  const isIda = route.direction === 'IDA';
  return (
    <View style={[styles.badge, size === 'lg' && styles.badgeLg, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.number, size === 'lg' && styles.numberLg]}>{route.number}</Text>
      <View style={[styles.pill, isIda ? styles.pillIda : styles.pillRegreso]}>
        <Text style={styles.pillText}>{route.direction}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#eef6fb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  badgeSm: { paddingHorizontal: 8, paddingVertical: 4, gap: 6 },
  badgeLg: { paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  number: {
    fontWeight: '800',
    fontSize: 16,
    color: Colors.light.tint,
  },
  numberLg: { fontSize: 22 },
  pill: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pillIda: { backgroundColor: '#0a7ea4' },
  pillRegreso: { backgroundColor: '#f59e0b' },
  pillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
