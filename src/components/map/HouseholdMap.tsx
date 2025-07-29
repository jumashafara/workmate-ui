"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import type { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Define a comprehensive type for household data
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
  standard_evaluation?: boolean;
  checkin_evaluation?: boolean;
  cohort?: string;
  cycle?: string;
  evaluation_month?: number;
  Land_size_for_Crop_Agriculture_Acres?: number;
  farm_implements_owned?: number;
  tot_hhmembers?: number;
  Distance_travelled_one_way_OPD_treatment?: number;
  Average_Water_Consumed_Per_Day?: number;
  hh_water_collection_Minutes?: number;
  vsla_participation?: number;
  ground_nuts?: number;
  composts_num?: number;
  perennial_crops_grown_food_banana?: number;
  sweet_potatoes?: number;
  perennial_crops_grown_coffee?: number;
  irish_potatoes?: number;
  business_participation?: number;
  cassava?: number;
  hh_produce_lq_manure?: number;
  hh_produce_organics?: number;
  maize?: number;
  sorghum?: number;
  non_bio_waste_mgt_present?: number;
  soap_ash_present?: number;
  education_level_encoded?: number;
  tippy_tap_present?: number;
  hhh_sex?: number;
  probability?: number;
  [key: string]: any; // Allow for additional fields
}

interface HouseholdMapProps {
  households: Household[];
}

const DEFAULT_CENTER: LatLngTuple = [1.3, 32];
const DEFAULT_ZOOM = 7;

const HouseholdMap: React.FC<HouseholdMapProps> = ({ households }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<any>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null); // Ref for the element to make fullscreen

  // Cleanup on unmount
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      if (containerRef.current) {
        try {
          containerRef.current.remove();
        } catch (e) {
          console.warn("Map cleanup error:", e);
        }
      }
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!mapContainerRef.current) return;

    if (!document.fullscreenElement) {
      mapContainerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }, []);

  // Fallback if no data
  if (!households || households.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        No household data available.
      </div>
    );
  }

  // Filter out invalid coordinates
  const validHouseholds = households.filter(
    (h) =>
      typeof h.latitude === "number" &&
      typeof h.longitude === "number" &&
      !isNaN(h.latitude) &&
      !isNaN(h.longitude)
  );

  if (validHouseholds.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-gray-500">
        No valid coordinates found.
      </div>
    );
  }

  // Color function: Red for poor (0), Green for non-poor (1)
  const getMarkerColor = (prediction: number): string => {
    return prediction === 0 ? "#dc2626" : "#16a34a"; // Red for poor, Green for non-poor
  };

  // Center map on the mean of valid coordinates if available
  const avgLat =
    validHouseholds.reduce((sum, h) => sum + h.latitude, 0) /
    validHouseholds.length;
  const avgLng =
    validHouseholds.reduce((sum, h) => sum + h.longitude, 0) /
    validHouseholds.length;
  const mapCenter: LatLngTuple = [
    avgLat || DEFAULT_CENTER[0],
    avgLng || DEFAULT_CENTER[1],
  ];

  // Use a unique key that includes timestamp to ensure complete remount
  const mapKey = `map-${Date.now()}-${validHouseholds.length}`;

  // Helper function to format boolean values
  const formatBoolean = (value: any): string => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value === 1 ? "Yes" : "No";
    return value?.toString() || "N/A";
  };

  // Helper function to format field names for display
  const formatFieldName = (fieldName: string): string => {
    return fieldName
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace(/Hhh/g, "Head of Household")
      .replace(/Hh /g, "Household ")
      .replace(/Opd/g, "OPD")
      .replace(/Vsla/g, "VSLA")
      .replace(/Lq/g, "Liquid");
  };

  console.log(validHouseholds[0]);

  try {
    return (
      <div
        ref={mapContainerRef}
        className={`bg-white rounded-md shadow-md mb-6 relative ${
          isFullScreen ? "fixed inset-0 z-[9999] p-0 border-0" : "h-[500px] p-6"
        }`}
      >
        <button
          onClick={toggleFullScreen}
          className="absolute top-8 right-8 z-[1000] bg-white text-black px-3 py-1.5 rounded-md shadow-lg hover:bg-gray-100 transition-colors"
          title={isFullScreen ? "Exit Full Screen" : "View Full Screen"}
        >
          {isFullScreen ? "Exit Full Screen" : "Full Screen"}
        </button>
        <div
          key={mapKey}
          ref={mapRef}
          style={{ height: "100%", width: "100%" }}
        >
          <MapContainer
            center={mapCenter}
            zoom={DEFAULT_ZOOM}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
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
                radius={6}
                pathOptions={{
                  color: "#ffffff",
                  weight: 2,
                  fillColor: getMarkerColor(h.prediction),
                  fillOpacity: 0.9,
                }}
              >
                <Popup maxWidth={400} maxHeight={500}>
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {/* Header */}
                    <div
                      style={{
                        marginBottom: "12px",
                        borderBottom: "2px solid #ccc",
                        paddingBottom: "8px",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "16px",
                          color: getMarkerColor(h.prediction),
                        }}
                      >
                        {h.prediction === 0
                          ? "🔴 Not Likely to hit the target"
                          : "🟢 Likely to hit the target"}
                      </strong>
                    </div>

                    {/* Basic Information */}
                    <div style={{ marginBottom: "12px" }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                        Basic Information
                      </h4>
                      <strong>ID:</strong> {h.household_id}
                      <br />
                      <strong>Village:</strong> {h.village}
                      <br />
                      {/* {h.region && <><strong>Region:</strong> {h.region}<br /></>} */}
                      {h.district && (
                        <>
                          <strong>District:</strong> {h.district}
                          <br />
                        </>
                      )}
                      {h.cluster && (
                        <>
                          <strong>Cluster:</strong> {h.cluster}
                          <br />
                        </>
                      )}
                      <strong>Coordinates:</strong> {h.latitude.toFixed(6)},{" "}
                      {h.longitude.toFixed(6)}
                      <br />
                      {h.altitude && (
                        <>
                          <strong>Altitude:</strong> {h.altitude.toFixed(1)}m
                          <br />
                        </>
                      )}
                    </div>

                    {/* Prediction Results */}
                    <div style={{ marginBottom: "12px" }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                        Prediction Results
                      </h4>
                      <strong>Classification:</strong>{" "}
                      {h.prediction === 0
                        ? "Not Likely to hit the target"
                        : "Likely to hit the target"}
                      <br />
                      <strong>Predicted Income + Production:</strong> $
                      {h.predicted_income.toFixed(2)}
                      <br />
                      {/* {h.probability && <><strong>Probability:</strong> {(h.probability * 100).toFixed(1)}%<br /></>} */}
                    </div>

                    {/* Evaluation Information */}
                    {(h.cohort || h.cycle || h.evaluation_month) && (
                      <div style={{ marginBottom: "12px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                          Evaluation Details
                        </h4>
                        {h.cohort && (
                          <>
                            <strong>Cohort:</strong> {h.cohort}
                            <br />
                          </>
                        )}
                        {h.cycle && (
                          <>
                            <strong>Cycle:</strong> {h.cycle}
                            <br />
                          </>
                        )}
                        {h.evaluation_month && (
                          <>
                            <strong>Evaluation Month:</strong>{" "}
                            {h.evaluation_month}
                            <br />
                          </>
                        )}
                        {h.standard_evaluation !== undefined && (
                          <>
                            <strong>Standard Evaluation:</strong>{" "}
                            {formatBoolean(h.standard_evaluation)}
                            <br />
                          </>
                        )}
                        {h.checkin_evaluation !== undefined && (
                          <>
                            <strong>Checkin Evaluation:</strong>{" "}
                            {formatBoolean(h.checkin_evaluation)}
                            <br />
                          </>
                        )}
                      </div>
                    )}

                    {/* Household Demographics */}
                    <div style={{ marginBottom: "12px" }}>
                      <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                        Demographics
                      </h4>
                      {h.tot_hhmembers && (
                        <>
                          <strong>Total Members:</strong> {h.tot_hhmembers}
                          <br />
                        </>
                      )}
                      {h.hhh_sex !== undefined && (
                        <>
                          <strong>Head Gender:</strong>{" "}
                          {h.hhh_sex === 1 ? "Female" : "Male"}
                          <br />
                        </>
                      )}
                      {h.education_level_encoded !== undefined && (
                        <>
                          <strong>Education Level:</strong>{" "}
                          {h.education_level_encoded}
                          <br />
                        </>
                      )}
                    </div>

                    {/* Agriculture & Livestock */}
                    {(h.Land_size_for_Crop_Agriculture_Acres ||
                      h.farm_implements_owned) && (
                      <div style={{ marginBottom: "12px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                          Agriculture & Livestock
                        </h4>
                        {h.Land_size_for_Crop_Agriculture_Acres !==
                          undefined && (
                          <>
                            <strong>Farm Size:</strong>{" "}
                            {h.Land_size_for_Crop_Agriculture_Acres} acres
                            <br />
                          </>
                        )}
                        {h.farm_implements_owned && (
                          <>
                            <strong>Farm Implements:</strong>{" "}
                            {h.farm_implements_owned}
                            <br />
                          </>
                        )}
                      </div>
                    )}

                    {/* Crops Grown */}
                    {(h.maize ||
                      h.ground_nuts ||
                      h.sweet_potatoes ||
                      h.cassava ||
                      h.sorghum ||
                      h.irish_potatoes ||
                      h.perennial_crops_grown_food_banana ||
                      h.perennial_crops_grown_coffee) && (
                      <div style={{ marginBottom: "12px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                          Crops Grown
                        </h4>
                        {h.maize === 1 && (
                          <>
                            Maize
                            <br />
                          </>
                        )}
                        {h.ground_nuts === 1 && (
                          <>
                            Ground Nuts
                            <br />
                          </>
                        )}
                        {h.sweet_potatoes === 1 && (
                          <>
                            Sweet Potatoes
                            <br />
                          </>
                        )}
                        {h.cassava === 1 && (
                          <>
                            Cassava
                            <br />
                          </>
                        )}
                        {h.sorghum === 1 && (
                          <>
                            Sorghum
                            <br />
                          </>
                        )}
                        {h.irish_potatoes === 1 && (
                          <>
                            Irish Potatoes
                            <br />
                          </>
                        )}
                        {h.perennial_crops_grown_food_banana === 1 && (
                          <>
                            Food Banana
                            <br />
                          </>
                        )}
                        {h.perennial_crops_grown_coffee === 1 && (
                          <>
                            Coffee
                            <br />
                          </>
                        )}
                      </div>
                    )}

                    {/* Water & Sanitation */}
                    {/* {(h.Average_Water_Consumed_Per_Day || h.hh_water_collection_Minutes || h.tippy_tap_present || h.soap_ash_present) && (
                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Water & Sanitation</h4>
                        {h.Average_Water_Consumed_Per_Day && <><strong>Water Consumed/Day:</strong> {h.Average_Water_Consumed_Per_Day}<br /></>}
                        {h.hh_water_collection_Minutes !== undefined && <><strong>Water Collection Time:</strong> {h.hh_water_collection_Minutes} min<br /></>}
                        {h.tippy_tap_present !== undefined && <><strong>Tippy Tap:</strong> {formatBoolean(h.tippy_tap_present)}<br /></>}
                        {h.soap_ash_present !== undefined && <><strong>Soap/Ash Present:</strong> {formatBoolean(h.soap_ash_present)}<br /></>}
                      </div>
                    )} */}

                    {/* Economic Activities */}
                    {(h.business_participation || h.vsla_participation) && (
                      <div style={{ marginBottom: "12px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                          Economic Activities
                        </h4>
                        {h.business_participation !== undefined && (
                          <>
                            <strong>Business Participation:</strong>{" "}
                            {formatBoolean(h.business_participation)}
                            <br />
                          </>
                        )}
                        {h.vsla_participation !== undefined && (
                          <>
                            <strong>VSLA Participation:</strong>{" "}
                            {formatBoolean(h.vsla_participation)}
                            <br />
                          </>
                        )}
                      </div>
                    )}

                    {/* Health Access */}
                    {h.Distance_travelled_one_way_OPD_treatment !==
                      undefined && (
                      <div style={{ marginBottom: "12px" }}>
                        <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                          Health Access
                        </h4>
                        <strong>Distance to OPD:</strong>{" "}
                        {h.Distance_travelled_one_way_OPD_treatment}
                        <br />
                      </div>
                    )}

                    {/* Other Features */}
                    <div>
                      <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
                        Other Features
                      </h4>
                      {h.composts_num !== undefined && (
                        <>
                          <strong>Composts:</strong> {h.composts_num}
                          <br />
                        </>
                      )}
                      {h.hh_produce_lq_manure !== undefined && (
                        <>
                          <strong>Produces Liquid Manure:</strong>{" "}
                          {formatBoolean(h.hh_produce_lq_manure)}
                          <br />
                        </>
                      )}
                      {h.hh_produce_organics !== undefined && (
                        <>
                          <strong>Produces Organics:</strong>{" "}
                          {formatBoolean(h.hh_produce_organics)}
                          <br />
                        </>
                      )}
                      {h.non_bio_waste_mgt_present !== undefined && (
                        <>
                          <strong>Waste Management:</strong>{" "}
                          {formatBoolean(h.non_bio_waste_mgt_present)}
                          <br />
                        </>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Map rendering error:", error);
    return (
      <div className="bg-white rounded-md shadow-md p-6 mb-6 h-[500px] flex items-center justify-center text-red-500">
        Map failed to load:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }
};

export default HouseholdMap;
