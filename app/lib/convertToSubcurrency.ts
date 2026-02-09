function convertToSubcurrency(amount: number, factor = 100): number {
  // Convert to cents with proper rounding
  return Math.round(Number((amount * factor).toFixed(2)));
}

export default convertToSubcurrency;
