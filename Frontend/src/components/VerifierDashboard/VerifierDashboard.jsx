import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import VoucherForm from '../voucher/VoucherForm';
import VoucherList from '../voucher/VoucherList';
import { VoucherPreview } from '../voucher/VoucherPreview';
import { fetchLoggedInUser, updateVoucherStatus , fetchVouchers } from '../../services/api'; // Import necessary functions
import ExchangeRatesTable from '../ExchangeRateTable/ExchangeRatesTable';


const VerifierDashboard = () => {
  const { authState, logout } = useAuth();
  const [view, setView] = useState('list');
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const userInfo = await fetchLoggedInUser();
        setLoggedInUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch logged-in user:', error);
      }
    };

    if (!loggedInUser) {
      getUserInfo();
    }

    // Fetch vouchers when the component loads
    fetchVouchersData();
  }, [loggedInUser]);

  // Fetch the vouchers from the backend
  const fetchVouchersData = async () => {
    try {
      const fetchedVouchers = await fetchVouchers();
      setVouchers(fetchedVouchers); // Update state with fetched vouchers
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  // Handle verifying a voucher
  const handleVerifyVoucher = async (voucherNumber) => {
    if (!loggedInUser) {
      console.error('Logged-in user not found');
      return; // Return early if logged-in user is not available
    }

    try {
      // Ensure loggedInUser has the necessary staff_name field
      if (!loggedInUser.staff_name) {
        throw new Error('Logged-in user does not have staff_name');
      }

      const updatedVoucher = await updateVoucherStatus(voucherNumber, 'Verified', loggedInUser);
    } catch (error) {
      console.error('Failed to verify voucher:', error);
    }
  };


  // Handle previewing a voucher
  const handlePreviewVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowPreview(true);
  };

  // Handle closing the preview modal
  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedVoucher(null);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-indigo-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Remitance Voucher Generation System</h1>
            {authState.staffCode && (
              <div className="text-sm">
                <span className="opacity-75">Welcome,</span>{' '}
                <span className="font-semibold">{loggedInUser?.staff_name}</span>{' '}
                <span className="bg-indigo-500 px-2 py-1 rounded-full text-xs">
                  {authState.role}
                </span>
                <span className="font-bold text-base ml-10">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
          {authState.token && (
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* Navigation */}
      <div className="container mx-auto mt-4 space-x-4">
        <button
          className={`px-4 py-2 rounded ${view === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('list')}
        >
          View Vouchers
        </button>
        <button
          className={`px-4 py-2 rounded ${view === 'exchangeRates' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('exchangeRates')}
        >
          Exchange Rates
        </button>
      </div>

      {/* Content */} 
      <div className="container mx-auto mt-6">
        {view === 'list' && (
          <VoucherList
            vouchers={vouchers}
            onVerify={handleVerifyVoucher} // Pass the verify handler to VoucherList
            onPreview={handlePreviewVoucher} // Pass the preview handler
          />
        )}
        {view === 'exchangeRates' && <ExchangeRatesTable />}

      </div>

      {/* Voucher Preview */}
      {showPreview && selectedVoucher && (
        <VoucherPreview
          voucher={selectedVoucher}
          onClose={handleClosePreview}
          onPrint={() => window.print()}
        />
      )}
    </>
  );
};

export default VerifierDashboard;
