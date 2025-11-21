from fastapi import FastAPI
from api.routes import router
import uvicorn

app = FastAPI(
    title="SimuChennai Transport API",
    description="API for planning routes and booking tickets in a synthetic Chennai transport simulation.",
    version="1.0"
)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes from routes.py
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
