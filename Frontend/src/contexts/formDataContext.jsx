import React, { createContext, useContext, useState } from "react";
import Voucher from "../pages/Voucher";

// Create a Context
const FormDataContext = createContext();

// Create a Provider Component
export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    irtsCode: "",
    idPassportNo: "",
    voucherReceiptNo:"",
    amountinWord:"",
    preparedBy:"",
    verifiedBy:"",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <FormDataContext.Provider value={{ formData, handleInputChange }}>
      {children}
    </FormDataContext.Provider>
  );
};

// Custom Hook to Use Context
export const useFormData = () => useContext(FormDataContext);
