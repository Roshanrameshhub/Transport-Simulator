import heapq

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

            for neighbor, weight in self.graph.get(current_node, []):
                # combine weights (since we only have one)
                score = (time_weight + cost_weight) * weight
                distance = current_distance + score

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

        return {
            "path": path,
            "score": distances[end],
            "weights": {"time_weight": time_weight, "cost_weight": cost_weight}
        }
