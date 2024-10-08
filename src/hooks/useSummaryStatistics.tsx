import { useEffect, useState } from 'react';
import {
  SummaryStatistics,
  fetchSummaryStatistics,
} from '../requests/SummaryStatistics';

export const useSummaryStatistics = () => {
  const [data, setData] = useState<SummaryStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const fetchedData = await fetchSummaryStatistics();
        setData(fetchedData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData(); // Initial fetch

    // const intervalId = setInterval(fetchData, 10000); // Poll every 10 seconds

    // return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return { data, loading, error };
};
