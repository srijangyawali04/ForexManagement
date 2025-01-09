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
      // Ensure authState contains necessary details
      if (!authState || !authState.staffName || !authState.staffCode) {
        throw new Error('User not authenticated or required user details are missing.');
      }
  
      // Prepare the voucher data, ensuring createdBy is set to staffName
      const voucherData = {
        ...voucher,
        createdBy: authState.staffName, // Use staffName here
        staffCode: authState.staffCode, // Ensure staffCode is included
        // Do not include createdAt, it will be handled by the database automatically
      };
  
      // Log the data to be sent (for debugging)
      console.log('Voucher Data:', voucherData);
  
      // Call the backend API to save the voucher
      const response = await axios.post(`${apiUrl}/api/voucher`, voucherData);
  
      console.log('Voucher generated successfully:', response.data);
  
      // Trigger the onGenerate callback if provided
      if (onGenerate) {
        onGenerate();
      }
  
      alert('Voucher generated and saved successfully!');
    } catch (error) {
      console.error('Failed to generate voucher:', error);
  
      // Check if error response contains a message from the backend
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
          <VoucherTemplate voucher={{ ...voucher, createdBy: authState.staffName }} />
        </div>
      </div>
    </div>
  );
}
