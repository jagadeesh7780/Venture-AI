import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

// Fix standard Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin factory
function createCustomIcon(color, text = '') {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 11px;
        ">
          ${text || '★'}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 14, { animate: true });
    }
  }, [center, map]);
  return null;
}

export default function BusinessMap({
  center = [12.9716, 77.5946],
  businessName = 'Primary Site',
  markers = [],
  locationScore = 75,
  footTraffic = 'High',
  dataSource = 'Google Maps Platform Geocoding API',
}) {
  const [mapType, setMapType] = React.useState('google');
  const primaryIcon = createCustomIcon('#F97316', 'HQ');

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-slate-800 bg-[#0B1120] shadow-2xl">
      {/* Top Floating Stats Overlay */}
      <div className="absolute top-3 left-3 z-[1000] bg-[#10172A]/95 backdrop-blur-md px-4 py-2 rounded-xl border border-orange-500/30 shadow-xl flex items-center gap-4">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Location Score</div>
          <div className="text-lg font-black text-orange-400">{locationScore}/100</div>
        </div>
        <div className="h-6 w-px bg-slate-700" />
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Foot Traffic</div>
          <div className="text-sm font-bold text-white">{footTraffic}</div>
        </div>
        <div className="h-6 w-px bg-slate-700" />
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Source</div>
          <div className="text-xs text-orange-300 font-semibold truncate max-w-[150px]">{dataSource}</div>
        </div>
      </div>

      {/* Top Right Map Style Selector */}
      <div className="absolute top-3 right-3 z-[1000] bg-[#10172A]/95 backdrop-blur-md p-1 rounded-xl border border-slate-700 shadow-xl flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setMapType('google')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            mapType === 'google'
              ? 'bg-orange-500 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Google Roads
        </button>
        <button
          type="button"
          onClick={() => setMapType('satellite')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            mapType === 'satellite'
              ? 'bg-orange-500 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Satellite
        </button>
        <button
          type="button"
          onClick={() => setMapType('osm')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
            mapType === 'osm'
              ? 'bg-orange-500 text-white shadow'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          OSM
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={false}
        className="w-full h-full"
        style={{ background: '#0B1120' }}
      >
        <MapUpdater center={center} />

        {/* Clean Google Maps Road Tiles - Zero watermark */}
        {mapType === 'google' && (
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        )}

        {/* Clean Google Maps Satellite / Hybrid Tiles */}
        {mapType === 'satellite' && (
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        )}

        {/* Clean OpenStreetMap Standard Tiles */}
        {mapType === 'osm' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {/* Primary Catchment Area Circle */}
        <Circle
          center={center}
          radius={800}
          pathOptions={{
            color: '#F97316',
            fillColor: '#F97316',
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '5, 5',
          }}
        />

        {/* Primary Business Marker */}
        <Marker position={center} icon={primaryIcon}>
          <Popup className="custom-leaflet-popup">
            <div className="p-1 min-w-[200px]">
              <div className="flex items-center justify-between mb-1">
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-orange-500/20 text-orange-600 border border-orange-500/30">
                  PRIMARY VENTURE
                </span>
                <span className="text-[10px] font-mono text-slate-400">TARGET SITE</span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm">{businessName}</h4>
              <p className="text-xs text-slate-600 mt-1">High precision geocoded location</p>
            </div>
          </Popup>
        </Marker>

        {/* Nearby POI Markers */}
        {markers.map((m, idx) => {
          let pinColor = '#06B6D4';
          let pinLabel = 'POI';
          if (m.category === 'Business') {
            pinColor = '#F97316';
            pinLabel = 'HQ';
          } else if (m.category === 'competitor') {
            pinColor = '#EF4444';
            pinLabel = 'CMP';
          } else if (m.category === 'potential_customer') {
            pinColor = '#06B6D4';
            pinLabel = 'CST';
          } else if (m.category === 'supplier') {
            pinColor = '#22C55E';
            pinLabel = 'SUP';
          } else if (m.category === 'distribution') {
            pinColor = '#3B82F6';
            pinLabel = 'DST';
          }

          if (!m.lat || !m.lng) return null;

          return (
            <Marker
              key={m.id || idx}
              position={[m.lat, m.lng]}
              icon={createCustomIcon(pinColor, pinLabel)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded uppercase"
                      style={{
                        backgroundColor: `${pinColor}22`,
                        color: pinColor,
                        border: `1px solid ${pinColor}44`,
                      }}
                    >
                      {m.category?.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {m.data_origin || 'ESTIMATED'}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                  {m.rating && (
                    <div className="text-xs text-amber-600 font-bold mt-0.5 flex items-center gap-1">
                      ★ {m.rating} {m.reviews ? `(${m.reviews} reviews)` : ''}
                    </div>
                  )}
                  {m.address && (
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{m.address}</p>
                  )}
                  {m.distance_meters && (
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-1 font-medium">
                      <Navigation className="w-3 h-3 text-slate-400" />
                      Distance: ~{m.distance_meters} meters
                    </div>
                  )}
                  {m.details && (
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{m.details}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-[#10172A]/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/60 shadow-xl flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 text-white font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Business Site
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Competitors
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Target Customers
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Suppliers
        </div>
      </div>
    </div>
  );
}
