import React from 'react';
import { useGym } from '../../context/GymContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useGym();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`p-2 rounded-lg border border-[#2A2A2A] bg-[#161616] hover:bg-[#1E1E1E] text-[#9A9A9A] hover:text-[#F2F2F2] transition-colors ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-[#E8A317]" />
      ) : (
        <Moon className="w-4 h-4 text-[#E8590C]" />
      )}
    </button>
  );
}

