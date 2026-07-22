"use client";

import { useGetReviews } from "@/lib/hooks/dashboard/useGetReviews";
import React, { useState } from "react";

const ReviewTable = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
  } = useGetReviews(currentPage, 10);


  if (isLoading) {
    return <div className="p-5">Loading reviews...</div>;
  }


  if (isError) {
    return <div className="p-5 text-red-500">Failed to load reviews</div>;
  }


  const reviews = data?.data || [];

  const totalPages = data?.pagination.totalPages || 1;


  return (
    <div className="overflow-x-auto rounded-xl bg-white dark:bg-gray-900 shadow-md">

      <table className="min-w-full">

        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">

            {[
               "ID",
               "Rating",
               "Comment",
               "Status",
               "Date",
               "User ID",
               "Listing ID",
               
            ].map((head) => (
              <th
                key={head}
                className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-200"
              >
                {head}
              </th>
            ))}

          </tr>
        </thead>


        <tbody>

          {reviews.map((review, index) => (

            <tr
              key={review.id}
              className={`
                transition hover:bg-gray-100 dark:hover:bg-gray-700
                ${
                  index % 2 === 0
                    ? "bg-white "
                    : "bg-gray-50"
                }
              `}
            >

              <td className="px-6 py-4 text-sm">
                {review.id}
              </td>




              <td className="px-6 py-4 text-sm">
                <span className="text-yellow-500">
                  ★
                </span>{" "}
                {review.rating}/5
              </td>


              <td className="px-6 py-4 max-w-xs text-sm text-gray-600 dark:text-gray-300">
                {review.comment}
              </td>


              <td className="px-6 py-4">

                <span
                  className={`
                    rounded-full px-3 py-1 text-xs font-medium

                    ${
                      review.status === "Approved"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : review.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }
                  `}
                >
                  {review.status}
                </span>

              </td>


              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                {new Date(review.created_at).toLocaleDateString()}
              </td>
                    
              <td className="px-6 py-4 text-sm">
                {review.user_id}
              </td>


              <td className="px-6 py-4 text-sm">
                {review.listing_id}
              </td>

            </tr>

          ))}

        </tbody>

      </table>



      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 my-6">


        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="
            px-4 py-2 rounded-lg
            bg-white dark:bg-gray-800
            shadow-sm
            text-sm
            disabled:opacity-40
          "
        >
          Previous
        </button>



        <div className="flex gap-2">

          {Array.from({ length: totalPages }).map((_, index) => (

            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`
                w-10 h-10 rounded-lg shadow-sm

                ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800"
                }
              `}
            >
              {index + 1}
            </button>

          ))}

        </div>



        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="
            px-4 py-2 rounded-lg
            bg-white dark:bg-gray-800
            shadow-sm
            text-sm
            disabled:opacity-40
          "
        >
          Next
        </button>


      </div>

    </div>
  );
};

export default ReviewTable;