from pydantic_settings import BaseSettings, SettingsConfigDict
import fastf1
import os

class Settings(BaseSettings):
    PORT: int
    CLIENT_URL: str
    EARLIEST_YEAR: int
    LATEST_YEAR: int

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()

def setup_f1():
    cache_dir = './fastf1_cache'
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)
    fastf1.Cache.enable_cache(cache_dir)