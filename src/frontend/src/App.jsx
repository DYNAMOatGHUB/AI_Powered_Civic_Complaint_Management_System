import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenDashboard from './pages/CitizenDashboard';
import LandingLoginPage from './pages/LandingLoginPage';
import OfficerDashboardApp from './officer-dashboard/OfficerDashboardApp';
import NewComplaintModal from './components/NewComplaintModal';
import TrackComplaintModal from './components/TrackComplaintModal';
import LoginModal from './components/LoginModal';

import client from './api/client';

function App() {
  const [user, setUser] = useState(null); // { username, mobile_number, role, officerData }
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [pinLocation, setPinLocation] = useState(null); // { lat, lng }

  // Modal states
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [isTrackComplaintOpen, setIsTrackComplaintOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const fetchData = async () => {
    try {
      const wardsRes = await client.get('/wards/');
      setWards(wardsRes.data);
      if (wardsRes.data.length > 0 && !selectedWard) {
        setSelectedWard(wardsRes.data[0]);
      }

      const complaintsRes = await client.get('/complaints/');
      setComplaints(complaintsRes.data);
    } catch (err) {
      console.error("Error loading initial data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpvote = async (complaintId) => {
    // 0ms Optimistic UI update
    setComplaints(prev => prev.map(c => 
      c.id === complaintId ? { ...c, vote_count: c.vote_count + 1 } : c
    ));

    try {
      await client.post(`/complaints/${complaintId}/upvote`);
    } catch (err) {
      console.error("Error upvoting:", err);
      // Revert if API fails
      fetchData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // If logged in as Municipal Officer, render full Officer Dashboard Application
  if (user && user.role === 'ward_officer') {
    return (
      <OfficerDashboardApp 
        currentOfficer={user.officerData || {
          id: "OFF-001",
          name: user.username || "Ward Officer",
          email: "officer@coimbatorecorp.gov.in",
          role: "Ward Officer",
          department: "Roads & Highways",
          ward: "Ward 1 — RS Puram"
        }}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 font-sans overflow-hidden">
      <Navbar 
        user={user} 
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenNewComplaint={() => {
          if (!user) setIsLoginOpen(true);
          else setIsNewComplaintOpen(true);
        }}
        onOpenTrackComplaint={() => setIsTrackComplaintOpen(true)}
      />

      {/* Main View: Landing Login Page if unauthenticated, else Citizen Dashboard */}
      {user ? (
        <CitizenDashboard 
          wards={wards}
          selectedWard={selectedWard}
          setSelectedWard={setSelectedWard}
          complaints={complaints}
          setComplaints={setComplaints}
          onOpenNewComplaint={() => {
            if (!user) setIsLoginOpen(true);
            else setIsNewComplaintOpen(true);
          }}
          onUpvote={handleUpvote}
          pinLocation={pinLocation}
          setPinLocation={setPinLocation}
          currentUser={user}
        />
      ) : (
        <LandingLoginPage 
          onLoginSuccess={(userData) => setUser(userData)}
          onOpenTrackComplaint={() => setIsTrackComplaintOpen(true)}
        />
      )}

      {/* Popup Modals */}
      <NewComplaintModal 
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        selectedWard={selectedWard}
        pinLocation={pinLocation}
        onCreated={() => fetchData()}
        onUpvote={handleUpvote}
      />

      <TrackComplaintModal 
        isOpen={isTrackComplaintOpen}
        onClose={() => setIsTrackComplaintOpen(false)}
        complaints={complaints}
      />

      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

    </div>
  );
}

export default App;
