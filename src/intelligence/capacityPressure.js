export function capacityPressure(team, addedHours) {
  const free = team.reduce((sum, person) => sum + Math.max(0, Number(person.weeklyCapacity || 0) - Number(person.committed || 0)), 0);
  const ratio = free > 0 ? Number(addedHours || 0) / free : Infinity;
  const score = Number.isFinite(ratio) ? Math.min(100, Math.round(ratio * 60)) : 100;
  return { freeHours: free, addedHours: Number(addedHours || 0), ratio, score, band: score >= 75 ? "Critical" : score >= 50 ? "High" : score >= 25 ? "Watch" : "Low" };
}
