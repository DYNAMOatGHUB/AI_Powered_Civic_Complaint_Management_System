import React, { useState } from "react";
import { Building2, Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import { OFFICERS } from "../data/mockComplaints.js";

export default function OfficerLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const foundOfficer = OFFICERS.find(
      (off) => off.email.toLowerCase() === cleanEmail
    );

    if (!foundOfficer) {
      setErrorMessage("Invalid officer email. Please use a registered municipal department email.");
      setIsSubmitting(false);
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage("Please enter a valid password or OTP (minimum 4 characters).");
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      onLogin(foundOfficer);
    }, 250);
  };

  const fillQuickCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("officer123");
    setErrorMessage("");
  };

  return (
    <div className="bg-[#f8fafb] text-[#191c1d] font-sans min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Login Container */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0f4c81] text-white mb-4 shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#00355f] tracking-tight">
            Municipal Officer Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Secure access for authorized personnel • Ward 1 Coimbatore
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address / Officer ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#00355f] focus:border-[#00355f] text-sm transition-colors"
                placeholder="officer@municipal.gov.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
              Password / OTP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-[#00355f] focus:border-[#00355f] text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#00355f] focus:ring-[#00355f] border-slate-300 rounded"
              />
              <label className="ml-2 block text-xs text-slate-600 font-medium" htmlFor="remember-me">
                Remember me
              </label>
            </div>
            <div className="text-xs">
              <a className="font-semibold text-[#00355f] hover:underline" href="#">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm font-bold text-sm text-white bg-[#00355f] hover:bg-[#0f4c81] focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-[#00355f] transition-colors mt-4"
          >
            <span>{isSubmitting ? "Authenticating..." : "Login"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Officer Credentials Quick Selection */}
        <div className="mt-6 text-center border-t border-slate-200 pt-4">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Registered Department Officers (Click to autofill):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-left">
            <button
              type="button"
              onClick={() => fillQuickCredentials("sathish@municipality.gov.in")}
              className="p-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors"
            >
              ⚡ Electrical Officer
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials("ramesh.water@municipality.gov.in")}
              className="p-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors"
            >
              💧 Water Officer
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials("priya.roads@municipality.gov.in")}
              className="p-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors"
            >
              🛣️ Roads Officer
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials("karthik.sanitation@municipality.gov.in")}
              className="p-2 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors"
            >
              🧹 Sanitary Inspector
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-4">Municipal Civic Complaint System v2.4.1</p>
        </div>
      </div>
    </div>
  );
}
