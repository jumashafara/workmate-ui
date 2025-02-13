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
  const [sortField, setSortField] =
    React.useState<keyof ClusterStat>("district");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "asc"
  );
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

  const handleSort = (field: keyof ClusterStat) => {
    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);

    const sortedStats = [...clusterStats].sort((a, b) => {
      if (field === "avg_prediction" || field === "avg_income") {
        return sortDirection === "asc"
          ? a[field] - b[field]
          : b[field] - a[field];
      }
      return sortDirection === "asc"
        ? String(a[field]).localeCompare(String(b[field]))
        : String(b[field]).localeCompare(String(a[field]));
    });

    setClusterStats(sortedStats);
  };

  const getSortIcon = (field: keyof ClusterStat) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // Calculate pagination values
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = clusterStats.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(clusterStats.length / rowsPerPage);

  return (
    <div className="">
      {/* <h3 >Cluster Statistics</h3> */}
      <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 shadow-md rounded-sm">
        <div className="max-h-80 overflow-y-auto ">
          {" "}
          {/* Enables vertical scrolling */}
          <table className="min-w-full table-auto dark:bg-gray-800 ">
            <thead className="bg-gray-200 sticky top-0 dark:bg-gray-800">
              {" "}
              {/* Sticky header */}
              <tr>
                <th
                  className="px-6 py-3 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSort("district")}
                >
                  District {getSortIcon("district")}
                </th>
                <th
                  className="px-6 py-3 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSort("cluster")}
                >
                  Cluster {getSortIcon("cluster")}
                </th>
                <th
                  className="px-6 py-3 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSort("evaluation_month")}
                >
                  Evaluation Month {getSortIcon("evaluation_month")}
                </th>
                <th
                  className="px-6 py-3 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSort("avg_prediction")}
                >
                  Percentage Predicted {getSortIcon("avg_prediction")}
                </th>
                <th
                  className="px-6 py-3 uppercase tracking-wider text-center cursor-pointer hover:bg-gray-300"
                  onClick={() => handleSort("avg_income")}
                >
                  Predicted Income + Production {getSortIcon("avg_income")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800">
              {currentRows.map((stat, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 hover:dark:bg-gray-700 transition-colors"
                >
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
      <div className="flex justify-around items-center mt-4">
        <button
          className={`px-4 py-2 rounded-sm ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
              : "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
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
          className={`px-4 py-2 rounded-sm ${
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
