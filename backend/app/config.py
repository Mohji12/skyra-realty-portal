from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[1]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=str(BACKEND_ROOT / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    database_url: str = "mysql+pymysql://root:password@127.0.0.1:3306/skyra"
    cors_origins: str = "http://localhost:8080,http://127.0.0.1:8080"
    session_cookie_name: str = "skyra_session"
    session_days: int = 7
    admin_email: str = "admin@skyrarealty.local"
    admin_password: str = "skyra2026"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
