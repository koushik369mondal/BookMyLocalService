import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { getApiBase } from '@/lib/utils';
import L from 'leaflet';
import { useState } from 'react';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({ setLocation, setCoordinates }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setCoordinates({ latitude: lat, longitude: lng });

      try {
        const base = getApiBase().replace(/\/api$/, '') || (typeof window !== 'undefined' ? window.location.origin : '');
        const res = await fetch(
          `${base}/api/location/reverse?lat=${lat}&lon=${lng}`
        );

        const data = await res.json();
        setLocation(data.location || 'Location selected');

      } catch {
        setLocation('Could not fetch address');
      }
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function MapPicker({ setLocation, setCoordinates }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]} // India default
      zoom={5}
      className="h-[300px] w-full rounded-lg border"
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        setLocation={setLocation}
        setCoordinates={setCoordinates}
      />
    </MapContainer>
  );
}
