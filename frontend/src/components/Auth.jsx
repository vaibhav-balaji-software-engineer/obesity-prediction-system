import { useState } from "react";
import { signupUser, loginUser } from "../services/auth";

function Auth({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      let user;

      if (isSignup) {
        user = await signupUser(email, password);
      } else {
        user = await loginUser(email, password);
      }

      onLogin(user);

    } catch (error) {

      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (error.code === "auth/invalid-credential") {
        setError("Incorrect email or password.");
      } else if (error.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else {
        setError("Unable to authenticate. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <p className="auth-label">
            HEALTH PREDICTION SYSTEM
          </p>

          <h1>
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>

          <p>
            {isSignup
              ? "Create an account to save your health prediction history."
              : "Sign in to access your health prediction history."}
          </p>

        </div>


        <form onSubmit={handleSubmit} className="auth-form">

          <div className="auth-field">

            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />

          </div>


          <div className="auth-field">

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

          </div>


          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isSignup
                ? "Create Account"
                : "Sign In"}
          </button>

        </form>


        <div className="auth-switch">

          <span>
            {isSignup
              ? "Already have an account?"
              : "Don't have an account?"}
          </span>

          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Sign In" : "Create Account"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default Auth;