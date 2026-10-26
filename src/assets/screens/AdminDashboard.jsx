/**
 * AdminDashboard.jsx (s-admin)
 * Full System Control Console for Sector 111.
 * Controls:
 *   1. All 6 NHS Groups (Toggle OPEN / STANDBY, adjust buildProgress %, edit descriptions)
 *   2. Learning Tracks & Lessons (Toggle lesson availability, add new bilingual lessons)
 *   3. Users & Role Registry (Add/promote Recruits, Members, Admins)
 *   4. Operational Announcements (Publish/remove bulletins)
 *   5. SQL Database Console (Live SQL schema & state dump viewer + .sql file download)
 */

import { useState } from "react";
import { BackBtn } from "../components/ui.jsx";
import { generateLiveSqlDump } from "../components/dbService.js";

export default function AdminDashboard({
     t,
     dbState,
     onToggleGroupStatus,
     onUpdateGroupProgress,
     onToggleLessonAvailable,
     onAddLesson,
     onAddUser,
     onUpdateUserRole,
     onAddAnnouncement,
     onDeleteAnnouncement,
     onResetDatabase,
     onNavigate,
}) {
     const [activeTab, setActiveTab] = useState("groups");
     const [selectedTrackKey, setSelectedTrackKey] = useState("proxmox");
     const [newLessonTitleEn, setNewLessonTitleEn] = useState("");
     const [newLessonTitleTl, setNewLessonTitleTl] = useState("");
     const [newLessonDescEn, setNewLessonDescEn] = useState("");
     const [newLessonCli, setNewLessonCli] = useState("");

     const [newUserSector, setNewUserSector] = useState("");
     const [newUserName, setNewUserName] = useState("");
     const [newUserRole, setNewUserRole] = useState("recruit");
     const [newUserGroup, setNewUserGroup] = useState("00");

     const [annBadge, setAnnBadge] = useState("OPS BULLETIN");
     const [annTitleEn, setAnnTitleEn] = useState("");
     const [annBodyEn, setAnnBodyEn] = useState("");

     const sqlDump = generateLiveSqlDump(dbState);

     const handleDownloadSql = () => {
          const blob = new Blob([sqlDump], { type: "application/sql;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "nhs_orientation_live_dump.sql";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
     };

     return (
          <div className="max-w-6xl w-full mx-auto px-6 py-10 pb-20">
               <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <BackBtn onClick={() => onNavigate("s-welcome")}>
                         ← Back to Welcome
                    </BackBtn>
                    <div className="flex items-center gap-2">
                         <button
                              type="button"
                              onClick={handleDownloadSql}
                              className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-green-400/15 border border-green-400/40 text-green-300 cursor-pointer hover:bg-green-400/25">
                              ⬇ Export Live .SQL Dump
                         </button>
                         <button
                              type="button"
                              onClick={onResetDatabase}
                              className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-red-400/10 border border-red-400/30 text-red-300 cursor-pointer hover:bg-red-400/20">
                              ↺ Reset Default Seed
                         </button>
                    </div>
               </div>

               {/* Admin Header Banner */}
               <div className="bg-gradient-to-br from-[#161215] to-[#0f1319] border border-red-400/30 rounded-2xl p-6 md:p-7 mb-8">
                    <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-red-400 mb-1.5">
                         🛡️ Sector 111 · System Administrator Control Center
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-slate-100 mb-2">
                         NHS Full System &amp; SQL Database Control
                    </h1>
                    <p className="text-sm text-[#64748b] max-w-3xl">
                         Manage all 6 NHS groups (toggle Open/Standby status and build progress), unlock or author new bilingual lessons, promote recruits to members, publish announcements, and inspect or export your relational SQL database.
                    </p>
               </div>

               {/* Admin Navigation Tabs */}
               <div className="flex flex-wrap gap-2 mb-7 font-mono text-xs">
                    {[
                         { id: "groups", label: "1. 6 Groups Control (00–05)" },
                         { id: "curriculum", label: "2. Tracks & Lesson Editor" },
                         { id: "users", label: "3. Users & Roles Registry" },
                         { id: "announcements", label: "4. Announcements" },
                         { id: "sql", label: "5. SQL Database & Audit Log" },
                    ].map((tab) => (
                         <button
                              key={tab.id}
                              type="button"
                              onClick={() => setActiveTab(tab.id)}
                              className={`px-4 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                                   activeTab === tab.id
                                        ? "bg-[#f0a500]/15 border-[#f0a500]/50 text-[#f0a500] font-semibold"
                                        : "bg-[#131920] border-[#1c2530] text-[#64748b] hover:text-slate-200"
                              }`}>
                              {tab.label}
                         </button>
                    ))}
               </div>

               {/* TAB 1: 6 Groups Control */}
               {activeTab === "groups" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {dbState.groups.map((g) => (
                              <div
                                   key={g.slug}
                                   className="bg-[#131920] border border-[#1c2530] rounded-xl p-5 flex flex-col justify-between">
                                   <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                             <div className="flex items-center gap-2.5">
                                                  <span className="text-2xl">{g.icon}</span>
                                                  <div>
                                                       <div className="font-mono text-[10px] text-[#64748b] uppercase">
                                                            Group {g.code} · {g.slug}
                                                       </div>
                                                       <div className="text-base font-bold text-slate-100">
                                                            {t(g.title)}
                                                       </div>
                                                  </div>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={() => onToggleGroupStatus(g.slug)}
                                                  className={`font-mono text-[11px] font-bold px-3.5 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                                                       g.status === "open"
                                                            ? "bg-green-400/15 border-green-400/40 text-green-400"
                                                            : "bg-amber-400/15 border-amber-400/40 text-amber-400"
                                                  }`}>
                                                  {g.status === "open" ? "STATUS: OPEN" : "STATUS: STANDBY"}
                                             </button>
                                        </div>
                                        <p className="text-xs text-[#64748b] mb-4">{t(g.desc)}</p>
                                   </div>

                                   <div className="pt-3 border-t border-[#1c2530]">
                                        <div className="flex items-center justify-between font-mono text-[11px] text-[#64748b] mb-1.5">
                                             <span>Portal Build Progress</span>
                                             <span className="text-[#f0a500]">{g.buildProgress}%</span>
                                        </div>
                                        <input
                                             type="range"
                                             min="0"
                                             max="100"
                                             step="5"
                                             value={g.buildProgress}
                                             onChange={(e) =>
                                                  onUpdateGroupProgress(g.slug, Number(e.target.value))
                                             }
                                             className="w-full accent-[#f0a500] cursor-pointer"
                                        />
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* TAB 2: Curriculum & Lessons Editor */}
               {activeTab === "curriculum" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                         <div className="lg:col-span-7 bg-[#131920] border border-[#1c2530] rounded-2xl p-5">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                                   <h3 className="text-base font-bold">
                                        Manage Track Lessons (Toggle Availability)
                                   </h3>
                                   <select
                                        value={selectedTrackKey}
                                        onChange={(e) => setSelectedTrackKey(e.target.value)}
                                        className="bg-[#0d1218] border border-[#2a3a4d] rounded-lg px-3 py-1.5 font-mono text-xs text-slate-200">
                                        {Object.entries(dbState.itTracks).map(([k, tr]) => (
                                             <option key={k} value={k}>
                                                  I.T. Infra · {tr.title.en}
                                             </option>
                                        ))}
                                   </select>
                              </div>

                              <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
                                   {(dbState.itTracks[selectedTrackKey]?.lessons || []).map((l) => (
                                        <div
                                             key={l.id}
                                             className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0d1218] border border-[#1c2530]">
                                             <div>
                                                  <div className="text-xs font-bold text-slate-200">
                                                       #{String(l.n).padStart(2, "0")} · {l.title.en}
                                                  </div>
                                                  <div className="text-[11px] text-[#64748b]">
                                                       {l.desc.en}
                                                  </div>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={() =>
                                                       onToggleLessonAvailable(selectedTrackKey, l.id)
                                                  }
                                                  className={`font-mono text-[10.5px] px-3 py-1 rounded border cursor-pointer shrink-0 ${
                                                       l.available
                                                            ? "bg-green-400/15 border-green-400/40 text-green-400"
                                                            : "bg-[#131920] border-[#2a3a4d] text-[#64748b]"
                                                  }`}>
                                                  {l.available ? "Available" : "Locked"}
                                             </button>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         <div className="lg:col-span-5 bg-[#131920] border border-[#1c2530] rounded-2xl p-5 h-fit">
                              <h3 className="text-base font-bold mb-1">
                                   Add New Lesson to {dbState.itTracks[selectedTrackKey]?.title.en}
                              </h3>
                              <p className="text-xs text-[#64748b] mb-4">
                                   Appends a new bilingual module directly to the In-App Lesson Viewer and SQL state.
                              </p>
                              <div className="flex flex-col gap-3">
                                   <input
                                        type="text"
                                        placeholder="Lesson Title (English)"
                                        value={newLessonTitleEn}
                                        onChange={(e) => setNewLessonTitleEn(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 text-xs text-slate-200"
                                   />
                                   <input
                                        type="text"
                                        placeholder="Lesson Title (Tagalog - optional)"
                                        value={newLessonTitleTl}
                                        onChange={(e) => setNewLessonTitleTl(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 text-xs text-slate-200"
                                   />
                                   <input
                                        type="text"
                                        placeholder="Short Summary Description"
                                        value={newLessonDescEn}
                                        onChange={(e) => setNewLessonDescEn(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 text-xs text-slate-200"
                                   />
                                   <textarea
                                        rows={3}
                                        placeholder="Terminal / SQL Command Snippet (optional)"
                                        value={newLessonCli}
                                        onChange={(e) => setNewLessonCli(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 font-mono text-xs text-green-300"
                                   />
                                   <button
                                        type="button"
                                        onClick={() => {
                                             if (!newLessonTitleEn.trim()) return;
                                             onAddLesson(selectedTrackKey, {
                                                  titleEn: newLessonTitleEn.trim(),
                                                  titleTl:
                                                       newLessonTitleTl.trim() ||
                                                       newLessonTitleEn.trim(),
                                                  descEn:
                                                       newLessonDescEn.trim() ||
                                                       "Custom module added by Sector 111 Admin.",
                                                  cli: newLessonCli.trim() || null,
                                             });
                                             setNewLessonTitleEn("");
                                             setNewLessonTitleTl("");
                                             setNewLessonDescEn("");
                                             setNewLessonCli("");
                                        }}
                                        className="font-mono text-xs font-bold py-2.5 rounded-lg bg-[#f0a500] text-[#1a0e00] border-none cursor-pointer hover:opacity-90">
                                        + Insert Lesson into SQL Track
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {/* TAB 3: Users & Role Registry */}
               {activeTab === "users" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                         <div className="lg:col-span-8 bg-[#131920] border border-[#1c2530] rounded-2xl p-5">
                              <h3 className="text-base font-bold mb-4">
                                   NHS Users &amp; Role Registry (`users` SQL Table)
                              </h3>
                              <div className="flex flex-col gap-2.5">
                                   {dbState.users.map((u) => (
                                        <div
                                             key={u.id}
                                             className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0d1218] border border-[#1c2530]">
                                             <div>
                                                  <div className="font-mono text-xs font-bold text-[#f0a500]">
                                                       {u.sectorCode} ·{" "}
                                                       <span className="text-slate-100">{u.fullName}</span>
                                                  </div>
                                                  <div className="font-mono text-[11px] text-[#64748b]">
                                                       {u.email} · Group {u.primaryGroup}
                                                  </div>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                  {["recruit", "member", "admin"].map((r) => (
                                                       <button
                                                            key={r}
                                                            type="button"
                                                            onClick={() => onUpdateUserRole(u.id, r)}
                                                            className={`font-mono text-[10px] uppercase px-2.5 py-1 rounded border cursor-pointer ${
                                                                 u.role === r
                                                                      ? "bg-sky-500/20 border-sky-400 text-sky-300 font-bold"
                                                                      : "bg-[#131920] border-[#1c2530] text-[#64748b]"
                                                            }`}>
                                                            {r}
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         <div className="lg:col-span-4 bg-[#131920] border border-[#1c2530] rounded-2xl p-5 h-fit">
                              <h3 className="text-base font-bold mb-1">Register New NHS User</h3>
                              <p className="text-xs text-[#64748b] mb-4">
                                   Inserts a new Recruit, Member, or Admin record into the SQL registry.
                              </p>
                              <div className="flex flex-col gap-3">
                                   <input
                                        type="text"
                                        placeholder="Sector / ID Code (e.g. REC-2026-09)"
                                        value={newUserSector}
                                        onChange={(e) => setNewUserSector(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 font-mono text-xs text-slate-200"
                                   />
                                   <input
                                        type="text"
                                        placeholder="Full Name"
                                        value={newUserName}
                                        onChange={(e) => setNewUserName(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 text-xs text-slate-200"
                                   />
                                   <select
                                        value={newUserRole}
                                        onChange={(e) => setNewUserRole(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 font-mono text-xs text-slate-200">
                                        <option value="recruit">Role: Recruit</option>
                                        <option value="member">Role: Member</option>
                                        <option value="admin">Role: Admin</option>
                                   </select>
                                   <select
                                        value={newUserGroup}
                                        onChange={(e) => setNewUserGroup(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 font-mono text-xs text-slate-200">
                                        {dbState.groups.map((g) => (
                                             <option key={g.code} value={g.code}>
                                                  Group {g.code} · {g.title.en}
                                             </option>
                                        ))}
                                   </select>
                                   <button
                                        type="button"
                                        onClick={() => {
                                             if (!newUserSector.trim() || !newUserName.trim()) return;
                                             onAddUser({
                                                  sectorCode: newUserSector.trim().toUpperCase(),
                                                  fullName: newUserName.trim(),
                                                  role: newUserRole,
                                                  primaryGroup: newUserGroup,
                                             });
                                             setNewUserSector("");
                                             setNewUserName("");
                                        }}
                                        className="font-mono text-xs font-bold py-2.5 rounded-lg bg-[#f0a500] text-[#1a0e00] border-none cursor-pointer">
                                        + Add User to Registry
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {/* TAB 4: Announcements */}
               {activeTab === "announcements" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                         <div className="lg:col-span-7 bg-[#131920] border border-[#1c2530] rounded-2xl p-5">
                              <h3 className="text-base font-bold mb-4">
                                   Active Member Dashboard Bulletins
                              </h3>
                              <div className="flex flex-col gap-3">
                                   {dbState.announcements.map((a) => (
                                        <div
                                             key={a.id}
                                             className="p-4 rounded-xl bg-[#0d1218] border border-[#1c2530] flex items-start justify-between gap-4">
                                             <div>
                                                  <span className="font-mono text-[10px] text-[#f0a500] uppercase">
                                                       [{a.badge}] · {a.date}
                                                  </span>
                                                  <div className="text-sm font-bold text-slate-100 mt-1">
                                                       {a.title.en}
                                                  </div>
                                                  <div className="text-xs text-[#64748b] mt-1">
                                                       {a.body.en}
                                                  </div>
                                             </div>
                                             <button
                                                  type="button"
                                                  onClick={() => onDeleteAnnouncement(a.id)}
                                                  className="font-mono text-xs text-red-400 bg-transparent border border-red-400/30 rounded px-2.5 py-1 cursor-pointer">
                                                  Delete
                                             </button>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         <div className="lg:col-span-5 bg-[#131920] border border-[#1c2530] rounded-2xl p-5 h-fit">
                              <h3 className="text-base font-bold mb-3">
                                   Publish Operational Bulletin
                              </h3>
                              <div className="flex flex-col gap-3">
                                   <input
                                        type="text"
                                        placeholder="Badge (e.g. OPS BULLETIN)"
                                        value={annBadge}
                                        onChange={(e) => setAnnBadge(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 font-mono text-xs text-slate-200"
                                   />
                                   <input
                                        type="text"
                                        placeholder="Headline"
                                        value={annTitleEn}
                                        onChange={(e) => setAnnTitleEn(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 text-xs text-slate-200"
                                   />
                                   <textarea
                                        rows={3}
                                        placeholder="Announcement message body..."
                                        value={annBodyEn}
                                        onChange={(e) => setAnnBodyEn(e.target.value)}
                                        className="bg-[#0d1218] border border-[#1c2530] rounded-lg px-3 py-2 text-xs text-slate-200"
                                   />
                                   <button
                                        type="button"
                                        onClick={() => {
                                             if (!annTitleEn.trim() || !annBodyEn.trim()) return;
                                             onAddAnnouncement({
                                                  badge: annBadge.trim() || "BULLETIN",
                                                  titleEn: annTitleEn.trim(),
                                                  bodyEn: annBodyEn.trim(),
                                             });
                                             setAnnTitleEn("");
                                             setAnnBodyEn("");
                                        }}
                                        className="font-mono text-xs font-bold py-2.5 rounded-lg bg-[#f0a500] text-[#1a0e00] border-none cursor-pointer">
                                        + Post Bulletin to Member Dashboard
                                   </button>
                              </div>
                         </div>
                    </div>
               )}

               {/* TAB 5: Live SQL Dump & Audit Log */}
               {activeTab === "sql" && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                         <div className="lg:col-span-7 bg-[#131920] border border-[#1c2530] rounded-2xl p-5">
                              <div className="flex items-center justify-between mb-3">
                                   <h3 className="text-base font-bold">
                                        Live Relational SQL Dump Preview (`schema.sql` + `seed.sql`)
                                   </h3>
                                   <button
                                        type="button"
                                        onClick={handleDownloadSql}
                                        className="font-mono text-xs text-green-400 bg-green-400/10 border border-green-400/30 px-3 py-1 rounded cursor-pointer">
                                        ⬇ Download .sql
                                   </button>
                              </div>
                              <pre className="bg-[#070a0e] border border-[#1c2530] rounded-xl p-4 font-mono text-[11px] text-green-300 overflow-x-auto max-h-[420px] leading-relaxed">
                                   <code>{sqlDump}</code>
                              </pre>
                         </div>

                         <div className="lg:col-span-5 bg-[#131920] border border-[#1c2530] rounded-2xl p-5 h-fit">
                              <h3 className="text-base font-bold mb-3">
                                   Admin Audit Log (`audit_logs` Table)
                              </h3>
                              <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto">
                                   {(dbState.auditLogs || []).map((log) => (
                                        <div
                                             key={log.id}
                                             className="p-3 rounded-lg bg-[#0d1218] border border-[#1c2530] font-mono text-[11px]">
                                             <div className="flex items-center justify-between text-[#f0a500]">
                                                  <span>{log.action}</span>
                                                  <span className="text-[#64748b]">{log.time}</span>
                                             </div>
                                             <div className="text-slate-300 mt-1 font-sans text-xs">
                                                  {log.detail}
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
