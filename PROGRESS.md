# NO LLEGUES TARDE — Progreso

## Estado: Primera versión funcional completada (datos simulados)

### Terminado
- Capa de datos completa en `data/` (types, companies, places, stops, routes,
  schedules, buses, notifications, reports, manizales) con separación
  estricta de datos y UI.
- Rutas derivadas automáticamente de los routeIds declarados en `places.ts` y
  `stops.ts` (sin duplicar información) — 108 rutas/sentidos de Socobuses.
- 7 empresas reales incluidas (Socobuses con rutas verificadas; las otras 6
  con estado "por verificar" — sin inventar relaciones ruta→empresa).
- 13 lugares reales de Manizales con relación verificada a rutas (Socobuses).
- 12 puntos de despacho/control de Socobuses.
- Navegación: tabs (Inicio, Rutas, Mapa, Empresas, Avisos) + stack screens
  (detalle de ruta, detalle de empresa, detalle de lugar, lugares, horarios,
  reportes, búsqueda).
- Navegación: tabs (Inicio, Rutas, Mapa, Empresas, Avisos) + stack screens
  (detalle de ruta, detalle de empresa, detalle de lugar, lugares, horarios,
  reportes, búsqueda).
- Mapa interactivo 100% gratuito con OpenStreetMap + Leaflet:
  - Móvil (Android / iOS): renderizado en WebView (`react-native-webview`) con tiles directos de OpenStreetMap y baseUrl segura.
  - Web: renderizado en `<iframe>` con comunicación bidireccional vía `postMessage`.
  - Sin costo, sin necesidad de tarjeta ni Google Maps API Key.
  - Soporta filtros por categorías, búsqueda de sitios/paraderos, popups informativos con navegación a detalle y animación de busetas en tiempo real sin parpadeos ni reinicio de zoom.
  - Integrado en: pestaña principal de Mapa (`app/(tabs)/map.tsx`), Detalle de Lugar (`app/place/[id].tsx`) y Detalle de Ruta (`app/route/[id].tsx`).
- Simulación de busetas: posición interpolada entre paraderos/lugares,
  ocupación y tiempo de llegada simulados, con "tick" periódico
  (`hooks/use-simulated-buses.ts`).
- Sistema de búsqueda combinada (lugares + rutas).
- Sistema de reportes (formulario funcional, en memoria).
- Notificaciones/avisos simulados con etiquetas claras de "Simulado".
- Etiquetas `VerifiedTag`/`SimulatedTag` reutilizables para nunca confundir
  dato real con dato simulado.
- `tsc --noEmit`: 0 errores.
- `expo lint`: 0 errores / 0 advertencias.
- `expo export --platform web`: exportación estática de las 20 rutas completada con éxito.
- Pruebas automatizadas de navegador (browser subagent) ejecutadas con éxito en `http://localhost:8081`.

### Decisiones técnicas
- No se requiere backend adicional; se usa `server.js` existente sin tocar.
- Solución cartográfica: Leaflet + OpenStreetMap (100% libre, sin API key).
- Arquitectura de "proveedor de ubicación" (`BusLocationProvider` en
  `data/buses.ts`) para poder reemplazar la simulación por GPS/API real sin
  tocar pantallas.
- Orígenes/destinos de ruta se infieren de despachaderos conocidos; cuando no
  hay despachadero verificado, la ruta queda con `note` indicando que el
  origen/destino exacto está "por confirmar" (el recorrido y lugares sí están
  verificados).

### Pendiente / próximos pasos sugeridos
- Verificar con fuentes oficiales (Alcaldía / Secretaría de Movilidad /
  empresas) las rutas específicas de Gran Caldas, Autolegal, Sideral,
  Unitrans, Serviturismo y Flota Metropolitana S.A.
- Reemplazar horarios simulados por horarios oficiales cuando existan.
- Conectar `activeLocationProvider` a una fuente real de GPS/API cuando esté
  disponible.
- Configurar Google Maps API key si se requiere el proveedor de Google en
  producción (`PROVIDER_GOOGLE`).
- Considerar pruebas automatizadas (Jest) si el proyecto las incorpora en el
  futuro (no había configuración de testing previa).
