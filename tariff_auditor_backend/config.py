from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "TariffGuard AI"
    database_url: str = "sqlite+aiosqlite:///./tariffguard.db"
    frontend_url: str = "http://localhost:3000"
    gemini_api_key: str = ""
    serper_api_key: str = ""
    wco_api_key: str | None = None
    redis_url: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
