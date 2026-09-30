import React from "react";
import { X, User, Building2, MapPin, Mail, ShieldCheck, ListFilter } from "lucide-react";

export default function OfficerProfileModal({ officer, activeCount, isOpen, onClose }) {
  if (!isOpen || !officer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#00355f] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-indigo-300" />
            <h3 className="text-base font-bold text-white">Officer Official Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-[#0f4c81]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-6 space-y-5">
          {/* Top Officer Identity Header */}
          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="w-14 h-14 rounded-full bg-[#0f4c81]/10 flex items-center justify-center border-2 border-[#00355f] text-[#00355f] shrink-0">
              <User className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900 leading-snug">{officer.name}</h2>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#00355f] text-white">
                {officer.role}
              </span>
              <p className="text-xs text-slate-500 font-medium mt-1">ID: {officer.id || "OFF-001"}</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#00355f]" />
                <span>Department</span>
              </span>
              <span className="font-bold text-slate-900">{officer.department}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#00355f]" />
                <span>Assigned Ward</span>
              </span>
              <span className="font-bold text-slate-900">{officer.ward}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#00355f]" />
                <span>Official Email</span>
              </span>
              <span className="font-bold text-slate-900 font-mono text-[11px]">{officer.email}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00355f]" />
                <span>Authentication</span>
              </span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Active Officer
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-200">
              <span className="text-indigo-900 font-bold uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <ListFilter className="w-3.5 h-3.5 text-[#00355f]" />
                <span>Active Department Tasks</span>
              </span>
              <span className="font-extrabold text-[#00355f] text-sm">{activeCount} tasks</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#00355f] hover:bg-[#0f4c81] text-white text-xs font-bold rounded-full shadow-sm"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
