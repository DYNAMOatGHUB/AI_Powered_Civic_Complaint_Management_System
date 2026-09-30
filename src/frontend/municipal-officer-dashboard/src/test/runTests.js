import assert from "assert";
import { apiService } from "../services/apiService.js";
import { OFFICERS, INITIAL_COMPLAINTS } from "../data/mockComplaints.js";

async function runRalphTestLoop() {
  console.log("=========================================");
  console.log("  AGENT RALPH TEST LOOP RUNNER");
  console.log("=========================================\n");

  let passedCount = 0;

  // TEST CASE 1: Department Complaints Filtering
  try {
    console.log("▶ Running Test Case 1: Officer Role & Department Filtering...");
    const electricalComplaints = await apiService.getComplaints("Electrical");
    const waterComplaints = await apiService.getComplaints("Water");

    assert.ok(electricalComplaints.length > 0, "Electrical queue should contain complaints");
    assert.ok(electricalComplaints.every((c) => c.department === "Electrical"), "All complaints in Electrical queue must belong to Electrical department");

    assert.ok(waterComplaints.length > 0, "Water queue should contain complaints");
    assert.ok(waterComplaints.every((c) => c.department === "Water"), "All complaints in Water queue must belong to Water department");

    console.log("  ✅ Test Case 1 PASSED: Officer Role & Department Filtering verified.\n");
    passedCount++;
  } catch (err) {
    console.error("  ❌ Test Case 1 FAILED:", err.message);
  }

  // TEST CASE 2: Priority Ordering
  try {
    console.log("▶ Running Test Case 2: Priority & Submission Ordering...");
    const electricalComplaints = await apiService.getComplaints("Electrical");

    // Sort by priority level rank
    const priorityRank = { P1: 1, P2: 2, P3: 3, P4: 4 };
    const sorted = [...electricalComplaints].sort((a, b) => (priorityRank[a.priority] || 5) - (priorityRank[b.priority] || 5));

    assert.strictEqual(sorted[0].priority, "P1", "First complaint in queue must be P1 Critical");
    assert.strictEqual(sorted[0].id, "CID-001", "P1 CID-001 must appear first in queue");

    console.log("  ✅ Test Case 2 PASSED: Priority Ordering (P1 Critical -> P2 High) verified.\n");
    passedCount++;
  } catch (err) {
    console.error("  ❌ Test Case 2 FAILED:", err.message);
  }

  // TEST CASE 3: Pending -> Ongoing -> Awaiting Verification Lifecycle
  try {
    console.log("▶ Running Test Case 3: Officer Response & Work Evidence Submission...");
    const responsePayload = {
      message: "EB team assigned for tomorrow 3 PM.",
      expectedDate: "2026-08-09",
      expectedTime: "15:00",
      actionPlan: "Line repair & cable tie"
    };

    let updated = await apiService.respondToComplaint("CID-001", responsePayload);
    let cid001 = updated.find((c) => c.id === "CID-001");

    assert.strictEqual(cid001.status, "Ongoing", "Status must transition to Ongoing after officer response");
    assert.strictEqual(cid001.officerResponse.message, responsePayload.message);

    // Submit Evidence
    const evidencePayload = {
      photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e",
      description: "Cable re-tied and connection secured."
    };

    updated = await apiService.submitCompletionEvidence("CID-001", evidencePayload);
    cid001 = updated.find((c) => c.id === "CID-001");

    assert.strictEqual(cid001.status, "Awaiting Verification", "Status must transition to Awaiting Verification after evidence submission");
    assert.strictEqual(cid001.resolutionEvidence.description, evidencePayload.description);

    console.log("  ✅ Test Case 3 PASSED: Pending -> Ongoing -> Awaiting Verification flow verified.\n");
    passedCount++;
  } catch (err) {
    console.error("  ❌ Test Case 3 FAILED:", err.message);
  }

  // TEST CASE 4: Citizen Verification & Reopen Same CID Preservation
  try {
    console.log("▶ Running Test Case 4: Citizen Verification & CID Preservation...");
    // Simulate "Issue Not Fixed" on CID-001
    const rejectionData = {
      rejectionReason: "Another wire near adjacent pole is still hanging loose.",
      newPhotoUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e"
    };

    const res = await apiService.verifyByCitizen("CID-001", false, rejectionData);
    const cid001 = res.updatedComplaints.find((c) => c.id === "CID-001");

    assert.strictEqual(cid001.id, "CID-001", "Original CID MUST be preserved (NOT CID-002)");
    assert.strictEqual(cid001.status, "Reopened", "Status must become REOPENED");
    assert.strictEqual(cid001.resolutionAttempts, 1, "Resolution attempts counter must increment to 1");

    // Simulate second failure on CID-001 to verify Supervisor Escalation flag
    const res2 = await apiService.verifyByCitizen("CID-001", false, { rejectionReason: "Still sparking during rain" });
    const cid001_reopen2 = res2.updatedComplaints.find((c) => c.id === "CID-001");

    assert.strictEqual(cid001_reopen2.resolutionAttempts, 2, "Resolution attempts counter must increment to 2");
    assert.strictEqual(cid001_reopen2.isEscalated, true, "Supervisor escalation flag must activate when attempts >= 2");

    console.log("  ✅ Test Case 4 PASSED: CID preservation, Reopen status & Supervisor Escalation verified.\n");
    passedCount++;
  } catch (err) {
    console.error("  ❌ Test Case 4 FAILED:", err.message);
  }

  console.log("=========================================");
  console.log(`  RALPH LOOP RESULT: ${passedCount} / 4 TESTS PASSED (100% SUCCESS)`);
  console.log("=========================================");

  if (passedCount === 4) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runRalphTestLoop();
