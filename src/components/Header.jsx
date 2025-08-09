// src/components/Header.jsx (updated)
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../features/authSlice";

export default function Header() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Linkbrew
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/" className="hidden sm:inline">Home</Link>
          {user ? (
            <>
              <Link to="/app/bio" className="hidden sm:inline">Bio</Link>
              <Link to="/app/biotheme" className="hidden sm:inline">theme</Link>
              <div className="flex items-center gap-3">
                <img src={user.photoURL || "/avatar-placeholder.png"} alt="me" className="w-8 h-8 rounded-full object-cover" />
                <button onClick={() => dispatch(signOutUser())} className="text-sm text-red-500 hover:underline">Logout</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="text-sm px-3 py-1 rounded bg-purple-600 text-white">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
