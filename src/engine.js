import { COMPLEXITIES, REQUEST_TYPES, URGENCY } from "./data";

export const money = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value) || 0);
export const percent = (value) => `${Math.round(Number(value) || 0)}%`;
export const dateLabel = (value) => value ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`)) : "—";

const byId = (items, id) => items.find((item) => item.id === id);
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function addDays(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + Number(days || 0));
  return date.toISOString().slice(0, 10);
}

export function getRequestType(typeId) {
  return byId(REQUEST_TYPES, typeId) || REQUEST_TYPES[0];
}

export function bestPeople(type, team) {
  return team
    .map((person) => {
      const matchCount = type.skills.filter((skill) => person.skills.includes(skill)).length;
      const match = type.skills.length ? matchCount / type.skills.length : 0;
      const availability = Math.max(0, person.weeklyCapacity - person.committed) / Math.max(1, person.weeklyCapacity);
      const score = match * 75 + availability * 18 + (person.committed < person.weeklyCapacity ? 7 : 0);
      return { ...person, match, availability, score };
    })
    .filter((person) => person.match > 0)
    .sort((a, b) => b.score - a.score);
}

export function analyzeChange(request, project, team, baseScope) {
  const type = getRequestType(request.typeId);
  const complexity = byId(COMPLEXITIES, request.complexity) || COMPLEXITIES[1];
  const urgency = byId(URGENCY, request.urgency) || URGENCY[0];
  const people = bestPeople(type, team);
  const lead = people[0] || team[0];
  const pm = team.find((person) => person.skills.includes("Project Management")) || team[0];
  const qa = team.find((person) => person.skills.includes("QA")) || team[0];
  const coreHours = Math.round(type.baseHours * complexity.factor * urgency.factor);
  const projectManagementHours = Math.max(3, Math.round(coreHours * 0.16));
  const qaHours = Math.max(3, Math.round(coreHours * 0.2));
  const discoveryHours = request.complexity === "enterprise" ? Math.round(coreHours * 0.14) : Math.round(coreHours * 0.08);
  const totalHours = coreHours + projectManagementHours + qaHours + discoveryHours;
  const skillRate = lead.rate;
  const internalCost = coreHours * skillRate + projectManagementHours * pm.rate + qaHours * qa.rate + discoveryHours * pm.rate;
  const dependencyCount = (request.affectedScope || []).length;
  const dependencyCost = internalCost * dependencyCount * 0.035;
  const riskReservePercent = clamp(type.risk + urgency.risk + dependencyCount * 4 + (request.complexity === "enterprise" ? 9 : 0), 8, 38);
  const riskReserve = (internalCost + dependencyCost) * riskReservePercent / 100;
  const totalCost = internalCost + dependencyCost + riskReserve;
  const targetMargin = project.tier === "Platinum" ? 42 : project.tier === "Gold" ? 38 : 34;
  const marginFloor = totalCost / (1 - 0.28);
  const recommendedPrice = totalCost / (1 - targetMargin / 100);
  const discount = clamp(Number(request.discount) || 0, 0, 25);
  const finalPrice = Math.max(marginFloor, recommendedPrice * (1 - discount / 100));
  const margin = finalPrice ? (finalPrice - totalCost) / finalPrice * 100 : 0;
  const netNewProfit = finalPrice - totalCost;
  const averageWeeklyCapacity = Math.max(10, lead.weeklyCapacity - lead.committed) + Math.max(4, qa.weeklyCapacity - qa.committed) * .3;
  const deliveryDays = Math.max(3, Math.ceil(totalHours / averageWeeklyCapacity * 5));
  const affectedDates = (request.affectedScope || []).map((id) => byId(baseScope, id)?.finish).filter(Boolean).sort();
  const dependencyFinish = affectedDates.at(-1) || project.startDate;
  const changeFinish = addDays(dependencyFinish, deliveryDays);
  const deadlineSlip = Math.max(0, Math.round((new Date(`${changeFinish}T12:00:00`) - new Date(`${project.targetDate}T12:00:00`)) / 86400000));
  const scheduleRisk = clamp(deadlineSlip * 4 + urgency.risk * .55, 0, 36);
  const budgetRisk = project.contractValue ? clamp((totalCost / project.contractValue) * 35, 0, 25) : 0;
  const dependencyRisk = clamp(dependencyCount * 7 + type.risk * .4, 0, 24);
  const marginRisk = margin < targetMargin ? clamp((targetMargin - margin) * 2, 0, 22) : 0;
  const riskScore = Math.round(clamp(scheduleRisk + budgetRisk + dependencyRisk + marginRisk, 0, 100));
  const riskBand = riskScore < 28 ? "Low" : riskScore < 55 ? "Moderate" : riskScore < 75 ? "High" : "Critical";
  let decision = "Approve";
  let reason = "Scope is commercially protected and fits current delivery conditions.";
  if (margin < 28 || riskScore >= 75) { decision = "Reject"; reason = "The request risks margin protection or creates unacceptable delivery pressure."; }
  else if (deadlineSlip > 10 || request.complexity === "enterprise") { decision = "Re-quote"; reason = "The change requires a revised statement of work, delivery plan, and client agreement."; }
  else if (margin < targetMargin - 4 || riskScore >= 55 || deadlineSlip > 3) { decision = "Negotiate"; reason = "Price, scope, staffing, or delivery date should be adjusted before approval."; }
  const requiredApprovals = ["Project Manager", "Finance"];
  if (finalPrice >= 6000 || riskScore >= 55 || decision === "Re-quote") requiredApprovals.push("Founder");
  if (request.status === "Client Review" || request.status === "Approved") requiredApprovals.push("Client");
  const affectedTasks = (request.affectedScope || []).map((id) => byId(baseScope, id)).filter(Boolean);
  const approvalProgress = Object.values(request.approvals || {}).filter(Boolean).length;
  const approvalTotal = requiredApprovals.length;
  const clientSummary = `${type.label} is estimated at ${totalHours} delivery hours with an implementation fee of ${money(finalPrice)}. The change is expected to require ${deliveryDays} delivery days${deadlineSlip ? ` and may move the target by ${deadlineSlip} day${deadlineSlip === 1 ? "" : "s"}` : " without moving the current target"}.`;
  return { type, complexity, urgency, people, lead, pm, qa, coreHours, projectManagementHours, qaHours, discoveryHours, totalHours, internalCost, dependencyCost, riskReservePercent, riskReserve, totalCost, targetMargin, marginFloor, recommendedPrice, finalPrice, discount, margin, netNewProfit, deliveryDays, dependencyFinish, changeFinish, deadlineSlip, riskScore, riskBand, decision, reason, requiredApprovals, approvalProgress, approvalTotal, affectedTasks, clientSummary };
}

export function portfolioSummary(requests, project, team, baseScope) {
  const analyses = requests.map((request) => ({ request, analysis: analyzeChange(request, project, team, baseScope) }));
  const active = analyses.filter(({ request }) => !["Rejected", "Implemented"].includes(request.status));
  const approvedValue = analyses.filter(({ request }) => ["Approved", "Implemented"].includes(request.status)).reduce((sum, item) => sum + item.analysis.finalPrice, 0);
  const exposure = active.reduce((sum, item) => sum + item.analysis.totalCost, 0);
  const highRisk = active.filter((item) => item.analysis.riskScore >= 55).length;
  const clientWaiting = active.filter(({ request }) => request.status === "Client Review").length;
  return { analyses, active, approvedValue, exposure, highRisk, clientWaiting };
}

export function clientSafeSummary(project, request, analysis) {
  return {
    project: project.name,
    client: project.client,
    request: request.title,
    scope: analysis.type.description,
    investment: money(analysis.finalPrice),
    estimatedDelivery: `${analysis.deliveryDays} delivery days`,
    targetImpact: analysis.deadlineSlip ? `The current target may move by ${analysis.deadlineSlip} days after approval.` : "The current target can remain unchanged with the proposed delivery plan.",
    nextStep: analysis.decision === "Approve" ? "Review and approve the change request to begin implementation." : "Review the revised scope, investment, and delivery conditions with Elite Era Development.",
  };
}

export function toText(project, request, analysis) {
  return [
    "ELITE ERA DEVELOPMENT L.L.C — SCOPE GUARD REPORT",
    "Made by Hira Khyzer",
    "",
    `Project: ${project.name}`,
    `Client: ${project.client}`,
    `Change request: ${request.title}`,
    `Status: ${request.status}`,
    "",
    "--- COMMERCIAL ANALYSIS ---",
    `Recommended investment: ${money(analysis.finalPrice)}`,
    `Internal delivery cost: ${money(analysis.totalCost)}`,
    `Net new profit: ${money(analysis.netNewProfit)}`,
    `Protected margin: ${analysis.margin.toFixed(1)}%`,
    `Margin floor: ${money(analysis.marginFloor)}`,
    "",
    "--- DELIVERY ANALYSIS ---",
    `Total effort: ${analysis.totalHours} hours`,
    `Delivery duration: ${analysis.deliveryDays} days`,
    `Change finish: ${analysis.changeFinish}`,
    `Deadline slip: ${analysis.deadlineSlip} days`,
    `Risk score: ${analysis.riskScore}/100 (${analysis.riskBand})`,
    `Decision: ${analysis.decision}`,
    `Reason: ${analysis.reason}`,
    "",
    "--- REQUIRED APPROVALS ---",
    ...analysis.requiredApprovals.map((item) => `- ${item}`),
    "",
    "--- CLIENT-SAFE SUMMARY ---",
    analysis.clientSummary,
    "",
  ].join("\n");
}

export function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}
