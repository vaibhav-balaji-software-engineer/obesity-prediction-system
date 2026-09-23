import { Link } from "react-router-dom";
import PredictionForm from "../components/PredictionForm";
import { logoutUser } from "../services/auth";

function Home({ user }) {
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
      to="/dashboard"
      className="dashboard-link"
    >
      Dashboard
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

        <h1>Obesity Prediction System</h1>

        <p>
          Machine learning based obesity category prediction with
          explainable insights and personalized recommendations.
        </p>

      </header>

      <main className="main-content">
          <PredictionForm user={user} />
      </main>
    </div>
  );
}

export default Home;