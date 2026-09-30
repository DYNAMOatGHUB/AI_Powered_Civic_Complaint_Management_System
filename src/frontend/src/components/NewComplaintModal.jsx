import React, { useState } from 'react';
import { X, AlertCircle, ThumbsUp, ShieldAlert, MapPin } from 'lucide-react';
import CameraCapture from './CameraCapture';
import client from '../api/client';

const CATEGORIES = [
  "Roads & Potholes",
  "Street Lights",
  "Water Supply & Leaks",
  "Drainage & Sewage",
  "Sanitation & Garbage",
  "Electricity",
  "Corporation Issues",
  "Revenue Department",
  "Ration Shop",
  "Pension & Schemes",
  "Public Transport",
  "Health & Hygiene",
  "Education",
  "Others"
];

function NewComplaintModal({ isOpen, onClose, selectedWard, pinLocation, onCreated, onUpvote }) {
  const [step, setStep] = useState(1); // 1: Duplicate Pre-Check, 2: Form Input
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [street, setStreet] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [communicationAddress, setCommunicationAddress] = useState('');
  const [gender, setGender] = useState('Male');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [preCheckMatches, setPreCheckMatches] = useState([]);
  const [duplicateAlert, setDuplicateAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePreCheck = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await client.post('/complaints/precheck-duplicate', null, {
        params: { ward_id: selectedWard ? selectedWard.id : 1, category }
      });
      setPreCheckMatches(res.data);
      setStep(2);
    } catch (err) {
      setError("Error checking duplicate complaints. Proceeding to form.");
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setDuplicateAlert(null);

    // Requirement 5: Map Pin Location Validation
    if (!pinLocation || !pinLocation.lat || !pinLocation.lng) {
      alert("Please mark the complaint location on the map before submitting.");
      setError("Please mark the complaint location on the map before submitting.");
      return;
    }

    if (!name || !street || !description || !mobileNumber || !email || !communicationAddress) {
      setError("Please fill in all mandatory fields.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('street', street);
    formData.append('description', description);
    formData.append('mobile_number', mobileNumber);
    formData.append('communication_address', communicationAddress);
    formData.append('category', category);
    formData.append('gender', gender);
    formData.append('email', email);
    formData.append('ward_id', selectedWard ? selectedWard.id : 1);
    formData.append('location_lat', pinLocation.lat);
    formData.append('location_lng', pinLocation.lng);

    if (pincode) formData.append('pincode', pincode);
    if (landmark) formData.append('landmark', landmark);
    if (capturedPhoto) formData.append('photo', capturedPhoto.file);

    try {
      const res = await client.post('/complaints/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onCreated(res.data);
      onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (typeof detail === 'object' && detail.message) {
          setDuplicateAlert(detail);
          setError(detail.message);
        } else {
          setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        }
      } else {
        setError("Failed to create complaint. Please check your submission.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-2.5 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-emerald-100 overflow-hidden">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#065f46] text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b border-emerald-700 shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold tracking-tight">Report Civic Complaint</h3>
            <p className="text-[11px] sm:text-xs text-emerald-200 truncate">
              Coimbatore Ward: {selectedWard ? `${selectedWard.ward_number} (${selectedWard.name})` : 'Ward 1 (RS Puram)'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-emerald-800 text-emerald-100 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-64px)] space-y-4">
          {/* Map Pin Status Bar */}
          <div className={`p-3 rounded-lg flex items-center justify-between text-xs font-semibold ${
            pinLocation ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-amber-50 text-amber-900 border border-amber-200'
          }`}>
            <div className="flex items-center space-x-2 pr-2">
              <MapPin className={`w-4 h-4 shrink-0 ${pinLocation ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span className="truncate">
                {pinLocation 
                  ? `Pin Marked: (${pinLocation.lat.toFixed(4)}, ${pinLocation.lng.toFixed(4)})` 
                  : "⚠️ Map Pin Required: Click on the map to mark complaint location."}
              </span>
            </div>
            {!pinLocation && (
              <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[10px] uppercase font-bold shrink-0">Pin Missing</span>
            )}
          </div>

          {/* Duplicate Alert Box */}
          {duplicateAlert && (
            <div className="p-3.5 sm:p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 space-y-2">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                <span>🤖 AI 200m Duplicate Detection</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {duplicateAlert.message}
              </p>
              {duplicateAlert.existing_complaint_id && (
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-amber-200/60">
                  <span className="text-xs font-medium text-amber-900">
                    Existing Complaint #{duplicateAlert.existing_complaint_id} ({duplicateAlert.existing_complaint_votes || 1} votes)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onUpvote(duplicateAlert.existing_complaint_id);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg shadow-2xs flex items-center justify-center space-x-1"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Upvote Existing Complaint</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {error && !duplicateAlert && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: PRE-CHECK CATEGORY */
            <form onSubmit={handlePreCheck} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Select Complaint Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <h4 className="font-bold text-slate-800">💡 AI Duplicate Check Workflow:</h4>
                <p className="leading-relaxed">Before submitting a new report, our system checks if this issue has already been reported within a 200m radius in your ward.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#065f46] hover:bg-emerald-800 text-white py-3 rounded-lg font-bold text-xs shadow-md transition"
              >
                {loading ? 'Checking Nearby Complaints...' : 'Check Existing Complaints & Continue'}
              </button>
            </form>
          ) : (
            /* STEP 2: FULL COMPLAINT FORM */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number (10 Digits) *</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@example.com"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Street / Location *</label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Enter street or area name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Communication Address *</label>
                <input
                  type="text"
                  value={communicationAddress}
                  onChange={(e) => setCommunicationAddress(e.target.value)}
                  placeholder="Door No., Building, Street Name, Area, Coimbatore"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Complaint Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the problem clearly..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pincode (Optional)</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="641001"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Near Post Office"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>

              {/* CAMERA CAPTURE */}
              <CameraCapture
                onCapture={(file, previewUrl) => setCapturedPhoto({ file, previewUrl })}
                capturedFile={capturedPhoto}
                onClear={() => setCapturedPhoto(null)}
              />

              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-600 hover:underline w-full sm:w-auto text-center"
                >
                  ← Back to Pre-Check
                </button>
                
                <div className="flex space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none px-5 py-2 bg-[#065f46] hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-md transition"
                  >
                    {loading ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default NewComplaintModal;
