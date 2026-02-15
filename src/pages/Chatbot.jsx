import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { sendChatMessage, getChatHistory } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";
import { FiSend, FiTrash2 } from "react-icons/fi";
import { clearChat } from "../services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    getChatHistory()
      .then(({ data }) => setMessages(data.messages || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await sendChatMessage(userMsg);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "My thoughts got tangled... try again? 💕" },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleClear = async () => {
    if (!confirm("Clear our conversation?")) return;
    try {
      await clearChat();
      setMessages([]);
    } catch {}
  };

  return (
    <>
      <Navbar />
      <PageWrapper className="flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-romantic text-3xl md:text-4xl text-white text-glow mb-1">
              Talk to Me
            </h1>
            <p className="text-white/40 text-sm">I'm always here for you</p>
          </div>

          {/* Chat area */}
          <div className="glass-card flex-1 flex flex-col overflow-hidden" style={{ minHeight: "50vh" }}>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-white/30">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="font-romantic text-lg">Say something, I'm here...</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm md:text-base ${
                      msg.role === "user"
                        ? "bg-rose-600/30 text-white rounded-br-md"
                        : "bg-white/5 text-white/80 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-white/50 text-sm"
                    >
                      typing with love...
                    </motion.span>
                  </div>
                </motion.div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="p-4 border-t border-white/5 flex items-center gap-3"
            >
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-white/20 hover:text-rose-400 transition-colors p-2"
                  title="Clear chat"
                >
                  <FiTrash2 size={16} />
                </button>
              )}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your heart out..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-rose-500/30 transition-all"
                disabled={loading}
              />
              <motion.button
                type="submit"
                disabled={loading || !input.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 p-3 rounded-xl transition-all disabled:opacity-30"
              >
                <FiSend size={18} />
              </motion.button>
            </form>
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
