import { useEffect, useState } from "react";

const HEART_CHARS = ["♥", "❤", "💕", "💗", "💖"];

function Heart({ id, onDone }) {
  const [style] = useState(() => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${4 + Math.random() * 6}s`,
    animationDelay: `${Math.random() * 3}s`,
    fontSize: `${12 + Math.random() * 18}px`,
    opacity: 0.15 + Math.random() * 0.25,
  }));

  useEffect(() => {
    const timer = setTimeout(onDone, 12000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <span
      className="fixed pointer-events-none select-none text-rose-400"
      style={{
        ...style,
        bottom: "-30px",
        animation: `floatUp ${style.animationDuration} ease-in ${style.animationDelay} forwards`,
      }}
    >
      {HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)]}
    </span>
  );
}

export default function FloatingHearts() {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      setHearts((prev) => [...prev, { id: id++ }]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const removeHeart = (heartId) => {
    setHearts((prev) => prev.filter((h) => h.id !== heartId));
  };

  return (
    <>
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: var(--start-opacity, 0.2);
          }
          50% {
            transform: translateY(-50vh) rotate(180deg) scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-105vh) rotate(360deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {hearts.map((h) => (
          <Heart key={h.id} id={h.id} onDone={() => removeHeart(h.id)} />
        ))}
      </div>
    </>
  );
}
