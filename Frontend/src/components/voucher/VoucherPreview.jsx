import React from 'react';
import { useState } from 'react';
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

  const [confirmAction, setConfirmAction] = useState({
    show: false,
    type: '', // 'submit' or 'cancel'
    voucherNumber: null, // Optional: Pass a voucher number if needed
  });

  // Function to handle voucher generation
  const handleGenerateVoucher = async () => {
    try {
      if (!authState || !authState.staffName) {
        throw new Error('User not authenticated or required user details are missing.');
      }

      if (!voucher || !voucher.customer || !voucher.customer.name) {
        throw new Error('Voucher data is missing customer details.');
      }

      const itrsCode = voucher?.customer?.itrsCode ? Number(voucher.customer.itrsCode) : null;

      console.log("Voucher data before sending to API:", voucher); // Debug log

      const voucherData = {
        customer_name: voucher?.customer?.name || '',
        voucher_staff_code: voucher?.customer?.voucherStaffCode || null,
        customer_address: voucher?.customer?.address || '',
        mobile_number: voucher?.customer?.mobileNo || '',
        passport_number: voucher?.customer?.passportNo || '',
        ordered_by: voucher?.customer?.ordered || '',
        itrs_code: itrsCode || null,
        visiting_country: voucher?.customer?.visitingCountry || null,
        purpose_of_visit: voucher?.customer?.purposeOfVisit || null,
        source_of_foreign_currency: voucher?.customer?.sourceOfForeignCurrency || null,
        voucher_status: "Pending",
        voucher_number: voucher?.voucherNo || null,
        travel_order_ref_number: voucher?.customer?.travelOrderRef || null,
        voucher_cancellation: voucher?.voucher_cancellation || null,
        createdBy: authState.staffCode,
        verifiedBy: "Pending",
        transactions: voucher?.transactions || [],
      };

      const response = await axios.post(`${apiUrl}/api/voucher`, voucherData);
      console.log("API response:", response.data); // Debug log

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

  // Function to trigger the confirmation dialog
  const handleConfirmGenerateVoucher = () => {
    setConfirmAction({
      show: true,
      type: 'submit',
      voucherNumber: null, // Optional: Pass a voucher number if needed
    });
  };


  // Log the voucher data before rendering
  console.log("Voucher data before rendering:", voucher);

  // Check if the voucher is verified
  const isVoucherVerified = voucher?.voucher_status === "Verified";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Voucher Preview</h2>
          <div className="space-x-2">
            {showGenerateButton && (
              <button
              onClick={handleConfirmGenerateVoucher}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
            >
              Submit Voucher
            </button>
            )}
            {/* Confirmation Dialog */}
            {confirmAction.show && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-medium mb-4">
                    Are you sure you want to submit the voucher?
                  </h3>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setConfirmAction({ show: false, type: '', voucherNumber: null })}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      No
                    </button>
                    <button
                      onClick={() => {
                        setConfirmAction({ show: false, type: '', voucherNumber: null }); // Close the dialog
                        handleGenerateVoucher(); // Call the generate voucher function
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
            {authState.role !== "Creator" && (
              <button
                onClick={onPrint}
                className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 ${!isVoucherVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isVoucherVerified} // Disable print button if voucher is not verified
              >
                Print
              </button>
            )}
          </div>
        </div>
        <div className="p-6">
          <VoucherTemplate voucher={{ ...voucher, createdBy: authState?.staffName }} />
        </div>
      </div>
    </div>
  );
}
