import React, { useState } from "react";
import { User, LogOut, Building2, MapPin, ChevronDown, Shield } from "lucide-react";
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

  return (
    <header className="bg-[#00355f] text-white sticky top-0 z-40 shadow-md border-b border-[#0f4c81]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Ward Identification */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#0f4c81] rounded-lg text-white font-bold shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  Municipal Civic Complaint System
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[11px] font-medium bg-[#0f4c81] text-indigo-100 rounded border border-indigo-300/20">
                  Officer Portal
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-indigo-200 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-300 shrink-0" />
                <span className="font-semibold text-indigo-100">{currentOfficer.ward}</span>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Static Officer Department Badge */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-[#0f4c81] text-white text-xs font-semibold border border-indigo-300/20">
              <Shield className="w-3.5 h-3.5 text-indigo-200" />
              <span>{currentOfficer.department} Dept</span>
            </div>

            {/* Notification Bell */}
            <NotificationDropdown
              notifications={notifications}
              onSelectNotification={onSelectNotification}
              onMarkAllRead={onMarkAllRead}
            />

            {/* Officer Profile & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-[#0f4c81] transition-colors focus:outline-hidden"
              >
                {/* Profile Picture Removed as requested: Replaced with clean Officer User Icon */}
                <div className="w-8 h-8 rounded-full bg-[#0f4c81] flex items-center justify-center border border-indigo-300/40 text-indigo-200">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white">{currentOfficer.name}</div>
                  <div className="text-[10px] text-indigo-200 font-semibold">{currentOfficer.department} Officer</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-300 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-[#001c37] rounded-xl shadow-2xl border border-[#0f4c81] z-50 overflow-hidden text-xs text-white divide-y divide-[#0f4c81]/60">
                    <div className="p-3 bg-[#001428]">
                      <p className="font-bold text-white text-sm">{currentOfficer.name}</p>
                      <p className="text-indigo-200 text-[11px] truncate mt-0.5">{currentOfficer.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0f4c81] text-indigo-100 border border-indigo-300/20">
                        {currentOfficer.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (onOpenProfile) onOpenProfile();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#0f4c81] flex items-center space-x-2.5 text-white font-semibold transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-300" />
                        <span>Officer Profile</span>
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          if (onLogout) onLogout();
                          else window.location.reload();
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-950/80 text-red-300 hover:text-red-100 flex items-center space-x-2.5 font-semibold transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
