import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Import the useAuth hook
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import UserStatusBadge from './UserStatusBadge';
import UserFilters from './UserFilters';
import UserForm from './UserForm';
import { fetchLoggedInUser, resetUserPassword } from '../../services/api'; // Import resetUserPassword
import ExchangeRatesTable from '../ExchangeRateTable/ExchangeRatesTable';
import { updateUserStatus } from '../../services/api';

const ITEMS_PER_PAGE = 10;
const apiUrl = import.meta.env.VITE_API_URL;

export default function UserList({ loading, onUpdateStatus }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const { authState, setLoggedInUser } = useAuth(); // Use authState instead of loggedInUser
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user/allusers`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        if (!authState.staffName) {  // Use authState instead of loggedInUser
          const userInfo = await fetchLoggedInUser();
          setLoggedInUser(userInfo);
        }
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
      }
    };

    getUserInfo();
  }, [authState, setLoggedInUser]);

  const filteredUsers = users.filter((user) => {
    return (
      (statusFilter === 'all' || user.user_status === statusFilter) &&
      (roleFilter === 'all' || user.role === roleFilter) &&
      user.role !== 'SuperAdmin'
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleStatusToggle = async (status, remark, user) => {
    // Allow SuperAdmin to change the status of Admin users
    if (user.role === 'Admin' && authState.role !== 'SuperAdmin') {
      alert('The status of an Admin cannot be changed unless you are a SuperAdmin.');
      return; // Exit the function early
    }
  
    // Toggle the status between 'Enabled' and 'Disabled'
    const newStatus = status === 'Enabled' ? 'Disabled' : 'Enabled';
  
    // Ensure a remark is provided before proceeding
    if (!remark) {
      alert('Please provide a remark before changing the status.');
      return; // Exit the function early
    }
  
    // Send the update to the backend and handle the UI update
    try {
      console.log('Sending update to backend...');
      
      // Call the updateUserStatus function to update the status and remark on the backend
      const response = await updateUserStatus(user.staff_code, newStatus, remark);
  
      console.log('Backend response:', response);
  
      // Check if the backend returned a success message
      if (response && response.message === 'User status updated successfully') {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.staff_code === user.staff_code
              ? { ...u, user_status: newStatus, remarks: remark } // Update status and remarks
              : u
          )
        );
        console.log('User status updated successfully in local state');
      } else {
        console.error('Failed to update status on backend');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };
  
  const handleResetPassword = async (user) => {
    const newPassword = prompt("Enter new password for user " + user.staff_name);
    if (newPassword) {
        try {
            const response = await resetUserPassword(user.staff_code, newPassword);

            // Single alert for success or failure
            if (response.success && response.message === "Password reset successfully.") {
                alert("Password reset successfully for " + user.staff_name);
                // Optionally, update the UI here for success
            } else {
                alert("Failed to reset password for " + user.staff_name + ": " + response.message);
                // Optionally, update the UI here for failure
            }
        } catch {
            alert("An unexpected error occurred while resetting the password.");
        }
    }
};


  
  
  

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/');
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
  };

  const handleAddUser = () => {
    setShowAddUser(true);
  };

  const handleCloseUserForm = () => {
    setShowAddUser(false);
  };

  const handleUserAdd = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
    handleCloseUserForm();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-indigo-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">Forex Management System</h1>
              {authState.staffName && (  // Check if staffName exists in authState
                <div className="text-sm">
                  <span className="opacity-75">Welcome,</span>{' '}
                  <span className="font-semibold">{authState.staffName}</span>{' '}
                  <span className="bg-indigo-500 px-2 py-1 rounded-full text-xs">
                    {authState.role}
                  </span>
                </div>
              )}
            </div>
            {/* Logout Button */}
            {authState.staffName && ( // Check if staffName exists in authState
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </header>
        <br></br>

        {/* Rest of the user list and table */}
        <div>
          {showAddUser && (
            <UserForm onUserAdd={handleUserAdd} onClose={handleCloseUserForm} />
          )}

          <UserFilters
            statusFilter={statusFilter}
            roleFilter={roleFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onRoleFilterChange={handleRoleFilterChange}
            onAddUser={handleAddUser}
          />

          <div className="px-6 py-4 bg-white border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">User List</h2>
            <span className="text-sm text-gray-500">Total Users: {filteredUsers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Code</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.staff_code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{user.staff_code}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{user.staff_name}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{user.designation}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{user.role}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{user.mobile_number}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    <button
                      onClick={() => handleResetPassword(user)}
                      className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Reset
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">
                    <UserStatusBadge
                      status={user.user_status}
                      onClick={(status, remark) => handleStatusToggle(status, remark, user)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-500">{user.remarks}</td>
                </tr>
              ))}
            </tbody>

            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <ExchangeRatesTable />
    </div>
  );
}
