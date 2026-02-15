import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("entryToken");
    const savedConfig = localStorage.getItem("appConfig");
    if (token && savedConfig) {
      setIsAuthenticated(true);
      setConfig(JSON.parse(savedConfig));
    }
    setLoading(false);
  }, []);

  const login = (token, appConfig) => {
    localStorage.setItem("entryToken", token);
    localStorage.setItem("appConfig", JSON.stringify(appConfig));
    setIsAuthenticated(true);
    setConfig(appConfig);
  };

  const logout = () => {
    localStorage.removeItem("entryToken");
    localStorage.removeItem("appConfig");
    setIsAuthenticated(false);
    setConfig(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, config, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
