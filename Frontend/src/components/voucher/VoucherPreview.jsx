import React from 'react';
import { useState, useEffect } from 'react';
import { VoucherTemplate } from './VoucherTemplate';
import { useAuth } from '../../contexts/AuthContext';
import { fetchLoggedInUser, updateVoucherStatus } from '../../services/api';
import axios from 'axios';

export function VoucherPreview({
  voucher,
  onClose,
  onPrint,
  onGenerate,
  showGenerateButton = false,
  onRefresh 
}) {
  const { authState } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isVerified, setIsVerified] = useState(voucher?.voucher_status === "Verified");
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    type: '', 
    voucherNumber: null, 
  });

  
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

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

  const handleGenerateVoucher = async () => {
    try {
      if (!authState || !authState.staffName) {
        throw new Error('User not authenticated or required user details are missing.');
      }

      if (!voucher || !voucher.customer || !voucher.customer.name) {
        throw new Error('Voucher data is missing customer details.');
      }

      const itrsCode = voucher?.customer?.itrsCode ? Number(voucher.customer.itrsCode) : null;

      console.log("Voucher data before sending to API:", voucher); 

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
      console.log("API response:", response.data); 

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

  

  const handleConfirmGenerateVoucher = () => {
    setConfirmAction({
      show: true,
      type: 'submit',
      voucherNumber: null, 
    });
  };

  const handleVerifyVoucher = async () => {
    const voucherNumber = confirmAction.voucherNumber;
    if (!voucherNumber) return;
  
    try {
      await updateVoucherStatus(voucherNumber, "verify", loggedInUser);
      setConfirmAction({ show: false, type: "", voucherNumber: null });
      alert("Voucher verified successfully!");
      onClose(); 
      if (onRefresh) onRefresh(); 
    } catch (error) {
      console.error("Error verifying voucher:", error);
      alert("Failed to verify voucher.");
    }
  };
  
  const handleCancelVoucher = async () => {
    if (!confirmAction.voucherNumber) return;
  
    try {
      await updateVoucherStatus(confirmAction.voucherNumber, "cancel", loggedInUser);
      alert("Voucher canceled successfully!");
      onClose(); 
      if (onRefresh) onRefresh(); 
    } catch (error) {
      console.error("Error canceling voucher:", error);
      alert("Failed to cancel voucher.");
    } finally {
      setConfirmAction({ show: false, type: "", voucherNumber: null });
    }
  };
  
  const handleEditVoucher = async () => {
    if (!confirmAction.voucherNumber) return;
  
    try {
      await updateVoucherStatus(confirmAction.voucherNumber, "edit", loggedInUser);
      alert("Voucher sent for edit successfully!");
      setConfirmAction({ show: false, type: "", voucherNumber: null });
      onClose(); 
      if (onRefresh) onRefresh(); 
    } catch (error) {
      console.error("Failed to update voucher status:", error);
      alert("Failed to send voucher for edit.");
    }
  };
  

  console.log("Voucher data before rendering:", voucher);

  const isVoucherVerified = isVerified;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 modal-overlay" onClick={handleOutsideClick}>
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
                    {confirmAction.type === "submit"
                      ? "Are you sure you want to submit the voucher?"
                      : confirmAction.type === "verify"
                      ? "Are you sure you want to verify this voucher?"
                      : confirmAction.type === "cancel"
                      ? "Are you sure you want to cancel this voucher?"
                      : "Are you sure you want to send this voucher for correction?"}
                  </h3>
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setConfirmAction({ show: false, type: "", voucherNumber: null })}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      No
                    </button>
                    <button
                      onClick={() => {
                        setConfirmAction({ show: false, type: "", voucherNumber: null }); // Close the dialog
                        if (confirmAction.type === "submit") {
                          handleGenerateVoucher();
                        } else if (confirmAction.type === "verify") {
                          handleVerifyVoucher(confirmAction.voucherNumber);
                        } else if (confirmAction.type === "cancel") {
                          handleCancelVoucher(confirmAction.voucherNumber);
                        } else if (confirmAction.type === "edit") {
                          handleEditVoucher(confirmAction.voucherNumber);
                        }
                      }}
                      className={`px-4 py-2 rounded-md text-white ${
                        confirmAction.type === "submit"
                          ? "bg-blue-600 hover:bg-blue-500"
                          : confirmAction.type === "verify"
                          ? "bg-green-500 hover:bg-green-600"
                          : confirmAction.type === "cancel"
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            )}


            {/* Show Verify, Cancel, and Edit Request buttons only for Verifier */}
            {authState.role === "Verifier" && voucher.voucher_status === "Pending" && !isVoucherVerified && (
              <>
                <button
                  onClick={() =>
                    setConfirmAction({
                      show: true,
                      type: "verify",
                      voucherNumber: voucher.voucher_number,
                    })
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded-md shadow hover:bg-green-600"
                >
                  Verify
                </button>
                
                <button
                  onClick={() =>
                    setConfirmAction({
                      show: true,
                      type: "cancel",
                      voucherNumber: voucher.voucher_number,
                    })
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded-md shadow hover:bg-red-600"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    setConfirmAction({
                      show: true,
                      type: "edit",
                      voucherNumber: voucher.voucher_number,
                    })
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded-md shadow hover:bg-yellow-600"
                >
                  Send for Correction
                </button>
              </>
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
                disabled={!isVoucherVerified} 
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
