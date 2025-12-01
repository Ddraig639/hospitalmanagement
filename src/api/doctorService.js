// src/api/doctorService.js
import apiClient from "./apiClient";

export const doctorService = {
  getAll() {
    return apiClient.get("/doctors/");
  },

  getById(id) {
    return apiClient.get(`/doctors/${id}`);
  },

  create(data) {
    return apiClient.post("/doctors/", data);
  },

  update(id, data) {
    return apiClient.put(`/doctors/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/doctors/${id}`);
  },
};
