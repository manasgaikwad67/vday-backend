import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// Attach tokens to every request
api.interceptors.request.use((config) => {
  const entryToken = localStorage.getItem("entryToken");
  if (entryToken) {
    config.headers["x-entry-token"] = entryToken;
  }
  // Creator token (Dashboard) or Admin token (Admin panel)
  const creatorToken = localStorage.getItem("creatorToken");
  const adminToken = localStorage.getItem("adminToken");
  if (creatorToken) {
    config.headers["Authorization"] = `Bearer ${creatorToken}`;
  } else if (adminToken) {
    config.headers["Authorization"] = `Bearer ${adminToken}`;
  }
  return config;
});

// ── User/Creator Auth ────────────────────────────────────
export const registerCreator = (data) => api.post("/user/register", data);
export const loginCreator = (email, password) => api.post("/user/login", { email, password });
export const partnerEntry = (slug, password) => api.post("/user/partner-entry", { slug, password });
export const checkSlug = (slug) => api.get(`/user/check-slug/${slug}`);
export const getPageBySlug = (slug) => api.get(`/user/page/${slug}`);
export const getCreatorProfile = () => api.get("/user/profile");
export const updateCreatorProfile = (data) => api.put("/user/profile", data);

// ── Legacy Auth (for backward compatibility) ─────────────
export const verifyEntry = (password) => api.post("/auth/entry", { password });
export const adminLogin = (username, password) =>
  api.post("/auth/admin-login", { username, password });

// ── Chat ─────────────────────────────────────────────────
export const sendChatMessage = (message, sessionId = "default") =>
  api.post("/chat", { message, sessionId });
export const getChatHistory = (sessionId = "default") =>
  api.get(`/chat/history/${sessionId}`);
export const clearChat = (sessionId = "default") =>
  api.delete(`/chat/history/${sessionId}`);

// ── Letters ──────────────────────────────────────────────
export const generateLetter = (style) => api.post("/letter/generate", { style });
export const getLetters = () => api.get("/letter");
export const deleteLetter = (id) => api.delete(`/letter/${id}`);

// ── Memories ─────────────────────────────────────────────
export const getMemories = () => api.get("/memory");
export const createMemory = (formData) =>
  api.post("/memory", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateMemory = (id, formData) =>
  api.put(`/memory/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteMemory = (id) => api.delete(`/memory/${id}`);

// ── Mood ─────────────────────────────────────────────────
export const analyzeMood = (mood, details) => api.post("/mood", { mood, details });

// ── Future ───────────────────────────────────────────────
export const predictFuture = () => api.post("/future");

// ── Secret ───────────────────────────────────────────────
export const getSecretQuestions = () => api.get("/secret/questions");
export const verifySecretAnswers = (answers) =>
  api.post("/secret/verify", { answers });
export const updateSecret = (data) => api.put("/secret", data);

// ── Daily ────────────────────────────────────────────────
export const getDailyMessage = () => api.get("/daily/today");
export const getAllDailyMessages = () => api.get("/daily");

// ── Admin ────────────────────────────────────────────────
export const getAdminDashboard = () => api.get("/admin/dashboard");
export const getAdminChats = () => api.get("/admin/chats");
export const getAdminLetters = () => api.get("/admin/letters");
export const getAdminSecret = () => api.get("/admin/secret");
export const clearAdminChats = () => api.delete("/admin/chats");

// ── Backend URL for images ───────────────────────────────
export const getImageUrl = (path) => {
  const base = API_URL.replace("/api", "");
  return `${base}${path}`;
};

export default api;
