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
  const handleFilter = (status) => {
    if (status) {
      const filtered = vouchers.filter((voucher) => voucher.voucher_status === status);
      setFilteredVouchers(filtered); // Update filtered vouchers based on status
    } else {
      setFilteredVouchers(vouchers); // Reset to all vouchers if no filter is selected
    }
  };

  // Render the voucher list in a table format
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

      {/* Table to display vouchers */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Voucher Number</th>
            <th className="px-4 py-2 text-center">Customer Name</th>
            <th className="px-4 py-2 text-center">Created By</th>
            <th className="px-4 py-2 text-center">Created On</th>
            <th className="px-4 py-2 text-center">Voucher Status</th>
            <th className="px-4 py-2 text-center">Verified By</th>
            <th className="px-4 py-2 text-center">Verified On</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVouchers.map((voucher) => (
            <tr key={voucher.voucher_number} className="border-t border-gray-200">
              <td className="px-4 py-2 text-center">{voucher.voucher_number}</td>
              <td className="px-4 py-2 text-center">{voucher.customer_name}</td>
              <td className="px-4 py-2 text-center">{voucher.createdBy}</td>
              <td className="px-4 py-2 text-center">{new Date(voucher.voucher_date).toLocaleString()}</td>
              <td className="px-4 py-2 text-center">
                {/* Conditional rendering for Voucher Status */}
                <span
                  className={`px-2 py-1 rounded-full text-sm flex items-center justify-center whitespace-nowrap ${
                    voucher.voucher_status === 'Verified'
                      ? 'bg-green-100 text-green-800'
                      : voucher.voucher_status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {voucher.voucher_status === 'Verified' ? (
                    <CheckCircle size={16} className="mr-1" />
                  ) : voucher.voucher_status === 'Pending' ? (
                    <Clock size={16} className="mr-1" />
                  ) : (
                    '-'
                  )}
                  {voucher.voucher_status}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                {voucher.voucher_status === 'Verified' ? voucher.verifiedBy : '-'}
              </td>
              <td className="px-4 py-2 text-center">
                {voucher.voucher_status === 'Verified' ? new Date(voucher.verifiedAt).toLocaleString() : '-'}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>


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
          onGenerate={() => console.log('Generate logic here')}
          showGenerateButton={false}
        />
      )}
    </div>
  );
};

export default VoucherList;
