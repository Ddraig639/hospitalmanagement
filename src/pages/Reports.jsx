// src/pages/Reports.jsx
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Users,
  Calendar,
  Package,
  BarChart3,
  FileText,
} from "lucide-react";
import { reportService } from "../api/reportService";

const Reports = () => {
  const [reportType, setReportType] = useState("revenue");
  const [reportData, setReportData] = useState(null);
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadReport = async () => {
    try {
      setLoading(true);
      setError(null);

      let data;
      if (reportType === "revenue") {
        data = await reportService.getRevenueReport({ period });
      } else if (reportType === "patients") {
        data = await reportService.getPatientStats({ period });
      } else if (reportType === "appointments") {
        data = await reportService.getAppointmentStats({ period });
      } else if (reportType === "inventory") {
        data = await reportService.getInventoryStats({ period });
      }

      setReportData(data);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [reportType, period]);

  const handleExport = async () => {
    try {
      const response = await reportService.downloadReport(reportType, {
        period,
      });

      const blob = new Blob([response], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${reportType}-report.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert("Failed to export report");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Reports & Analytics
      </h1>

      {/* Report Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { key: "revenue", icon: DollarSign, label: "Revenue Report" },
          { key: "patients", icon: Users, label: "Patient Statistics" },
          { key: "appointments", icon: Calendar, label: "Appointments" },
          { key: "inventory", icon: Package, label: "Inventory Status" },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setReportType(key)}
            className={`p-6 rounded-xl shadow-md transition ${
              reportType === key
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800 hover:shadow-lg"
            }`}
          >
            <Icon size={32} className="mb-2" />
            <p className="font-semibold">{label}</p>
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {reportType === "revenue" && "Revenue Analytics"}
            {reportType === "patients" && "Patient Statistics"}
            {reportType === "appointments" && "Appointment Analytics"}
            {reportType === "inventory" && "Inventory Status"}
          </h2>

          <div className="flex gap-3">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={handleExport}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Export PDF
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading report data...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reportType === "revenue" && reportData && (
                <>
                  <StatCard
                    title="Total Revenue"
                    value={`$${reportData.totalRevenue}`}
                    trend="+18%"
                    color="green"
                  />
                  <StatCard
                    title="Average per Visit"
                    value={`$${reportData.averagePerVisit}`}
                    trend="+5%"
                    color="blue"
                  />
                  <StatCard
                    title="Collection Rate"
                    value={`${reportData.collectionRate}%`}
                    trend="+2%"
                    color="purple"
                  />
                </>
              )}

              {reportType === "patients" && reportData && (
                <>
                  <StatCard
                    title="Total Patients"
                    value={reportData.totalPatients}
                    trend="+45 new this month"
                    color="blue"
                  />
                  <StatCard
                    title="Active Patients"
                    value={reportData.activePatients}
                    trend="72% of total"
                    color="green"
                  />
                  <StatCard
                    title="Return Rate"
                    value={`${reportData.returnRate}%`}
                    trend="+4% from last month"
                    color="purple"
                  />
                </>
              )}

              {reportType === "appointments" && reportData && (
                <>
                  <StatCard
                    title="Total Appointments"
                    value={reportData.totalAppointments}
                    trend="This month"
                    color="indigo"
                  />
                  <StatCard
                    title="Completion Rate"
                    value={`${reportData.completionRate}%`}
                    trend="+3% from last month"
                    color="green"
                  />
                  <StatCard
                    title="No-Show Rate"
                    value={`${reportData.noShowRate}%`}
                    trend="-1% from last month"
                    color="yellow"
                  />
                </>
              )}

              {reportType === "inventory" && reportData && (
                <>
                  <StatCard
                    title="Total Items"
                    value={reportData.totalItems}
                    trend="Across all categories"
                    color="blue"
                  />
                  <StatCard
                    title="Low Stock Items"
                    value={reportData.lowStockItems}
                    trend="Needs reorder"
                    color="red"
                  />
                  <StatCard
                    title="Inventory Value"
                    value={`$${reportData.inventoryValue}`}
                    trend="Current stock value"
                    color="green"
                  />
                </>
              )}
            </div>

            {/* Chart Placeholder */}
            <div className="mt-8">
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Chart visualization would appear here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Integration with Recharts or Chart.js
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// StatCard component for reusability
const StatCard = ({ title, value, trend, color }) => {
  const colorClasses = {
    green: "from-green-50 to-green-100 text-green-700",
    blue: "from-blue-50 to-blue-100 text-blue-700",
    purple: "from-purple-50 to-purple-100 text-purple-700",
    yellow: "from-yellow-50 to-yellow-100 text-yellow-700",
    red: "from-red-50 to-red-100 text-red-700",
    indigo: "from-indigo-50 to-indigo-100 text-indigo-700",
  }[color];

  return (
    <div className={`p-4 bg-gradient-to-br ${colorClasses} rounded-lg`}>
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-2">{trend}</p>
    </div>
  );
};

export default Reports;
