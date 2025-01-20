import { fetchTotalVoucherCount } from "../services/api";

let startingnumber = 0; // If needed to start voucher from a starting number add here 
let voucherCounter=0;
// Generate voucher number based on the total count from the API
export const generateVoucherNumber = async (): Promise<string> => {
  try {
    // Fetch the total voucher count from the API
    const totalVouchers = await fetchTotalVoucherCount(); // Expects a number

    // Set voucherCounter to the fetched total count and increment
    voucherCounter = startingnumber+totalVouchers;

    // Increment to generate the next voucher number
    voucherCounter++;

    return voucherCounter.toString(); // Return as a string
  } catch (error) {
    console.error('Error generating voucher number:', error);
    throw new Error('Error generating voucher number');
  }
};

export function formatAmount(amount: number): string {
  if (amount == null || isNaN(amount)) {
    return '0.00'; // Return a default value if amount is null or NaN
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
