from models import CityMap

def create_synthetic_chennai_map():
    city = CityMap()

    # 50 sample Chennai-based nodes/landmarks
    landmarks = [
        "Chennai Central", "Egmore", "CMBT", "T Nagar", "Velachery", "Adyar", "Guindy", "Nungambakkam",
        "Kilpauk", "Kodambakkam", "Saidapet", "Thiruvanmiyur", "Besant Nagar", "Tambaram", "Chromepet",
        "Pallavaram", "Meenambakkam", "Porur", "Anna Nagar", "Vadapalani", "Ashok Nagar", "Koyambedu",
        "Ambattur", "Avadi", "Poonamallee", "Mylapore", "Mandaveli", "Teynampet", "Triplicane", "Royapettah",
        "Perambur", "Vyasarpadi", "Washermanpet", "Royapuram", "Manali", "Minjur", "Red Hills", "Kolathur",
        "Villivakkam", "Thirumangalam", "Mogappair", "Iyyapanthangal", "Maduravoyal", "Alandur", "St Thomas Mount",
        "Purasaiwalkam", "Broadway", "Parrys", "Sholinganallur", "Siruseri"
    ]

    for place in landmarks:
        city.add_node(place)

    # List of connections: from, to, distance (km), and available transport modes
    edges = [
        ("Chennai Central", "Egmore", 3, [
            {"mode": "metro", "line": "Green Line"},
            {"mode": "bus", "route": "B18"}
        ]),
        ("Egmore", "CMBT", 6, [
            {"mode": "bus", "route": "15B"},
            {"mode": "bus", "route": "70A"}
        ]),
        ("CMBT", "Vadapalani", 2.5, [
            {"mode": "metro", "line": "Green Line"},
            {"mode": "bus", "route": "27D"}
        ]),
        ("Vadapalani", "Kodambakkam", 2, [
            {"mode": "car", "service": "Uber Premier"},
            {"mode": "rapido", "bike_type": "Motorbike"}
        ]),
        ("Kodambakkam", "T Nagar", 3, [
            {"mode": "bus", "route": "G18"},
            {"mode": "rapido", "bike_type": "Scooter"}
        ]),
        ("T Nagar", "Adyar", 5, [
            {"mode": "bus", "route": "21G"},
            {"mode": "taxi", "type": "Yellow Taxi"}
        ]),
        ("Adyar", "Thiruvanmiyur", 2.5, [
            {"mode": "metro", "line": "Blue Line"}
        ]),
        ("Thiruvanmiyur", "Velachery", 4, [
            {"mode": "metro", "line": "Blue Line"},
            {"mode": "bus", "route": "19A"}
        ]),
        ("Velachery", "Tambaram", 9, [
            {"mode": "metro", "line": "Blue Line"},
            {"mode": "bus", "route": "51C"}
        ]),
        ("Tambaram", "Chromepet", 3, [
            {"mode": "bus", "route": "55K"},
            {"mode": "car", "service": "Ola Mini"}
        ]),
        ("Chromepet", "Pallavaram", 2, [
            {"mode": "rapido", "bike_type": "Scooter"},
            {"mode": "car", "service": "Uber Go"}
        ]),
        ("Pallavaram", "Meenambakkam", 2.5, [
            {"mode": "bus", "route": "MEPZ1"},
            {"mode": "metro", "line": "Airport Express"}
        ]),
        ("Meenambakkam", "Guindy", 6, [
            {"mode": "metro", "line": "Airport Express"},
            {"mode": "car", "service": "FastTrack"}
        ]),
        ("Guindy", "Saidapet", 3, [
            {"mode": "metro", "line": "Green Line"}
        ]),
        ("Saidapet", "Nungambakkam", 3, [
            {"mode": "bus", "route": "17K"},
            {"mode": "rapido", "bike_type": "Motorbike"}
        ]),
        ("Nungambakkam", "Kilpauk", 2, [
            {"mode": "car", "service": "Uber XL"}
        ]),
        ("Kilpauk", "Anna Nagar", 4, [
            {"mode": "bus", "route": "27C"},
            {"mode": "metro", "line": "Red Line"}
        ]),
        ("Anna Nagar", "Thirumangalam", 2, [
            {"mode": "metro", "line": "Red Line"},
            {"mode": "bus", "route": "S54"}
        ]),
        ("Thirumangalam", "Mogappair", 3, [
            {"mode": "bus", "route": "62A"},
            {"mode": "car", "service": "Ola Sedan"}
        ]),
        ("Mogappair", "Ambattur", 4, [
            {"mode": "metro", "line": "Red Line"}
        ]),
        ("Ambattur", "Avadi", 5, [
            {"mode": "metro", "line": "Red Line"},
            {"mode": "bus", "route": "66E"}
        ])
    ]

    for from_node, to_node, distance, modes in edges:
        city.add_edge(from_node, to_node, distance, modes)

    return city
