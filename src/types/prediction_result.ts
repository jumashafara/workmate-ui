export interface PredictionResult {
    prediction: Number; // Binary classification result (0 or 1)
    predicted_income_production: number; // Regression model prediction (or placeholder '-')
    probability: number; // Confidence score of the classification
    contributions: Record<string, number>; // Feature name -> Contribution value (for class 1)
  }
  