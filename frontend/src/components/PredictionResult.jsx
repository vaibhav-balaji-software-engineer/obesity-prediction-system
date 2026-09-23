function PredictionResult({ prediction, topFactors, recommendations }) {
  if (!prediction) {
    return null;
  }

  const formattedPrediction = prediction.replaceAll("_", " ");
  const predictionInterpretations = {
  Insufficient_Weight:
    "Below the normal-weight category",

  Normal_Weight:
    "Within the normal-weight category",

  Overweight_Level_I:
    "Above the normal-weight category — lifestyle improvements may help",

  Overweight_Level_II:
    "Above the normal-weight category — greater attention to healthy habits may help",

  Obesity_Type_I:
    "Obesity category — consider focusing on healthy weight management",

  Obesity_Type_II:
    "Higher obesity category — consider professional health guidance",

  Obesity_Type_III:
    "Higher obesity category — professional health guidance is recommended"
};

  return (
    <div className="prediction-result">

      {/* Prediction */}

      <div className="result-title">
  <p>Prediction</p>

  <h2>{formattedPrediction}</h2>

  <span className="prediction-interpretation">
    {predictionInterpretations[prediction]}
  </span>
</div>


      {/* Main Factors */}

      {topFactors && topFactors.length > 0 && (
        <div className="result-section">

          <div className="result-section-title">
            <h3>Main Factors Involved</h3>
          </div>

          <div className="factors-list">

            {topFactors.map((factor, index) => (
              <div className="factor-row" key={index}>

                <div className="factor-info">

                  <strong>
  {{
    NCP: "Number of Main Meals",
    FAVC: "High-Calorie Food Consumption",
    CH2O: "Daily Water Consumption",
    FCVC: "Vegetable Consumption",
    FAF: "Physical Activity Frequency",
    TUE: "Technology / Device Usage",
    CAEC: "Food Between Meals",
    SCC: "Calorie Consumption Monitoring",
    CALC: "Alcohol Consumption",
    MTRANS: "Main Mode of Transportation",
    Gender: "Gender",
    Age: "Age",
    Height: "Height",
    Weight: "Weight",
    SMOKE: "Smoking",
    family_history_with_overweight: "Family History of Overweight"
  }[factor.feature] || factor.feature}
</strong>

                  <span
                    className={
                      factor.direction === "towards"
                        ? "factor-positive"
                        : "factor-negative"
                    }
                  >
                    {factor.direction === "towards"
                      ? "A major factor in the predicted category"
                      : "Had less influence on the predicted category"}
                  </span>

                </div>

              </div>
            ))}

          </div>

          <p className="explanation-note">
            These factors describe how the machine learning model arrived at
            its prediction. They indicate model behavior, not causation.
          </p>

        </div>
      )}


      {/* Recommendations */}

      {recommendations && recommendations.length > 0 && (
        <div className="result-section">

          <div className="result-section-title">
            <h3>Recommendations</h3>
          </div>

          <div className="recommendations-list">

            {recommendations.map((recommendation, index) => (
              <div className="recommendation-row" key={index}>

                <span className="recommendation-dot"></span>

                <p>{recommendation}</p>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default PredictionResult;