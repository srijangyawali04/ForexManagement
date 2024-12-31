// src/services/api.js
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/user/allusers`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data; // Return the list of users
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; // Rethrow error to be handled in the component
  }
};

// You can also create other API methods here (e.g., for updating user status)
export const updateUserStatus = async (staffCode, newStatus) => {
  try {
    const response = await fetch(`${apiUrl}/api/user/update-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staffCode, status: newStatus })
    });

    if (!response.ok) {
      throw new Error('Failed to update user status');
    }

    return await response.json(); // Return the updated user data
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error; // Rethrow error
  }
};
