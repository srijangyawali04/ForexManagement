import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useFormData } from "../contexts/formDataContext";

const Voucher = () => {
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD
  const [currencies, setCurrencies] = useState([]);
  const [voucherEntries, setVoucherEntries] = useState([
    {
      selectedCurrency: "",
      foreignCurrencyAmount: 0,
      exchangeRate: null,
      nprAmount: 0,
    },
  ]);
  const [rateType, setRateType] = useState("buy");
  const { formData, handleInputChange } = useFormData();

  // Fetch currency data from the API
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          `https://www.nrb.org.np/api/forex/v1/rates?from=${currentDate}&to=${currentDate}&per_page=100&page=1`,
        );

        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }

        const data = await response.json();
        console.log("API Response:", data);

        const rates = data.data.payload[0]?.rates || [];
        const currencyList = rates.map((rate) => ({
          iso3: rate.currency.iso3,
          name: rate.currency.name,
          buyRate: parseFloat(rate.buy) / rate.currency.unit,
          sellRate: parseFloat(rate.sell) / rate.currency.unit,
        }));
        setCurrencies(currencyList);
      } catch (error) {
        console.error("Error fetching currencies:", error);
        setCurrencies([]);
      }
    };

    fetchCurrencies();
  }, [currentDate]);

  // Handle currency change
  const handleCurrencyChange = (index, event) => {
    const selectedCurrency = event.target.value;
    const newVoucherEntries = [...voucherEntries];
    newVoucherEntries[index].selectedCurrency = selectedCurrency;

    const currencyData = currencies.find(
      (currency) => currency.iso3 === selectedCurrency,
    );
    if (currencyData) {
      newVoucherEntries[index].exchangeRate = currencyData[rateType + "Rate"];
    }

    setVoucherEntries(newVoucherEntries);
  };

  // Handle rate type change (buy or sell)
  const handleRateTypeChange = (event) => {
    const selectedRateType = event.target.value;
    setRateType(selectedRateType);

    const newVoucherEntries = [...voucherEntries];
    newVoucherEntries.forEach((entry) => {
      const currencyData = currencies.find(
        (currency) => currency.iso3 === entry.selectedCurrency,
      );
      if (currencyData) {
        entry.exchangeRate = currencyData[selectedRateType + "Rate"];
      }
    });

    setVoucherEntries(newVoucherEntries);
  };

  // Handle foreign currency amount change
  const handleForeignCurrencyChange = (index, event) => {
    const amount = parseFloat(event.target.value);
    const newVoucherEntries = [...voucherEntries];
    newVoucherEntries[index].foreignCurrencyAmount = amount;

    if (newVoucherEntries[index].exchangeRate) {
      newVoucherEntries[index].nprAmount =
        amount * newVoucherEntries[index].exchangeRate;
    }

    setVoucherEntries(newVoucherEntries);
  };

  // Add a new row for another currency
  const addCurrencyRow = () => {
    setVoucherEntries([
      ...voucherEntries,
      {
        selectedCurrency: "",
        foreignCurrencyAmount: 0,
        exchangeRate: null,
        nprAmount: 0,
      },
    ]);
  };

  // Calculate total NPR amount
  const totalNprAmount = voucherEntries.reduce(
    (total, entry) => total + entry.nprAmount,
    0,
  );

  // Function to handle the "Generate Voucher" button click
  const handleGenerateVoucher = () => {
    navigate("/print-template", {
      state: {
        voucherEntries,
        rateType,
        currencies,
        currentDate,
      },
    });
  };

  return (
    <div className="container mx-auto p-10 max-w-[105mm] max-h-[148.5mm] box-border">
      <div className="flex items-center mb-8">
        <img src={logo} alt="Logo" className="w-20 h-20 mr-4" />
        <h2 className="text-left flex flex-col justify-center my-auto">
          <span className="text-xl font-bold">Nepal Rastra Bank</span>
          <span className="text-lg font-medium">Banking Department</span>
          <span className="text-mb font-light">Remittance Section</span>
        </h2>
        <div className="flex flex-col ml-auto justify-center space-y-2">
          <div className="flex items-center space-x-2">
            <span>Voucher Receipt No: </span>
            <input
              type="text"
              name="voucherReceiptNo"
              className="p-2 rounded w-[90px]"
              value={formData.voucherReceiptNo}
              onChange={handleInputChange}
              placeholder="____________"
            />
          </div>
          <span className="text-right">Date: {currentDate}</span>
        </div>
      </div>

      <table className="w-full table-auto mb-4 text-sm">
        <thead>
          <tr>
            <th
              colSpan="3"
              className="px-2 w-[50%] font-medium border border-black text-left"
            >
              Customer Name:
              <input
                type="text"
                name="customerName"
                className="px-2"
                value={formData.customerName}
                onChange={handleInputChange}
              />
            </th>
            <th
              colSpan="1"
              className="px-2 w-[27.5%] font-medium border border-black text-left"
            >
              Contact No:
              <input
                type="text"
                name="contactNumber"
                className="w-[94px] px-2 mt-1 mb-1"
                value={formData.contactNumber}
                onChange={handleInputChange}
              />
            </th>
            <th
              colSpan="1"
              className="px-2 font-medium border border-black text-left"
            >
              ITRS Code:
              <input
                type="text"
                name="irtsCode"
                className="px-2 w-[60px]"
                value={formData.irtsCode}
                onChange={handleInputChange}
              />
            </th>
          </tr>
        </thead>

        <thead>
          <tr>
            <th
              colSpan="3"
              className="px-2 font-medium border border-black text-left"
            >
              ID/Passport No:
              <input
                type="text"
                name="idPassportNo"
                className="mt-1 w-[190px] mb-1"
                value={formData.idPassportNo}
                onChange={handleInputChange}
              />
            </th>
            <th
              colSpan="2"
              className="px-2 font-medium border border-black text-left"
            >
              Exchange Type:
              <select
                className="px-2 w-[200px] appearance-none focus:outline-none"
                value={rateType}
                onChange={handleRateTypeChange}
              >
                <option value="buy">Remit In</option>
                <option value="sell">Remit Out</option>
              </select>
            </th>
          </tr>
        </thead>

        <thead>
          <tr>
            <th className="font-medium border border-black text-left px-2 py-1">
              S.N
            </th>
            <th className="font-medium border border-black text-left px-2 py-1">
              Account Heads
            </th>
            <th className="font-medium border border-black text-left px-2 py-1">
              Exchange Rate
            </th>
            <th className="font-medium border border-black text-left px-2 py-1">
              Foreign Currency
            </th>
            <th className="font-medium border border-black text-left px-2 py-1">
              NPR
            </th>
          </tr>
        </thead>

        <tbody>
          {voucherEntries.map((entry, index) => (
            <tr key={index}>
              <td className="border border-black text-left px-2 py-1">{index + 1}</td>
              <td className="border border-black text-left px-2 py-1">
                <select
                  value={entry.selectedCurrency}
                  onChange={(e) => handleCurrencyChange(index, e)}
                  className="p-2 w-[190px]"
                >
                  <option value="">Select Currency</option>
                  {currencies.map((currency) => (
                    <option key={currency.iso3} value={currency.iso3}>
                      {currency.name} ({currency.iso3})
                    </option>
                  ))}
                </select>
              </td>
              <td className="border border-black text-left px-2 py-1">
                {entry.exchangeRate || "Select Currency"}
              </td>
              <td className="border border-black text-left px-2 py-1">
                <input
                  type="number"
                  value={entry.foreignCurrencyAmount}
                  onChange={(e) => handleForeignCurrencyChange(index, e)}
                  className="w-full p-2 rounded"
                />
              </td>
              <td className="border border-black text-left px-2 py-1">
                {entry.nprAmount.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan="4"
              className="font-bold text-right border border-black px-2 py-1"
            >
              Total NPR:
            </td>
            <td className="font-bold border border-black px-2 py-1">
              {totalNprAmount.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td
              colSpan="5"
              className="px-2 w-[27.5%] font-medium border border-black text-left"
            >
              Amount in Words :
              <input
                type="text"
                name="amountinWord"
                className="mt-1 w-[550px] p-1"
                value={formData.amountinWord}
                onChange={handleInputChange}
              />
            </td>
          </tr>
        </tbody>
      </table>


      <div className="mt-4">
        <button
          onClick={addCurrencyRow}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Add Another Currency
        </button>
      </div>

      <div className="mt-4 flex justify-between">
        <div className="w-1/3 text-left">
          <p className="border-t border-black w-full mt-8 pt-2 text-left">
            Prepared By
          </p>
          <input
                type="text"
                name="preparedBy"
                className="mt-1 w-[200px] p-1 border border-gray-400"
                value={formData.preparedBy}
                onChange={handleInputChange}
              />
        </div>
        <div className="w-1/3 text-left">
          <p className="border-t border-black w-full mt-8 pt-2 text-left">
            Verified By
          </p>
          <input
                type="text"
                name="verifiedBy"
                className="mt-1 w-[200px] p-1 border border-gray-400"
                value={formData.verifiedBy}
                onChange={handleInputChange}
              />
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleGenerateVoucher}
          className="bg-green-500 text-white p-2 rounded"
        >
          Generate Voucher
        </button>
      </div>
    </div>
  );
};

export default Voucher;
