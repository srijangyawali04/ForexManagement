import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


const LoginPage = () => {
  const [staffCode, setStaffCodeInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({});
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();

  // Access the API URL from environment variables (using Vite-specific approach)
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle errors
  const handleErrors = (field, message) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: message,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    let isValid = true;
    if (!staffCode) {
      handleErrors("staffCode", "Staff Code is required.");
      isValid = false;
    }

    if (!password) {
      handleErrors("password", "Password is required.");
      isValid = false;
    }

    if (!isValid) return;

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staff_code: staffCode, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status !== "Enabled") {
          alert("Your account is not enabled. Please contact the admin.");
          return;
        }

        login(data.token, data.role, data.staffCode, data.staffName, data.designation);

        // Redirect based on role
        if (data.role === "Admin" || data.role === "SuperAdmin") {
          navigate("/user-list");
        } else if (data.role === "Creator") {
          navigate("/creator-dashboard");
        } else if (data.role === "Verifier") {
          navigate("/verifier-dashboard");
        }
      } else {
        alert(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden">
        <div className="px-8 py-10 bg-white">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              Forex Management System
            </h1>
            <p className="text-gray-500 text-sm">Please login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Staff Code Input */}
              <div>
                <div
                  className={`flex items-center border rounded-lg p-3 transition-all duration-300 
                  ${errors.staffCode ? "border-red-400" : "border-gray-300 hover:border-blue-500"}`}
                >
                  <input
                    type="text"
                    value={staffCode}
                    onChange={(e) => {
                      setErrors({});
                      setStaffCodeInput(e.target.value);
                    }}
                    placeholder="Staff Code"
                    className="w-full bg-transparent outline-none text-gray-700"
                  />
                </div>
                {errors.staffCode && (
                  <div className="flex items-center text-red-500 text-xs mt-2">
                    {errors.staffCode}
                  </div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div
                  className={`flex items-center border rounded-lg p-3 transition-all duration-300 
                  ${errors.password ? "border-red-400" : "border-gray-300 hover:border-blue-500"}`}
                >
                  <input
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    value={password}
                    onChange={(e) => {
                      setErrors({});
                      setPassword(e.target.value);
                    }}
                    placeholder="Password"
                    className="w-full bg-transparent outline-none text-gray-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2"
                    aria-label="Toggle Password Visibility"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center text-red-500 text-xs mt-2">
                    {errors.password}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
