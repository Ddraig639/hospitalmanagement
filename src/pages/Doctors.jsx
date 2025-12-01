import React, { useState, useEffect } from "react";
import { Plus, X, UserCheck, Trash2 } from "lucide-react";
import { doctorService } from "../api/doctorService";
import { formatTime } from "../context/other";

// 🔹 View Doctor Modal
const ViewDoctorModal = ({ doctor, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Doctor Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="p-6 space-y-3 text-gray-700">
        <p>
          <strong>Name:</strong> {doctor.name}
        </p>
        <p>
          <strong>Specialty:</strong> {doctor.specialty}
        </p>
        <p>
          <strong>Phone:</strong> {doctor.phone}
        </p>
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
        <p>
          <strong>Available:</strong> {formatTime(doctor.available_from)} -{" "}
          {formatTime(doctor.available_to)}
        </p>
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

// 🔹 Edit Doctor Modal
const EditDoctorModal = ({ onClose, doctor, onSave }) => {
  const [formData, setFormData] = useState({
    name: doctor.name,
    specialty: doctor.specialty,
    phone: doctor.phone,
    email: doctor.email,
    availableFrom: doctor.available?.split(" - ")[0] || "",
    availableTo: doctor.available?.split(" - ")[1] || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedDoctor = {
      name: formData.name,
      specialty: formData.specialty,
      phone: formData.phone,
      email: formData.email,
      available_to: formData.availableTo,
      available_from: formData.availableFrom,
    };
    onSave(updatedDoctor);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Edit Doctor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            type="text"
            placeholder="Specialty"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Phone Number"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="availableFrom"
            value={formData.availableFrom}
            onChange={handleChange}
            type="time"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="availableTo"
            value={formData.availableTo}
            onChange={handleChange}
            type="time"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <div className="col-span-2 flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Save Changes
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
      </div>
    </div>
  );
};

// 🔹 Modal for adding new doctor - MOVED OUTSIDE to prevent re-renders
const AddDoctorModal = ({ onClose, formData, handleChange, handleSubmit }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Add New Doctor</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            type="text"
            placeholder="Specialty"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            placeholder="Phone Number"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="availableFrom"
            value={formData.availableFrom}
            onChange={handleChange}
            type="time"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="availableTo"
            value={formData.availableTo}
            onChange={handleChange}
            type="time"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Add Doctor
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
    </div>
  </div>
);
const Doctors = () => {
  const [showModal, setShowModal] = useState(false);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [editDoctor, setEditDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    availableFrom: "",
    availableTo: "",
  });

  // 👇 Replace this with your actual user role logic
  const currentUserRole = localStorage.getItem("role") || "Admin"; // or "Doctor"

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await doctorService.getAll();
      setDoctors(res.data || res); // handle if axios returns .data
    } catch (err) {
      console.error("Failed to fetch doctors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await doctorService.delete(id);
      setDoctors((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error("Error deleting doctor:", err);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔹 Add a new doctor
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doctorService.create({
        name: formData.name,
        specialty: formData.specialty,
        phone: formData.phone,
        email: formData.email,
        available_from: formData.availableFrom,
        available_to: formData.availableTo,
      });
      await fetchDoctors(); // refresh list
      setShowModal(false);
      setFormData({
        name: "",
        specialty: "",
        phone: "",
        email: "",
        availableFrom: "",
        availableTo: "",
      });
    } catch (err) {
      console.error("Error adding doctor:", err);
    }
  };

  const handleEditSave = async (updatedDoctor) => {
    try {
      await doctorService.update(editDoctor.id, updatedDoctor);
      await fetchDoctors();
      setEditDoctor(null);
    } catch (err) {
      console.error("Error updating doctor:", err);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Doctors</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add Doctor
        </button>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <p className="text-gray-500">Loading doctors...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserCheck className="text-indigo-600" size={28} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{doctor.name}</h3>
                  <p className="text-sm text-gray-600">{doctor.specialty}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>📞 {doctor.phone}</p>
                <p>📧 {doctor.email}</p>
                <p>
                  🕒 {formatTime(doctor.available_from)} -{" "}
                  {formatTime(doctor.available_to)}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setViewDoctor(doctor)}
                  className="flex-1 bg-indigo-50 text-indigo-600 py-2 rounded-lg hover:bg-indigo-100 transition"
                >
                  View
                </button>
                <button
                  onClick={() => setEditDoctor(doctor)}
                  className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg hover:bg-gray-100 transition"
                >
                  Edit
                </button>
                {currentUserRole === "Admin" && (
                  <button
                    onClick={() => handleDelete(doctor.id)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {viewDoctor && (
        <ViewDoctorModal
          doctor={viewDoctor}
          onClose={() => setViewDoctor(null)}
        />
      )}
      {editDoctor && (
        <EditDoctorModal
          doctor={editDoctor}
          onClose={() => setEditDoctor(null)}
          onSave={handleEditSave}
        />
      )}
      {/* Modal */}
      {showModal && (
        <AddDoctorModal
          onClose={() => setShowModal(false)}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Doctors;
