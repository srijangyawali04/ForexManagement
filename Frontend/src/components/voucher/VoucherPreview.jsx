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
  const { authState } = useAuth(); // Access the authState from context
  const apiUrl = import.meta.env.VITE_API_URL;

  // Log authState to check if it's correctly populated
  useEffect(() => {
    console.log('AuthState:', authState); // Check if the logged-in user data is available
  }, [authState]);

  const handleGenerateVoucher = async () => {
    try {
      // Log voucher data before generation for debugging
      console.log('Voucher data before generation:', voucher); // Log voucher data before generating
  
      if (!authState || !authState.staffName) {
        throw new Error('User not authenticated or required user details are missing.');
      }
  
      // Ensure voucher and customer details are populated and correct
      if (!voucher || !voucher.customer || !voucher.customer.name) {
        throw new Error('Voucher data is missing customer details.');
      }
  
      // Ensure `itrs_code` is a number
      const itrsCode = voucher?.customer?.itrsCode ? Number(voucher.customer.itrsCode) : null;
  
      // Logging the voucher data being sent to the backend for debugging
      const voucherData = {
        customer_name: voucher?.customer?.name || '', // Corrected field path
        customer_address: voucher?.customer?.address || '', // Corrected field path
        mobile_number: voucher?.customer?.mobileNo || '', // Corrected field path
        passport_number: voucher?.customer?.passportNo || '', // Corrected field path
        itrs_code: itrsCode || '', // Corrected field path to ensure it's a number
        voucher_status: "Pending", // Ensure this is set as per the required value
        voucher_number: voucher?.voucherNo || null, // Match with the column name `voucher_number`
        travel_order_ref_number: voucher?.travel_order_ref_number || null,
        voucher_cancellation: voucher?.voucher_cancellation || null,
        createdBy: authState.staffName,
        verifiedBy: "Pending",
        transactions: voucher?.transactions || [] // Add transactions here
      };
  
      console.log('Sending voucher and transactions data to backend:', voucherData); // Log data before sending
  
      const response = await axios.post(`${apiUrl}/api/voucher`, voucherData);
  
      console.log('Voucher and transactions generated successfully:', response.data);
  
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
          <VoucherTemplate voucher={{ ...voucher, createdBy: authState?.staffName }} />
        </div>

        {/* Button to update voucher */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => handleUpdateVoucher(voucher)}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-500"
          >
            Update Voucher
          </button>
        </div>
      </div>
    </div>
  );
}
