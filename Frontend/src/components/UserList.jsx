import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import UserStatusBadge from './UserStatusBadge';
import UserFilters from './UserFilters';
import UserForm from './UserForm';

const ITEMS_PER_PAGE = 10;
const apiUrl = import.meta.env.VITE_API_URL;

export default function UserList({ loading, onUpdateStatus }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
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

  const filteredUsers = users.filter((user) => {
    return (
      (statusFilter === 'all' || user.user_status === statusFilter) &&
      (roleFilter === 'all' || user.role === roleFilter)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleStatusToggle = async (user) => {
    // Prevent changing the status of Admin users
    if (user.role === 'Admin') {
      alert('The status of an Admin cannot be changed.');
      return; // Exit the function early
    }
  
    const newStatus = user.user_status === 'Enabled' ? 'Disabled' : 'Enabled';
  
    // Update status on the backend
    try {
      await onUpdateStatus(user.staff_code, newStatus); // Assuming this updates the backend
  
      // Update status in the local state directly without re-fetching users
      setUsers((prevUsers) => 
        prevUsers.map((u) =>
          u.staff_code === user.staff_code ? { ...u, user_status: newStatus } : u
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
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
        <div className="absolute top-4 right-[20%]">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <br />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.staff_code} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.staff_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.staff_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.mobile_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <UserStatusBadge
                        status={user.user_status}
                        onClick={() => handleStatusToggle(user)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.remarks}</td>
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
    </div>
  );
}
