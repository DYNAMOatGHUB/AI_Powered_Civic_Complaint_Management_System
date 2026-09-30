import React, { useState } from "react";
import { User, LogOut, Building2, MapPin, ChevronDown, Shield, Menu, X } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

export default function Header({
  currentOfficer,
  notifications,
  onSelectNotification,
  onMarkAllRead,
  onLogout,
  onOpenProfile
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-[#065f46] text-white sticky top-0 z-40 shadow-md border-b border-emerald-700 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Ward Identification */}
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 sm:p-2 bg-emerald-800 rounded-lg text-white font-bold shrink-0 shadow-2xs border border-emerald-600/40">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-white text-sm sm:text-base md:text-lg truncate max-w-[200px] sm:max-w-none">
                  Coimbatore Corporation
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-medium bg-emerald-800 text-emerald-100 rounded border border-emerald-500/30">
                  Officer Action Portal
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[11px] sm:text-xs text-emerald-200 mt-0.5">
                <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
                <span className="font-semibold text-emerald-100 truncate">{currentOfficer.ward || "Ward 1 — RS Puram"}</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions (Desktop) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Officer Department Badge (Desktop) */}
            <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5 text-emerald-300" />
              <span>{currentOfficer.department || "Roads & Highways"} Dept</span>
            </div>

            {/* Notification Bell */}
            <NotificationDropdown
              notifications={notifications}
              onSelectNotification={onSelectNotification}
              onMarkAllRead={onMarkAllRead}
            />

            {/* Officer Profile & Dropdown (Desktop) */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-emerald-800 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center border border-emerald-500/50 text-emerald-200">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white">{currentOfficer.name || "Ward Officer"}</div>
                  <div className="text-[10px] text-emerald-200 font-semibold">{currentOfficer.role || "Officer"}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-emerald-950 rounded-xl shadow-2xl border border-emerald-700 z-50 overflow-hidden text-xs text-white divide-y divide-emerald-800">
                    <div className="p-3 bg-emerald-900">
                      <p className="font-bold text-white text-sm">{currentOfficer.name || "Ward Officer"}</p>
                      <p className="text-emerald-200 text-[11px] truncate mt-0.5">{currentOfficer.email || "officer@coimbatorecorp.gov.in"}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-100 border border-emerald-600/30">
                        {currentOfficer.role || "Ward Officer"}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-emerald-800 flex items-center space-x-2.5 text-white font-semibold transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-300" />
                        <span>Officer Profile</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-950 text-red-300 hover:text-red-100 flex items-center space-x-2.5 font-semibold transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg text-emerald-100 hover:bg-emerald-800 sm:hidden focus:outline-none"
              aria-label="Toggle Officer Navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu for Officer Header */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-emerald-900 border-t border-emerald-700 px-4 pt-3 pb-4 space-y-3 shadow-xl">
          <div className="p-3 bg-emerald-950 rounded-xl space-y-1 text-xs">
            <p className="font-bold text-white text-sm">{currentOfficer.name || "Ward Officer"}</p>
            <p className="text-emerald-200 text-[11px] truncate">{currentOfficer.email || "officer@coimbatorecorp.gov.in"}</p>
            <div className="flex items-center space-x-2 pt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-100 border border-emerald-600/30">
                {currentOfficer.role || "Ward Officer"}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-800 text-emerald-100 border border-emerald-600/30">
                {currentOfficer.department || "Roads"} Dept
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-white bg-emerald-800"
            >
              <User className="w-4 h-4 text-emerald-300" />
              <span>Officer Profile</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onLogout) onLogout();
              }}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-xs font-bold text-red-300 bg-red-950/80 hover:bg-red-900"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
