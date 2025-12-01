// src/App.jsx
import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  Package,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";

const App = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If not logged in, show Login screen
  if (!user) {
    return <Login />;
  }

  // Define Navigation Structure
  const navigation = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      roles: ["Admin", "Doctor", "Patient"],
    },
    {
      id: "patients",
      label: "Patients",
      icon: Users,
      roles: ["Admin", "Doctor"],
    },
    { id: "doctors", label: "Doctors", icon: UserCheck, roles: ["Admin"] },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
      roles: ["Admin", "Doctor", "Patient"],
    },
    {
      id: "billing",
      label: "Billing",
      icon: DollarSign,
      roles: ["Admin", "Doctor", "Patient"],
    },
    { id: "inventory", label: "Inventory", icon: Package, roles: ["Admin"] },
    {
      id: "reports",
      label: "Reports",
      icon: FileText,
      roles: ["Admin", "Doctor"],
    },
  ];

  // Filter based on role
  const filteredNav = navigation.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white transform transition-transform duration-300 ease-in-out h-full flex flex-col lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-indigo-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Users className="text-indigo-600" size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg">HMS</h2>
                <p className="text-xs text-indigo-300">Hospital System</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Sidebar Content (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Sidebar User Info (Reverted to original styles) */}
          <div className="mb-6 p-4 bg-indigo-700 rounded-lg">
            <p className="text-xs text-indigo-300 mb-1">Logged in as</p>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-indigo-300">{user.role}</p>
          </div>

          {/* Sidebar Navigation (Reverted to original styles) */}
          <nav className="space-y-2">
            {filteredNav.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === item.id
                    ? "bg-white text-indigo-900 font-semibold"
                    : "text-indigo-100 hover:bg-indigo-700"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-indigo-700 flex-shrink-0">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-indigo-700 rounded-lg transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-800"
            >
              <Menu size={24} />
            </button>

            {/* Page Title (for mobile) */}
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl font-bold text-gray-800 lg:hidden">
                {filteredNav.find((n) => n.id === currentPage)?.label}
              </h1>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {user.name}
                </p>
                <p className="text-xs text-gray-600">{user.role}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold">
                  {user.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentPage === "dashboard" && <Dashboard />}
          {currentPage === "patients" && <Patients />}
          {currentPage === "doctors" && <Doctors />}
          {currentPage === "appointments" && <Appointments />}
          {currentPage === "billing" && <Billing />}
          {currentPage === "inventory" && <Inventory />}
          {currentPage === "reports" && <Reports />}
        </main>
      </div>
    </div>
  );
};

export default App;
