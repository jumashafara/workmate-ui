import React from "react";

interface ClusterStat {
  district: string;
  cluster: string;
  avg_prediction: number;
  avg_income: number;
  evaluation_month: string;
}

const ClusterStats: React.FC = () => {

  const [clusterStats, setClusterStats] = React.useState<ClusterStat[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 10; // Number of rows per page

  React.useEffect(() => {
    fetchClusterStats();
  }, []);

  const fetchClusterStats = async () => {
    try {
      const response = await fetch("/api/cluster-stats/");
      const data = await response.json();
      setClusterStats(data);
    } catch (error) {
      console.error("Error fetching cluster stats:", error);
    }
  };

  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = clusterStats.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(clusterStats.length / rowsPerPage);


  return (
    <div className="">
      {/* <h3 >Cluster Statistics</h3> */}
      <div className="overflow-x-auto border border-gray-300 shadow-md rounded-sm">
        <div className="max-h-80 overflow-y-auto">
          {" "}
          {/* Enables vertical scrolling */}
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200 sticky top-0">
              {" "}
              {/* Sticky header */}
              <tr>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-center">
                  District
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-center">
                  Cluster
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-center">
                  Evaluation Month
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-center">
                  Average Prediction
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wider text-center">
                  Average Income
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRows.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {stat.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {stat.cluster}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {stat.evaluation_month}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {(stat.avg_prediction * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    ${(stat.avg_income / 3).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white`}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          } text-white`}
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClusterStats;
