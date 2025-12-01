// src/api/inventoryService.js
import apiClient from "./apiClient";

export const inventoryService = {
  // Get all inventory items
  getAll() {
    return apiClient.get("/inventory/");
  },

  // Get inventory by category
  getByCategory(category) {
    return apiClient.get(`/inventory/category/${category}`);
  },

  // Get a single inventory item by ID
  getById(itemId) {
    return apiClient.get(`/inventory/${itemId}`);
  },

  // Add new inventory item (Admin only)
  create(data) {
    return apiClient.post("/inventory/", {
      item_name: data.item_name,
      category: data.category,
      quantity: data.quantity,
      supplier: data.supplier,
      reorder_level: data.reorder_level,
    });
  },

  // Update inventory item
  update(itemId, data) {
    return apiClient.put(`/inventory/${itemId}`, data);
  },

  // Adjust inventory quantity (add or subtract)
  adjustQuantity(itemId, adjustment) {
    return apiClient.patch(`/inventory/${itemId}/adjust-quantity`, null, {
      params: { adjustment },
    });
  },

  // Delete inventory item (Admin only)
  delete(itemId) {
    return apiClient.delete(`/inventory/${itemId}`);
  },

  // Get low stock items
  getLowStock() {
    return apiClient.get("/inventory/low-stock/alert");
  },

  // Get inventory statistics
  getStats() {
    return apiClient.get("/inventory/stats/summary");
  },
};

// Helper to get medication items (category = "Medication" or "Medicine")
export const getMedicationInventory = async () => {
  try {
    const allItems = await inventoryService.getAll();
    // Filter for medication/medicine items
    return allItems.filter(
      (item) =>
        item.category?.toLowerCase().includes("medic") ||
        item.category?.toLowerCase().includes("drug") ||
        item.category?.toLowerCase().includes("pharma")
    );
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
};
