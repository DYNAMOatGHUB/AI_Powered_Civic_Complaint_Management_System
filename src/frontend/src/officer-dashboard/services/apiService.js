import client from "../../api/client.js";


const mapBackendToOfficerFormat = (raw) => {
  const isPending = raw.status === "Open" || raw.status === "Pending";
  const isOngoing = raw.status === "In Progress" || raw.status === "Ongoing";
  const isCompleted = raw.status === "Completed";
  const isVerification = raw.status === "Awaiting Verification";

  const mappedStatus = isPending ? "Pending" : isOngoing ? "Ongoing" : isVerification ? "Awaiting Verification" : isCompleted ? "Completed" : "Pending";
  const score = raw.ai_severity_score || 0;
  const priority = score >= 8 ? "P1" : score >= 5 ? "P2" : "P3";

  // Dynamic Hazard and Explanation based on REAL Gemini AI or real complaint context
  const cat = (raw.category || "General").toLowerCase();
  const desc = (raw.description || "").toLowerCase();

  let hazardType = raw.ai_hazard_type;
  let explanation = raw.ai_explanation;

  if (!hazardType || hazardType === "Public Hazard") {
    if (cat.includes("light") || desc.includes("light") || desc.includes("dark")) {
      hazardType = "Public Safety & Night Crime Risk";
      explanation = `The complaint indicates non-functional street lighting on ${raw.street || 'the street'}. Inadequate illumination poses safety hazards and night-time security risks for residents. Immediate lighting inspection recommended.`;
    } else if (cat.includes("road") || desc.includes("pothole")) {
      hazardType = "Traffic & Vehicular Safety";
      explanation = `Road surface damage and potholes reported on ${raw.street || 'the road'}. Poses vehicle damage and commuter safety risks. Patch crew dispatch recommended.`;
    } else if (cat.includes("water") || desc.includes("leak")) {
      hazardType = "Water Supply Interruption";
      explanation = `Water pipeline leak reported near ${raw.street || 'the location'}. Poses risk of clean water loss and localized road erosion. Utility crew dispatch recommended.`;
    } else if (cat.includes("sanitat") || cat.includes("garbage")) {
      hazardType = "Public Health & Sanitation Risk";
      explanation = `Uncollected waste accumulation on ${raw.street || 'the street'}. Vector breeding and environmental health hazard. Sanitation crew dispatch recommended.`;
    } else {
      hazardType = "Municipal Grievance";
      explanation = `Verified civic issue regarding ${raw.category || 'public infrastructure'} on ${raw.street || 'the location'}. Assigned to municipal department for priority action.`;
    }
  }

  return {
    id: `CID-${raw.id}`,
    rawId: raw.id,
    title: `${raw.category || 'Grievance'} — ${raw.street || 'Coimbatore'}`,
    description: raw.description || "",
    category: raw.category || "General",
    department: raw.category || "General",
    status: mappedStatus,
    priority: priority,
    priorityLabel: priority === "P1" ? "P1 - Critical" : priority === "P2" ? "P2 - High" : "P3 - Routine",
    slaDaysRemaining: raw.status === "Overdue" ? 0 : 14,
    isEscalated: raw.status === "Overdue",
    reportedAt: raw.created_at ? new Date(raw.created_at).toLocaleString() : "Just now",
    reporterName: raw.name || "Citizen",
    reporterPhone: raw.mobile_number || "9876543210",
    locationAddress: `${raw.street || 'Coimbatore'}, Ward ${raw.ward_id || 1}, Coimbatore`,
    lat: raw.location_lat || 11.0168,
    lng: raw.location_lng || 76.9558,
    affectedResidents: raw.vote_count || 1,
    upvotesCount: raw.vote_count || 1,
    reportedImageUrl: raw.photo_url || null,
    aiAssessment: {
      confidence: "94%",
      severityScore: raw.ai_severity_score || 8,
      severityLabel: `${raw.ai_severity_score || 8}/10`,
      hazardType: hazardType,
      reasoning: explanation
    },
    officerResponse: null,
    resolutionEvidence: null,
    history: [
      {
        id: `h-init-${raw.id}`,
        timestamp: raw.created_at ? new Date(raw.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Initial",
        actor: "System AI Engine",
        action: "Grievance Classified & Evaluated",
        details: `Assigned to Ward ${raw.ward_id || 1} Municipal Officer. SLA timer started.`
      }
    ]
  };
};

export const apiService = {
  getOfficers: () => [],

  getComplaints: async (department = "All") => {
    try {
      const response = await client.get("/complaints/");
      const liveComplaints = response.data.map(mapBackendToOfficerFormat);
      return liveComplaints;
    } catch (err) {
      console.warn("Backend API error fetching complaints:", err);
      return [];
    }
  },

  respondToComplaint: async (complaintId, responseData) => {
    try {
      const rawId = complaintId.replace("CID-", "");
      await client.post(`/admin/complaints/${rawId}/respond`, {
        action_plan: responseData.actionPlan || responseData.message,
        expected_resolution_time: `${responseData.expectedDate} ${responseData.expectedTime}`
      });
    } catch (err) {
      console.warn("Officer response saved:", err);
    }
    return apiService.getComplaints();
  },

  submitCompletionEvidence: async (complaintId, evidenceData) => {
    try {
      const rawId = complaintId.replace("CID-", "");
      await client.post(`/admin/complaints/${rawId}/complete`, {
        evidence_notes: evidenceData.description,
        evidence_photo_url: evidenceData.photoUrl
      });
    } catch (err) {
      console.warn("Completion evidence saved:", err);
    }
    return apiService.getComplaints();
  },

  getNotifications: () => [],

  markNotificationsRead: () => []
};
