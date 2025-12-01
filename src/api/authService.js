// src/api/authService.js
import apiClient from "./apiClient";

export const authService = {
  async login(email, password) {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const response = await apiClient.post("/auth/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("Login API Response:", response); // Debug log

    return response;
  },

  async register(data) {
    return await apiClient.post("/auth/register", data);
  },

  async getCurrentUser() {
    return await apiClient.get("/auth/me");
  },

  async logout() {
    return await apiClient.post("/auth/logout");
  },
};
