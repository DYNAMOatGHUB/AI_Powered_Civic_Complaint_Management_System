import React from "react";
import { Users, Clock, MapPin, AlertTriangle, ArrowRight, ShieldAlert, CheckCircle, Info } from "lucide-react";

export default function ComplaintCard({ complaint, isSelected, onSelect }) {
  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case "P1":
        return "bg-red-600";
      case "P2":
        return "bg-orange-600";
      case "P3":
        return "bg-amber-500";
      default:
        return "bg-emerald-600";
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "P1":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            P1 Critical
          </span>
        );
      case "P2":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" />
            P2 High
          </span>
        );
      case "P3":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Info className="w-3.5 h-3.5 mr-1" />
            P3 Routine
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            P4 Low
          </span>
        );
    }
  };

  const getStatusBadge = (status) => {
    if (status === "Reopened") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-900 text-white border border-red-700">
          <AlertTriangle className="w-3 h-3 mr-1" />
          REOPENED
        </span>
      );
    }
    if (status === "Awaiting Verification") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-900 border border-purple-200">
          Awaiting Verification
        </span>
      );
    }
    if (status === "Ongoing") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200">
          Ongoing
        </span>
      );
    }
    if (status === "Completed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200">
          <CheckCircle className="w-3 h-3 mr-1 text-emerald-700" />
          Completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
        Pending Review
      </span>
    );
  };

  return (
    <div
      onClick={() => onSelect(complaint)}
      className={`rounded-xl border transition-all cursor-pointer relative bg-white overflow-hidden shadow-xs hover:shadow-md flex flex-col ${
        isSelected
          ? "border-emerald-700 ring-2 ring-emerald-600/20 shadow-md bg-emerald-50/20"
          : "border-slate-200 hover:border-slate-300"
      }`}
    >
      {/* Left Priority Indicator Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getPriorityColorClass(complaint.priority)}`} />

      <div className="p-4 pl-5 flex-1 flex flex-col">
        {/* Escalation Warning Banner */}
        {complaint.isEscalated && (
          <div className="mb-2.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-md flex items-center justify-between text-xs text-red-900">
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>⚠️ Repeated Resolution Failure ({complaint.resolutionAttempts || 1} attempts)</span>
            </div>
            <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Escalated</span>
          </div>
        )}

        {/* Card Header: CID & Status */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold text-slate-600">
            CID: {complaint.id.replace("CID-", "")}
          </span>
          {getStatusBadge(complaint.status)}
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 line-clamp-2">
          {complaint.title}
        </h3>

        {/* Details Row */}
        <div className="space-y-1.5 text-xs text-slate-600 mb-3">
          <div className="flex items-center justify-between">
            {getPriorityBadge(complaint.priority)}
            <div className="flex items-center space-x-1 font-semibold text-slate-800">
              <Users className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span>{complaint.affectedResidents || 8} residents affected</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 pt-1 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{complaint.locationAddress || complaint.ward}</span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-2.5 mt-auto border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Submitted {complaint.reportedAt}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(complaint);
            }}
            className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 hover:text-emerald-900"
          >
            <span>View Complaint</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
