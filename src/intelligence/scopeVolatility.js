export function scopeVolatility(changes, baselineHours) {
  const added = changes.reduce((sum, change) => sum + Number(change.hours || 0), 0);
  const ratio = baselineHours > 0 ? added / baselineHours : 0;
  const score = Math.min(100, Math.round(ratio * 100 + changes.length * 4));
  return { addedHours: added, ratio, score, band: score >= 60 ? "High" : score >= 30 ? "Watch" : "Low" };
}
