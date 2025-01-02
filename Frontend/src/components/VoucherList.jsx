import React, { useState } from 'react';
import { CheckCircle, Clock, Printer } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { VoucherPreview } from './voucher/VoucherPreview';
import { formatAmount } from '../utils/voucherUtils';

const VoucherList = ({ vouchers, onVerify }) => {
  const { user } = useAuth();
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const handlePreview = (voucher) => {
    console.log('Preview clicked for voucher:', voucher); // Debugging log
    setSelectedVoucher(voucher);
  };

  const handlePrint = () => {
    console.log('Print clicked'); // Debugging log
    window.print();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Voucher List</h2>
      <div className="grid gap-4">
        {vouchers.map((voucher) => (
          <div key={voucher.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">#{voucher.voucherNo}</span>
                  <span className="text-sm text-gray-500">({voucher.type})</span>
                </div>
                <div className="text-lg font-semibold">
                  NPR {formatAmount(voucher.totalAmount)}
                </div>
                <div className="text-sm text-gray-500">
                  Created by {voucher.createdBy} on {new Date(voucher.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-sm ${
                    voucher.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {voucher.status === 'verified' ? <CheckCircle size={16} /> : <Clock size={16} />}
                  <span className="capitalize">{voucher.status}</span>
                </div>
                <button
                  onClick={() => handlePreview(voucher)}  // Log added here
                  className="bg-indigo-100 text-indigo-700 p-1 rounded-md hover:bg-indigo-200"
                  title="Preview Voucher"
                >
                  <Printer size={20} />
                </button>
                {user?.role === 'verifier' && voucher.status === 'pending' && (
                  <button
                    onClick={() => onVerify(voucher.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-500 text-sm"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Debugging if selectedVoucher exists */}
      {selectedVoucher && (
        <VoucherPreview
          voucher={selectedVoucher}
          onClose={() => {
            console.log('Closing the voucher preview');
            setSelectedVoucher(null);
          }}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default VoucherList;
