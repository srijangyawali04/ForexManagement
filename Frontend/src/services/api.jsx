const apiUrl = import.meta.env.VITE_API_URL;

// Fetch all user info
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/user/allusers`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error; 
  }
};


//Fetch user from staffcode
export const getUserByStaffCode = async (staffCode) => {
  const token = localStorage.getItem('authToken'); 

  if (!staffCode) {
    throw new Error('Staff code is required.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/${staffCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      alert(`Error: ${errorData.message}`); 
      return null;
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching user by staff code:', error);
    alert('Failed to fetch user data. Please try again later.');
    return null; 
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
        remark: remark, 
      }),    });

    if (!response.ok) {
      throw new Error('Failed to update user status');
    }

    return await response.json(); 
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error; // Rethrow error
  }
};


// API for adding a user
export const addUser = async (userData) => {
  const token = localStorage.getItem('authToken'); 
  const role = localStorage.getItem('role'); 

  if (!role) {
    throw new Error('Role is missing. Please log in again.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/add-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
        'Role': role, 
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);

      if (errorData.message.includes('already exists')) {
        alert(`Error: ${errorData.message}`); 
      }
      throw new Error(errorData.message); 
    }

    const data = await response.json(); 
    return data; 
  } catch (error) {
    console.error('Error adding user:', error);
    alert('Failed to add user. Please try again later.'); 
    throw error; 
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
          const errorData = await response.text(); 
          return { success: false, message: errorData };
      }

      const data = await response.json();
      return { success: true, message: data.message, data }; 
  } catch (error) {
      return { success: false, message: error.message }; 
  }
};






// Fetch the logged-in user's information
export const fetchLoggedInUser = async () => {
  const token = localStorage.getItem('authToken'); 
  const staffCode = localStorage.getItem('staff_code'); 

    console.log('Staff Code:', staffCode);


  if (!token || !staffCode) {
    throw new Error('No authentication token or staff code found.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/user/${staffCode}`, {  
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user information');
    }

    const userData = await response.json();
    return userData; 
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    throw error;
  }
};

// get exchange rate from backend
export const fetchExchangeRates = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/exchange-rates`); 
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw error;
  }
};

// fetch new exchange rate manually
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
    alert(data.message); 
  } catch (error) {
    alert('Error fetching forex rates');
    console.error('Error:', error);
  }
};


//create voucher 
export const createVoucher = async (voucherData) => {
  const token = localStorage.getItem('authToken'); 
  
  try {
    const response = await fetch(`${apiUrl}/api/voucher`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(voucherData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      throw new Error('Error: ' + errorData.message);
    }

    return await response.json(); 
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

  console.log('Sending request with body:', requestBody); 

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


// get the evoucher information
export const fetchVouchers = async (user) => {
  const token = localStorage.getItem('authToken');
  
  try {
    let url = `${apiUrl}/api/voucher`;
    
    if (user?.role === 'Creator') {
      url += `?staffCode=${user.staff_code}`;
    }

    // console.log('logged ', user)
    console.log('url',url)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch vouchers');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    throw error;
  }
};





// fetching a voucher by voucher number
export const getVoucherByNumber = async (voucherNumber) => {
  const token = localStorage.getItem('authToken'); 

  if (!voucherNumber) {
    throw new Error('Voucher number is required.');
  }

  try {
    const response = await fetch(`${apiUrl}/api/voucher/${voucherNumber}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error response:', errorData);
      alert(`Error: ${errorData.message}`); 
      return null;
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error fetching voucher by number:', error);
    alert('Failed to fetch voucher data. Please try again later.');
  }
};

// Fetch total vouchers count from API
export const fetchTotalVoucherCount = async () => {
  const token = localStorage.getItem('authToken'); 

  try {
    const response = await fetch(`${apiUrl}/api/voucher/total`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching total vouchers:', errorData);
      throw new Error('Failed to fetch total vouchers');
    }

    const data = await response.json();
    return data.totalVouchers; 
  } catch (error) {
    console.error('Error fetching total vouchers:', error);
    throw new Error('Failed to fetch total vouchers');
  }
};

//  reoprt information
export const fetchTransactionReport = async (filters) => {
  try {
    // Construct the URL with query parameters based on the filters
    const queryParams = new URLSearchParams(filters).toString();
    const url = `${apiUrl}/api/transaction/report-generation?${queryParams}`;

    // Send a GET request to the server
    const response = await fetch(url, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction report: ${response.statusText}`);
    }

    const data = await response.json();

    return data; 
  } catch (error) {
    console.error('Error fetching transaction report:', error);
    throw error;
  }
};


// Apply corrections to a voucher
export const applyVoucherCorrection = async (voucherNumber, correctionData) => {
  const token = localStorage.getItem('authToken'); 

  try {
    const response = await fetch(`${apiUrl}/api/voucher/${voucherNumber}/correction`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify(correctionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error applying voucher correction:', errorData);
      throw new Error('Failed to apply voucher correction');
    }

    const data = await response.json();
    return data; 
  } catch (error) {
    console.error('Error applying voucher correction:', error);
    throw new Error('Failed to apply voucher correction');
  }
};
