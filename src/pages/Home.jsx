import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLoveCounter } from "../hooks/useLoveCounter";
import { getDailyMessage } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import FloatingHearts from "../components/FloatingHearts";
import Navbar from "../components/Navbar";
import {
  FiMessageCircle, FiMail, FiClock, FiHeart,
  FiStar, FiLock,
} from "react-icons/fi";

const features = [
  { to: "/timeline", icon: FiClock, label: "Our Memories", desc: "A timeline of us" },
  { to: "/letters", icon: FiMail, label: "Love Letters", desc: "AI-written just for you" },
  { to: "/chat", icon: FiMessageCircle, label: "Talk to Me", desc: "I'm always here" },
  { to: "/mood", icon: FiHeart, label: "How Are You?", desc: "Tell me how you feel" },
  { to: "/future", icon: FiStar, label: "Our Future", desc: "See what's ahead" },
  { to: "/secret", icon: FiLock, label: "Secret Game", desc: "Unlock a surprise" },
];

export default function Home() {
  const { config } = useAuth();
  const counter = useLoveCounter(config?.relationshipStart);
  const [dailyMsg, setDailyMsg] = useState("");

  useEffect(() => {
    getDailyMessage()
      .then(({ data }) => setDailyMsg(data.message?.message || ""))
      .catch(() => {});
  }, []);

  const counterItems = [
    { value: counter.days, label: "Days" },
    { value: counter.hours, label: "Hours" },
    { value: counter.minutes, label: "Minutes" },
    { value: counter.seconds, label: "Seconds" },
  ];

  return (
    <>
      <Navbar />
      <FloatingHearts />
      <PageWrapper>
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-6xl mb-6"
            >
              💕
            </motion.div>
            <h1 className="font-romantic text-4xl md:text-6xl lg:text-7xl text-white mb-4 text-glow">
              Hey, {config?.herName || "My Love"}
            </h1>
            <p className="text-white/50 text-lg md:text-xl font-light max-w-lg mx-auto">
              Every pixel on this page exists because of how you make me feel.
              This is my love, coded into existence.
            </p>
          </motion.section>

          {/* Love Counter */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="glass-card p-8 mb-12 text-center"
          >
            <h2 className="font-handwriting text-2xl text-rose-400 mb-6">
              Falling in love for...
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {counterItems.map(({ value, label }) => (
                <div key={label}>
                  <motion.div
                    key={value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="font-romantic text-3xl md:text-5xl text-white text-glow-sm"
                  >
                    {value}
                  </motion.div>
                  <div className="text-white/40 text-xs md:text-sm mt-1 uppercase tracking-wider">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Daily Message */}
          {dailyMsg && (
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-6 md:p-8 mb-12 text-center"
            >
              <p className="text-white/30 text-xs uppercase tracking-widest mb-3">
                Today's Message For You
              </p>
              <p className="font-romantic text-lg md:text-xl text-rose-200/80 italic leading-relaxed">
                "{dailyMsg}"
              </p>
            </motion.section>
          )}

          {/* Feature Grid */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="font-romantic text-2xl text-center text-white/80 mb-8">
              Explore Our World
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {features.map(({ to, icon: Icon, label, desc }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <Link
                    to={to}
                    className="glass-card p-6 block text-center hover:bg-white/[0.06] transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-rose-500/20 transition-all">
                      <Icon className="text-rose-400" size={20} />
                    </div>
                    <h3 className="text-white/90 font-medium text-sm mb-1">{label}</h3>
                    <p className="text-white/40 text-xs">{desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Forever Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-16"
          >
            <Link
              to="/forever"
              className="inline-flex items-center gap-2 text-rose-400/60 hover:text-rose-400 transition-all font-romantic text-lg"
            >
              <FiHeart size={16} />
              Will you be my forever?
              <FiHeart size={16} />
            </Link>
          </motion.div>
        </div>
      </PageWrapper>
    </>
  );
}
