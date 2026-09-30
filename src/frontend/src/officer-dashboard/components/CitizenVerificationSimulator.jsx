import React, { useState } from "react";
import { CheckCircle2, XCircle, Send, Eye } from "lucide-react";

export default function CitizenVerificationSimulator({ complaint, onVerify }) {
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    setIsSubmitting(true);
    await onVerify(complaint.id, true);
    setIsSubmitting(false);
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    setIsSubmitting(true);
    await onVerify(complaint.id, false, {
      rejectionReason,
      newPhotoUrl
    });
    setIsSubmitting(false);
    setShowRejectionForm(false);
  };

  return (
    <div className="bg-purple-50/80 border-2 border-purple-200 rounded-xl p-4 my-4 font-sans">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="p-1 bg-purple-600 text-white rounded-md text-xs">
            <Eye className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
              Interactive Citizen Verification Simulator
            </h4>
            <p className="text-[11px] text-purple-700">
              Test how the citizen responds to officer's resolution evidence.
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900 border border-purple-300">
          Demo Testing Tool
        </span>
      </div>

      {!showRejectionForm ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="flex-1 min-w-[140px] py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Simulate "Issue Fixed" ✅</span>
          </button>

          <button
            onClick={() => setShowRejectionForm(true)}
            disabled={isSubmitting}
            className="flex-1 min-w-[140px] py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Simulate "Issue Not Fixed" ❌</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleReject} className="mt-3 p-3 bg-white rounded-lg border border-purple-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-red-700">
            <span>Report Issue Still Unresolved</span>
            <button
              type="button"
              onClick={() => setShowRejectionForm(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              What is still not fixed? (Citizen Feedback) *
            </label>
            <textarea
              required
              rows={2}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. The wire was removed, but another loose wire is still hanging near the same pole."
              className="w-full p-2 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-red-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowRejectionForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Reopen Same Complaint ({complaint.id})</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
