import uuid
from datetime import datetime
from typing import Dict

class BookingSystem:
    def __init__(self, planner):
        self.planner = planner

    def book_ticket(self, user_name: str, start: str, end: str, route: Dict) -> str:
        booking_id = str(uuid.uuid4())
        self.bookings.append({
            "id": booking_id,
            "user": user_name,
            "start": start,
            "end": end,
            "route": route,
            "timestamp": datetime.now().isoformat(),
            "status": "confirmed"
        })
        return booking_id

    def show_booking(self, booking_id: str) -> Dict:
        for booking in self.bookings:
            if booking["id"] == booking_id:
                return booking
        return {}
