import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { MusicProvider } from "./context/MusicContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PartnerEntry from "./pages/PartnerEntry";
import EntryGate from "./pages/EntryGate";
import Home from "./pages/Home";
import Timeline from "./pages/Timeline";
import LoveLetters from "./pages/LoveLetters";
import Chatbot from "./pages/Chatbot";
import Mood from "./pages/Mood";
import Future from "./pages/Future";
import SecretGame from "./pages/SecretGame";
import Forever from "./pages/Forever";

function ProtectedPage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MusicProvider>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/create" element={<CreateAccount />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Partner entry via unique slug */}
              <Route path="/love/:slug" element={<PartnerEntry />} />
              
              {/* Legacy entry (for backward compatibility) */}
              <Route path="/entry" element={<EntryGate />} />
              
              {/* Protected pages (for partner after entry) */}
              <Route path="/home" element={<ProtectedPage><Home /></ProtectedPage>} />
              <Route path="/timeline" element={<ProtectedPage><Timeline /></ProtectedPage>} />
              <Route path="/letters" element={<ProtectedPage><LoveLetters /></ProtectedPage>} />
              <Route path="/chat" element={<ProtectedPage><Chatbot /></ProtectedPage>} />
              <Route path="/mood" element={<ProtectedPage><Mood /></ProtectedPage>} />
              <Route path="/future" element={<ProtectedPage><Future /></ProtectedPage>} />
              <Route path="/secret" element={<ProtectedPage><SecretGame /></ProtectedPage>} />
              <Route path="/forever" element={<ProtectedPage><Forever /></ProtectedPage>} />
            </Routes>
          </AnimatePresence>
        </MusicProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
