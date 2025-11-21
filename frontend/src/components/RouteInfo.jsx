// src/components/RouteInfo.jsx

import React from 'react';

export default function RouteInfo({ route }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Route Information</h2>
      <p><strong>Start:</strong> {route.path?.[0]}</p>
      <p><strong>End:</strong> {route.path?.[route.path.length - 1]}</p>
      <p><strong>Path:</strong> {route.path?.join(' → ')}</p>
      <p><strong>Modes:</strong> {route.transport_modes_used?.join(', ')}</p>
      <p><strong>Total Time:</strong> {route.total_time} mins</p>
      <p><strong>Total Cost:</strong> ₹{route.total_cost}</p>
    </div>
  );
}
