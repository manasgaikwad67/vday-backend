import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateLetter } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import TypingText from "../components/TypingText";
import { FiHeart, FiRefreshCw } from "react-icons/fi";

const styles = [
  { id: "romantic", label: "Romantic", emoji: "💕", desc: "Deep & heartfelt" },
  { id: "funny", label: "Funny", emoji: "😄", desc: "Playful & witty" },
  { id: "emotional", label: "Emotional", emoji: "🥺", desc: "Raw & real" },
  { id: "bollywood", label: "Bollywood", emoji: "🎬", desc: "Filmy drama" },
  { id: "future-husband", label: "Future Husband", emoji: "💍", desc: "From your future" },
  { id: "comfort", label: "Comfort", emoji: "🤗", desc: "A warm hug in words" },
];

export default function LoveLetters() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (style) => {
    setSelectedStyle(style);
    setLetter("");
    setLoading(true);
    try {
      const { data } = await generateLetter(style);
      setLetter(data.letter.content);
    } catch {
      setLetter("My words got lost somewhere between my heart and this screen. Try again? 💕");
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
            <h1 className="font-romantic text-4xl md:text-5xl text-white text-glow mb-3">
              Love Letters
            </h1>
            <p className="text-white/40 font-light">
              Choose a style and I'll write you something from the heart
            </p>
          </motion.div>

          {/* Style picker */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {styles.map(({ id, label, emoji, desc }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleGenerate(id)}
                disabled={loading}
                className={`glass-card p-4 text-left transition-all duration-300 ${
                  selectedStyle === id
                    ? "border-rose-500/40 bg-rose-500/10"
                    : "hover:bg-white/[0.04]"
                } disabled:opacity-50`}
              >
                <span className="text-2xl mb-2 block">{emoji}</span>
                <h3 className="text-white font-medium text-sm">{label}</h3>
                <p className="text-white/40 text-xs">{desc}</p>
              </motion.button>
            ))}
          </div>

          {/* Letter display */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-card p-8 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-4xl mb-4"
                >
                  ✍️
                </motion.div>
                <p className="text-white/50 font-romantic text-lg">
                  Writing with all my heart...
                </p>
              </motion.div>
            )}

            {!loading && letter && (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 md:p-10"
              >
                <div className="text-center mb-6">
                  <FiHeart className="text-rose-500/40 mx-auto" size={24} />
                </div>
                <div className="font-romantic text-lg md:text-xl text-white/80 leading-relaxed">
                  <TypingText text={letter} speed={20} />
                </div>
                <div className="flex justify-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenerate(selectedStyle)}
                    className="flex items-center gap-2 text-rose-400/60 hover:text-rose-400 transition-all text-sm"
                  >
                    <FiRefreshCw size={14} />
                    Write another one
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
