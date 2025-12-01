import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../hooks/useApi";
import { appointmentService } from "../api/appointmentService";
import { patientService } from "../api/patientService";
import { doctorService } from "../api/doctorService";
import { formatTime } from "../context/other";

import { Plus, X, Eye, Edit, Trash2 } from "lucide-react";

const Appointments = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' | 'edit'
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: "",
    appointment_date: "",
    appointment_time: "",
    notes: "",
  });

  // Fetch appointments
  const {
    data: appointments,
    loading,
    error,
    refetch,
  } = useApi(() => appointmentService.getAll(), []);

  // Fetch patients and doctors on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, doctorsRes] = await Promise.all([
          patientService.getAll(),
          doctorService.getAll(),
        ]);
        setPatients(patientsRes);
        setDoctors(doctorsRes);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // Handle change for form inputs
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Create new appointment
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      console.log("Creating appointment with data:", formData);
      await appointmentService.create(formData);
      alert("Appointment created successfully!");
      refetch();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment.");
    }
  };

  // View appointment
  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setModalType("view");
  };

  // Edit appointment
  const handleEdit = (apt) => {
    setSelectedAppointment(apt);
    setFormData({
      patient_id: apt.patient?.id || "",
      doctor_id: apt.doctor?.id || "",
      appointment_date: apt.appointment_date || "",
      appointment_time: apt.appointment_time || "",
      notes: apt.notes || "",
    });
    setModalType("edit");
  };

  // Update appointment
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.update(selectedAppointment.id, formData);
      alert("Appointment updated successfully!");
      refetch();
      setModalType(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment.");
    }
  };

  // Delete appointment (only for doctors)
  const handleDelete = async (id) => {
    if (user?.role !== "Doctor") {
      alert("Only doctors can delete appointments.");
      return;
    }
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await appointmentService.delete(id);
        alert("Appointment deleted.");
        refetch();
      } catch (err) {
        console.error(err);
        alert("Failed to delete appointment.");
      }
    }
  };

  const AppointmentModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Book New Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-4" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Patient
              </label>
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Doctor
              </label>
              <select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Select Doctor --</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {formatTime(d.available_from)} to{" "}
                    {formatTime(d.available_to)}
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Date
              </label>
              <input
                name="appointment_date"
                type="date"
                value={formData.appointment_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Appointment Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appointment Time
              </label>
              <input
                name="appointment_time"
                type="time"
                value={formData.appointment_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the reason for appointment..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // Filter logic
  const [filter, setFilter] = useState("all");
  const filteredAppointments =
    filter === "all"
      ? appointments || []
      : (appointments || []).filter(
          (apt) => apt.status?.toLowerCase() === filter
        );

  // View Modal
  const ViewModal = ({ apt, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            Appointment Details
          </h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        <div className="p-6 space-y-3 text-gray-700">
          <p>
            <strong>Patient:</strong> {apt.patient?.name}
          </p>
          <p>
            <strong>Doctor:</strong> {apt.doctor?.name}
          </p>
          <p>
            <strong>Date:</strong> {apt.appointment_date}
          </p>
          <p>
            <strong>Time:</strong> {apt.appointment_time}
          </p>
          <p>
            <strong>Reason:</strong> {apt.notes}
          </p>
          <p>
            <strong>Status:</strong> {apt.status}
          </p>
        </div>
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Edit Modal
  const EditModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Edit Appointment</h2>
          <button onClick={onClose}>
            <X size={22} className="text-gray-600 hover:text-gray-800" />
          </button>
        </div>
        <form onSubmit={handleUpdate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
            <input
              type="time"
              name="appointment_time"
              value={formData.appointment_time}
              onChange={handleChange}
              required
              className="px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
          <p className="text-gray-600 mt-1">Manage and schedule appointments</p>
        </div>
        {user?.role === "Doctor" && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} /> New Appointment
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {loading ? (
          <div className="text-gray-500 text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-red-600 text-center py-10">Error: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="py-4 px-4 text-left">ID</th>
                  <th className="py-4 px-4 text-left">Patient</th>
                  <th className="py-4 px-4 text-left">Doctor</th>
                  <th className="py-4 px-4 text-left">Date</th>
                  <th className="py-4 px-4 text-left">Time</th>
                  <th className="py-4 px-4 text-left">Reason</th>
                  <th className="py-4 px-4 text-left">Status</th>
                  <th className="py-4 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-4 px-4 text-gray-700">{apt.id}</td>
                    <td className="py-4 px-4 text-gray-700">
                      {apt.patient?.name}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {apt.doctor?.name}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {apt.appointment_date}
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {apt.appointment_time}
                    </td>
                    <td className="py-4 px-4 text-gray-700">{apt.notes}</td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(apt)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        >
                          <Eye size={18} />
                        </button>
                        {user?.role === "Doctor" && (
                          <>
                            <button
                              onClick={() => handleEdit(apt)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(apt.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && <AppointmentModal onClose={() => setShowModal(false)} />}

      {modalType === "view" && selectedAppointment && (
        <ViewModal
          apt={selectedAppointment}
          onClose={() => setModalType(null)}
        />
      )}
      {modalType === "edit" && selectedAppointment && (
        <EditModal onClose={() => setModalType(null)} />
      )}
    </div>
  );
};

export default Appointments;
