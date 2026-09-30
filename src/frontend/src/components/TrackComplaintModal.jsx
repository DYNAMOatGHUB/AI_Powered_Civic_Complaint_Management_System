import React, { useState } from 'react';
import { X, Clock, AlertTriangle, CheckCircle, ShieldAlert, FileText } from 'lucide-react';

function TrackComplaintModal({ isOpen, onClose, complaints }) {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-emerald-100">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <h3 className="font-bold text-lg">Track Submitted Complaints & Escalation Timeline</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-emerald-700 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Complaint List */}
          <div className="md:col-span-1 border-r pr-4 space-y-3 max-h-[60vh] overflow-y-auto">
            <h4 className="font-bold text-xs uppercase text-gray-500 tracking-wider">Your Submitted Reports</h4>
            {complaints.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No complaints submitted yet.</p>
            ) : (
              complaints.map(c => (
                <div 
                  key={c.id}
                  onClick={() => setSelectedComplaint(c)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                    selectedComplaint?.id === c.id 
                      ? 'border-emerald-600 bg-emerald-50 shadow-sm' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-gray-900 line-clamp-1">{c.category}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                      c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                      c.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px] line-clamp-1">{c.street}</p>
                  <p className="text-[10px] text-gray-400 mt-1">👍 {c.vote_count} Upvotes</p>
                </div>
              ))
            )}
          </div>

          {/* Detailed Timeline View */}
          <div className="md:col-span-2 space-y-4">
            {selectedComplaint ? (
              <div>
                <div className="bg-gray-50 p-4 rounded-lg border mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{selectedComplaint.category}</h4>
                      <p className="text-xs text-gray-500">📍 {selectedComplaint.street} • Reported on {new Date(selectedComplaint.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-emerald-700 text-sm">👍 {selectedComplaint.vote_count} Upvotes</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-2 bg-white p-2.5 rounded border border-gray-200">
                    "{selectedComplaint.description}"
                  </p>
                </div>

                {/* 14-Day Escalation SLA Tracker */}
                <div className="bg-emerald-900 text-white p-4 rounded-lg shadow mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-emerald-300" />
                      <span>14-Day SLA Hard Escalation Timer</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                      selectedComplaint.status === 'Overdue' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-emerald-100'
                    }`}>
                      {selectedComplaint.status === 'Overdue' ? 'ESCALATED TO HIGHER OFFICER' : 'SLA ACTIVE'}
                    </span>
                  </div>

                  <div className="w-full bg-emerald-950 rounded-full h-2 overflow-hidden mb-2">
                    <div 
                      className={`h-full ${selectedComplaint.status === 'Overdue' ? 'bg-red-500' : 'bg-emerald-400'}`}
                      style={{ width: selectedComplaint.status === 'Overdue' ? '100%' : '45%' }}
                    />
                  </div>

                  <p className="text-[11px] text-emerald-200">
                    {selectedComplaint.status === 'Overdue' 
                      ? '⚠️ Action overdue! Automatically escalated to Higher Municipal Officer with a performance flag applied to the responsible officer.' 
                      : 'If not resolved within 14 days, this complaint will automatically escalate to the Higher Officer.'}
                  </p>
                </div>

                {/* Status Timeline */}
                <div className="space-y-3">
                  <h5 className="font-bold text-xs uppercase text-gray-600">Resolution Progress</h5>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-gray-900">1. Logged & Analyzed</p>
                        <p className="text-[11px] text-gray-500">Verified by Gemini AI for category and photo relevance.</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                      <Clock className={`w-4 h-4 shrink-0 ${selectedComplaint.planned_inspection_date ? 'text-emerald-600' : 'text-gray-300'}`} />
                      <div>
                        <p className="font-bold text-gray-900">2. Planned Site Inspection</p>
                        <p className="text-[11px] text-gray-500">
                          {selectedComplaint.planned_inspection_date 
                            ? `Scheduled for: ${new Date(selectedComplaint.planned_inspection_date).toLocaleDateString()}` 
                            : 'Pending officer schedule'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${selectedComplaint.status === 'Resolved' ? 'text-green-600' : 'text-gray-300'}`} />
                      <div>
                        <p className="font-bold text-gray-900">3. Resolution & Closure</p>
                        <p className="text-[11px] text-gray-500">
                          {selectedComplaint.resolved_at 
                            ? `Resolved on: ${new Date(selectedComplaint.resolved_at).toLocaleDateString()}` 
                            : 'Awaiting completion'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Select a complaint on the left to inspect its real-time timeline and escalation status.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default TrackComplaintModal;
