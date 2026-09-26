import json
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings loaded from environment variables or .env file.
    """
    PROJECT_NAME: str = "VENTURE AI"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"

    # JWT & Security Configuration
    JWT_SECRET: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # MongoDB Atlas Configuration
    MONGODB_URI: str = "mongodb+srv://kodurujagadeeshbabu77_db_user:85ZAFXvfOm7b5CeB@cluster0.wwuikwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    MONGODB_DB_NAME: str = "venture_ai_db"

    # PostgreSQL Database Credentials (Optional / Fallback)
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_DB: str = "aibusiness_db"

    # Optional full URL override
    DATABASE_URL: str | None = None

    # Local Open-Source LLM Configuration (Ollama)
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    LLM_TIMEOUT_SECONDS: int = 90

    # Google Maps API Key
    GOOGLE_MAPS_API_KEY: str = "AIzaSyDDpPni56kABZhzzfeskfEJ4Fhse_bZ3gE"

    # CORS Configuration (stored as string to prevent pydantic-settings JSON decode errors)
    CORS_ORIGINS: str = "*"

    @property
    def cors_origins_list(self) -> List[str]:
        """
        Returns a list of allowed CORS origins, safely parsing comma-separated,
        JSON array, or wildcard strings.
        """
        val = str(self.CORS_ORIGINS).strip()
        if not val or val == "*":
            return ["*"]
        if val.startswith("[") and val.endswith("]"):
            try:
                parsed = json.loads(val)
                if isinstance(parsed, list):
                    return [str(x).strip() for x in parsed]
            except Exception:
                pass
        return [i.strip() for i in val.split(",") if i.strip()]

    def get_database_url(self) -> str:
        """
        Returns the resolved database connection URL.
        If DATABASE_URL is provided, converts 'postgres://' to 'postgresql://'.
        Otherwise, falls back to a clean local SQLite database while MongoDB Atlas handles cloud persistence.
        """
        url = self.DATABASE_URL
        if url:
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql://", 1)
            return url
        return "sqlite:///./venture_ai_local.db"


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
