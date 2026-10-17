export function dependencyExposure(changes) {
  const rows = changes.map((change) => {
    const dependencies = (change.affectedScope || []).length;
    const hours = Number(change.hours || change.estimatedHours || 0);
    return { id: change.id, dependencies, exposure: dependencies * Math.max(1, hours) };
  });
  return { rows: rows.sort((a, b) => b.exposure - a.exposure), totalExposure: rows.reduce((sum, row) => sum + row.exposure, 0) };
}
