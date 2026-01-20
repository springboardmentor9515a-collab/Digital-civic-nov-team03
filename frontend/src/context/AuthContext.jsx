import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // Keeps your central API config

const AuthContext = createContext();

// Useful shortcut from Anuj's branch
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ---------------- RESTORE SESSION ---------------- */
  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // 1. Restore user immediately for speed
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // 2. Validate token with backend
      if (token) {
        try {
          const { data } = await API.get("/auth/me");
          setUser(data);
          // Update local storage with fresh data
          localStorage.setItem("user", JSON.stringify(data));
        } catch (err) {
          // If token is invalid/expired, clear everything
          console.error("Session expired:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
      setLoading(false);
    };

    restoreUser();
  }, []);

  /* ---------------- REGISTER ---------------- */
  const register = async (userData) => {
    try {
      const { data } = await API.post("/register", userData);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || data));
      
      setUser(data.user || data);
      navigate("/dashboard");
    } catch (error) {
      throw error; // Throw error so the UI can show an alert
    }
  };

  /* ---------------- LOGIN ---------------- */
  const login = async (credentials) => {
    try {
      const { data } = await API.post("/login", credentials);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || data));
      
      setUser(data.user || data);
      navigate("/dashboard");
    } catch (error) {
      throw error;
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
