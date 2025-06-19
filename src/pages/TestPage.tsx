import React from "react"
import HouseholdMap from "../components/Maps/HouseholdMap"

const households = [
    {
        household_id: "KYE-MAB-JUS-F-153844-9",
        village: "Kyawaako",
        latitude: 0.7064187,
        longitude: 30.4511119,
        prediction: 0,
        predicted_income: 0.8838504935884284,
    }
];

export const Map = () => {
    console.log("TestPage - Map component rendering");
    
    return (
        <div style={{ width: "100%", minHeight: "100vh", padding: "20px", backgroundColor: "#f0f0f0" }}>
            <h1 style={{ color: "black", fontSize: "24px", marginBottom: "20px" }}>
                Test Page - Interactive Map
            </h1>
            <p style={{ color: "black", marginBottom: "20px" }}>
                Showing {households.length} household(s) on the map below:
            </p>
            
            {/* Enable the actual map component */}
            <HouseholdMap households={households} />
            
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "white", borderRadius: "5px" }}>
                <h3 style={{ color: "black", marginBottom: "10px" }}>Debug Info:</h3>
                <p style={{ color: "black" }}>Household: {households[0].household_id}</p>
                <p style={{ color: "black" }}>Village: {households[0].village}</p>
                <p style={{ color: "black" }}>Coordinates: {households[0].latitude}, {households[0].longitude}</p>
                <p style={{ color: "black" }}>Prediction: {households[0].prediction}</p>
            </div>
        </div>
    );
};
    

