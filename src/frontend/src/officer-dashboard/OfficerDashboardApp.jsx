import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, ShieldAlert, CheckCircle, Clock, AlertTriangle,
  RefreshCw, ListFilter, Building2, MapPin
} from "lucide-react";
import Header from "./components/Header";
import ComplaintCard from "./components/ComplaintCard";
import ComplaintDetail from "./components/ComplaintDetail";
import OfficerProfileModal from "./components/OfficerProfileModal";
import { apiService } from "./services/apiService.js";

export default function OfficerDashboardApp({ officer, currentOfficer: propOfficer, onLogout }) {
  const currentOfficer = officer || propOfficer || {
    id: "OFF-001",
    name: "Mr. Karthikeyan",
    email: "karthikeyan@coimbatorecorp.gov.in",
    role: "Ward Officer",
    department: "Roads & Highways",
    ward: "Ward 1 — RS Puram, Coimbatore"
  };

  const [activeTab, setActiveTab] = useState("Pending");
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getComplaints(currentOfficer.department || "All");
      setComplaints(data);
      const notifs = apiService.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error("Error loading officer data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [currentOfficer]);

  const counts = useMemo(() => {
    return {
      Pending: complaints.filter((c) => c.status === "Pending" || c.status === "Reopened").length,
      Ongoing: complaints.filter((c) => c.status === "Ongoing" || c.status === "Awaiting Verification").length,
      Completed: complaints.filter((c) => c.status === "Completed").length,
      Escalated: complaints.filter((c) => c.isEscalated).length
    };
  }, [complaints]);

  // Requirement 8: SEVERITY-FIRST PRIORITY ORDERING
  // Ordering logic: 1. Severity (P1/HIGH > P2/MEDIUM > P3/LOW), 2. Community Upvotes (Desc), 3. Waiting Time (Asc)
  const filteredComplaints = useMemo(() => {
    const list = complaints.filter((item) => {
      if (activeTab === "Pending" && item.status !== "Pending" && item.status !== "Reopened") return false;
      if (activeTab === "Ongoing" && item.status !== "Ongoing" && item.status !== "Awaiting Verification") return false;
      if (activeTab === "Completed" && item.status !== "Completed") return false;

      if (priorityFilter !== "All" && item.priority !== priorityFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        const matchesLocation = (item.locationAddress || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesId && !matchesLocation) return false;
      }

      return true;
    });

    return list.sort((a, b) => {
      // Primary sort: Exact Severity Score First
      const scoreA = a.aiAssessment?.severityScore || 0;
      const scoreB = b.aiAssessment?.severityScore || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }

      // Secondary sort: Community Upvotes
      if ((b.upvotesCount || 0) !== (a.upvotesCount || 0)) {
        return (b.upvotesCount || 0) - (a.upvotesCount || 0);
      }

      // Tertiary sort: Time Open (Older first)
      return new Date(a.reportedAt || 0) - new Date(b.reportedAt || 0);
    });
  }, [complaints, activeTab, priorityFilter, searchQuery]);

  const selectedComplaint = useMemo(() => {
    if (!selectedComplaintId) return null;
    return complaints.find((c) => c.id === selectedComplaintId) || null;
  }, [complaints, selectedComplaintId]);

  const handleRespond = async (complaintId, responseData) => {
    const updated = await apiService.respondToComplaint(complaintId, responseData);
    setComplaints(updated);
  };

  const handleSubmitEvidence = async (complaintId, evidenceData) => {
    const updated = await apiService.submitCompletionEvidence(complaintId, evidenceData);
    setComplaints(updated);
  };

  const handleMarkAllRead = () => {
    const updatedNotifs = apiService.markNotificationsRead();
    setNotifications(updatedNotifs);
  };

  if (selectedComplaint) {
    return (
      <ComplaintDetail
        complaint={selectedComplaint}
        onBack={() => setSelectedComplaintId(null)}
        onRespond={handleRespond}
        onSubmitEvidence={handleSubmitEvidence}
      />
    );
  }

  return (
    <div className="bg-[#f8fafb] text-[#191c1d] min-h-screen flex flex-col font-sans">
      <Header
        currentOfficer={currentOfficer}
        notifications={notifications}
        onSelectNotification={(cid) => setSelectedComplaintId(cid)}
        onMarkAllRead={handleMarkAllRead}
        onLogout={onLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {counts.Escalated > 0 && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between text-red-950 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-600 text-white rounded-lg">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-red-900">
                  ⚠️ {counts.Escalated} Critical Escalation Alert{counts.Escalated > 1 ? "s" : ""}
                </h4>
                <p className="text-xs text-red-800">
                  Complaints reopened multiple times after attempted resolution require supervisor intervention.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("Pending")}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs"
            >
              Filter Pending
            </button>
          </div>
        )}

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl max-w-md w-full">
              {[
                { id: "Pending", label: "Pending Review", count: counts.Pending, icon: Clock, color: "text-amber-600" },
                { id: "Ongoing", label: "In Progress", count: counts.Ongoing, icon: RefreshCw, color: "text-emerald-600" },
                { id: "Completed", label: "Completed", count: counts.Completed, icon: CheckCircle, color: "text-emerald-600" }
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      isActive
                        ? "bg-[#065f46] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${isActive ? "text-white" : tab.color}`} />
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? "bg-emerald-800 text-white" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search CID or location..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-[#065f46] focus:outline-hidden"
                />
              </div>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="py-2 px-3 text-xs border border-slate-300 rounded-lg bg-slate-50 font-semibold focus:ring-2 focus:ring-[#065f46]"
              >
                <option value="All">All Priorities</option>
                <option value="P1">P1 - Critical</option>
                <option value="P2">P2 - High</option>
                <option value="P3">P3 - Routine</option>
              </select>
            </div>
          </div>

          <div>
            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <ListFilter className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-700 text-sm">No complaints found</h4>
                <p className="text-xs text-slate-500 mt-1">Try resetting search filters or changing active tabs.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredComplaints.map((item) => (
                  <ComplaintCard
                    key={item.id}
                    complaint={item}
                    isSelected={selectedComplaintId === item.id}
                    onSelect={(c) => setSelectedComplaintId(c.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <OfficerProfileModal
        officer={currentOfficer}
        activeCount={counts.Pending + counts.Ongoing}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}
