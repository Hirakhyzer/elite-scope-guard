export function negotiationGuardrails(totalCost, targetMargin = 38, floorMargin = 28) {
  if (totalCost < 0) throw new Error("totalCost cannot be negative");
  const targetPrice = totalCost / (1 - targetMargin / 100);
  const floorPrice = totalCost / (1 - floorMargin / 100);
  return { targetPrice, floorPrice, maximumDiscount: targetPrice ? (targetPrice - floorPrice) / targetPrice * 100 : 0 };
}
