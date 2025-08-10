import React from 'react';

export default function InputField({ 
  type = "text", 
  placeholder = "", 
  value, 
  onChange, 
  autoComplete = "off" 
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`
        bg-white/5 
        text-white 
        p-3 
        rounded-lg 
        w-full 
        transition-shadow 
        duration-300 
        outline-none
        border border-transparent
        hover:shadow-[0_0_8px_2px_rgba(219,39,119,0.7)]
        focus:shadow-[0_0_8px_4px_rgba(219,39,119,0.9)]
      `}
    />
  );
}
