import React from "react";

interface PaginationControlsProps {
  data: any[];
  rows_per_page: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  rows_per_page,
  data,
}) => {
  const [current_page, setCurrentPage] = React.useState(1);
  const index_of_last_row = current_page * rows_per_page;
  const index_Of_first_row = index_of_last_row - rows_per_page;
  const current_rows = data.slice(index_Of_first_row, index_of_last_row);
  const total_pages = Math.ceil(data.length / rows_per_page);

  return (  
    <div className="">
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 rounded-sm ${
            current_page === 1
              ? "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
              : "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          } text-white`}
          onClick={() => setCurrentPage(current_page - 1)}
          disabled={current_page === 1}
        >
          Previous
        </button>

        <span className="text-lg font-medium">
          Page {current_page} of {total_pages}
        </span>

        <button
          className={`px-4 py-2 rounded-sm ${
            current_page === total_pages
              ? "bg-gray-300 cursor-not-allowed dark:bg-gray-600"
              : "bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          } text-white`}
          onClick={() => setCurrentPage(current_page + 1)}
          disabled={current_page === total_pages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
