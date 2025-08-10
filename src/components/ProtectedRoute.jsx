import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserSetupWizard from "../pages/UserSetupWizard";

export default function ProtectedRoute({ children }) {
  const user = useSelector((s) => s.auth.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return children;
}
