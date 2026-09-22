import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SimulatedTag } from '@/components/app/simulated-tag';
import { createReport, initialReports, REPORT_TYPE_LABELS } from '@/data/reports';
import { ReportItem, ReportType } from '@/data/types';

const TYPES: ReportType[] = ['retraso', 'desvio', 'cambio_ruta', 'problema_servicio', 'buseta_llena', 'otra'];

export default function ReportsScreen() {
  const [type, setType] = React.useState<ReportType>('retraso');
  const [description, setDescription] = React.useState('');
  const [reports, setReports] = React.useState<ReportItem[]>(initialReports);

  const submit = () => {
    if (!description.trim()) {
      Alert.alert('Falta descripción', 'Escribe una breve descripción de la novedad.');
      return;
    }
    const report = createReport(type, description.trim());
    setReports((prev) => [report, ...prev]);
    setDescription('');
    Alert.alert('Reporte enviado', 'Tu reporte simulado fue registrado. Gracias por avisar.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color="#11181C" />
        <Text style={styles.backText}>Volver</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Reportar novedad</Text>
        <Text style={styles.subtitle}>
          Este formulario guarda el reporte de forma simulada en esta sesión. En el futuro se
          conectará a un backend real.
        </Text>

        <Text style={styles.label}>Tipo de novedad</Text>
        <View style={styles.typeGrid}>
          {TYPES.map((t) => {
            const active = t === type;
            return (
              <TouchableOpacity
                key={t}
                style={[styles.typeChip, active && styles.typeChipActive]}
                onPress={() => setType(t)}>
                <Text style={[styles.typeChipText, active && styles.typeChipTextActive]}>
                  {REPORT_TYPE_LABELS[t]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.input}
          placeholder="Cuéntanos qué pasó..."
          placeholderTextColor="#9aa5ab"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity style={styles.submitButton} onPress={submit}>
          <Text style={styles.submitText}>Enviar reporte</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Reportes recientes</Text>
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.reportCard}>
              <Text style={styles.reportType}>{REPORT_TYPE_LABELS[item.type]}</Text>
              <Text style={styles.reportDescription}>{item.description}</Text>
              <SimulatedTag label="Reporte simulado" />
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f7fa' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 20, paddingBottom: 0 },
  backText: { fontSize: 14, color: '#11181C', fontWeight: '600' },
  container: { padding: 20, paddingBottom: 40, gap: 10 },
  title: { fontSize: 24, fontWeight: '900', color: '#11181C' },
  subtitle: { fontSize: 13, color: '#5b6770', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '700', color: '#11181C', marginTop: 8 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8ed',
  },
  typeChipActive: { backgroundColor: '#0a7ea4', borderColor: '#0a7ea4' },
  typeChipText: { fontSize: 12, fontWeight: '600', color: '#39505c' },
  typeChipTextActive: { color: '#fff' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8ed',
    padding: 12,
    minHeight: 90,
    fontSize: 14,
    color: '#11181C',
    textAlignVertical: 'top',
  },
  submitButton: { backgroundColor: '#0a7ea4', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '700' },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: '#11181C', marginTop: 14, marginBottom: 4 },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: '#eef1f3',
    marginBottom: 10,
  },
  reportType: { fontWeight: '700', fontSize: 13, color: '#11181C' },
  reportDescription: { fontSize: 12, color: '#5b6770' },
});

