export function riskReserveAdequacy(analyses, reserve) {
  const expectedExposure = analyses.reduce((sum, item) => sum + Number(item.analysis?.totalCost || 0) * Number(item.analysis?.riskScore || 0) / 100, 0);
  const available = Number(reserve || 0);
  const coverage = expectedExposure > 0 ? available / expectedExposure : Infinity;
  return { expectedExposure, available, coverage, adequate: coverage >= 1 };
}
