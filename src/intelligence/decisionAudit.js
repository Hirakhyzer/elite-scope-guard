export function decisionAudit(request, analysis, decidedBy, timestamp = new Date().toISOString()) {
  return { requestId: request.id, decision: analysis.decision, riskScore: analysis.riskScore, price: analysis.finalPrice, cost: analysis.totalCost, margin: analysis.margin, approvalsReady: analysis.approval?.ready ?? false, decidedBy, timestamp, reason: analysis.reason };
}
