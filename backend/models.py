from typing import List, Dict, Tuple

class Node:
    def __init__(self, name: str):
        self.name = name

class Edge:
    def __init__(self, from_node: str, to_node: str, distance_km: float, modes: List[str]):
        self.from_node = from_node
        self.to_node = to_node
        self.distance_km = distance_km
        self.modes = modes

class CityMap:
    def __init__(self):
        self.graph = {}  # {from_node: [(to_node, distance, modes)]}
        self.landmarks = set()

    def add_node(self, name: str):
        self.landmarks.add(name)
        if name not in self.graph:
            self.graph[name] = []

    def add_edge(self, from_node: str, to_node: str, distance_km: float, modes: List[str]):
        self.graph.setdefault(from_node, []).append((to_node, distance_km, modes))
        self.graph.setdefault(to_node, []).append((from_node, distance_km, modes))
