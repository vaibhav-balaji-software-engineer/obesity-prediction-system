import os
import joblib
import pandas as pd
import xgboost as xgb


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.pkl")
PREPROCESSOR_PATH = os.path.join(
    BASE_DIR, "models", "preprocessing_pipeline.pkl"
)


model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)


CLASS_NAMES = {
    0: "Insufficient_Weight",
    1: "Normal_Weight",
    2: "Obesity_Type_I",
    3: "Obesity_Type_II",
    4: "Obesity_Type_III",
    5: "Overweight_Level_I",
    6: "Overweight_Level_II"
}


def explain_prediction(input_data):

    # Convert input into DataFrame
    input_df = pd.DataFrame([input_data])

    # Apply the same preprocessing used during training
    processed_data = preprocessor.transform(input_df)

    # Get normal model prediction
    prediction_encoded = model.predict(processed_data)[0]
    prediction_class = int(prediction_encoded)

    prediction_name = CLASS_NAMES[prediction_class]

    # Get transformed feature names
    feature_names = preprocessor.get_feature_names_out()

    # Create XGBoost DMatrix
    dmatrix = xgb.DMatrix(processed_data)

    # Get native Tree SHAP contributions
    contributions = model.get_booster().predict(
        dmatrix,
        pred_contribs=True
    )

    # Shape:
    # (samples, classes, features + bias)
    class_contributions = contributions[
        0,
        prediction_class,
        :-1
    ]

    # Store contribution for every transformed feature
    transformed_contributions = []

    for feature_name, contribution in zip(
        feature_names,
        class_contributions
    ):
        transformed_contributions.append({
            "feature": feature_name,
            "contribution": float(contribution)
        })

    # Aggregate transformed features back to original features
    original_features = {}

    for item in transformed_contributions:

        transformed_name = item["feature"]
        contribution = item["contribution"]

        # Remove transformer prefix
        if transformed_name.startswith("num__"):
            original_feature = transformed_name.replace(
                "num__",
                ""
            )

        elif transformed_name.startswith("cat__"):
            remaining = transformed_name.replace(
                "cat__",
                ""
            )

            # Match the original categorical feature
            original_feature = None

            categorical_features = [
                "Gender",
                "family_history_with_overweight",
                "FAVC",
                "CAEC",
                "SMOKE",
                "SCC",
                "CALC",
                "MTRANS"
            ]

            for feature in categorical_features:
                if remaining.startswith(feature + "_"):
                    original_feature = feature
                    break

            if original_feature is None:
                original_feature = remaining

        else:
            original_feature = transformed_name

        # Add contribution to original feature
        if original_feature not in original_features:
            original_features[original_feature] = 0.0

        original_features[original_feature] += contribution

    # Sort by absolute contribution
    sorted_features = sorted(
        original_features.items(),
        key=lambda x: abs(x[1]),
        reverse=True
    )

    # Keep the strongest factors
    top_features = []

    for feature, contribution in sorted_features[:5]:

        direction = (
            "towards"
            if contribution > 0
            else "away from"
        )

        top_features.append({
            "feature": feature,
            "contribution": round(contribution, 4),
            "direction": direction
        })

    return {
        "prediction": prediction_name,
        "prediction_class": prediction_class,
        "top_factors": top_features
    }


if __name__ == "__main__":

    sample_input = {
        "Gender": "Male",
        "Age": 21,
        "Height": 1.75,
        "Weight": 110,
        "family_history_with_overweight": "yes",
        "FAVC": "yes",
        "FCVC": 2,
        "NCP": 3,
        "CAEC": "Sometimes",
        "SMOKE": "no",
        "CH2O": 2,
        "SCC": "no",
        "FAF": 1,
        "TUE": 1,
        "CALC": "Sometimes",
        "MTRANS": "Public_Transportation"
    }

    result = explain_prediction(sample_input)

    print("\nPrediction:")
    print(result["prediction"])

    print("\nTop factors:")

    for factor in result["top_factors"]:
        print(
            f'{factor["feature"]}: '
            f'{factor["contribution"]} '
            f'({factor["direction"]} prediction)'
        )