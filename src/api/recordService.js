// src/api/recordsService.js
import apiClient from "./apiClient";

export const recordsService = {
  // Get all medical records for a specific patient
  getByPatientId(patientId) {
    return apiClient.get(`/records/patient/${patientId}`);
  },

  // Get a single medical record by record ID
  getById(recordId) {
    return apiClient.get(`/records/${recordId}`);
  },

  // Create a new medical record (Doctor only)
  create(data) {
    return apiClient.post("/records/", {
      patient_id: data.patient_id,
      diagnosis: data.diagnosis,
      prescription: data.prescription, // Array of PrescriptionItem objects
      vital_signs: data.vital_signs, // VitalSigns object
      notes: data.notes,
    });
  },

  // Update an existing medical record (Doctor only - treating doctor)
  update(recordId, data) {
    return apiClient.put(`/records/${recordId}`, {
      diagnosis: data.diagnosis,
      prescription: data.prescription,
      vital_signs: data.vital_signs,
      notes: data.notes,
    });
  },

  // Delete a medical record (if needed - may not be exposed in production)
  delete(recordId) {
    return apiClient.delete(`/records/${recordId}`);
  },

  // Export record as PDF (when implemented)
  exportPDF(recordId) {
    return apiClient.get(`/records/${recordId}/pdf`, {
      responseType: "blob", // Important for file downloads
    });
  },
};

// Helper function to format prescription data for API
export const formatPrescriptionForAPI = (prescriptions) => {
  return prescriptions.map((p) => ({
    inventory_item_id: p.inventory_item_id,
    dosage: p.dosage,
    frequency: p.frequency,
    duration: p.duration,
  }));
};

// Helper function to format vital signs data for API
export const formatVitalSignsForAPI = (vitalSigns) => {
  return {
    blood_pressure: vitalSigns.blood_pressure || null,
    temperature: vitalSigns.temperature || null,
    pulse: vitalSigns.pulse || null,
  };
};
