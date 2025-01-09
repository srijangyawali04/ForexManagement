// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import logo from "../assets/logo.png";
// import { useFormData } from "../contexts/formDataContext";

// const PrintTemplate = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { voucherEntries, rateType, currencies, currentDate } =
//     location.state || {};
//   const { formData } = useFormData();

//   // Calculate total NPR amount
//   const totalNprAmount = voucherEntries?.reduce(
//     (total, entry) => total + entry.nprAmount,
//     0
//   );

//   // Render a single voucher copy
//   const renderVoucherCopy = (copyType) => (
//     <div className="p-5">
//       <div className="flex items-center mb-8">
//         <img src={logo} alt="Logo" className="w-20 h-20 mr-4" />
//         <h2 className="text-left flex flex-col justify-center my-auto">
//           <span className="text-xl font-bold">Nepal Rastra Bank</span>
//           <span className="text-lg font-medium">Banking Department</span>
//           <span className="text-mb font-light">Remittance Section</span>
//         </h2>
//         <div className="flex items-end flex-col ml-auto justify-center space-y-2">
//           <span className="border-2 border-dashed border-black text-left px-2 py-2 w-[57]">
//             {copyType}
//           </span>
//           <div className="flex items-center text-right space-x-2">
//             <span>Voucher Receipt No: </span>
//             <div>{formData.voucherReceiptNo || "N/A"}</div>
//           </div>
//           <span className="text-right">Date: {currentDate}</span>
//         </div>
//       </div>

//       <table className="w-full table-auto mb-4 text-sm">
//         <thead>
//           <tr>
//             <th colSpan="3" className="px-2 w-[50%] font-medium border border-black text-left">
//               <div className="flex items-center">
//                 <div>Customer Name:</div>
//                 <div className="px-2">{formData.customerName || "N/A"}</div>
//               </div>
//             </th>
//             <th colSpan="1" className="px-2 w-[27.5%] font-medium border border-black text-left">
//               <div className="flex items-center">
//                 <div>Contact No:</div>
//                 <div className="px-2">{formData.contactNumber || "N/A"}</div>
//               </div>
//             </th>
//             <th colSpan="1" className="px-2 font-medium border border-black text-left">
//               <div className="flex items-center">
//                 <div>ITRS Code:</div>
//                 <div className="px-2">{formData.irtsCode || "N/A"}</div>
//               </div>
//             </th>
//           </tr>
//         </thead>

//         <thead>
//           <tr>
//             <th colSpan="3" className="px-2 font-medium border border-black text-left">
//               <div className="flex items-center">
//                 <div>ID/Passport No:</div>
//                 <div className="px-2">{formData.idPassportNo || "N/A"}</div>
//               </div>
//             </th>
//             <th colSpan="2" className="px-2 font-medium border border-black text-left">
//               <div className="flex items-center">
//                 Exchange Type:
//                 <div className="px-2">{rateType === "buy" ? "Buy" : "Sell"}</div>
//               </div>
//             </th>
//           </tr>
//         </thead>

//         <thead>
//           <tr>
//             <th className="font-medium border border-black text-left px-2 py-1">S.N</th>
//             <th className="font-medium border border-black text-left px-2 py-1">Account Heads</th>
//             <th className="font-medium border border-black text-left px-2 py-1">Exchange Rate</th>
//             <th className="font-medium border border-black text-left px-2 py-1">Foreign Currency</th>
//             <th className="font-medium border border-black text-left px-2 py-1">NPR</th>
//           </tr>
//         </thead>

//         <tbody>
//           {voucherEntries?.map((entry, index) => (
//             <tr key={index}>
//               <td className="border border-black text-left px-2 py-1">{index + 1}</td>
//               <td className="border border-black text-left px-2 py-1">
//                 {currencies.find((currency) => currency.iso3 === entry.selectedCurrency)?.name || "N/A"}
//               </td>
//               <td className="border border-black text-left px-2 py-1">
//                 {entry.exchangeRate ? entry.exchangeRate.toFixed(2) : "N/A"}
//               </td>
//               <td className="border border-black text-left px-2 py-1">
//                 {entry.foreignCurrencyAmount || "N/A"}
//               </td>
//               <td className="border border-black text-left px-2 py-1">{entry.nprAmount.toFixed(2)}</td>
//             </tr>
//           ))}
//           <tr>
//             <td colSpan="4" className="font-bold text-right border border-black px-2 py-1">
//               Total NPR:
//             </td>
//             <td className="font-bold border border-black px-2 py-1">{totalNprAmount?.toFixed(2)}</td>
//           </tr>
//           <tr>
//             <td colSpan="5" className="px-2 w-[27.5%] font-medium border border-black text-left">
//               <div className="flex items-center">
//                 Amount in Words:
//                 <div className="px-2">{formData.amountinWord || "N/A"}</div>
//               </div>
//             </td>
//           </tr>
//         </tbody>
//       </table>

//       <div className="mt-4 flex justify-between">
//         <div className="w-1/3 text-left">
//           <p className="border-t border-black w-full mt-8 pt-2 text-left">Prepared By</p>
//           <div className="px-2">{formData.preparedBy || "N/A"}</div>
//         </div>
//         <div className="w-1/3 text-left">
//           <p className="border-t border-black w-full mt-8 pt-2 text-left">Verified By</p>
//           <div className="px-2">{formData.verifiedBy || "N/A"}</div>
//         </div>
//       </div>

//       {copyType === "Customer Copy" && (
//         <div className="mt-8 text-left text-xs ">
//           <div className="font-semibold"><p>Notes</p></div>
//           <p className="">
//             *Validity of this voucher is for the same date only.
//           </p>
//           <p className="">
//             **This is only an exchange voucher and cannot be presented as an invoice as it doesn't carry any legal obligations.
//           </p>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="container mx-auto p-10 box-border">
//       {/* Buttons */}
//       <div className="mb-5 flex justify-end gap-3 print:hidden">
//         <button
//           onClick={() => window.print()}
//           className="bg-green-500 text-white p-2 rounded"
//         >
//           Print Voucher
//         </button>
//         <button
//           onClick={() => navigate(-1)}
//           className="bg-blue-500 text-white p-2 rounded"
//         >
//           Back
//         </button>
//       </div>

//       {/* Office Copy */}
//       {renderVoucherCopy("Office Copy")}

//       {/* Dotted Line */}
//       <div className="border-t border-dotted border-black my-4"></div>

//       {/* Customer Copy */}
//       {renderVoucherCopy("Customer Copy")}
//     </div>
//   );
// };

// export default PrintTemplate;
