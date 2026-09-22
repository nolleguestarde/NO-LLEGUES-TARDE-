import { StyleSheet, Text, View } from 'react-native';

import { OccupancyLevel } from '@/data/types';

const CONFIG: Record<OccupancyLevel, { label: string; color: string; bg: string }> = {
  baja: { label: 'Ocupación baja', color: '#2e7d32', bg: '#e8f5e9' },
  media: { label: 'Ocupación media', color: '#b26a00', bg: '#fff3e0' },
  alta: { label: 'Ocupación alta', color: '#c62828', bg: '#ffebee' },
};

export function OccupancyBadge({ level }: { level: OccupancyLevel }) {
  const cfg = CONFIG[level];
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: { fontSize: 11, fontWeight: '700' },
});
