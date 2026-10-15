import { describe, expect, it } from "vitest";
import { cloneInitialState } from "./data";
import { analyzeChange, approvalGate, clientSafeSummary, commercialSensitivity, portfolioSummary } from "./engine";

describe("scope guard analysis engine", () => {
  it("calculates price, cost, margin, hours, and a decision", () => {
    const state = cloneInitialState();
    const request = state.requests[0];
    const analysis = analyzeChange(request, state.project, state.team, state.baseScope);
    expect(analysis.totalHours).toBeGreaterThan(0);
    expect(analysis.finalPrice).toBeGreaterThan(analysis.totalCost);
    expect(analysis.margin).toBeGreaterThan(0);
    expect(["Approve", "Negotiate", "Re-quote", "Reject"]).toContain(analysis.decision);
  });

  it("protects the price from falling below the margin floor", () => {
    const state = cloneInitialState();
    const analysis = analyzeChange({ ...state.requests[0], discount: 25 }, state.project, state.team, state.baseScope);
    expect(analysis.finalPrice).toBeGreaterThanOrEqual(analysis.marginFloor);
  });

  it("adds higher pressure for urgent enterprise scope", () => {
    const state = cloneInitialState();
    const moderate = analyzeChange({ ...state.requests[0], complexity: "moderate", urgency: "normal" }, state.project, state.team, state.baseScope);
    const heavy = analyzeChange({ ...state.requests[0], complexity: "enterprise", urgency: "rush" }, state.project, state.team, state.baseScope);
    expect(heavy.totalHours).toBeGreaterThan(moderate.totalHours);
    expect(heavy.riskScore).toBeGreaterThanOrEqual(moderate.riskScore);
  });

  it("creates a client-safe summary without internal cost fields", () => {
    const state = cloneInitialState();
    const analysis = analyzeChange(state.requests[0], state.project, state.team, state.baseScope);
    const summary = clientSafeSummary(state.project, state.requests[0], analysis);
    expect(summary.investment).toBeTruthy();
    expect(summary.scope).toBeTruthy();
    expect(summary.internalCost).toBeUndefined();
  });

  it("summarizes scope portfolio exposure", () => {
    const state = cloneInitialState();
    const summary = portfolioSummary(state.requests, state.project, state.team, state.baseScope);
    expect(summary.analyses).toHaveLength(state.requests.length);
    expect(summary.exposure).toBeGreaterThan(0);
    expect(summary.blockedApprovals).toBeGreaterThanOrEqual(0);
  });

  it("blocks implementation when a required approval is missing", () => {
    const gate = approvalGate({ approvals: { Finance: true } }, ["Finance", "Project Manager", "Client"]);
    expect(gate.ready).toBe(false);
    expect(gate.missing).toEqual(["Project Manager", "Client"]);
  });

  it("shows how discounts affect margin while preserving the commercial floor", () => {
    const state = cloneInitialState();
    const rows = commercialSensitivity(state.requests[0], state.project, state.team, state.baseScope, [0, 10, 25]);
    expect(rows).toHaveLength(3);
    expect(rows[2].margin).toBeLessThanOrEqual(rows[0].margin);
    expect(rows.every((row) => row.margin >= 28 - 0.0001)).toBe(true);
  });
});
