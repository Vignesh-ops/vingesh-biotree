import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { setUser, clearUser } from "./features/authSlice";
import { doc, getDoc } from "firebase/firestore";
// import AppRoutes from "./AppRoutes"; // keep routing in separate file or below
import Login from "./pages/Login";
import PublicProfile from "./pages/PublicProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import ThemeSelector from "./components/SelectedTheme"; 
import UserSetupWizard from './pages/UserSetupWizard'
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        console.log('yes')

        // try to fetch the user doc to get username/bio etc
        const userRef = doc(db, "users", fbUser.uid);
        const userSnap = await getDoc(userRef);
        const userDocData = userSnap.exists() ? userSnap.data() : {};
        dispatch(
          setUser({
            uid: fbUser.uid,
            displayName: fbUser.displayName,
            email: fbUser.email,
            photoURL: fbUser.photoURL,
            // merge Firestore doc fields (username, bio, etc)
            ...userDocData,
          })
        );
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsub();
  }, [dispatch]);
  return (
    <Router>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="bio" element={<Dashboard />} />
          <Route path="biotheme" element={<ThemeSelector />} />
          <Route path="setup" element={<UserSetupWizard />} />
          {/* add more nested routes here */}
        </Route>

        {/* public profile */}
        <Route path="/:username" element={<PublicProfile />} />
      </Routes>
    </Router>
  );
}
export default App;
