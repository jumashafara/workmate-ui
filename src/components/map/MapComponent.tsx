"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Define household interface
interface Household {
  household_id: string;
  village: string;
  latitude: number;
  longitude: number;
  prediction: number;
  predicted_income: number;
  region?: string;
  district?: string;
  cluster?: string;
  altitude?: number;
  cohort?: string;
  cycle?: string;
  evaluation_month?: number;
  tot_hhmembers?: number;
  hhh_sex?: number;
  education_level_encoded?: number;
  Land_size_for_Crop_Agriculture_Acres?: number;
  farm_implements_owned?: number;
  business_participation?: number;
  vsla_participation?: number;
  maize?: number;
  ground_nuts?: number;
  sweet_potatoes?: number;
  cassava?: number;
  sorghum?: number;
  irish_potatoes?: number;
  perennial_crops_grown_food_banana?: number;
  perennial_crops_grown_coffee?: number;
  [key: string]: any;
}

interface MapComponentProps {
  households: Household[];
  isFullScreen?: boolean;
}

const DEFAULT_CENTER: [number, number] = [1.3, 32]; // Uganda coordinates
const DEFAULT_ZOOM = 7;

const MapComponent: React.FC<MapComponentProps> = ({ households, isFullScreen = false }) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Helper function to format boolean values
  const formatBoolean = (value: any): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value === 1 ? "Yes" : "No";
    return value?.toString() || "N/A";
  };

  // Helper function to get crops grown
  const getCropsGrown = (household: Household): string[] => {
    const crops: string[] = [];
    if (household.maize === 1) crops.push("Maize");
    if (household.ground_nuts === 1) crops.push("Ground Nuts");
    if (household.sweet_potatoes === 1) crops.push("Sweet Potatoes");
    if (household.cassava === 1) crops.push("Cassava");
    if (household.sorghum === 1) crops.push("Sorghum");
    if (household.irish_potatoes === 1) crops.push("Irish Potatoes");
    if (household.perennial_crops_grown_food_banana === 1) crops.push("Food Banana");
    if (household.perennial_crops_grown_coffee === 1) crops.push("Coffee");
    return crops;
  };

  // Create popup content
  const createPopupContent = (household: Household): string => {
    const crops = getCropsGrown(household);
    
    return `
      <div style="max-height: 300px; overflow-y: auto; font-family: system-ui, -apple-system, sans-serif;">
        <!-- Header -->
        <div style="margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
          <div style="font-weight: bold; font-size: 16px; color: ${household.prediction === 1 ? '#16a34a' : '#dc2626'};">
            ${household.prediction === 1 ? '🟢 Likely to Achieve Target' : '🔴 Not Likely to Achieve Target'}
          </div>
        </div>

        <!-- Basic Information -->
        <div style="margin-bottom: 12px;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Basic Information</h4>
          <div style="font-size: 14px; line-height: 1.4;">
            <div><strong>ID:</strong> ${household.household_id}</div>
            <div><strong>Village:</strong> ${household.village}</div>
            ${household.region ? `<div><strong>Region:</strong> ${household.region}</div>` : ''}
            ${household.district ? `<div><strong>District:</strong> ${household.district}</div>` : ''}
            ${household.cluster ? `<div><strong>Cluster:</strong> ${household.cluster}</div>` : ''}
            <div><strong>Coordinates:</strong> ${household.latitude.toFixed(4)}, ${household.longitude.toFixed(4)}</div>
            ${household.altitude ? `<div><strong>Altitude:</strong> ${household.altitude.toFixed(1)}m</div>` : ''}
          </div>
        </div>

        <!-- Prediction Results -->
        <div style="margin-bottom: 12px;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Prediction Results</h4>
          <div style="font-size: 14px; line-height: 1.4;">
            <div><strong>Status:</strong> ${household.prediction === 1 ? 'Achieved' : 'Not Achieved'}</div>
            <div><strong>Predicted Income:</strong> $${household.predicted_income.toFixed(2)}</div>
          </div>
        </div>

        <!-- Demographics -->
        <div style="margin-bottom: 12px;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Demographics</h4>
          <div style="font-size: 14px; line-height: 1.4;">
            ${household.tot_hhmembers ? `<div><strong>Total Members:</strong> ${household.tot_hhmembers}</div>` : ''}
            ${household.hhh_sex !== undefined ? `<div><strong>Head Gender:</strong> ${household.hhh_sex === 1 ? 'Female' : 'Male'}</div>` : ''}
          </div>
        </div>

        ${crops.length > 0 ? `
        <!-- Crops Grown -->
        <div style="margin-bottom: 12px;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Crops Grown</h4>
          <div style="font-size: 14px;">${crops.join(', ')}</div>
        </div>
        ` : ''}

        ${(household.business_participation !== undefined || household.vsla_participation !== undefined) ? `
        <!-- Economic Activities -->
        <div style="margin-bottom: 12px;">
          <h4 style="margin: 0 0 8px 0; font-weight: 600; color: #374151;">Economic Activities</h4>
          <div style="font-size: 14px; line-height: 1.4;">
            ${household.business_participation !== undefined ? `<div><strong>Business:</strong> ${formatBoolean(household.business_participation)}</div>` : ''}
            ${household.vsla_participation !== undefined ? `<div><strong>VSLA:</strong> ${formatBoolean(household.vsla_participation)}</div>` : ''}
          </div>
        </div>
        ` : ''}
      </div>
    `;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Calculate map center
    const avgLat = households.reduce((sum, h) => sum + h.latitude, 0) / households.length;
    const avgLng = households.reduce((sum, h) => sum + h.longitude, 0) / households.length;
    const mapCenter: [number, number] = [
      avgLat || DEFAULT_CENTER[0],
      avgLng || DEFAULT_CENTER[1],
    ];

    // Create new map
    const map = L.map(containerRef.current, {
      center: mapCenter,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: true,
    });

    mapRef.current = map;

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add markers
    households.forEach((household) => {
      const color = household.prediction === 1 ? '#16a34a' : '#dc2626';
      
      const circle = L.circleMarker([household.latitude, household.longitude], {
        radius: isFullScreen ? 8 : 6,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      circle.bindPopup(createPopupContent(household), {
        maxWidth: 350,
        maxHeight: 400
      });
    });

    setMounted(true);

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [households, isFullScreen]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    />
  );
};

export default MapComponent;