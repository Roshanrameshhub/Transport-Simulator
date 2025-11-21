import React, { useState } from 'react';
import { createBooking } from '../api/transportApi';

export default function BookingForm({ route }) {
  const [user, setUser] = useState('');
  const [bookingId, setBookingId] = useState(null);

  const handleBooking = async () => {
    const result = await createBooking({ user, start: route.path[0], end: route.path.slice(-1)[0] });
    setBookingId(result.booking_id);
  };

  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-2">Booking</h2>
      <input placeholder="Enter your name" value={user} onChange={e => setUser(e.target.value)} className="p-2 border mb-2 w-full" />
      <button onClick={handleBooking} className="bg-green-500 text-white px-4 py-2 rounded">Book Ticket</button>
      {bookingId && <p className="mt-2 text-green-700">✅ Booking ID: {bookingId}</p>}
    </div>
  );
}
