import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SimulatedTag } from '@/components/app/simulated-tag';
import { initialNotifications } from '@/data/notifications';
import { AppNotification, NotificationKind } from '@/data/types';

const KIND_CONFIG: Record<NotificationKind, { icon: keyof typeof Ionicons.glyphMap; color: string; label: string }> = {
  retraso: { icon: 'time', color: '#c62828', label: 'Retraso' },
  cambio: { icon: 'swap-horizontal', color: '#b26a00', label: 'Cambio' },
  novedad: { icon: 'alert-circle', color: '#6a1b9a', label: 'Novedad' },
  llegada: { icon: 'checkmark-circle', color: '#2e7d32', label: 'Llegada próxima' },
};

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(1, Math.round(diffMs / 60000));
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  return `hace ${hours} h`;
}

function NotificationCard({ item }: { item: AppNotification }) {
  const cfg = KIND_CONFIG[item.kind];
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconWrap, { backgroundColor: cfg.color }]}>
          <Ionicons name={cfg.icon} size={16} color="#fff" />
        </View>
        <Text style={styles.kindLabel}>{cfg.label}</Text>
        <Text style={styles.time}>{timeAgo(item.createdAt)}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardMessage}>{item.message}</Text>
      <SimulatedTag label="Notificación simulada" />
    </View>
  );
}

export default function AlertsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Avisos</Text>
        <Text style={styles.subtitle}>
          Retrasos, cambios, novedades y llegadas próximas. Todo simulado.
        </Text>
      </View>
      <FlatList
        data={initialNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <NotificationCard item={item} />}
        ListEmptyComponent={<Text style={styles.empty}>No hay avisos por ahora.</Text>}
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconWrap: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  kindLabel: { fontWeight: '700', fontSize: 12, color: '#11181C', flex: 1 },
  time: { fontSize: 11, color: '#9aa5ab' },
  cardTitle: { fontWeight: '700', fontSize: 15, color: '#11181C' },
  cardMessage: { fontSize: 13, color: '#5b6770', lineHeight: 18 },
  empty: { textAlign: 'center', color: '#5b6770', marginTop: 40 },
});
