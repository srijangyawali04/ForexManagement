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

// Api for user status
export const updateUserStatus = async (staffCode, newStatus) => {
  try {
    const response = await fetch(`${apiUrl}/api/user/update-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ staff_code: staffCode, user_status: newStatus }) // Updated keys to match backend
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


// Api for add user 

export const addUser = async (userData) => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  const role = localStorage.getItem('role'); // Retrieve the role from localStorage

  if (!role) {
    throw new Error('Role is missing. Please log in again.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/add-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Authorization token
        'Role': role, // Include the role in headers
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error('Error: ' + errorData.message); // Display the message to the user
    }

    return await response.json(); // Return the created user's data
  } catch (error) {
    console.error('Error adding user:', error);
    throw new Error('Failed to add user. Please try again later.');
  }
};



// Fetch the logged-in user's information
export const fetchLoggedInUser = async () => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage
  const staffCode = localStorage.getItem('staff_code'); // Retrieve the logged-in user's staff_code from localStorage

  // Log the staffCode to check its value
    console.log('Staff Code:', staffCode);


  if (!token || !staffCode) {
    throw new Error('No authentication token or staff code found.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/${staffCode}`, {  // Using staffCode here
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Send the token in the request header
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user information');
    }

    const userData = await response.json();
    return userData; // Return the logged-in user's data
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    throw error;
  }
};

// fetch exchange-rates
export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/exchange-rates`); // Use backticks for string interpolation
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    const data = await response.json();
    return data; // Assuming the data is an array or object with exchange rates
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};


//API to create voucher 
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem('authToken'); // Retrieve the token
  
  try {
    const response = await fetch(`${apiUrl}/api/voucher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Authorization token
      },
      body: JSON.stringify(voucherData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error('Error: ' + errorData.message);
    }

    return await response.json(); // Return the created voucher's data
  } catch (error) {
    console.error('Error creating voucher:', error);
    throw new Error('Failed to create voucher. Please try again later.');
  }
};
