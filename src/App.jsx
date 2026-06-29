import { useEffect, useMemo, useState } from "react";
import { cloneInitialState } from "./data";
import { analyzeChange, downloadFile, portfolioSummary, toText } from "./engine";
import { Button } from "./ui";
import { Dashboard } from "./views/Dashboard";
import { RequestView } from "./views/Request";
import { Approvals } from "./views/Approvals";
import { ClientView } from "./views/Client";
import { Reports } from "./views/Reports";

const STORAGE_KEY = "elite-scope-guard-v1";

function loadState() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    const fresh = cloneInitialState();
    return saved ? { ...fresh, ...saved, project: { ...fresh.project, ...saved.project }, requests: Array.isArray(saved.requests) ? saved.requests : fresh.requests, savedReports: Array.isArray(saved.savedReports) ? saved.savedReports : [] } : fresh;
  } catch {
    return cloneInitialState();
  }
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(() => loadState().requests[0]?.id || "");
  const [toast, setToast] = useState("");
  const selected = state.requests.find((request) => request.id === selectedId) || state.requests[0];
  const analysis = useMemo(() => analyzeChange(selected, state.project, state.team, state.baseScope), [selected, state.project, state.team, state.baseScope]);
  const summary = useMemo(() => portfolioSummary(state.requests, state.project, state.team, state.baseScope), [state]);

  useEffect(() => { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => { if (!toast) return undefined; const timer = window.setTimeout(() => setToast(""), 2700); return () => window.clearTimeout(timer); }, [toast]);
  const notify = (message) => setToast(message);

  function selectRequest(id) { setSelectedId(id); }
  function updateRequest(id, changes) { setState((current) => ({ ...current, requests: current.requests.map((request) => request.id === id ? { ...request, ...changes } : request) })); }
  function createRequest(draft) { const request = { ...draft, id: `scope-${Date.now()}` }; setState((current) => ({ ...current, requests: [request, ...current.requests] })); setSelectedId(request.id); setTab("request"); notify("New scope analysis created"); }
  function toggleApproval(id, key) { const request = state.requests.find((item) => item.id === id); if (!request) return; updateRequest(id, { approvals: { ...request.approvals, [key]: !request.approvals?.[key] } }); notify(`${key === "pm" ? "Project Manager" : key[0].toUpperCase() + key.slice(1)} approval updated`); }
  function saveReport() { const report = { id: `report-${Date.now()}`, title: selected.title, client: state.project.client, decision: analysis.decision, risk: analysis.riskScore, price: analysis.finalPrice, createdAt: new Date().toLocaleString() }; setState((current) => ({ ...current, savedReports: [report, ...current.savedReports].slice(0, 20) })); notify("Scope report saved"); }
  function removeReport(id) { setState((current) => ({ ...current, savedReports: current.savedReports.filter((report) => report.id !== id) })); notify("Saved report removed"); }
  function exportText() { downloadFile("elite-scope-guard-report.txt", toText(state.project, selected, analysis), "text/plain"); notify("TXT report downloaded"); }
  function exportJson() { downloadFile("elite-scope-guard-analysis.json", JSON.stringify({ generatedAt: new Date().toLocaleString(), company: "Elite Era Development L.L.C", project: state.project, request: selected, analysis }, null, 2), "application/json"); notify("JSON analysis downloaded"); }
  function resetWorkspace() { if (!window.confirm("Reset all Scope Guard demo data in this browser?")) return; const reset = cloneInitialState(); setState(reset); setSelectedId(reset.requests[0].id); setTab("dashboard"); notify("Demo workspace reset"); }

  const tabs = [["dashboard", "Command center", "◆"], ["request", "Scope analysis", "◫"], ["approvals", "Approvals", "✓"], ["client", "Client view", "◉"], ["reports", "Reports", "▤"]];
  const props = { state, summary, selected, analysis, setTab, selectRequest, updateRequest, createRequest, toggleApproval, saveReport, removeReport, exportText, exportJson, resetWorkspace };
  const pages = { dashboard: <Dashboard {...props}/>, request: <RequestView {...props}/>, approvals: <Approvals {...props}/>, client: <ClientView {...props}/>, reports: <Reports {...props}/> };

  return <div className="app-shell"><aside className="sidebar"><div className="brand"><div className="brand-mark">E</div><div><span>Elite Era Development L.L.C</span><strong>Scope Guard</strong></div></div><nav>{tabs.map(([id, label, icon]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}><i>{icon}</i>{label}</button>)}</nav><div className="side-project"><span>Protected project</span><strong>{state.project.client}</strong><small>{state.project.name}</small><div><b>{state.project.progress}%</b><em>base delivery progress</em></div></div><div className="side-user"><span>HK</span><div><strong>Hira Khyzer</strong><small>Founder · Elite Era</small></div></div></aside><main className="workspace"><header className="topbar"><div><p className="eyebrow">Commercial scope protection system</p><h2>{selected.title}</h2></div><div className="top-actions"><span className="autosave">● Saved locally</span><Button variant="outline" onClick={exportText}>Export</Button><Button onClick={() => setTab("request")}>Analyze request</Button></div></header><div className="mobile-tabs">{tabs.map(([id, label]) => <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>{label}</button>)}</div><section className="workspace-content">{pages[tab]}</section><footer className="footer"><strong>Made by Hira Khyzer</strong><span>Elite Era Development L.L.C</span><b>#f4af00</b></footer></main>{toast && <div className="toast">{toast}</div>}</div>;
}
