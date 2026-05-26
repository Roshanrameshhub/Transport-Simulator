import datetime
from fastapi import APIRouter, HTTPException, Query
from .schemas import RouteRequest, RouteResponse, BookingRequest, BookingResponse
from planner import RoutePlanner
from booking import BookingSystem
from data_loader import create_synthetic_chennai_map as create_city_map
import traceback

router = APIRouter()

# Initialize data and services
city_map = create_city_map()
planner = RoutePlanner(city_map)
booking_system = BookingSystem(planner)

# Generate transport availability
planner.generate_availability()

# ✅ Route: /route/plan changed to GET with query parameters
@router.get("/route/plan", response_model=RouteResponse)
def plan_route(
    start: str = Query(...),
    end: str = Query(...),
    prefer_cost: bool = Query(True),
    prefer_time: bool = Query(False),
    selected_mode: str = Query("any"),
    time_weight: float = Query(1.0),
    cost_weight: float = Query(1.0)
):
    try:
        # If selected_mode is an empty string, treat it as "any"
        if selected_mode == "":
            selected_mode = "any"

        print("🔍 Route request received:", start, end)
        print("📌 Available landmarks:", list(planner.city_map.graph.keys()))

        result = planner.find_best_route(
            start=start,
            end=end,
            prefer_cost=prefer_cost,
            prefer_time=prefer_time,
            selected_mode=selected_mode,
            time_weight=time_weight,
            cost_weight=cost_weight
        )

        if not result:
            raise HTTPException(status_code=404, detail="No route found")

        print("✅ Route found:", result)

        # Calculate estimated arrival time dynamically
        # Assuming current time as departure time
        departure_time = datetime.datetime.now()
        # Add total_time (in minutes) to departure_time
        arrival_time = departure_time + datetime.timedelta(minutes=result['total_time'])

        return RouteResponse(
            path=result['path'],
            total_cost=result['total_cost'],
            total_time=result['total_time'],
            transport_modes_used=result['transport_modes_used'],
            arrival_time=arrival_time.isoformat(), # Convert to ISO format string
            detailed_segments=result['detailed_segments']
        )

    except ValueError as ve:
        print("❗ ValueError:", str(ve))
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as e:
        print("🔥 Internal Server Error:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error")


# Route: /booking/create
@router.post("/booking/create", response_model=BookingResponse)
def create_booking(request: BookingRequest):
    try:
        print("🧾 Booking request received:", request)

        route_info = planner.find_best_route(
            start=request.start,
            end=request.end,
            prefer_cost=request.prefer_cost,
            prefer_time=request.prefer_time,
            selected_mode=request.selected_mode,
            time_weight=request.time_weight,
            cost_weight=request.cost_weight
        )

        if not route_info:
            raise HTTPException(status_code=404, detail="Could not find a valid route for booking.")

        booking_id = booking_system.book_ticket(
            user_name=request.user,
            start=request.start,
            end=request.end,
            route_info=route_info
        )

        print("✅ Booking created:", booking_id)

        return BookingResponse(
            booking_id=booking_id,
            status="Booked successfully",
            path=route_info['path'],
            transport_modes_used=route_info['transport_modes_used'],
            total_cost=route_info['total_cost'],
            total_time=route_info['total_time']
        )
    except Exception as e:
        print("🔥 Booking Error:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error during booking")


# Route: /booking/{booking_id}
@router.get("/booking/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: str):
    try:
        print("🔍 Fetching booking:", booking_id)
        booking = booking_system.show_booking(booking_id)

        if isinstance(booking, str):
            raise HTTPException(status_code=404, detail=booking)

        return BookingResponse(
            booking_id=booking['booking_id'],
            status="Found",
            path=booking['path'],
            transport_modes_used=booking['modes'],
            total_cost=booking['total_cost'],
            total_time=booking['total_time']
        )
    except Exception as e:
        print("🔥 Fetch Booking Error:", str(e))
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error fetching booking")

