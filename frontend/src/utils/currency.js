/**
 * Utility functions for formatting Indian Rupee (INR / ₹) currency values
 */

export const formatINR = (val) => {
  const num = Number(val);
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatRupees = (val) => {
  const num = Number(val);
  if (isNaN(num)) return '₹0';
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
};

export const formatCompactINR = (val) => {
  const num = Number(val);
  if (isNaN(num)) return '₹0';
  if (Math.abs(num) >= 10000000) {
    return `₹${(num / 10000000).toFixed(1)}Cr`;
  }
  if (Math.abs(num) >= 100000) {
    return `₹${(num / 100000).toFixed(1)}L`;
  }
  if (Math.abs(num) >= 1000) {
    return `₹${(num / 1000).toFixed(0)}k`;
  }
  return `₹${num}`;
};
