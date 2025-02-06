import React, { useState } from "react";
import axios from "axios";

const MultiplePredictionsPage: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [predictions, setPredictions] = useState<any[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        setUploading(true);
        setMessage("");

        try {
            const response = await axios.post("/api/many-predictions/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("File uploaded successfully!");
            console.log("Response:", response.data);

            if (response.data["prediction-objects"]) {
                setPredictions(response.data["prediction-objects"]);
            }
        } catch (error) {
            setMessage("Failed to upload file.");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    // Function to aggregate predictions by district and cluster (using mean)
    const aggregatePredictions = () => {
        const aggregated: { [key: string]: { [key: string]: { mean_prediction: number; total: number } } } = {};

        predictions.forEach((item) => {
            const district = item.district || "Unknown District";
            const cluster = item.cluster || "Unknown Cluster";
            const prediction = item.prediction; // 0 or 1

            if (!aggregated[district]) {
                aggregated[district] = {};
            }

            if (!aggregated[district][cluster]) {
                aggregated[district][cluster] = { mean_prediction: 0, total: 0 };
            }

            aggregated[district][cluster].mean_prediction += prediction;
            aggregated[district][cluster].total += 1;
        });

        // Calculate mean prediction
        Object.keys(aggregated).forEach((district) => {
            Object.keys(aggregated[district]).forEach((cluster) => {
                aggregated[district][cluster].mean_prediction /= aggregated[district][cluster].total;
            });
        });

        return aggregated;
    };

    const aggregatedData = aggregatePredictions();

    return (
        <div className="p-4">
            <div className="border p-3 flex flex-row justify-between">
                <input type="file" onChange={handleFileChange} />
                <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-primary text-white px-4 py-3 rounded-sm"
                >
                    {uploading ? "Uploading..." : "Upload"}
                </button>
            </div>

            <div className="mt-2">{message && <p>{message}</p>}</div>

            {/* Aggregated Prediction Display */}
            <div className="mt-4">
                <h2 className="text-xl font-bold">Aggregated Predictions (Mean)</h2>
                {Object.keys(aggregatedData).length > 0 ? (
                    Object.entries(aggregatedData).map(([district, clusters]) => (
                        <div key={district} className="mt-4">
                            <h3 className="text-lg font-semibold">{district}</h3>
                            <table className="w-full border-collapse border border-gray-300 mt-2">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">Cluster</th>
                                    <th className="border p-2">Total Predictions</th>
                                    <th className="border p-2">Mean Prediction</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(clusters).map(([cluster, data]) => (
                                    <tr key={cluster}>
                                        <td className="border p-2">{cluster}</td>
                                        <td className="border p-2">{data.total}</td>
                                        <td className="border p-2">{data.mean_prediction.toFixed(3)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                ) : (
                    <p>No data available</p>
                )}
            </div>
        </div>
    );
};

export default MultiplePredictionsPage;