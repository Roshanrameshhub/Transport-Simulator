\# 🏙️ SimuChennai Transport Planner (Backend)



This project simulates city-wide transport in Chennai using FastAPI. It allows users to plan routes, calculate travel time and cost, view estimated arrival time, and book tickets—all powered by a smart route planner.



---



\## 🚀 Features



\- 🗺️ 50 major synthetic landmarks of Chennai

\- 🚍 Multi-modal transport: `bus`, `metro`, `car`, `rapido`

\- 🧠 Smart routing with options to prioritize \*\*cost\*\*, \*\*time\*\*, or \*\*custom weights\*\*

\- ⏱️ Live \*\*arrival time\*\* simulation

\- 🔄 Switch-aware routing (minimizes unnecessary mode changes)

\- 🎫 Ticket booking with unique booking ID



---



\## 🛠️ Folder Structure



```

SimuChennai/

│

├── main.py                  # FastAPI entry point

├── models.py                # Graph data models (nodes, edges)

├── planner.py               # Route planning logic

├── booking.py               # Booking system

├── constants.py             # Speed and cost per mode

├── schema.py                # Request/Response models

├── data\_loader.py           # Creates synthetic Chennai map

├── routes.py                # API routes (plan, book, view)

├── test\_planner.py          # Unit tests using pytest

├── requirements.txt         # Dependencies

└── README.md                # Project overview

```



---



\## ⚙️ Setup Instructions



\### 1. Install dependencies

```bash

pip install -r requirements.txt

```



\### 2. Run the backend

```bash

uvicorn main:app --reload

```



\### 3. Open the API

Visit \[http://localhost:8000/docs](http://localhost:8000/docs) for Swagger UI.



---



\## 📬 API Endpoints



\### `POST /route/plan`

\- \*\*Input\*\*:

&nbsp; ```json

&nbsp; {

&nbsp;   "start": "Avadi",

&nbsp;   "end": "Porur",

&nbsp;   "prefer\_time": true,

&nbsp;   "prefer\_cost": false,

&nbsp;   "selected\_mode": null,

&nbsp;   "time\_weight": 0.7,

&nbsp;   "cost\_weight": 0.3

&nbsp; }

&nbsp; ```

\- \*\*Output\*\*:

&nbsp; ```json

&nbsp; {

&nbsp;   "path": \["Avadi", "Ambattur", "Porur"],

&nbsp;   "total\_time": 35.4,

&nbsp;   "total\_cost": 48.0,

&nbsp;   "transport\_modes\_used": \["metro", "car"],

&nbsp;   "arrival\_time": "17:24:56"

&nbsp; }

&nbsp; ```



---



\### `POST /booking/create`

Books a route and returns a booking ID.



\### `GET /booking/{booking\_id}`

View a previous booking using ID.



---



\## 💡 Sample Use Case



A user selects:

\- \*\*Start:\*\* Avadi  

\- \*\*End:\*\* Porur  

\- \*\*Mode Preference:\*\* Any  

\- \*\*Priority:\*\* Time  

\- → Output: A smart route using metro and car with arrival estimate and cost.



---



\## 📈 Future Improvements



\- Frontend map integration (Leaflet.js)

\- Real-time GPS-style simulation

\- History of bookings

\- Route delay prediction based on traffic



---



\## 👨‍💻 Developed By



Roshan  

Dept. of CSE  

Chennai Institute of Technology



