import React, { useState } from 'react';
import { MapPin, LogOut, ChevronDown, FileText, AlertCircle, PhoneCall, MessageSquare, Info, Menu, X } from 'lucide-react';

function Navbar({ user, onOpenLogin, onLogout, onOpenNewComplaint, onOpenTrackComplaint }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-emerald-800 text-white shadow-md z-30 relative border-b border-emerald-700 font-sans shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-2.5 cursor-pointer">
            <div className="bg-white p-1.5 sm:p-2 rounded-full text-emerald-800 shadow-sm shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-base sm:text-xl leading-tight tracking-wide truncate">
                Coimbatore Civic Pulse
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-200 truncate">Coimbatore City Municipal Corporation</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <button 
              onClick={() => alert("Coimbatore Civic Pulse connects citizens directly with Municipal Officers for rapid infrastructure resolution, duplicate prevention, and real-time grievance tracking.")}
              className="flex items-center space-x-1.5 hover:text-emerald-200 transition"
            >
              <Info className="w-4 h-4 text-emerald-300" />
              <span>About Us</span>
            </button>

            {/* Complaints Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1.5 hover:text-emerald-200 transition focus:outline-none"
              >
                <FileText className="w-4 h-4 text-emerald-300" />
                <span>Complaints</span>
                <ChevronDown className="w-4 h-4 text-emerald-300" />
              </button>

              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-52 bg-white text-gray-800 rounded-xl shadow-2xl py-1.5 z-50 border border-gray-100 divide-y divide-gray-100 text-xs">
                    <div className="py-1">
                      <button 
                        onClick={() => { setDropdownOpen(false); onOpenNewComplaint(); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-emerald-50 text-emerald-900 w-full text-left font-bold"
                      >
                        <AlertCircle className="w-4 h-4 text-emerald-700" />
                        <span>New Complaint</span>
                      </button>
                      <button 
                        onClick={() => { setDropdownOpen(false); onOpenTrackComplaint(); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left font-medium"
                      >
                        <FileText className="w-4 h-4 text-slate-600" />
                        <span>Track Complaint</span>
                      </button>
                    </div>
                    <div className="py-1">
                      <button 
                        onClick={() => { setDropdownOpen(false); alert("Helpline: 1800-425-4020\nEmail: grievance@coimbatorecorp.gov.in\nAddress: Big Bazaar St, Town Hall, Coimbatore, TN 641001"); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left font-medium"
                      >
                        <PhoneCall className="w-4 h-4 text-slate-600" />
                        <span>Contact Us</span>
                      </button>
                      <button 
                        onClick={() => { setDropdownOpen(false); alert("Thank you for using Civic Pulse! Your feedback helps keep Coimbatore clean and functional."); }}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 w-full text-left font-medium"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-600" />
                        <span>Feedback</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header Auth Controls (Desktop & Mobile Trigger) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden sm:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-emerald-900/90 border border-emerald-600 px-3 py-1.5 rounded-full text-emerald-100 font-bold shadow-inner">
                    👤 {user.username} (citizen)
                  </span>
                  <button 
                    onClick={onLogout}
                    className="p-1.5 hover:bg-emerald-700 rounded-full transition text-emerald-200"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onOpenLogin}
                  className="bg-white text-emerald-900 px-4 py-1.5 rounded-lg font-bold text-xs hover:bg-emerald-50 transition shadow-sm"
                >
                  Login / Register
                </button>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-100 hover:bg-emerald-700 transition md:hidden focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-emerald-900 border-t border-emerald-700 px-4 pt-3 pb-4 space-y-3 shadow-xl">
          <div className="space-y-1">
            <button 
              onClick={() => { setMobileMenuOpen(false); alert("Coimbatore Civic Pulse connects citizens directly with Municipal Officers for rapid infrastructure resolution, duplicate prevention, and real-time grievance tracking."); }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-100 hover:bg-emerald-800"
            >
              <Info className="w-4 h-4 text-emerald-300" />
              <span>About Us</span>
            </button>

            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenNewComplaint(); }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold bg-emerald-800 text-white"
            >
              <AlertCircle className="w-4 h-4 text-emerald-300" />
              <span>Report New Complaint</span>
            </button>

            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenTrackComplaint(); }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-100 hover:bg-emerald-800"
            >
              <FileText className="w-4 h-4 text-emerald-300" />
              <span>Track Complaint</span>
            </button>

            <button 
              onClick={() => { setMobileMenuOpen(false); alert("Helpline: 1800-425-4020\nEmail: grievance@coimbatorecorp.gov.in\nAddress: Big Bazaar St, Town Hall, Coimbatore, TN 641001"); }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-100 hover:bg-emerald-800"
            >
              <PhoneCall className="w-4 h-4 text-emerald-300" />
              <span>Contact Us</span>
            </button>

            <button 
              onClick={() => { setMobileMenuOpen(false); alert("Thank you for using Civic Pulse! Your feedback helps keep Coimbatore clean and functional."); }}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-emerald-100 hover:bg-emerald-800"
            >
              <MessageSquare className="w-4 h-4 text-emerald-300" />
              <span>Feedback</span>
            </button>
          </div>

          <div className="pt-2 border-t border-emerald-800">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-950 rounded-lg text-xs text-emerald-100">
                <span className="font-bold truncate">👤 {user.username} (citizen)</span>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                  className="px-2.5 py-1 bg-red-900/80 hover:bg-red-800 text-white rounded font-bold text-[11px]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                className="w-full bg-white text-emerald-900 py-2.5 rounded-lg font-bold text-xs text-center shadow-md"
              >
                Login / Register Account
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
