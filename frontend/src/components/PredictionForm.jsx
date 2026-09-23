import { useEffect, useState } from "react";
import { predictObesity } from "../services/api";
import {
  savePrediction,
  getTodaysPredictionCount
} from "../services/firestore";
import PredictionResult from "./PredictionResult";

function PredictionForm({ user }) {
  const [formData, setFormData] = useState({
    Gender: "",
    Age: "",
    Height: "",
    Weight: "",
    family_history_with_overweight: "",
    FAVC: "",
    FCVC: "",
    NCP: "",
    CAEC: "",
    SMOKE: "",
    CH2O: "",
    SCC: "",
    FAF: "",
    TUE: "",
    CALC: "",
    MTRANS: ""
  });

  const [prediction, setPrediction] = useState("");
  const [topFactors, setTopFactors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [todayCount, setTodayCount] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };
  useEffect(() => {
  const loadTodayCount = async () => {
    try {
      const count = await getTodaysPredictionCount(user.uid);
      setTodayCount(count);
    } catch (error) {
      console.error("Daily count error:", error);
    }
  };

  loadTodayCount();
}, [user.uid]);
  const validateForm = () => {
  const requiredFields = Object.keys(formData);

  for (const field of requiredFields) {
    if (formData[field] === "" || formData[field] === null || formData[field] === undefined) {
      return "Please complete all fields before generating a prediction.";
    }
  }

  if (Number(formData.Age) < 2 || Number(formData.Age) > 100) {
    return "Please enter a valid age between 2 and 100.";
  }

  if (Number(formData.Height) <= 0) {
    return "Please enter a valid height.";
  }

  if (Number(formData.Weight) <= 0) {
    return "Please enter a valid weight.";
  }

  if (Number(formData.NCP) < 1 || Number(formData.NCP) > 4) {
    return "Number of main meals must be between 1 and 4.";
  }

  return "";
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const validationError = validateForm();

  if (validationError) {
    setError(validationError);
    return;
  }

  setLoading(true);
  setError("");

    try {
      const result = await predictObesity(formData);

setPrediction(result.prediction);
setTopFactors(result.top_factors);
setRecommendations(result.recommendations);
setTodayCount((previousCount) => previousCount + 1);

await savePrediction(user.uid, {
  inputData: formData,
  prediction: result.prediction,
  top_factors: result.top_factors,
  recommendations: result.recommendations
});

      console.log("Prediction:", result);

    } catch (error) {

      console.error("Error:", error);

      if (error.message === "You have reached the maximum of 5 predictions for today.") {
  setError(
    "You have reached today's limit of 5 predictions. Please try again tomorrow."
  );
} else {
  setError(
    "Unable to generate prediction. Please check your inputs and try again."
  );
}

    } finally {

      setLoading(false);

    }
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="form-section">
        <div className="section-heading">
          <span className="section-number">01</span>

          <div>
            <h2>Personal Information</h2>
            <p>Enter your basic physical information.</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="field">
            <label>Gender</label>

            <select
              name="Gender"
              value={formData.Gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="field">
            <label>Age</label>

            <input
              type="number"
              name="Age"
              min="2"
              max="100"
              value={formData.Age}
              onChange={handleChange}
              placeholder="Enter your age"
            />
          </div>

          <div className="field">
            <label>Height (m)</label>

            <input
              type="number"
              name="Height"
              min="0.01"
              value={formData.Height}
              onChange={handleChange}
              step="any"
              placeholder="e.g. 1.75"
            />
          </div>

          <div className="field">
            <label>Weight (kg)</label>

            <input
              type="number"
              name="Weight"
              min="0.01"
              value={formData.Weight}
              onChange={handleChange}
              step="any"
              placeholder="e.g. 75"
            />
          </div>

        </div>
      </div>


      <div className="form-section">
        <div className="section-heading">
          <span className="section-number">02</span>

          <div>
            <h2>Lifestyle Information</h2>
            <p>Tell us about your daily habits and lifestyle.</p>
          </div>
        </div>

        <div className="form-grid">

          <div className="field">
            <label>Family history of overweight</label>

            <select
              name="family_history_with_overweight"
              value={formData.family_history_with_overweight}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="field">
            <label>Frequent high-calorie food consumption</label>

            <select
              name="FAVC"
              value={formData.FAVC}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="field">
            <label>Vegetable Consumption Frequency</label>

            <select
              name="FCVC"
              value={formData.FCVC}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="1">Not Active</option>
              <option value="2">Occasionally</option>
              <option value="3">Frequently</option>
            </select>
          </div>

          <div className="field">
            <label>Number of main meals (NCP)</label>

            <input
              type="number"
              name="NCP"
              value={formData.NCP}
              onChange={handleChange}
              step="1"
              min="1"
              max="4"
              placeholder="1 - 4"
            />
          </div>

          <div className="field">
            <label>Food between meals</label>

            <select
              name="CAEC"
              value={formData.CAEC}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="Sometimes">Occasionally</option>
              <option value="Frequently">Frequently</option>
              <option value="Always">Always</option>
            </select>
          </div>

          <div className="field">
            <label>Smoking</label>

            <select
              name="SMOKE"
              value={formData.SMOKE}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="field">
            <label>Daily Water Consumption</label>

            <select
              name="CH2O"
              value={formData.CH2O}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="1">Less than 1 L/day</option>
              <option value="2">1-2 L/day</option>
              <option value="3">More than 2 L/day</option>
            </select>
          </div>

          <div className="field">
            <label>Monitor calorie consumption</label>

            <select
              name="SCC"
              value={formData.SCC}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          <div className="field">
            <label>Physical Activity Frequency</label>

            <select
              name="FAF"
              value={formData.FAF}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="0">Not Active</option>
              <option value="1">Occasionally</option>
              <option value="2">Frequently</option>
              <option value="3">Very Frequently</option>
            </select>
          </div>

          <div className="field">
            <label>Technology / Device Usage</label>

            <select
              name="TUE"
              value={formData.TUE}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="0">Less than 1 hour/day</option>
              <option value="1">1-2 hours/day</option>
              <option value="2">More than 2 hours/day</option>
            </select>
          </div>

          <div className="field">
            <label>Alcohol consumption</label>

            <select
              name="CALC"
              value={formData.CALC}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="no">No</option>
              <option value="Sometimes">Occasionally</option>
              <option value="Frequently">Frequently</option>
              <option value="Always">Always</option>
            </select>
          </div>

          <div className="field">
            <label>Main mode of transportation</label>

            <select
              name="MTRANS"
              value={formData.MTRANS}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Automobile">Automobile (3 wheeler, 4 wheeler etc)</option>
              <option value="Motorbike">Motorbike</option>
              <option value="Public_Transportation">
                Public Transportation
              </option>
              <option value="Walking">Walking</option>
              <option value="Bike">Cycle</option>
            </select>
          </div>

        </div>
      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      <div className="daily-limit">

  <span>
    Today's predictions
  </span>

  <strong>
    {todayCount} / 5
  </strong>

</div>

<button
  type="submit"
  disabled={loading || todayCount >= 5}
>
  {loading
    ? "Analyzing..."
    : todayCount >= 5
      ? "Daily Limit Reached"
      : "Predict Obesity Category"}
</button>


      <PredictionResult
        prediction={prediction}
        topFactors={topFactors}
        recommendations={recommendations}
      />

    </form>
  );
}

export default PredictionForm;