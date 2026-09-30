import React, { useState } from 'react';
import { ShieldCheck, MapPin, CheckCircle, ArrowRight, AlertCircle, Building2, User, Phone, Lock, Mail, Shield } from 'lucide-react';
import client from '../api/client';
function LandingLoginPage({ onLoginSuccess, onOpenTrackComplaint }) {
  const [portalType, setPortalType] = useState('citizen'); // 'citizen' or 'officer'
  const [isRegister, setIsRegister] = useState(false);
  
  // Citizen state
  const [mobileNumber, setMobileNumber] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Officer state
  const [officerIdentifier, setOfficerIdentifier] = useState('');
  const [officerPassword, setOfficerPassword] = useState('');
  const [officerDepartment, setOfficerDepartment] = useState('Roads & Highways');
  const [officerWard, setOfficerWard] = useState('Ward 1 — RS Puram');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleMobileChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
    setMobileNumber(cleaned);
  };

  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (mobileNumber.length !== 10) {
      setError("Mobile number must be exactly 10 digits (numbers only).");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await client.post('/auth/register', {
          mobile_number: mobileNumber,
          username: username || undefined,
          password,
          name,
          email
        });
        localStorage.setItem('token', res.data.access_token);
        onLoginSuccess({ 
          mobile_number: res.data.mobile_number, 
          username: res.data.username || res.data.mobile_number, 
          role: 'citizen' 
        });
      } else {
        const res = await client.post('/auth/login', {
          mobile_number: mobileNumber,
          password,
          role: 'citizen'
        });
        localStorage.setItem('token', res.data.access_token);
        onLoginSuccess({ 
          mobile_number: res.data.mobile_number, 
          username: res.data.username || res.data.mobile_number, 
          role: 'citizen' 
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail.map(d => d.msg).join(', '));
        } else {
          setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        }
      } else {
        setError("Authentication failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const cleanedMobile = officerIdentifier.replace(/\D/g, '').slice(0, 10);
    if (cleanedMobile.length !== 10) {
      setError("Officer mobile number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          setError("Officer Name is required.");
          setLoading(false);
          return;
        }

        const res = await client.post('/auth/register-officer', {
          mobile_number: cleanedMobile,
          password: officerPassword,
          name: name.trim(),
          department_name: officerDepartment,
          ward_name: officerWard,
          email: `${cleanedMobile}@coimbatorecorp.gov.in`,
          role: 'ward_officer'
        });

        localStorage.setItem('token', res.data.access_token);
        onLoginSuccess({
          username: res.data.name || res.data.username || "Officer",
          role: 'ward_officer',
          mobile_number: res.data.mobile_number,
          officerData: {
            id: `OFF-${res.data.mobile_number.slice(-4)}`,
            name: res.data.name || res.data.username || "Officer",
            email: res.data.email || `${res.data.mobile_number}@coimbatorecorp.gov.in`,
            role: "Ward Officer",
            department: res.data.department_name || officerDepartment,
            ward: res.data.ward_name || officerWard
          }
        });
      } else {
        const res = await client.post('/auth/login', {
          mobile_number: cleanedMobile,
          password: officerPassword,
          role: 'ward_officer'
        });
        localStorage.setItem('token', res.data.access_token);
        onLoginSuccess({
          username: res.data.name || res.data.username || "Officer",
          role: 'ward_officer',
          mobile_number: res.data.mobile_number,
          officerData: {
            id: `OFF-${res.data.mobile_number.slice(-4)}`,
            name: res.data.name || res.data.username || "Officer",
            email: res.data.email || `${res.data.mobile_number}@coimbatorecorp.gov.in`,
            role: "Ward Officer",
            department: res.data.department_name || officerDepartment,
            ward: res.data.ward_name || officerWard
          }
        });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          setError(detail.map(d => d.msg).join(', '));
        } else {
          setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
        }
      } else {
        setError("Officer authentication failed. Please check credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fillQuickOfficer = (demoMobile) => {
    setOfficerIdentifier(demoMobile);
    setOfficerPassword("officer123");
    setError(null);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-start sm:items-center justify-center bg-slate-950 overflow-y-auto font-sans pt-6 pb-12 sm:py-8">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center filter grayscale opacity-30 scale-105 transform transition duration-1000"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2070&auto=format&fit=crop')` 
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-emerald-950/80" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl mx-auto px-3.5 sm:px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start lg:items-center">
        
        {/* RIGHT COLUMN: LOGIN / REGISTER CARD (Positioned FIRST on mobile, padded safely below header) */}
        <div className="lg:col-span-5 w-full order-first lg:order-last mt-1 sm:mt-0">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 p-4 sm:p-6 md:p-8">
            
            {/* Top Switcher: Citizen Portal vs Officer Portal */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-3 sm:mb-4 border border-slate-200">
              <button
                type="button"
                onClick={() => { setPortalType('citizen'); setError(null); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  portalType === 'citizen' ? 'bg-[#065f46] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen Portal</span>
              </button>
              <button
                type="button"
                onClick={() => { setPortalType('officer'); setError(null); }}
                className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition flex items-center justify-center space-x-1.5 ${
                  portalType === 'officer' ? 'bg-[#065f46] text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Officer Portal</span>
              </button>
            </div>

            {/* Sub-Toggle: Login vs Register */}
            <div className="flex bg-slate-50 p-1 rounded-lg mb-4 sm:mb-6 border border-slate-200">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                  !isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setError(null); }}
                className={`flex-1 py-1.5 text-xs font-bold rounded transition ${
                  isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {portalType === 'citizen' ? 'New Citizen Register' : 'New Officer Register'}
              </button>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {error}
              </div>
            )}

            {/* CITIZEN FORM */}
            {portalType === 'citizen' ? (
              <form onSubmit={handleCitizenSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number (10 Digits) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs text-gray-400 font-semibold">+91</span>
                    <input 
                      type="tel" 
                      value={mobileNumber} 
                      onChange={handleMobileChange} 
                      placeholder="e.g. 9876543210"
                      maxLength={10}
                      className="w-full border border-gray-300 rounded-lg pl-11 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                      required 
                    />
                  </div>
                </div>

                {isRegister && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Username (Optional)</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Enter username"
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password *</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    required 
                  />
                </div>

                {isRegister && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter full name"
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="user@example.com"
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2 text-xs"
                      />
                    </div>
                  </>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#065f46] hover:bg-emerald-800 text-white py-3 rounded-lg font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <span>{loading ? 'Authenticating...' : (isRegister ? 'Create Citizen Account' : 'Login to Citizen Portal')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* OFFICER FORM */
              <form onSubmit={handleOfficerSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Mobile (10 Digits) *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="tel" 
                      value={officerIdentifier} 
                      onChange={(e) => setOfficerIdentifier(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                      placeholder="e.g. 9080511576"
                      maxLength={10}
                      className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-[#065f46] focus:outline-none"
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password / Security Code *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="password" 
                      value={officerPassword} 
                      onChange={(e) => setOfficerPassword(e.target.value)} 
                      placeholder="••••••••"
                      className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-xs focus:ring-2 focus:ring-[#065f46] focus:outline-none"
                      required 
                    />
                  </div>
                </div>

                {isRegister ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Officer Name *</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="e.g. Mr. Karthikeyan"
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-xs"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Department</label>
                        <select
                          value={officerDepartment}
                          onChange={(e) => setOfficerDepartment(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-2 py-2 text-xs"
                        >
                          <option value="Roads & Highways">Roads & Highways</option>
                          <option value="Water Supply">Water Supply</option>
                          <option value="Sanitation">Sanitation</option>
                          <option value="Street Lighting">Street Lighting</option>
                          <option value="Electricity">Electricity</option>
                          <option value="Drainage">Drainage</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Ward</label>
                        <select
                          value={officerWard}
                          onChange={(e) => setOfficerWard(e.target.value)}
                          className="w-full border border-slate-300 rounded-lg px-2 py-2 text-xs"
                        >
                          <option value="Ward 1 — RS Puram">Ward 1 — RS Puram</option>
                          <option value="Ward 2 — Gandhipuram">Ward 2 — Gandhipuram</option>
                          <option value="Ward 3 — Peelamedu">Ward 3 — Peelamedu</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Quick Demo Officer Selection */
                  <div className="pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Select Demo Officer Credentials:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => fillQuickOfficer("9988776655")}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-left font-medium"
                      >
                        ⚡ Electrical
                      </button>
                      <button
                        type="button"
                        onClick={() => fillQuickOfficer("9988776656")}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-left font-medium"
                      >
                        💧 Water Supply
                      </button>
                      <button
                        type="button"
                        onClick={() => fillQuickOfficer("9988776657")}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-left font-medium"
                      >
                        🛣️ Roads
                      </button>
                      <button
                        type="button"
                        onClick={() => fillQuickOfficer("9988776658")}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-left font-medium"
                      >
                        🧹 Sanitation
                      </button>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-[#065f46] hover:bg-emerald-800 text-white py-3 rounded-lg font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2 mt-2"
                >
                  <span>{loading ? 'Authenticating...' : (isRegister ? 'Register Municipal Officer' : 'Login to Officer Dashboard')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col space-y-2 text-center">
              <button
                type="button"
                onClick={onOpenTrackComplaint}
                className="text-xs text-emerald-800 hover:underline font-semibold"
              >
                Track an Existing Complaint Status →
              </button>
            </div>

          </div>
        </div>

        {/* LEFT HERO COLUMN (Positioned SECOND on mobile via order-last lg:order-first) */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-white order-last lg:order-first">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/80 border border-emerald-500/30 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Coimbatore City Municipal Corporation Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Report Civic Issues. <br />
            <span className="text-emerald-400">Upvote Complaints.</span> <br />
            Transform Coimbatore.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">
            Coimbatore Civic Pulse connects citizens with Municipal Ward Officers. Citizens pin potholes, water leaks, and street light issues. Officers receive real-time ranked action queues with a strict 14-day SLA.
          </p>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 sm:pt-4">
            <div className="bg-slate-900/80 p-3.5 sm:p-4 rounded-xl border border-slate-800 backdrop-blur-xs">
              <div className="p-1.5 sm:p-2 bg-emerald-900/50 rounded-lg text-emerald-400 w-fit mb-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Map-First Reporting</h4>
              <p className="text-[11px] text-gray-400 mt-1">Interactive OpenStreetMap with ward boundaries.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 sm:p-4 rounded-xl border border-slate-800 backdrop-blur-xs">
              <div className="p-1.5 sm:p-2 bg-emerald-900/50 rounded-lg text-emerald-400 w-fit mb-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Gemini AI Check</h4>
              <p className="text-[11px] text-gray-400 mt-1">Prevents duplicate reports by comparing semantic meaning.</p>
            </div>

            <div className="bg-slate-900/80 p-3.5 sm:p-4 rounded-xl border border-slate-800 backdrop-blur-xs">
              <div className="p-1.5 sm:p-2 bg-emerald-900/50 rounded-lg text-emerald-400 w-fit mb-2">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h4 className="font-bold text-xs text-white">Officer Portal</h4>
              <p className="text-[11px] text-gray-400 mt-1">Action dashboard with 14-day SLA enforcement.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LandingLoginPage;
