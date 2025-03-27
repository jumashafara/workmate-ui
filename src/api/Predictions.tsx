import { Features } from "../types/features";
import { PredictionResult } from "../types/prediction_result";
import { API_ENDPOINT } from "./endpoints";

const getPrediction = async (features: Features): Promise<PredictionResult> => {
    // Ensure all boolean arrays have at least one element
    const formattedFeatures = { ...features };
    
    console.log("Raw features received by API function:", features);
    
    // Ensure all boolean fields are arrays
    Object.keys(formattedFeatures).forEach(key => {
        const value = formattedFeatures[key as keyof Features];
        if (Array.isArray(value) && value.length === 0) {
            // If it's an empty array, set a default value based on the field type
            if (typeof value[0] === 'boolean' || value[0] === undefined) {
                (formattedFeatures[key as keyof Features] as any) = [false];
            } else if (typeof value[0] === 'number' || value[0] === undefined) {
                (formattedFeatures[key as keyof Features] as any) = [0];
            }
        }
    });
    
    // Ensure evaluation_month is a number, not an array
    if (typeof formattedFeatures.evaluation_month !== 'number') {
        formattedFeatures.evaluation_month = Number(formattedFeatures.evaluation_month) || 1;
    }
    
    // Ensure standard_evaluation and checkin_evaluation are arrays of booleans
    if (!Array.isArray(formattedFeatures.standard_evaluation)) {
        formattedFeatures.standard_evaluation = [Boolean(formattedFeatures.standard_evaluation)];
    }
    
    if (!Array.isArray(formattedFeatures.checkin_evaluation)) {
        formattedFeatures.checkin_evaluation = [Boolean(formattedFeatures.checkin_evaluation)];
    }
    
    // Ensure string fields are not undefined or null
    ['cohort', 'cycle', 'region', 'district', 'village', 'cluster', 'household_id'].forEach(field => {
        if (formattedFeatures[field as keyof Features] === undefined || formattedFeatures[field as keyof Features] === null) {
            (formattedFeatures[field as keyof Features] as any) = '';
        }
        
        // If the string field is present, ensure it's a string
        if (formattedFeatures[field as keyof Features] !== undefined) {
            // Log the field value for debugging
            console.log(`${field} value:`, formattedFeatures[field as keyof Features]);
        }
    });
    
    console.log("Formatted features for prediction:", formattedFeatures);
    
    // Prepare the request body
    const requestBody = JSON.stringify(formattedFeatures);
    console.log("Request body as JSON string:", requestBody);
    
    const response = await fetch(
        `${API_ENDPOINT}/single-prediction/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: requestBody,
        }
    );
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("Prediction API error:", errorText);
        throw new Error(`Prediction failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log("Prediction response:", data);
    return data.data;
};

export default getPrediction;