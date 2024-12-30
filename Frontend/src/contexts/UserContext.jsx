import React, { createContext, useState, useEffect } from "react";
import jwtDecode from 'jwt-decode'; 

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [staffCode, setStaffCode] = useState(null);  // Set state as staffCode
  const [userrole, setUserrole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);  // Use the decode method
        setStaffCode(decodedToken.staff_code);  // Set staffCode from the decoded token
        setUserrole(decodedToken.role);  // Set userrole from the decoded token
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("authToken");  // Clear invalid token
      }
    }
  }, []);

  const logout = () => {
    setStaffCode(null);
    setUserrole(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("activeLink");
  };

  return (
    <UserContext.Provider
      value={{ staffCode, setStaffCode, userrole, setUserrole, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
