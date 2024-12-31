import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To handle redirection after logout
import Pagination from './Pagination'; // Import your Pagination component
import UserStatusBadge from './UserStatusBadge'; // Import your UserStatusBadge component
import UserFilters from './UserFilters'; // Import the UserFilters component
import UserForm from './UserForm'; // Import the UserForm component

const ITEMS_PER_PAGE = 10;
const apiUrl = import.meta.env.VITE_API_URL;

export default function UserList({ loading, onUpdateStatus }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all'); // Track the status filter
  const [showAddUser, setShowAddUser] = useState(false); // Track whether to show the Add User form
  const navigate = useNavigate(); // Initialize the navigate function for redirection

  useEffect(() => {
    // Fetch the user data from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user/allusers`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data); // Set the users state with the response data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Filter users based on selected status
  const filteredUsers = statusFilter === 'all' 
    ? users 
    : users.filter((user) => user.user_status === statusFilter);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleStatusToggle = (user) => {
    if (onUpdateStatus) {
      const newStatus = user.user_status === 'Enabled' ? 'Disabled' : 'Enabled';
      onUpdateStatus(user.staff_code, newStatus);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear user session or token
    localStorage.removeItem('authToken');  // Assuming you're storing the token in localStorage
    sessionStorage.removeItem('authToken'); // If you're using sessionStorage, clear it
    navigate('/'); // Redirect to the login page after logout
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid page number
    setCurrentPage(page);
  };

  // Handle filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status); // Update the selected status filter
  };

  // Show the add user form (if you have one)
  const handleAddUser = () => {
    setShowAddUser(true);
  };

  const handleCloseUserForm = () => {
    setShowAddUser(false);
  };

  // Handle adding a new user
  const handleUserAdd = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Update the users list
    handleCloseUserForm(); // Close the form after submission
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"> {/* Main wrapper div with padding and background */}
      <div className="max-w-7xl mx-auto"> 
        <div className="absolute top-4 right-[20%]">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
          </div>
          <br></br>
        {/* <div className="relative bg-white rounded-lg shadow overflow-hidden">  */}
          <div>
          {showAddUser && (
            <UserForm
              onUserAdd={handleUserAdd}
              onClose={handleCloseUserForm}
            />
          )}

          <UserFilters
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            onAddUser={handleAddUser}
            />

          <div className="px-6 py-4 bg-white  border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">User List</h2>
            <span className="text-sm text-gray-500">Total Users: {filteredUsers.length}</span>
          </div>

          {/* Logout button in a div, positioned at the top right */}

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
