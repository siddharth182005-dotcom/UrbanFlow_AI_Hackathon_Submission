"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946];



export default function MapComponent({ fullScreen = false }: { fullScreen?: boolean }) {
  // Use state to avoid hydration mismatch with Leaflet
  const [mounted, setMounted] = useState(false);
  const [hotspots, setHotspots] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch('/api/map')
      .then(res => res.json())
      .then(data => setHotspots(data.hotspots || []))
      .catch(err => console.error(err));
  }, []);

  if (!mounted) return <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400 animate-pulse">Initializing Map Engine...</div>;

  return (
    <div className={`w-full ${fullScreen ? 'h-[calc(100vh-12rem)]' : 'h-64'} rounded-xl overflow-hidden shadow-2xl border border-slate-700`}>
      <MapContainer 
        center={BENGALURU_CENTER} 
        zoom={11} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        className="z-0"
      >
        {/* Dark Theme Tile Layer from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {hotspots.map((spot, idx) => (
          <div key={idx}>
            <Marker position={[spot.position[0], spot.position[1]]}>
              <Popup className="custom-popup">
                <div className="p-1">
                  <h3 className="font-bold text-slate-800">{spot.address || 'Unknown'}</h3>
                  <p className="text-sm text-slate-600 mt-1">Impact Score: <span className="font-bold text-red-500">{spot.impact}</span></p>
                  <p className="text-xs text-slate-500 mt-1 uppercase">{spot.cause}</p>
                  <button className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded w-full">View Details</button>
                </div>
              </Popup>
            </Marker>
            
            {/* Heatmap pulse effect proxy */}
            <CircleMarker 
              center={[spot.position[0], spot.position[1]]} 
              radius={spot.status === 'Critical' ? 25 : 15}
              pathOptions={{
                color: spot.status === 'Critical' ? '#ef4444' : '#f59e0b',
                fillColor: spot.status === 'Critical' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.4,
                weight: 0
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
