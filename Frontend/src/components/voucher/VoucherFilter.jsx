import React, { useState } from 'react';
import { getVoucherByNumber } from '../../services/api';  

const VoucherFilter = ({ onSearch, onFilter, vouchers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [error, setError] = useState(null);

  // Handle search functionality
  const handleSearch = async () => {
    const query = searchQuery ? parseInt(searchQuery, 10) : '';  
    
    if (query) {
      onSearch(query);  
    } else {
      onSearch('');  
    }
  };

  // Change handle garne
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle filter status change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value); 
    onFilter(e.target.value); 
  };

  // search button
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); 
    }
  };

  return (
    <div className="flex items-center justify-between space-x-4 py-4">
      {/* Search Bar */}
      <div className="flex items-center w-full sm:w-1/4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}  
          onKeyPress={handleKeyPress}   
          placeholder="Search by Voucher Number"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        />
        {/* Simple Search Button */}
        <button 
          onClick={handleSearch} 
          className="ml-2 p-2 border border-gray-300 rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Search
        </button>
      </div>

      {/* Filter Dropdown */}
      <div>
        <select
          value={filterStatus}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
        >
          <option value="">Filter by Status</option>
          <option value="Verified">Verified</option>
          <option value="Pending">Pending</option>
          <option value="Canceled">Canceled</option>
          <option value="Edit">Require Editing</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default VoucherFilter;
