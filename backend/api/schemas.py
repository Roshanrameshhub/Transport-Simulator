from pydantic import BaseModel
from typing import List
from typing import Optional


# For /route/plan request
class RouteRequest(BaseModel):
    start: str
    end: str
    selected_mode:Optional[str]= None  # e.g., 'bus', 'metro', etc.
    prefer_cost: Optional[bool] = False
    prefer_time: Optional[bool] = True
    time_weight: Optional[float] = 0.5
    cost_weight: Optional[float] = 0.5

# For /route/plan response
class RouteResponse(BaseModel):
    path: List[str]
    total_cost: float
    total_time: float
    transport_modes_used: List[str]
    arrival_time: str

# For /booking/create request
class BookingRequest(BaseModel):
    user: str
    start: str
    end: str
    selected_mode: Optional[str] = None
    prefer_cost: Optional[bool] = False
    prefer_time: Optional[bool] = True
    time_weight: Optional[float] = 0.5  # NEW
    cost_weight: Optional[float] = 0.5  # NEW

# For both /booking/create and /booking/{id} response
class BookingResponse(BaseModel):
    booking_id: str
    status: str
    path: List[str]
    transport_modes_used: List[str]
    total_cost: float
    total_time: float
