export const GOLD = "#f4af00";

export const REQUEST_TYPES = [
  { id: "chatbot", label: "AI support assistant", category: "AI capability", baseHours: 34, skills: ["AI", "API", "Frontend", "QA"], risk: 13, dependency: "Data and knowledge-source review", description: "Add a customer-facing assistant with guarded answers and human handoff." },
  { id: "language", label: "Additional language", category: "Localization", baseHours: 18, skills: ["Frontend", "QA", "Content"], risk: 8, dependency: "Content translation and language QA", description: "Add one extra language, translated interface content, and quality testing." },
  { id: "admin", label: "Operations admin dashboard", category: "Product expansion", baseHours: 30, skills: ["Frontend", "Backend", "UX/UI", "QA"], risk: 12, dependency: "Permissions and reporting design", description: "Create a protected administrative workspace with reporting and workflows." },
  { id: "payments", label: "Payment integration", category: "Commercial", baseHours: 26, skills: ["Backend", "API", "QA", "Security"], risk: 18, dependency: "Payment provider and compliance review", description: "Add secure payment flow, status tracking, and finance notifications." },
  { id: "analytics", label: "Advanced analytics", category: "Data", baseHours: 22, skills: ["Data", "Backend", "Frontend", "QA"], risk: 10, dependency: "Event tracking and reporting model", description: "Add operational dashboards, event tracking, and decision metrics." },
  { id: "automation", label: "Workflow automation", category: "Automation", baseHours: 28, skills: ["Automation", "API", "Backend", "QA"], risk: 14, dependency: "Workflow mapping and integration access", description: "Automate internal notifications, handoffs, approvals, and record updates." },
  { id: "design", label: "Design-system refresh", category: "Design", baseHours: 20, skills: ["UX/UI", "Brand", "Frontend"], risk: 7, dependency: "Design review and component migration", description: "Refresh visual design and update shared product components." },
];

export const COMPLEXITIES = [
  { id: "simple", label: "Simple", factor: 0.85 },
  { id: "moderate", label: "Moderate", factor: 1 },
  { id: "complex", label: "Complex", factor: 1.4 },
  { id: "enterprise", label: "Enterprise", factor: 1.85 },
];

export const URGENCY = [
  { id: "normal", label: "Normal delivery", factor: 1, risk: 0 },
  { id: "priority", label: "Priority delivery", factor: 1.12, risk: 8 },
  { id: "rush", label: "Rush delivery", factor: 1.28, risk: 18 },
];

export const APPROVAL_STATUSES = ["Draft", "Internal Review", "Client Review", "Approved", "Rejected", "Implemented"];

export const team = [
  { id: "hira", name: "Hira Khyzer", initials: "HK", role: "Founder & AI Lead", skills: ["AI", "Strategy", "API", "Data"], rate: 110, weeklyCapacity: 20, committed: 9 },
  { id: "amina", name: "Amina Noor", initials: "AN", role: "Project Manager", skills: ["Project Management", "QA", "Strategy"], rate: 72, weeklyCapacity: 24, committed: 10 },
  { id: "musa", name: "Musa Khan", initials: "MK", role: "Full-Stack Developer", skills: ["Frontend", "Backend", "API", "Security", "Automation"], rate: 86, weeklyCapacity: 30, committed: 18 },
  { id: "rani", name: "Rani Patel", initials: "RP", role: "Product Designer", skills: ["UX/UI", "Brand", "Frontend", "Content"], rate: 66, weeklyCapacity: 22, committed: 8 },
  { id: "nora", name: "Nora Lee", initials: "NL", role: "QA Engineer", skills: ["QA", "Automation", "Frontend", "Content"], rate: 56, weeklyCapacity: 25, committed: 13 },
  { id: "omar", name: "Omar Rahman", initials: "OR", role: "Client Success Lead", skills: ["Project Management", "Content", "Strategy"], rate: 62, weeklyCapacity: 20, committed: 14 },
];

export const initialProject = {
  id: "atlas", name: "Atlas Client Operations Portal", client: "Atlas Holdings", tier: "Platinum", contractValue: 42000, soldMargin: 38, startDate: "2026-06-09", targetDate: "2026-08-07", spent: 14600, committedCost: 22300, progress: 46, health: "On track", manager: "Amina Noor",
};

export const baseScope = [
  { id: "s1", title: "Secure client portal foundation", status: "In Progress", finish: "2026-07-04", owner: "Musa Khan" },
  { id: "s2", title: "Approval workflow and file space", status: "To Do", finish: "2026-07-14", owner: "Amina Noor" },
  { id: "s3", title: "Reporting and launch readiness", status: "To Do", finish: "2026-07-30", owner: "Nora Lee" },
];

export const initialRequests = [
  { id: "cr-001", typeId: "chatbot", title: "Add a client-facing AI assistant", description: "The client wants a guided assistant in the portal to answer common questions and create help requests.", complexity: "complex", urgency: "priority", discount: 0, affectedScope: ["s1", "s2"], status: "Internal Review", requester: "Atlas Holdings", created: "2026-06-24", approvals: { pm: true, finance: false, founder: false, client: false }, notes: "Client asked during weekly review." },
  { id: "cr-002", typeId: "language", title: "Add Arabic language support", description: "Support Arabic interface content and a right-to-left experience for client users.", complexity: "moderate", urgency: "normal", discount: 5, affectedScope: ["s1"], status: "Client Review", requester: "Atlas Holdings", created: "2026-06-21", approvals: { pm: true, finance: true, founder: true, client: false }, notes: "Waiting for client translation owner." },
  { id: "cr-003", typeId: "analytics", title: "Executive trend dashboard", description: "Add weekly trends and alert metrics to the main executive view.", complexity: "simple", urgency: "normal", discount: 0, affectedScope: ["s3"], status: "Draft", requester: "Atlas Holdings", created: "2026-06-25", approvals: { pm: false, finance: false, founder: false, client: false }, notes: "Initial intake request." },
];

export function cloneInitialState() {
  return JSON.parse(JSON.stringify({ project: initialProject, team, baseScope, requests: initialRequests, savedReports: [] }));
}
