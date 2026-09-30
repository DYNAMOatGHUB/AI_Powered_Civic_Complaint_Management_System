import { OFFICERS, INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from "../data/mockComplaints.js";

const STORAGE_KEY = "municipal_officer_complaints_v1";
const NOTIFS_KEY = "municipal_officer_notifications_v1";

// In-memory fallback for environments without browser localStorage (e.g. Node CLI tests)
let inMemoryComplaints = [...INITIAL_COMPLAINTS];
let inMemoryNotifs = [...INITIAL_NOTIFICATIONS];

const loadComplaintsFromStorage = () => {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : inMemoryComplaints;
    }
    return inMemoryComplaints;
  } catch (err) {
    return inMemoryComplaints;
  }
};

const saveComplaintsToStorage = (complaints) => {
  inMemoryComplaints = complaints;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    }
  } catch (err) {}
};

const loadNotificationsFromStorage = () => {
  try {
    if (typeof localStorage !== "undefined") {
      const saved = localStorage.getItem(NOTIFS_KEY);
      return saved ? JSON.parse(saved) : inMemoryNotifs;
    }
    return inMemoryNotifs;
  } catch (err) {
    return inMemoryNotifs;
  }
};

const saveNotificationsToStorage = (notifs) => {
  inMemoryNotifs = notifs;
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(NOTIFS_KEY, JSON.stringify(notifs));
    }
  } catch (err) {}
};

export const apiService = {
  getOfficers: () => OFFICERS,

  getComplaints: async (department = "Electrical") => {
    const allComplaints = loadComplaintsFromStorage();
    if (!department || department === "All") return allComplaints;
    return allComplaints.filter((c) => c.department === department);
  },

  respondToComplaint: async (complaintId, responseData) => {
    const all = loadComplaintsFromStorage();
    const updated = all.map((item) => {
      if (item.id === complaintId) {
        const newHistory = [
          ...(item.history || []),
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            actor: "Officer",
            action: "Responded with action plan",
            details: responseData.message
          }
        ];
        return {
          ...item,
          status: "Ongoing",
          officerResponse: {
            message: responseData.message,
            expectedDate: responseData.expectedDate,
            expectedTime: responseData.expectedTime,
            actionPlan: responseData.actionPlan,
            respondedAt: new Date().toLocaleString()
          },
          history: newHistory
        };
      }
      return item;
    });
    saveComplaintsToStorage(updated);
    return updated;
  },

  submitCompletionEvidence: async (complaintId, evidenceData) => {
    const all = loadComplaintsFromStorage();
    const updated = all.map((item) => {
      if (item.id === complaintId) {
        const newHistory = [
          ...(item.history || []),
          {
            id: `h-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            actor: "Officer",
            action: "Uploaded completion evidence",
            details: "Status changed to Awaiting Citizen Verification"
          }
        ];
        return {
          ...item,
          status: "Awaiting Verification",
          resolutionEvidence: {
            photoUrl: evidenceData.photoUrl || "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
            description: evidenceData.description,
            submittedAt: new Date().toLocaleString()
          },
          history: newHistory
        };
      }
      return item;
    });
    saveComplaintsToStorage(updated);
    return updated;
  },

  verifyByCitizen: async (complaintId, isFixed, rejectionData = {}) => {
    const all = loadComplaintsFromStorage();
    let newNotif = null;

    const updated = all.map((item) => {
      if (item.id === complaintId) {
        const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        if (isFixed) {
          const newHistory = [
            ...(item.history || []),
            {
              id: `h-${Date.now()}`,
              timestamp: nowStr,
              actor: "Citizen",
              action: "Confirmed resolution ✅",
              details: "Verified issue fixed. Status: Completed"
            }
          ];
          newNotif = {
            id: `notif-${Date.now()}`,
            title: "Citizen Resolution Confirmed",
            message: `Citizen verified ${item.id} as resolved. Complaint marked Completed.`,
            timestamp: nowStr,
            type: "verified",
            cid: item.id,
            read: false
          };
          return {
            ...item,
            status: "Completed",
            citizenVerification: {
              status: "fixed",
              rejectionReason: "",
              newPhotoUrl: null,
              verifiedAt: new Date().toLocaleString()
            },
            history: newHistory
          };
        } else {
          const attempts = (item.resolutionAttempts || 0) + 1;
          const isEscalated = attempts >= 2;
          const newHistory = [
            ...(item.history || []),
            {
              id: `h-${Date.now()}`,
              timestamp: nowStr,
              actor: "Citizen",
              action: "Rejected resolution ❌",
              details: rejectionData.rejectionReason || "Issue reported still unresolved"
            }
          ];
          if (isEscalated) {
            newHistory.push({
              id: `h-${Date.now() + 1}`,
              timestamp: nowStr,
              actor: "System",
              action: "Triggered Supervisor Escalation ⚠️",
              details: `Resolution attempts: ${attempts}. Repeat failure flag active.`
            });
          }

          newNotif = {
            id: `notif-${Date.now()}`,
            title: isEscalated ? "⚠️ Supervisor Escalation Alert" : "🔴 Complaint Reopened",
            message: `${item.id} has been reopened. Citizen: "${rejectionData.rejectionReason || "Issue not resolved"}"`,
            timestamp: nowStr,
            type: isEscalated ? "escalated" : "reopened",
            cid: item.id,
            read: false
          };

          return {
            ...item,
            status: "Reopened",
            resolutionAttempts: attempts,
            isEscalated: isEscalated,
            escalationReason: isEscalated ? `This complaint has been reopened ${attempts} times after attempted resolution.` : item.escalationReason,
            citizenVerification: {
              status: "not_fixed",
              rejectionReason: rejectionData.rejectionReason || "Issue not resolved",
              newPhotoUrl: rejectionData.newPhotoUrl || "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800",
              verifiedAt: new Date().toLocaleString()
            },
            history: newHistory
          };
        }
      }
      return item;
    });

    saveComplaintsToStorage(updated);

    if (newNotif) {
      const currentNotifs = loadNotificationsFromStorage();
      saveNotificationsToStorage([newNotif, ...currentNotifs]);
    }

    return { updatedComplaints: updated, newNotification: newNotif };
  },

  getNotifications: () => loadNotificationsFromStorage(),

  markNotificationsRead: () => {
    const notifs = loadNotificationsFromStorage().map((n) => ({ ...n, read: true }));
    saveNotificationsToStorage(notifs);
    return notifs;
  },

  resetDemoData: () => {
    inMemoryComplaints = [...INITIAL_COMPLAINTS];
    inMemoryNotifs = [...INITIAL_NOTIFICATIONS];
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(NOTIFS_KEY);
      }
    } catch (err) {}
    return INITIAL_COMPLAINTS;
  }
};
