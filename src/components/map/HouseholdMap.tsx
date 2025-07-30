"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { LatLngTuple } from 'leaflet';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Household {
  household_id: string;
  village: string;
  latitude: number;
  longitude: number;
  prediction: number;
  predicted_income: number;
  district?: string;
  cluster?: string;
  [key: string]: any;
}

interface HouseholdMapProps {
  households: Household[];
  maxMarkers?: number; // Limit markers for performance
}

const DEFAULT_CENTER: LatLngTuple = [1.3, 32];
const DEFAULT_ZOOM = 7;
const MAX_MARKERS_DEFAULT = 200; // Limit to prevent performance issues

const HouseholdMap: React.FC<HouseholdMapProps> = ({ 
  households, 
  maxMarkers = MAX_MARKERS_DEFAULT 
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showAllMarkers, setShowAllMarkers] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Memoize processed data with performance optimization
  const { validHouseholds, mapCenter, hasData, totalCount, displayedCount } = useMemo(() => {
    if (!households?.length) {
      return { 
        validHouseholds: [], 
        mapCenter: DEFAULT_CENTER, 
        hasData: false, 
        totalCount: 0,
        displayedCount: 0
      };
    }

    const valid = households.filter(h => 
      typeof h.latitude === 'number' && 
      typeof h.longitude === 'number' && 
      !isNaN(h.latitude) && 
      !isNaN(h.longitude)
    );

    if (!valid.length) {
      return { 
        validHouseholds: [], 
        mapCenter: DEFAULT_CENTER, 
        hasData: false,
        totalCount: 0,
        displayedCount: 0
      };
    }

    // Limit markers for performance unless user explicitly wants to see all
    const limitedHouseholds = showAllMarkers ? valid : valid.slice(0, maxMarkers);

    const avgLat = limitedHouseholds.reduce((sum, h) => sum + h.latitude, 0) / limitedHouseholds.length;
    const avgLng = limitedHouseholds.reduce((sum, h) => sum + h.longitude, 0) / limitedHouseholds.length;
    const center: LatLngTuple = [avgLat, avgLng];

    return { 
      validHouseholds: limitedHouseholds, 
      mapCenter: center, 
      hasData: true,
      totalCount: valid.length,
      displayedCount: limitedHouseholds.length
    };
  }, [households, maxMarkers, showAllMarkers]);

  const getMarkerColor = useCallback((prediction: number): string => {
    return prediction === 0 ? '#dc2626' : '#16a34a';
  }, []);

  // Fullscreen functionality
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!mapContainerRef.current) return;

    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen?.().catch(err => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const toggleShowAll = useCallback(() => {
    setShowAllMarkers(prev => !prev);
  }, []);

  if (!hasData) {
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        {!households?.length ? "No household data available." : "No valid coordinates found."}
      </div>
    );
  }

  return (
    <div 
      ref={mapContainerRef}
      className={`bg-white rounded-md shadow-md mb-6 relative ${isFullScreen ? 'fixed inset-0 z-[9999] p-0 rounded-none' : 'h-[500px] p-6'}`}
    >
      {/* Control buttons */}
      <div className="absolute top-8 right-8 z-[1000] flex gap-2">
        {totalCount > maxMarkers && (
          <button
            onClick={toggleShowAll}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-md shadow-lg hover:bg-blue-700 text-sm"
            disabled={showAllMarkers && totalCount > 1000} // Prevent showing too many
          >
            {showAllMarkers ? `All ${displayedCount} Shown` : `Load All ${totalCount}`}
          </button>
        )}
        <button
          onClick={toggleFullScreen}
          className="bg-white text-black px-3 py-1.5 rounded-md shadow-lg hover:bg-gray-100"
        >
          {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
        </button>
      </div>

      {/* Data info */}
      {totalCount > displayedCount && (
        <div className="absolute top-16 left-6 z-[1000] bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md text-sm">
          Showing {displayedCount} of {totalCount} households
        </div>
      )}
      
      <div style={{ height: '100%', width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={DEFAULT_ZOOM}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {validHouseholds.map((h, index) => (
            <CircleMarker
              key={`${h.household_id}-${index}`}
              center={[h.latitude, h.longitude]}
              radius={6}
              pathOptions={{
                color: '#ffffff',
                weight: 2,
                fillColor: getMarkerColor(h.prediction),
                fillOpacity: 0.9,
              }}
            >
              <Popup>
                <div>
                  <div style={{ marginBottom: '8px', paddingBottom: '4px', borderBottom: '1px solid #ccc' }}>
                    <strong style={{ color: getMarkerColor(h.prediction) }}>
                      {h.prediction === 0 ? '🔴 Not Likely to hit target' : '🟢 Likely to hit target'}
                    </strong>
                  </div>
                  
                  <div>
                    <strong>ID:</strong> {h.household_id}<br />
                    <strong>Village:</strong> {h.village}<br />
                    {h.district && <><strong>District:</strong> {h.district}<br /></>}
                    <strong>Income:</strong> ${h.predicted_income?.toFixed(0)}<br />
                    <strong>Location:</strong> {h.latitude.toFixed(4)}, {h.longitude.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default HouseholdMap;