/**
 * TypeScript interfaces aligned with backend/api/schemas.py and openapi.json.
 * Single source of truth: openapi.json (mirrors FastAPI Swagger).
 */

export interface SegmentDetail {
  from: string;
  to: string;
  distance_km: number;
  mode: string;
  mode_name: string;
  time_mins: number;
  cost: number;
}

export interface RouteResponse {
  path: string[];
  total_cost: number;
  total_time: number;
  transport_modes_used: string[];
  arrival_time: string;
  detailed_segments: SegmentDetail[];
}

export interface PlanRouteParams {
  start: string;
  end: string;
  prefer_cost: boolean;
  prefer_time: boolean;
  selected_mode?: string;
  time_weight: number;
  cost_weight: number;
}

export interface BookingRequest {
  user: string;
  start: string;
  end: string;
  selected_mode?: string | null;
  prefer_cost?: boolean;
  prefer_time?: boolean;
  time_weight?: number;
  cost_weight?: number;
}

export interface BookingResponse {
  booking_id: string;
  status: string;
  path: string[];
  transport_modes_used: string[];
  total_cost: number;
  total_time: number;
}

export interface ApiErrorBody {
  detail?: string | { msg: string; type: string }[];
}
