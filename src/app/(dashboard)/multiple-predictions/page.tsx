"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Download } from "lucide-react";
import { API_ENDPOINT } from "@/utils/endpoints";

interface PredictionResult {
  district: string;
  cluster: string;
  prediction: number;
  probability?: number;
  predicted_income?: number;
  [key: string]: any;
}

interface AggregatedData {
  [district: string]: {
    [cluster: string]: {
      mean_prediction: number;
      total: number;
    };
  };
}

export default function MultiplePredictionsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setMessage("");
      setPredictions([]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file first.");
      setMessageType("error");
      return;
    }

    // Validate file type
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
      setMessage("Please select a CSV or Excel file.");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setUploading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_ENDPOINT}/many-predictions/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setMessage("File uploaded and processed successfully!");
      setMessageType("success");

      if (data["prediction-objects"]) {
        setPredictions(data["prediction-objects"]);
      }
    } catch (error: any) {
      setMessage(`Failed to upload file: ${error.message || "Unknown error"}`);
      setMessageType("error");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setMessage("");
      setPredictions([]);
    }
  };

  // Function to aggregate predictions by district and cluster
  const aggregatePredictions = (): AggregatedData => {
    const aggregated: AggregatedData = {};

    predictions.forEach((item) => {
      const district = item.district || "Unknown District";
      const cluster = item.cluster || "Unknown Cluster";
      const prediction = item.prediction;

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
        aggregated[district][cluster].mean_prediction /=
          aggregated[district][cluster].total;
      });
    });

    return aggregated;
  };

  const aggregatedData = aggregatePredictions();

  // Export functionality
  const exportResults = () => {
    const csv = [
      "District,Cluster,Total Predictions,Mean Prediction,Achievement Rate (%)",
      ...Object.entries(aggregatedData).flatMap(([district, clusters]) =>
        Object.entries(clusters).map(([cluster, data]) =>
          `${district},${cluster},${data.total},${data.mean_prediction.toFixed(3)},${(data.mean_prediction * 100).toFixed(1)}`
        )
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prediction_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Multiple Predictions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Upload a CSV or Excel file to generate predictions for multiple households at once.
        </p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Data File
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag and Drop Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium">
                {selectedFile ? selectedFile.name : "Drop your file here or click to browse"}
              </p>
              <p className="text-sm text-gray-500">
                Supports CSV and Excel files. Maximum file size: 10MB
              </p>
            </div>
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="mt-4 max-w-xs mx-auto"
            />
          </div>

          {/* File Info and Upload Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {selectedFile && (
                <>
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </>
              )}
            </div>
            
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Process
                </>
              )}
            </Button>
          </div>

          {/* Status Message */}
          {message && (
            <Alert variant={messageType === "error" ? "destructive" : "default"}>
              {messageType === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* File Format Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>File Format Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your file should contain the following columns with household data:
            </p>
            <div className="grid gap-2 text-sm">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium">Required Fields:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>household_id</li>
                    <li>region</li>
                    <li>district</li>
                    <li>cluster</li>
                    <li>cohort</li>
                    <li>cycle</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Numeric Features:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Land_size_for_Crop_Agriculture_Acres</li>
                    <li>tot_hhmembers</li>
                    <li>farm_implements_owned</li>
                    <li>evaluation_month</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Boolean Features:</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>vsla_participation (true/false)</li>
                    <li>business_participation (true/false)</li>
                    <li>maize (true/false)</li>
                    <li>ground_nuts (true/false)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {predictions.length > 0 && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-orange-600">
                    {predictions.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Predictions</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-blue-600">
                    {Object.keys(aggregatedData).length}
                  </div>
                  <div className="text-sm text-gray-600">Districts</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.values(aggregatedData).reduce((total, district) => 
                      total + Object.keys(district).length, 0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">Clusters</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {predictions.filter(p => p.prediction === 1).length}
                  </div>
                  <div className="text-sm text-gray-600">Achieved</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Aggregated Results */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Aggregated Prediction Results</CardTitle>
                <Button onClick={exportResults} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(aggregatedData).map(([district, clusters]) => (
                  <div key={district}>
                    <h3 className="text-lg font-semibold mb-3 text-orange-600">
                      {district}
                    </h3>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cluster</TableHead>
                            <TableHead className="text-right">Total Predictions</TableHead>
                            <TableHead className="text-right">Mean Prediction</TableHead>
                            <TableHead className="text-right">Achievement Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(clusters).map(([cluster, data]) => (
                            <TableRow key={cluster}>
                              <TableCell className="font-medium">{cluster}</TableCell>
                              <TableCell className="text-right">{data.total}</TableCell>
                              <TableCell className="text-right">
                                {data.mean_prediction.toFixed(3)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge 
                                  variant={data.mean_prediction > 0.5 ? "default" : "secondary"}
                                  className={data.mean_prediction > 0.5 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                                >
                                  {(data.mean_prediction * 100).toFixed(1)}%
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {predictions.length === 0 && !uploading && (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No predictions generated yet
            </h3>
            <p className="text-gray-500">
              Upload a file with household data to generate batch predictions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}