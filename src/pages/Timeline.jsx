import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getMemories, getImageUrl } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import Navbar from "../components/Navbar";

export default function Timeline() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemories()
      .then(({ data }) => setMemories(data.memories || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <PageWrapper>
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h1 className="font-romantic text-4xl md:text-5xl text-white text-glow mb-3">
              Our Memories
            </h1>
            <p className="text-white/40 font-light">
              Every moment with you is worth remembering
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center text-white/40 py-20">Loading memories...</div>
          ) : memories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📸</p>
              <p className="text-white/40">No memories yet — add some from the admin panel!</p>
            </div>
          ) : (
            <div className="relative">
              {/* Center line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-500/30 via-rose-500/10 to-transparent" />

              {memories.map((memory, i) => (
                <motion.div
                  key={memory._id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-rose-500 z-10 shadow-lg shadow-rose-500/50" />

                  {/* Card */}
                  <div className={`w-5/12 ${i % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <div className="glass-card overflow-hidden group">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={getImageUrl(memory.imageUrl)}
                          alt={memory.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-rose-400/60 text-xs mb-1">
                          {new Date(memory.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <h3 className="text-white font-medium mb-1">{memory.title}</h3>
                        <p className="text-white/50 text-sm">{memory.caption}</p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="w-2/12" />
                  <div className="w-5/12" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
