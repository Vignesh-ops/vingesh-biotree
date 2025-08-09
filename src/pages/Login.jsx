// src/pages/Login.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithGoogle } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import gicon from "../assets/google-icon.png";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);

  useEffect(() => {
    if (user) navigate("/app/bio");
  }, [user, navigate]);

  const handleGoogle = () => {
    dispatch(signInWithGoogle());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome to <span className="text-purple-600">Linkbrew</span>
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Build your personal link page in minutes. Sign in with Google to get started.
        </p>
        <button
          onClick={handleGoogle}
          className="w-full py-3 rounded-lg border border-gray-300 flex items-center justify-center gap-3 hover:shadow-lg hover:border-purple-500 transition"
        >
          <img src={gicon} alt="google" className="w-6 h-6" />
          <span className="font-medium text-gray-700">
            {status === "loading" ? "Signing in..." : "Continue with Google"}
          </span>
        </button>
        <div className="mt-8 text-xs text-gray-400">
          By signing in, you agree to our{" "}
          <a href="#" className="text-purple-500 hover:underline">
            Terms
          </a>{" "}
          &{" "}
          <a href="#" className="text-purple-500 hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
}
