import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { planRoute } from '../api/transportApi';

export default function Map({ setRouteData }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [mode, setMode] = useState('');
  const [preferCost, setPreferCost] = useState(false);

  const handlePlan = async () => {
    const res = await planRoute({ start, end, selected_mode: mode, prefer_cost: preferCost });
    setRouteData(res);
  };

  return (
    <div className="mb-4">
      <div className="grid grid-cols-2 gap-4 mb-2">
        <input placeholder="Start" value={start} onChange={e => setStart(e.target.value)} className="p-2 border" />
        <input placeholder="End" value={end} onChange={e => setEnd(e.target.value)} className="p-2 border" />
        <select onChange={e => setMode(e.target.value)} className="col-span-2 p-2 border">
          <option value="">Best mode</option>
          <option value="metro">Metro</option>
          <option value="bus">Bus</option>
          <option value="car">Car</option>
          <option value="rapido">Rapido</option>
        </select>
        <label className="col-span-2 flex items-center gap-2">
          <input type="checkbox" checked={preferCost} onChange={() => setPreferCost(!preferCost)} />
          Prefer Cost over Time
        </label>
      </div>
      <button onClick={handlePlan} className="bg-blue-500 text-white px-4 py-2 rounded">Plan Route</button>

      {/* Optional: Add static map with markers */}
      <MapContainer center={[13.0827, 80.2707]} zoom={11} style={{ height: 300, marginTop: 20 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Later: add dynamic route polyline here */}
      </MapContainer>
    </div>
  );
}
