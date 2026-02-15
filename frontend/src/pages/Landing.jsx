import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiEdit3, FiArrowRight } from "react-icons/fi";

export default function Landing() {
  const navigate = useNavigate();
  const [visitSlug, setVisitSlug] = useState("");

  const handleVisit = (e) => {
    e.preventDefault();
    if (visitSlug.trim()) {
      navigate(`/love/${visitSlug.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-purple-900 flex items-center justify-center p-4">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/20 text-4xl"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 100,
            }}
            animate={{
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            Forever <span className="text-pink-400">Yours</span>
          </motion.h1>
          <p className="text-xl text-pink-200">
            Create a personalized love website for your special someone
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Create Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transition-all"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mb-6">
              <FiEdit3 className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Create Your Love Page</h2>
            <p className="text-pink-200 mb-6">
              Build a personalized website with AI chatbot, love letters, memories timeline, and more for your partner.
            </p>
            <button
              onClick={() => navigate("/create")}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all flex items-center justify-center gap-2"
            >
              Get Started <FiArrowRight />
            </button>
          </motion.div>

          {/* Visit Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-pink-400/50 transition-all"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
              <FiHeart className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Visit a Love Page</h2>
            <p className="text-pink-200 mb-6">
              Someone created a special page for you? Enter the unique link below to visit.
            </p>
            <form onSubmit={handleVisit} className="space-y-3">
              <div className="flex items-center bg-white/10 rounded-xl overflow-hidden">
                <span className="px-4 text-pink-300 whitespace-nowrap">/love/</span>
                <input
                  type="text"
                  value={visitSlug}
                  onChange={(e) => setVisitSlug(e.target.value)}
                  placeholder="unique-link"
                  className="flex-1 py-3 pr-4 bg-transparent text-white placeholder-pink-300/50 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={!visitSlug.trim()}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Visit Page <FiArrowRight />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Already have account */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-pink-200">
            Already created a page?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-pink-400 hover:text-pink-300 font-semibold underline"
            >
              Sign in to manage it
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
