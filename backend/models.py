"""
ML model loading and prediction utilities.
Uses the pre-trained XGBoost model — DO NOT retrain.
"""
import joblib
import numpy as np
from config import MODEL_PATH, FEATURE_NAMES_PATH, RISK_CLASSES

# ─── Load model artefacts once at import time ─────────────────────────────────
_model = None
_feature_names = None


def _load_model():
    """Lazy-load model artefacts."""
    global _model, _feature_names
    if _model is None:
        _model = joblib.load(str(MODEL_PATH))
        with open(str(FEATURE_NAMES_PATH), "r") as f:
            _feature_names = [line.strip() for line in f if line.strip()]
    return _model, _feature_names


def get_feature_names():
    """Return the list of expected feature names."""
    _, names = _load_model()
    return names


def predict_risk(input_data: dict) -> dict:
    """
    Run a prediction through the XGBoost model.

    Parameters
    ----------
    input_data : dict
        Keys must match the feature names stored in
        feature_names_xgboost.txt.  Missing features
        are filled with 0.

    Returns
    -------
    dict with keys:
        scenario   – int (0-3)
        label      – str  (human-readable)
        color      – str  (hex colour)
        icon       – str  (emoji)
        confidence – float (max probability)
        probabilities – dict {class_label: probability}
    """
    model, feature_names = _load_model()

    # Build ordered feature vector
    features = np.array(
        [float(input_data.get(name, 0)) for name in feature_names]
    ).reshape(1, -1)

    # Predict class + probabilities
    prediction = model.predict(features)[0]
    probas = model.predict_proba(features)[0]

    # Decode label directly from integer prediction
    scenario = int(prediction)

    risk_info = RISK_CLASSES.get(scenario, RISK_CLASSES[0])

    return {
        "scenario":      scenario,
        "label":         risk_info["label"],
        "color":         risk_info["color"],
        "icon":          risk_info["icon"],
        "confidence":    round(float(max(probas)) * 100, 1),
        "probabilities": {
            RISK_CLASSES[i]["label"]: round(float(p) * 100, 1)
            for i, p in enumerate(probas)
        },
    }
