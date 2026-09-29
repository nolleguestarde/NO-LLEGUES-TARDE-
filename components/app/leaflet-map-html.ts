import { MANIZALES_CENTER } from '@/data/manizales';
import { Coordinates } from '@/data/types';

/**
 * Generador del documento HTML del mapa (Leaflet + OpenStreetMap).
 * ------------------------------------------------------------------
 * ¿Por qué Leaflet y no react-native-maps?
 * Según la documentación de Expo SDK 54, `react-native-maps` solo soporta
 * Android e iOS (no web) y, para builds reales, exige una API key de Google
 * Maps que este proyecto no tiene configurada — de ahí que el mapa saliera
 * en blanco. Leaflet + tiles de OpenStreetMap funciona igual en Android,
 * iOS (dentro de react-native-webview) y en Expo Web (dentro de un iframe),
 * sin API key.
 *
 * Este archivo SOLO construye el HTML/JS del lienzo del mapa. Los datos
 * (lugares, paraderos y rutas) llegan desde `data/map.ts`, que a su vez los
 * deriva de places.ts / stops.ts / routes.ts.
 */

export interface MapMarkerPayload {
  id: string;
  lat: number;
  lng: number;
  /** Icono mostrado dentro del pin */
  emoji: string;
  color: string;
  title: string;
  /** Categoría legible ("Paraderos", "Parques"...) */
  category: string;
  /** Líneas extra del globo de información */
  lines?: string[];
  /** Texto del botón de acción del globo (si aplica) */
  actionLabel?: string;
  /** true = resaltado (favorito / resultado de búsqueda / selección) */
  highlighted?: boolean;
}

export interface MapRoutePayload {
  id: string;
  color: string;
  label: string;
  path: Coordinates[];
  /** Grosor extra cuando la ruta está seleccionada */
  active?: boolean;
  lines?: string[];
}

export interface MapBusPayload {
  id: string;
  lat: number;
  lng: number;
  title: string;
  color: string;
}

export interface MapDataPayload {
  markers: MapMarkerPayload[];
  routes: MapRoutePayload[];
  buses: MapBusPayload[];
  /** Centra el mapa en estas coordenadas cuando cambia */
  focus?: { latitude: number; longitude: number; zoom?: number } | null;
  /** Encuadra automáticamente todo el contenido visible */
  fitToContent?: boolean;
  /** ID del marcador cuyo globo debe abrirse */
  openMarkerId?: string | null;
}

export const EMPTY_MAP_DATA: MapDataPayload = {
  markers: [],
  routes: [],
  buses: [],
  fitToContent: false,
};

/** Mensajes que el mapa envía de vuelta a React Native / React. */
export type MapOutgoingMessage =
  | { type: 'ready' }
  | { type: 'marker-press'; id: string }
  | { type: 'marker-action'; id: string }
  | { type: 'route-press'; id: string };

const HEAD = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>Mapa de Manizales</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body { margin: 0; padding: 0; height: 100%; width: 100%; background: #e8eef2; -webkit-tap-highlight-color: transparent; }
  #map { position: absolute; top: 0; right: 0; bottom: 0; left: 0; height: 100%; width: 100%; }
  .nlt-pin {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg); border: 2px solid #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,.35); font-size: 14px;
    cursor: pointer;
  }
  .nlt-pin > span { transform: rotate(45deg); }
  .nlt-pin.nlt-highlight { box-shadow: 0 0 0 4px rgba(255,193,7,.85), 0 2px 5px rgba(0,0,0,.35); }
  .nlt-bus {
    display: flex; align-items: center; justify-content: center;
    width: 26px; height: 26px; border-radius: 50%; border: 2px solid #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,.35); font-size: 13px;
    cursor: pointer;
  }
  .leaflet-popup-content { margin: 10px 12px; font-family: -apple-system, Roboto, "Segoe UI", sans-serif; }
  .nlt-title { font-weight: 800; font-size: 14px; color: #11181C; }
  .nlt-cat { font-size: 11px; color: #5b6770; margin-top: 2px; }
  .nlt-line { font-size: 12px; color: #39505c; margin-top: 4px; }
  .nlt-btn {
    display: block; width: 100%; margin-top: 8px; padding: 7px 10px;
    background: #0a7ea4; color: #fff; border: 0; border-radius: 8px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    text-align: center;
  }
  .nlt-btn:hover { background: #086685; }
  .leaflet-control-attribution { font-size: 10px; }
</style>
</head>
<body>
<div id="map"></div>
<script>`;

const TAIL = `</script>
</body>
</html>`;

const SCRIPT_SETUP = `
  function send(message) {
    var text = JSON.stringify(message);
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(text);
    } else if (window.parent && window.parent !== window) {
      window.parent.postMessage(text, '*');
    }
  }

  var map = L.map('map', { zoomControl: true, attributionControl: true })
    .setView([${MANIZALES_CENTER.latitude}, ${MANIZALES_CENTER.longitude}], 13);

  // Tiles gratuitos de OpenStreetMap (sin API key, sin costos ni restricciones de pago).
  // La atribución es obligatoria según la licencia de OpenStreetMap.
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 10,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
  }).addTo(map);

  var markerLayer = L.layerGroup().addTo(map);
  var routeLayer = L.layerGroup().addTo(map);
  var busLayer = L.layerGroup().addTo(map);
  var markerIndex = {};
  var lastFocusKey = '';
  var lastMarkersKey = '';
  var lastRoutesKey = '';
  var lastContentKey = '';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function popupHtml(item) {
    var html = '<div class="nlt-title">' + escapeHtml(item.title) + '</div>';
    html += '<div class="nlt-cat">' + escapeHtml(item.category || '') + '</div>';
    (item.lines || []).forEach(function (line) {
      html += '<div class="nlt-line">' + escapeHtml(line) + '</div>';
    });
    if (item.actionLabel) {
      html += '<button class="nlt-btn" data-action="' + escapeHtml(item.id) + '">'
        + escapeHtml(item.actionLabel) + '</button>';
    }
    return html;
  }

  function renderMarkers(markers) {
    markerLayer.clearLayers();
    markerIndex = {};
    markers.forEach(function (m) {
      var icon = L.divIcon({
        className: '',
        html: '<div class="nlt-pin' + (m.highlighted ? ' nlt-highlight' : '') + '" style="background:'
          + escapeHtml(m.color) + '"><span>' + escapeHtml(m.emoji) + '</span></div>',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28]
      });
      var marker = L.marker([m.lat, m.lng], { icon: icon, title: m.title })
        .bindPopup(popupHtml(m), { maxWidth: 260, minWidth: 180 })
        .on('click', function () { send({ type: 'marker-press', id: m.id }); })
        .addTo(markerLayer);
      markerIndex[m.id] = marker;
    });
  }
`;

const SCRIPT_RENDER = `
  function renderRoutes(routes) {
    routeLayer.clearLayers();
    routes.forEach(function (r) {
      if (!r.path || r.path.length < 2) return;
      var latlngs = r.path.map(function (p) { return [p.latitude, p.longitude]; });
      L.polyline(latlngs, {
        color: r.color,
        weight: r.active ? 6 : 3,
        opacity: r.active ? 0.95 : 0.6
      })
        .bindPopup(popupHtml({
          id: r.id,
          title: r.label,
          category: 'Recorrido de la ruta',
          lines: r.lines || [],
          actionLabel: 'Ver detalle de la ruta'
        }), { maxWidth: 260, minWidth: 180 })
        .on('click', function () { send({ type: 'route-press', id: r.id }); })
        .addTo(routeLayer);

      // Punto de inicio y final del recorrido.
      if (r.active) {
        [[latlngs[0], 'Inicio'], [latlngs[latlngs.length - 1], 'Final']].forEach(function (pair) {
          L.circleMarker(pair[0], {
            radius: 7, color: '#fff', weight: 2, fillColor: r.color, fillOpacity: 1
          }).bindPopup('<div class="nlt-title">' + pair[1] + ' del recorrido</div>'
            + '<div class="nlt-cat">' + escapeHtml(r.label) + '</div>').addTo(routeLayer);
        });
      }
    });
  }

  function renderBuses(buses) {
    busLayer.clearLayers();
    buses.forEach(function (b) {
      var icon = L.divIcon({
        className: '',
        html: '<div class="nlt-bus" style="background:' + escapeHtml(b.color) + '"><span>&#128656;</span></div>',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      L.marker([b.lat, b.lng], { icon: icon, title: b.title })
        .bindPopup('<div class="nlt-title">' + escapeHtml(b.title)
          + '</div><div class="nlt-cat">Posición simulada</div>')
        .addTo(busLayer);
    });
  }

  function applyData(data) {
    if (!data) return;

    var newMarkersKey = (data.markers || []).map(function (m) {
      return m.id + ':' + m.lat + ':' + m.lng + ':' + (m.highlighted ? 1 : 0);
    }).join('|');
    if (newMarkersKey !== lastMarkersKey) {
      lastMarkersKey = newMarkersKey;
      renderMarkers(data.markers || []);
    }

    var newRoutesKey = (data.routes || []).map(function (r) {
      return r.id + ':' + (r.active ? 1 : 0);
    }).join('|');
    if (newRoutesKey !== lastRoutesKey) {
      lastRoutesKey = newRoutesKey;
      renderRoutes(data.routes || []);
    }

    // Busetas se actualizan limpiamente sin recrear marcadores ni rutas
    renderBuses(data.buses || []);

    if (data.focus) {
      var key = data.focus.latitude + ',' + data.focus.longitude + ',' + (data.focus.zoom || 16);
      if (key !== lastFocusKey) {
        lastFocusKey = key;
        map.setView([data.focus.latitude, data.focus.longitude], data.focus.zoom || 16, { animate: true });
      }
    } else {
      lastFocusKey = '';
      if (data.fitToContent) {
        var contentKey = newMarkersKey + '##' + newRoutesKey;
        if (contentKey !== lastContentKey) {
          lastContentKey = contentKey;
          var group = [];
          (data.markers || []).forEach(function (m) { group.push([m.lat, m.lng]); });
          (data.routes || []).forEach(function (r) {
            (r.path || []).forEach(function (p) { group.push([p.latitude, p.longitude]); });
          });
          if (group.length > 1) {
            map.fitBounds(L.latLngBounds(group), { padding: [36, 36], maxZoom: 16 });
          } else if (group.length === 1) {
            map.setView(group[0], 15);
          }
        }
      }
    }

    if (data.openMarkerId && markerIndex[data.openMarkerId]) {
      markerIndex[data.openMarkerId].openPopup();
    }
  }

  window.applyData = applyData;

  // Manejo de clics en botones de acción dentro de popups
  map.on('popupopen', function (e) {
    var el = e.popup.getElement();
    if (!el) return;
    var btns = el.querySelectorAll('[data-action]');
    for (var i = 0; i < btns.length; i++) {
      (function (btn) {
        btn.onclick = function (ev) {
          ev.stopPropagation();
          var id = btn.getAttribute('data-action');
          if (id) send({ type: 'marker-action', id: id });
        };
      })(btns[i]);
    }
  });

  window.addEventListener('click', function (event) {
    var target = event.target;
    var id = target && target.getAttribute && target.getAttribute('data-action');
    if (id) send({ type: 'marker-action', id: id });
  }, true);

  function onIncoming(event) {
    try {
      var payload = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
      if (payload && payload.type === 'data') applyData(payload.data);
    } catch (e) { /* mensaje ajeno al mapa */ }
  }
  window.addEventListener('message', onIncoming);
  document.addEventListener('message', onIncoming);

  setTimeout(function () { map.invalidateSize(); }, 250);
  window.addEventListener('resize', function () { map.invalidateSize(); });
  send({ type: 'ready' });
`;

/**
 * Construye el documento completo del mapa con los datos iniciales ya
 * embebidos (para que nunca se vea un mapa vacío mientras llega el primer
 * mensaje desde React).
 */
export function buildLeafletHtml(initialData: MapDataPayload): string {
  const json = JSON.stringify(initialData).replace(/</g, '\\u003c');
  return (
    HEAD +
    '\n(function () {\n  var INITIAL = ' +
    json +
    ';\n' +
    SCRIPT_SETUP +
    SCRIPT_RENDER +
    '\n  applyData(INITIAL);\n})();\n' +
    TAIL
  );
}
