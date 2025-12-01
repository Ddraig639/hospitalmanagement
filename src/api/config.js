// src/api/config.js

export const API_BASE_URL = "https://hospitalbackend-7u4y.onrender.com"; // FastAPI backend URL

export const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
