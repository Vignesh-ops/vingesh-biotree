import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { setUser, clearUser,setAuthLoading } from "./features/authSlice";
import { doc, getDoc } from "firebase/firestore";
// import AppRoutes from "./AppRoutes"; // keep routing in separate file or below
import Login from "./pages/Login";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ThemeSelector from "./components/SelectedTheme"; 
import UserSetupWizard from './pages/UserSetupWizard';
// App.jsx
import { useNavigate } from "react-router-dom";


function App() {
  return (
    <Router>
      <AppRoutes /> {/* ✅ now inside Router */}
    </Router>
  );
}

function AppRoutes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setAuthLoading());

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          const userRef = doc(db, "users", fbUser.uid);
          const userSnap = await getDoc(userRef);
          const userDocData = userSnap.exists() ? userSnap.data() : {};

          const fullUser = {
            uid: fbUser.uid,
            displayName: fbUser.displayName,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            ...userDocData,
          };

          dispatch(setUser(fullUser));

          const allowedRedirectFrom = ["/", "/login"];
          if (
            fullUser.username &&
            fullUser.theme &&
            Array.isArray(fullUser.bioLinks) &&
            fullUser.bioLinks.length > 0 &&
            allowedRedirectFrom.includes(location.pathname)
          ) {
            navigate("/app/bio", { replace: true });
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        dispatch(setAuthError(err.message));
      }
    });

    return () => unsub();
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bio" element={<Dashboard />} />
        <Route path="biotheme" element={<ThemeSelector />} />
        <Route path="setup" element={<UserSetupWizard />} />
      </Route>
      <Route path="/:username" element={<PublicProfile />} />
    </Routes>
  );
}

export default App;
