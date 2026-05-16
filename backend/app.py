"""
Flask API — Air Quality & Weather Prediction for Safi, Morocco.
"""
from flask import Flask, jsonify, request
from flask_cors import CORS
from weather import get_current_weather, get_forecast, simulate_gas_flow, degree_to_direction
from utils import build_features
from models import predict_risk, get_feature_names
from config import RISK_CLASSES, SAFI_LAT, SAFI_LON, OCP_LAT, OCP_LON
import traceback

app = Flask(__name__)
CORS(app)


# ═══════════════════════════════════════════════════════════════════════════════
#  HEALTH CHECK
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "API is running"})


# ═══════════════════════════════════════════════════════════════════════════════
#  CURRENT WEATHER
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/api/weather", methods=["GET"])
def weather():
    try:
        data = get_current_weather()
        data["gas_flow"] = simulate_gas_flow()
        data["location"] = {
            "city": "Safi",
            "country": "MA",
            "lat": SAFI_LAT,
            "lon": SAFI_LON,
        }
        data["ocp"] = {
            "lat": OCP_LAT,
            "lon": OCP_LON,
            "name": "Usine OCP Safi",
        }
        return jsonify({"success": True, "data": data})
    except Exception as e:
        print(f"❌ ERROR in /api/weather: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════════════
#  AUTO PREDICT  (uses live weather + simulated gas flow)
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/api/predict", methods=["GET"])
def predict():
    try:
        weather_data = get_current_weather()
        gas_flow = simulate_gas_flow()
        features = build_features(weather_data, gas_flow)
        result = predict_risk(features)
        result["weather"] = weather_data
        result["gas_flow"] = gas_flow
        result["features_used"] = len(get_feature_names())
        return jsonify({"success": True, "data": result})
    except Exception as e:
        print(f"❌ ERROR in /api/predict: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════════════
#  CUSTOM PREDICT  (user provides gas_flow and/or wind direction)
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/api/predict-custom", methods=["POST"])
def predict_custom():
    try:
        body = request.get_json(force=True)
        weather_data = get_current_weather()

        # Override with user-supplied values
        gas_flow = float(body.get("gas_flow", simulate_gas_flow()))

        if "direction_vent" in body:
            direction = body["direction_vent"]
            weather_data["wind_direction"] = direction
            dir_map = {"N": 0, "NE": 45, "E": 90, "SE": 135,
                       "S": 180, "SO": 225, "O": 270, "NO": 315}
            weather_data["wind_deg"] = dir_map.get(direction, weather_data["wind_deg"])

        if "wind_speed" in body:
            weather_data["wind_speed"] = float(body["wind_speed"])

        features = build_features(weather_data, gas_flow)
        result = predict_risk(features)
        result["weather"] = weather_data
        result["gas_flow"] = gas_flow
        return jsonify({"success": True, "data": result})
    except Exception as e:
        print(f"❌ ERROR in /api/predict-custom: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════════════
#  5-DAY FORECAST  (with risk prediction per time-slot)
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/api/forecast", methods=["GET"])
def forecast():
    try:
        raw = get_forecast()
        enriched = []
        for item in raw:
            gas_flow = simulate_gas_flow()
            features = build_features(item, gas_flow)
            risk = predict_risk(features)
            item["gas_flow"] = gas_flow
            item["risk"] = risk
            enriched.append(item)
        return jsonify({"success": True, "data": enriched})
    except Exception as e:
        print(f"❌ ERROR in /api/forecast: {str(e)}")
        traceback.print_exc()
        return jsonify({"success": False, "error": str(e)}), 500


# ═══════════════════════════════════════════════════════════════════════════════
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)