import React from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Voucher from "./components/Voucher";
import PrintTemplate from "./components/PrintTemplate";
import LoginPage from "./components/LoginPage"; // Import LoginPage
import "./components/Voucher.css";
import { FormDataProvider } from "./contexts/formDataContext";

function App() {
  return (
    <FormDataProvider>
      {/* Navigation Bar */}
      <nav>
        <Link to="/login" style={{ marginRight: "10px", textDecoration: "none" }}>
          Login
        </Link>
        <Link to="/" style={{ marginRight: "10px", textDecoration: "none" }}>
          Voucher
        </Link>
        <Link to="/print-template" style={{ textDecoration: "none" }}>
          Print Template
        </Link>
      </nav>

      {/* Application Routes */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Voucher />} />
        <Route path="/print-template" element={<PrintTemplate />} />
      </Routes>
    </FormDataProvider>
  );
}

export default App;
