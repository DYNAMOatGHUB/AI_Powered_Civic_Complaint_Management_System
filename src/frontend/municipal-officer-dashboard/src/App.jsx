import React, { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, ShieldAlert, CheckCircle, Clock, AlertTriangle,
  RefreshCw, ListFilter, Building2, MapPin
} from "lucide-react";
import Header from "./components/Header";
import OfficerLogin from "./components/OfficerLogin";
import ComplaintCard from "./components/ComplaintCard";
import ComplaintDetail from "./components/ComplaintDetail";
import OfficerProfileModal from "./components/OfficerProfileModal";
import { OFFICERS } from "./data/mockComplaints.js";
import { apiService } from "./services/apiService.js";

// LocalStorage Keys for persistent session state across page refreshes
const AUTH_KEY = "municipal_officer_auth_session_v1";
const TAB_KEY = "municipal_officer_active_tab_v1";
const COMPLAINT_KEY = "municipal_officer_selected_cid_v1";
const FILTER_KEY = "municipal_officer_filters_v1";

export default function App() {
  // Restore saved auth session from localStorage if available
  const [currentOfficer, setCurrentOfficer] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (err) {
      return null;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_KEY);
      return !!saved;
    } catch (err) {
      return false;
    }
  });

  // Restore active tab (Pending, Ongoing, Completed)
  const [activeTab, setActiveTab] = useState(() => {
    try {
      return localStorage.getItem(TAB_KEY) || "Pending";
    } catch (err) {
      return "Pending";
    }
  });

  // Restore selected complaint ID
  const [selectedComplaintId, setSelectedComplaintId] = useState(() => {
    try {
      return localStorage.getItem(COMPLAINT_KEY) || null;
    } catch (err) {
      return null;
    }
  });

  // Restore search query & filters
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      const saved = localStorage.getItem(FILTER_KEY);
      return saved ? JSON.parse(saved).searchQuery || "" : "";
    } catch (err) {
      return "";
    }
  });

  const [priorityFilter, setPriorityFilter] = useState(() => {
    try {
      const saved = localStorage.getItem(FILTER_KEY);
      return saved ? JSON.parse(saved).priorityFilter || "All" : "All";
    } catch (err) {
      return "All";
    }
  });

  const [dateFilter, setDateFilter] = useState(() => {
    try {
      const saved = localStorage.getItem(FILTER_KEY);
      return saved ? JSON.parse(saved).dateFilter || "All" : "All";
    } catch (err) {
      return "All";
    }
  });

  // Data states
  const [complaints, setComplaints] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Save session state to localStorage whenever changed
  useEffect(() => {
    if (isLoggedIn && currentOfficer) {
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(currentOfficer));
      } catch (err) {}
    } else {
      try {
        localStorage.removeItem(AUTH_KEY);
      } catch (err) {}
    }
  }, [isLoggedIn, currentOfficer]);

  useEffect(() => {
    try {
      localStorage.setItem(TAB_KEY, activeTab);
    } catch (err) {}
  }, [activeTab]);

  useEffect(() => {
    try {
      if (selectedComplaintId) {
        localStorage.setItem(COMPLAINT_KEY, selectedComplaintId);
      } else {
        localStorage.removeItem(COMPLAINT_KEY);
      }
    } catch (err) {}
  }, [selectedComplaintId]);

  useEffect(() => {
    try {
      localStorage.setItem(FILTER_KEY, JSON.stringify({ searchQuery, priorityFilter, dateFilter }));
    } catch (err) {}
  }, [searchQuery, priorityFilter, dateFilter]);

  // Fetch complaints on officer login/department change
  const loadData = async () => {
    if (!currentOfficer) return;
    setIsLoading(true);
    try {
      const data = await apiService.getComplaints(currentOfficer.department);
      setComplaints(data);
      const notifs = apiService.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error("Failed to load complaints:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && currentOfficer) {
      loadData();
    }
  }, [currentOfficer, isLoggedIn]);

  // Priority & Date sorting logic for officer department queue
  const filteredAndSortedComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        if (activeTab === "Pending") {
          return c.status === "Pending" || c.status === "Reopened";
        }
        if (activeTab === "Ongoing") {
          return c.status === "Ongoing" || c.status === "Awaiting Verification";
        }
        if (activeTab === "Completed") {
          return c.status === "Completed";
        }
        return true;
      })
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.locationAddress.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
        );
      })
      .filter((c) => {
        if (priorityFilter === "All") return true;
        return c.priority === priorityFilter;
      })
      .filter((c) => {
        if (dateFilter === "All") return true;
        if (dateFilter === "Today") return c.dateGroup?.includes("TODAY");
        if (dateFilter === "Yesterday") return c.dateGroup?.includes("YESTERDAY");
        return true;
      })
      .sort((a, b) => {
        const priorityRank = { P1: 1, P2: 2, P3: 3, P4: 4 };
        const pDiff = (priorityRank[a.priority] || 5) - (priorityRank[b.priority] || 5);
        if (pDiff !== 0) return pDiff;
        return (b.priorityScore || 0) - (a.priorityScore || 0);
      });
  }, [complaints, activeTab, searchQuery, priorityFilter, dateFilter]);

  // Group complaints by Date Headers
  const groupedComplaints = useMemo(() => {
    const groups = {};
    filteredAndSortedComplaints.forEach((item) => {
      const groupKey = item.dateGroup || item.submissionDate || "TODAY — AUGUST 8";
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(item);
    });
    return groups;
  }, [filteredAndSortedComplaints]);

  // Selected complaint object derived from ID
  const selectedComplaint = useMemo(() => {
    if (!selectedComplaintId) return null;
    return complaints.find((c) => c.id === selectedComplaintId) || null;
  }, [complaints, selectedComplaintId]);

  // Counts for main tabs badges
  const counts = useMemo(() => {
    return {
      Pending: complaints.filter((c) => c.status === "Pending" || c.status === "Reopened").length,
      Ongoing: complaints.filter((c) => c.status === "Ongoing" || c.status === "Awaiting Verification").length,
      Completed: complaints.filter((c) => c.status === "Completed").length
    };
  }, [complaints]);

  // Actions
  const handleRespondToComplaint = async (cid, responseData) => {
    const updatedList = await apiService.respondToComplaint(cid, responseData);
    setComplaints(updatedList.filter((c) => c.department === currentOfficer.department));
  };

  const handleSubmitEvidence = async (cid, evidenceData) => {
    const updatedList = await apiService.submitCompletionEvidence(cid, evidenceData);
    setComplaints(updatedList.filter((c) => c.department === currentOfficer.department));
  };

  const handleVerifyCitizen = async (cid, isFixed, rejectionData) => {
    const res = await apiService.verifyByCitizen(cid, isFixed, rejectionData);
    const deptComplaints = res.updatedComplaints.filter((c) => c.department === currentOfficer.department);
    setComplaints(deptComplaints);
    const notifs = apiService.getNotifications();
    setNotifications(notifs);
  };

  const handleSelectNotification = (cid) => {
    const target = complaints.find((c) => c.id === cid);
    if (target) {
      if (target.status === "Pending" || target.status === "Reopened") setActiveTab("Pending");
      else if (target.status === "Ongoing" || target.status === "Awaiting Verification") setActiveTab("Ongoing");
      else setActiveTab("Completed");

      setSelectedComplaintId(target.id);
    }
  };

  const handleResetDemoData = () => {
    const fresh = apiService.resetDemoData();
    if (currentOfficer) {
      setComplaints(fresh.filter((c) => c.department === currentOfficer.department));
    }
    setNotifications(apiService.getNotifications());
    setSelectedComplaintId(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentOfficer(null);
    setSelectedComplaintId(null);
    setComplaints([]);
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(TAB_KEY);
      localStorage.removeItem(COMPLAINT_KEY);
      localStorage.removeItem(FILTER_KEY);
    } catch (err) {}
  };

  if (!isLoggedIn || !currentOfficer) {
    return (
      <OfficerLogin
        onLogin={(officer) => {
          setCurrentOfficer(officer);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafb] flex flex-col font-sans text-[#191c1d]">
      {/* Header Bar */}
      <Header
        currentOfficer={currentOfficer}
        notifications={notifications}
        onSelectNotification={handleSelectNotification}
        onMarkAllRead={() => setNotifications(apiService.markNotificationsRead())}
        onResetDemo={handleResetDemoData}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {selectedComplaint ? (
          /* Dedicated Complaint Detail Panel */
          <ComplaintDetail
            complaint={selectedComplaint}
            onBack={() => setSelectedComplaintId(null)}
            onRespond={handleRespondToComplaint}
            onSubmitEvidence={handleSubmitEvidence}
            onVerifyCitizen={handleVerifyCitizen}
          />
        ) : (
          /* Main Dashboard Work Queue */
          <div className="space-y-6">
            {/* Top Workspace Header & Role Information */}
            <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#00355f] tracking-tight">
                    {currentOfficer.department} Department Work Queue
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00355f]/10 text-[#00355f] border border-[#00355f]/20">
                    {currentOfficer.ward}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Logged in as <strong className="text-slate-800">{currentOfficer.name}</strong> ({currentOfficer.role}). Showing active complaints for {currentOfficer.department} department.
                </p>
              </div>

              {/* Status Navigation Tabs */}
              <div className="flex border-b border-slate-200 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab("Pending")}
                  className={`px-5 py-2.5 text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "Pending"
                      ? "text-[#00355f] border-b-2 border-[#00355f]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>Pending</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      counts.Pending > 0 ? "bg-[#ba1a1a] text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {counts.Pending}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("Ongoing")}
                  className={`px-5 py-2.5 text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "Ongoing"
                      ? "text-[#00355f] border-b-2 border-[#00355f]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>Ongoing</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {counts.Ongoing}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("Completed")}
                  className={`px-5 py-2.5 text-xs font-bold transition-all flex items-center space-x-2 ${
                    activeTab === "Completed"
                      ? "text-[#00355f] border-b-2 border-[#00355f]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <span>Completed</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                    {counts.Completed}
                  </span>
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="bg-white p-3.5 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[240px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search complaint ID, location or problem..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#00355f] focus:bg-white"
                />
              </div>

              {/* Priority & Date Filters */}
              <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-500 font-semibold">Priority:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="All">All Priorities</option>
                    <option value="P1">🔴 P1 — Critical</option>
                    <option value="P2">🟠 P2 — High</option>
                    <option value="P3">🟡 P3 — Medium</option>
                    <option value="P4">🟢 P4 — Low</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5">
                  <span className="text-slate-500 font-semibold">Date:</span>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="bg-transparent font-bold text-slate-800 focus:outline-hidden"
                  >
                    <option value="All">All Dates</option>
                    <option value="Today">Today</option>
                    <option value="Yesterday">Yesterday</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Complaint List Grouped by Date */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#00355f]" />
                <p className="text-xs">Loading {currentOfficer.department} department queue...</p>
              </div>
            ) : Object.keys(groupedComplaints).length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3 shadow-xs">
                <div className="p-3 bg-slate-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center text-slate-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  No {activeTab} Complaints Found for {currentOfficer.department}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery || priorityFilter !== "All"
                    ? "No complaints match your current search and filter settings."
                    : `There are currently no ${activeTab.toLowerCase()} complaints in your ${currentOfficer.department} department queue.`}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedComplaints).map(([dateGroup, items]) => (
                  <div key={dateGroup} className="space-y-3">
                    {/* Date Section Header */}
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded">
                        {dateGroup}
                      </span>
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[11px] text-slate-400 font-medium">
                        {items.length} {items.length === 1 ? "complaint" : "complaints"}
                      </span>
                    </div>

                    {/* Complaint Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((complaint) => (
                        <ComplaintCard
                          key={complaint.id}
                          complaint={complaint}
                          isSelected={selectedComplaint?.id === complaint.id}
                          onSelect={(item) => setSelectedComplaintId(item.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Officer Profile Modal */}
      <OfficerProfileModal
        officer={currentOfficer}
        activeCount={complaints.length}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-wrap justify-between items-center gap-2">
          <span>Municipal Civic Complaint System — Ward 1 Operational Portal</span>
          <span className="text-[11px] text-slate-400">
            Backend API ready for FastAPI + PostgreSQL / SQLAlchemy integration
          </span>
        </div>
      </footer>
    </div>
  );
}
