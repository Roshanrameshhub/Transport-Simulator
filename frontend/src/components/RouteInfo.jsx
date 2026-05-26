// src/components/RouteInfo.jsx

import React from 'react';

export default function RouteInfo({ route }) {
  if (!route) return null;

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl shadow-lg rounded-xl border border-gray-200 transition-all">

      <h2 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
        🗺️ Route Details
      </h2>

      {/* Start & End */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-700">Start</p>
          <p className="text-blue-700 font-bold">{route.path?.[0]}</p>
        </div>

        <div className="p-3 bg-green-50 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-700">End</p>
          <p className="text-green-700 font-bold">{route.path?.[route.path.length - 1]}</p>
        </div>
      </div>

      {/* Path display */}
      <div className="mb-4">
        <p className="text-gray-700 font-semibold mb-1">Path</p>
        <p className="text-gray-800 font-medium bg-gray-50 p-3 rounded-lg shadow-inner">
          {route.path?.join(" → ")}
        </p>
      </div>

      {/* Modes */}
      <div className="mb-4">
        <p className="text-gray-700 font-semibold mb-1">Modes Used</p>
        <div className="flex flex-wrap gap-2">
          {route.transport_modes_used?.map((mode, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-700 font-semibold rounded-full shadow-sm"
            >
              🚗 {mode}
            </span>
          ))}
        </div>
      </div>

      {/* Time + Cost */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-yellow-50 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-700">Total Time</p>
          <p className="text-yellow-700 font-bold">{route.total_time} mins</p>
        </div>

        <div className="p-3 bg-red-50 rounded-lg shadow-sm">
          <p className="font-semibold text-gray-700">Total Cost</p>
          <p className="text-red-700 font-bold">₹{route.total_cost}</p>
        </div>
      </div>

    </div>
  );
}
