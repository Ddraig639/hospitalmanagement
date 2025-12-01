import React, { useState } from "react";
import { useApi } from "../hooks/useApi";
import { billingService } from "../api/billingService";
import { appointmentService } from "../api/appointmentService";
import { Plus, Eye, Edit, X } from "lucide-react";

const Billing = () => {
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  // ✅ Fetch all bills
  const {
    data: bills,
    loading: billsLoading,
    error: billsError,
    refetch,
  } = useApi(() => billingService.getAll(), []);

  // ✅ Fetch all appointments for dropdown
  const {
    data: appointments,
    loading: apptLoading,
    error: apptError,
  } = useApi(() => appointmentService.getAll(), []);

  // ✅ Handle bill creation
  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newBill = {
      appointment_id: formData.get("appointment"),
      amount: parseFloat(formData.get("amount")),
      payment_method: formData.get("method"),
      insurance_provider: formData.get("insurance"),
      notes: formData.get("notes"),
    };

    try {
      await billingService.create(newBill);
      alert("Bill generated successfully!");
      refetch();
      setShowModal(false);
    } catch (err) {
      console.error("Create bill failed:", err);
      alert("Failed to create bill.");
    }
  };

  // ✅ Modal Component
  const BillModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Generate Bill</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ✅ Appointments dropdown from backend */}
            <select
              name="appointment"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Appointment</option>
              {apptLoading && <option>Loading appointments...</option>}
              {apptError && <option>Error loading appointments</option>}
              {!apptLoading &&
                appointments?.map((appt) => (
                  <option key={appt.id} value={appt.id}>
                    {appt.patient_name
                      ? `${appt.patient_name} - ${appt.reason || "General"}`
                      : `Appointment ${appt.id}`}
                  </option>
                ))}
            </select>

            <input
              name="amount"
              type="number"
              placeholder="Amount ($)"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <select
              name="method"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            <select
              name="insurance"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Insurance Provider</option>
              <option value="None">None</option>
              <option value="Provider A">Provider A</option>
              <option value="Provider B">Provider B</option>
            </select>
          </div>

          <textarea
            name="notes"
            placeholder="Additional Notes"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Generate Bill
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

  // ✅ Filter logic
  const filteredBills =
    filter === "all"
      ? bills || []
      : (bills || []).filter((b) =>
          filter === "paid"
            ? b.status?.toLowerCase() === "paid"
            : b.status?.toLowerCase() !== "paid"
        );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Billing & Payments</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Generate Bill
        </button>
      </div>

      {/* Loading/Error */}
      {billsLoading && (
        <p className="text-center text-gray-500">Loading bills...</p>
      )}
      {billsError && (
        <p className="text-center text-red-500">Error: {billsError}</p>
      )}

      {/* Table */}
      {!billsLoading && !billsError && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Bills
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === "paid"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilter("unpaid")}
              className={`px-4 py-2 rounded-lg font-semibold ${
                filter === "unpaid"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Unpaid
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Bill ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Patient
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Method
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">#{bill.id}</td>
                      <td className="py-3 px-4">
                        {bill.patient_name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {bill.appointment_title || "N/A"}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        ${Number(bill.amount || 0).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            bill.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {bill.status || "Unpaid"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {bill.payment_method || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-indigo-600 hover:text-indigo-800">
                            <Eye size={18} />
                          </button>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-500">
                      No bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && <BillModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Billing;
