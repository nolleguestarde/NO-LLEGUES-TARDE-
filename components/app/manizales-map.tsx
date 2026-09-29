import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { buildLeafletHtml, MapDataPayload, MapOutgoingMessage } from './leaflet-map-html';

export type { MapDataPayload } from './leaflet-map-html';

export interface ManizalesMapProps {
  /** Marcadores, rutas y busetas a pintar (derivados de data/map.ts) */
  data: MapDataPayload;
  onSelectMarker?: (id: string) => void;
  onMarkerAction?: (id: string) => void;
  onSelectRoute?: (id: string) => void;
  style?: object;
}

/**
 * Mapa interactivo de Manizales para Android/iOS.
 *
 * Implementación: Leaflet + tiles de OpenStreetMap dentro de un WebView
 * (`react-native-webview`, incluido en Expo Go según la documentación de
 * Expo SDK 54). Es totalmente gratuito: sin API key, sin tarjeta y sin
 * facturación. La misma implementación funciona en web
 * (ver `manizales-map.web.tsx`).
 */
export function ManizalesMap({
  data,
  onSelectMarker,
  onMarkerAction,
  onSelectRoute,
  style,
}: ManizalesMapProps) {
  const webRef = React.useRef<WebView>(null);
  const readyRef = React.useRef(false);
  const dataRef = React.useRef(data);
  dataRef.current = data;
  const [loading, setLoading] = React.useState(true);

  // El HTML se construye una sola vez con los datos iniciales; las
  // actualizaciones posteriores viajan por postMessage (sin recargar).
  const html = React.useMemo(() => buildLeafletHtml(data), []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (!readyRef.current) return;
    webRef.current?.postMessage(JSON.stringify({ type: 'data', data }));
  }, [data]);

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    let message: MapOutgoingMessage;
    try {
      message = JSON.parse(event.nativeEvent.data) as MapOutgoingMessage;
    } catch {
      return;
    }
    if (message.type === 'ready') {
      readyRef.current = true;
      setLoading(false);
      webRef.current?.postMessage(JSON.stringify({ type: 'data', data: dataRef.current }));
      return;
    }
    if (message.type === 'marker-press') onSelectMarker?.(message.id);
    if (message.type === 'marker-action') onMarkerAction?.(message.id);
    if (message.type === 'route-press') onSelectRoute?.(message.id);
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webRef}
        style={styles.web}
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://tile.openstreetmap.org' }}
        javaScriptEnabled
        domStorageEnabled
        onMessage={handleMessage}
        setSupportMultipleWindows={false}
        androidLayerType="hardware"
        mixedContentMode="always"
        allowsInlineMediaPlayback
      />
      {loading && (
        <View style={styles.loading} pointerEvents="none">
          <ActivityIndicator color="#0a7ea4" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 200, backgroundColor: '#e8eef2', overflow: 'hidden' },
  web: { flex: 1, backgroundColor: 'transparent' },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

