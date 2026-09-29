import React from 'react';
import { StyleSheet, View } from 'react-native';

import { buildLeafletHtml, MapDataPayload, MapOutgoingMessage } from './leaflet-map-html';

export type { MapDataPayload } from './leaflet-map-html';

export interface ManizalesMapProps {
  data: MapDataPayload;
  onSelectMarker?: (id: string) => void;
  onMarkerAction?: (id: string) => void;
  onSelectRoute?: (id: string) => void;
  style?: object;
}

/**
 * Mapa interactivo de Manizales para Expo Web.
 *
 * Usa exactamente el mismo documento Leaflet + OpenStreetMap que la versión
 * nativa (`leaflet-map-html.ts`), pero dentro de un <iframe> porque
 * react-native-webview no está disponible en web. Así web y móvil muestran
 * el mismo mapa real, con los mismos datos y sin costo ni API key.
 */
export function ManizalesMap({
  data,
  onSelectMarker,
  onMarkerAction,
  onSelectRoute,
  style,
}: ManizalesMapProps) {
  const frameRef = React.useRef<HTMLIFrameElement | null>(null);
  const readyRef = React.useRef(false);
  const dataRef = React.useRef(data);
  dataRef.current = data;

  const html = React.useMemo(() => buildLeafletHtml(data), []); // eslint-disable-line react-hooks/exhaustive-deps

  const post = React.useCallback((payload: MapDataPayload) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ type: 'data', data: payload }),
      '*'
    );
  }, []);

  React.useEffect(() => {
    if (readyRef.current) post(data);
  }, [data, post]);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (typeof event.data !== 'string') return;
      let message: MapOutgoingMessage;
      try {
        message = JSON.parse(event.data) as MapOutgoingMessage;
      } catch {
        return;
      }
      if (message.type === 'ready') {
        readyRef.current = true;
        post(dataRef.current);
        return;
      }
      if (message.type === 'marker-press') onSelectMarker?.(message.id);
      if (message.type === 'marker-action') onMarkerAction?.(message.id);
      if (message.type === 'route-press') onSelectRoute?.(message.id);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [post, onSelectMarker, onMarkerAction, onSelectRoute]);

  return (
    <View style={[styles.container, style]}>
      <iframe
        ref={frameRef}
        title="Mapa de Manizales"
        srcDoc={html}
        style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, minHeight: 200, backgroundColor: '#e8eef2', overflow: 'hidden' },
});

