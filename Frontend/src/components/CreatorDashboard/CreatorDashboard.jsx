import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import VoucherForm from '../voucher/VoucherForm';
import VoucherList from '../voucher/VoucherList';
import { VoucherPreview } from '../voucher/VoucherPreview';
import { fetchLoggedInUser } from '../../services/api';
import ExchangeRatesTable from '../ExchangeRateTable/ExchangeRatesTable';
const CreatorDashboard = () => {
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
  }, [loggedInUser]);

  const handleCreateVoucher = (voucher) => {
    setVouchers((prevVouchers) => [...prevVouchers, { id: Date.now().toString(), ...voucher }]);
    setView('list');
  };

  const handleVerifyVoucher = (voucherId) => {
    setVouchers((prevVouchers) =>
      prevVouchers.map((v) => (v.id === voucherId ? { ...v, status: 'verified' } : v))
    );
  };

  const handlePreviewVoucher = (voucher) => {
    setSelectedVoucher(voucher);
    setShowPreview(true);
  };

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
            <h1 className="text-xl font-bold">Forex Management System</h1>
            {authState.staffCode && (
              <div className="text-sm">
                <span className="opacity-75">Welcome,</span>{' '}
                <span className="font-semibold">{loggedInUser?.staff_name}</span>{' '}
                <span className="bg-indigo-500 px-2 py-1 rounded-full text-xs">
                  {authState.role}
                </span>
              </div>
            )}
          </div>
          {authState.token && (
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-400 px-4 py-2 rounded-lg transition-colors"
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
        <button
          className={`px-4 py-2 rounded ${view === 'form' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setView('form')}
        >
          Create Voucher
        </button>
      </div>

      {/* Content */}
      <div className="container mx-auto mt-6">
        {view === 'list' && (
          <VoucherList
            vouchers={vouchers}
            onVerify={handleVerifyVoucher}
            onPreview={handlePreviewVoucher} // Pass the preview function here
          />
        )}
        {view === 'form' && <VoucherForm onSubmit={handleCreateVoucher} />}
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

export default CreatorDashboard;
