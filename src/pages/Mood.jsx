import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { analyzeMood } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import TypingText from "../components/TypingText";

const moods = [
  { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-500/20 to-amber-500/20" },
  { id: "sad", emoji: "😢", label: "Sad", color: "from-blue-500/20 to-indigo-500/20" },
  { id: "stressed", emoji: "😩", label: "Stressed", color: "from-orange-500/20 to-red-500/20" },
  { id: "angry", emoji: "😤", label: "Angry", color: "from-red-500/20 to-rose-500/20" },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "from-purple-500/20 to-violet-500/20" },
  { id: "lonely", emoji: "🥺", label: "Lonely", color: "from-slate-500/20 to-gray-500/20" },
  { id: "loved", emoji: "🥰", label: "Loved", color: "from-pink-500/20 to-rose-500/20" },
];

export default function Mood() {
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    setResponse("");
    setLoading(true);

    try {
      const { data } = await analyzeMood(selected, details);
      setResponse(data.response);
    } catch {
      setResponse("I'm here for you no matter what. Always. 💕");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-10"
          >
            <h1 className="font-romantic text-4xl md:text-5xl text-white text-glow mb-3">
              How Are You Feeling?
            </h1>
            <p className="text-white/40 font-light">
              Tell me, and I'll be exactly what you need right now
            </p>
          </motion.div>

          {/* Mood picker */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-3 mb-8">
            {moods.map(({ id, emoji, label }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(id)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  selected === id
                    ? "bg-rose-500/20 border border-rose-500/30"
                    : "glass hover:bg-white/[0.06]"
                }`}
              >
                <span className="text-2xl mb-1">{emoji}</span>
                <span className="text-xs text-white/60">{label}</span>
              </motion.button>
            ))}
          </div>

          {/* Details */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Want to tell me more? (optional)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-rose-500/30 transition-all resize-none h-24"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-3 w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-3 rounded-xl font-medium hover:from-rose-500 hover:to-pink-500 transition-all disabled:opacity-50"
                >
                  {loading ? "Thinking of the right words..." : "Tell Me What I Need to Hear"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Response */}
          <AnimatePresence>
            {response && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 text-center"
              >
                <p className="text-4xl mb-4">
                  {moods.find((m) => m.id === selected)?.emoji}
                </p>
                <div className="font-romantic text-lg text-white/80 leading-relaxed">
                  <TypingText text={response} speed={25} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageWrapper>
    </>
  );
}
