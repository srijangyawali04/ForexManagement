import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { addUser } from '../../services/api'; // Import the addUser function from api.js

const DESIGNATIONS = ["Deputy Director", "Assistant Director", "Head Assistant", "Assistant", "Deputy Assistant"];
const ROLES = ["Creator", "Verifier"];
const USER_STATUSES = ["Enabled", "Disabled"];

export default function UserForm({ onUserAdd, onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    user_status: "Enabled",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await addUser(formData); // Call the addUser function from api.js
      alert('User added successfully!');
      onUserAdd(result.data); // Pass the newly added user back to the parent component
      onClose(); // Close the form
    } catch (error) {
      alert(error.message);
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold">Add New User</h2>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Staff Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Staff Code</label>
              <input
                type="text"
                name="staff_code"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* Staff Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Staff Name</label>
              <input
                type="text"
                name="staff_name"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Designation</label>
              <select
                name="designation"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Designation</option>
                {DESIGNATIONS.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                name="mobile_number"
                required
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="user_status"
                required
                value={formData.user_status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {USER_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              name="remarks"
              rows={3}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 ${
                isSubmitting ? 'opacity-50' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
