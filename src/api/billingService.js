// src/api/billingService.js
import apiClient from "./apiClient";

export const billingService = {
  // ====== BILLING ======
  getAll(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiClient.get(`/billing/${queryParams ? `?${queryParams}` : ""}`);
  },

  getById(id) {
    return apiClient.get(`/billing/${id}`);
  },

  create(data) {
    return apiClient.post("/billing/", data);
  },

  update(id, data) {
    return apiClient.put(`/billing/${id}`, data);
  },

  delete(id) {
    return apiClient.delete(`/billing/${id}`);
  },

  // Get detailed bill (appointment + insurance)
  getDetails(id) {
    return apiClient.get(`/billing/${id}/details`);
  },

  // Get all bills for a specific appointment
  getAppointmentBills(appointmentId) {
    return apiClient.get(`/billing/appointment/${appointmentId}`);
  },

  // ====== INSURANCE ======
  getInsuranceProviders() {
    return apiClient.get("/insurance/");
  },

  getInsuranceById(id) {
    return apiClient.get(`/insurance/${id}`);
  },

  createInsurance(data) {
    return apiClient.post("/insurance/", data);
  },

  getInsuranceBills(insuranceId) {
    return apiClient.get(`/insurance/${insuranceId}/bills`);
  },
};
