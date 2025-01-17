import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { fetchLoggedInUser, fetchVouchers } from '../../services/api';
import { VoucherPreview } from './VoucherPreview';
import VoucherFilter from './VoucherFilter';
import Pagination from '../AdminDashboard/Pagination';

const VoucherList = ({ onVerify }) => {
  const [vouchers, setVouchers] = useState([]);
  const [filteredVouchers, setFilteredVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchersPerPage] = useState(10); // Set the number of vouchers per page
  const [searchQuery, setSearchQuery] = useState('');
  const [voucherStatus, setVoucherStatus] = useState('');

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await fetchLoggedInUser();
        setLoggedInUser(userInfo); // Set logged-in user information
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch vouchers from the backend
  useEffect(() => {
    const fetchVoucherData = async () => {
      try {
        const data = await fetchVouchers(); // Call fetchVouchers to get the data
        setVouchers(data.data || []); // Ensure that data is in the expected format
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVoucherData();
  }, []);

  // Combine search query and status filter
  useEffect(() => {
    let filtered = vouchers;

    if (searchQuery) {
      filtered = filtered.filter(
        (voucher) =>
          voucher.voucher_number.toString().includes(searchQuery.toString()) ||
          voucher.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (voucherStatus) {
      filtered = filtered.filter((voucher) => voucher.voucher_status === voucherStatus);
    }

    setFilteredVouchers(filtered);
    setCurrentPage(1); // Reset to page 1 when filter or search changes
  }, [searchQuery, voucherStatus, vouchers]);

  // Handle voucher click for preview
  const handleVoucherClick = (voucher) => {
    setSelectedVoucher(voucher); // Set the selected voucher
    setIsPreviewOpen(true); // Open the preview modal
  };

  // Handle closing the preview modal
  const handleClosePreview = () => {
    setSelectedVoucher(null); // Clear the selected voucher
    setIsPreviewOpen(false); // Close the modal
  };

  // Handle verify button click
  const handleVerify = (voucherNumber) => {
    const verificationDate = new Date().toLocaleString();
    onVerify(voucherNumber, loggedInUser.staff_name, verificationDate);
    window.location.reload();
  };

  // Check if the logged-in user is a verifier
  const isVerifier = loggedInUser?.role === 'Verifier';

  // Get the vouchers to display on the current page
  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = filteredVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

  // Handle page change and scroll to top
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top after page change
  };

  // Handle search query change
  const handleSearch = (query) => {
    const searchNumber = query ? parseInt(query, 10) : ''; // Parse query to a number
    
    if (searchNumber) {
      const filtered = vouchers.filter((voucher) => voucher.voucher_number === searchNumber);
      setFilteredVouchers(filtered);
    } else {
      setFilteredVouchers(vouchers); // Reset to all vouchers when search is cleared
    }
  };
  

  // Handle filter by status change
  // Handle filter by status
const handleFilter = (status) => {
  if (status) {
    const filtered = vouchers.filter((voucher) => voucher.voucher_status === status);
    setFilteredVouchers(filtered); // Update filtered vouchers based on status
  } else {
    setFilteredVouchers(vouchers); // Reset to all vouchers if no filter is selected
  }
};


  // Render each voucher with preview and verify functionality
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Voucher List</h2>

      {/* Search and Filter Component */}
      <VoucherFilter
        onSearch={handleSearch}
        onFilter={handleFilter} // Pass the handleFilter function to VoucherFilter
        vouchers={vouchers}   
        filteredVouchers={filteredVouchers} 
      />


      <div className="grid gap-4">
        {currentVouchers.map((voucher) => (
          <div key={voucher.voucher_number} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">#{voucher.voucher_number}</span>
                  <span className="text-sm text-gray-500">({voucher.voucher_status})</span>
                </div>
                <div className="text-lg font-semibold">Customer Name: {voucher.customer_name}</div>
                <div className="text-sm text-gray-500">
                  Created by {voucher.createdBy} on {new Date(voucher.voucher_date).toLocaleString()}
                </div>
              </div>
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                  voucher.voucher_status === 'Verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {voucher.voucher_status === 'Verified' ? <CheckCircle size={16} /> : <Clock size={16} />}
                <span className="capitalize">{voucher.voucher_status}</span>
              </div>
            </div>

            {/* Display Verified By and Date if Verified */}
            {voucher.voucher_status === 'Verified' && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-semibold">Verified By: </span>{voucher.verifiedBy} on {voucher.verifiedAt}
              </div>
            )}

            <div className="flex space-x-4 mt-2">
              {/* Preview Button */}
              <button
                onClick={() => handleVoucherClick(voucher)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Preview
              </button>

              {/* Verify Button (Only visible to Verifier role) */}
              {isVerifier && voucher.voucher_status !== 'Verified' && (
                <button
                  onClick={() => handleVerify(voucher.voucher_number)} // Trigger the verify action
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredVouchers.length / vouchersPerPage)}
        onPageChange={handlePageChange}
      />

      {/* Voucher Preview Modal */}
      {isPreviewOpen && selectedVoucher && (
        <VoucherPreview
          voucher={selectedVoucher}
          onClose={handleClosePreview}
          onPrint={() => window.print()}
          showGenerateButton={false}
        />
      )}
    </div>
  );
};

export default VoucherList;
