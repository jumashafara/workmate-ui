"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { LatLngTuple, Map } from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

interface PredictionData {
  id: number;
  household_id: string;
  [key: string]: any;
}

interface HouseholdMapProps {
  households: PredictionData[];
  maxMarkers?: number;
}

const DEFAULT_CENTER: LatLngTuple = [1.3, 32];
const DEFAULT_ZOOM = 7;
const MAX_MARKERS_DEFAULT = 200;

const MapInstanceHandler: React.FC<{ onMapReady: (map: Map) => void }> = ({ onMapReady }) => {
  const map = useMap();
  useEffect(() => {
    if (map) onMapReady(map);
  }, [map, onMapReady]);
  return null;
};

const FeatureDisplay: React.FC<{ household: PredictionData }> = ({ household }) => {
  const renderValue = (value: any) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number' && Math.abs(value) > 1000) return value.toLocaleString();
    return value.toString();
  };

  const formatKey = (key: string) => 
    key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

  const features = Object.entries(household)
    .filter(([key, value]) => value !== null && value !== undefined && key !== 'id' && key !== 'household_id' && key !== 'latitude' && key !== 'longitude')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  return (
    <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '15px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {features.map(([key, value]) => (
            <tr key={key} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '4px 0', fontWeight: 'bold', fontSize: '0.85rem' }}>{formatKey(key)}</td>
              <td style={{ padding: '4px 0', textAlign: 'right', fontSize: '0.85rem' }}>{renderValue(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const HouseholdMap: React.FC<HouseholdMapProps> = ({ households, maxMarkers = MAX_MARKERS_DEFAULT }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showAllMarkers, setShowAllMarkers] = useState(false);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/wmgeolab/geoBoundaries/4207865563a35c2b291a13a4ad22a309e6c467a4/releaseData/gbOpen/UGA/ADM2/geoBoundaries-UGA-ADM2.geojson')
      .then(response => response.json())
      .then(data => setGeoJsonData(data));
  }, []);

  const districtPerformance = useMemo(() => {
    const performance: { [key: string]: { total: number; sum: number } } = {};
    households.forEach(h => {
      if (h.district) {
        if (!performance[h.district]) performance[h.district] = { total: 0, sum: 0 };
        performance[h.district].total++;
        performance[h.district].sum += h.prediction;
      }
    });
    return Object.keys(performance).reduce((acc, district) => {
      acc[district] = performance[district].sum / performance[district].total;
      return acc;
    }, {} as { [key: string]: number });
  }, [households]);

  const getColor = (performance: number) => {
    return performance > 0.8 ? '#800026' :
           performance > 0.6 ? '#BD0026' :
           performance > 0.4 ? '#E31A1C' :
           performance > 0.2 ? '#FC4E2A' : '#FFEDA0';
  };

  const style = (feature: any) => ({
    fillColor: districtPerformance[feature.properties.shapeName] ? getColor(districtPerformance[feature.properties.shapeName]) : '#FFFFFF',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

  const { validHouseholds, hasData, totalCount, displayedCount } = useMemo(() => {
    if (!households?.length) return { validHouseholds: [], hasData: false, totalCount: 0, displayedCount: 0 };
    const valid = households.filter(h => typeof h.latitude === 'number' && typeof h.longitude === 'number' && !isNaN(h.latitude) && !isNaN(h.longitude));
    if (!valid.length) return { validHouseholds: [], hasData: false, totalCount: 0, displayedCount: 0 };
    const limitedHouseholds = showAllMarkers ? valid : valid.slice(0, maxMarkers);
    return { validHouseholds: limitedHouseholds, hasData: true, totalCount: valid.length, displayedCount: limitedHouseholds.length };
  }, [households, maxMarkers, showAllMarkers]);

  const getMarkerColor = useCallback((prediction: number): string => (prediction === 0 ? '#dc2626' : '#16a34a'), []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      const newFullscreenState = !!document.fullscreenElement;
      setIsFullScreen(newFullscreenState);
      if (mapInstance) setTimeout(() => mapInstance.invalidateSize(), 150);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, [mapInstance]);

  useEffect(() => {
    if (mapInstance) {
      const timer = setTimeout(() => mapInstance.invalidateSize(), 200);
      return () => clearTimeout(timer);
    }
  }, [isFullScreen, mapInstance]);

  const toggleFullScreen = useCallback(() => {
    if (mapContainerRef.current) {
      if (!document.fullscreenElement) {
        mapContainerRef.current.requestFullscreen()?.catch(err => console.error('Fullscreen error:', err));
      }
      else document.exitFullscreen?.();
    }
  }, []);

  const toggleShowAll = useCallback(() => setShowAllMarkers(prev => !prev), []);
  const handleMapReady = useCallback((map: Map) => setMapInstance(map), []);

  if (!hasData) {
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        {!households?.length ? "No household data available." : "No valid coordinates found."}
      </div>
    );
  }

  return (
    <div ref={mapContainerRef} className={`bg-white rounded-md shadow-md mb-6 relative ${isFullScreen ? 'fixed inset-0 z-[9999] p-0 rounded-none h-screen w-screen' : 'h-[500px] p-6'}`}>
      <div className="absolute top-8 right-8 z-[1000] flex gap-2">
        {totalCount > maxMarkers && (
          <button onClick={toggleShowAll} className="bg-blue-600 text-white px-3 py-1.5 rounded-md shadow-lg hover:bg-blue-700 text-sm" disabled={showAllMarkers && totalCount > 1000}>
            {showAllMarkers ? `All ${displayedCount} Shown` : `Load All ${totalCount}`}
          </button>
        )}
        <button onClick={toggleFullScreen} className="bg-white text-black px-3 py-1.5 rounded-md shadow-lg hover:bg-gray-100">
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      </div>

      {totalCount > displayedCount && (
        <div className="absolute top-16 left-6 z-[1000] bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm">
          Showing {displayedCount} of {totalCount} households
        </div>
      )}
      
      <div className={isFullScreen ? 'h-screen w-full' : 'h-full w-full'}>
        <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <MapInstanceHandler onMapReady={handleMapReady} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {geoJsonData && <GeoJSON data={geoJsonData} style={style} />}
          <MarkerClusterGroup>
            {validHouseholds.map((h, index) => (
              <CircleMarker key={`${h.household_id}-${index}`} center={[h.latitude, h.longitude]} radius={6} pathOptions={{ color: '#ffffff', weight: 2, fillColor: getMarkerColor(h.prediction), fillOpacity: 0.9 }}>
                <Popup>
                  <div style={{ width: '300px' }}>
                    <div style={{ marginBottom: '8px', paddingBottom: '4px', borderBottom: '1px solid #ccc' }}>
                      <strong style={{ color: getMarkerColor(h.prediction), fontSize: '1.1rem' }}>
                        {h.prediction === 0 ? '🔴 Not Likely to hit target' : '🟢 Likely to hit target'}
                      </strong>
                      <br />
                      <span style={{ fontSize: '0.9rem', color: '#555' }}>ID: {h.household_id}</span>
                    </div>
                    <FeatureDisplay household={h} />
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
};

export default HouseholdMap;
