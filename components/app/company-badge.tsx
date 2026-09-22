import { StyleSheet, Text, View } from 'react-native';

import { Company } from '@/data/types';

/**
 * Muestra la empresa que opera una ruta con un indicador claro de si está
 * verificada o pendiente de verificar, para nunca presentar un dato
 * simulado/no confirmado como si fuera oficial.
 */
export function CompanyBadge({ company, compact = false }: { company: Company; compact?: boolean }) {
  return (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: company.color }]}>
        <Text style={styles.avatarText}>{company.initials}</Text>
      </View>
      <View style={styles.textCol}>
        <Text style={[styles.name, compact && styles.nameCompact]}>{company.name}</Text>
        {!compact && (
          <Text style={[styles.status, company.verified ? styles.verified : styles.unverified]}>
            {company.status === 'activa' ? 'Empresa verificada' : 'Rutas por verificar'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 13 },
  textCol: { flexShrink: 1 },
  name: { fontWeight: '700', fontSize: 15 },
  nameCompact: { fontSize: 13 },
  status: { fontSize: 12, marginTop: 2 },
  verified: { color: '#2e7d32' },
  unverified: { color: '#b26a00' },
});
