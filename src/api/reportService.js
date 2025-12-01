// src/api/reportService.js
import apiClient from "./apiClient";

export const reportService = {
  getAppointmentReport(filters = {}) {
    return apiClient.get(`/reports/appointments`, { params: filters });
  },

  getFinancialReport(filters = {}) {
    return apiClient.get(`/reports/financial`, { params: filters });
  },

  getInventoryReport(filters = {}) {
    return apiClient.get(`/reports/inventory`, { params: filters });
  },

  getPatientSummary() {
    return apiClient.get(`/reports/patients/summary`);
  },

  getDoctorPerformance() {
    return apiClient.get(`/reports/doctors/performance`);
  },
  getPatientStats(params = {}) {
    return apiClient.get("/reports/patients", { params });
  },

  // Revenue summary (e.g. GET /reports/revenue)
  getRevenueReport(params = {}) {
    return apiClient.get("/reports/revenue", { params });
  },

  downloadReport(type = "revenue", params = {}) {
    return apiClient.get(`/reports/export/${type}`, {
      params,
      responseType: "blob", // so you can download PDF
    });
  },
};
