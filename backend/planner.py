import heapq
from typing import List, Dict, Tuple

# Define approximate costs and times per kilometer for various modes
MODE_COSTS_PER_KM = {
    "metro": 2.0,
    "bus": 1.0,
    "car": 15.0,
    "rapido": 8.0,
    "taxi": 12.0,
    "any": 5.0 # Default for "Best Available"
}

MODE_TIMES_PER_KM = {
    "metro": 1.5,  # minutes per km
    "bus": 3.0,    # minutes per km
    "car": 1.2,    # minutes per km
    "rapido": 2.0, # minutes per km
    "taxi": 1.3,
    "any": 2.0   # Default for "Best Available"
}

class RoutePlanner:
    def __init__(self, city_map):
        self.city_map = city_map
        self.graph = city_map.graph  # Expected: { "A": [("B", 5), ("C", 10)], ... }

    def generate_availability(self):
        return self.graph

    def shortest_path(self, start: str, end: str):
        distances = {node: float("inf") for node in self.graph}
        distances[start] = 0
        pq = [(0, start)]
        previous = {node: None for node in self.graph}

        while pq:
            current_distance, current_node = heapq.heappop(pq)
            if current_distance > distances[current_node]:
                continue

            for neighbor, weight in self.graph.get(current_node, []):
                distance = current_distance + weight
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous[neighbor] = current_node
                    heapq.heappush(pq, (distance, neighbor))

        # reconstruct path
        path = []
        node = end
        while node is not None:
            path.insert(0, node)
            node = previous[node]

        return {"path": path, "distance": distances[end]}

    def find_best_route(
        self, start, end,
        prefer_cost=True, prefer_time=False,
        selected_mode="any", time_weight=1, cost_weight=1
    ):
        """
        For now, since edges only have a single numeric weight,
        we treat that as both time & cost.
        Weighted sum = (time_weight + cost_weight) * edge_weight
        """
        distances = {node: float("inf") for node in self.graph}
        distances[start] = 0
        pq = [(0, start)]
        previous = {node: None for node in self.graph}

        while pq:
            current_distance, current_node = heapq.heappop(pq)
            if current_distance > distances[current_node]:
                continue

            for neighbor, distance_km, modes_info in self.graph.get(current_node, []):
                mode_details_for_edge = []
                for mode_data in modes_info:
                    mode_name = mode_data.get("mode")
                    if mode_name:
                        mode_details_for_edge.append({
                            "mode": mode_name,
                            "name": mode_data.get("route") or mode_data.get("line") or mode_data.get("service") or mode_data.get("bike_type") or "N/A",
                            "cost_per_km": MODE_COSTS_PER_KM.get(mode_name, MODE_COSTS_PER_KM["any"]),
                            "time_per_km": MODE_TIMES_PER_KM.get(mode_name, MODE_TIMES_PER_KM["any"])
                        })

                # Filter modes based on selected_mode (if not "any")
                filtered_modes = [md for md in mode_details_for_edge if selected_mode == "any" or md["mode"] == selected_mode]

                if not filtered_modes:
                    continue # No suitable mode available for this edge

                # For simplicity, pick the first available mode that matches criteria for edge evaluation
                # In a real app, you might choose based on preference (e.g., cheapest, fastest)
                chosen_mode_for_edge = filtered_modes[0]

                segment_time = distance_km * chosen_mode_for_edge["time_per_km"]
                segment_cost = distance_km * chosen_mode_for_edge["cost_per_km"]

                # Use a weighted sum for pathfinding score
                # Lower score is better
                score = (time_weight * segment_time) + (cost_weight * segment_cost)
                distance = current_distance + score

                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    previous[neighbor] = current_node
                    # Store the chosen mode details along with the edge in the priority queue
                    heapq.heappush(pq, (distance, neighbor))

        # reconstruct path
        temp_path = []
        node = end
        while node is not None:
            temp_path.insert(0, node)
            node = previous[node]
        
        if distances[end] == float("inf") or not temp_path or len(temp_path) < 2:
            return None # No path found or invalid path

        detailed_segments = []
        total_route_time = 0.0
        total_route_cost = 0.0
        unique_transport_modes_used = set()

        for i in range(len(temp_path) - 1):
            u = temp_path[i]
            v = temp_path[i+1]
            
            # Find the actual edge used and its mode details
            found_edge = None
            chosen_mode_for_segment = None

            for neighbor_edge, distance_km_edge, modes_info_edge in self.graph.get(u, []):
                if neighbor_edge == v:
                    # Filter modes for this edge based on selected_mode
                    available_modes_for_segment = []
                    for mode_data in modes_info_edge:
                        mode_name = mode_data.get("mode")
                        if mode_name:
                             available_modes_for_segment.append({
                                "mode": mode_name,
                                "name": mode_data.get("route") or mode_data.get("line") or mode_data.get("service") or mode_data.get("bike_type") or "N/A",
                                "cost_per_km": MODE_COSTS_PER_KM.get(mode_name, MODE_COSTS_PER_KM["any"]),
                                "time_per_km": MODE_TIMES_PER_KM.get(mode_name, MODE_TIMES_PER_KM["any"])
                            })
                    
                    # Find the mode that matches the selected_mode or the 'any' default
                    for mode_detail in available_modes_for_segment:
                        if selected_mode == "any" or mode_detail["mode"] == selected_mode:
                            chosen_mode_for_segment = mode_detail
                            break
                    
                    if chosen_mode_for_segment:
                        found_edge = (distance_km_edge, modes_info_edge)
                        break
            
            if found_edge and chosen_mode_for_segment:
                segment_distance = found_edge[0]
                segment_time = segment_distance * chosen_mode_for_segment["time_per_km"]
                segment_cost = segment_distance * chosen_mode_for_segment["cost_per_km"]

                total_route_time += segment_time
                total_route_cost += segment_cost
                unique_transport_modes_used.add(chosen_mode_for_segment["mode"])

                detailed_segments.append({
                    "from": u,
                    "to": v,
                    "distance_km": segment_distance,
                    "mode": chosen_mode_for_segment["mode"],
                    "mode_name": chosen_mode_for_segment["name"],
                    "time_mins": segment_time,
                    "cost": segment_cost
                })
            else:
                # This case should ideally not happen if a path was found, but for robustness:
                print(f"Warning: Could not find mode details for segment {u} -> {v}")
                return None # Indicate an issue with path details

        return {
            "path": [s["from"] for s in detailed_segments] + [detailed_segments[-1]["to"]],
            "total_cost": round(total_route_cost, 2),
            "total_time": round(total_route_time, 2),
            "transport_modes_used": list(unique_transport_modes_used),
            "detailed_segments": detailed_segments # New detailed segments
        }
