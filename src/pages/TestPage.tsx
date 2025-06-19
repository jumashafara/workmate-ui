import React from "react"
import HouseholdMap from "../components/Maps/HouseholdMap"

const households = [
    {
        household_id: "KYE-MAB-JUS-F-153844-9",
        village: "Kyawaako",
        latitude: 0.7064187,
        longitude: 30.4511119,
        prediction: 0, // Poor - will be red
        predicted_income: 0.8838504935884284,
        region: "Western",
        district: "Kyenjojo",
        cluster: "Kasenyi",
        altitude: 1413.9,
        standard_evaluation: true,
        checkin_evaluation: false,
        cohort: "2024.0",
        cycle: "B",
        evaluation_month: 6,
        Land_size_for_Crop_Agriculture_Acres: 0,
        farm_implements_owned: 3,
        tot_hhmembers: 4,
        Distance_travelled_one_way_OPD_treatment: 0,
        Average_Water_Consumed_Per_Day: 2,
        hh_water_collection_Minutes: 0,
        vsla_participation: 1,
        ground_nuts: 0,
        composts_num: 0,
        perennial_crops_grown_food_banana: 0,
        sweet_potatoes: 0,
        perennial_crops_grown_coffee: 0,
        irish_potatoes: 0,
        business_participation: 0,
        cassava: 0,
        hh_produce_lq_manure: 0,
        hh_produce_organics: 0,
        maize: 1,
        sorghum: 0,
        non_bio_waste_mgt_present: 0,
        soap_ash_present: 0,
        education_level_encoded: 0,
        tippy_tap_present: 0,
        hhh_sex: 0,
        probability: 0.5,
    },
    {
        household_id: "KYE-MAB-JUS-F-153844-10",
        village: "Kichwamba",
        latitude: 0.7164187,
        longitude: 30.4611119,
        prediction: 1, // Non-poor - will be green
        predicted_income: 2.5438504935884284,
        region: "Western",
        district: "Kyenjojo",
        cluster: "Kasenyi",
        altitude: 1500.2,
        standard_evaluation: true,
        checkin_evaluation: false,
        cohort: "2024.0",
        cycle: "B",
        evaluation_month: 6,
        Land_size_for_Crop_Agriculture_Acres: 2.5,
        farm_implements_owned: 8,
        tot_hhmembers: 6,
        Distance_travelled_one_way_OPD_treatment: 5,
        Average_Water_Consumed_Per_Day: 5,
        hh_water_collection_Minutes: 15,
        vsla_participation: 1,
        ground_nuts: 1,
        composts_num: 2,
        perennial_crops_grown_food_banana: 1,
        sweet_potatoes: 1,
        perennial_crops_grown_coffee: 1,
        irish_potatoes: 0,
        business_participation: 1,
        cassava: 1,
        hh_produce_lq_manure: 1,
        hh_produce_organics: 1,
        maize: 1,
        sorghum: 0,
        non_bio_waste_mgt_present: 1,
        soap_ash_present: 1,
        education_level_encoded: 2,
        tippy_tap_present: 1,
        hhh_sex: 1,
        probability: 0.8,
    },
    {
        household_id: "KYE-MAB-JUS-F-153844-11",
        village: "Kyabandara",
        latitude: 0.6964187,
        longitude: 30.4411119,
        prediction: 0, // Poor - will be red
        predicted_income: 1.2438504935884284,
        region: "Western",
        district: "Kyenjojo",
        cluster: "Kasenyi",
        altitude: 1380.5,
        standard_evaluation: true,
        checkin_evaluation: true,
        cohort: "2024.0",
        cycle: "A",
        evaluation_month: 3,
        Land_size_for_Crop_Agriculture_Acres: 0.5,
        farm_implements_owned: 1,
        tot_hhmembers: 3,
        Distance_travelled_one_way_OPD_treatment: 10,
        Average_Water_Consumed_Per_Day: 1,
        hh_water_collection_Minutes: 45,
        vsla_participation: 0,
        ground_nuts: 0,
        composts_num: 0,
        perennial_crops_grown_food_banana: 0,
        sweet_potatoes: 0,
        perennial_crops_grown_coffee: 0,
        irish_potatoes: 0,
        business_participation: 0,
        cassava: 0,
        hh_produce_lq_manure: 0,
        hh_produce_organics: 0,
        maize: 0,
        sorghum: 1,
        non_bio_waste_mgt_present: 0,
        soap_ash_present: 0,
        education_level_encoded: 0,
        tippy_tap_present: 0,
        hhh_sex: 0,
        probability: 0.3,
    }
];

export const Map = () => {
    console.log("TestPage - Map component rendering");
    
    return (
        <div style={{ width: "100%", minHeight: "100vh", padding: "20px", backgroundColor: "#f0f0f0" }}>
            <h1 style={{ color: "black", fontSize: "24px", marginBottom: "20px" }}>
                Test Page - Interactive Map (Red = Poor, Green = Non-Poor)
            </h1>
            <p style={{ color: "black", marginBottom: "20px" }}>
                Showing {households.length} household(s) on the map below. Click markers for detailed information.
            </p>
            
            {/* Enable the actual map component */}
            <HouseholdMap households={households} />
            
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "white", borderRadius: "5px" }}>
                <h3 style={{ color: "black", marginBottom: "10px" }}>Legend:</h3>
                <p style={{ color: "red" }}>🔴 Red dots = Poor households (prediction = 0)</p>
                <p style={{ color: "green" }}>🟢 Green dots = Non-poor households (prediction = 1)</p>
                <p style={{ color: "black", marginTop: "10px" }}>
                    Total households: {households.length} | 
                    Poor: {households.filter(h => h.prediction === 0).length} | 
                    Non-poor: {households.filter(h => h.prediction === 1).length}
                </p>
            </div>
        </div>
    );
};
    

