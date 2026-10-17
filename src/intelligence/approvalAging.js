export function approvalAging(requests, today = new Date().toISOString().slice(0, 10)) {
  return requests.filter((request) => request.status === "Client Review" || request.status === "Pending").map((request) => {
    const since = request.submittedAt || request.createdAt;
    const days = since ? Math.max(0, Math.round((new Date(`${today}T12:00:00`) - new Date(`${since}T12:00:00`)) / 86400000)) : 0;
    return { id: request.id, days, stale: days >= 5, score: Math.min(100, days * 10) };
  }).sort((a, b) => b.score - a.score);
}
