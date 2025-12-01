// src/pages/Login.jsx
import React, { useState } from "react";
import { Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../api/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        // 🔹 Registration endpoint
        const newUser = await authService.register({
          name: fullName,
          email,
          password,
          role,
        });
        // Auto-login after successful registration
        login(newUser.user, newUser.access_token);
      } else {
        // 🔹 Login endpoint
        const data = await authService.login(email, password);
        console.log("Login response:", data); // Debug log
        // Check if response has the expected structure
        if (!data || !data.access_token || !data.user) {
          throw new Error("Invalid response from server");
        }

        // Save to context and session storage
        login(data.user, data.access_token);
      }
    } catch (err) {
      console.error("Auth error:", err);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail);
      } else {
        setError(detail || err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Hospital Management
          </h1>
          <p className="text-gray-600 mt-2">
            {isRegister ? "Create Account" : "Sign In"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {isRegister && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Role</option>
              <option value="Patient">Patient</option>
              <option value="Doctor">Doctor</option>
              <option value="Doctor">Phamarcist</option>
              <option value="Doctor">Receptionist</option>
              <option value="Admin">Admin</option>
            </select>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? isRegister
                ? "Registering..."
                : "Logging in..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 font-semibold ml-2 hover:underline"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Demo Accounts:</p>
          <p className="text-xs text-gray-500">Admin: admin@hospital.com</p>
          <p className="text-xs text-gray-500">Doctor: doctor@hospital.com</p>
          <p className="text-xs text-gray-500">Patient: patient@hospital.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
