from models import CityMap

def create_synthetic_chennai_map():
    city_map = CityMap()

    # Adding more nodes to create a richer map
    nodes = [
        "Chennai Central", "Egmore", "CMBT", "T Nagar", "Velachery", "Adyar",
        "Guindy", "Nungambakkam", "Kilpauk", "Kodambakkam", "Saidapet",
        "Thiruvanmiyur", "Besant Nagar", "Tambaram", "Chromepet", "Pallavaram",
        "Meenambakkam", "Porur", "Anna Nagar", "Vadapalani", "Ashok Nagar",
        "Koyambedu", "Ambattur", "Avadi", "Poonamallee", "Mylapore",
        "Mandaveli", "Teynampet", "Triplicane", "Royapettah", "Perambur",
        "Vyasarpadi", "Washermanpet", "Royapuram", "Manali", "Minjur",
        "Red Hills", "Kolathur", "Villivakkam", "Thirumangalam", "Mogappair",
        "Iyyapanthangal", "Maduravoyal", "Alandur", "St Thomas Mount",
        "Purasaiwalkam", "Broadway", "Parrys", "Sholinganallur", "Siruseri"
    ]

    for node in nodes:
        city_map.add_node(node)

    # Adding more diverse edges with multiple modes for better simulation
    edges = [
        # Central Chennai Area
        ("Chennai Central", "Egmore", 3, [
            {"mode": "metro", "line": "Green Line"},
            {"mode": "bus", "route": "15B"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Egmore", "CMBT", 8, [
            {"mode": "metro", "line": "Green Line"},
            {"mode": "bus", "route": "27F"},
            {"mode": "car", "service": "Ola Mini"},
            {"mode": "rapido", "bike_type": "Standard"}
        ]),
        ("CMBT", "Anna Nagar", 4, [
            {"mode": "metro", "line": "Green Line"},
            {"mode": "bus", "route": "D70"},
            {"mode": "taxi", "service": "Local Taxi"}
        ]),
        ("Anna Nagar", "Vadapalani", 3, [
            {"mode": "metro", "line": "Green Line"},
            {"mode": "bus", "route": "17M"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Vadapalani", "T Nagar", 6, [
            {"mode": "bus", "route": "12B"},
            {"mode": "car", "service": "Ola Mini"}
        ]),
        ("T Nagar", "Mylapore", 5, [
            {"mode": "bus", "route": "23C"},
            {"mode": "car", "service": "Uber Premier"}
        ]),
        ("Mylapore", "Adyar", 7, [
            {"mode": "bus", "route": "19A"},
            {"mode": "taxi", "service": "Local Taxi"}
        ]),

        # Southern Chennai Area
        ("Adyar", "Velachery", 6, [
            {"mode": "bus", "route": "521"},
            {"mode": "car", "service": "Ola Auto"}
        ]),
        ("Velachery", "Tambaram", 12, [
            {"mode": "bus", "route": "G18"},
            {"mode": "car", "service": "Uber XL"},
            {"mode": "metro", "line": "Blue Line"} # Hypothetical extension
        ]),
        ("Tambaram", "Chromepet", 5, [
            {"mode": "bus", "route": "60"},
            {"mode": "car", "service": "Ola Micro"}
        ]),
        ("Chromepet", "Pallavaram", 3, [
            {"mode": "bus", "route": "A18"},
            {"mode": "rapido", "bike_type": "Bike Taxi"}
        ]),
        ("Pallavaram", "Meenambakkam", 4, [
            {"mode": "bus", "route": "18A"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Meenambakkam", "Guindy", 7, [
            {"mode": "metro", "line": "Blue Line"},
            {"mode": "bus", "route": "18C"}
        ]),
        ("Guindy", "Saidapet", 3, [
            {"mode": "metro", "line": "Blue Line"},
            {"mode": "bus", "route": "23G"}
        ]),
        ("Saidapet", "Teynampet", 4, [
            {"mode": "metro", "line": "Blue Line"},
            {"mode": "bus", "route": "5C"}
        ]),
        ("Teynampet", "Nungambakkam", 3, [
            {"mode": "metro", "line": "Blue Line"},
            {"mode": "car", "service": "Ola Mini"}
        ]),

        # Western Chennai Area
        ("Guindy", "Porur", 9, [
            {"mode": "bus", "route": "57F"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Porur", "Maduravoyal", 5, [
            {"mode": "bus", "route": "16J"},
            {"mode": "rapido", "bike_type": "Standard"}
        ]),
        ("Maduravoyal", "Poonamallee", 8, [
            {"mode": "bus", "route": "65"},
            {"mode": "car", "service": "Ola Prime"}
        ]),
        ("Poonamallee", "Avadi", 10, [
            {"mode": "bus", "route": "66"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Avadi", "Ambattur", 5, [
            {"mode": "bus", "route": "27C"},
            {"mode": "car", "service": "Ola Micro"}
        ]),
        ("Ambattur", "Koyambedu", 6, [
            {"mode": "bus", "route": "120"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Koyambedu", "Porur", 7, [
            {"mode": "bus", "route": "18R"},
            {"mode": "metro", "line": "Green Line"}
        ]),
        ("Koyambedu", "Thirumangalam", 2, [
            {"mode": "metro", "line": "Green Line"},
            {"mode": "bus", "route": "47C"}
        ]),
        ("Thirumangalam", "Mogappair", 4, [
            {"mode": "bus", "route": "D70"},
            {"mode": "rapido", "bike_type": "Standard"}
        ]),

        # Northern Chennai Area
        ("Chennai Central", "Perambur", 7, [
            {"mode": "bus", "route": "121C"},
            {"mode": "taxi", "service": "Local Taxi"}
        ]),
        ("Perambur", "Vyasarpadi", 4, [
            {"mode": "bus", "route": "29D"},
            {"mode": "bike", "service": "Local Bike"}
        ]),
        ("Vyasarpadi", "Washermanpet", 6, [
            {"mode": "bus", "route": "42"},
            {"mode": "car", "service": "Ola Auto"}
        ]),
        ("Washermanpet", "Royapuram", 3, [
            {"mode": "bus", "route": "1C"},
            {"mode": "metro", "line": "Blue Line"} # Hypothetical extension
        ]),

        # Connectivity across regions (important for complex routes)
        ("T Nagar", "Guindy", 5, [
            {"mode": "bus", "route": "18R"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Adyar", "Saidapet", 6, [
            {"mode": "bus", "route": "51G"},
            {"mode": "car", "service": "Ola Mini"}
        ]),
        ("Tambaram", "Sholinganallur", 20, [
            {"mode": "bus", "route": "515"},
            {"mode": "car", "service": "Uber XL"}
        ]),
        ("Sholinganallur", "Siruseri", 8, [
            {"mode": "bus", "route": "588"},
            {"mode": "car", "service": "Local Taxi"}
        ]),
        ("Iyyapanthangal", "Porur", 3, [
            {"mode": "bus", "route": "16E"},
            {"mode": "rapido", "bike_type": "Standard"}
        ]),
        ("St Thomas Mount", "Alandur", 2, [
            {"mode": "metro", "line": "Blue Line"},
            {"mode": "bus", "route": "18K"}
        ]),
        ("Purasaiwalkam", "Kilpauk", 2, [
            {"mode": "bus", "route": "17D"},
            {"mode": "car", "service": "Ola Micro"}
        ]),
        ("Kilpauk", "Kodambakkam", 4, [
            {"mode": "bus", "route": "170"},
            {"mode": "taxi", "service": "Local Taxi"}
        ]),
        ("Kodambakkam", "Ashok Nagar", 3, [
            {"mode": "bus", "route": "570"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Ashok Nagar", "Koyambedu", 5, [
            {"mode": "bus", "route": "12G"},
            {"mode": "metro", "line": "Green Line"}
        ]),
        ("Broadway", "Parrys", 1, [
            {"mode": "bus", "route": "4A"},
            {"mode": "bike", "service": "Cycle"}
        ]),
        ("Parrys", "Chennai Central", 2, [
            {"mode": "bus", "route": "2A"},
            {"mode": "car", "service": "Ola Auto"}
        ])
    ]

    for u, v, distance, modes in edges:
        city_map.add_edge(u, v, distance, modes)
    return city_map
