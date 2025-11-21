from planner import RoutePlanner
from data_loader import create_synthetic_chennai_map

city = create_synthetic_chennai_map()
planner = RoutePlanner(city)
planner.generate_availability()

print("Landmarks:\n", ", ".join(sorted(city.landmarks)))
start = input("Enter start: ").strip()
end = input("Enter destination: ").strip()

prefer_cost = input("Prefer cost over time? (y/n): ").strip().lower() == 'y'
selected_mode = input("Preferred mode (bus/metro/car/rapido or blank): ").strip().lower()
if selected_mode == "":
    selected_mode = None

route = planner.find_best_route(start, end, prefer_cost=prefer_cost, selected_mode=selected_mode)

if "error" in route:
    print("No route found.")
else:
    print("Path:", " -> ".join(route["path"]))
    print("Time:", route["total_time_minutes"], "mins")
    print("Cost:", route["total_cost"], "Rs")
