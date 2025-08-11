import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../features/authSlice";
import { Menu, X } from "lucide-react";

export default function Header() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Bio", to: "/app/bio", authOnly: true },
    { name: "Theme", to: "/app/biotheme", authOnly: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500"
        >
          Linkbrew
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(
            (link) =>
              (!link.authOnly || user) && (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `hover:text-purple-600 transition ${
                      isActive ? "text-purple-600 font-semibold" : "text-gray-700"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )
          )}

          {user ? (
           <div className="relative group">
           <img
             src={user.photoURL || "/avatar-placeholder.png"}
             alt="me"
             className="w-8 h-8 rounded-full object-cover border-2 border-purple-400 cursor-pointer"
           />
           {/* Dropdown */}
           <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
             <Link
               to="/app/profile"
               className="block px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 rounded"
             >
               Profile
             </Link>
             <button
               onClick={() => dispatch(signOutUser())}
               className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded"
             >
               Logout
             </button>
           </div>
         </div>
         
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transition"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="flex flex-col p-4 gap-3">
            {navLinks.map(
              (link) =>
                (!link.authOnly || user) && (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `hover:text-purple-600 transition ${
                        isActive ? "text-purple-600 font-semibold" : "text-gray-700"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                )
            )}

            {user ? (
              <>
                <Link
                  to="/app/profile"
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-purple-600"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    dispatch(signOutUser());
                    setMobileOpen(false);
                  }}
                  className="text-red-500 hover:text-red-600 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md text-center"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
