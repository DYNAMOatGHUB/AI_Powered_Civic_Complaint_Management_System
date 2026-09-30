import React, { useState } from "react";
import { X, CheckCircle2, Video, Camera } from "lucide-react";
import WebcamCapture from "./WebcamCapture";

export default function EvidenceModal({ complaint, isOpen, onClose, onSubmit }) {
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState(
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    setIsSubmitting(true);
    await onSubmit(complaint.id, { description, photoUrl });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-[#00355f] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-200">
              CID: {complaint.id.replace("CID-", "")}
            </span>
            <h3 className="text-base font-bold text-white flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-indigo-300" />
              <span>Submit Live Work Evidence</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-indigo-200 hover:text-white hover:bg-[#0f4c81]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Video className="w-4 h-4 text-[#00355f]" />
              <span>Live Webcam Photo Evidence *</span>
            </label>

            <WebcamCapture
              onCapture={(capturedDataUrl) => setPhotoUrl(capturedDataUrl)}
              initialImage={photoUrl}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Describe What Was Fixed *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. The damaged road area was repaved and safety cones removed by field staff."
              className="w-full p-3 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-[#00355f] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Date Completed</span>
              <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Time</span>
              <span className="font-bold text-slate-800">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#00355f] hover:bg-[#0f4c81] rounded-full shadow-md flex items-center space-x-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Live Evidence</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
