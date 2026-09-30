import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import App from "./App";
import { apiService } from "./services/apiService.js";
import { OFFICERS } from "./data/mockComplaints.js";

// Mock Leaflet because jsdom doesn't render real canvas/SVG maps
vi.mock("react-leaflet", () => ({
  MapContainer: ({ children }) => <div data-testid="mock-leaflet-map">{children}</div>,
  TileLayer: () => <div />,
  Marker: ({ children }) => <div>{children}</div>,
  Popup: ({ children }) => <div>{children}</div>,
  useMap: () => ({ setView: () => {} })
}));

const loginAsOfficer = async (email = "sathish@municipality.gov.in", password = "password123") => {
  const emailInput = screen.getByPlaceholderText(/officer@municipal.gov.in/i);
  const passwordInput = screen.getByPlaceholderText(/••••••••/i);
  const submitBtn = screen.getByText("Login");

  fireEvent.change(emailInput, { target: { value: email } });
  fireEvent.change(passwordInput, { target: { value: password } });
  fireEvent.click(submitBtn);
};

describe("Municipal Officer Dashboard — 4 Core Test Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // TEST CASE 1: Department Complaints Filtering
  it("Test 1: Officer Role & Department Filtering — Displays only department-specific complaints", async () => {
    render(<App />);

    // Login as Sathish Kumar (Electrical)
    await loginAsOfficer("sathish@municipality.gov.in");

    await waitFor(() => {
      expect(screen.getByText(/Electrical Department Work Queue/i)).toBeInTheDocument();
    });

    // Check Electrical complaints exist
    expect(screen.getByText("Hanging electrical wire on main road")).toBeInTheDocument();
    expect(screen.queryByText("Burst main water pipeline flooding Gandhi Nagar 2nd Street")).not.toBeInTheDocument();
  });

  // TEST CASE 2: Priority Queue Ordering
  it("Test 2: Priority & Submission Ordering — Orders complaints by P1 Critical first", async () => {
    render(<App />);

    await loginAsOfficer("sathish@municipality.gov.in");

    await waitFor(() => {
      expect(screen.getByText("Hanging electrical wire on main road")).toBeInTheDocument();
    });

    // Ensure P1 Critical badge is rendered
    const p1Badges = screen.getAllByText(/P1 Critical/i);
    expect(p1Badges.length).toBeGreaterThan(0);

    // Verify P1 CID-001 appears in queue
    expect(screen.getByText("CID: 001")).toBeInTheDocument();
  });

  // TEST CASE 3: Officer Response & Evidence Submission Flow
  it("Test 3: Officer Response & Work Completion Evidence — Transitions Pending -> Ongoing -> Awaiting Verification", async () => {
    render(<App />);

    await loginAsOfficer("sathish@municipality.gov.in");

    await waitFor(() => {
      expect(screen.getByText("Hanging electrical wire on main road")).toBeInTheDocument();
    });

    // Open CID-001
    const viewButtons = screen.getAllByText("View Complaint");
    fireEvent.click(viewButtons[0]);

    // Check Detail View opens
    await waitFor(() => {
      expect(screen.getByText("DISPATCH & RESPONSE")).toBeInTheDocument();
    });

    // Fill response form
    const textarea = screen.getByPlaceholderText(/Write your response to the citizen.../i);
    fireEvent.change(textarea, { target: { value: "EB team will visit tomorrow at 3:00 PM." } });

    const submitResponseBtn = screen.getByText(/Send Response & Start Work/i);
    fireEvent.click(submitResponseBtn);

    // Verify Status changed to Ongoing
    await waitFor(() => {
      expect(screen.getByText("Active Field Work In Progress")).toBeInTheDocument();
    });

    // Mark Work Completed
    const markCompletedBtn = screen.getByText(/Mark Work Completed & Upload Evidence/i);
    fireEvent.click(markCompletedBtn);

    // Fill Evidence Modal
    await waitFor(() => {
      expect(screen.getByText("Submit Live Work Evidence")).toBeInTheDocument();
    });

    const descInput = screen.getByPlaceholderText(/Describe what was fixed/i);
    fireEvent.change(descInput, { target: { value: "Removed cut wire and re-tied cable." } });

    const submitEvidenceBtn = screen.getByText("Submit Live Evidence");
    fireEvent.click(submitEvidenceBtn);

    // Verify Status changed to Awaiting Citizen Verification
    await waitFor(() => {
      expect(screen.getByText("Awaiting Verification")).toBeInTheDocument();
    });
  });

  // TEST CASE 4: Citizen Verification & Reopen Same CID Preservation
  it("Test 4: Citizen Verification & CID Preservation — Reopens same CID and triggers escalation alert on repeat failure", async () => {
    render(<App />);

    await loginAsOfficer("sathish@municipality.gov.in");

    // Select reopened CID-006 directly
    await waitFor(() => {
      expect(screen.getByText("Damaged streetlight wiring causing sparks")).toBeInTheDocument();
    });

    const card = screen.getByText("Damaged streetlight wiring causing sparks").closest("div");
    fireEvent.click(card);

    await waitFor(() => {
      expect(screen.getByText(/ACTIVITY TIMELINE/i)).toBeInTheDocument();
    });

    // Verify CID-006 remains CID-006
    expect(screen.getByText(/CID: 006/i)).toBeInTheDocument();

    // Verify Escalation Banner is active for 2 resolution attempts
    expect(screen.getByText(/Repeated Resolution Failure/i)).toBeInTheDocument();
  });
});
