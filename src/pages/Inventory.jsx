// src/pages/Inventory.jsx
import React, { useState, useEffect } from "react";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import { inventoryService } from "../api/inventoryService";

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    quantity: "",
    reorder_Level: "",
    supplier: "",
    unit_Price: "",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch inventory items
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await inventoryService.getAll();
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 🔹 Handle form input changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 🔹 Handle new item submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await inventoryService.create({
        item_name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity, 10),
        reorder_Level: parseInt(formData.reorderLevel, 10),
        supplier: formData.supplier,
        // unitPrice: parseFloat(formData.unitPrice),
      });
      await fetchInventory();
      setShowModal(false);
      setFormData({
        item_name: "",
        category: "",
        quantity: "",
        reorder_Level: "",
        supplier: "",
        unit_Price: "",
      });
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // 🔹 Modal Component
  const InventoryModal = ({ onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Inventory Item
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
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
              placeholder="Item Name"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              <option value="Medical Supplies">Medical Supplies</option>
              <option value="Medical Equipment">Medical Equipment</option>
              <option value="PPE">PPE</option>
              <option value="Pharmaceuticals">Pharmaceuticals</option>
            </select>
            <input
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              type="number"
              placeholder="Quantity"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleChange}
              type="number"
              placeholder="Reorder Level"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="supplier"
              value={formData.supplier}
              onChange={handleChange}
              type="text"
              placeholder="Supplier"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              type="number"
              placeholder="Unit Price ($)"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Add Item
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Inventory Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add Item
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        {loading ? (
          <p className="text-gray-500">Loading inventory...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Item Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Reorder Level
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Supplier
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium">{item.item_name}</td>
                    <td className="py-3 px-4">{item.category}</td>
                    <td className="py-3 px-4">{item.quantity}</td>
                    <td className="py-3 px-4">{item.reorder_level}</td>
                    <td className="py-3 px-4">{item.supplier}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          item.quantity > item.reorderLevel
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.quantity > item.reorderLevel
                          ? "In Stock"
                          : "Low Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <InventoryModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Inventory;
