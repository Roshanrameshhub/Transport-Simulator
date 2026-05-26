from pydantic import BaseModel, Field
from typing import List, Optional

class SegmentDetail(BaseModel):
    from_node: str = Field(..., alias="from") # Use alias for 'from'
    to: str
    distance_km: float
    mode: str
    mode_name: str
    time_mins: float
    cost: float

# For /route/plan request
class RouteRequest(BaseModel):
    start: str
    end: str
    selected_mode: Optional[str] = None  # e.g., 'bus', 'metro', etc.
    prefer_cost: Optional[bool] = False
    prefer_time: Optional[bool] = True
    time_weight: Optional[float] = 0.5
    cost_weight: Optional[float] = 0.5

# For /route/plan response
class RouteResponse(BaseModel):
    path: List[str] # Now derived from detailed_segments
    total_cost: float
    total_time: float
    transport_modes_used: List[str] # Now derived from detailed_segments
    arrival_time: str
    detailed_segments: List[SegmentDetail] # New field for detailed segments

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
