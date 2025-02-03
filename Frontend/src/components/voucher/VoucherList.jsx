import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchLoggedInUser, fetchVouchers, updateVoucherStatus } from '../../services/api';
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
  const [vouchersPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [voucherStatus, setVoucherStatus] = useState('');
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', voucherNumber: null });
  const [previewedVoucher, setPreviewedVoucher] = useState(null); // Added to track previewed voucher


  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await fetchLoggedInUser();
        setLoggedInUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch vouchers from the backend
  // Fetch vouchers from the backend
  useEffect(() => {
    const fetchVoucherData = async () => {
      try {
        const data = await fetchVouchers();
        let filteredData = data.data || [];

        // If the logged-in user is a Creator, filter vouchers created by them
        if (loggedInUser?.role === 'Creator') {
          filteredData = filteredData.filter(voucher => voucher.createdBy === loggedInUser.staff_code);
        }

        setVouchers(filteredData);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      }
    };

    fetchVoucherData();
  }, [loggedInUser]); // Add loggedInUser as a dependency

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
  

  const handleVoucherClick = (voucher) => {
    setPreviewedVoucher(voucher.voucher_number);
    setSelectedVoucher(voucher);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setSelectedVoucher(null);
    setIsPreviewOpen(false);
  };

  const handleActionConfirm = async () => {
    if (!confirmAction.voucherNumber) return;

    try {
      if (confirmAction.type === 'verify') {
        await updateVoucherStatus(confirmAction.voucherNumber, 'verify', loggedInUser);
        onVerify(confirmAction.voucherNumber, loggedInUser.staff_name);
      } else if (confirmAction.type === 'cancel') {
        await updateVoucherStatus(confirmAction.voucherNumber, 'cancel', loggedInUser);
      }
      window.location.reload();
    } catch (error) {
      console.error(`Error ${confirmAction.type}ing voucher:`, error);
    } finally {
      setConfirmAction({ show: false, type: '', voucherNumber: null });
    }
  };

  const isVerifier = loggedInUser?.role === 'Verifier';

  const indexOfLastVoucher = currentPage * vouchersPerPage;
  const indexOfFirstVoucher = indexOfLastVoucher - vouchersPerPage;
  const currentVouchers = filteredVouchers.slice(indexOfFirstVoucher, indexOfLastVoucher);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const handleSearch = (query) => {
    const searchNumber = query ? parseInt(query, 10) : '';
    if (searchNumber) {
      const filtered = vouchers.filter((voucher) => voucher.voucher_number === searchNumber);
      setFilteredVouchers(filtered);
    } else {
      setFilteredVouchers(vouchers);
    }
  };

  const handleFilter = (status) => {
    if (status) {
      const filtered = vouchers.filter((voucher) => voucher.voucher_status === status);
      setFilteredVouchers(filtered);
    } else {
      setFilteredVouchers(vouchers);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Voucher List</h2>

      <VoucherFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
        vouchers={vouchers}
        filteredVouchers={filteredVouchers}
      />

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Voucher Number</th>
            <th className="px-4 py-2 text-center">Customer Name</th>
            <th className="px-4 py-2 text-center">Created By</th>
            <th className="px-4 py-2 text-center">Created On</th>
            <th className="px-4 py-2 text-center">Voucher Status</th>
            <th className="px-4 py-2 text-center">Verified/Canceled By</th>
            <th className="px-4 py-2 text-center">Verified/Canceled On</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVouchers.map((voucher) => (
            <tr key={voucher.voucher_number} className="border-t border-gray-200">
              <td className="px-4 py-2 text-center">{voucher.voucher_number}</td>
              <td className="px-4 py-2 text-left">{voucher.customer_name}</td>
              <td className="px-4 py-2 text-center">{voucher.createdBy}</td>
              <td className="px-4 py-2 text-center">{new Date(voucher.voucher_date).toLocaleString()}</td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`px-1 py-1  rounded-full text-sm flex items-center justify-center whitespace-nowrap ${
                    voucher.voucher_status === 'Verified'
                      ? 'bg-green-100 text-green-800'
                      : voucher.voucher_status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : voucher.voucher_status === 'Canceled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {voucher.voucher_status === 'Verified' ? (
                    <CheckCircle size={16} className="mr-1" />
                  ) : voucher.voucher_status === 'Pending' ? (
                    <Clock size={16} className="mr-1" />
                  ) : voucher.voucher_status === 'Canceled' ? (
                    <XCircle size={16} className="mr-1" />
                  ) : (
                    '-'
                  )}
                  {voucher.voucher_status}
                </span>
              </td>
              <td className="px-4 py-2 text-center">
                {voucher.voucher_status === 'Verified' || voucher.voucher_status === 'Canceled'
                  ? voucher.updatedBy
                  : '-'}
              </td>
              <td className="px-4 py-2 text-center">
                {voucher.voucher_status === 'Verified' || voucher.voucher_status === 'Canceled'
                  ? new Date(voucher.updatedAt).toLocaleString()
                  : '-'}
              </td>
              <td className="px-4 py-2 text-center space-x-1">
                <button
                  onClick={() => handleVoucherClick(voucher)}
                  className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md shadow hover:bg-blue-600 transition duration-200"
                >
                  Preview
                </button>

                {isVerifier && voucher.voucher_status === 'Pending' && (
                  <>
                    <button
                      onClick={() =>
                        setConfirmAction({
                          show: true,
                          type: 'verify',
                          voucherNumber: voucher.voucher_number,
                        })
                      }
                      disabled={previewedVoucher !== voucher.voucher_number} // Disable if not previewed
                      className={`text-sm px-3 py-1 rounded-md shadow transition duration-200 ${
                        previewedVoucher === voucher.voucher_number
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Verify
                    </button>
                    <button
                      onClick={() =>
                        setConfirmAction({
                          show: true,
                          type: 'cancel',
                          voucherNumber: voucher.voucher_number,
                        })
                      }
                      disabled={previewedVoucher !== voucher.voucher_number} // Disable if not previewed
                      className={`text-sm px-3 py-1 rounded-md shadow transition duration-200 ${
                        previewedVoucher === voucher.voucher_number
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredVouchers.length / vouchersPerPage)}
        onPageChange={handlePageChange}
      />

      {isPreviewOpen && selectedVoucher && (
        <VoucherPreview
          voucher={selectedVoucher}
          onClose={handleClosePreview}
          onPrint={() => window.print()}
          onGenerate={() => console.log('Generate logic here')}
          showGenerateButton={false}
        />
      )}

      {confirmAction.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Action</h2>
            <p className="mb-6">Are you sure you want to {confirmAction.type} this voucher?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setConfirmAction({ show: false, type: '', voucherNumber: null })}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleActionConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherList;
