import { StyleSheet, Text, View } from 'react-native';

/**
 * Etiqueta visual obligatoria para cualquier dato simulado, siguiendo la
 * política de datos: nunca presentar un valor simulado como si fuera un
 * dato oficial en tiempo real.
 */
export function SimulatedTag({ label = 'Simulado' }: { label?: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>● {label}</Text>
    </View>
  );
}

export function VerifiedTag({ verified }: { verified: boolean }) {
  return (
    <View style={[styles.tag, verified ? styles.verifiedTag : styles.pendingTag]}>
      <Text style={[styles.text, verified ? styles.verifiedText : styles.pendingText]}>
        {verified ? '✓ Verificado' : '! Por verificar'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  text: { fontSize: 11, fontWeight: '700', color: '#b26a00' },
  verifiedTag: { backgroundColor: '#e8f5e9' },
  pendingTag: { backgroundColor: '#fff3e0' },
  verifiedText: { color: '#2e7d32' },
  pendingText: { color: '#b26a00' },
});
