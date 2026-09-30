import React, { useState, useEffect } from 'react';
import { ShieldCheck, Filter, AlertTriangle, Clock, CheckCircle, Calendar, Flag, User, MapPin } from 'lucide-react';
import client from '../api/client';

function OfficerDashboard({ wards }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [performanceFlags, setPerformanceFlags] = useState([]);
  
  const [filterWard, setFilterWard] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [plannedInspection, setPlannedInspection] = useState('');
  const [plannedStart, setPlannedStart] = useState('');
  const [plannedFix, setPlannedFix] = useState('');

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterWard) params.ward_id = filterWard;
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;

      const res = await client.get('/admin/dashboard', { params });
      setComplaints(res.data);
      if (res.data.length > 0 && !selectedComplaint) {
        setSelectedComplaint(res.data[0]);
      }

      const flagsRes = await client.get('/admin/performance-flags');
      setPerformanceFlags(flagsRes.data);
    } catch (err) {
      console.error("Error fetching officer dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterWard, filterCategory, filterStatus]);

  const handleUpdateStatus = async (statusStr) => {
    if (!selectedComplaint) return;
    try {
      const res = await client.post(`/admin/complaints/${selectedComplaint.id}/update-status`, {
        status_str: statusStr
      });
      setSelectedComplaint({ ...selectedComplaint, status: res.data.status });
      fetchDashboardData();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleSavePlannedDates = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await client.post(`/admin/complaints/${selectedComplaint.id}/set-dates`, {
        planned_inspection_date: plannedInspection || null,
        planned_start_date: plannedStart || null,
        planned_fix_date: plannedFix || null,
      });
      alert("Planned inspection & fix dates saved!");
      fetchDashboardData();
    } catch (err) {
      alert("Failed to save planned dates.");
    }
  };

  return (
    <div className="flex-1 bg-gray-100 p-6 overflow-y-auto h-[calc(100vh-64px)]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Officer Header */}
        <div className="bg-amber-700 text-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
              <h2 className="text-xl font-extrabold">Ward Officer Action Dashboard</h2>
            </div>
            <p className="text-xs text-amber-100 mt-1">
              Coimbatore Ward 1 (Sanitary Inspector: Mr. Karthikeyan) • Ranked Priority Queue
            </p>
          </div>

          <div className="flex space-x-4 bg-amber-900/60 p-3 rounded-lg text-xs">
            <div>
              <p className="text-amber-200">Total Actionable</p>
              <p className="text-lg font-bold">{complaints.length}</p>
            </div>
            <div className="border-l border-amber-600 pl-4">
              <p className="text-amber-200">14-Day Overdue</p>
              <p className="text-lg font-bold text-red-300">
                {complaints.filter(c => c.status === 'Overdue').length}
              </p>
            </div>
          </div>
        </div>

        {/* Officer Performance & Black Mark Alerts */}
        {performanceFlags.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-between text-xs text-red-900">
            <div className="flex items-center space-x-3">
              <Flag className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <p className="font-bold">Officer SLA Performance Record</p>
                <p>Black Marks Applied: {performanceFlags[0]?.black_mark_count || 0} • Overdue Escalations: {performanceFlags[0]?.escalated_count || 0}</p>
              </div>
            </div>
            <span className="bg-red-600 text-white px-3 py-1 rounded font-bold text-[11px]">SLA Flagged</span>
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-1 text-gray-500 font-bold uppercase">
            <Filter className="w-4 h-4" />
            <span>Filter Queue:</span>
          </div>

          <select 
            value={filterWard} 
            onChange={(e) => setFilterWard(e.target.value)}
            className="border rounded px-3 py-1.5 text-xs bg-gray-50 focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All Wards</option>
            {wards.map(w => <option key={w.id} value={w.id}>{w.ward_number} - {w.name}</option>)}
          </select>

          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded px-3 py-1.5 text-xs bg-gray-50 focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            <option value="Roads & Potholes">Roads & Potholes</option>
            <option value="Water Supply & Leaks">Water Supply & Leaks</option>
            <option value="Sanitation & Garbage">Sanitation & Garbage</option>
            <option value="Street Lights">Street Lights</option>
            <option value="Drainage & Sewage">Drainage & Sewage</option>
          </select>

          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded px-3 py-1.5 text-xs bg-gray-50 focus:ring-1 focus:ring-amber-500"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Overdue">Overdue / Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Main Content: Ranked Queue vs Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ranked Queue List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-3 max-h-[65vh] overflow-y-auto">
            <h3 className="font-bold text-xs uppercase text-gray-500 tracking-wider">
              Priority Ranked Queue (Upvotes + Age + SLA)
            </h3>

            {complaints.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">No complaints match filters.</div>
            ) : (
              complaints.map((c, idx) => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-3.5 rounded-lg border text-xs cursor-pointer transition space-y-1.5 ${
                    selectedComplaint?.id === c.id 
                      ? 'border-amber-600 bg-amber-50/70 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-amber-900 text-xs">
                      #{idx + 1} • {c.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      c.status === 'Overdue' ? 'bg-red-600 text-white animate-pulse' :
                      c.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <p className="text-gray-700 text-xs line-clamp-2">{c.description}</p>

                  <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1 border-t">
                    <span className="font-bold text-amber-800">👍 {c.vote_count} Upvotes</span>
                    <span>📍 {c.street}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Action & Detail Panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {selectedComplaint ? (
              <div className="space-y-6">
                
                {/* Title & Status Header */}
                <div className="flex justify-between items-start border-b pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedComplaint.category}</h3>
                    <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>{selectedComplaint.street} • Reported by {selectedComplaint.name} ({selectedComplaint.mobile_number})</span>
                    </p>
                  </div>

                  {/* Status Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus('In Progress')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition shadow-sm"
                    >
                      Set In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('Resolved')}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-xs font-bold transition shadow-sm"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>

                {/* Complaint Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-xs">
                  <div>
                    <p className="font-bold text-gray-500 uppercase text-[10px]">Description</p>
                    <p className="text-gray-900 mt-1 font-medium">{selectedComplaint.description}</p>
                  </div>

                  <div>
                    <p className="font-bold text-gray-500 uppercase text-[10px]">Communication Address</p>
                    <p className="text-gray-900 mt-1">{selectedComplaint.communication_address}</p>
                  </div>

                  {selectedComplaint.photo_url && (
                    <div className="md:col-span-2">
                      <p className="font-bold text-gray-500 uppercase text-[10px] mb-1">Live Camera Capture Photo</p>
                      <img 
                        src={selectedComplaint.photo_url} 
                        alt="Complaint Attachment" 
                        className="w-full h-44 object-cover rounded-lg border border-gray-200"
                      />
                    </div>
                  )}
                </div>

                {/* SLA & Planned Action Dates Form */}
                <div className="border-t pt-4">
                  <h4 className="font-bold text-xs uppercase text-gray-700 mb-3 flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-amber-700" />
                    <span>Set Officer Planned Action Dates</span>
                  </h4>

                  <form onSubmit={handleSavePlannedDates} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Planned Inspection Date</label>
                      <input 
                        type="date"
                        value={plannedInspection}
                        onChange={(e) => setPlannedInspection(e.target.value)}
                        className="w-full border rounded px-3 py-1.5 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Planned Start Date</label>
                      <input 
                        type="date"
                        value={plannedStart}
                        onChange={(e) => setPlannedStart(e.target.value)}
                        className="w-full border rounded px-3 py-1.5 bg-gray-50"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-medium mb-1">Planned Fix Date</label>
                      <input 
                        type="date"
                        value={plannedFix}
                        onChange={(e) => setPlannedFix(e.target.value)}
                        className="w-full border rounded px-3 py-1.5 bg-gray-50"
                      />
                    </div>

                    <div className="md:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded text-xs transition shadow"
                      >
                        Save Schedule Dates
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs">
                Select a complaint from the ranked queue on the left to inspect and take action.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default OfficerDashboard;
