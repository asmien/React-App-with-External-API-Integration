from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config import settings
from app.db.database import Base
from app.db.session import engine


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root route
@app.get("/")
def root():
    return {
        "message": "EventSphere Backend API is running"
    }


# Register API routes
app.include_router(
    api_router,
    prefix="/api/v1",
)