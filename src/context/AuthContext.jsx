import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axios"; // ✅ Import your centralized Axios instance

// Create the Auth Context
const AuthContext = createContext();

// Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session data on startup
  useEffect(() => {
    const savedToken = sessionStorage.getItem("token");
    const savedUser = sessionStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      // ✅ Inject saved token into axios header
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${savedToken}`;
    }

    setLoading(false);
  }, []);

  // ✅ Handle login
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    // Save session
    sessionStorage.setItem("token", authToken);
    sessionStorage.setItem("user", JSON.stringify(userData));

    // Automatically attach token to axios headers
    axiosInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${authToken}`;
  };

  // ✅ Handle logout
  const logout = () => {
    setUser(null);
    setToken(null);

    // Remove session data
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    // Remove token from axios headers
    delete axiosInstance.defaults.headers.common["Authorization"];
  };

  // ✅ Show loading screen during initialization
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for easy access
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
