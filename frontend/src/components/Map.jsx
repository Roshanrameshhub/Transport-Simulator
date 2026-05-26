import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { planRoute } from '../api/transportApi';

export default function Map({ setRouteData }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [mode, setMode] = useState('');
  const [preferCost, setPreferCost] = useState(false);

  const handlePlan = async () => {
    const res = await planRoute({
      start,
      end,
      selected_mode: mode,
      prefer_cost: preferCost
    });
    setRouteData(res);
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl">

      <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
        🚏 Smart Route Planner
      </h2>

      {/* Input Form */}
      <div className="grid grid-cols-2 gap-4">

        <div className="col-span-1">
          <label className="font-semibold text-gray-700">Start</label>
          <input
            placeholder="Enter starting point"
            value={start}
            onChange={e => setStart(e.target.value)}
            className="p-3 mt-1 border rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="col-span-1">
          <label className="font-semibold text-gray-700">Destination</label>
          <input
            placeholder="Enter destination"
            value={end}
            onChange={e => setEnd(e.target.value)}
            className="p-3 mt-1 border rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Mode Selection */}
        <div className="col-span-2">
          <label className="font-semibold text-gray-700">Transport Mode</label>
          <select
            onChange={e => setMode(e.target.value)}
            className="p-3 mt-1 border rounded-lg w-full focus:ring-2 focus:ring-blue-400 bg-white"
          >
            <option value="">🚀 Best Mode</option>
            <option value="metro">🚇 Metro</option>
            <option value="bus">🚌 Bus</option>
            <option value="car">🚗 Car</option>
            <option value="rapido">🏍️ Rapido</option>
          </select>
        </div>

        {/* Checkbox */}
        <div className="col-span-2 flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            checked={preferCost}
            onChange={() => setPreferCost(!preferCost)}
            className="w-4 h-4"
          />
          <span className="text-gray-700 font-medium">Prefer Cost over Time</span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={handlePlan}
        className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg transition-all"
      >
        🔍 Plan Smart Route
      </button>

      {/* Map */}
      <div className="mt-6 rounded-xl overflow-hidden border border-gray-300 shadow-md">
        <MapContainer
          center={[13.0827, 80.2707]}
          zoom={11}
          style={{ height: 300, width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>

    </div>
  );
}
