import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import FloatingHearts from "../components/FloatingHearts";

export default function Forever() {
  const { config } = useAuth();
  const [answered, setAnswered] = useState(false);
  const noBtnRef = useRef(null);

  const handleYes = () => {
    setAnswered(true);

    // Massive confetti explosion
    const defaults = { startVelocity: 30, spread: 360, ticks: 100, zIndex: 100 };
    const fire = (opts) =>
      confetti({ ...defaults, ...opts, colors: ["#f43f5e", "#ec4899", "#f472b6", "#fda4af", "#fff1f2"] });

    fire({ particleCount: 100, origin: { y: 0.6 } });
    setTimeout(() => fire({ particleCount: 60, origin: { x: 0.2, y: 0.5 } }), 250);
    setTimeout(() => fire({ particleCount: 60, origin: { x: 0.8, y: 0.5 } }), 500);
    setTimeout(() => fire({ particleCount: 80, origin: { y: 0.7 } }), 750);
  };

  const handleNoHover = useCallback(() => {
    if (!noBtnRef.current) return;
    const btn = noBtnRef.current;
    const maxX = window.innerWidth - btn.offsetWidth - 20;
    const maxY = window.innerHeight - btn.offsetHeight - 20;
    const x = Math.max(20, Math.random() * maxX);
    const y = Math.max(20, Math.random() * maxY);
    btn.style.position = "fixed";
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
    btn.style.transition = "all 0.3s ease";
  }, []);

  return (
    <>
      <Navbar />
      <FloatingHearts />
      <PageWrapper className="flex items-center justify-center">
        <div className="max-w-xl mx-auto text-center">
          {!answered ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-7xl md:text-8xl mb-8"
              >
                💍
              </motion.div>

              <h1 className="font-romantic text-4xl md:text-6xl text-white text-glow mb-4">
                {config?.herName || "My Love"}
              </h1>

              <p className="font-romantic text-2xl md:text-3xl text-rose-300/80 mb-12">
                Will You Be My Forever?
              </p>

              <div className="flex items-center justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleYes}
                  className="bg-gradient-to-r from-rose-600 to-pink-600 text-white px-12 py-4 rounded-2xl font-romantic text-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 transition-all"
                >
                  Yes! 💕
                </motion.button>

                <button
                  ref={noBtnRef}
                  onMouseEnter={handleNoHover}
                  onTouchStart={handleNoHover}
                  className="bg-white/5 text-white/40 px-8 py-4 rounded-2xl text-sm border border-white/10 z-50"
                >
                  No
                </button>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-white/20 text-xs mt-8"
              >
                (hint: there's only one right answer)
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, type: "spring" }}
              className="space-y-8"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl"
              >
                💕
              </motion.div>

              <h1 className="font-romantic text-5xl md:text-7xl text-white text-glow">
                I Knew You'd Say Yes
              </h1>

              <div className="glass-card p-8 md:p-10 max-w-lg mx-auto">
                <p className="font-romantic text-xl text-rose-200/80 leading-relaxed">
                  From the moment I met you, I knew my life was about to
                  change. You didn't just walk into my life — you became it.
                </p>
                <p className="font-romantic text-xl text-rose-200/80 leading-relaxed mt-4">
                  Every day with you is my favorite day. Every moment, a memory I'll cherish
                  until my last breath. You are my forever, my always, my everything.
                </p>
                <p className="font-romantic text-xl text-rose-200/80 leading-relaxed mt-4">
                  I love you. Today. Tomorrow. In every version of our story.
                </p>
                <p className="font-handwriting text-2xl text-rose-400 mt-6">
                  — {config?.myName || "Yours"}, forever 💕
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
