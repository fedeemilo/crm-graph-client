import React from "react";

const Loading = () => {
  return (
    <div className="border border-gray-700 shadow rounded-md p-4 max-w-sm w-full h-80 mx-auto mt-20 mb-20">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-800 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            <div className="h-4 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
      <div className="animate-pulse flex space-x-4 mt-10">
        <div className="rounded-full bg-gray-800 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded"></div>
            <div className="h-4 bg-gray-800 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
