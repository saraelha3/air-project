import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# ─── Paths ───────────────────────────────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
ML_MODELS_DIR = BASE_DIR / "ml_model" / "models"

MODEL_PATH         = ML_MODELS_DIR / "model_xgboost.pkl"
ENCODER_PATH       = ML_MODELS_DIR / "label_encoder_xgboost.pkl"
FEATURE_NAMES_PATH = ML_MODELS_DIR / "feature_names_xgboost.txt"

# ─── OpenWeatherMap ───────────────────────────────────────────────────────────
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")
OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"

# ─── Safi city coordinates ────────────────────────────────────────────────────
SAFI_LAT = 32.6333
SAFI_LON = -8.7667

# ─── OCP Plant coordinates (south of Safi) ───────────────────────────────────
OCP_LAT = 32.2800
OCP_LON = -8.7700

# ─── Gas flow simulation parameters ──────────────────────────────────────────
GAS_FLOW_BASE     = 1500   # m³/h
GAS_FLOW_VARIANCE = 500    # ± variation

# ─── Risk classes ─────────────────────────────────────────────────────────────
RISK_CLASSES = {
    0: {"label": "Pas de risque", "color": "#28a745", "icon": "✅"},
    1: {"label": "Risque faible",  "color": "#ffc107", "icon": "⚠️"},
    2: {"label": "Risque moyen",   "color": "#fd7e14", "icon": "🔶"},
    3: {"label": "Risque élevé",   "color": "#dc3545", "icon": "🚨"},
}
