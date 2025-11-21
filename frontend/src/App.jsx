import React, { useState } from 'react';
import Map from './components/Map.jsx';
import RouteInfo from './components/RouteInfo.jsx';
import BookingForm from './components/BookingForm.jsx';
import './styles/app.css';
import { planRoute } from './services/api'; // ✅ Import the API function

function App() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    const response = await planRoute({
      start,
      end,
      prefer_cost: true,
      prefer_time: false,
      selected_mode: null,
      time_weight: 0.5,
      cost_weight: 0.5
    });

    setResult(response); // ✅ Display or use result
    console.log('Response:', response);
  };

  return (
    <div>
      <input value={start} onChange={e => setStart(e.target.value)} placeholder="Start" />
      <input value={end} onChange={e => setEnd(e.target.value)} placeholder="End" />
      <button onClick={handleSubmit}>Plan Route</button>

      {result && (
        <div>
          <p>Path: {result.path.join(' → ')}</p>
          <p>Total Cost: ₹{result.total_cost}</p>
          <p>Total Time: {result.total_time} mins</p>
        </div>
      )}
    </div>
  );
}

export default App;
