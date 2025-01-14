let voucherCounter = 121130;

export function generateVoucherNumber(): string {
  voucherCounter++;
  return voucherCounter.toString();
}

export function formatAmount(amount: number): string {
  if (amount == null || isNaN(amount)) {
    return '0.00'; // Return a default value if amount is null or NaN
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
