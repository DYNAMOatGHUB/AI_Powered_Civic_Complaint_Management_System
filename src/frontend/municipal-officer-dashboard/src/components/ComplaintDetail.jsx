import React, { useState } from "react";
import {
  ArrowLeft, Clock, MapPin, Users, AlertTriangle, CheckCircle, ShieldAlert,
  Sparkles, MessageSquare, Calendar, Image as ImageIcon, Send, ShieldCheck,
  ChevronRight, ZoomIn, X, History, FileText, CheckCircle2, MoreVertical
} from "lucide-react";
import LeafletMap from "./LeafletMap";
import EvidenceModal from "./EvidenceModal";
import CitizenVerificationSimulator from "./CitizenVerificationSimulator";

export default function ComplaintDetail({
  complaint,
  onBack,
  onRespond,
  onSubmitEvidence,
  onVerifyCitizen
}) {
  const [replyMessage, setReplyMessage] = useState("");
  const [expectedDate, setExpectedDate] = useState("2026-08-09");
  const [expectedTime, setExpectedTime] = useState("14:00");
  const [actionPlan, setActionPlan] = useState("Dispatching Utility Crew");
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  if (!complaint) return null;

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setIsSubmittingReply(true);
    await onRespond(complaint.id, {
      message: replyMessage,
      expectedDate,
      expectedTime,
      actionPlan: actionPlan || "Field team inspection and work execution."
    });
    setIsSubmittingReply(false);
  };

  const openLightbox = (url) => {
    setLightboxImageUrl(url);
    setIsImageLightboxOpen(true);
  };

  return (
    <div className="bg-[#f8fafb] text-[#191c1d] min-h-screen flex flex-col font-sans pb-16">
      {/* Top Header Bar */}
      <header className="bg-white sticky top-0 w-full z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-200 shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors text-[#00355f]"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              CID: {complaint.id.replace("CID-", "")}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-[#00355f] truncate max-w-xs sm:max-w-md">
              {complaint.title}
            </h1>
          </div>
        </div>

        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Bento Grid */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Escalation Alert Banner */}
        {complaint.isEscalated && (
          <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3 text-red-900 shadow-xs">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-red-900">
                  ⚠️ Repeated Resolution Failure (Escalated)
                </h4>
                <span className="px-2 py-0.5 bg-red-600 text-white font-bold text-[10px] uppercase rounded">
                  Attempts: {complaint.resolutionAttempts}
                </span>
              </div>
              <p className="text-xs text-red-800 mt-1">
                This complaint has been reopened multiple times after attempted resolution. The citizen reported the issue as still unresolved. Supervisor alert active.
              </p>
            </div>
          </div>
        )}

        {/* Bento Grid Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status & Priority Card */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs md:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${complaint.priority === "P1" ? "bg-[#ba1a1a]" : "bg-orange-500"}`} />
            <div className="pl-3">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                CURRENT STATUS
              </h2>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {complaint.status === "Pending" ? "Pending Review" : complaint.status}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border ${
                complaint.priority === "P1" ? "bg-red-50 text-[#ba1a1a] border-red-200" : "bg-orange-50 text-orange-800 border-orange-200"
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{complaint.priorityLabel || `${complaint.priority} - Critical`}</span>
              </span>

              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full border border-slate-200">
                Assigned to You
              </span>
            </div>
          </div>

          {/* Citizen Report & Media */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3 h-full">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>CITIZEN REPORT</span>
            </h2>

            <p className="text-sm text-slate-800 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-200">
              "{complaint.description}"
            </p>

            <div className="mt-auto pt-2 grid grid-cols-2 gap-2">
              {complaint.reportedImageUrl && (
                <div
                  onClick={() => openLightbox(complaint.reportedImageUrl)}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 cursor-pointer h-32 bg-slate-900"
                >
                  <img
                    src={complaint.reportedImageUrl}
                    alt="Citizen report"
                    className="w-full h-32 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                    Enlarge Image
                  </div>
                </div>
              )}

              <div className="h-32 rounded-lg overflow-hidden border border-slate-200 relative">
                <LeafletMap
                  lat={complaint.lat}
                  lng={complaint.lng}
                  address={complaint.locationAddress}
                  title={complaint.title}
                  priority={complaint.priority}
                  status={complaint.status}
                />
              </div>
            </div>
          </div>

          {/* AI Assessment Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col gap-3 bg-gradient-to-br from-white to-slate-50">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h2 className="text-xs font-bold text-[#00355f] flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-[#00355f]" />
                <span>AI ASSESSMENT</span>
              </h2>
              <span className="bg-[#00355f]/10 text-[#00355f] text-[10px] font-bold px-2 py-0.5 rounded">
                VERIFIED ({complaint.aiAssessment?.confidence || "93%"})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                <span className="block text-[11px] font-medium text-slate-500">Severity Score</span>
                <span className="text-xl font-bold text-[#ba1a1a]">
                  {complaint.aiAssessment?.severityLabel?.split(" ")[0] || "9/10"}
                </span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                <span className="block text-[11px] font-medium text-slate-500">Hazard Type</span>
                <span className="text-sm font-semibold text-slate-800 truncate block">
                  {complaint.aiAssessment?.hazardType || "Electrical Safety"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-auto leading-relaxed">
              <strong>Explanation:</strong> {complaint.aiAssessment?.reasoning || "The complaint indicates a potentially dangerous electrical wire exposed in a high-traffic pedestrian zone. Immediate dispatch recommended."}
            </p>

            <div className="flex items-center space-x-1 text-xs font-bold text-[#00355f] mt-1 pt-2 border-t border-slate-200">
              <Users className="w-4 h-4 text-[#00355f]" />
              <span>{complaint.affectedResidents} residents affected (Estimated)</span>
            </div>
          </div>
        </div>

        {/* Officer Response Section (Dispatch & Response Form) */}
        {(complaint.status === "Pending" || complaint.status === "Reopened") && (
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span>DISPATCH & RESPONSE</span>
            </h2>

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Action Being Taken
                </label>
                <input
                  type="text"
                  required
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="e.g. Dispatching Utility Crew"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-[#00355f] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Expected Resolution Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-[#00355f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Time (Est.)
                  </label>
                  <input
                    type="time"
                    required
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-slate-50 focus:ring-2 focus:ring-[#00355f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message to Citizen
                </label>
                <textarea
                  required
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write your response to the citizen..."
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-slate-50 focus:ring-2 focus:ring-[#00355f] focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReply}
                className="w-full bg-[#00355f] hover:bg-[#0f4c81] text-white font-bold py-3 px-4 rounded-full flex justify-center items-center space-x-2 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Send Response & Start Work</span>
              </button>
            </form>
          </div>
        )}

        {/* Ongoing State Actions */}
        {complaint.status === "Ongoing" && (
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-amber-900 text-sm">Active Field Work In Progress</h3>
              <span className="px-2.5 py-0.5 bg-amber-600 text-white font-bold text-xs rounded-full">
                Ongoing
              </span>
            </div>

            {complaint.officerResponse && (
              <div className="bg-white p-3.5 rounded-lg border border-amber-200 text-xs">
                <p className="text-slate-800 font-medium">"{complaint.officerResponse.message}"</p>
                <span className="text-[11px] text-slate-500 block mt-1">
                  Expected Completion: {complaint.officerResponse.expectedDate} at {complaint.officerResponse.expectedTime}
                </span>
              </div>
            )}

            <button
              onClick={() => setIsEvidenceModalOpen(true)}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-full shadow-sm flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Work Completed & Upload Evidence</span>
            </button>
          </div>
        )}

        {/* Awaiting Citizen Verification */}
        {complaint.status === "Awaiting Verification" && (
          <div className="space-y-4">
            <div className="p-4 bg-purple-100 border border-purple-300 rounded-xl text-purple-950 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-700 animate-spin" />
                <div>
                  <span className="font-bold text-sm">Work Marked Completed</span>
                  <p className="text-xs text-purple-800">
                    Waiting for citizen confirmation before closing complaint.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 bg-purple-700 text-white text-xs font-bold rounded-full">
                Awaiting Verification
              </span>
            </div>

            <CitizenVerificationSimulator
              complaint={complaint}
              onVerify={onVerifyCitizen}
            />
          </div>
        )}

        {/* Completed Status Banner */}
        {complaint.status === "Completed" && (
          <div className="p-5 bg-emerald-50 border-2 border-emerald-200 rounded-xl text-emerald-950 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="font-bold text-sm text-emerald-900">
                  Complaint Officially Resolved
                </h4>
                <p className="text-xs text-emerald-800">
                  Verified by citizen on {complaint.citizenVerification?.verifiedAt || "August 8, 2026"}.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
              COMPLETED
            </span>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
            <History className="w-4 h-4 text-slate-600" />
            <span>ACTIVITY TIMELINE (CID: {complaint.id.replace("CID-", "")})</span>
          </h2>

          <div className="relative pl-6 border-l-2 border-slate-300 space-y-4">
            {complaint.history?.map((log) => (
              <div key={log.id} className="relative">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-[#00355f] ring-4 ring-white" />
                <p className="text-[11px] text-slate-400 font-mono">{log.timestamp}</p>
                <p className="text-xs font-bold text-slate-900">{log.action}</p>
                <p className="text-xs text-slate-600">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Evidence Modal */}
      <EvidenceModal
        complaint={complaint}
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onSubmit={onSubmitEvidence}
      />

      {/* Lightbox Modal */}
      {isImageLightboxOpen && (
        <div
          onClick={() => setIsImageLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={lightboxImageUrl}
              alt="Full resolution evidence"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setIsImageLightboxOpen(false)}
              className="absolute top-2 right-2 p-2 bg-slate-900/80 text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
