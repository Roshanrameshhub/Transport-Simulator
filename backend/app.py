from .data_loader import create_synthetic_chennai_map
from planner import RoutePlanner
from booking import BookingSystem

# Setup
city_map = create_synthetic_chennai_map()
planner = RoutePlanner(city_map)
planner.generate_availability()
simulator = BookingSystem()

# User Interaction
print("Available landmarks in the city:")
print(", ".join(sorted(city_map.landmarks)))

start = input("Enter start point: ").strip()
end = input("Enter destination point: ").strip()

print("Available transport modes: bus, metro, car, rapido")
mode_input = input("Enter preferred transport mode or leave empty for best mode mix: ").strip().lower()
if mode_input not in {"bus", "metro", "car", "rapido"}:
    mode_input = None

prefer_cost = input("Prefer cost? (y for yes, anything else for fastest): ").strip().lower() == 'y'

best_route = planner.find_best_route(start, end, prefer_cost=prefer_cost, selected_mode=mode_input)

if best_route:
    print("\nBest route found:")
    print("Path: " + " -> ".join(best_route['path']))
    print("Modes: " + " -> ".join(best_route['transport_modes_used']))
    print(f"Total time: {best_route['total_time']} minutes")
    print(f"Total cost: {best_route['total_cost']} units")

    if input("Book this route? (y/n): ").strip().lower() == 'y':
        user_name = input("Enter your name: ")
        booking_id = simulator.book_ticket(user_name, start, end, best_route)
        print(f"Booking ID: {booking_id}")
else:
    print("No route found.")
