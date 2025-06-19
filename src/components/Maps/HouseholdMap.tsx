// HouseholdMap.tsx
import React, { useEffect, useRef } from 'react';
import type { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import chroma from 'chroma-js';

// Define a type for household data
interface Household {
  household_id: string;
  village: string;
  latitude: number;
  longitude: number;
  prediction: number;
  predicted_income: number;
}

interface HouseholdMapProps {
  households: Household[];
}

const DEFAULT_CENTER: LatLngTuple = [1.3, 32];
const DEFAULT_ZOOM = 7;

const HouseholdMap: React.FC<HouseholdMapProps> = ({ households }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (containerRef.current) {
        try {
          containerRef.current.remove();
        } catch (e) {
          console.warn('Map cleanup error:', e);
        }
      }
    };
  }, []);

  // Fallback if no data
  if (!households || households.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        No household data available.
      </div>
    );
  }

  // Filter out invalid coordinates
  const validHouseholds = households.filter(
    h => typeof h.latitude === 'number' && 
        typeof h.longitude === 'number' && 
        !isNaN(h.latitude) && 
        !isNaN(h.longitude)
  );

  if (validHouseholds.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        No valid coordinates found.
      </div>
    );
  }

  // Compute color scale domain
  const predictions = validHouseholds.map(h => h.prediction);
  const minPred = Math.min(...predictions);
  const maxPred = Math.max(...predictions);
  const colorScale = chroma.scale('Viridis').domain([minPred, maxPred]);

  // Center map on the mean of valid coordinates if available
  const avgLat = validHouseholds.reduce((sum, h) => sum + h.latitude, 0) / validHouseholds.length;
  const avgLng = validHouseholds.reduce((sum, h) => sum + h.longitude, 0) / validHouseholds.length;
  const mapCenter: LatLngTuple = [avgLat || DEFAULT_CENTER[0], avgLng || DEFAULT_CENTER[1]];

  // Use a unique key that includes timestamp to ensure complete remount
  const mapKey = `map-${Date.now()}-${validHouseholds.length}`;

  try {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 h-[500px]">
        <div key={mapKey} ref={mapRef} style={{ height: '100%', width: '100%' }}>
          <MapContainer
            center={mapCenter}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
            ref={containerRef}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {validHouseholds.map((h) => (
              <CircleMarker
                key={h.household_id}
                center={[h.latitude, h.longitude] as LatLngTuple}
                radius={7}
                pathOptions={{
                  color: '#222',
                  weight: 1,
                  fillColor: colorScale(h.prediction).hex(),
                  fillOpacity: 0.85,
                }}
              >
                <Popup>
                  <div>
                    <strong>ID:</strong> {h.household_id}<br />
                    <strong>Village:</strong> {h.village}<br />
                    <strong>Prediction:</strong> {h.prediction}<br />
                    <strong>Income:</strong> {h.predicted_income.toFixed(2)}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Map rendering error:', error);
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-red-500">
        Map failed to load: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }
};

export default HouseholdMap;
