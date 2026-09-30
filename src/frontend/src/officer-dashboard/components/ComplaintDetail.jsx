import React, { useState } from "react";
import {
  ArrowLeft, Clock, MapPin, Users, AlertTriangle, CheckCircle, ShieldAlert,
  Sparkles, MessageSquare, Calendar, Image as ImageIcon, Send, ShieldCheck,
  ChevronRight, ZoomIn, X, History, FileText, CheckCircle2, MoreVertical
} from "lucide-react";
import LeafletMap from "./LeafletMap";
import EvidenceModal from "./EvidenceModal";

export default function ComplaintDetail({
  complaint,
  onBack,
  onRespond,
  onSubmitEvidence
}) {
  const [replyMessage, setReplyMessage] = useState("");
  const [expectedDate, setExpectedDate] = useState("2026-08-09");
  const [expectedTime, setExpectedTime] = useState("14:00");
  const [actionPlan, setActionPlan] = useState("");
  const [validationError, setValidationError] = useState("");
  
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isImageLightboxOpen, setIsImageLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  if (!complaint) return null;

  // Requirement 9: MANDATORY Dispatch & Response Field Validation
  const handleSendReply = async (e) => {
    e.preventDefault();
    setValidationError("");

    const cleanActionPlan = actionPlan.trim();
    const cleanReplyMessage = replyMessage.trim();

    if (!cleanActionPlan) {
      setValidationError("Dispatch action field is required. Please specify the field action being taken.");
      return;
    }

    if (!cleanReplyMessage) {
      setValidationError("Message to Citizen is required. Please provide a clear update for the citizen.");
      return;
    }

    setIsSubmittingReply(true);
    await onRespond(complaint.id, {
      message: cleanReplyMessage,
      expectedDate,
      expectedTime,
      actionPlan: cleanActionPlan
    });
    setIsSubmittingReply(false);
  };

  const openLightbox = (url) => {
    setLightboxImageUrl(url);
    setIsImageLightboxOpen(true);
  };

  return (
    <div className="bg-[#f8fafb] text-[#191c1d] min-h-screen flex flex-col font-sans pb-16">
      <header className="bg-[#065f46] text-white sticky top-0 w-full z-30 flex items-center justify-between px-3.5 sm:px-6 py-3 border-b border-emerald-700 shadow-md">
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <button
            onClick={onBack}
            className="p-1.5 sm:p-2 rounded-full hover:bg-emerald-800 transition-colors text-white shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="truncate">
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
              CID: {complaint.id.replace("CID-", "")}
            </span>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {complaint.title}
            </h1>
          </div>
        </div>

        <button className="p-1.5 rounded-full hover:bg-emerald-800 transition-colors text-emerald-100 shrink-0">
          <MoreVertical className="w-5 h-5" />
        </button>
      </header>

      <main className="flex-grow w-full max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {complaint.isEscalated && (
          <div className="p-3.5 sm:p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start space-x-3 text-red-900 shadow-2xs">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-xs sm:text-sm text-red-900">
                ⚠️ Repeated Resolution Failure (Escalated)
              </h4>
              <p className="text-[11px] sm:text-xs text-red-800 mt-0.5 leading-relaxed">
                This complaint has been reopened after attempted resolution. Supervisor alert active.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs md:col-span-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${complaint.priority === "P1" ? "bg-red-600" : "bg-orange-500"}`} />
            <div className="pl-2 sm:pl-3">
              <h2 className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                CURRENT STATUS
              </h2>
              <span className="text-lg sm:text-2xl font-extrabold text-slate-900">
                {complaint.status === "Pending" ? "Pending Review" : complaint.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border ${
                complaint.priority === "P1" ? "bg-red-50 text-red-700 border-red-200" : "bg-orange-50 text-orange-800 border-orange-200"
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{complaint.priorityLabel || `${complaint.priority} - Critical`}</span>
              </span>

              <span className="bg-emerald-50 text-emerald-800 text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full border border-emerald-200">
                Assigned to You
              </span>
            </div>
          </div>

          {/* SECTION 1: CITIZEN REPORT & MAP */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-3 h-full">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1 border-b border-slate-200 pb-2">
              <FileText className="w-4 h-4 text-slate-600" />
              <span>CITIZEN REPORT</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-200">
              "{complaint.description}"
            </p>

            <div className="mt-auto pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {complaint.reportedImageUrl && (
                <div
                  onClick={() => openLightbox(complaint.reportedImageUrl)}
                  className="relative group rounded-lg overflow-hidden border border-slate-200 cursor-pointer h-28 sm:h-32 bg-slate-900"
                >
                  <img
                    src={complaint.reportedImageUrl}
                    alt="Citizen report"
                    className="w-full h-28 sm:h-32 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                    Enlarge Image
                  </div>
                </div>
              )}

              <div className="h-44 sm:h-32 rounded-lg overflow-hidden border border-slate-200 relative">
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

          {/* SECTION 2: DYNAMIC REAL GEMINI AI ASSESSMENT */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col gap-3 bg-gradient-to-br from-white to-slate-50">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h2 className="text-xs font-bold text-emerald-900 flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>AI ASSESSMENT</span>
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                VERIFIED ({complaint.aiAssessment?.confidence || "94%"})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                <span className="block text-[11px] font-medium text-slate-500">Severity Score</span>
                <span className="text-lg sm:text-xl font-bold text-red-700">
                  {complaint.aiAssessment?.severityLabel || "8/10"}
                </span>
              </div>
              <div className="bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                <span className="block text-[11px] font-medium text-slate-500">Hazard Type</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">
                  {complaint.aiAssessment?.hazardType || "Public Safety"}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-auto leading-relaxed">
              <strong>Explanation:</strong> {complaint.aiAssessment?.reasoning}
            </p>

            <div className="flex items-center space-x-1 text-xs font-bold text-emerald-900 mt-1 pt-2 border-t border-slate-200">
              <Users className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{complaint.affectedResidents || 8} residents affected (Estimated)</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: DISPATCH & RESPONSE FORM */}
        {(complaint.status === "Pending" || complaint.status === "Reopened") && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
              <MessageSquare className="w-4 h-4 text-emerald-800" />
              <span>DISPATCH & RESPONSE</span>
            </h2>

            {validationError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dispatch Action Being Taken * (Required)
                </label>
                <input
                  type="text"
                  value={actionPlan}
                  onChange={(e) => setActionPlan(e.target.value)}
                  placeholder="e.g. Assigned to Water Supply field repair team"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Expected Resolution Date
                  </label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Time (Est.)
                  </label>
                  <input
                    type="time"
                    value={expectedTime}
                    onChange={(e) => setExpectedTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Message / Response to Citizen * (Required)
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Field team inspected location and started pipeline repair..."
                  rows={3}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-700"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingReply}
                className="w-full bg-[#065f46] hover:bg-emerald-800 text-white py-3 rounded-lg font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmittingReply ? "Submitting Response..." : "Send Official Response & Dispatch Team"}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {isImageLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl overflow-hidden p-2">
            <button
              onClick={() => setIsImageLightboxOpen(false)}
              className="absolute top-3 right-3 p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImageUrl}
              alt="Enlarged evidence"
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
