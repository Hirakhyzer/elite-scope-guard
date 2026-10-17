export function changeROI(analysis, expectedAnnualValue) {
  const investment = Number(analysis.finalPrice || 0);
  const value = Number(expectedAnnualValue || 0);
  const roi = investment > 0 ? (value - investment) / investment * 100 : 0;
  const paybackMonths = value > 0 ? investment / value * 12 : Infinity;
  return { investment, expectedAnnualValue: value, roi, paybackMonths, attractive: roi >= 25 && paybackMonths <= 18 };
}
