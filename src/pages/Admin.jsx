import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  adminLogin,
  getAdminDashboard,
  getAdminChats,
  getAdminLetters,
  getAdminSecret,
  createMemory,
  getMemories,
  deleteMemory,
  deleteLetter,
  updateSecret,
  getImageUrl,
} from "../services/api";
import { FiLogIn, FiGrid, FiImage, FiMessageCircle, FiMail, FiLock, FiTrash2, FiPlus } from "react-icons/fi";

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState("dashboard");

  // Data
  const [dashboard, setDashboard] = useState(null);
  const [chats, setChats] = useState([]);
  const [letters, setLetters] = useState([]);
  const [memories, setMemories] = useState([]);
  const [secret, setSecret] = useState(null);

  // Memory form
  const [memTitle, setMemTitle] = useState("");
  const [memCaption, setMemCaption] = useState("");
  const [memDate, setMemDate] = useState("");
  const [memImage, setMemImage] = useState(null);

  // Secret form
  const [secretQuestions, setSecretQuestions] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [secretMessage, setSecretMessage] = useState("");
  const [secretVideoUrl, setSecretVideoUrl] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const { data } = await adminLogin(username, password);
      localStorage.setItem("adminToken", data.token);
      setToken(data.token);
      setLoggedIn(true);
    } catch (err) {
      setLoginError(err.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (!loggedIn) return;
    loadData();
  }, [loggedIn, tab]);

  const loadData = async () => {
    try {
      if (tab === "dashboard") {
        const { data } = await getAdminDashboard();
        setDashboard(data.dashboard);
      } else if (tab === "chats") {
        const { data } = await getAdminChats();
        setChats(data.chats);
      } else if (tab === "letters") {
        const { data } = await getAdminLetters();
        setLetters(data.letters);
      } else if (tab === "memories") {
        const { data } = await getMemories();
        setMemories(data.memories);
      } else if (tab === "secret") {
        const { data } = await getAdminSecret();
        if (data.secret) {
          setSecret(data.secret);
          setSecretQuestions(
            data.secret.questions.map((q) => ({ question: q.question, answer: q.answer }))
          );
          setSecretMessage(data.secret.secretMessage || "");
          setSecretVideoUrl(data.secret.videoUrl || "");
        }
      }
    } catch {}
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!memImage || !memTitle || !memDate) return;
    const formData = new FormData();
    formData.append("title", memTitle);
    formData.append("caption", memCaption);
    formData.append("date", memDate);
    formData.append("image", memImage);
    try {
      await createMemory(formData);
      setMemTitle(""); setMemCaption(""); setMemDate(""); setMemImage(null);
      loadData();
    } catch {}
  };

  const handleDeleteMemory = async (id) => {
    if (!confirm("Delete this memory?")) return;
    try { await deleteMemory(id); loadData(); } catch {}
  };

  const handleDeleteLetter = async (id) => {
    if (!confirm("Delete this letter?")) return;
    try { await deleteLetter(id); loadData(); } catch {}
  };

  const handleUpdateSecret = async () => {
    try {
      await updateSecret({
        questions: secretQuestions,
        secretMessage,
        videoUrl: secretVideoUrl,
      });
      alert("Secret updated!");
    } catch {}
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: FiGrid },
    { id: "memories", label: "Memories", icon: FiImage },
    { id: "chats", label: "Chats", icon: FiMessageCircle },
    { id: "letters", label: "Letters", icon: FiMail },
    { id: "secret", label: "Secret", icon: FiLock },
  ];

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-romantic flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 max-w-sm w-full"
        >
          <h1 className="font-romantic text-3xl text-white text-center mb-6">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30"
            />
            {loginError && <p className="text-rose-400 text-sm">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-500 transition-all"
            >
              <FiLogIn /> Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-romantic">
      {/* Tab bar */}
      <div className="glass sticky top-0 z-50 flex items-center gap-1 p-2 overflow-x-auto">
        <span className="font-handwriting text-lg text-rose-400 px-3 hidden md:block">Admin</span>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              tab === id ? "bg-rose-500/20 text-rose-300" : "text-white/50 hover:text-white/80"
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
        <button
          onClick={() => { localStorage.removeItem("adminToken"); setLoggedIn(false); }}
          className="ml-auto text-white/30 hover:text-white/60 text-sm px-3"
        >
          Logout
        </button>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto">
        {/* Dashboard */}
        {tab === "dashboard" && dashboard && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Visitors", value: dashboard.visitorCount, emoji: "👀" },
              { label: "Memories", value: dashboard.totalMemories, emoji: "📸" },
              { label: "Chat Sessions", value: dashboard.totalChats, emoji: "💬" },
              { label: "Letters", value: dashboard.totalLetters, emoji: "✉️" },
              { label: "Daily Messages", value: dashboard.totalDailyMessages, emoji: "📅" },
            ].map(({ label, value, emoji }) => (
              <div key={label} className="glass-card p-6 text-center">
                <p className="text-3xl mb-2">{emoji}</p>
                <p className="text-2xl font-romantic text-white">{value}</p>
                <p className="text-white/40 text-sm">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Memories */}
        {tab === "memories" && (
          <div>
            <h2 className="font-romantic text-2xl text-white mb-6">Manage Memories</h2>

            <form onSubmit={handleAddMemory} className="glass-card p-6 mb-8 space-y-4">
              <h3 className="text-white/80 font-medium flex items-center gap-2">
                <FiPlus /> Add Memory
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={memTitle} onChange={(e) => setMemTitle(e.target.value)} placeholder="Title" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30" required />
                <input type="date" value={memDate} onChange={(e) => setMemDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/30" required />
              </div>
              <textarea value={memCaption} onChange={(e) => setMemCaption(e.target.value)} placeholder="Caption" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30 resize-none h-20" required />
              <input type="file" accept="image/*" onChange={(e) => setMemImage(e.target.files[0])} className="text-white/50 text-sm" required />
              <button type="submit" className="bg-rose-600 text-white px-6 py-2 rounded-xl hover:bg-rose-500 transition-all">Upload Memory</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memories.map((m) => (
                <div key={m._id} className="glass-card p-4 flex gap-4">
                  <img src={getImageUrl(m.imageUrl)} alt={m.title} className="w-24 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-sm">{m.title}</h3>
                    <p className="text-white/40 text-xs">{m.caption}</p>
                    <p className="text-white/30 text-xs mt-1">{new Date(m.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => handleDeleteMemory(m._id)} className="text-rose-400/50 hover:text-rose-400 self-start">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chats */}
        {tab === "chats" && (
          <div>
            <h2 className="font-romantic text-2xl text-white mb-6">Chat Logs</h2>
            {chats.length === 0 ? (
              <p className="text-white/40">No chats yet</p>
            ) : (
              chats.map((chat) => (
                <div key={chat._id} className="glass-card p-6 mb-4">
                  <p className="text-white/40 text-xs mb-3">Session: {chat.sessionId}</p>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {chat.messages.map((msg, i) => (
                      <div key={i} className={`text-sm ${msg.role === "user" ? "text-rose-300" : "text-white/60"}`}>
                        <span className="font-medium">{msg.role === "user" ? "Her" : "You (AI)"}:</span>{" "}
                        {msg.content}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Letters */}
        {tab === "letters" && (
          <div>
            <h2 className="font-romantic text-2xl text-white mb-6">Generated Letters</h2>
            {letters.map((letter) => (
              <div key={letter._id} className="glass-card p-6 mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-rose-400 text-xs uppercase tracking-wider">{letter.style}</span>
                  <button onClick={() => handleDeleteLetter(letter._id)} className="text-rose-400/50 hover:text-rose-400">
                    <FiTrash2 size={14} />
                  </button>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{letter.content}</p>
                <p className="text-white/20 text-xs mt-2">{new Date(letter.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        {/* Secret */}
        {tab === "secret" && (
          <div>
            <h2 className="font-romantic text-2xl text-white mb-6">Secret Game Settings</h2>
            <div className="glass-card p-6 space-y-6">
              {secretQuestions.map((q, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-white/60 text-sm">Question {i + 1}</label>
                  <input
                    type="text"
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...secretQuestions];
                      updated[i].question = e.target.value;
                      setSecretQuestions(updated);
                    }}
                    placeholder="Question"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30"
                  />
                  <input
                    type="text"
                    value={q.answer}
                    onChange={(e) => {
                      const updated = [...secretQuestions];
                      updated[i].answer = e.target.value;
                      setSecretQuestions(updated);
                    }}
                    placeholder="Answer (case-insensitive)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30"
                  />
                </div>
              ))}

              <div>
                <label className="text-white/60 text-sm block mb-2">Secret Message (when unlocked)</label>
                <textarea
                  value={secretMessage}
                  onChange={(e) => setSecretMessage(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30 resize-none h-28"
                />
              </div>

              <div>
                <label className="text-white/60 text-sm block mb-2">Video URL (optional)</label>
                <input
                  type="text"
                  value={secretVideoUrl}
                  onChange={(e) => setSecretVideoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-rose-500/30"
                />
              </div>

              <button
                onClick={handleUpdateSecret}
                className="bg-rose-600 text-white px-8 py-3 rounded-xl hover:bg-rose-500 transition-all"
              >
                Save Secret
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
