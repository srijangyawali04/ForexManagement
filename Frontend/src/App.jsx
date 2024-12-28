import React from "react";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import Voucher from "./components/Voucher";
import PrintTemplate from "./components/PrintTemplate";
import "./components/Voucher.css";
import { FormDataProvider } from "./contexts/formDataContext";

function App() {
  return (
    <FormDataProvider>
      <div>
        <Routes>
          <Route path="/" element={<Voucher />} />
          <Route path="/print-template" element={<PrintTemplate />} />
        </Routes>
      </div>
    </FormDataProvider>
  );
}

export default App;
