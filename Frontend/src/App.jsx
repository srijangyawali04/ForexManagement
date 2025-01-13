// src/App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
// import Voucher from "./pages/Voucher";
// import PrintTemplate from "./pages/PrintTemplate";
import LoginPage from "./components/LoginPage";
import UserList from './components/AdminDashboard/UserList';
import CreatorDashboard from "./components/CreatorDashboard/CreatorDashboard";
import VerifierDashboard from "./components/VerifierDashboard/VerifierDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import { fetchUsers, updateUserStatus } from './services/api'; // Import API functions

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []); // Runs once when the component mounts

  const onUpdateStatus = async (staffCode, newStatus) => {
    try {
      const updatedUser = await updateUserStatus(staffCode, newStatus);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.staff_code === staffCode ? updatedUser : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  return (
    <AuthProvider>
      <Routes>
        {/* Public Route for login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Admin Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
          <Route
            path="/user-list"
            element={
              <UserList 
                users={users} 
                loading={loading} 
                onUpdateStatus={onUpdateStatus}
              />
            }
          />
        </Route>
        
        {/* Creator Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['Creator']} />}>
          <Route path="/creator-dashboard" element={<CreatorDashboard />} />
        </Route>
        
        {/* Verifier Protected Routes */}
        <Route element={<PrivateRoute allowedRoles={['Verifier']} />}>
          <Route path="/verifier-dashboard" element={<VerifierDashboard />} />
        </Route>
      </Routes>
    </AuthProvider>

  );
}

export default App;

