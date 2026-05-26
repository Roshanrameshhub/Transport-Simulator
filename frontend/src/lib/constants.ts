/** Chennai landmarks from backend data_loader.py */
export const CHENNAI_LANDMARKS = [
  'Chennai Central', 'Egmore', 'CMBT', 'T Nagar', 'Velachery', 'Adyar',
  'Guindy', 'Nungambakkam', 'Kilpauk', 'Kodambakkam', 'Saidapet',
  'Thiruvanmiyur', 'Besant Nagar', 'Tambaram', 'Chromepet', 'Pallavaram',
  'Meenambakkam', 'Porur', 'Anna Nagar', 'Vadapalani', 'Ashok Nagar',
  'Koyambedu', 'Ambattur', 'Avadi', 'Poonamallee', 'Mylapore',
  'Mandaveli', 'Teynampet', 'Triplicane', 'Royapettah', 'Perambur',
  'Vyasarpadi', 'Washermanpet', 'Royapuram', 'Manali', 'Minjur',
  'Red Hills', 'Kolathur', 'Villivakkam', 'Thirumangalam', 'Mogappair',
  'Iyyapanthangal', 'Maduravoyal', 'Alandur', 'St Thomas Mount',
  'Purasaiwalkam', 'Broadway', 'Parrys', 'Sholinganallur', 'Siruseri',
] as const;

export const TRANSPORT_MODES = [
  'Best Available',
  'bus',
  'metro',
  'car',
  'rapido',
  'taxi',
] as const;

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const ROUTE_PLAN_QUERY_KEYS = [
  'start',
  'end',
  'prefer_cost',
  'prefer_time',
  'selected_mode',
  'time_weight',
  'cost_weight',
] as const;
