import fastf1
import os

def setup_f1():
    cache_dir = './fastf1_cache'
    if not os.path.exists(cache_dir):
        os.makedirs(cache_dir)
    fastf1.Cache.enable_cache(cache_dir)