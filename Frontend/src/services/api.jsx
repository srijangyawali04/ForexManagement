const apiUrl = import.meta.env.VITE_API_URL;

// Fetch all user info
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


//Fetch user from staffcode
// API for fetching a user by staff code
export const getUserByStaffCode = async (staffCode) => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  if (!staffCode) {
    throw new Error('Staff code is required.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/${staffCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Authorization token
      },
    });

    // Check if the response is not OK
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      alert(`Error: ${errorData.message}`); // Show alert for any errors
      return null;
    }

    // Parse the successful response and return the user data
    const data = await response.json();
    return data; // Return the user data for further use
  } catch (error) {
    console.error('Error fetching user by staff code:', error);
    alert('Failed to fetch user data. Please try again later.');
    return null; // Return null if an error occurred
  }
};


// Api for user status
export const updateUserStatus = async (staffCode, newStatus , remark) => {
  try {
    const response = await fetch(`${apiUrl}/api/user/update-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        staff_code: staffCode,
        user_status: newStatus,
        remark: remark, // Include the remark in the request body
      }),    });

    if (!response.ok) {
      throw new Error('Failed to update user status');
    }

    return await response.json(); // Return the updated user data
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error; // Rethrow error
  }
};


// API for adding a user
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

    // Check if the response is not OK
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);

      // Handle specific error responses from the backend
      if (errorData.message.includes('already exists')) {
        alert(`Error: ${errorData.message}`); // Alert for duplicate user
      }
      throw new Error(errorData.message); // Throw the error for further handling
    }

    const data = await response.json(); // Parse the successful response
    // alert('User added successfully.'); // Notify the user of success
    return data; // Return the created user's data
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Failed to add user. Please try again later.'); // Notify the user of a failure
    throw error; // Re-throw the error for further handling
  }
};



export const resetUserPassword = async (staffCode, newPassword) => {
  try {
      const response = await fetch(`${apiUrl}/api/user/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
              staff_code: staffCode,
              password: newPassword,
          }),
      });

      if (!response.ok) {
          const errorData = await response.text(); // Handle non-JSON error response
          return { success: false, message: errorData };
      }

      const data = await response.json();
      return { success: true, message: data.message, data }; // Return success status and data
  } catch (error) {
      return { success: false, message: error.message }; // Return error message
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

// New function to manually trigger the forex rates fetch
export const manualFetchForexRates = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/exchange-rates/trigger-fetch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch forex rates');
    }

    const data = await response.json();
    alert(data.message); // Display success message
  } catch (error) {
    alert('Error fetching forex rates');
    console.error('Error:', error);
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

// Change voucher status
export const updateVoucherStatus = async (voucherNumber, action, loggedInUser) => {
  const requestBody = {
    action: action, 
    updatedBy: loggedInUser.staff_code, 
  };

  console.log('Sending request with body:', requestBody); // Log the request body

  try {
    const response = await fetch(`${apiUrl}/api/voucher/${voucherNumber}/update-status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error('Failed to update voucher status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating voucher status:', error);
    throw error;
  }
};




// Fetch voucher data
export const fetchVouchers = async () => {
  const token = localStorage.getItem('authToken'); // Retrieve the token

  try {
    const response = await fetch(`${apiUrl}/api/voucher`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Authorization token
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vouchers');
    }

    const data = await response.json();
    return data; // Return the list of vouchers
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    throw error; // Rethrow error to be handled in the component
  }
};


// API for fetching a voucher by voucher number
export const getVoucherByNumber = async (voucherNumber) => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  if (!voucherNumber) {
    throw new Error('Voucher number is required.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/voucher/${voucherNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Authorization token
      },
    });

    // Check if the response is not OK
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      alert(`Error: ${errorData.message}`); // Show alert for any errors
      return null;
    }

    // Parse the successful response and return the voucher data
    const data = await response.json();
    return data; // Return the voucher data
  } catch (error) {
    console.error('Error fetching voucher by number:', error);
    alert('Failed to fetch voucher data. Please try again later.');
    return null; // Return null if an error occurred
  }
};

// Fetch total vouchers count from API
export const fetchTotalVoucherCount = async () => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  try {
    const response = await fetch(`${apiUrl}/api/voucher/total`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Authorization token
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching total vouchers:', errorData);
      throw new Error('Failed to fetch total vouchers');
    }

    const data = await response.json();
    return data.totalVouchers; // Return the total vouchers count
  } catch (error) {
    console.error('Error fetching total vouchers:', error);
    throw new Error('Failed to fetch total vouchers');
  }
};

// api.jsx
export const fetchTransactionReport = async (filters) => {
  try {
    // Construct the URL with query parameters based on the filters
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${apiUrl}/api/transaction/report-generation?${queryParams}`;

    // Send a GET request to the server
    const response = await fetch(url, {
      method: 'GET', // Adjust the method if necessary
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction report: ${response.statusText}`);
    }

    // Parse the JSON data from the response
    const data = await response.json();

    return data; // Return the transaction data
  } catch (error) {
    console.error('Error fetching transaction report:', error);
    throw error;
  }
};


// Apply corrections to a voucher
export const applyVoucherCorrection = async (voucherNumber, correctionData) => {
  const token = localStorage.getItem('authToken'); // Retrieve the token from localStorage

  try {
    const response = await fetch(`${apiUrl}/api/voucher/${voucherNumber}/correction`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the Authorization token
      },
      body: JSON.stringify(correctionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error applying voucher correction:', errorData);
      throw new Error('Failed to apply voucher correction');
    }

    const data = await response.json();
    return data; // Return the updated voucher data
  } catch (error) {
    console.error('Error applying voucher correction:', error);
    throw new Error('Failed to apply voucher correction');
  }
};
