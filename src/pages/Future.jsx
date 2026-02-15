import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { predictFuture } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import TypingText from "../components/TypingText";
import { FiStar } from "react-icons/fi";

export default function Future() {
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handlePredict = async () => {
    setPrediction("");
    setLoading(true);
    setRevealed(false);

    try {
      const { data } = await predictFuture();
      setPrediction(data.prediction);
      setRevealed(true);
    } catch {
      setPrediction("The stars are aligning for us... try again in a moment 💫");
      setRevealed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-10"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🔮
            </motion.div>
            <h1 className="font-romantic text-4xl md:text-5xl text-white text-glow mb-3">
              Our Future Together
            </h1>
            <p className="text-white/40 font-light">
              A glimpse into the beautiful life waiting for us
            </p>
          </motion.div>

          {!revealed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePredict}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-10 py-4 rounded-2xl font-romantic text-xl hover:from-purple-500 hover:to-rose-500 transition-all disabled:opacity-50 flex items-center gap-3 mx-auto shadow-lg shadow-purple-500/20"
              >
                <FiStar />
                {loading ? "Gazing into our future..." : "See Our Future"}
              </motion.button>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-12"
            >
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl inline-block"
              >
                ✨
              </motion.div>
              <p className="text-white/40 mt-4 font-romantic text-lg">
                The universe is writing our story...
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {revealed && prediction && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="glass-card p-8 md:p-12 mt-8"
              >
                <div className="text-center mb-6">
                  <span className="text-3xl">✨</span>
                </div>
                <div className="font-romantic text-lg md:text-xl text-white/80 leading-relaxed whitespace-pre-wrap">
                  <TypingText text={prediction} speed={18} />
                </div>
                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePredict}
                    className="text-rose-400/60 hover:text-rose-400 transition-all text-sm flex items-center gap-2 mx-auto"
                  >
                    <FiStar size={14} />
                    See another version
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageWrapper>
    </>
  );
}
