import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiLock } from "react-icons/fi";
import { getPageBySlug, partnerEntry } from "../services/api";
import { useMusic } from "../context/MusicContext";
import { useAuth } from "../context/AuthContext";

export default function PartnerEntry() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { startMusic } = useMusic();
  const { login } = useAuth();

  const [pageInfo, setPageInfo] = useState(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Check if already authenticated for this page
    const existingToken = localStorage.getItem("entryToken");
    const savedSlug = localStorage.getItem("currentSlug");
    if (existingToken && savedSlug === slug) {
      navigate("/home");
      return;
    }

    // Load page info
    loadPageInfo();
  }, [slug]);

  const loadPageInfo = async () => {
    try {
      const { data } = await getPageBySlug(slug);
      setPageInfo(data.page);
      setLoading(false);
    } catch {
      setNotFound(true);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await partnerEntry(slug, password);
      
      // Store auth using context
      login(data.token, {
        herName: data.config.herName,
        myName: data.config.myName,
        relationshipStart: data.config.relationshipStart,
      });
      
      localStorage.setItem("currentSlug", slug);

      // Start music and navigate
      startMusic();
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Wrong password 💔");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-purple-900 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-6xl"
        >
          💕
        </motion.div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-pink-200 mb-6">This love page doesn't exist</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
          >
            Go Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-purple-900 flex items-center justify-center p-4">
      {/* Floating hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-500/20 text-4xl"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: (typeof window !== "undefined" ? window.innerHeight : 800) + 100,
            }}
            animate={{
              y: -100,
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

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            💝
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Hello, {pageInfo?.partnerName || "Beautiful"} 💕
          </h1>
          <p className="text-pink-200">
            {pageInfo?.creatorName} created something special for you
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-pink-200 text-sm mb-2 block">
                Enter the secret password to unlock
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your secret password..."
                  autoFocus
                  className="w-full pl-12 pr-4 py-4 bg-white/10 rounded-xl text-white placeholder-pink-300/50 focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-300 text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <FiHeart /> Enter Our World
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
