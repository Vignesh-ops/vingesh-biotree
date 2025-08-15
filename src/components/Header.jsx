import React, { useState, useCallback, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../features/authSlice";
import { Menu, X, User, LogOut, Settings, ExternalLink, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropdownOpen(false);
  }, [location]);

  const navLinks = [
    { 
      name: "Home", 
      to: "/", 
      description: "Back to homepage",
      icon: null
    },
    { 
      name: "Dashboard", 
      to: "/app/bio", 
      authOnly: true,
      description: "Manage your bio page",
      icon: User
    },
    { 
      name: "Themes", 
      to: "/app/biotheme", 
      authOnly: true,
      description: "Customize your appearance",
      icon: Settings
    },
  ];

  const handleSignOut = useCallback(() => {
    dispatch(signOutUser());
    setProfileDropdownOpen(false);
    setMobileOpen(false);
  }, [dispatch]);

  const toggleProfileDropdown = useCallback(() => {
    setProfileDropdownOpen(prev => !prev);
  }, []);

  const profileUrl = user?.username ? `/${user.username}` : null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
          >
            <span className="text-3xl">🔗</span>
            <span>Linkbrew</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              if (link.authOnly && !user) return null;
              
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                      isActive 
                        ? "text-purple-700 bg-purple-50" 
                        : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon size={16} />}
                    {link.name}
                  </span>
                  
                  {/* Hover tooltip */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {link.description}
                  </div>
                </NavLink>
              );
            })}

            {/* User Actions */}
            {user ? (
              <div className="relative ml-4" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                >
                  <img
                    src={user.photoURL || "/avatar-placeholder.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-200 group-hover:border-purple-400 transition-colors"
                  />
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user.displayName?.split(' ')[0] || user.username}
                  </span>
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <img
                            src={user.photoURL || "/avatar-placeholder.png"}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {user.displayName || user.username}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <Link
                          to="/app/bio"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User size={16} />
                          Dashboard
                        </Link>
                        
                        <Link
                          to="/app/biotheme"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings size={16} />
                          Settings
                        </Link>

                        {profileUrl && (
                          <a
                            href={profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <ExternalLink size={16} />
                            View Public Profile
                          </a>
                        )}
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 bg-white"
            >
              <nav className="py-4 space-y-1">
                {navLinks.map((link) => {
                  if (link.authOnly && !user) return null;
                  
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg mx-4 transition-colors ${
                          isActive
                            ? "text-purple-700 bg-purple-50"
                            : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      {link.icon && <link.icon size={20} />}
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}

                {user ? (
                  <div className="px-4 pt-4 border-t border-gray-200 mt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={user.photoURL || "/avatar-placeholder.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.displayName || user.username}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    
                    {profileUrl && (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-2"
                      >
                        <ExternalLink size={16} />
                        View Public Profile
                      </a>
                    )}
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="px-4 pt-4 border-t border-gray-200 mt-4">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg text-center shadow-md"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}