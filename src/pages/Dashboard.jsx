// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  FileText,
  Package,
  Eye,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { reportService } from "../api/reportService";
import { inventoryService } from "../api/inventoryService";
import { appointmentService } from "../api/appointmentService";

const Dashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        if (user?.role === "Admin") {
          const [appointmentReport, financialReport, inventoryLowStock] =
            await Promise.all([
              reportService.getAppointmentReport(),
              reportService.getFinancialReport(),
              inventoryService.getLowStock(),
            ]);

          setStats([
            {
              label: "Total Patients",
              value: appointmentReport?.total_patients ?? "—",
              icon: Users,
              color: "bg-blue-500",
            },
            {
              label: "Doctors",
              value: appointmentReport?.total_doctors ?? "—",
              icon: UserCheck,
              color: "bg-green-500",
            },
            {
              label: "Appointments Today",
              value: appointmentReport?.today_appointments ?? "—",
              icon: Calendar,
              color: "bg-purple-500",
            },
            {
              label: "Revenue (Month)",
              value: `$${financialReport?.monthly_revenue ?? "—"}`,
              icon: DollarSign,
              color: "bg-yellow-500",
            },
          ]);

          setRecentAppointments(appointmentReport?.recent ?? []);
          setLowStockItems(inventoryLowStock ?? []);
        }

        if (user?.role === "Doctor") {
          const doctorAppointments =
            await appointmentService.getDoctorAppointments(user.id);

          setStats([
            {
              label: "Today Appointments",
              value: doctorAppointments.length,
              icon: Calendar,
              color: "bg-blue-500",
            },
            {
              label: "Pending",
              value: doctorAppointments.filter((a) => a.status === "Pending")
                .length,
              icon: FileText,
              color: "bg-yellow-500",
            },
            {
              label: "Completed",
              value: doctorAppointments.filter((a) => a.status === "Completed")
                .length,
              icon: UserCheck,
              color: "bg-green-500",
            },
            {
              label: "Total Patients",
              value: new Set(doctorAppointments.map((a) => a.patientId)).size,
              icon: Users,
              color: "bg-purple-500",
            },
          ]);

          setRecentAppointments(doctorAppointments.slice(0, 5));
        }

        if (user?.role === "Patient") {
          const [appointments, bills] = await Promise.all([
            appointmentService.getPatientAppointments(user.id),
            reportService.getPatientSummary(user.id),
          ]);

          setStats([
            {
              label: "Upcoming Appointments",
              value: appointments.filter((a) => a.status === "Confirmed")
                .length,
              icon: Calendar,
              color: "bg-blue-500",
            },
            {
              label: "Pending Bills",
              value: `$${bills?.pending_total ?? 0}`,
              icon: DollarSign,
              color: "bg-red-500",
            },
            {
              label: "Medical Records",
              value: bills?.records_count ?? 0,
              icon: FileText,
              color: "bg-green-500",
            },
            {
              label: "Prescriptions",
              value: bills?.prescriptions_count ?? 0,
              icon: Package,
              color: "bg-purple-500",
            },
          ]);

          setRecentAppointments(appointments.slice(0, 3));
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      }
    };

    loadDashboardData();
  }, [user]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-gray-600 mb-8">Here's what's happening today</p>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-4 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Section */}
      {user?.role === "Admin" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Recent Appointments
            </h3>
            <div className="space-y-3">
              {recentAppointments.map((apt, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {apt.patientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {apt.doctorName} - {apt.time}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Low Stock Alerts
            </h3>
            <div className="space-y-3">
              {lowStockItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {item.quantity} units
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    Low
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
