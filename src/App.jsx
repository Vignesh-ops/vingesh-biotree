import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useNavigate, useLocation } from "react-router-dom";
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
const location = useLocation();
  useEffect(() => {
    dispatch(setAuthLoading());

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          
          const profileRef = doc(db, "users", fbUser.uid, "profile", "info");
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

          const hasProfileSetup =
          fullUser.username &&
          fullUser.theme &&
          Array.isArray(fullUser.bioLinks) &&
          fullUser.bioLinks.length > 0;

        // ✅ Redirect ONLY if user has setup and is on unwanted pages
        if (
          hasProfileSetup &&
          ["/", "/login", "/app/setup"].includes(location.pathname)
        ) {
          navigate("/app/bio", { replace: true });
        }
        } else {
          dispatch(clearUser());
        }
      } catch (err) {
        // dispatch(setAuthError(err.message));
        console.log(err)
      }
    });

    return () => unsub();
  }, [dispatch, navigate,location.pathname]);

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
