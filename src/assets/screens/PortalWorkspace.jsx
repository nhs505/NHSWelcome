/**
 * PortalWorkspace.jsx — Unified Ant Design + Motion.dev + AG-Grid Enterprise Portal
 * Supports:
 *   - Admin Account (Full Sidebar with Dashboard, Accounts, Calendar, List of Members & Trainees,
 *     Projects dropdown [Add Projects, List of Projects, Manage Teams, Project Members, Plenary Class, Trainee],
 *     and Settings dropdown [General, Account, Appearance, Notification, Language, Help, About])
 *   - Member Account / Project Member (Sidebar with Dashboard, Calendar, Projects dropdown, Settings dropdown)
 *   - Trainee Account (Sidebar with Dashboard, Learning Roadmaps, Language, About, Help)
 */

import { useState } from "react";
import EnterpriseGrid from "../components/EnterpriseGrid.jsx";
import { THEME_PALETTES, AVATARS } from "../components/dbService.js";
import LessonViewer from "./LessonViewer.jsx";

const PROJECT_STATUSES = [
     "Finish project",
     "In-Progress",
     "On-Hold",
     "Archived",
     "Draft",
     "Deleted",
];

const PRIORITY_COLORS = {
     High: "bg-red-500/15 text-red-400 border-red-400/40",
     Medium: "bg-amber-500/15 text-amber-400 border-amber-400/40",
     Low: "bg-sky-500/15 text-sky-400 border-sky-400/40",
     None: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

const FAQ_ITEMS = [
     {
          q: "What is the difference between a Recruit, a Trainee, a Plenary Class Member, and a Project Member?",
          a: "A Recruit is a visitor exploring the NHS Splash Orientation. Once a recruit clicks 'I want to be a trainee' and registers, they become a Trainee preparing for membership. Members are divided into Plenary Class (students training in class with potential to join projects) and Project Members (active builders assigned to technical project teams).",
     },
     {
          q: "How does the Single-Device Session Lock protect accounts?",
          a: "Every authenticated session (Admin, Member, Trainee) registers a cryptographic session lock tied to your active tab. If someone tries to log into your account from another device while you are signed in, the login is blocked immediately. Closing your browser tab automatically logs you out via navigator.sendBeacon.",
     },
     {
          q: "Why can't a Member self-register on the public page?",
          a: "By STF-NHS security policy, Project Member and Plenary Class accounts must be consulted with and provisioned by an Administrator inside Admin Portal → Accounts → Add Account for Member.",
     },
     {
          q: "What happens when I set a Deadline while adding a Project?",
          a: "Whenever a deadline is specified on a project in 'Add Projects', the system automatically creates and syncs a corresponding deadline entry on the full Calendar view.",
     },
     {
          q: "Are my Settings (Dark/Light mode, Theme, Profile Picture, Language) shared with other users?",
          a: "No. Settings are saved exclusively to your individual User ID in the user_settings table, so every Admin, Member, and Trainee keeps their own personalized workspace appearance and profile photo.",
     },
];

export default function PortalWorkspace({
     currentUser,
     dbState,
     userSetting,
     onUpdateUserSetting,
     onUpdateAccountProfile,
     onAddAccount,
     onToggleUserActive,
     onToggleUserAvailability,
     onPromoteUser,
     onAddProject,
     onUpdateProjectStatus,
     onCreateTeam,
     onAssignTeamToProject,
     onAddCalendarEvent,
     onToggleLessonComplete,
     onLogout,
     onSwitchAccount,
}) {
     const role = currentUser.role; // "admin" | "member" | "trainee"
     const [activePage, setActivePage] = useState("dashboard");
     const [projectsOpen, setProjectsOpen] = useState(true);
     const [settingsOpen, setSettingsOpen] = useState(false);
     const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
     const [prefMenuOpen, setPrefMenuOpen] = useState(false);

     // Accounts Tab State (Admin)
     const [accFilterTab, setAccFilterTab] = useState("all");
     const [newAccName, setNewAccName] = useState("");
     const [newAccUsername, setNewAccUsername] = useState("");
     const [newAccEmail, setNewAccEmail] = useState("");
     const [newAccPassword, setNewAccPassword] = useState("member123");
     const [newAccRole, setNewAccRole] = useState("member");
     const [newAccMemberType, setNewAccMemberType] = useState("project_member");
     const [newAccGroup, setNewAccGroup] = useState("05");
     const [accSuccessMsg, setAccSuccessMsg] = useState("");

     // Calendar State (Admin & Member)
     const [calTaskName, setCalTaskName] = useState("");
     const [calTaskDesc, setCalTaskDesc] = useState("");
     const [calTaskTag, setCalTaskTag] = useState("Operations");
     const [calTaskPriority, setCalTaskPriority] = useState("None");
     const [calPreset, setCalPreset] = useState("today");
     const [calStartDate, setCalStartDate] = useState("2026-10-24");
     const [calEndDate, setCalEndDate] = useState("2026-10-24");

     // Add Project State (Admin & Member)
     const [projName, setProjName] = useState("");
     const [projDesc, setProjDesc] = useState("");
     const [projPriority, setProjPriority] = useState("None"); // "None" as default!
     const [projStatus, setProjStatus] = useState("Draft"); // "Draft" as default on creation day!
     const [projTeamId, setProjTeamId] = useState(1);
     const [projDeadlineStart, setProjDeadlineStart] = useState("");
     const [projDeadlineEnd, setProjDeadlineEnd] = useState("");
     const [projAttachments, setProjAttachments] = useState([]);
     const [projCreatedBanner, setProjCreatedBanner] = useState("");

     // List of Projects View State
     const [projViewMode, setProjViewMode] = useState("kanban"); // "table" | "kanban"
     const [projStatusFilter, setProjStatusFilter] = useState("ALL");
     const [projPriorityFilter, setProjPriorityFilter] = useState("ALL");

     // Manage Teams State
     const [teamName, setTeamName] = useState("");
     const [teamGroup, setTeamGroup] = useState("05");
     const [teamLeadId, setTeamLeadId] = useState(3);
     const [teamDesc, setTeamDesc] = useState("");
     const [selectedTeamMembers, setSelectedTeamMembers] = useState([3, 4]);
     const [assignProjId, setAssignProjId] = useState(101);
     const [assignTeamId, setAssignTeamId] = useState(1);

     // Settings -> Account Edit State
     const [editFullName, setEditFullName] = useState(currentUser.fullName);
     const [editEmail, setEditEmail] = useState(currentUser.email);
     const [editBio, setEditBio] = useState(currentUser.bio || "");
     const [profileSavedToast, setProfileSavedToast] = useState(false);

     // Settings -> Add Language State
     const [newLangCode, setNewLangCode] = useState("");
     const [newLangName, setNewLangName] = useState("");

     // Trainee Learning Roadmap State
     const [selectedRoadmapTrack, setSelectedRoadmapTrack] = useState(null);
     const [activeLessonIndex, setActiveLessonIndex] = useState(0);

     // Appearance computations
     const isLight = userSetting?.themeMode === "light";
     const palette = THEME_PALETTES[userSetting?.accentTheme || "gold"] || THEME_PALETTES.gold;
     const accent = palette.primary;

     const adminsList = dbState.users.filter((u) => u.role === "admin");
     const projectMembersList = dbState.users.filter(
          (u) => u.role === "member" && u.memberType === "project_member"
     );
     const plenaryMembersList = dbState.users.filter(
          (u) => u.role === "member" && u.memberType === "plenary"
     );
     const traineesList = dbState.users.filter((u) => u.role === "trainee");

     const applyDeadlinePreset = (preset) => {
          setCalPreset(preset);
          const base = new Date("2026-10-24T09:00:00");
          const end = new Date(base);
          if (preset === "today") {
               // 2026-10-24
          } else if (preset === "tomorrow") {
               base.setDate(base.getDate() + 1);
               end.setDate(end.getDate() + 1);
          } else if (preset === "next_week") {
               base.setDate(base.getDate() + 7);
               end.setDate(end.getDate() + 9);
          } else if (preset === "next_month") {
               base.setMonth(base.getMonth() + 1);
               end.setMonth(end.getMonth() + 1);
          }
          setCalStartDate(base.toISOString().slice(0, 10));
          setCalEndDate(end.toISOString().slice(0, 10));
     };

     const handleFileAttachment = (e) => {
          const files = Array.from(e.target.files || []);
          const mapped = files.map((f) => ({
               name: f.name,
               type: f.type || "application/octet-stream",
               size: `${Math.max(1, Math.round(f.size / 1024))} KB`,
          }));
          setProjAttachments((prev) => [...prev, ...mapped]);
     };

     const handleAvatarUpload = (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => {
               if (typeof reader.result === "string") {
                    onUpdateAccountProfile({ avatar: reader.result });
               }
          };
          reader.readAsDataURL(file);
     };

     const myCompletedLessons =
          dbState.completedLessonsByUser?.[currentUser.id] || ["hw-anatomy-L1", "proxmox-L1"];

     return (
          <div
               className={`min-h-screen flex flex-col transition-colors ${
                    isLight ? "bg-slate-100 text-slate-900" : "bg-[#08090c] text-slate-100"
               }`}>
               {/* TOP NAVBAR: App Logo + Preferences (Logout, Switch Account) */}
               <header
                    className={`sticky top-0 z-40 h-16 px-6 border-b flex items-center justify-between ${
                         isLight
                              ? "bg-white/95 border-slate-200"
                              : "bg-[#0d1218]/95 border-[#1f2937] backdrop-blur-md"
                    }`}>
                    <div className="flex items-center gap-3">
                         <button
                              type="button"
                              onClick={() => setSidebarCollapsed((c) => !c)}
                              className="p-2 rounded-lg bg-[#131920] border border-[#263244] text-slate-300 cursor-pointer hover:text-[#f0a500]">
                              ☰
                         </button>
                         <div className="flex items-center gap-2.5">
                              <span
                                   className="w-3 h-3 rounded-full shadow-md"
                                   style={{ backgroundColor: accent }}
                              />
                              <span className="font-mono text-sm font-extrabold tracking-wider uppercase">
                                   STF-NHS
                              </span>
                              <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-[#131920] border border-[#263244] text-[#94a3b8] uppercase">
                                   {role === "admin"
                                        ? "Admin Control Portal"
                                        : role === "member"
                                        ? "Project Member Portal"
                                        : "Trainee Orientation Portal"}
                              </span>
                         </div>
                    </div>

                    {/* Right Preferences Dropdown (Logout & Switch Account) */}
                    <div className="relative">
                         <button
                              type="button"
                              onClick={() => setPrefMenuOpen((o) => !o)}
                              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-[#131920] border border-[#263244] text-slate-200 text-xs font-mono cursor-pointer hover:border-[#f0a500]">
                              <img
                                   src={currentUser.avatar}
                                   alt={currentUser.fullName}
                                   className="w-6 h-6 rounded-full object-cover"
                              />
                              <span>Preferences ({currentUser.username})</span>
                              <span>▾</span>
                         </button>

                         {prefMenuOpen && (
                              <div className="absolute right-0 mt-2 w-56 bg-[#131920] border border-[#2a3a4d] rounded-2xl p-2 shadow-2xl z-50 font-mono text-xs">
                                   <div className="px-3 py-2 border-b border-[#1f2937] text-[#94a3b8] text-[10.5px]">
                                        Signed in as <strong className="text-slate-100">{currentUser.fullName}</strong>
                                   </div>
                                   <button
                                        type="button"
                                        onClick={() => {
                                             setPrefMenuOpen(false);
                                             onSwitchAccount();
                                        }}
                                        className="w-full text-left px-3 py-2.5 rounded-xl text-sky-400 hover:bg-[#18202c] bg-transparent border-none cursor-pointer flex items-center gap-2">
                                        🔄 Switch Account
                                   </button>
                                   <button
                                        type="button"
                                        onClick={() => {
                                             setPrefMenuOpen(false);
                                             onLogout();
                                        }}
                                        className="w-full text-left px-3 py-2.5 rounded-xl text-red-400 hover:bg-[#18202c] bg-transparent border-none cursor-pointer flex items-center gap-2">
                                        🚪 Logout Session
                                   </button>
                              </div>
                         )}
                    </div>
               </header>

               {/* MAIN BODY: Ant Design Sider + Content Area */}
               <div className="flex-1 flex min-h-[calc(100vh-112px)]">
                    {/* SIDEBAR */}
                    <aside
                         className={`${
                              sidebarCollapsed ? "w-20" : "w-72"
                         } shrink-0 border-r transition-all flex flex-col justify-between ${
                              isLight
                                   ? "bg-white border-slate-200"
                                   : "bg-[#0d1218] border-[#1f2937]"
                         }`}>
                         <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                              {/* Account User Profile Picture & Badge */}
                              <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-3.5 flex items-center gap-3">
                                   <img
                                        src={currentUser.avatar}
                                        alt={currentUser.fullName}
                                        className="w-12 h-12 rounded-full object-cover border-2 shrink-0"
                                        style={{ borderColor: accent }}
                                   />
                                   {!sidebarCollapsed && (
                                        <div className="min-w-0">
                                             <div className="font-mono text-[10px] uppercase tracking-wider text-[#f0a500]">
                                                  {currentUser.sectorCode}
                                             </div>
                                             <div className="text-sm font-bold text-slate-100 truncate">
                                                  {currentUser.fullName}
                                             </div>
                                             <div className="text-[11px] text-green-400 font-mono">
                                                  ● Active Session
                                             </div>
                                        </div>
                                   )}
                              </div>

                              {/* Role-Specific Sidebar Menu */}
                              <nav className="flex flex-col gap-1 text-xs font-medium">
                                   {/* 1. Dashboard (All 3 roles) */}
                                   <button
                                        type="button"
                                        onClick={() => setActivePage("dashboard")}
                                        className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 transition-colors ${
                                             activePage === "dashboard"
                                                  ? "bg-[#182230] text-[#f0a500] font-bold"
                                                  : "bg-transparent text-[#94a3b8] hover:bg-[#131920] hover:text-slate-100"
                                        }`}>
                                        <span>📊</span>
                                        {!sidebarCollapsed && <span>Dashboard</span>}
                                   </button>

                                   {/* ADMIN-ONLY ITEMS: Accounts & List of Members & Trainees */}
                                   {role === "admin" && (
                                        <>
                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("accounts")}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 transition-colors ${
                                                       activePage === "accounts"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920] hover:text-slate-100"
                                                  }`}>
                                                  <span>🪪</span>
                                                  {!sidebarCollapsed && <span>Accounts</span>}
                                             </button>

                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("calendar")}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 transition-colors ${
                                                       activePage === "calendar"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920] hover:text-slate-100"
                                                  }`}>
                                                  <span>📅</span>
                                                  {!sidebarCollapsed && <span>Calendar</span>}
                                             </button>

                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("members_trainees")}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 transition-colors ${
                                                       activePage === "members_trainees"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920] hover:text-slate-100"
                                                  }`}>
                                                  <span>👥</span>
                                                  {!sidebarCollapsed && (
                                                       <span>List of Members &amp; Trainees</span>
                                                  )}
                                             </button>
                                        </>
                                   )}

                                   {/* MEMBER-ONLY CALENDAR */}
                                   {role === "member" && (
                                        <button
                                             type="button"
                                             onClick={() => setActivePage("calendar")}
                                             className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 transition-colors ${
                                                  activePage === "calendar"
                                                       ? "bg-[#182230] text-[#f0a500] font-bold"
                                                       : "bg-transparent text-[#94a3b8] hover:bg-[#131920] hover:text-slate-100"
                                             }`}>
                                             <span>📅</span>
                                             {!sidebarCollapsed && <span>Calendar</span>}
                                        </button>
                                   )}

                                   {/* PROJECTS DROPDOWN (Admin & Project Member) */}
                                   {(role === "admin" || role === "member") && (
                                        <div>
                                             <button
                                                  type="button"
                                                  onClick={() => setProjectsOpen((o) => !o)}
                                                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-transparent border-none cursor-pointer flex items-center justify-between text-[#94a3b8] hover:bg-[#131920] hover:text-slate-100">
                                                  <span className="flex items-center gap-3">
                                                       <span>🚀</span>
                                                       {!sidebarCollapsed && <span>Projects</span>}
                                                  </span>
                                                  {!sidebarCollapsed && (
                                                       <span className="text-[10px]">
                                                            {projectsOpen ? "▾" : "▸"}
                                                       </span>
                                                  )}
                                             </button>

                                             {projectsOpen && !sidebarCollapsed && (
                                                  <div className="ml-5 pl-3 border-l border-[#1f2937] flex flex-col gap-1 mt-1">
                                                       {[
                                                            { id: "proj_add", label: "Add Projects" },
                                                            { id: "proj_list", label: "List of Projects" },
                                                            ...(role === "admin"
                                                                 ? [
                                                                        {
                                                                             id: "proj_teams",
                                                                             label: "Manage Teams",
                                                                        },
                                                                        {
                                                                             id: "proj_members",
                                                                             label: "Project Members",
                                                                        },
                                                                        {
                                                                             id: "proj_plenary",
                                                                             label: "Plenary Class",
                                                                        },
                                                                        {
                                                                             id: "proj_trainee",
                                                                             label: "Trainee",
                                                                        },
                                                                   ]
                                                                 : []),
                                                       ].map((sub) => (
                                                            <button
                                                                 key={sub.id}
                                                                 type="button"
                                                                 onClick={() => setActivePage(sub.id)}
                                                                 className={`w-full text-left px-3 py-2 rounded-lg border-none cursor-pointer text-xs transition-colors ${
                                                                      activePage === sub.id
                                                                           ? "bg-[#f0a500]/15 text-[#f0a500] font-bold"
                                                                           : "bg-transparent text-[#64748b] hover:text-slate-200"
                                                                 }`}>
                                                                 {sub.label}
                                                            </button>
                                                       ))}
                                                  </div>
                                             )}
                                        </div>
                                   )}

                                   {/* SETTINGS DROPDOWN (Admin & Project Member) */}
                                   {(role === "admin" || role === "member") && (
                                        <div>
                                             <button
                                                  type="button"
                                                  onClick={() => setSettingsOpen((o) => !o)}
                                                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-transparent border-none cursor-pointer flex items-center justify-between text-[#94a3b8] hover:bg-[#131920] hover:text-slate-100">
                                                  <span className="flex items-center gap-3">
                                                       <span>⚙️</span>
                                                       {!sidebarCollapsed && <span>Settings</span>}
                                                  </span>
                                                  {!sidebarCollapsed && (
                                                       <span className="text-[10px]">
                                                            {settingsOpen ? "▾" : "▸"}
                                                       </span>
                                                  )}
                                             </button>

                                             {settingsOpen && !sidebarCollapsed && (
                                                  <div className="ml-5 pl-3 border-l border-[#1f2937] flex flex-col gap-1 mt-1">
                                                       {[
                                                            { id: "set_general", label: "General" },
                                                            { id: "set_account", label: "Account" },
                                                            { id: "set_appearance", label: "Appearance" },
                                                            { id: "set_notification", label: "Notification" },
                                                            { id: "set_language", label: "Language" },
                                                            { id: "set_help", label: "Help" },
                                                            { id: "set_about", label: "About" },
                                                       ].map((sub) => (
                                                            <button
                                                                 key={sub.id}
                                                                 type="button"
                                                                 onClick={() => setActivePage(sub.id)}
                                                                 className={`w-full text-left px-3 py-2 rounded-lg border-none cursor-pointer text-xs transition-colors ${
                                                                      activePage === sub.id
                                                                           ? "bg-[#f0a500]/15 text-[#f0a500] font-bold"
                                                                           : "bg-transparent text-[#64748b] hover:text-slate-200"
                                                                 }`}>
                                                                 {sub.label}
                                                            </button>
                                                       ))}
                                                  </div>
                                             )}
                                        </div>
                                   )}

                                   {/* TRAINEE SIDEBAR ITEMS */}
                                   {role === "trainee" && (
                                        <>
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setSelectedRoadmapTrack(null);
                                                       setActivePage("trainee_roadmaps");
                                                  }}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 ${
                                                       activePage === "trainee_roadmaps"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920]"
                                                  }`}>
                                                  <span>🗺️</span>
                                                  {!sidebarCollapsed && <span>Learning Roadmaps</span>}
                                             </button>
                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("set_language")}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 ${
                                                       activePage === "set_language"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920]"
                                                  }`}>
                                                  <span>🌐</span>
                                                  {!sidebarCollapsed && <span>Language</span>}
                                             </button>
                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("set_help")}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 ${
                                                       activePage === "set_help"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920]"
                                                  }`}>
                                                  <span>🏛️</span>
                                                  {!sidebarCollapsed && <span>About</span>}
                                             </button>
                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("set_about")}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 ${
                                                       activePage === "set_about"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920]"
                                                  }`}>
                                                  <span>❓</span>
                                                  {!sidebarCollapsed && <span>Help</span>}
                                             </button>
                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("set_account")}
                                                  className={`w-full text-left px-3.5 py-2.5 rounded-xl border-none cursor-pointer flex items-center gap-3 ${
                                                       activePage === "set_account"
                                                            ? "bg-[#182230] text-[#f0a500] font-bold"
                                                            : "bg-transparent text-[#94a3b8] hover:bg-[#131920]"
                                                  }`}>
                                                  <span>🖼️</span>
                                                  {!sidebarCollapsed && <span>Profile Picture</span>}
                                             </button>
                                        </>
                                   )}
                              </nav>
                         </div>

                         {/* Sidebar Bottom Quick Status */}
                         {!sidebarCollapsed && (
                              <div className="p-4 border-t border-[#1f2937] font-mono text-[10.5px] text-[#64748b]">
                                   <div>Engine: PHP 8.2 + MySQL 8.0</div>
                                   <div className="text-green-400 mt-0.5">
                                        🔒 Single-Device Lock Active
                                   </div>
                              </div>
                         )}
                    </aside>

                    {/* MAIN CONTENT VIEWPORT */}
                    <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                         {/* =================================================================
                             1. DASHBOARD VIEW (Role-Specific: Admin vs. Member vs. Trainee)
                         ================================================================= */}
                         {activePage === "dashboard" && role === "admin" && (
                              <div className="flex flex-col gap-6">
                                   <div>
                                        <div className="font-mono text-xs uppercase tracking-widest text-[#f0a500]">
                                             Admin Executive Command Center
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
                                             Welcome, {currentUser.fullName}
                                        </h1>
                                   </div>

                                   {/* Summary Metric Cards */}
                                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-5">
                                             <div className="font-mono text-[10.5px] uppercase text-[#64748b]">
                                                  Admins
                                             </div>
                                             <div className="text-3xl font-extrabold text-red-400 mt-1">
                                                  {adminsList.length}
                                             </div>
                                             <div className="text-xs text-[#64748b] mt-2">
                                                  {adminsList.map((a) => a.fullName).join(", ")}
                                             </div>
                                        </div>
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-5">
                                             <div className="font-mono text-[10.5px] uppercase text-[#64748b]">
                                                  Project Members
                                             </div>
                                             <div className="text-3xl font-extrabold text-sky-400 mt-1">
                                                  {projectMembersList.length}
                                             </div>
                                             <div className="text-xs text-[#64748b] mt-2">
                                                  Active on assigned teams
                                             </div>
                                        </div>
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-5">
                                             <div className="font-mono text-[10.5px] uppercase text-[#64748b]">
                                                  Plenary Class (Non-Project)
                                             </div>
                                             <div className="text-3xl font-extrabold text-amber-400 mt-1">
                                                  {plenaryMembersList.length}
                                             </div>
                                             <div className="text-xs text-[#64748b] mt-2">
                                                  Candidates for Project Teams
                                             </div>
                                        </div>
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-5">
                                             <div className="font-mono text-[10.5px] uppercase text-[#64748b]">
                                                  Active Trainees
                                             </div>
                                             <div className="text-3xl font-extrabold text-green-400 mt-1">
                                                  {traineesList.length}
                                             </div>
                                             <div className="text-xs text-[#64748b] mt-2">
                                                  Recruits who joined NHS
                                             </div>
                                        </div>
                                   </div>

                                   {/* Progress of Every Trainee & Assigned Projects */}
                                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Progress of Every Trainee */}
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                             <div className="flex items-center justify-between mb-4">
                                                  <h3 className="text-base font-bold">
                                                       🌱 Progress of Every Trainee
                                                  </h3>
                                                  <button
                                                       type="button"
                                                       onClick={() => setActivePage("proj_trainee")}
                                                       className="font-mono text-xs text-[#f0a500] bg-transparent border-none cursor-pointer">
                                                       View Trainee List →
                                                  </button>
                                             </div>
                                             <div className="flex flex-col gap-3.5">
                                                  {traineesList.map((tr) => (
                                                       <div
                                                            key={tr.id}
                                                            className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-3.5">
                                                            <div className="flex items-center justify-between text-xs mb-1.5">
                                                                 <span className="font-bold text-slate-100">
                                                                      {tr.fullName}{" "}
                                                                      <span className="font-mono text-[10px] text-[#64748b]">
                                                                           ({tr.sectorCode} · Group {tr.primaryGroup})
                                                                      </span>
                                                                 </span>
                                                                 <span className="font-mono text-green-400 font-bold">
                                                                      {tr.progressPct}%
                                                                 </span>
                                                            </div>
                                                            <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                                                                 <div
                                                                      className="h-full bg-gradient-to-r from-green-400 to-[#f0a500]"
                                                                      style={{ width: `${tr.progressPct}%` }}
                                                                 />
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>

                                        {/* Progress of Assigned Projects (for Project Members) */}
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                             <div className="flex items-center justify-between mb-4">
                                                  <h3 className="text-base font-bold">
                                                       🚀 Assigned Project Progress (Project Members)
                                                  </h3>
                                                  <button
                                                       type="button"
                                                       onClick={() => setActivePage("proj_list")}
                                                       className="font-mono text-xs text-sky-400 bg-transparent border-none cursor-pointer">
                                                       Open Kanban / Table →
                                                  </button>
                                             </div>
                                             <div className="flex flex-col gap-3.5">
                                                  {dbState.projects
                                                       .filter((p) => p.status !== "Deleted")
                                                       .map((p) => {
                                                            const team = dbState.teams.find(
                                                                 (t) => t.id === Number(p.assignedTeamId)
                                                            );
                                                            return (
                                                                 <div
                                                                      key={p.id}
                                                                      className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-3.5">
                                                                      <div className="flex items-center justify-between gap-2 mb-1">
                                                                           <span className="text-xs font-bold text-slate-100">
                                                                                {p.name}
                                                                           </span>
                                                                           <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#18202c] text-[#f0a500]">
                                                                                {p.status} · {p.progressPct}%
                                                                           </span>
                                                                      </div>
                                                                      <div className="text-[11px] text-[#64748b] mb-2">
                                                                           Team: {team ? team.name : "Unassigned"}
                                                                      </div>
                                                                      <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                                                                           <div
                                                                                className="h-full bg-sky-400"
                                                                                style={{
                                                                                     width: `${p.progressPct}%`,
                                                                                }}
                                                                           />
                                                                      </div>
                                                                 </div>
                                                            );
                                                       })}
                                             </div>
                                        </div>
                                   </div>

                                   {/* Summary Breakdown Lists: Admins, Members (Plenary vs. Project), Trainees */}
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-5">
                                             <h4 className="font-mono text-xs uppercase text-red-400 mb-3">
                                                  🛡️ Admins Summary
                                             </h4>
                                             {adminsList.map((u) => (
                                                  <div
                                                       key={u.id}
                                                       className="py-2 border-b border-[#1f2937] last:border-none text-xs flex justify-between">
                                                       <span>{u.fullName}</span>
                                                       <span className="font-mono text-[#64748b]">
                                                            {u.sectorCode}
                                                       </span>
                                                  </div>
                                             ))}
                                        </div>
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-5">
                                             <h4 className="font-mono text-xs uppercase text-sky-400 mb-3">
                                                  🏅 Members (Project vs. Plenary)
                                             </h4>
                                             {projectMembersList.map((u) => (
                                                  <div
                                                       key={u.id}
                                                       className="py-1.5 border-b border-[#1f2937] text-xs flex justify-between">
                                                       <span>{u.fullName}</span>
                                                       <span className="font-mono text-[10px] text-sky-400">
                                                            Project Member
                                                       </span>
                                                  </div>
                                             ))}
                                             {plenaryMembersList.map((u) => (
                                                  <div
                                                       key={u.id}
                                                       className="py-1.5 border-b border-[#1f2937] last:border-none text-xs flex justify-between">
                                                       <span>{u.fullName}</span>
                                                       <span className="font-mono text-[10px] text-amber-400">
                                                            Plenary Class
                                                       </span>
                                                  </div>
                                             ))}
                                        </div>
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-5">
                                             <h4 className="font-mono text-xs uppercase text-green-400 mb-3">
                                                  🌱 Trainees Summary
                                             </h4>
                                             {traineesList.map((u) => (
                                                  <div
                                                       key={u.id}
                                                       className="py-2 border-b border-[#1f2937] last:border-none text-xs flex justify-between">
                                                       <span>{u.fullName}</span>
                                                       <span className="font-mono text-green-400">
                                                            {u.progressPct}% Done
                                                       </span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         )}

                         {/* MEMBER DASHBOARD (Project Member) */}
                         {activePage === "dashboard" && role === "member" && (
                              <div className="flex flex-col gap-6">
                                   <div>
                                        <div className="font-mono text-xs uppercase tracking-widest text-sky-400">
                                             Project Member Operations Dashboard
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
                                             Welcome back, {currentUser.fullName}
                                        </h1>
                                   </div>

                                   {/* Assigned Team of the Account */}
                                   <div className="bg-[#131920] border border-sky-400/30 rounded-2xl p-6">
                                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-sky-400 mb-2">
                                             Assigned Team of Your Account
                                        </div>
                                        {dbState.teams
                                             .filter(
                                                  (t) =>
                                                       t.memberIds.includes(currentUser.id) ||
                                                       t.leadUserId === currentUser.id
                                             )
                                             .map((team) => (
                                                  <div key={team.id}>
                                                       <div className="text-xl font-extrabold text-slate-100">
                                                            {team.name} (Group {team.groupCode})
                                                       </div>
                                                       <p className="text-xs text-[#64748b] mt-1 mb-4">
                                                            {team.description}
                                                       </p>
                                                       <div className="flex flex-wrap gap-2">
                                                            {team.memberIds.map((mid) => {
                                                                 const m = dbState.users.find(
                                                                      (u) => u.id === mid
                                                                 );
                                                                 if (!m) return null;
                                                                 return (
                                                                      <span
                                                                           key={mid}
                                                                           className="px-3 py-1 rounded-full bg-[#0b0f14] border border-[#263244] text-xs font-mono">
                                                                           {m.fullName} ({m.availability})
                                                                      </span>
                                                                 );
                                                            })}
                                                       </div>
                                                  </div>
                                             ))}
                                   </div>

                                   {/* Progress of All Created Projects */}
                                   <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                             <h3 className="text-base font-bold">
                                                  🚀 Progress of All Created Projects
                                             </h3>
                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("proj_add")}
                                                  className="font-mono text-xs px-3 py-1.5 rounded-lg bg-[#f0a500] text-[#1a0e00] font-bold border-none cursor-pointer">
                                                  + Add Project
                                             </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             {dbState.projects
                                                  .filter((p) => p.status !== "Deleted")
                                                  .map((p) => (
                                                       <div
                                                            key={p.id}
                                                            className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4">
                                                            <div className="flex items-center justify-between mb-1">
                                                                 <span className="text-sm font-bold">
                                                                      {p.name}
                                                                 </span>
                                                                 <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#18202c] text-[#f0a500]">
                                                                      {p.status}
                                                                 </span>
                                                            </div>
                                                            <p className="text-xs text-[#64748b] mb-3">
                                                                 {p.description}
                                                            </p>
                                                            <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                                                                 <span>Priority: {p.priority}</span>
                                                                 <span className="text-sky-400">
                                                                      {p.progressPct}%
                                                                 </span>
                                                            </div>
                                                            <div className="h-2 bg-[#1f2937] rounded-full overflow-hidden">
                                                                 <div
                                                                      className="h-full bg-sky-400"
                                                                      style={{
                                                                           width: `${p.progressPct}%`,
                                                                      }}
                                                                 />
                                                            </div>
                                                       </div>
                                                  ))}
                                        </div>
                                   </div>
                              </div>
                         )}

                         {/* TRAINEE DASHBOARD */}
                         {activePage === "dashboard" && role === "trainee" && (
                              <div className="flex flex-col gap-6">
                                   <div className="bg-gradient-to-br from-[#131920] to-[#0d141c] border border-green-400/30 rounded-2xl p-6">
                                        <div className="font-mono text-xs uppercase tracking-widest text-green-400">
                                             🌱 NHS Trainee Preparation Dashboard
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-extrabold mt-1 mb-2">
                                             Welcome, {currentUser.fullName} ({currentUser.sectorCode})
                                        </h1>
                                        <p className="text-xs md:text-sm text-[#94a3b8] max-w-2xl mb-5">
                                             You are a Trainee preparing to become a full NHS Member. Complete your lessons in the Learning Roadmaps below to qualify for the Plenary Class and Project Teams!
                                        </p>
                                        <div className="flex flex-wrap items-center gap-4">
                                             <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl px-4 py-3">
                                                  <div className="font-mono text-[10px] text-[#64748b] uppercase">
                                                       Finished Lessons
                                                  </div>
                                                  <div className="text-2xl font-extrabold text-green-400">
                                                       {myCompletedLessons.length} Completed
                                                  </div>
                                             </div>
                                             <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl px-4 py-3">
                                                  <div className="font-mono text-[10px] text-[#64748b] uppercase">
                                                       Orientation Progress
                                                  </div>
                                                  <div className="text-2xl font-extrabold text-[#f0a500]">
                                                       {currentUser.progressPct}%
                                                  </div>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={() => setActivePage("trainee_roadmaps")}
                                                  className="font-mono text-xs font-extrabold px-5 py-3 rounded-xl bg-[#f0a500] text-[#1a0e00] border-none cursor-pointer">
                                                  🗺️ Open Learning Roadmaps →
                                             </button>
                                        </div>
                                   </div>

                                   {/* Progress of All Finished Lessons */}
                                   <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                        <h3 className="text-base font-bold mb-4">
                                             ✓ Progress of All Finished Lessons
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                             {myCompletedLessons.map((lKey) => (
                                                  <div
                                                       key={lKey}
                                                       className="p-3.5 rounded-xl bg-[#0b0f14] border border-green-400/30 flex items-center justify-between">
                                                       <span className="font-mono text-xs text-slate-200">
                                                            Module ID: <strong className="text-green-400">{lKey}</strong>
                                                       </span>
                                                       <span className="font-mono text-[10.5px] px-2.5 py-0.5 rounded-full bg-green-400/15 text-green-400">
                                                            ✓ Finished
                                                       </span>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         )}

                         {/* =================================================================
                             2. ACCOUNTS PAGE (Admin Only: Add Account for Member + Full Table)
                         ================================================================= */}
                         {activePage === "accounts" && role === "admin" && (
                              <div className="flex flex-col gap-6">
                                   {/* Add Account for Member Form */}
                                   <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                        <div className="font-mono text-[10.5px] uppercase tracking-widest text-[#f0a500] mb-1">
                                             Admin-Consulted Account Provisioning
                                        </div>
                                        <h2 className="text-xl font-bold mb-4">
                                             ➕ Add Account for Member / Admin / Trainee
                                        </h2>
                                        <form
                                             onSubmit={(e) => {
                                                  e.preventDefault();
                                                  if (!newAccName.trim() || !newAccUsername.trim()) return;
                                                  onAddAccount({
                                                       fullName: newAccName.trim(),
                                                       username: newAccUsername.trim(),
                                                       email:
                                                            newAccEmail.trim() ||
                                                            `${newAccUsername.trim()}@nhs.sfm.local`,
                                                       password: newAccPassword || "member123",
                                                       role: newAccRole,
                                                       memberType:
                                                            newAccRole === "member"
                                                                 ? newAccMemberType
                                                                 : "none",
                                                       primaryGroup: newAccGroup,
                                                  });
                                                  setNewAccName("");
                                                  setNewAccUsername("");
                                                  setNewAccEmail("");
                                                  setAccSuccessMsg(
                                                       "✓ Account provisioned and synced to MySQL users table!"
                                                  );
                                                  setTimeout(() => setAccSuccessMsg(""), 3000);
                                             }}
                                             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
                                             <input
                                                  type="text"
                                                  placeholder="Full Name"
                                                  value={newAccName}
                                                  onChange={(e) => setNewAccName(e.target.value)}
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                             />
                                             <input
                                                  type="text"
                                                  placeholder="Username"
                                                  value={newAccUsername}
                                                  onChange={(e) => setNewAccUsername(e.target.value)}
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                             />
                                             <input
                                                  type="email"
                                                  placeholder="Email Address"
                                                  value={newAccEmail}
                                                  onChange={(e) => setNewAccEmail(e.target.value)}
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                             />
                                             <select
                                                  value={`${newAccRole}:${newAccMemberType}`}
                                                  onChange={(e) => {
                                                       const [r, mt] = e.target.value.split(":");
                                                       setNewAccRole(r);
                                                       setNewAccMemberType(mt);
                                                  }}
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100">
                                                  <option value="member:project_member">
                                                       Member · Project Member
                                                  </option>
                                                  <option value="member:plenary">
                                                       Member · Plenary Class
                                                  </option>
                                                  <option value="admin:none">Admin Account</option>
                                                  <option value="trainee:none">Trainee Account</option>
                                             </select>
                                             <select
                                                  value={newAccGroup}
                                                  onChange={(e) => setNewAccGroup(e.target.value)}
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100">
                                                  {dbState.groups.map((g) => (
                                                       <option key={g.code} value={g.code}>
                                                            Group {g.code} · {g.title.en}
                                                       </option>
                                                  ))}
                                             </select>
                                             <button
                                                  type="submit"
                                                  className="bg-[#f0a500] text-[#1a0e00] font-mono text-xs font-extrabold rounded-xl px-4 py-2 border-none cursor-pointer">
                                                  + Add Account
                                             </button>
                                        </form>
                                        {accSuccessMsg && (
                                             <div className="mt-3 font-mono text-xs text-green-400">
                                                  {accSuccessMsg}
                                             </div>
                                        )}
                                   </div>

                                   {/* Category Filter Pills */}
                                   <div className="flex flex-wrap gap-2 font-mono text-xs">
                                        {[
                                             { id: "all", label: `All Accounts (${dbState.users.length})` },
                                             { id: "admin", label: `Admins (${adminsList.length})` },
                                             {
                                                  id: "project_member",
                                                  label: `Members · Project Members (${projectMembersList.length})`,
                                             },
                                             {
                                                  id: "plenary",
                                                  label: `Members · Plenary Class (${plenaryMembersList.length})`,
                                             },
                                             { id: "trainee", label: `Trainees (${traineesList.length})` },
                                        ].map((tab) => (
                                             <button
                                                  key={tab.id}
                                                  type="button"
                                                  onClick={() => setAccFilterTab(tab.id)}
                                                  className={`px-3.5 py-2 rounded-xl border cursor-pointer ${
                                                       accFilterTab === tab.id
                                                            ? "bg-[#f0a500]/15 border-[#f0a500] text-[#f0a500] font-bold"
                                                            : "bg-[#131920] border-[#1f2937] text-[#94a3b8]"
                                                  }`}>
                                                  {tab.label}
                                             </button>
                                        ))}
                                   </div>

                                   {/* AG-Grid Enterprise Detailed Accounts Table */}
                                   <EnterpriseGrid
                                        title="Full Detailed Accounts Directory"
                                        subtitle="Admins, Members (Plenary Class & Project Members), and Trainees"
                                        enableHoverCard={true}
                                        data={dbState.users.filter((u) => {
                                             if (accFilterTab === "all") return true;
                                             if (accFilterTab === "admin") return u.role === "admin";
                                             if (accFilterTab === "project_member")
                                                  return (
                                                       u.role === "member" &&
                                                       u.memberType === "project_member"
                                                  );
                                             if (accFilterTab === "plenary")
                                                  return (
                                                       u.role === "member" && u.memberType === "plenary"
                                                  );
                                             if (accFilterTab === "trainee") return u.role === "trainee";
                                             return true;
                                        })}
                                        columns={[
                                             { field: "sectorCode", headerName: "Sector ID" },
                                             {
                                                  field: "fullName",
                                                  headerName: "User",
                                                  cellRenderer: (r) => (
                                                       <div className="flex items-center gap-2.5">
                                                            <img
                                                                 src={r.avatar}
                                                                 alt={r.fullName}
                                                                 className="w-7 h-7 rounded-full object-cover"
                                                            />
                                                            <div>
                                                                 <div className="font-bold text-slate-100">
                                                                      {r.fullName}
                                                                 </div>
                                                                 <div className="font-mono text-[10px] text-[#64748b]">
                                                                      @{r.username}
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ),
                                             },
                                             {
                                                  field: "role",
                                                  headerName: "Category / Subtype",
                                                  cellRenderer: (r) => (
                                                       <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#18202c] text-sky-300">
                                                            {r.role === "admin"
                                                                 ? "🛡️ Admin"
                                                                 : r.memberType === "project_member"
                                                                 ? "🏅 Project Member"
                                                                 : r.memberType === "plenary"
                                                                 ? "📘 Plenary Class"
                                                                 : "🌱 Trainee"}
                                                       </span>
                                                  ),
                                             },
                                             { field: "email", headerName: "Email" },
                                             { field: "primaryGroup", headerName: "Group" },
                                             {
                                                  field: "progressPct",
                                                  headerName: "Progress",
                                                  cellRenderer: (r) => (
                                                       <span className="font-mono text-xs text-green-400 font-bold">
                                                            {r.progressPct}%
                                                       </span>
                                                  ),
                                             },
                                        ]}
                                   />
                              </div>
                         )}

                         {/* =================================================================
                             3. CALENDAR PAGE (Full Calendar + Set Task or Project)
                         ================================================================= */}
                         {activePage === "calendar" && (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                   {/* Left: Full Monthly Calendar Grid (October 2026) */}
                                   <div className="lg:col-span-8 bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                             <div>
                                                  <div className="font-mono text-[10.5px] uppercase tracking-widest text-[#f0a500]">
                                                       Full Interactive Operations Schedule
                                                  </div>
                                                  <h2 className="text-xl font-bold">
                                                       📅 October – November 2026 Calendar
                                                  </h2>
                                             </div>
                                             <span className="font-mono text-xs text-sky-400">
                                                  {dbState.calendarEvents.length} Scheduled Tasks / Deadlines
                                             </span>
                                        </div>

                                        {/* 7-Day Calendar Grid */}
                                        <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[10.5px] text-[#64748b] mb-2">
                                             {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(
                                                  (d) => (
                                                       <div key={d} className="py-1">
                                                            {d}
                                                       </div>
                                                  )
                                             )}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1.5 mb-6">
                                             {Array.from({ length: 31 }, (_, i) => {
                                                  const day = i + 1;
                                                  const dateStr = `2026-10-${String(day).padStart(
                                                       2,
                                                       "0"
                                                  )}`;
                                                  const dayEvents = dbState.calendarEvents.filter(
                                                       (ev) =>
                                                            ev.startDate <= dateStr &&
                                                            ev.endDate >= dateStr
                                                  );
                                                  const isToday = day === 24;
                                                  return (
                                                       <div
                                                            key={day}
                                                            onClick={() => {
                                                                 setCalPreset("custom");
                                                                 setCalStartDate(dateStr);
                                                                 setCalEndDate(dateStr);
                                                            }}
                                                            className={`min-h-20 p-1.5 rounded-xl border text-left cursor-pointer transition-colors ${
                                                                 isToday
                                                                      ? "border-[#f0a500] bg-[#f0a500]/10"
                                                                      : "border-[#1f2937] bg-[#0b0f14] hover:border-[#334155]"
                                                            }`}>
                                                            <div className="font-mono text-[10.5px] font-bold text-slate-300 flex justify-between">
                                                                 <span>{day}</span>
                                                                 {isToday && (
                                                                      <span className="text-[9px] text-[#f0a500]">
                                                                           TODAY
                                                                      </span>
                                                                 )}
                                                            </div>
                                                            <div className="flex flex-col gap-1 mt-1">
                                                                 {dayEvents.slice(0, 2).map((ev) => (
                                                                      <div
                                                                           key={ev.id}
                                                                           className="text-[9.5px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 truncate">
                                                                           {ev.title}
                                                                      </div>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                  );
                                             })}
                                        </div>

                                        {/* Scheduled Events Feed */}
                                        <h3 className="text-sm font-bold mb-3">
                                             Scheduled Tasks &amp; Auto-Synced Project Deadlines
                                        </h3>
                                        <div className="flex flex-col gap-2.5">
                                             {dbState.calendarEvents.map((ev) => (
                                                  <div
                                                       key={ev.id}
                                                       className="p-3.5 rounded-xl bg-[#0b0f14] border border-[#1f2937] flex flex-wrap items-center justify-between gap-3">
                                                       <div>
                                                            <div className="flex items-center gap-2">
                                                                 <span className="text-xs font-bold text-slate-100">
                                                                      {ev.title}
                                                                 </span>
                                                                 <span
                                                                      className={`font-mono text-[9.5px] px-2 py-0.5 rounded border ${
                                                                           PRIORITY_COLORS[ev.priority] ||
                                                                           PRIORITY_COLORS.None
                                                                      }`}>
                                                                      Priority: {ev.priority}
                                                                 </span>
                                                                 <span className="font-mono text-[9.5px] px-2 py-0.5 rounded bg-[#18202c] text-[#f0a500]">
                                                                      #{ev.tag}
                                                                 </span>
                                                            </div>
                                                            <div className="text-xs text-[#64748b] mt-1">
                                                                 {ev.description}
                                                            </div>
                                                       </div>
                                                       <div className="text-right font-mono text-[10.5px]">
                                                            <div className="text-sky-400">
                                                                 {ev.startDate} → {ev.endDate}
                                                            </div>
                                                            <div className="text-[#64748b]">
                                                                 Added by: {ev.addedBy}
                                                            </div>
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Right: Set Task or Project Form */}
                                   <div className="lg:col-span-4 bg-[#131920] border border-[#1f2937] rounded-2xl p-6 h-fit">
                                        <h3 className="text-base font-bold mb-1">
                                             ➕ Set Task or Project
                                        </h3>
                                        <p className="text-xs text-[#64748b] mb-4">
                                             Added by:{" "}
                                             <strong className="text-[#f0a500]">
                                                  {role === "admin"
                                                       ? `Admin's Account (${currentUser.fullName})`
                                                       : `Member's Account (${currentUser.fullName})`}
                                             </strong>
                                        </p>

                                        <form
                                             onSubmit={(e) => {
                                                  e.preventDefault();
                                                  if (!calTaskName.trim()) return;
                                                  onAddCalendarEvent({
                                                       title: calTaskName.trim(),
                                                       description: calTaskDesc.trim(),
                                                       tag: calTaskTag.trim() || "General",
                                                       priority: calTaskPriority,
                                                       preset: calPreset,
                                                       startDate: calStartDate,
                                                       endDate: calEndDate,
                                                       addedBy:
                                                            role === "admin"
                                                                 ? `Admin's Account (${currentUser.fullName})`
                                                                 : `Member's Account (${currentUser.fullName})`,
                                                  });
                                                  setCalTaskName("");
                                                  setCalTaskDesc("");
                                             }}
                                             className="flex flex-col gap-3">
                                             <input
                                                  type="text"
                                                  placeholder="Task or Project Name"
                                                  value={calTaskName}
                                                  onChange={(e) => setCalTaskName(e.target.value)}
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                             />
                                             <textarea
                                                  rows={2}
                                                  placeholder="Description..."
                                                  value={calTaskDesc}
                                                  onChange={(e) => setCalTaskDesc(e.target.value)}
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                             />
                                             <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                       <label className="block font-mono text-[10px] text-[#64748b] mb-1">
                                                            Tag
                                                       </label>
                                                       <input
                                                            type="text"
                                                            value={calTaskTag}
                                                            onChange={(e) => setCalTaskTag(e.target.value)}
                                                            className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                                       />
                                                  </div>
                                                  <div>
                                                       <label className="block font-mono text-[10px] text-[#64748b] mb-1">
                                                            Priority
                                                       </label>
                                                       <select
                                                            value={calTaskPriority}
                                                            onChange={(e) =>
                                                                 setCalTaskPriority(e.target.value)
                                                            }
                                                            className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100">
                                                            <option value="None">None</option>
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                       </select>
                                                  </div>
                                             </div>

                                             {/* Deadline Date Quick Presets */}
                                             <div>
                                                  <label className="block font-mono text-[10px] text-[#64748b] mb-1.5">
                                                       Deadline Preset (Today, Tomorrow, Next Week, Next Month, Custom)
                                                  </label>
                                                  <div className="grid grid-cols-3 gap-1.5 font-mono text-[10.5px]">
                                                       {[
                                                            { id: "today", label: "Today" },
                                                            { id: "tomorrow", label: "Tomorrow" },
                                                            { id: "next_week", label: "Next Week" },
                                                            { id: "next_month", label: "Next Month" },
                                                            { id: "custom", label: "Custom" },
                                                       ].map((p) => (
                                                            <button
                                                                 key={p.id}
                                                                 type="button"
                                                                 onClick={() => applyDeadlinePreset(p.id)}
                                                                 className={`py-1.5 rounded-lg border cursor-pointer ${
                                                                      calPreset === p.id
                                                                           ? "bg-[#f0a500]/20 border-[#f0a500] text-[#f0a500] font-bold"
                                                                           : "bg-[#0b0f14] border-[#263244] text-[#94a3b8]"
                                                                 }`}>
                                                                 {p.label}
                                                            </button>
                                                       ))}
                                                  </div>
                                             </div>

                                             {/* Duration: Start & End */}
                                             <div className="grid grid-cols-2 gap-2">
                                                  <div>
                                                       <label className="block font-mono text-[10px] text-[#64748b] mb-1">
                                                            Duration Start
                                                       </label>
                                                       <input
                                                            type="date"
                                                            value={calStartDate}
                                                            onChange={(e) =>
                                                                 setCalStartDate(e.target.value)
                                                            }
                                                            className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-2.5 py-2 text-xs text-slate-100"
                                                       />
                                                  </div>
                                                  <div>
                                                       <label className="block font-mono text-[10px] text-[#64748b] mb-1">
                                                            Duration End
                                                       </label>
                                                       <input
                                                            type="date"
                                                            value={calEndDate}
                                                            onChange={(e) =>
                                                                 setCalEndDate(e.target.value)
                                                            }
                                                            className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-2.5 py-2 text-xs text-slate-100"
                                                       />
                                                  </div>
                                             </div>

                                             <button
                                                  type="submit"
                                                  className="w-full py-2.5 rounded-xl bg-[#f0a500] text-[#1a0e00] font-mono text-xs font-extrabold border-none cursor-pointer">
                                                  + Save Task to Calendar
                                             </button>
                                        </form>
                                   </div>
                              </div>
                         )}

                         {/* =================================================================
                             4. LIST OF MEMBERS & TRAINEES (Row Hover Tooltip + Active Toggle)
                         ================================================================= */}
                         {activePage === "members_trainees" && role === "admin" && (
                              <EnterpriseGrid
                                   title="List of Members & Trainees"
                                   subtitle="Hover over any row to inspect full Member/Trainee popup dossier · Toggle Active or Non-Active status"
                                   enableHoverCard={true}
                                   data={dbState.users.filter((u) => u.role !== "admin")}
                                   columns={[
                                        { field: "sectorCode", headerName: "Sector ID" },
                                        {
                                             field: "fullName",
                                             headerName: "Member / Trainee (Hover Row!)",
                                             cellRenderer: (r) => (
                                                  <div className="flex items-center gap-2.5">
                                                       <img
                                                            src={r.avatar}
                                                            alt={r.fullName}
                                                            className="w-8 h-8 rounded-full object-cover border border-[#f0a500]/50"
                                                       />
                                                       <div>
                                                            <div className="font-bold text-slate-100">
                                                                 {r.fullName}
                                                            </div>
                                                            <div className="text-[11px] text-[#64748b]">
                                                                 {r.bio}
                                                            </div>
                                                       </div>
                                                  </div>
                                             ),
                                        },
                                        {
                                             field: "role",
                                             headerName: "Classification",
                                             cellRenderer: (r) => (
                                                  <span className="font-mono text-xs text-sky-400">
                                                       {r.role === "trainee"
                                                            ? "🌱 Trainee"
                                                            : r.memberType === "plenary"
                                                            ? "📘 Member (Plenary Class)"
                                                            : "🏅 Member (Project Member)"}
                                                  </span>
                                             ),
                                        },
                                        { field: "primaryGroup", headerName: "Group" },
                                        {
                                             field: "isActive",
                                             headerName: "Set Active / Non-Active",
                                             filterable: false,
                                             cellRenderer: (r) => (
                                                  <button
                                                       type="button"
                                                       onClick={() => onToggleUserActive(r.id)}
                                                       className={`font-mono text-[11px] font-bold px-3 py-1 rounded-full border cursor-pointer ${
                                                            r.isActive
                                                                 ? "bg-green-500/15 border-green-400 text-green-400"
                                                                 : "bg-red-500/15 border-red-400 text-red-400"
                                                       }`}>
                                                       {r.isActive ? "● Active" : "○ Non-Active"}
                                                  </button>
                                             ),
                                        },
                                   ]}
                              />
                         )}

                         {/* =================================================================
                             5. PROJECTS -> ADD PROJECTS (Default Priority None, Default Draft, Auto-Calendar)
                         ================================================================= */}
                         {activePage === "proj_add" && (
                              <div className="max-w-3xl bg-[#131920] border border-[#1f2937] rounded-2xl p-6 md:p-8">
                                   <div className="font-mono text-[10.5px] uppercase tracking-widest text-[#f0a500] mb-1">
                                        Projects Module · Auto-Calendar Sync
                                   </div>
                                   <h2 className="text-2xl font-extrabold mb-1">➕ Add Project</h2>
                                   <p className="text-xs text-[#64748b] mb-6">
                                        Priority defaults to <strong>"None"</strong> and Status defaults to{" "}
                                        <strong>"Draft"</strong> on the day created unless set. Setting a Deadline automatically adds the project to the Calendar view!
                                   </p>

                                   <form
                                        onSubmit={(e) => {
                                             e.preventDefault();
                                             if (!projName.trim()) return;
                                             onAddProject({
                                                  name: projName.trim(),
                                                  description: projDesc.trim(),
                                                  priority: projPriority || "None",
                                                  status: projStatus || "Draft",
                                                  assignedTeamId: Number(projTeamId),
                                                  attachments: projAttachments,
                                                  deadlineStart: projDeadlineStart || null,
                                                  deadlineEnd:
                                                       projDeadlineEnd || projDeadlineStart || null,
                                                  createdBy:
                                                       role === "admin"
                                                            ? `Admin's Account (${currentUser.fullName})`
                                                            : `Member's Account (${currentUser.fullName})`,
                                             });
                                             setProjCreatedBanner(
                                                  projDeadlineStart
                                                       ? `✓ Project "${projName}" created (${projStatus}) and automatically synced to Calendar view!`
                                                       : `✓ Project "${projName}" saved as ${projStatus} (Priority: ${projPriority}).`
                                             );
                                             setProjName("");
                                             setProjDesc("");
                                             setProjPriority("None");
                                             setProjStatus("Draft");
                                             setProjAttachments([]);
                                             setProjDeadlineStart("");
                                             setProjDeadlineEnd("");
                                        }}
                                        className="flex flex-col gap-4">
                                        <div>
                                             <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                  Name of Project
                                             </label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g. Congregation Server Rack Upgrade"
                                                  value={projName}
                                                  onChange={(e) => setProjName(e.target.value)}
                                                  className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100"
                                             />
                                        </div>

                                        <div>
                                             <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                  Description
                                             </label>
                                             <textarea
                                                  rows={3}
                                                  placeholder="Project scope, deliverables, and hardware/network requirements..."
                                                  value={projDesc}
                                                  onChange={(e) => setProjDesc(e.target.value)}
                                                  className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100"
                                             />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                             <div>
                                                  <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                       Priority ("None" Default)
                                                  </label>
                                                  <select
                                                       value={projPriority}
                                                       onChange={(e) =>
                                                            setProjPriority(e.target.value)
                                                       }
                                                       className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2.5 text-xs text-slate-100">
                                                       <option value="None">None (Default)</option>
                                                       <option value="Low">Low</option>
                                                       <option value="Medium">Medium</option>
                                                       <option value="High">High</option>
                                                  </select>
                                             </div>
                                             <div>
                                                  <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                       Initial Status ("Draft" Default)
                                                  </label>
                                                  <select
                                                       value={projStatus}
                                                       onChange={(e) => setProjStatus(e.target.value)}
                                                       className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2.5 text-xs text-slate-100">
                                                       {PROJECT_STATUSES.map((st) => (
                                                            <option key={st} value={st}>
                                                                 {st}
                                                            </option>
                                                       ))}
                                                  </select>
                                             </div>
                                             <div>
                                                  <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                       Assigned Team
                                                  </label>
                                                  <select
                                                       value={projTeamId}
                                                       onChange={(e) => setProjTeamId(e.target.value)}
                                                       className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2.5 text-xs text-slate-100">
                                                       {dbState.teams.map((t) => (
                                                            <option key={t.id} value={t.id}>
                                                                 {t.name}
                                                            </option>
                                                       ))}
                                                  </select>
                                             </div>
                                        </div>

                                        {/* Deadline (Automatically syncs to Calendar if set) */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4">
                                             <div>
                                                  <label className="block font-mono text-[10.5px] uppercase text-sky-400 mb-1">
                                                       📅 Deadline Start (Auto-adds to Calendar)
                                                  </label>
                                                  <input
                                                       type="date"
                                                       value={projDeadlineStart}
                                                       onChange={(e) =>
                                                            setProjDeadlineStart(e.target.value)
                                                       }
                                                       className="w-full bg-[#131920] border border-[#263244] rounded-lg px-3 py-2 text-xs text-slate-100"
                                                  />
                                             </div>
                                             <div>
                                                  <label className="block font-mono text-[10.5px] uppercase text-sky-400 mb-1">
                                                       📅 Deadline End
                                                  </label>
                                                  <input
                                                       type="date"
                                                       value={projDeadlineEnd}
                                                       onChange={(e) =>
                                                            setProjDeadlineEnd(e.target.value)
                                                       }
                                                       className="w-full bg-[#131920] border border-[#263244] rounded-lg px-3 py-2 text-xs text-slate-100"
                                                  />
                                             </div>
                                        </div>

                                        {/* Attach File or Image (All Necessary File Formats) */}
                                        <div className="bg-[#0b0f14] border border-dashed border-[#334155] rounded-xl p-4">
                                             <label className="block font-mono text-xs text-slate-200 mb-2 cursor-pointer">
                                                  📎 Attach File or Image (Supports PDF, DOCX, XLSX, PPTX, PNG, JPG, SVG, ZIP, SQL, PKT)
                                                  <input
                                                       type="file"
                                                       multiple
                                                       accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.svg,.webp,.zip,.sql,.txt,.csv,.pkt"
                                                       onChange={handleFileAttachment}
                                                       className="block mt-2 text-xs text-[#94a3b8]"
                                                  />
                                             </label>
                                             {projAttachments.length > 0 && (
                                                  <div className="flex flex-wrap gap-2 mt-2">
                                                       {projAttachments.map((att, i) => (
                                                            <span
                                                                 key={i}
                                                                 className="font-mono text-[10.5px] px-2.5 py-1 rounded bg-[#131920] border border-[#263244] text-[#f0a500]">
                                                                 📄 {att.name} ({att.size})
                                                            </span>
                                                       ))}
                                                  </div>
                                             )}
                                        </div>

                                        {projCreatedBanner && (
                                             <div className="p-3.5 rounded-xl bg-green-500/15 border border-green-400/40 text-xs text-green-300 font-mono">
                                                  {projCreatedBanner}
                                             </div>
                                        )}

                                        <button
                                             type="submit"
                                             className="py-3 rounded-xl bg-[#f0a500] text-[#1a0e00] font-mono text-xs font-extrabold border-none cursor-pointer">
                                             + Create Project
                                        </button>
                                   </form>
                              </div>
                         )}

                         {/* =================================================================
                             6. PROJECTS -> LIST OF PROJECTS (Table or Kanban, 6 Statuses)
                         ================================================================= */}
                         {activePage === "proj_list" && (
                              <div className="flex flex-col gap-5">
                                   <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131920] border border-[#1f2937] rounded-2xl p-4">
                                        <div>
                                             <h2 className="text-lg font-bold">
                                                  📋 List of Projects (Table &amp; Kanban View)
                                             </h2>
                                             <div className="text-xs text-[#64748b]">
                                                  Divided into Finish project, In-Progress, On-Hold, Archived, Draft, and Deleted
                                             </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                             {/* Status Filter */}
                                             <select
                                                  value={projStatusFilter}
                                                  onChange={(e) =>
                                                       setProjStatusFilter(e.target.value)
                                                  }
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-lg px-3 py-1.5 font-mono text-xs text-slate-200">
                                                  <option value="ALL">All 6 Statuses</option>
                                                  {PROJECT_STATUSES.map((st) => (
                                                       <option key={st} value={st}>
                                                            {st}
                                                       </option>
                                                  ))}
                                             </select>

                                             {/* Priority Filter */}
                                             <select
                                                  value={projPriorityFilter}
                                                  onChange={(e) =>
                                                       setProjPriorityFilter(e.target.value)
                                                  }
                                                  className="bg-[#0b0f14] border border-[#263244] rounded-lg px-3 py-1.5 font-mono text-xs text-slate-200">
                                                  <option value="ALL">All Priorities</option>
                                                  <option value="High">High</option>
                                                  <option value="Medium">Medium</option>
                                                  <option value="Low">Low</option>
                                                  <option value="None">None</option>
                                             </select>

                                             {/* View Switcher: Kanban vs. AG-Grid Table */}
                                             <div className="flex bg-[#0b0f14] border border-[#263244] rounded-lg overflow-hidden font-mono text-xs">
                                                  <button
                                                       type="button"
                                                       onClick={() => setProjViewMode("kanban")}
                                                       className={`px-3 py-1.5 border-none cursor-pointer ${
                                                            projViewMode === "kanban"
                                                                 ? "bg-[#f0a500] text-[#1a0e00] font-bold"
                                                                 : "bg-transparent text-[#94a3b8]"
                                                       }`}>
                                                       ▤ Kanban Board
                                                  </button>
                                                  <button
                                                       type="button"
                                                       onClick={() => setProjViewMode("table")}
                                                       className={`px-3 py-1.5 border-none cursor-pointer ${
                                                            projViewMode === "table"
                                                                 ? "bg-[#f0a500] text-[#1a0e00] font-bold"
                                                                 : "bg-transparent text-[#94a3b8]"
                                                       }`}>
                                                       ☰ AG-Grid Table
                                                  </button>
                                             </div>
                                        </div>
                                   </div>

                                   {projViewMode === "kanban" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
                                             {PROJECT_STATUSES.filter((st) =>
                                                  projStatusFilter === "ALL"
                                                       ? true
                                                       : st === projStatusFilter
                                             ).map((statusCol) => {
                                                  const items = dbState.projects.filter(
                                                       (p) =>
                                                            p.status === statusCol &&
                                                            (projPriorityFilter === "ALL" ||
                                                                 p.priority === projPriorityFilter)
                                                  );
                                                  return (
                                                       <div
                                                            key={statusCol}
                                                            className="bg-[#131920] border border-[#1f2937] rounded-2xl p-3.5 flex flex-col gap-3">
                                                            <div className="flex items-center justify-between border-b border-[#1f2937] pb-2">
                                                                 <span className="font-mono text-xs font-bold text-slate-100">
                                                                      {statusCol}
                                                                 </span>
                                                                 <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#0b0f14] text-[#f0a500]">
                                                                      {items.length}
                                                                 </span>
                                                            </div>
                                                            {items.map((proj) => (
                                                                 <div
                                                                      key={proj.id}
                                                                      className="bg-[#0b0f14] border border-[#263244] rounded-xl p-3 flex flex-col gap-2">
                                                                      <div className="flex items-center justify-between gap-1">
                                                                           <span
                                                                                className={`font-mono text-[9.5px] px-2 py-0.5 rounded border ${
                                                                                     PRIORITY_COLORS[
                                                                                          proj.priority
                                                                                     ] ||
                                                                                     PRIORITY_COLORS.None
                                                                                }`}>
                                                                                {proj.priority}
                                                                           </span>
                                                                           <span className="font-mono text-[10px] text-sky-400">
                                                                                {proj.progressPct}%
                                                                           </span>
                                                                      </div>
                                                                      <div className="text-xs font-bold text-slate-100">
                                                                           {proj.name}
                                                                      </div>
                                                                      <div className="text-[11px] text-[#64748b] line-clamp-2">
                                                                           {proj.description}
                                                                      </div>
                                                                      {proj.attachments?.length > 0 && (
                                                                           <div className="font-mono text-[9.5px] text-[#f0a500]">
                                                                                📎 {proj.attachments.length} file(s)
                                                                           </div>
                                                                      )}
                                                                      <select
                                                                           value={proj.status}
                                                                           onChange={(e) =>
                                                                                onUpdateProjectStatus(
                                                                                     proj.id,
                                                                                     e.target.value
                                                                                )
                                                                           }
                                                                           className="mt-1 bg-[#131920] border border-[#263244] rounded px-2 py-1 font-mono text-[10px] text-slate-200">
                                                                           {PROJECT_STATUSES.map(
                                                                                (s) => (
                                                                                     <option
                                                                                          key={s}
                                                                                          value={s}>
                                                                                          Move: {s}
                                                                                     </option>
                                                                                )
                                                                           )}
                                                                      </select>
                                                                 </div>
                                                            ))}
                                                       </div>
                                                  );
                                             })}
                                        </div>
                                   ) : (
                                        <EnterpriseGrid
                                             title="List of Projects (AG-Grid Enterprise View)"
                                             subtitle="Filter, sort, and manage projects across all 6 lifecycle states"
                                             data={dbState.projects.filter(
                                                  (p) =>
                                                       (projStatusFilter === "ALL" ||
                                                            p.status === projStatusFilter) &&
                                                       (projPriorityFilter === "ALL" ||
                                                            p.priority === projPriorityFilter)
                                             )}
                                             columns={[
                                                  { field: "name", headerName: "Project Name" },
                                                  {
                                                       field: "status",
                                                       headerName: "Status",
                                                       cellRenderer: (r) => (
                                                            <select
                                                                 value={r.status}
                                                                 onChange={(e) =>
                                                                      onUpdateProjectStatus(
                                                                           r.id,
                                                                           e.target.value
                                                                      )
                                                                 }
                                                                 className="bg-[#0b0f14] border border-[#263244] rounded px-2 py-1 font-mono text-xs text-[#f0a500]">
                                                                 {PROJECT_STATUSES.map((s) => (
                                                                      <option key={s} value={s}>
                                                                           {s}
                                                                      </option>
                                                                 ))}
                                                            </select>
                                                       ),
                                                  },
                                                  { field: "priority", headerName: "Priority" },
                                                  {
                                                       field: "progressPct",
                                                       headerName: "Progress",
                                                       cellRenderer: (r) => `${r.progressPct}%`,
                                                  },
                                                  {
                                                       field: "deadlineStart",
                                                       headerName: "Deadline",
                                                       cellRenderer: (r) =>
                                                            r.deadlineStart
                                                                 ? `${r.deadlineStart} → ${r.deadlineEnd}`
                                                                 : "No Deadline",
                                                  },
                                                  { field: "createdBy", headerName: "Created By" },
                                             ]}
                                        />
                                   )}
                              </div>
                         )}

                         {/* =================================================================
                             7. PROJECTS -> MANAGE TEAMS (Create Teams + Assign Project Teams)
                         ================================================================= */}
                         {activePage === "proj_teams" && role === "admin" && (
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                   {/* Left: Create Teams & Assign Project Teams */}
                                   <div className="lg:col-span-5 flex flex-col gap-6">
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                             <h3 className="text-base font-bold mb-1">
                                                  ➕ Create Team
                                             </h3>
                                             <p className="text-xs text-[#64748b] mb-4">
                                                  Select members below — live indicators show who is Available vs. Busy.
                                             </p>
                                             <form
                                                  onSubmit={(e) => {
                                                       e.preventDefault();
                                                       if (!teamName.trim()) return;
                                                       onCreateTeam({
                                                            name: teamName.trim(),
                                                            groupCode: teamGroup,
                                                            leadUserId: Number(teamLeadId),
                                                            memberIds: selectedTeamMembers,
                                                            description: teamDesc.trim(),
                                                       });
                                                       setTeamName("");
                                                       setTeamDesc("");
                                                  }}
                                                  className="flex flex-col gap-3">
                                                  <input
                                                       type="text"
                                                       placeholder="Team Name (e.g. Delta Server Ops)"
                                                       value={teamName}
                                                       onChange={(e) => setTeamName(e.target.value)}
                                                       className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                                  />
                                                  <input
                                                       type="text"
                                                       placeholder="Team Mission Description"
                                                       value={teamDesc}
                                                       onChange={(e) => setTeamDesc(e.target.value)}
                                                       className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100"
                                                  />
                                                  <div className="font-mono text-[10.5px] text-[#94a3b8] mt-1">
                                                       Select Members (with Availability Indicator):
                                                  </div>
                                                  <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto bg-[#0b0f14] p-2.5 rounded-xl border border-[#1f2937]">
                                                       {projectMembersList.map((m) => {
                                                            const checked =
                                                                 selectedTeamMembers.includes(m.id);
                                                            return (
                                                                 <div
                                                                      key={m.id}
                                                                      className="flex items-center justify-between text-xs py-1">
                                                                      <label className="flex items-center gap-2 cursor-pointer">
                                                                           <input
                                                                                type="checkbox"
                                                                                checked={checked}
                                                                                onChange={() =>
                                                                                     setSelectedTeamMembers(
                                                                                          (prev) =>
                                                                                               checked
                                                                                                    ? prev.filter(
                                                                                                           (
                                                                                                                id
                                                                                                           ) =>
                                                                                                                id !==
                                                                                                                m.id
                                                                                                      )
                                                                                                    : [
                                                                                                           ...prev,
                                                                                                           m.id,
                                                                                                      ]
                                                                                     )
                                                                                }
                                                                           />
                                                                           <span>{m.fullName}</span>
                                                                      </label>
                                                                      <button
                                                                           type="button"
                                                                           onClick={() =>
                                                                                onToggleUserAvailability(
                                                                                     m.id
                                                                                )
                                                                           }
                                                                           className={`font-mono text-[10px] px-2 py-0.5 rounded border cursor-pointer ${
                                                                                m.availability ===
                                                                                "available"
                                                                                     ? "bg-green-500/15 border-green-400/40 text-green-400"
                                                                                     : "bg-amber-500/15 border-amber-400/40 text-amber-400"
                                                                           }`}>
                                                                           {m.availability ===
                                                                           "available"
                                                                                ? "🟢 Available"
                                                                                : "🟠 Busy"}
                                                                      </button>
                                                                 </div>
                                                            );
                                                       })}
                                                  </div>
                                                  <button
                                                       type="submit"
                                                       className="py-2.5 rounded-xl bg-[#f0a500] text-[#1a0e00] font-mono text-xs font-extrabold border-none cursor-pointer">
                                                       + Create Team
                                                  </button>
                                             </form>
                                        </div>

                                        {/* Shortened: "Assign Project Teams" */}
                                        <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                             <h3 className="text-base font-bold mb-1">
                                                  🔗 Assign Project Teams
                                             </h3>
                                             <p className="text-xs text-[#64748b] mb-3">
                                                  Bind an operational team directly to a project.
                                             </p>
                                             <div className="flex flex-col gap-3">
                                                  <select
                                                       value={assignProjId}
                                                       onChange={(e) =>
                                                            setAssignProjId(Number(e.target.value))
                                                       }
                                                       className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100">
                                                       {dbState.projects.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                 Project: {p.name}
                                                            </option>
                                                       ))}
                                                  </select>
                                                  <select
                                                       value={assignTeamId}
                                                       onChange={(e) =>
                                                            setAssignTeamId(Number(e.target.value))
                                                       }
                                                       className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3 py-2 text-xs text-slate-100">
                                                       {dbState.teams.map((t) => (
                                                            <option key={t.id} value={t.id}>
                                                                 Team: {t.name}
                                                            </option>
                                                       ))}
                                                  </select>
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            onAssignTeamToProject(
                                                                 assignProjId,
                                                                 assignTeamId
                                                            )
                                                       }
                                                       className="py-2.5 rounded-xl bg-sky-500/20 border border-sky-400 text-sky-300 font-mono text-xs font-bold cursor-pointer">
                                                       ✓ Assign Team to Project
                                                  </button>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Right: Active Teams Directory */}
                                   <div className="lg:col-span-7 bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                        <h3 className="text-base font-bold mb-4">
                                             Active NHS Project Teams &amp; Member Availability
                                        </h3>
                                        <div className="flex flex-col gap-4">
                                             {dbState.teams.map((t) => (
                                                  <div
                                                       key={t.id}
                                                       className="p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                                       <div className="flex items-center justify-between mb-1">
                                                            <span className="text-sm font-bold text-slate-100">
                                                                 {t.name}
                                                            </span>
                                                            <span className="font-mono text-xs text-[#f0a500]">
                                                                 Group {t.groupCode}
                                                            </span>
                                                       </div>
                                                       <p className="text-xs text-[#64748b] mb-3">
                                                            {t.description}
                                                       </p>
                                                       <div className="flex flex-wrap gap-2">
                                                            {t.memberIds.map((mid) => {
                                                                 const m = dbState.users.find(
                                                                      (u) => u.id === mid
                                                                 );
                                                                 if (!m) return null;
                                                                 return (
                                                                      <span
                                                                           key={mid}
                                                                           className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#131920] border border-[#263244]">
                                                                           {m.availability ===
                                                                           "available"
                                                                                ? "🟢"
                                                                                : "🟠"}{" "}
                                                                           {m.fullName}
                                                                      </span>
                                                                 );
                                                            })}
                                                       </div>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>
                              </div>
                         )}

                         {/* =================================================================
                             8. PROJECTS -> PROJECT MEMBERS / PLENARY CLASS / TRAINEE
                         ================================================================= */}
                         {activePage === "proj_members" && role === "admin" && (
                              <EnterpriseGrid
                                   title="Project Members (Active & Non-Active)"
                                   subtitle="Operational NHS members assigned to technical builds"
                                   enableHoverCard={true}
                                   data={projectMembersList}
                                   columns={[
                                        { field: "sectorCode", headerName: "Sector ID" },
                                        { field: "fullName", headerName: "Project Member" },
                                        { field: "primaryGroup", headerName: "Group" },
                                        {
                                             field: "availability",
                                             headerName: "Availability",
                                             cellRenderer: (r) => (
                                                  <button
                                                       type="button"
                                                       onClick={() => onToggleUserAvailability(r.id)}
                                                       className="font-mono text-xs bg-transparent border border-[#263244] rounded px-2 py-0.5 cursor-pointer text-slate-200">
                                                       {r.availability === "available"
                                                            ? "🟢 Available"
                                                            : "🟠 Busy"}
                                                  </button>
                                             ),
                                        },
                                        {
                                             field: "isActive",
                                             headerName: "Active Status",
                                             cellRenderer: (r) => (
                                                  <button
                                                       type="button"
                                                       onClick={() => onToggleUserActive(r.id)}
                                                       className={`font-mono text-xs px-2.5 py-0.5 rounded-full border cursor-pointer ${
                                                            r.isActive
                                                                 ? "border-green-400 text-green-400"
                                                                 : "border-red-400 text-red-400"
                                                       }`}>
                                                       {r.isActive ? "Active" : "Non-Active"}
                                                  </button>
                                             ),
                                        },
                                   ]}
                              />
                         )}

                         {activePage === "proj_plenary" && role === "admin" && (
                              <EnterpriseGrid
                                   title="Plenary Class (Potential Project Members)"
                                   subtitle="Students in the Plenary Class with high potential to be promoted to Project Members"
                                   enableHoverCard={true}
                                   data={plenaryMembersList}
                                   columns={[
                                        { field: "sectorCode", headerName: "Sector ID" },
                                        { field: "fullName", headerName: "Student Name" },
                                        { field: "primaryGroup", headerName: "Group" },
                                        {
                                             field: "progressPct",
                                             headerName: "Readiness Score",
                                             cellRenderer: (r) => `${r.progressPct}%`,
                                        },
                                        {
                                             field: "id",
                                             headerName: "Promote Action",
                                             filterable: false,
                                             cellRenderer: (r) => (
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            onPromoteUser(
                                                                 r.id,
                                                                 "member",
                                                                 "project_member"
                                                            )
                                                       }
                                                       className="font-mono text-xs px-3 py-1 rounded-lg bg-sky-500/20 border border-sky-400 text-sky-300 cursor-pointer">
                                                       ⬆ Promote to Project Member
                                                  </button>
                                             ),
                                        },
                                   ]}
                              />
                         )}

                         {activePage === "proj_trainee" && role === "admin" && (
                              <EnterpriseGrid
                                   title="Trainees (Orientation Completion Tracker)"
                                   subtitle="Trainees who finished or are completing the NHS Learning Orientation"
                                   enableHoverCard={true}
                                   data={traineesList}
                                   columns={[
                                        { field: "sectorCode", headerName: "Trainee ID" },
                                        { field: "fullName", headerName: "Trainee Name" },
                                        { field: "primaryGroup", headerName: "Group" },
                                        {
                                             field: "progressPct",
                                             headerName: "Orientation Progress",
                                             cellRenderer: (r) => (
                                                  <span className="font-mono text-xs text-green-400 font-bold">
                                                       {r.progressPct}%{" "}
                                                       {r.progressPct >= 100
                                                            ? "(Finished Orientation ✓)"
                                                            : "(In Progress)"}
                                                  </span>
                                             ),
                                        },
                                        {
                                             field: "id",
                                             headerName: "Graduate to Member",
                                             filterable: false,
                                             cellRenderer: (r) => (
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            onPromoteUser(r.id, "member", "plenary")
                                                       }
                                                       className="font-mono text-xs px-3 py-1 rounded-lg bg-green-500/20 border border-green-400 text-green-300 cursor-pointer">
                                                       🎓 Graduate to Plenary Class
                                                  </button>
                                             ),
                                        },
                                   ]}
                              />
                         )}

                         {/* =================================================================
                             9. TRAINEE LEARNING ROADMAPS & IN-APP LESSON VIEWER
                         ================================================================= */}
                         {activePage === "trainee_roadmaps" && (
                              <div>
                                   {selectedRoadmapTrack ? (
                                        <LessonViewer
                                             t={(o) =>
                                                  typeof o === "string"
                                                       ? o
                                                       : o?.[userSetting?.language || "en"] ||
                                                         o?.en ||
                                                         ""
                                             }
                                             lang={userSetting?.language || "en"}
                                             track={selectedRoadmapTrack}
                                             activeLessonIndex={activeLessonIndex}
                                             setActiveLessonIndex={setActiveLessonIndex}
                                             completedLessons={myCompletedLessons}
                                             onToggleLessonComplete={onToggleLessonComplete}
                                             onBackToTrack={() => setSelectedRoadmapTrack(null)}
                                        />
                                   ) : (
                                        <div className="flex flex-col gap-6">
                                             <div>
                                                  <div className="font-mono text-xs uppercase tracking-widest text-[#f0a500]">
                                                       6 NHS Groups · Interactive Trainee Curriculum
                                                  </div>
                                                  <h2 className="text-2xl font-extrabold mt-1">
                                                       🗺️ NHS Learning Roadmaps
                                                  </h2>
                                             </div>

                                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                  {[
                                                       ...dbState.hwTracks.map((tr) => ({
                                                            ...tr,
                                                            badge: "Group 00 · Hardware",
                                                       })),
                                                       ...Object.entries(dbState.itTracks).map(
                                                            ([k, tr]) => ({
                                                                 ...tr,
                                                                 id: k,
                                                                 badge: "Group 05 · I.T. Infra",
                                                            })
                                                       ),
                                                  ].map((tr) => (
                                                       <div
                                                            key={`${tr.badge}-${tr.id}`}
                                                            onClick={() => {
                                                                 setSelectedRoadmapTrack(tr);
                                                                 setActiveLessonIndex(0);
                                                            }}
                                                            className="bg-[#131920] border border-[#1f2937] hover:border-[#f0a500] rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between">
                                                            <div>
                                                                 <div className="flex items-center justify-between mb-2">
                                                                      <span className="text-2xl">
                                                                           {tr.icon}
                                                                      </span>
                                                                      <span className="font-mono text-[10px] text-[#f0a500]">
                                                                           {tr.badge}
                                                                      </span>
                                                                 </div>
                                                                 <div className="text-base font-bold text-slate-100 mb-1">
                                                                      {tr.title.en}
                                                                 </div>
                                                                 <p className="text-xs text-[#64748b] mb-4">
                                                                      {tr.desc.en}
                                                                 </p>
                                                            </div>
                                                            <div className="pt-3 border-t border-[#1f2937] flex justify-between font-mono text-xs text-green-400">
                                                                 <span>
                                                                      {tr.lessons.length} Lessons
                                                                 </span>
                                                                 <span>Open Viewer →</span>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        </div>
                                   )}
                              </div>
                         )}

                         {/* =================================================================
                             10. SETTINGS PAGES (Saved Exclusively for the User's Account)
                         ================================================================= */}
                         {activePage === "set_general" && (
                              <div className=" bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                   <div className="font-mono text-[10px] uppercase text-[#f0a500] mb-1">
                                        Exclusive User Settings ({currentUser.sectorCode})
                                   </div>
                                   <h2 className="text-xl font-bold mb-4">⚙️ General Settings</h2>
                                   <div className="flex flex-col gap-4 text-xs">
                                        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                             <div>
                                                  <div className="font-bold text-slate-100">
                                                       Default AG-Grid Table Density
                                                  </div>
                                                  <div className="text-[#64748b]">
                                                       Saved exclusively for {currentUser.fullName}
                                                  </div>
                                             </div>
                                             <select
                                                  value={userSetting?.density || "comfortable"}
                                                  onChange={(e) =>
                                                       onUpdateUserSetting({
                                                            density: e.target.value,
                                                       })
                                                  }
                                                  className="bg-[#131920] border border-[#263244] rounded-lg px-3 py-1.5 text-slate-200">
                                                  <option value="comfortable">Comfortable</option>
                                                  <option value="compact">Compact</option>
                                             </select>
                                        </div>
                                   </div>
                              </div>
                         )}

                         {activePage === "set_account" && (
                              <div className=" bg-[#131920] border border-[#1f2937] rounded-2xl p-6">
                                   <h2 className="text-xl font-bold mb-1">
                                        👤 Account Information &amp; Profile Picture
                                   </h2>
                                   <p className="text-xs text-[#64748b] mb-5">
                                        Changes here update your profile picture in the Sidebar and Navbar immediately.
                                   </p>
                                   <div className="flex items-center gap-4 mb-5 p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                        <img
                                             src={currentUser.avatar}
                                             alt={currentUser.fullName}
                                             className="w-16 h-16 rounded-full object-cover border-2 border-[#f0a500]"
                                        />
                                        <div>
                                             <label className="font-mono text-xs text-[#f0a500] cursor-pointer block mb-2">
                                                  📷 Upload Custom Picture:
                                                  <input
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={handleAvatarUpload}
                                                       className="block mt-1 text-xs text-slate-300"
                                                  />
                                             </label>
                                             <div className="flex gap-2">
                                                  {Object.entries(AVATARS).map(([k, uri]) => (
                                                       <button
                                                            key={k}
                                                            type="button"
                                                            onClick={() =>
                                                                 onUpdateAccountProfile({
                                                                      avatar: uri,
                                                                 })
                                                            }
                                                            className="font-mono text-[10px] px-2 py-1 rounded bg-[#131920] border border-[#263244] text-slate-300 cursor-pointer">
                                                            Preset: {k}
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                   </div>

                                   <div className="flex flex-col gap-3">
                                        <input
                                             type="text"
                                             value={editFullName}
                                             onChange={(e) => setEditFullName(e.target.value)}
                                             placeholder="Full Name"
                                             className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
                                        />
                                        <input
                                             type="email"
                                             value={editEmail}
                                             onChange={(e) => setEditEmail(e.target.value)}
                                             placeholder="Email Address"
                                             className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
                                        />
                                        <input
                                             type="text"
                                             value={editBio}
                                             onChange={(e) => setEditBio(e.target.value)}
                                             placeholder="Short Bio / Specialty"
                                             className="bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-xs text-slate-100"
                                        />
                                        <button
                                             type="button"
                                             onClick={() => {
                                                  onUpdateAccountProfile({
                                                       fullName: editFullName,
                                                       email: editEmail,
                                                       bio: editBio,
                                                  });
                                                  setProfileSavedToast(true);
                                                  setTimeout(() => setProfileSavedToast(false), 2500);
                                             }}
                                             className="py-2.5 rounded-xl bg-[#f0a500] text-[#1a0e00] font-mono text-xs font-extrabold border-none cursor-pointer">
                                             ✓ Save Account Changes
                                        </button>
                                        {profileSavedToast && (
                                             <div className="font-mono text-xs text-green-400">
                                                  ✓ Account profile saved for {currentUser.sectorCode}!
                                             </div>
                                        )}
                                   </div>
                              </div>
                         )}

                         {activePage === "set_appearance" && (
                              <div className=" bg-[#131920] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-5">
                                   <div>
                                        <h2 className="text-xl font-bold">
                                             🎨 Appearance &amp; Theme Selection
                                        </h2>
                                        <p className="text-xs text-[#64748b]">
                                             Saved exclusively to {currentUser.fullName}'s account profile.
                                        </p>
                                   </div>

                                   {/* Dark & Light Mode */}
                                   <div className="flex items-center justify-between p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                        <div>
                                             <div className="text-sm font-bold text-slate-100">
                                                  Color Mode (Dark &amp; Light Mode)
                                             </div>
                                             <div className="text-xs text-[#64748b]">
                                                  Switch workspace surface illumination
                                             </div>
                                        </div>
                                        <div className="flex gap-2 font-mono text-xs">
                                             {["dark", "light"].map((m) => (
                                                  <button
                                                       key={m}
                                                       type="button"
                                                       onClick={() =>
                                                            onUpdateUserSetting({ themeMode: m })
                                                       }
                                                       className={`px-3.5 py-1.5 rounded-lg border cursor-pointer uppercase ${
                                                            (userSetting?.themeMode || "dark") === m
                                                                 ? "bg-[#f0a500] text-[#1a0e00] border-[#f0a500] font-bold"
                                                                 : "bg-[#131920] border-[#263244] text-slate-300"
                                                       }`}>
                                                       {m === "dark" ? "🌙 Dark" : "☀️ Light"}
                                                  </button>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Theme Selection */}
                                   <div className="p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                        <div className="text-sm font-bold text-slate-100 mb-3">
                                             Accent Theme Selection
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                             {Object.entries(THEME_PALETTES).map(([key, pal]) => (
                                                  <button
                                                       key={key}
                                                       type="button"
                                                       onClick={() =>
                                                            onUpdateUserSetting({ accentTheme: key })
                                                       }
                                                       className={`p-3 rounded-xl border text-left cursor-pointer flex items-center gap-3 ${
                                                            (userSetting?.accentTheme || "gold") ===
                                                            key
                                                                 ? "border-[#f0a500] bg-[#18202c]"
                                                                 : "border-[#1f2937] bg-[#131920]"
                                                       }`}>
                                                       <span
                                                            className="w-5 h-5 rounded-full shrink-0"
                                                            style={{ backgroundColor: pal.primary }}
                                                       />
                                                       <span className="text-xs font-bold text-slate-100">
                                                            {pal.name}
                                                       </span>
                                                  </button>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Additional Suggestions: Motion Smoothness & Glass Blur */}
                                   <div className="flex items-center justify-between p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                        <div>
                                             <div className="text-sm font-bold text-slate-100">
                                                  Motion.dev Smooth Transitions
                                             </div>
                                             <div className="text-xs text-[#64748b]">
                                                  Enable spring animations across cards and menus
                                             </div>
                                        </div>
                                        <input
                                             type="checkbox"
                                             checked={userSetting?.motionEnabled !== false}
                                             onChange={(e) =>
                                                  onUpdateUserSetting({
                                                       motionEnabled: e.target.checked,
                                                  })
                                             }
                                        />
                                   </div>
                              </div>
                         )}

                         {activePage === "set_notification" && (
                              <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-3">
                                   <h2 className="text-xl font-bold mb-2">🔔 Notification Preferences</h2>
                                   {[
                                        {
                                             key: "notifyDeadlines",
                                             label: "Calendar & Project Deadline Alerts",
                                        },
                                        {
                                             key: "notifyTeam",
                                             label: "Team Assignment & Status Changes",
                                        },
                                        {
                                             key: "notifyTrainee",
                                             label: "Trainee Orientation Completion Alerts",
                                        },
                                   ].map((item) => (
                                        <label
                                             key={item.key}
                                             className="flex items-center justify-between p-3.5 rounded-xl bg-[#0b0f14] border border-[#1f2937] text-xs cursor-pointer">
                                             <span>{item.label}</span>
                                             <input
                                                  type="checkbox"
                                                  checked={userSetting?.[item.key] !== false}
                                                  onChange={(e) =>
                                                       onUpdateUserSetting({
                                                            [item.key]: e.target.checked,
                                                       })
                                                  }
                                             />
                                        </label>
                                   ))}
                              </div>
                         )}

                         {activePage === "set_language" && (
                              <div className=" bg-[#131920] border border-[#1f2937] rounded-2xl p-6 flex flex-col gap-5">
                                   <div>
                                        <h2 className="text-xl font-bold">
                                             🌐 Language (English, Filipino &amp; Add Language)
                                        </h2>
                                        <p className="text-xs text-[#64748b]">
                                             Select your preferred language or register an additional language pack.
                                        </p>
                                   </div>

                                   <div className="flex flex-wrap gap-2.5">
                                        {(
                                             userSetting?.customLanguages || [
                                                  { code: "en", name: "English" },
                                                  { code: "tl", name: "Filipino" },
                                             ]
                                        ).map((l) => (
                                             <button
                                                  key={l.code}
                                                  type="button"
                                                  onClick={() =>
                                                       onUpdateUserSetting({ language: l.code })
                                                  }
                                                  className={`px-4 py-2.5 rounded-xl border font-mono text-xs cursor-pointer ${
                                                       (userSetting?.language || "en") === l.code
                                                            ? "bg-[#f0a500] text-[#1a0e00] border-[#f0a500] font-bold"
                                                            : "bg-[#0b0f14] border-[#263244] text-slate-200"
                                                  }`}>
                                                  {l.name} ({l.code.toUpperCase()})
                                             </button>
                                        ))}
                                   </div>

                                   <div className="p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                        <div className="text-xs font-bold mb-2">
                                             ➕ Add Language Pack
                                        </div>
                                        <div className="flex gap-2">
                                             <input
                                                  type="text"
                                                  placeholder="Code (e.g. es, ja)"
                                                  value={newLangCode}
                                                  onChange={(e) => setNewLangCode(e.target.value)}
                                                  className="w-28 bg-[#131920] border border-[#263244] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                                             />
                                             <input
                                                  type="text"
                                                  placeholder="Language Name (e.g. Español)"
                                                  value={newLangName}
                                                  onChange={(e) => setNewLangName(e.target.value)}
                                                  className="flex-1 bg-[#131920] border border-[#263244] rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                                             />
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       if (!newLangCode.trim() || !newLangName.trim())
                                                            return;
                                                       const list = userSetting?.customLanguages || [
                                                            { code: "en", name: "English" },
                                                            { code: "tl", name: "Filipino" },
                                                       ];
                                                       onUpdateUserSetting({
                                                            customLanguages: [
                                                                 ...list,
                                                                 {
                                                                      code: newLangCode
                                                                           .trim()
                                                                           .toLowerCase(),
                                                                      name: newLangName.trim(),
                                                                 },
                                                            ],
                                                            language: newLangCode
                                                                 .trim()
                                                                 .toLowerCase(),
                                                       });
                                                       setNewLangCode("");
                                                       setNewLangName("");
                                                  }}
                                                  className="px-4 py-1.5 rounded-lg bg-[#f0a500] text-[#1a0e00] font-mono text-xs font-bold border-none cursor-pointer">
                                                  + Add Language
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         )}

                         {activePage === "set_help" && (
                              <div className="bg-[#131920] border border-[#1f2937] rounded-2xl p-6 md:p-8">
                                   <div className="font-mono text-xs uppercase tracking-widest text-[#f0a500] mb-2">
                                        SFM → STF → NHS Institutional Guide
                                   </div>
                                   <h2 className="text-2xl font-extrabold mb-3">
                                        🏛️ What Is Network and Hardware Support (NHS) &amp; Why Was It Created?
                                   </h2>
                                   <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                        <strong>Network and Hardware Support (NHS)</strong> is the specialized technology arm within the <strong>Special Task Force (STF)</strong>, a student-led operational program launched by the <strong>School For Ministers (SFM)</strong>.
                                   </p>
                                   <p className="text-sm text-slate-300 leading-relaxed mb-6">
                                        <strong>Why NHS Was Created:</strong> NHS was established so ministerial students can build hands-on technical mastery—assembling and troubleshooting computers, deploying enterprise servers and Proxmox virtual machines, engineering congregation networks, and managing hardware assets—by building real operational projects that directly serve congregations worldwide.
                                   </p>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                                        <div className="p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                             <div className="text-[#f0a500] font-bold mb-1">1. SFM</div>
                                             <div className="text-[#94a3b8]">
                                                  School For Ministers — training and equipping ministers.
                                             </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                             <div className="text-sky-400 font-bold mb-1">2. STF</div>
                                             <div className="text-[#94a3b8]">
                                                  Special Task Force — student-led technical &amp; operational teams.
                                             </div>
                                        </div>
                                        <div className="p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                             <div className="text-green-400 font-bold mb-1">3. NHS</div>
                                             <div className="text-[#94a3b8]">
                                                  Network &amp; Hardware Support — 6 specialized groups (00–05).
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         )}

                         {activePage === "set_about" && (
                              <div className=" w-full bg-[#131920] border border-[#1f2937] rounded-2xl p-6 md:p-8">
                                   <div className="font-mono text-xs uppercase tracking-widest text-sky-400 mb-2">
                                        System Documentation &amp; Frequently Asked Questions
                                   </div>
                                   <h2 className="text-2xl font-extrabold mb-5">
                                        ❓ System FAQs (About STF-NHS Portal v3.0)
                                   </h2>
                                   <div className="flex flex-col gap-3">
                                        {FAQ_ITEMS.map((item, idx) => (
                                             <div
                                                  key={idx}
                                                  className="p-4 rounded-xl bg-[#0b0f14] border border-[#1f2937]">
                                                  <div className="text-sm font-bold text-[#f0a500] mb-1.5">
                                                       Q{idx + 1}: {item.q}
                                                  </div>
                                                  <div className="text-xs text-slate-300 leading-relaxed">
                                                       {item.a}
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              </div>
                         )}
                    </div>
               </div>

               {/* BOTTOM FOOTER: copyright STF-NHS */}
               <footer
                    className={`h-12 px-6 border-t flex items-center justify-between font-mono text-[11px] ${
                         isLight
                              ? "bg-white border-slate-200 text-slate-500"
                              : "bg-[#0d1218] border-[#1f2937] text-[#64748b]"
                    }`}>
                    <span>© Copyright 2026 | STF-NHS · Network and Hardware Support</span>
                    <span> version 1.0</span>
               </footer>
          </div>
     );
}
