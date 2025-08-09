
import React from 'react'
import { Link } from 'react-router-dom';

const Button = ({ children, onClick, type = "button", className = "" }) => (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm ${className}`}
    >
      {children}
    </button>
  );
  
  export default Button;
  