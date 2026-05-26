````md
# 🏙️ SimuChennai – Smart Urban Transport Planner

> An AI-inspired smart city transport simulation system built using FastAPI to optimize travel across Chennai using intelligent route planning.

---

# 🏆 Hackathon Project

This project was developed as part of a **hackathon initiative** focused on solving real-world urban mobility and smart city transportation challenges.

The main objective was to design a scalable backend system capable of:

- Smart route optimization
- Multi-modal transport coordination
- Travel cost & time estimation
- Simulated urban mobility management

---

## 🌆 Project Overview

**SimuChennai** is a backend-powered smart transport planning system that simulates urban mobility across Chennai city.  
The project helps users discover optimized routes between major Chennai landmarks using multiple transport modes like metro, bus, car, and rapido.

The system intelligently calculates:

- 🚦 Fastest routes
- 💸 Cheapest travel options
- 🔄 Smart transport switching
- ⏱️ Estimated arrival times
- 🎫 Ticket booking simulation

This project was developed to explore concepts related to:

- Smart city infrastructure
- Graph algorithms
- Route optimization
- Backend API development
- Urban mobility systems

---

# ✨ Key Features

<div align="center">

| Feature | Description |
|--------|-------------|
| 🗺️ Synthetic Chennai Map | 50+ major Chennai landmarks connected virtually |
| 🚍 Multi-Modal Transport | Supports `bus`, `metro`, `car`, `rapido` |
| 🧠 Intelligent Route Planning | Optimizes based on time or cost |
| ⏱️ Live ETA Simulation | Calculates estimated arrival time |
| 🔄 Smart Switching | Minimizes unnecessary transport changes |
| 🎫 Ticket Booking | Generates booking IDs for routes |
| ⚡ FastAPI Backend | High-performance backend APIs |

</div>

---

# 🧠 Smart Routing Logic

The planner supports multiple routing strategies:

- ⏳ Prefer minimum travel time
- 💰 Prefer minimum travel cost
- ⚖️ Custom weighted optimization
- 🚇 Restrict routes to a selected transport mode
- 🔄 Intelligent transport mode switching

---

# 🛠️ Tech Stack

<div align="center">

| Technology | Usage |
|------------|------|
| 🐍 Python | Core backend language |
| ⚡ FastAPI | REST API framework |
| 🧠 Graph Algorithms | Route optimization |
| 📦 Pydantic | Data validation |
| 🧪 Pytest | Backend testing |

</div>

---

# 📁 Project Structure

```bash
SimuChennai/
│
├── main.py                  # FastAPI entry point
├── models.py                # Graph data models
├── planner.py               # Route planning engine
├── booking.py               # Ticket booking system
├── constants.py             # Transport speeds & costs
├── schema.py                # Request/Response schemas
├── data_loader.py           # Synthetic Chennai map generation
├── routes.py                # API route handlers
├── test_planner.py          # Unit tests
├── requirements.txt         # Project dependencies
└── README.md                # Documentation
````

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Roshanrameshhub/SimuChennai.git
```

---

## 2️⃣ Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 3️⃣ Run the Backend Server

```bash
uvicorn main:app --reload
```

---

## 4️⃣ Open Swagger API Docs

```bash
http://localhost:8000/docs
```

---

# 📬 API Endpoints

## 🚏 Route Planning

### `POST /route/plan`

### Sample Request

```json
{
  "start": "Avadi",
  "end": "Porur",
  "prefer_time": true,
  "prefer_cost": false,
  "selected_mode": null,
  "time_weight": 0.7,
  "cost_weight": 0.3
}
```

---

### Sample Response

```json
{
  "path": ["Avadi", "Ambattur", "Porur"],
  "total_time": 35.4,
  "total_cost": 48.0,
  "transport_modes_used": ["metro", "car"],
  "arrival_time": "17:24:56"
}
```

---

# 🎫 Booking APIs

## `POST /booking/create`

Books a planned route and generates a unique booking ID.

---

## `GET /booking/{booking_id}`

Retrieves previously booked route details.

---

# 💡 Example Scenario

### User Input

| Parameter               | Value |
| ----------------------- | ----- |
| 📍 Start                | Avadi |
| 🎯 Destination          | Porur |
| 🚍 Transport Preference | Any   |
| ⚡ Priority              | Time  |

### Smart Output

✅ Optimized metro + car route
✅ Travel cost estimation
✅ Estimated arrival time
✅ Reduced switching overhead

---

# 📈 Future Enhancements

* 🗺️ Interactive frontend map using Leaflet.js
* 📍 Real-time GPS simulation
* 📊 Traffic-aware route analysis
* 🧠 AI-powered traffic prediction using LSTM models
* ☁️ Cloud deployment
* 📱 Mobile-friendly dashboard
* 🔔 Notification & alert system

---

# 🌟 Learning Outcomes

This project helped in understanding:

* Graph-based route planning
* FastAPI backend architecture
* Smart city transport systems
* API development workflow
* Multi-modal mobility concepts
* Real-world backend project structuring

---

# 👨‍💻 Developed By

## Roshan R

Computer Science Engineering
Chennai Institute of Technology

---

# 📜 Note

This project was developed primarily for:

* 🏆 Hackathon participation
* 📚 Educational learning
* 🧠 Smart city research exploration
* 🚀 Backend development practice


```
