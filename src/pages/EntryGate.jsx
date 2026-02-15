import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useMusic } from "../context/MusicContext";
import { verifyEntry } from "../services/api";
import { FiHeart, FiLock } from "react-icons/fi";

export default function EntryGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState("gate"); // gate → envelope → loading → redirect
  const { login } = useAuth();
  const { startMusic } = useMusic();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setError("");
    setLoading(true);

    try {
      const { data } = await verifyEntry(password.trim());
      if (data.success) {
        login(data.token, data.config);
        startMusic();
        setPhase("envelope");

        setTimeout(() => setPhase("loading"), 2000);
        setTimeout(() => navigate("/home"), 4500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-romantic flex items-center justify-center relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-rose-500/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * -200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Password Gate */}
        {phase === "gate" && (
          <motion.div
            key="gate"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass-card p-8 md:p-12 max-w-md w-full mx-4 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-6"
            >
              💌
            </motion.div>

            <h1 className="font-romantic text-3xl md:text-4xl text-white mb-2">
              This Is For You
            </h1>
            <p className="text-white/50 mb-8 font-light">
              Enter the password to unlock our story
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Our secret..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/30 transition-all"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-rose-400 text-sm"
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:from-rose-500 hover:to-pink-500 transition-all disabled:opacity-50"
              >
                <FiHeart />
                {loading ? "Verifying..." : "Open My Heart"}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Envelope Opening */}
        {phase === "envelope" && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 180, scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="text-8xl mb-8"
            >
              💌
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-rose-300 font-romantic text-2xl"
            >
              A letter from my heart to yours...
            </motion.p>
          </motion.div>
        )}

        {/* Loading */}
        {phase === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-5xl mb-8 inline-block"
            >
              💕
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-rose-300/80 font-romantic text-2xl text-glow"
            >
              Unlocking Our Story...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
