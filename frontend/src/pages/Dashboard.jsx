import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PredictionHistory from "../components/PredictionHistory";
import WeightTrendChart from "../components/WeightTrendChart";

import { getPredictionHistory } from "../services/history";
import { logoutUser } from "../services/auth";

function Dashboard({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getPredictionHistory(user.uid);
        setHistory(data);
      } catch (error) {
        console.error("History error:", error);
        setError("Unable to load prediction history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [user.uid]);

  const latestPrediction =
    history.length > 0
      ? history[0].prediction?.replaceAll("_", " ")
      : "No predictions yet";

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="app-container">

      <header className="hero-section">

        <div className="hero-topbar">

          <span className="hero-brand">
            HEALTH PREDICTION SYSTEM
          </span>

          <div className="hero-actions">

            <Link
              to="/"
              className="dashboard-link"
            >
              Prediction
            </Link>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Sign Out
            </button>

          </div>

        </div>

        <h1>Health Dashboard</h1>

        <p>
          View your previous obesity predictions and health trends.
        </p>

      </header>

      <main className="main-content">

        {loading ? (
          <p className="history-status">
            Loading your dashboard...
          </p>
        ) : error ? (
          <p className="history-error">
            {error}
          </p>
        ) : (
          <>
            <section className="dashboard-overview">

              <div className="overview-card">
                <span className="overview-label">
                  Total Predictions
                </span>

                <strong className="overview-value">
                  {history.length}
                </strong>
              </div>

              <div className="overview-card">
                <span className="overview-label">
                  Latest Prediction
                </span>

                <strong className="overview-value overview-prediction">
                  {latestPrediction}
                </strong>
              </div>

            </section>

            <WeightTrendChart history={history} />

            <PredictionHistory history={history} />
          </>
        )}

      </main>

    </div>
  );
}

export default Dashboard;