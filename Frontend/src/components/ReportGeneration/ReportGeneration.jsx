import React, { useState , useEffect} from 'react';
import { Calendar, CalendarDays, DollarSign, FileText, FileSpreadsheet, X } from 'lucide-react';
import { fetchExchangeRates , fetchTransactionReport} from '../../services/api';
import generateTransactionPDF from '../../utils/pdfGenerator';

const VOUCHER_TYPES = [
  { code: 'all', name: 'All Types' },
  { code: 'remit-in', name: 'Remit In' },
  { code: 'remit-out', name: 'Remit Out' },
];

export const TransactionDateFilter = ({ onFilterChange }) => {
  const [filterType, setFilterType] = useState('today');
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [currencies, setCurrencies] = useState([{ code: 'all', name: 'All Currencies' }]);
  const [selectedCurrency, setSelectedCurrency] = useState('all');
  const [selectedVoucherType, setSelectedVoucherType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState([]);

  console.log(transactionData); 
  useEffect(() => {
    const getCurrencyName = async () => {
      try {
        const rates = await fetchExchangeRates();
        
        // Transform the fetched rates to match the structure of the CURRENCIES array
        const currencyList = rates.map((rate) => ({
          code: rate.currency_iso,
          name: `${rate.currency_name} (${rate.currency_iso})`, // Use currency_name and currency_iso
        }));

        // Prepend the "All Currencies" option
        setCurrencies([{ code: 'all', name: 'All Currencies' }, ...currencyList]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
        setLoading(false);
      }
    };

    getCurrencyName();
  }, []);
  
  const handleCurrencyChange = (currency) => {
    setSelectedCurrency(currency);
    setTransactionData([]);
    onFilterChange({
      dates: filterType === 'today' ? new Date().toISOString().split('T')[0] : dateRange,
      currency,
      voucherType: selectedVoucherType,
    });
  };


  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    setTransactionData([]);
    if (type === 'today') {
      const today = new Date().toISOString().split('T')[0];
      onFilterChange({
        dates: today,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    } else {
      onFilterChange({
        dates: dateRange,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    }
  };

  const handleDateChange = (field, value) => {
    const newDateRange = { ...dateRange, [field]: value };
    setDateRange(newDateRange);
    setTransactionData([]);
    if (filterType === 'specific') {
      onFilterChange({
        dates: newDateRange,
        currency: selectedCurrency,
        voucherType: selectedVoucherType,
      });
    }
  };
  


  const handleVoucherTypeChange = (type) => {
    setSelectedVoucherType(type);
    setTransactionData([]);
    onFilterChange({
      dates: filterType === 'today' ? new Date().toISOString().split('T')[0] : dateRange,
      currency: selectedCurrency,
      voucherType: type,
    });
  };

  const handleCreateReport = async () => {
    setLoading(true); // Set loading to true when the report is being fetched
    try {
      let filters = {};
  
      // Check if the "today" filter is selected
      if (filterType === 'today') {
        filters.today = true;
      } else {
        // Use date range if not 'today'
        filters.startDate = dateRange.startDate; // Assuming dateRange has a startDate and endDate property
        filters.endDate = dateRange.endDate;
      }
  
      // Include the currency filter if selected
      if (selectedCurrency && selectedCurrency !== 'all') {
        filters.currency = selectedCurrency;
      }
  
      // Include the transaction type if selected and it's not 'all'
      if (selectedVoucherType && selectedVoucherType !== 'all') {
        filters.transactionType = selectedVoucherType;
      }
  
      // Fetch the transaction report using the constructed filters
      const data = await fetchTransactionReport(filters);
      
      // Store the fetched data in state
      setTransactionData(data);
    } catch (error) {
      console.error('Error fetching transaction report:', error);
    } finally {
      setLoading(false); // Set loading to false after the data is fetched or if an error occurred
    }
  };
  
  
  

  const handleClearFilter = (type) => {
    if (type === 'currency') {
      handleCurrencyChange('all');
    } else {
      handleVoucherTypeChange('all');
    }
  };

  const getActiveFilters = () => {
    const filters = [];

    if (selectedCurrency !== 'all') {
      filters.push({
        type: 'currency',
        label: currencies.find((c) => c.code === selectedCurrency)?.name,
      });
    }

    if (selectedVoucherType !== 'all') {
      filters.push({
        type: 'voucherType',
        label: VOUCHER_TYPES.find((t) => t.code === selectedVoucherType)?.name,
      });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

   // Calculate totals for remit-in and remit-out transactions
   const totals = (transactionData.data || []).reduce((acc, transaction) => {
    const nprAmount = parseFloat(transaction.NPR_amount);
    let commission = parseFloat(transaction.commission);
  
    // If commission is NaN, set it to 0 so it doesn't affect the total
    if (isNaN(commission)) {
      commission = 0;
    }
  
    if (transaction.transaction_type === 'remit-in') {
      acc.remitIn.nprAmount += nprAmount;
      acc.remitIn.commission += commission;
      acc.remitIn.netTotal = acc.remitIn.nprAmount - acc.remitIn.commission;
    } else if (transaction.transaction_type === 'remit-out') {
      acc.remitOut.netTotal += nprAmount;
    }
  
    return acc;
  }, {
    remitIn: { nprAmount: 0, commission: 0, netTotal: 0 },
    remitOut: { netTotal: 0 }
  });

  const handleDownloadPDF = () => {
    // Validate and get the selected currency from transactionData
    const transactions = transactionData.data || [];
    const currency = transactions.length > 0 && transactions[0].currency_name ? transactions[0].currency_name : 'N/A'; // Default if no data
  
    // Validate transaction_type from transactionData
    const transactionType = transactionData.transaction_type || 'N/A'; // Default if not found
  
    // Ensure the totals are valid numbers
    const remitInTotal = totals.remitIn.nprAmount;
    const remitInCommission = totals.remitIn.commission;
    const remitInNetTotal = totals.remitIn.netTotal;
    const remitOutTotal = totals.remitOut.netTotal;
    
  
    generateTransactionPDF({
      startDate: dateRange.startDate,  // Start date from dateRange
      endDate: dateRange.endDate,      // End date from dateRange
      currency,              
      voucherType: transactionType,    // Transaction type from transactionData
      transactions,   
      remitInTotal,
      remitInCommission,
      remitInNetTotal,
      remitOutTotal
    });
  };
  
  
  
  
  

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex gap-4">
            <button
              onClick={() => handleFilterTypeChange('today')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                filterType === 'today' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Today
            </button>
            <button
              onClick={() => handleFilterTypeChange('specific')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                filterType === 'specific' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Specific Date
            </button>
          </div>

          {filterType === 'specific' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label htmlFor="currency" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="w-4 h-4" />
                Currency
              </label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="voucherType" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FileText className="w-4 h-4" />
                Voucher Type
              </label>
              <select
                id="voucherType"
                value={selectedVoucherType}
                onChange={(e) => handleVoucherTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                {VOUCHER_TYPES.map((type) => (
                  <option key={type.code} value={type.code}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3">
              {activeFilters.map((filter) => (
                <div key={filter.type} className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  <span>{filter.label}</span>
                  <button onClick={() => handleClearFilter(filter.type)} className="p-0.5 hover:bg-blue-100 rounded-full">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              onClick={handleCreateReport}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Create Report
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ml-3"
            >
              <FileText className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                SN
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Voucher Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Currency
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                ISO Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Voucher Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Exchange Rate
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                FC Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                NPR Amount
              </th>
              {selectedVoucherType !== 'remit-out' && (
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Commission
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center space-x-2">
                    <FileSpreadsheet className="animate-spin h-5 w-5" />
                    <span>Loading transactions...</span>
                  </div>
                </td>
              </tr>
            ) : !transactionData?.data || transactionData.data.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                  No transactions found. Try adjusting your filters.
                </td>
              </tr>
            ) : (
              transactionData.data.map((transaction, index) => (
                <tr key={transaction.transaction_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1} {/* Serial number */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.voucher_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.currency_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.currency_iso_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {transaction.transaction_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(transaction.exchange_rate).toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(transaction.fc_amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parseFloat(transaction.NPR_amount).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  {selectedVoucherType !== 'remit-out' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {isNaN(parseFloat(transaction.commission)) 
                        ? "No Commission" 
                        : parseFloat(transaction.commission).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}
                    </td>
                  )}

                </tr>
              ))
            )}
            {/* Summary Rows */}
            {/* Remit In Summary */}
            {selectedVoucherType !== 'remit-out' && (
              <>
                <tr className="bg-green-50">
                  <td className="px-6 py-2 whitespace-nowrap text-base font-bold text-green-700">
                    Remit In
                  </td>
                  <td colSpan={6} className="px-6 py-2 whitespace-nowrap text-sm text-right text-green-700">
                    Total:
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm  text-green-700">
                    {totals.remitIn.nprAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-2 whitespace-nowrap text-sm  text-green-700">
                    {totals.remitIn.commission.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr className="bg-green-50">
                  <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-green-700">
                  </td>
                  <td colSpan={6} className="px-6 py-2 whitespace-nowrap text-base text-right text-green-700">
                    Remittance In Net Total:
                  </td>
                  <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-base font-bold text-green-700">
                    {totals.remitIn.netTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </>
            )}

            {/* Remit Out Summary */}
            {selectedVoucherType !== 'remit-in' && (
              <>
                <tr className="bg-red-50">
                  <td className="px-6 py-2 whitespace-nowrap text-base font-bold text-red-700">
                    Remit Out
                  </td>
                  <td colSpan={6} className="px-6 py-2 whitespace-nowrap text-base text-right text-red-700">
                    Remittance Out Total:
                  </td>
                  <td colSpan={2} className="px-6 py-2 whitespace-nowrap text-base font-bold text-red-700">
                    {totals.remitOut.netTotal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
