from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "EventSphere API"
    app_version: str = "1.0.0"
    environment: str = "development"

    database_url: str = "sqlite:///./eventsphere.db"

    jwt_secret_key: str = "change-this-secret-key"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    ticketmaster_api_key: str = ""
    ticketmaster_base_url: str = "https://app.ticketmaster.com/discovery/v2"

    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()