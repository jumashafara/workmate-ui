import { Features } from "../types/features";

const getPrediction = async (features: Features) => {
    const response = await fetch(
        "http://localhost:8000/api/predictions/",
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
    return data;
};

export default getPrediction;