import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutUser } from "../features/authSlice";
import { 
  User, LogOut, ExternalLink, 
  LayoutDashboard, Palette, Link as LinkIcon,
  Home, Menu, X, Box, Megaphone, MoreHorizontal,ChevronLeft,ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", to: "/", icon: Home, description: "Return to homepage" },
    { name: "Dashboard", to: "/app/bio", icon: LayoutDashboard, description: "Manage your bio page" },
    { name: "Products", to: "/app/addproduct", icon: LinkIcon, description: "Manage your links" },
    { name: "Themes", to: "/app/biotheme", icon: Palette, description: "Customize appearance" },
    { name: "Profile", to: "/app/profile", icon: User, description: "Edit your profile" },
  ];

  const profileUrl = user?.username ? `/${user.username}` : null;

  return (
    <>
      {/* Mobile Header (shown only on mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg z-40 border-t border-gray-200">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? "text-purple-600" : "text-gray-500"
                }`
              }
            >
              <link.icon size={20} className="mb-1" />
              <span className="text-xs">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Desktop Sidebar (hidden on mobile) */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`hidden md:flex fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-40 flex-col ${
          collapsed ? "w-16" : "w-64"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Logo and Collapse Button */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {!collapsed && <span>Linkbrew</span>}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center mx-2 my-1 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-purple-50 text-purple-700" 
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
              title={collapsed ? link.description : ""}
            >
              <link.icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="ml-3 font-medium"
                >
                  {link.name}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User & Actions */}
        <div className="p-4 border-t border-gray-200">
          {user && (
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={user.photoURL || "/avatar-placeholder.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
              />
              {!collapsed && (
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-900 truncate">
                    {user.displayName?.split(' ')[0] || user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}

          {profileUrl && !collapsed && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mb-2"
            >
              <ExternalLink size={16} className="mr-3" />
              View Profile
            </a>
          )}

          <button
            onClick={() => dispatch(signOutUser())}
            className={`flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Sign out" : ""}
          >
            <LogOut size={16} />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </button>
        </div>
      </motion.div>
    </>
  );
}