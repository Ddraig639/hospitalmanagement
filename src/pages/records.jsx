import React, { useState, useEffect } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  X,
  FileText,
  Activity,
  Pill,
  Stethoscope,
  Calendar,
  User,
} from "lucide-react";
import {
  recordsService,
  formatPrescriptionForAPI,
  formatVitalSignsForAPI,
} from "../api/recordService";
import { getMedicationInventory } from "../api/inventoryService";

const MedicalRecordsTab = ({ patientId, currentUserRole, currentUserId }) => {
  const [records, setRecords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medicationInventory, setMedicationInventory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
    fetchMedicationInventory();
  }, [patientId]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await recordsService.getByPatientId(patientId);
      setRecords(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to load medical records");
      // If no records found (404), show empty state instead of error
      if (err.response?.status === 404) {
        setRecords([]);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicationInventory = async () => {
    try {
      const medications = await getMedicationInventory();
      setMedicationInventory(medications);
    } catch (err) {
      console.error("Error fetching medication inventory:", err);
    }
  };

  const openViewModal = (record) => {
    setSelectedRecord(record);
    setModalMode("view");
    setShowModal(true);
  };

  const openEditModal = (record) => {
    setSelectedRecord(record);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("Are you sure you want to delete this medical record?"))
      return;
    try {
      await recordsService.delete(recordId);
      setRecords((prev) => prev.filter((r) => r.record_id !== recordId));
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Failed to delete record");
    }
  };

  const isDoctor = currentUserRole === "Doctor";

  if (loading)
    return <div className="text-gray-500">Loading medical records...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText size={24} />
          Medical Records
        </h3>
        {isDoctor && (
          <button
            onClick={() => {
              setModalMode("add");
              setSelectedRecord(null);
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus size={18} /> New Record
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No medical records yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const vitalSigns = record.vital_signs || {};
            const prescriptions = record.prescription || [];

            return (
              <div
                key={record.record_id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-indigo-600">
                        {new Date(record.date_time).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        Record ID: {record.record_id}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium mb-1">
                      <strong>Diagnosis:</strong> {record.diagnosis}
                    </p>
                    <div className="text-sm text-gray-600">
                      {vitalSigns.blood_pressure && (
                        <span className="mr-4">
                          BP: {vitalSigns.blood_pressure}
                        </span>
                      )}
                      {vitalSigns.temperature && (
                        <span className="mr-4">
                          Temp: {vitalSigns.temperature}°C
                        </span>
                      )}
                      {vitalSigns.pulse && (
                        <span>Pulse: {vitalSigns.pulse} bpm</span>
                      )}
                    </div>
                    {prescriptions.length > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        {prescriptions.length} prescription(s)
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openViewModal(record)}
                      className="text-indigo-600 hover:text-indigo-800 p-1"
                      title="View details"
                    >
                      <Eye size={18} />
                    </button>
                    {isDoctor && (
                      <>
                        <button
                          onClick={() => openEditModal(record)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit record"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecord(record.record_id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete record"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <MedicalRecordModal
          mode={modalMode}
          record={selectedRecord}
          patientId={patientId}
          doctorId={currentUserId}
          medicationInventory={medicationInventory}
          onClose={() => setShowModal(false)}
          onSave={(newRecord) => {
            if (modalMode === "add") {
              setRecords((prev) => [newRecord, ...prev]);
            } else {
              setRecords((prev) =>
                prev.map((r) =>
                  r.record_id === newRecord.record_id ? newRecord : r
                )
              );
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

const MedicalRecordModal = ({
  mode,
  record,
  patientId,
  doctorId,
  medicationInventory,
  onClose,
  onSave,
}) => {
  const isView = mode === "view";
  const [diagnosis, setDiagnosis] = useState(record?.diagnosis || "");
  const [notes, setNotes] = useState(record?.notes || "");
  const [prescriptions, setPrescriptions] = useState(
    record?.prescription || []
  );
  const [vitalSigns, setVitalSigns] = useState(
    record?.vital_signs || { blood_pressure: "", temperature: "", pulse: "" }
  );
  const [selectedMedication, setSelectedMedication] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!diagnosis.trim()) {
      alert("Please enter a diagnosis");
      return;
    }

    setSaving(true);
    try {
      const recordData = {
        patient_id: patientId,
        diagnosis: diagnosis.trim(),
        prescription: formatPrescriptionForAPI(prescriptions),
        vital_signs: formatVitalSignsForAPI(vitalSigns),
        notes: notes.trim(),
      };
      console.log(recordData);

      let savedRecord;
      if (mode === "add") {
        savedRecord = await recordsService.create(recordData);
      } else {
        savedRecord = await recordsService.update(record.record_id, recordData);
      }

      onSave(savedRecord);
      alert(
        mode === "add"
          ? "Medical record created successfully!"
          : "Medical record updated successfully!"
      );
    } catch (err) {
      console.error("Error saving record:", err);
      alert(err.response?.data?.detail || "Failed to save medical record");
    } finally {
      setSaving(false);
    }
  };

  const addPrescription = () => {
    if (!selectedMedication) {
      alert("Please select a medication");
      return;
    }
    const medication = medicationInventory.find(
      (m) => m.item_name === selectedMedication
    );
    if (!medication) {
      alert("Medication not found in inventory");
      return;
    }

    setPrescriptions([
      ...prescriptions,
      {
        inventory_item_id: medication.id,
        medication: medication.item_name,
        dosage: "",
        frequency: "",
        duration: "",
      },
    ]);
    setSelectedMedication("");
  };

  const removePrescription = (index) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescription = (index, field, value) => {
    const updated = [...prescriptions];
    updated[index][field] = value;
    setPrescriptions(updated);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === "add" && "New Medical Record"}
            {mode === "view" && "Medical Record Details"}
            {mode === "edit" && "Edit Medical Record"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {isView && record ? (
          <div className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <Calendar size={16} />
                {new Date(record.date_time).toLocaleString()}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText size={16} />
                Record ID: {record.record_id}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Stethoscope size={18} />
                Diagnosis
              </h3>
              <p className="text-gray-700 bg-white p-3 rounded border">
                {record.diagnosis}
              </p>
            </div>

            {record.vital_signs &&
              Object.keys(record.vital_signs).some(
                (key) => record.vital_signs[key]
              ) && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Activity size={18} />
                    Vital Signs
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {record.vital_signs.blood_pressure && (
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-500">
                          Blood Pressure
                        </div>
                        <div className="text-lg font-semibold text-gray-800">
                          {record.vital_signs.blood_pressure}
                        </div>
                      </div>
                    )}
                    {record.vital_signs.temperature && (
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-500">Temperature</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {record.vital_signs.temperature}°C
                        </div>
                      </div>
                    )}
                    {record.vital_signs.pulse && (
                      <div className="bg-white p-3 rounded border">
                        <div className="text-sm text-gray-500">Pulse</div>
                        <div className="text-lg font-semibold text-gray-800">
                          {record.vital_signs.pulse} bpm
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {record.prescription && record.prescription.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Pill size={18} />
                  Prescriptions
                </h3>
                <div className="space-y-2">
                  {record.prescription.map((p, i) => (
                    <div key={i} className="bg-white p-3 rounded border">
                      <div className="font-medium text-gray-800">
                        {p.drug_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        Dosage: {p.dosage} | Frequency: {p.frequency} |
                        Duration: {p.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {record.notes && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                <p className="text-gray-700 bg-white p-3 rounded border">
                  {record.notes}
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Diagnosis *
              </label>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter diagnosis..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vital Signs
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-600">
                    Blood Pressure
                  </label>
                  <input
                    type="text"
                    value={vitalSigns.blood_pressure || ""}
                    onChange={(e) =>
                      setVitalSigns({
                        ...vitalSigns,
                        blood_pressure: e.target.value,
                      })
                    }
                    placeholder="120/80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">
                    Temperature (°C)
                  </label>
                  <input
                    type="text"
                    value={vitalSigns.temperature || ""}
                    onChange={(e) =>
                      setVitalSigns({
                        ...vitalSigns,
                        temperature: e.target.value,
                      })
                    }
                    placeholder="37.2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Pulse (bpm)</label>
                  <input
                    type="text"
                    value={vitalSigns.pulse || ""}
                    onChange={(e) =>
                      setVitalSigns({ ...vitalSigns, pulse: e.target.value })
                    }
                    placeholder="72"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prescriptions
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  value={selectedMedication}
                  onChange={(e) => setSelectedMedication(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select medication from inventory</option>
                  {medicationInventory.map((med) => (
                    <option key={med.id} value={med.item_name}>
                      {med.item_name} (Stock: {med.quantity})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addPrescription}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {prescriptions.map((p, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {p.medication}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={p.dosage}
                        onChange={(e) =>
                          updatePrescription(index, "dosage", e.target.value)
                        }
                        placeholder="Dosage (e.g., 500mg)"
                        className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={p.frequency}
                        onChange={(e) =>
                          updatePrescription(index, "frequency", e.target.value)
                        }
                        placeholder="Frequency (e.g., Twice daily)"
                        className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        type="text"
                        value={p.duration}
                        onChange={(e) =>
                          updatePrescription(index, "duration", e.target.value)
                        }
                        placeholder="Duration (e.g., 7 days)"
                        className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Additional notes or observations..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
              >
                {saving
                  ? "Saving..."
                  : mode === "add"
                  ? "Create Record"
                  : "Save Changes"}
              </button>
              <button
                onClick={onClose}
                disabled={saving}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordsTab;
