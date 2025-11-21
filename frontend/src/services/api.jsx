const API = 'http://localhost:8000';

export async function planRoute(data) {
  return fetch(`${API}/route/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
}
