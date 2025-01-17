import React, { useEffect } from 'react';
import { VoucherTemplate } from './VoucherTemplate';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

export function VoucherPreview({
  voucher,
  onClose,
  onPrint,
  onGenerate,
  showGenerateButton = false
}) {
  const { authState } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleGenerateVoucher = async () => {
    try {
      if (!authState || !authState.staffName) {
        throw new Error('User not authenticated or required user details are missing.');
      }

      if (!voucher || !voucher.customer || !voucher.customer.name) {
        throw new Error('Voucher data is missing customer details.');
      }

      const itrsCode = voucher?.customer?.itrsCode ? Number(voucher.customer.itrsCode) : null;

      const voucherData = {
        customer_name: voucher?.customer?.name || '',
        customer_address: voucher?.customer?.address || '',
        mobile_number: voucher?.customer?.mobileNo || '',
        passport_number: voucher?.customer?.passportNo || '',
        itrs_code: itrsCode || '',
        voucher_status: "Pending",
        voucher_number: voucher?.voucherNo || null,
        travel_order_ref_number: voucher?.travel_order_ref_number || null,
        voucher_cancellation: voucher?.voucher_cancellation || null,
        createdBy: authState.staffCode,
        verifiedBy: "Pending",
        transactions: voucher?.transactions || []
      };

      const response = await axios.post(`${apiUrl}/api/voucher`, voucherData);
      if (onGenerate) {
        onGenerate();
      }

      alert('Voucher and transactions generated and saved successfully!');
    } catch (error) {
      console.error('Failed to generate voucher:', error);
      const errorMessage = error.response ? error.response.data.message : error.message;
      alert(`Failed to generate voucher. Error: ${errorMessage}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Voucher Preview</h2>
          <div className="space-x-2">
            {showGenerateButton && (
              <button
                onClick={handleGenerateVoucher}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500"
              >
                Generate Voucher
              </button>
            )}
            <button
              onClick={onPrint}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
            >
              Print
            </button>
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-6">
          {/* Ensure the full voucher data including customer and voucherType are passed */}
          <VoucherTemplate voucher={{ ...voucher, createdBy: authState?.staffName }} />
        </div>

        {/* <div className="flex justify-end p-4">
          <button
            onClick={() => handleUpdateVoucher(voucher)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-500"
          >
            Update Voucher
          </button>
        </div> */}
      </div>
    </div>
  );
}
