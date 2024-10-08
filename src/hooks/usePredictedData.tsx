import { useEffect, useState } from 'react';
import { PredictedData, fetchPredictedData } from '../requests/AllData';

export const usePredictedData = () => {
  const [data, setData] = useState<PredictedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedData = await fetchPredictedData();
        setData(fetchedData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching Predicted data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {data, loading, error}
};
