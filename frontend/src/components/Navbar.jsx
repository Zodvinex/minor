import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // ignore (still clear local state)
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className={`sticky top-0 z-40 border-b text-white shadow-[0_14px_34px_-18px_rgba(22,35,96,0.9)] backdrop-blur-lg ${
      isDark
        ? 'border-white/10 bg-gradient-to-r from-[#111b3a]/95 via-[#1f2247]/95 to-[#2f2259]/95'
        : 'border-white/20 bg-gradient-to-r from-[#203b8b]/95 via-[#2e3f95]/95 to-[#5b41b2]/95'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#f8de9d] to-[#c9a250] shadow-[0_0_24px_rgba(249,216,151,0.45)]" />
          <div className="text-2xl font-black tracking-tight">Exam System</div>
        </div>

        {user && (
          <div className="flex items-center gap-4 md:gap-6">
            <span className={`hidden text-sm md:block ${isDark ? 'text-slate-200' : 'text-indigo-100'}`}>
              Welcome, <span className="font-semibold">{user.name}</span>
            </span>
            <span className="rounded-full border border-[#f1d18a]/60 bg-[#f8de9d]/20 px-3 py-1 text-xs font-semibold text-[#ffe8b8]">
              {user.role.toUpperCase()}
            </span>
            <button
              onClick={toggleTheme}
              className={`rounded-xl px-4 py-2 font-semibold transition ${
                isDark
                  ? 'border border-[#6f5b2f]/60 bg-[#f8de9d]/10 text-[#f8de9d] hover:bg-[#f8de9d]/20'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className={`rounded-xl px-4 py-2 font-semibold text-white transition ${
                isDark ? 'bg-rose-500/70 hover:bg-rose-500/90' : 'bg-white/15 hover:bg-white/25'
              }`}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

