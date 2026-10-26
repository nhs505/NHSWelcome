/**
 * STF-NHS v3.0 — Enterprise State, Single-Device Session Lock & MySQL Sync (dbService.js)
 * -----------------------------------------------------------------------------------------
 * Synchronizes with PHP 8.2 + MySQL 8.0 Backend (api/auth.php & api/index.php)
 * and provides full local persistence + live MySQL Dump export.
 */

import {
     INITIAL_GROUPS,
     RECRUIT_CHECKLIST,
     trackData as INITIAL_IT_TRACKS,
     hwTrackData as INITIAL_HW_TRACKS,
} from "./content.js";

const STORAGE_KEY = "stf_nhs_v3_enterprise_db";
const SESSION_KEY = "stf_nhs_v3_tab_session";
const DEVICE_LOCKS_KEY = "stf_nhs_v3_device_locks";

// Default SVG Data URI Avatars
export const AVATARS = {
     admin: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='48' fill='%231e1b2e'/><circle cx='48' cy='36' r='16' fill='%23f0a500'/><path d='M20 82c4-16 16-24 28-24s24 8 28 24' fill='%23f0a500'/></svg>",
     member1: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='48' fill='%230f2438'/><circle cx='48' cy='36' r='16' fill='%2338bdf8'/><path d='M20 82c4-16 16-24 28-24s24 8 28 24' fill='%2338bdf8'/></svg>",
     member2: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='48' fill='%23112a22'/><circle cx='48' cy='36' r='16' fill='%234ade80'/><path d='M20 82c4-16 16-24 28-24s24 8 28 24' fill='%234ade80'/></svg>",
     trainee: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'><rect width='96' height='96' rx='48' fill='%23291d3a'/><circle cx='48' cy='36' r='16' fill='%23c084fc'/><path d='M20 82c4-16 16-24 28-24s24 8 28 24' fill='%23c084fc'/></svg>",
};

export const THEME_PALETTES = {
     gold: { name: "Tactical Gold (NHS Default)", primary: "#f0a500", secondary: "#38bdf8" },
     cyan: { name: "Cyber Cyan", primary: "#38bdf8", secondary: "#4ade80" },
     emerald: { name: "Emerald Matrix", primary: "#4ade80", secondary: "#f0a500" },
     violet: { name: "Royal Violet", primary: "#a78bfa", secondary: "#38bdf8" },
     crimson: { name: "Crimson Ops", primary: "#f87171", secondary: "#f0a500" },
};

export const V3_USERS = [
     {
          id: 1,
          sectorCode: "SECTOR-111",
          username: "sector111",
          password: "admin123",
          fullName: "Sector 111 (Chief Admin)",
          email: "sector111@nhs.sfm.local",
          role: "admin",
          memberType: "none",
          primaryGroup: "05",
          avatar: AVATARS.admin,
          bio: "STF-NHS System Architect & Operations Lead",
          isActive: true,
          availability: "available",
          progressPct: 100,
          orientationDone: true,
     },
     {
          id: 2,
          sectorCode: "ADM-2025-02",
          username: "admin_elijah",
          password: "admin123",
          fullName: "Bro. Elijah (Deputy Admin)",
          email: "elijah@nhs.sfm.local",
          role: "admin",
          memberType: "none",
          primaryGroup: "03",
          avatar: AVATARS.admin,
          bio: "NHS Administration & Security Auditor",
          isActive: true,
          availability: "available",
          progressPct: 100,
          orientationDone: true,
     },
     {
          id: 3,
          sectorCode: "MEM-2025-08",
          username: "marco",
          password: "member123",
          fullName: "Bro. Marco (Infra Project Lead)",
          email: "marco@nhs.sfm.local",
          role: "member",
          memberType: "project_member",
          primaryGroup: "05",
          avatar: AVATARS.member1,
          bio: "Proxmox VE & Linux Cluster Specialist (Project Member)",
          isActive: true,
          availability: "available",
          progressPct: 92,
          orientationDone: true,
     },
     {
          id: 4,
          sectorCode: "MEM-2025-14",
          username: "daniel",
          password: "member123",
          fullName: "Bro. Daniel (Hardware Project Spec)",
          email: "daniel@nhs.sfm.local",
          role: "member",
          memberType: "project_member",
          primaryGroup: "00",
          avatar: AVATARS.member2,
          bio: "Workstation Assembly & Clonezilla Imaging Lead",
          isActive: true,
          availability: "busy",
          progressPct: 88,
          orientationDone: true,
     },
     {
          id: 5,
          sectorCode: "MEM-2025-19",
          username: "lucas",
          password: "member123",
          fullName: "Bro. Lucas (Network Project Eng)",
          email: "lucas@nhs.sfm.local",
          role: "member",
          memberType: "project_member",
          primaryGroup: "02",
          avatar: AVATARS.member1,
          bio: "VLAN & Congregation Wi-Fi Deployment Member",
          isActive: false,
          availability: "available",
          progressPct: 75,
          orientationDone: true,
     },
     {
          id: 6,
          sectorCode: "PLN-2026-01",
          username: "ethan",
          password: "member123",
          fullName: "Bro. Ethan (Plenary Class)",
          email: "ethan@nhs.sfm.local",
          role: "member",
          memberType: "plenary",
          primaryGroup: "05",
          avatar: AVATARS.member2,
          bio: "Plenary Class Student — Strong candidate for Project Member",
          isActive: true,
          availability: "available",
          progressPct: 85,
          orientationDone: true,
     },
     {
          id: 7,
          sectorCode: "PLN-2026-04",
          username: "micah",
          password: "member123",
          fullName: "Bro. Micah (Plenary Class)",
          email: "micah@nhs.sfm.local",
          role: "member",
          memberType: "plenary",
          primaryGroup: "00",
          avatar: AVATARS.member1,
          bio: "Plenary Class — Completed Hardware Lab bench exams",
          isActive: true,
          availability: "available",
          progressPct: 80,
          orientationDone: true,
     },
     {
          id: 8,
          sectorCode: "TRN-2026-101",
          username: "joshua",
          password: "trainee123",
          fullName: "Bro. Joshua (NHS Trainee)",
          email: "joshua@nhs.sfm.local",
          role: "trainee",
          memberType: "none",
          primaryGroup: "00",
          avatar: AVATARS.trainee,
          bio: "Finished Orientation — Ready for Plenary/Project evaluation",
          isActive: true,
          availability: "available",
          progressPct: 100,
          orientationDone: true,
     },
     {
          id: 9,
          sectorCode: "TRN-2026-102",
          username: "caleb",
          password: "trainee123",
          fullName: "Bro. Caleb (NHS Trainee)",
          email: "caleb@nhs.sfm.local",
          role: "trainee",
          memberType: "none",
          primaryGroup: "05",
          avatar: AVATARS.trainee,
          bio: "Currently studying Proxmox VE & Linux Command Line tracks",
          isActive: true,
          availability: "available",
          progressPct: 60,
          orientationDone: false,
     },
     {
          id: 10,
          sectorCode: "TRN-2026-103",
          username: "noah",
          password: "trainee123",
          fullName: "Bro. Noah (NHS Trainee)",
          email: "noah@nhs.sfm.local",
          role: "trainee",
          memberType: "none",
          primaryGroup: "01",
          avatar: AVATARS.trainee,
          bio: "New Trainee exploring Hardware & IoT fundamentals",
          isActive: true,
          availability: "available",
          progressPct: 35,
          orientationDone: false,
     },
];

export const INITIAL_TEAMS = [
     {
          id: 1,
          name: "Alpha Infra & Proxmox Squad",
          groupCode: "05",
          leadUserId: 3,
          memberIds: [3, 6],
          description: "Manages Proxmox VE clusters, LXC containers, and MySQL database backups.",
     },
     {
          id: 2,
          name: "Bravo Hardware & Imaging Unit",
          groupCode: "00",
          leadUserId: 4,
          memberIds: [4, 7],
          description: "Handles workstation assembly, preventive maintenance, and Clonezilla imaging.",
     },
     {
          id: 3,
          name: "Charlie Network & IoT Ops",
          groupCode: "02",
          leadUserId: 5,
          memberIds: [5],
          description: "Deploys managed switches, congregation Wi-Fi access points, and sensors.",
     },
];

export const INITIAL_PROJECTS = [
     {
          id: 101,
          name: "Proxmox VE Cluster & MySQL Portal Deployment",
          description: "Deploy high-availability Proxmox VE nodes and migrate NHS Orientation DB to MySQL 8.0.",
          status: "In-Progress",
          priority: "High",
          progressPct: 75,
          assignedTeamId: 1,
          attachments: [
               { name: "proxmox-cluster-topology.pdf", type: "application/pdf", size: "1.4 MB" },
               { name: "mysql_schema.sql", type: "application/sql", size: "18 KB" },
          ],
          deadlineStart: "2026-10-24",
          deadlineEnd: "2026-10-31",
          createdAt: "2026-10-20",
          createdBy: "Sector 111 (Admin)",
     },
     {
          id: 102,
          name: "Lab Workstation Batch Imaging (30 Units)",
          description: "Assemble and image 30 classroom PCs using Ventoy and Clonezilla multicast.",
          status: "Finish project",
          priority: "Medium",
          progressPct: 100,
          assignedTeamId: 2,
          attachments: [
               { name: "bios-checklist.xlsx", type: "application/vnd.ms-excel", size: "420 KB" },
          ],
          deadlineStart: "2026-10-15",
          deadlineEnd: "2026-10-22",
          createdAt: "2026-10-14",
          createdBy: "Bro. Marco (Member)",
     },
     {
          id: 103,
          name: "Chapel & Classroom Wi-Fi Roaming Upgrade",
          description: "Configure VLAN segmentation and PoE switch trunks for seamless access point handoff.",
          status: "On-Hold",
          priority: "Low",
          progressPct: 40,
          assignedTeamId: 3,
          attachments: [],
          deadlineStart: "2026-11-01",
          deadlineEnd: "2026-11-10",
          createdAt: "2026-10-21",
          createdBy: "Sector 111 (Admin)",
     },
     {
          id: 104,
          name: "NHS Trainee Orientation Handbook v3",
          description: "Compile bilingual English/Filipino lab handouts for new recruits becoming trainees.",
          status: "Draft",
          priority: "None",
          progressPct: 15,
          assignedTeamId: 1,
          attachments: [
               { name: "trainee-syllabus-draft.docx", type: "application/msword", size: "890 KB" },
          ],
          deadlineStart: "2026-10-25",
          deadlineEnd: "2026-10-29",
          createdAt: "2026-10-24",
          createdBy: "Sector 111 (Admin)",
     },
     {
          id: 105,
          name: "Legacy Switch Inventory Audit 2025",
          description: "Historical audit of retired 10/100 Mbps switches across storage rooms.",
          status: "Archived",
          priority: "None",
          progressPct: 100,
          assignedTeamId: 2,
          attachments: [],
          deadlineStart: "2026-09-01",
          deadlineEnd: "2026-09-15",
          createdAt: "2026-09-01",
          createdBy: "Sector 111 (Admin)",
     },
];

export const INITIAL_CALENDAR_EVENTS = [
     {
          id: 501,
          title: "[Project] Proxmox VE Cluster & MySQL Portal Deployment",
          description: "Auto-synced deadline from Projects module.",
          tag: "Project Deadline",
          priority: "High",
          preset: "next_week",
          startDate: "2026-10-24",
          endDate: "2026-10-31",
          addedBy: "Admin's Account (Sector 111)",
          linkedProjectId: 101,
     },
     {
          id: 502,
          title: "Trainee Orientation Batch Briefing",
          description: "Live walkthrough of Group 00 Hardware & Group 05 I.T. Infrastructure tracks.",
          tag: "Orientation",
          priority: "Medium",
          preset: "today",
          startDate: "2026-10-24",
          endDate: "2026-10-24",
          addedBy: "Admin's Account (Sector 111)",
          linkedProjectId: null,
     },
     {
          id: 503,
          title: "Server Rack Preventive Dust & UPS Check",
          description: "Inspect UPS battery health and clean intake filters.",
          tag: "Maintenance",
          priority: "Low",
          preset: "tomorrow",
          startDate: "2026-10-25",
          endDate: "2026-10-25",
          addedBy: "Member's Account (Bro. Marco)",
          linkedProjectId: null,
     },
];

function clone(obj) {
     return JSON.parse(JSON.stringify(obj));
}

export function getInitialDbState() {
     try {
          const raw = localStorage.getItem(STORAGE_KEY);
          if (raw) {
               const parsed = JSON.parse(raw);
               if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.projects)) {
                    return parsed;
               }
          }
     } catch {
          // ignore
     }

     return {
          groups: clone(INITIAL_GROUPS),
          itTracks: clone(INITIAL_IT_TRACKS),
          hwTracks: clone(INITIAL_HW_TRACKS),
          users: clone(V3_USERS),
          teams: clone(INITIAL_TEAMS),
          projects: clone(INITIAL_PROJECTS),
          calendarEvents: clone(INITIAL_CALENDAR_EVENTS),
          completedLessonsByUser: {
               1: ["hw-anatomy-L1", "proxmox-L1", "proxmox-L2", "database-L1"],
               3: ["hw-anatomy-L1", "proxmox-L1", "proxmox-L2", "proxmox-L3", "database-L1"],
               8: ["hw-anatomy-L1", "hw-anatomy-L2", "proxmox-L1", "server-L1", "linux-L1"],
               9: ["hw-anatomy-L1", "proxmox-L1"],
               10: ["hw-anatomy-L1"],
          },
          userSettings: {
               1: {
                    themeMode: "dark",
                    accentTheme: "gold",
                    density: "comfortable",
                    motionEnabled: true,
                    glassBlur: true,
                    language: "en",
                    customLanguages: [{ code: "en", name: "English" }, { code: "tl", name: "Filipino" }],
                    notifyDeadlines: true,
                    notifyTeam: true,
                    notifyTrainee: true,
               },
          },
          simulatedRemoteSessions: {}, // { [username]: true } to test Single-Device Lock
          auditLogs: [
               {
                    id: 1,
                    time: "2026-10-24 11:00",
                    actor: "SECTOR-111",
                    action: "MYSQL_PDO_READY",
                    detail: "Initialized v3.0 PHP + MySQL schema, 6 groups, Projects, Calendar & Single-Device Session Lock",
               },
          ],
     };
}

export function saveDbState(state) {
     try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
     } catch {
          // ignore
     }
}

export function resetDbState() {
     try {
          localStorage.removeItem(STORAGE_KEY);
          sessionStorage.removeItem(SESSION_KEY);
          localStorage.removeItem(DEVICE_LOCKS_KEY);
     } catch {
          // ignore
     }
     return getInitialDbState();
}

// Tab-Scoped Session Management (Auto-Logout on Tab / Browser Close)
export function getTabSession() {
     try {
          const raw = sessionStorage.getItem(SESSION_KEY);
          return raw ? JSON.parse(raw) : null;
     } catch {
          return null;
     }
}

export function getActiveDeviceLocks() {
     try {
          const raw = localStorage.getItem(DEVICE_LOCKS_KEY);
          return raw ? JSON.parse(raw) : {};
     } catch {
          return {};
     }
}

export function setTabSession(user, tabId) {
     try {
          if (!user) {
               const current = getTabSession();
               if (current) {
                    const locks = getActiveDeviceLocks();
                    delete locks[current.username];
                    localStorage.setItem(DEVICE_LOCKS_KEY, JSON.stringify(locks));
               }
               sessionStorage.removeItem(SESSION_KEY);
               return;
          }
          const payload = {
               userId: user.id,
               username: user.username,
               role: user.role,
               tabId,
               loginAt: new Date().toISOString(),
          };
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
          const locks = getActiveDeviceLocks();
          locks[user.username] = {
               tabId,
               deviceLabel: "Browser Session (" + navigator.platform + ")",
               loginAt: payload.loginAt,
          };
          localStorage.setItem(DEVICE_LOCKS_KEY, JSON.stringify(locks));
     } catch {
          // ignore
     }
}

export function releaseTabSessionLock(username) {
     try {
          const locks = getActiveDeviceLocks();
          if (username && locks[username]) {
               delete locks[username];
               localStorage.setItem(DEVICE_LOCKS_KEY, JSON.stringify(locks));
          }
          sessionStorage.removeItem(SESSION_KEY);
          if (navigator.sendBeacon) {
               navigator.sendBeacon("/api/auth.php?action=beacon_logout", JSON.stringify({ username }));
          }
     } catch {
          // ignore
     }
}

export { RECRUIT_CHECKLIST };
