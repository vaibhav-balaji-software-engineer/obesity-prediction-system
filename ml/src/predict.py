import os
import joblib
import pandas as pd


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.pkl")
PREPROCESSOR_PATH = os.path.join(
    BASE_DIR, "models", "preprocessing_pipeline.pkl"
)


# --------------------------------------------------
# Load model and preprocessing pipeline
# --------------------------------------------------

model = joblib.load(MODEL_PATH)
preprocessor = joblib.load(PREPROCESSOR_PATH)


# --------------------------------------------------
# Prediction function
# --------------------------------------------------

def predict_obesity(input_data):
    """
    Predict obesity category from the 16 original input features.
    """

    input_df = pd.DataFrame([input_data])

    processed_data = preprocessor.transform(input_df)

    prediction_encoded = model.predict(processed_data)[0]

    class_names = {
        0: "Insufficient_Weight",
        1: "Normal_Weight",
        2: "Obesity_Type_I",
        3: "Obesity_Type_II",
        4: "Obesity_Type_III",
        5: "Overweight_Level_I",
        6: "Overweight_Level_II"
    }

    prediction = class_names[int(prediction_encoded)]

    return prediction


# --------------------------------------------------
# Test prediction
# --------------------------------------------------

# --------------------------------------------------
# Test multiple predictions
# --------------------------------------------------

if __name__ == "__main__":

    test_inputs = [
        {
            "Gender": "Male",
            "Age": 21,
            "Height": 1.75,
            "Weight": 75,
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
        },

        {
            "Gender": "Female",
            "Age": 20,
            "Height": 1.60,
            "Weight": 50,
            "family_history_with_overweight": "no",
            "FAVC": "no",
            "FCVC": 3,
            "NCP": 3,
            "CAEC": "Sometimes",
            "SMOKE": "no",
            "CH2O": 2,
            "SCC": "no",
            "FAF": 2,
            "TUE": 1,
            "CALC": "no",
            "MTRANS": "Walking"
        },

        {
            "Gender": "Male",
            "Age": 25,
            "Height": 1.70,
            "Weight": 110,
            "family_history_with_overweight": "yes",
            "FAVC": "yes",
            "FCVC": 1,
            "NCP": 3,
            "CAEC": "Frequently",
            "SMOKE": "no",
            "CH2O": 2,
            "SCC": "no",
            "FAF": 0,
            "TUE": 2,
            "CALC": "Sometimes",
            "MTRANS": "Automobile"
        }
    ]

    for i, input_data in enumerate(test_inputs, start=1):

        prediction = predict_obesity(input_data)

        print(f"Person {i}: {prediction}")