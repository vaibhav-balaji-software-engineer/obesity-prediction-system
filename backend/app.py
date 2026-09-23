from flask import Flask, request, jsonify
from flask_cors import CORS

from ml.src.predict import predict_obesity
from ml.src.explain import explain_prediction
from ml.src.recommend import generate_recommendations


app = Flask(__name__)
import os

CORS(app, origins=os.getenv("FRONTEND_URL", "*"))


# --------------------------------------------------
# Required input features
# --------------------------------------------------

REQUIRED_FEATURES = [
    "Gender",
    "Age",
    "Height",
    "Weight",
    "family_history_with_overweight",
    "FAVC",
    "FCVC",
    "NCP",
    "CAEC",
    "SMOKE",
    "CH2O",
    "SCC",
    "FAF",
    "TUE",
    "CALC",
    "MTRANS"
]


# --------------------------------------------------
# Home route
# --------------------------------------------------

@app.route("/")
def home():
    return "Obesity Prediction API is running!"


# --------------------------------------------------
# Prediction route
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():

    input_data = request.get_json()

    # Check whether JSON was provided
    if not input_data:
        return jsonify({
            "error": "No input data provided"
        }), 400

    # Check for missing features
    missing_features = [
        feature for feature in REQUIRED_FEATURES
        if feature not in input_data
    ]

    if missing_features:
        return jsonify({
            "error": "Missing required features",
            "missing_features": missing_features
        }), 400

    try:
        prediction = predict_obesity(input_data)
        explanation = explain_prediction(input_data)
        recommendations = generate_recommendations(input_data, prediction)

        return jsonify({
            "prediction": prediction,
            "top_factors": explanation["top_factors"],
            "recommendations": recommendations
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


# --------------------------------------------------
# Run application
# --------------------------------------------------

if __name__ == "__main__":
    app.run()