import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "./firebase";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Auth from "./components/Auth";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (checkingAuth) {
    return null;
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home user={user} />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard user={user} />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;