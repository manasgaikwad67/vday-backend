import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMusic } from "../context/MusicContext";
import {
  FiHome, FiHeart, FiMessageCircle, FiMail,
  FiStar, FiClock, FiLock, FiMenu, FiX, FiMusic,
} from "react-icons/fi";

const links = [
  { to: "/home", label: "Home", icon: FiHome },
  { to: "/timeline", label: "Memories", icon: FiClock },
  { to: "/letters", label: "Letters", icon: FiMail },
  { to: "/chat", label: "Talk to Me", icon: FiMessageCircle },
  { to: "/mood", label: "How Are You?", icon: FiHeart },
  { to: "/future", label: "Our Future", icon: FiStar },
  { to: "/secret", label: "Secret", icon: FiLock },
  { to: "/forever", label: "Forever", icon: FiHeart },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isPlaying, toggleMusic } = useMusic();
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass px-6 py-3 items-center justify-between">
        <button
          onClick={() => navigate("/home")}
          className="font-handwriting text-2xl text-rose-400 hover:text-rose-300 transition"
        >
          💕 Our Story
        </button>

        <div className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-rose-500/20 text-rose-300"
                    : "text-white/60 hover:text-white/90 hover:bg-white/5"
                }`
              }
            >
              <Icon size={14} />
              <span className="hidden lg:inline">{label}</span>
            </NavLink>
          ))}
        </div>

        <button
          onClick={toggleMusic}
          className={`p-2 rounded-full transition-all ${
            isPlaying ? "text-rose-400 bg-rose-500/20" : "text-white/40 hover:text-white/70"
          }`}
        >
          <FiMusic size={18} />
        </button>
      </nav>

      {/* Mobile nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between">
        <span className="font-handwriting text-xl text-rose-400">💕 Our Story</span>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className={`p-2 rounded-full ${isPlaying ? "text-rose-400" : "text-white/40"}`}
          >
            <FiMusic size={16} />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white/70 p-2">
            {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-14 left-0 right-0 z-50 glass-card m-4 p-4"
          >
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-rose-500/20 text-rose-300"
                      : "text-white/60 hover:text-white/90"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
