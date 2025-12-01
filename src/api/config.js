// src/api/config.js

export const API_BASE_URL = "http://localhost:8000"; // FastAPI backend URL

export const getAuthHeaders = () => {
  const token = sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
