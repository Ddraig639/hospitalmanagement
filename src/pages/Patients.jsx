// src/pages/Patients.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Eye, Edit, Trash2, X, Search, Filter } from "lucide-react";
import { patientService } from "../api/patientService";
import MedicalRecordsTab from "../pages/records";

const Patients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // "add" | "view" | "edit"

  // Fetch all patients on mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await patientService.getAll();
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleAddPatient = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const newPatient = {
      name: form.get("name"),
      age: Number(form.get("age")),
      gender: form.get("gender"),
      contact: form.get("contact"),
      email: form.get("email"),
      blood_type: form.get("bloodGroup"),
      address: form.get("address"),
      medical_history: form.get("medicalHistory"),
    };

    try {
      const created = await patientService.create(newPatient);
      setPatients((prev) => [...prev, created]);
      setShowModal(false);
    } catch (err) {
      console.error("Error adding patient:", err);
      alert("Failed to add patient");
    }
  };

  // ---------------------- UPDATE PATIENT ----------------------
  const handleUpdatePatient = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const updatedPatient = {
      name: form.get("name"),
      age: Number(form.get("age")),
      gender: form.get("gender"),
      contact: form.get("contact"),
      email: form.get("email"),
      blood_type: form.get("bloodGroup"),
      address: form.get("address"),
      medical_history: form.get("medicalHistory"),
    };
    console.log(updatedPatient);
    try {
      const updated = await patientService.update(
        selectedPatient.id,
        updatedPatient
      );
      setPatients((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setShowModal(false);
    } catch (err) {
      console.error("Error updating patient:", err);
      alert("Failed to update patient");
    }
  };

  // ---------------------- DELETE PATIENT ----------------------
  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?"))
      return;
    try {
      await patientService.delete(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient");
    }
  };

  // ---------------------- VIEW / EDIT MODALS ----------------------
  const openViewModal = (patient) => {
    setSelectedPatient(patient);
    setModalMode("view");
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setSelectedPatient(patient);
    setModalMode("edit");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPatient(null);
  };

  const PatientModal = ({ mode, patient, onClose }) => {
    const isView = mode === "view";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdd && "Add New Patient"}
              {isView && "Patient Details"}
              {isEdit && "Edit Patient"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* VIEW MODE */}
          {isView && patient && (
            <div className="p-6 space-y-3">
              <p>
                <strong>Name:</strong> {patient.name}
              </p>
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender}
              </p>
              <p>
                <strong>Contact:</strong> {patient.contact}
              </p>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
              <p>
                <strong>Blood Group:</strong> {patient.blood_type}
              </p>
              <p>
                <strong>Address:</strong> {patient.address}
              </p>
              <p>
                <MedicalRecordsTab
                  patientId={patient.id}
                  currentUserRole={user.role}
                  currentUserId={user.id}
                />{" "}
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="bg-gray-200 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {(isAdd || isEdit) && (
            <form
              onSubmit={isAdd ? handleAddPatient : handleUpdatePatient}
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="name"
                  defaultValue={patient?.name || ""}
                  placeholder="Full Name"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="age"
                  type="number"
                  defaultValue={patient?.age || ""}
                  placeholder="Age"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  name="gender"
                  defaultValue={patient?.gender || ""}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <input
                  name="contact"
                  defaultValue={patient?.contact || ""}
                  placeholder="Contact Number"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="email"
                  type="email"
                  defaultValue={patient?.email || ""}
                  placeholder="Email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  name="bloodGroup"
                  defaultValue={patient?.blood_type || ""}
                  placeholder="Blood Group"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <textarea
                name="address"
                defaultValue={patient?.address || ""}
                placeholder="Address"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                name="medicalHistory"
                defaultValue={patient?.medical_history || ""}
                placeholder="Medical History"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  {isAdd ? "Add Patient" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  // ---------------------- MAIN RENDER ----------------------
  if (loading) return <p className="text-gray-500">Loading patients...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
        {user?.role !== "Patient" && (
          <button
            onClick={() => {
              setModalMode("add");
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus size={20} /> Add Patient
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2">
            <Filter size={20} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Age</th>
                <th className="text-left py-3 px-4">Gender</th>
                <th className="text-left py-3 px-4">Contact</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients
                .filter((p) =>
                  p.name?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{p.name}</td>
                    <td className="py-3 px-4">{p.age}</td>
                    <td className="py-3 px-4">{p.gender}</td>
                    <td className="py-3 px-4">{p.contact}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          p.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.status || "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-800"
                          onClick={() => openViewModal(p)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => openEditModal(p)}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeletePatient(p.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <PatientModal
          mode={modalMode}
          patient={selectedPatient}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Patients;
