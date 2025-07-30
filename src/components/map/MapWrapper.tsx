"use client";

import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect } from "react";

interface Household {
  household_id: string;
  village: string;
  latitude: number;
  longitude: number;
  prediction: number;
  predicted_income: number;
  [key: string]: any;
}

interface MapWrapperProps {
  households: Household[];
}

// Lazy load the map component
const HouseholdMap = dynamic(() => import("./HouseholdMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center">
      <div className="animate-pulse">
        <div className="text-gray-500">Loading map...</div>
      </div>
    </div>
  ),
});

const MapWrapper: React.FC<MapWrapperProps> = ({ households }) => {
  const [shouldLoadMap, setShouldLoadMap] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer to detect when map container is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: '100px', // Load when 100px away from viewport
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Auto-load map when in view, but only if data is reasonable size
  useEffect(() => {
    if (isInView && households?.length > 0 && households.length < 1000 && !shouldLoadMap) {
      const timer = setTimeout(() => {
        setShouldLoadMap(true);
      }, 500); // Small delay to ensure smooth scrolling
      return () => clearTimeout(timer);
    }
  }, [isInView, households?.length, shouldLoadMap]);

  const handleLoadMap = () => {
    setShouldLoadMap(true);
  };

  // Don't render anything if no households
  if (!households?.length) {
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        No household data available.
      </div>
    );
  }

  // Filter valid coordinates for count
  const validCount = households.filter(h => 
    typeof h.latitude === 'number' && 
    typeof h.longitude === 'number' && 
    !isNaN(h.latitude) && 
    !isNaN(h.longitude)
  ).length;

  if (!validCount) {
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        No valid coordinates found.
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {shouldLoadMap ? (
        <HouseholdMap households={households} />
      ) : (
        <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="text-gray-600 mb-4">
              📍 Map with {validCount} household locations
            </div>
            <div className="text-sm text-gray-500 mb-4">
              {validCount > 500 && (
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-md mb-2">
                  Large dataset detected - map will show first 200 markers
                </div>
              )}
              Click to load interactive map
            </div>
            <button
              onClick={handleLoadMap}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Load Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapWrapper;