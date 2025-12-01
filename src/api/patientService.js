// src/api/patientService.js
import apiClient from "./apiClient";

export const patientService = {
  // List all patients
  getAll() {
    return apiClient.get("/patients/");
  },

  // Get a single patient by ID
  getById(id) {
    return apiClient.get(`/patients/${id}`);
  },

  // Register new patient
  create(data) {
    return apiClient.post("/patients/", data);
  },

  // Update patient info
  update(id, data) {
    return apiClient.put(`/patients/${id}`, data);
  },

  // Delete patient (admin only)
  delete(id) {
    return apiClient.delete(`/patients/${id}`);
  },

  // Get appointments for a specific patient
  getAppointments(id) {
    return apiClient.get(`/patients/${id}/appointments`);
  },
};
