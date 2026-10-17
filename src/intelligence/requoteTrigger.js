export function requoteTrigger(analysis, thresholds = {}) {
  const maxSlip = thresholds.maxSlip ?? 10;
  const maxRisk = thresholds.maxRisk ?? 65;
  const minMargin = thresholds.minMargin ?? 30;
  const reasons = [];
  if (analysis.deadlineSlip > maxSlip) reasons.push("schedule slip");
  if (analysis.riskScore >= maxRisk) reasons.push("delivery risk");
  if (analysis.margin < minMargin) reasons.push("margin pressure");
  return { required: reasons.length > 0, reasons };
}
