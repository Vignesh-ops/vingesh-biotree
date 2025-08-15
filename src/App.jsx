import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { setUser, clearUser, setAuthLoading } from "./features/authSlice";
import { doc, getDoc } from "firebase/firestore";
import Login from "./pages/Login";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ThemeSelector from "./components/SelectedTheme"; 
import UserSetupWizard from './pages/UserSetupWizard';
import LoadingSpinner from './components/UI/LoadingSpinner';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(setAuthLoading(true));
   

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          // Fixed: Proper Firestore structure
          const profileRef = doc(db, "users", fbUser.uid);
          const profileSnap = await getDoc(profileRef);
          const profileData = profileSnap.exists() ? profileSnap.data() : {};

          const fullUser = {
            uid: fbUser.uid,
            displayName: fbUser.displayName,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            ...profileData,
          };

          dispatch(setUser(fullUser));

          // Fixed: Better profile completion check
          const hasProfileSetup =
            fullUser.username &&
            fullUser.theme &&
            fullUser.bio &&
            Array.isArray(fullUser.bioLinks) &&
            fullUser.bioLinks.length > 0;

          // Fixed: Proper redirect logic
          if (hasProfileSetup && ["/", "/login"].includes(location.pathname)) {
            navigate("/app/bio", { replace: true });
          } else if (!hasProfileSetup && location.pathname.startsWith("/app") && !location.pathname.includes("/setup")) {
            navigate("/app/setup", { replace: true });
          }
        } else {
          dispatch(clearUser());
          if (location.pathname.startsWith("/app")) {
            navigate("/login", { replace: true });
          }
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        dispatch(clearUser());
      } finally {
        dispatch(setAuthLoading(false));
      }
    });

    return () => unsub();
  }, [dispatch, navigate, location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
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
      {/* 404 Route */}
      <Route path="*" element={<div className="p-8 text-center">Page not found</div>} />
    </Routes>
  );
}

export default App;