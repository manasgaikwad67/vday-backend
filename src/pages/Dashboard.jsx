import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiLink,
  FiCopy,
  FiCheck,
  FiGrid,
  FiImage,
  FiMessageCircle,
  FiMail,
  FiLock,
  FiSettings,
  FiLogOut,
  FiExternalLink,
  FiTrash2,
  FiPlus,
} from "react-icons/fi";
import {
  getCreatorProfile,
  updateCreatorProfile,
  getAdminDashboard,
  getAdminChats,
  getAdminLetters,
  getAdminSecret,
  getMemories,
  createMemory,
  deleteMemory,
  deleteLetter,
  updateSecret,
  getImageUrl,
} from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    creatorName: "",
    partnerName: "",
    partnerPassword: "",
    relationshipStartDate: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("creatorToken");
    if (!token) {
      navigate("/login");
      return;
    }

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadTabData();
    }
  }, [user, tab]);

  const loadProfile = async () => {
    try {
      const { data } = await getCreatorProfile();
      setUser(data.user);
      setSettingsForm({
        creatorName: data.user.creatorName || "",
        partnerName: data.user.partnerName || "",
        partnerPassword: data.user.partnerPassword || "",
        relationshipStartDate: data.user.relationshipStartDate?.split("T")[0] || "",
      });
      setLoading(false);
    } catch {
      localStorage.removeItem("creatorToken");
      navigate("/login");
    }
  };

  const loadTabData = async () => {
    try {
      if (tab === "overview") {
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
          setSecretQuestions(data.secret.questions || []);
          setSecretMessage(data.secret.secretMessage || "");
          setSecretVideoUrl(data.secret.videoUrl || "");
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/love/${user.slug}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem("creatorToken");
    localStorage.removeItem("creatorUser");
    navigate("/");
  };

  const handleAddMemory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", memTitle);
    formData.append("caption", memCaption);
    formData.append("date", memDate);
    formData.append("image", memImage);

    try {
      await createMemory(formData);
      setMemTitle("");
      setMemCaption("");
      setMemDate("");
      setMemImage(null);
      loadTabData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add memory");
    }
  };

  const handleDeleteMemory = async (id) => {
    if (!confirm("Delete this memory?")) return;
    try {
      await deleteMemory(id);
      loadTabData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleDeleteLetter = async (id) => {
    if (!confirm("Delete this letter?")) return;
    try {
      await deleteLetter(id);
      loadTabData();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const handleUpdateSecret = async (e) => {
    e.preventDefault();
    try {
      await updateSecret({
        questions: secretQuestions,
        secretMessage,
        videoUrl: secretVideoUrl,
      });
      alert("Secret game updated!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    try {
      const { data } = await updateCreatorProfile(settingsForm);
      setUser(data.user);
      alert("Settings saved!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FiGrid },
    { id: "memories", label: "Memories", icon: FiImage },
    { id: "chats", label: "Chats", icon: FiMessageCircle },
    { id: "letters", label: "Letters", icon: FiMail },
    { id: "secret", label: "Secret Game", icon: FiLock },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-900 via-red-900 to-purple-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white">
            Forever <span className="text-pink-400">Yours</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white"
            >
              {copied ? <FiCheck /> : <FiCopy />}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
            </button>
            <a
              href={`/love/${user?.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 rounded-lg hover:bg-pink-600 transition-colors text-white"
            >
              <FiExternalLink />
              <span className="hidden sm:inline">Preview</span>
            </a>
            <button
              onClick={handleLogout}
              className="p-2 text-white/70 hover:text-white transition-colors"
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Share Link Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-pink-500/30"
        >
          <h2 className="text-white font-semibold mb-2">Share this link with {user?.partnerName}:</h2>
          <div className="flex items-center gap-3 flex-wrap">
            <code className="bg-black/30 px-4 py-2 rounded-lg text-pink-300 flex-1 min-w-0 truncate">
              {window.location.origin}/love/{user?.slug}
            </code>
            <button
              onClick={copyLink}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
          <p className="text-pink-200 text-sm mt-2">
            Password: <span className="font-mono bg-black/20 px-2 py-1 rounded">{user?.partnerPassword}</span>
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                tab === id
                  ? "bg-pink-500 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              <Icon className="text-lg" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
          {tab === "overview" && dashboard && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Visits" value={dashboard.visitorCount} />
              <StatCard label="Chats" value={dashboard.totalChats} />
              <StatCard label="Letters" value={dashboard.totalLetters} />
              <StatCard label="Memories" value={dashboard.totalMemories} />
            </div>
          )}

          {tab === "memories" && (
            <div>
              <form onSubmit={handleAddMemory} className="mb-8 p-4 bg-white/5 rounded-xl">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FiPlus /> Add Memory
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    type="text"
                    value={memTitle}
                    onChange={(e) => setMemTitle(e.target.value)}
                    placeholder="Title"
                    required
                    className="px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50"
                  />
                  <input
                    type="date"
                    value={memDate}
                    onChange={(e) => setMemDate(e.target.value)}
                    required
                    className="px-4 py-2 bg-white/10 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={memCaption}
                    onChange={(e) => setMemCaption(e.target.value)}
                    placeholder="Caption"
                    required
                    className="px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50 md:col-span-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setMemImage(e.target.files[0])}
                    required
                    className="px-4 py-2 bg-white/10 rounded-lg text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600"
                  >
                    Add Memory
                  </button>
                </div>
              </form>

              <div className="grid gap-4 md:grid-cols-3">
                {memories.map((m) => (
                  <div key={m._id} className="relative group">
                    <img
                      src={getImageUrl(m.imageUrl)}
                      alt={m.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => handleDeleteMemory(m._id)}
                        className="p-2 bg-red-500 rounded-full text-white"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <p className="text-white mt-2 font-medium">{m.title}</p>
                    <p className="text-white/70 text-sm">{m.caption}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "chats" && (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {chats.length === 0 ? (
                <p className="text-white/50">No chat conversations yet</p>
              ) : (
                chats.map((chat) => (
                  <div key={chat._id} className="p-4 bg-white/5 rounded-lg">
                    <p className="text-pink-300 text-sm mb-2">
                      Session: {chat.sessionId} • {chat.messages?.length || 0} messages
                    </p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {chat.messages?.slice(-5).map((msg, i) => (
                        <p key={i} className={`text-sm ${msg.role === "user" ? "text-white" : "text-pink-200"}`}>
                          <span className="font-semibold">{msg.role === "user" ? "Her" : "You (AI)"}:</span> {msg.content.slice(0, 100)}...
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "letters" && (
            <div className="space-y-4">
              {letters.length === 0 ? (
                <p className="text-white/50">No letters generated yet</p>
              ) : (
                letters.map((letter) => (
                  <div key={letter._id} className="p-4 bg-white/5 rounded-lg relative group">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-pink-300 text-sm capitalize">{letter.style}</span>
                      <button
                        onClick={() => handleDeleteLetter(letter._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <p className="text-white/80 text-sm line-clamp-3">{letter.content}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "secret" && (
            <form onSubmit={handleUpdateSecret} className="space-y-6">
              <div>
                <h3 className="text-white font-semibold mb-4">Secret Questions</h3>
                <p className="text-white/60 text-sm mb-4">
                  Your partner needs to answer these correctly to unlock the secret message
                </p>
                {secretQuestions.map((q, i) => (
                  <div key={i} className="grid gap-2 md:grid-cols-2 mb-4">
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const updated = [...secretQuestions];
                        updated[i].question = e.target.value;
                        setSecretQuestions(updated);
                      }}
                      placeholder={`Question ${i + 1}`}
                      className="px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50"
                    />
                    <input
                      type="text"
                      value={q.answer}
                      onChange={(e) => {
                        const updated = [...secretQuestions];
                        updated[i].answer = e.target.value;
                        setSecretQuestions(updated);
                      }}
                      placeholder="Answer"
                      className="px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Secret Message</label>
                <textarea
                  value={secretMessage}
                  onChange={(e) => setSecretMessage(e.target.value)}
                  rows={4}
                  placeholder="The message revealed when they answer correctly..."
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Video URL (optional)</label>
                <input
                  type="url"
                  value={secretVideoUrl}
                  onChange={(e) => setSecretVideoUrl(e.target.value)}
                  placeholder="YouTube or direct video link"
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white placeholder-white/50"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600"
              >
                Save Secret Game
              </button>
            </form>
          )}

          {tab === "settings" && (
            <form onSubmit={handleUpdateSettings} className="space-y-6 max-w-lg">
              <div>
                <label className="text-white font-semibold mb-2 block">Your Name</label>
                <input
                  type="text"
                  value={settingsForm.creatorName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, creatorName: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Partner's Name</label>
                <input
                  type="text"
                  value={settingsForm.partnerName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, partnerName: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Partner's Entry Password</label>
                <input
                  type="text"
                  value={settingsForm.partnerPassword}
                  onChange={(e) => setSettingsForm({ ...settingsForm, partnerPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-white font-semibold mb-2 block">Relationship Start Date</label>
                <input
                  type="date"
                  value={settingsForm.relationshipStartDate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, relationshipStartDate: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 rounded-lg text-white"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2 bg-pink-500 rounded-lg text-white hover:bg-pink-600"
              >
                Save Settings
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 text-center">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-white/60">{label}</p>
    </div>
  );
}
