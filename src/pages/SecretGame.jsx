import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { getSecretQuestions, verifySecretAnswers } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import TypingText from "../components/TypingText";

export default function SecretGame() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getSecretQuestions()
      .then(({ data }) => {
        setQuestions(data.questions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formatted = questions.map((q) => ({
        questionId: q._id,
        answer: answers[q._id] || "",
      }));

      const { data } = await verifySecretAnswers(formatted);
      setResult(data);

      if (data.unlocked) {
        // Fire confetti! 🎉
        const duration = 4000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#f43f5e", "#ec4899", "#f472b6"],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#f43f5e", "#ec4899", "#f472b6"],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      }
    } catch {
      setResult({ unlocked: false, correct: 0, total: questions.length });
    } finally {
      setSubmitting(false);
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
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              🔐
            </motion.div>
            <h1 className="font-romantic text-4xl md:text-5xl text-white text-glow mb-3">
              Secret Unlock
            </h1>
            <p className="text-white/40 font-light">
              Answer these questions about us to unlock a special surprise
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-white/40 py-12">Loading questions...</div>
          ) : !result?.unlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {questions.map((q, i) => (
                <div key={q._id} className="glass-card p-6">
                  <p className="text-white/80 font-medium mb-3">
                    <span className="text-rose-400 mr-2">Q{i + 1}.</span>
                    {q.question}
                  </p>
                  <input
                    type="text"
                    value={answers[q._id] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [q._id]: e.target.value }))
                    }
                    placeholder="Your answer..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-rose-500/30 transition-all"
                  />
                </div>
              ))}

              {result && !result.unlocked && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-rose-400/80"
                >
                  {result.correct}/{result.total} correct — so close! Try again 💕
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 rounded-xl font-medium hover:from-rose-500 hover:to-pink-500 transition-all disabled:opacity-50"
              >
                {submitting ? "Checking..." : "Unlock the Secret 🔓"}
              </motion.button>
            </motion.div>
          ) : (
            /* Unlocked state */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
                className="text-7xl mb-6"
              >
                🎉
              </motion.div>

              <h2 className="font-romantic text-3xl text-white text-glow mb-8">
                You Unlocked It!
              </h2>

              <div className="glass-card p-8 md:p-10">
                <div className="font-romantic text-lg md:text-xl text-rose-200/80 leading-relaxed">
                  <TypingText text={result.secretMessage} speed={30} />
                </div>
              </div>

              {result.videoUrl && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="glass-card p-4 mt-8 overflow-hidden"
                >
                  <video
                    src={result.videoUrl}
                    controls
                    className="w-full rounded-lg"
                    playsInline
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
