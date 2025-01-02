let voucherCounter = 120000;

export function generateVoucherNumber(): string {
  voucherCounter++;
  return voucherCounter.toString();
}

export function formatAmount(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}