export function changePortfolio(analyses) {
  const rows = analyses.map((item) => ({ id: item.request?.id, price: Number(item.analysis?.finalPrice || 0), cost: Number(item.analysis?.totalCost || 0), risk: Number(item.analysis?.riskScore || 0) }));
  const revenue = rows.reduce((sum, row) => sum + row.price, 0);
  const cost = rows.reduce((sum, row) => sum + row.cost, 0);
  return { revenue, cost, profit: revenue - cost, highRiskValue: rows.filter((row) => row.risk >= 55).reduce((sum, row) => sum + row.price, 0) };
}
