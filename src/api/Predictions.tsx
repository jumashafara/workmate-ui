import { Features } from "../types/features";
import { PredictionResult } from "../types/prediction_result";

const getPrediction = async (features: Features): Promise<PredictionResult> => {
    const response = await fetch(
        "http://localhost:8000/api/single-prediction/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(features),
        }
    );
    const data = await response.json();

    console.log(data)
    return data.data;
};

export default getPrediction;