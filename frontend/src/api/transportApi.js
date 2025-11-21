const API = 'http://localhost:8000';

// ✅ Fix: planRoute uses GET with query parameters
export async function planRoute({ start, end, prefer_cost, prefer_time, selected_mode, time_weight, cost_weight }) {
  const query = new URLSearchParams({
    start,
    end,
    prefer_cost,
    prefer_time,
    selected_mode,
    time_weight,
    cost_weight
  });

  const res = await fetch(`${API}/route/plan?${query.toString()}`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }

  return res.json();
}

// ✅ Booking stays as POST
export async function createBooking(data) {
  const res = await fetch(`${API}/booking/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    throw new Error(`Error: ${res.status}`);
  }

  return res.json();
}
