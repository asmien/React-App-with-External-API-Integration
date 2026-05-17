import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///events.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Eventbrite API
    EVENTBRITE_PRIVATE_TOKEN = os.getenv('EVENTBRITE_PRIVATE_TOKEN')
    EVENTBRITE_ORG_ID = os.getenv('EVENTBRITE_ORG_ID')
    EVENTBRITE_API_BASE = 'https://www.eventbriteapi.com/v3'

    # Ticketmaster API
    TICKETMASTER_API_KEY = os.getenv('TICKETMASTER_API_KEY')

    # CORS
    CORS_ORIGINS = ['http://localhost:5173', 'http://localhost:3000']