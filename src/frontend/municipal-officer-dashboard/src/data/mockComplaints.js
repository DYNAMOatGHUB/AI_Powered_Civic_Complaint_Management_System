export const OFFICERS = [
  {
    id: "OFF-001",
    name: "Sathish Kumar",
    email: "sathish@municipality.gov.in",
    role: "Electrical / Street Lighting Officer",
    department: "Electrical",
    ward: "Ward 1 — Coimbatore",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "OFF-002",
    name: "Ramesh Kumar",
    email: "ramesh.water@municipality.gov.in",
    role: "Water Supply & Drainage Officer",
    department: "Water",
    ward: "Ward 1 — Coimbatore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "OFF-003",
    name: "Priya Sundaram",
    email: "priya.roads@municipality.gov.in",
    role: "Roads & Infrastructure Officer",
    department: "Roads",
    ward: "Ward 1 — Coimbatore",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
  },
  {
    id: "OFF-004",
    name: "Karthik Raja",
    email: "karthik.sanitation@municipality.gov.in",
    role: "Sanitary Inspector",
    department: "Sanitation",
    ward: "Ward 1 — Coimbatore",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250"
  }
];

export const INITIAL_COMPLAINTS = [
  {
    id: "CID-001",
    title: "Hanging electrical wire on main road",
    category: "Electrical",
    department: "Electrical",
    priority: "P1",
    priorityLabel: "P1 — Critical",
    priorityColor: "red",
    priorityScore: 95,
    severity: 9,
    status: "Pending", // Pending, Ongoing, Awaiting Verification, Completed, Reopened
    submissionDate: "Saturday, August 8, 2026",
    submissionTime: "8:00 AM",
    submittedAtISO: "2026-08-08T08:00:00.000Z",
    dateGroup: "TODAY — AUGUST 8",
    affectedResidents: 17,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "Main Street, Near Bus Stop #4, Ward 1, Coimbatore",
    lat: 11.0168,
    lng: 76.9558,
    description: "An electrical wire has been cut and is hanging across the street. It is very close to pedestrians and heavy vehicle movement. Needs urgent securing before nightfall.",
    citizenName: "Venkatesh S.",
    citizenPhone: "+91 98421 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1544724793-c6e382b63737?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 9,
      severityLabel: "9 / 10 — Critical",
      urgency: "High",
      hazardType: "Electrical Safety Hazard",
      confidence: "93%",
      reasoning: "The uploaded image and description indicate a potentially dangerous hanging electrical wire in a public pedestrian/vehicle area."
    },
    communityImpact: [
      { id: 1, text: "17 citizens have indicated they are affected by this issue.", timestamp: "8:15 AM" },
      { id: 2, text: "Subramaniam: School children cross this junction every morning at 8:30 AM.", timestamp: "8:30 AM" }
    ],
    officerResponse: null,
    resolutionEvidence: null,
    citizenVerification: null,
    resolutionAttempts: 0,
    isEscalated: false,
    history: [
      {
        id: "h-101",
        timestamp: "Aug 8, 8:00 AM",
        actor: "Citizen (Venkatesh S.)",
        action: "Submitted complaint",
        details: "Hanging electrical wire on main road"
      }
    ]
  },
  {
    id: "CID-006",
    title: "Damaged streetlight wiring causing sparks",
    category: "Electrical",
    department: "Electrical",
    priority: "P1",
    priorityLabel: "P1 — Critical",
    priorityColor: "red",
    priorityScore: 98,
    severity: 9,
    status: "Reopened", // Reopened status
    submissionDate: "Friday, August 7, 2026",
    submissionTime: "6:30 PM",
    submittedAtISO: "2026-08-07T18:30:00.000Z",
    dateGroup: "YESTERDAY — AUGUST 7",
    affectedResidents: 8,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "12th Cross Street, Junction Pole #14, Ward 1, Coimbatore",
    lat: 11.0210,
    lng: 76.9602,
    description: "Streetlight box was hanging open and sparking when wind blew. Reopened because the second junction box on adjacent pole was left loose.",
    citizenName: "Anand M.",
    citizenPhone: "+91 94432 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1558441719-6705c670a845?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 9,
      severityLabel: "9 / 10 — Critical",
      urgency: "Immediate",
      hazardType: "Electrical Fire / Shock",
      confidence: "96%",
      reasoning: "Recurring electrical spark reported near public walkway. Multiple resolution failures detected."
    },
    communityImpact: [
      { id: 1, text: "8 citizens have confirmed active electrical sparking during evening rainfall.", timestamp: "Yesterday 7:00 PM" }
    ],
    officerResponse: {
      message: "EB team inspected junction box and replaced main fuse.",
      expectedDate: "2026-08-08",
      expectedTime: "11:00 AM",
      actionPlan: "Fuse replacement and insulation wrapping.",
      respondedAt: "Aug 8, 9:00 AM"
    },
    resolutionEvidence: {
      photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
      description: "Replaced damaged fuse box and insulated exposed wires.",
      submittedAt: "Aug 8, 11:30 AM"
    },
    citizenVerification: {
      status: "not_fixed",
      rejectionReason: "The main pole fuse was wrapped, but the adjacent pole #12B wire is still dangling loose and sparking in heavy rain.",
      newPhotoUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&q=80&w=800",
      verifiedAt: "Aug 8, 1:15 PM"
    },
    resolutionAttempts: 2,
    isEscalated: true,
    escalationReason: "This complaint has been reopened twice after attempted resolution.",
    history: [
      { id: "h-601", timestamp: "Aug 7, 6:30 PM", actor: "Citizen", action: "Submitted complaint", details: "Sparking streetlight wiring" },
      { id: "h-602", timestamp: "Aug 8, 9:00 AM", actor: "Officer (Sathish Kumar)", action: "Responded to citizen", details: "EB team dispatched for 11 AM" },
      { id: "h-603", timestamp: "Aug 8, 11:30 AM", actor: "Officer (Sathish Kumar)", action: "Uploaded completion evidence", details: "Status: Awaiting Verification" },
      { id: "h-604", timestamp: "Aug 8, 1:15 PM", actor: "Citizen (Anand M.)", action: "Rejected resolution ❌", details: "Adjacent pole wire dangling loose. Reopened CID 006." },
      { id: "h-605", timestamp: "Aug 8, 1:16 PM", actor: "System", action: "Triggered Escalation ⚠️", details: "Resolution attempts: 2. Supervisor notified." }
    ]
  },
  {
    id: "CID-002",
    title: "Broken streetlight on 4th Cross Road",
    category: "Electrical",
    department: "Electrical",
    priority: "P2",
    priorityLabel: "P2 — High",
    priorityColor: "orange",
    priorityScore: 82,
    severity: 7,
    status: "Pending",
    submissionDate: "Saturday, August 8, 2026",
    submissionTime: "9:00 AM",
    submittedAtISO: "2026-08-08T09:00:00.000Z",
    dateGroup: "TODAY — AUGUST 8",
    affectedResidents: 9,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "4th Cross Road, Near Ganesha Temple, Ward 1, Coimbatore",
    lat: 11.0185,
    lng: 76.9580,
    description: "The LED streetlight fixture is completely dark for the last 2 days. The entire stretch of road is dark at night.",
    citizenName: "Kavitha R.",
    citizenPhone: "+91 97890 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 7,
      severityLabel: "7 / 10 — High",
      urgency: "Medium-High",
      hazardType: "Public Safety / Vision Hazard",
      confidence: "91%",
      reasoning: "Dark roadway reported near residential sector. Non-functional streetlight fixture verified."
    },
    communityImpact: [
      { id: 1, text: "9 residents affected on 4th Cross Road.", timestamp: "9:10 AM" }
    ],
    officerResponse: null,
    resolutionEvidence: null,
    citizenVerification: null,
    resolutionAttempts: 0,
    isEscalated: false,
    history: [
      { id: "h-201", timestamp: "Aug 8, 9:00 AM", actor: "Citizen (Kavitha R.)", action: "Submitted complaint", details: "Broken streetlight on 4th Cross Road" }
    ]
  },
  {
    id: "CID-003",
    title: "Flickering streetlight fixture near Park Entrance",
    category: "Electrical",
    department: "Electrical",
    priority: "P3",
    priorityLabel: "P3 — Medium",
    priorityColor: "yellow",
    priorityScore: 55,
    severity: 5,
    status: "Ongoing",
    submissionDate: "Saturday, August 8, 2026",
    submissionTime: "10:15 AM",
    submittedAtISO: "2026-08-08T10:15:00.000Z",
    dateGroup: "TODAY — AUGUST 8",
    affectedResidents: 3,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "VOC Park East Gate Entrance, Ward 1, Coimbatore",
    lat: 11.0142,
    lng: 76.9621,
    description: "Streetlight flickers constantly causing annoyance and driver distraction.",
    citizenName: "Murugan P.",
    citizenPhone: "+91 98433 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 5,
      severityLabel: "5 / 10 — Medium",
      urgency: "Low-Medium",
      hazardType: "Lighting Nuisance",
      confidence: "88%",
      reasoning: "Intermittent bulb driver failure suspected."
    },
    communityImpact: [
      { id: 1, text: "3 residents affected near park entrance.", timestamp: "10:30 AM" }
    ],
    officerResponse: {
      message: "Electrical technician assigned to replace driver unit tomorrow at 2:00 PM.",
      expectedDate: "2026-08-09",
      expectedTime: "2:00 PM",
      actionPlan: "Replace 100W LED driver unit.",
      respondedAt: "Aug 8, 11:00 AM"
    },
    resolutionEvidence: null,
    citizenVerification: null,
    resolutionAttempts: 0,
    isEscalated: false,
    history: [
      { id: "h-301", timestamp: "Aug 8, 10:15 AM", actor: "Citizen", action: "Submitted complaint", details: "Flickering streetlight" },
      { id: "h-302", timestamp: "Aug 8, 11:00 AM", actor: "Officer (Sathish Kumar)", action: "Responded to citizen", details: "EB technician assigned for tomorrow 2 PM" }
    ]
  },
  {
    id: "CID-004",
    title: "Completed: Replaced blown LED luminaire on 2nd Avenue",
    category: "Electrical",
    department: "Electrical",
    priority: "P4",
    priorityLabel: "P4 — Low",
    priorityColor: "green",
    priorityScore: 30,
    severity: 3,
    status: "Completed",
    submissionDate: "Thursday, August 6, 2026",
    submissionTime: "4:00 PM",
    submittedAtISO: "2026-08-06T16:00:00.000Z",
    dateGroup: "AUGUST 6",
    affectedResidents: 7,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "2nd Avenue, Near Post Office, Ward 1, Coimbatore",
    lat: 11.0199,
    lng: 76.9530,
    description: "Dim lighting at end of street.",
    citizenName: "Senthil Kumar",
    citizenPhone: "+91 99944 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 3,
      severityLabel: "3 / 10 — Low",
      urgency: "Low",
      hazardType: "Minor Maintenance",
      confidence: "95%",
      reasoning: "Routine bulb replacement requirement."
    },
    communityImpact: [
      { id: 1, text: "7 residents affected.", timestamp: "Aug 6, 4:15 PM" }
    ],
    officerResponse: {
      message: "Luminaire replacement scheduled for Aug 7 morning.",
      expectedDate: "2026-08-07",
      expectedTime: "10:00 AM",
      actionPlan: "Install new 120W LED fixture.",
      respondedAt: "Aug 6, 5:00 PM"
    },
    resolutionEvidence: {
      photoUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
      description: "Installed brand new 120W LED luminaire and tested line voltage (230V OK).",
      submittedAt: "Aug 7, 10:45 AM"
    },
    citizenVerification: {
      status: "fixed",
      rejectionReason: "",
      newPhotoUrl: null,
      verifiedAt: "Aug 7, 2:30 PM"
    },
    resolutionAttempts: 1,
    isEscalated: false,
    history: [
      { id: "h-401", timestamp: "Aug 6, 4:00 PM", actor: "Citizen", action: "Submitted complaint", details: "Dim lighting at 2nd Avenue" },
      { id: "h-402", timestamp: "Aug 6, 5:00 PM", actor: "Officer", action: "Responded", details: "Replacement set for Aug 7" },
      { id: "h-403", timestamp: "Aug 7, 10:45 AM", actor: "Officer", action: "Submitted completion evidence", details: "Installed 120W LED fixture" },
      { id: "h-404", timestamp: "Aug 7, 2:30 PM", actor: "Citizen (Senthil)", action: "Confirmed ✅ Issue Fixed", details: "Complaint marked Completed" }
    ]
  },
  // Other Departments Complaints for seamless role switching testing
  {
    id: "CID-101",
    title: "Burst main water pipeline flooding Gandhi Nagar 2nd Street",
    category: "Water",
    department: "Water",
    priority: "P1",
    priorityLabel: "P1 — Critical",
    priorityColor: "red",
    priorityScore: 97,
    severity: 10,
    status: "Ongoing",
    submissionDate: "Saturday, August 8, 2026",
    submissionTime: "7:30 AM",
    submittedAtISO: "2026-08-08T07:30:00.000Z",
    dateGroup: "TODAY — AUGUST 8",
    affectedResidents: 42,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "Gandhi Nagar 2nd Street, Near Water Tank, Ward 1, Coimbatore",
    lat: 11.0110,
    lng: 76.9510,
    description: "Main 12-inch drinking water pipe burst under heavy lorry pressure. Water flowing heavily into residential houses.",
    citizenName: "Rajeshwari N.",
    citizenPhone: "+91 98425 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 10,
      severityLabel: "10 / 10 — Critical",
      urgency: "Immediate",
      hazardType: "Water Contamination & Inundation",
      confidence: "98%",
      reasoning: "Major infrastructure pipeline rupture causing residential flooding."
    },
    communityImpact: [
      { id: 1, text: "42 residents affected across Gandhi Nagar.", timestamp: "7:45 AM" }
    ],
    officerResponse: {
      message: "Water valve isolated. Heavy pipe repair gang en route. Expected pipe welding completion by 4:00 PM today.",
      expectedDate: "2026-08-08",
      expectedTime: "4:00 PM",
      actionPlan: "Replace 3-meter section of 12-inch DI pipe.",
      respondedAt: "Aug 8, 8:15 AM"
    },
    resolutionEvidence: null,
    citizenVerification: null,
    resolutionAttempts: 0,
    isEscalated: false,
    history: [
      { id: "h-w101", timestamp: "Aug 8, 7:30 AM", actor: "Citizen", action: "Submitted complaint", details: "Burst main pipeline" },
      { id: "h-w102", timestamp: "Aug 8, 8:15 AM", actor: "Water Officer (Ramesh)", action: "Responded", details: "Valve isolated, gang en route" }
    ]
  },
  {
    id: "CID-201",
    title: "Dangerous deep pothole near St. Joseph School entrance",
    category: "Roads",
    department: "Roads",
    priority: "P2",
    priorityLabel: "P2 — High",
    priorityColor: "orange",
    priorityScore: 78,
    severity: 8,
    status: "Pending",
    submissionDate: "Saturday, August 8, 2026",
    submissionTime: "8:45 AM",
    submittedAtISO: "2026-08-08T08:45:00.000Z",
    dateGroup: "TODAY — AUGUST 8",
    affectedResidents: 21,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "School Road, Opp St. Joseph High School, Ward 1, Coimbatore",
    lat: 11.0250,
    lng: 76.9590,
    description: "Large 1.5 ft deep pothole filled with rainwater. Two scooter riders fell yesterday evening.",
    citizenName: "Gopal V.",
    citizenPhone: "+91 97901 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 8,
      severityLabel: "8 / 10 — High",
      urgency: "High",
      hazardType: "Traffic Safety Hazard",
      confidence: "94%",
      reasoning: "Deep crater in high school zone active traffic route."
    },
    communityImpact: [
      { id: 1, text: "21 residents affected. School bus drivers alerted.", timestamp: "9:00 AM" }
    ],
    officerResponse: null,
    resolutionEvidence: null,
    citizenVerification: null,
    resolutionAttempts: 0,
    isEscalated: false,
    history: [
      { id: "h-r201", timestamp: "Aug 8, 8:45 AM", actor: "Citizen", action: "Submitted complaint", details: "Pothole near school" }
    ]
  },
  {
    id: "CID-301",
    title: "Uncollected commercial garbage pile behind Vegetable Market",
    category: "Sanitation",
    department: "Sanitation",
    priority: "P3",
    priorityLabel: "P3 — Medium",
    priorityColor: "yellow",
    priorityScore: 62,
    severity: 6,
    status: "Pending",
    submissionDate: "Saturday, August 8, 2026",
    submissionTime: "9:15 AM",
    submittedAtISO: "2026-08-08T09:15:00.000Z",
    dateGroup: "TODAY — AUGUST 8",
    affectedResidents: 32,
    ward: "Ward 1 — Coimbatore",
    locationAddress: "Market Road Rear Gate, Ward 1, Coimbatore",
    lat: 11.0130,
    lng: 76.9540,
    description: "Vegetable waste accumulating for 3 days causing severe odor and stray dog gathering.",
    citizenName: "Manikandan C.",
    citizenPhone: "+91 94441 *****",
    reportedImageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800",
    aiAssessment: {
      severityScore: 6,
      severityLabel: "6 / 10 — Medium",
      urgency: "Medium",
      hazardType: "Public Health / Bio-waste",
      confidence: "92%",
      reasoning: "Organic decay accumulation in public market zone."
    },
    communityImpact: [
      { id: 1, text: "32 market vendors and residents affected.", timestamp: "9:30 AM" }
    ],
    officerResponse: null,
    resolutionEvidence: null,
    citizenVerification: null,
    resolutionAttempts: 0,
    isEscalated: false,
    history: [
      { id: "h-s301", timestamp: "Aug 8, 9:15 AM", actor: "Citizen", action: "Submitted complaint", details: "Garbage accumulation" }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New P1 Critical Complaint",
    message: "Hanging electrical wire on main road — CID 001",
    timestamp: "8:00 AM",
    type: "p1_new",
    cid: "CID-001",
    read: false
  },
  {
    id: "notif-2",
    title: "⚠️ Complaint Reopened",
    message: "CID 006 has been reopened because citizen reported issue still unresolved.",
    timestamp: "1:16 PM",
    type: "reopened",
    cid: "CID-006",
    read: false
  },
  {
    id: "notif-3",
    title: "Citizen Resolution Confirmed",
    message: "Citizen verified CID 004 as resolved. Complaint marked Completed.",
    timestamp: "Aug 7, 2:30 PM",
    type: "verified",
    cid: "CID-004",
    read: true
  }
];
