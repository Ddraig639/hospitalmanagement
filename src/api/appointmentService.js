// src/api/appointmentService.js
import apiClient from "./apiClient";

export const appointmentService = {
  getAll() {
    return apiClient.get("/appointments/");
  },

  getById(id) {
    return apiClient.get(`/appointments/${id}`);
  },

  create(data) {
    return apiClient.post("/appointments/", data);
  },

  update(id, data) {
    return apiClient.put(`/appointments/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/appointments/${id}`);
  },
  getDoctorAppointments(doctorId) {
    return apiClient.get(`/doctors/${doctorId}/appointments`);
  },
};
