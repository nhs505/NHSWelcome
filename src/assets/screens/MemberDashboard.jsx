/**
 * MemberDashboard.jsx (s-member-dash)
 * Direct landing screen when an existing NHS Member selects "I'm already in NHS".
 * Features:
 *   - Personal progress metrics & active cross-training status
 *   - Quick-jump to Intermediate & Advanced tracks (Proxmox VE, SQL, Docker, Mass Imaging)
 *   - Direct 6-Group Portal Switcher
 *   - Live Operational Bulletins from Sector 111 Admin
 */

import { useState } from "react";
import { BackBtn } from "../components/ui.jsx";

export default function MemberDashboard({
     t,
     lang,
     groups,
     itTracks,
     hwTracks,
     announcements,
     completedLessons,
     onNavigate,
     onOpenTrack,
     onOpenGroup,
}) {
     const [levelFilter, setLevelFilter] = useState("all");

     // Flatten all tracks across Group 00 (Hardware) & Group 05 (I.T. Infra)
     const allTracks = [
          ...Object.entries(itTracks).map(([id, tr]) => ({
               ...tr,
               id,
               parentScreen: "s-itinfra",
               groupLabel: "Group 05 · I.T. Infra",
          })),
          ...hwTracks.map((tr) => ({
               ...tr,
               parentScreen: "s-hardware",
               groupLabel: "Group 00 · Hardware",
          })),
     ];

     const totalLessons = allTracks.reduce((acc, tr) => acc + tr.lessons.length, 0);
     const completionPct =
          totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

     const filteredTracks = allTracks.filter((tr) =>
          levelFilter === "all" ? true : tr.level === levelFilter
     );

     return (
          <div className="max-w-5xl w-full mx-auto px-6 py-12 pb-20">
               <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <BackBtn onClick={() => onNavigate("s-welcome")}>
                         {lang === "tl" ? "← Bumalik sa Welcome" : "← Back to Welcome"}
                    </BackBtn>
                    <div className="flex gap-2">
                         <button
                              type="button"
                              onClick={() => onNavigate("s-nhs")}
                              className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-[#131920] border border-[#1c2530] text-[#64748b] hover:text-slate-200 cursor-pointer">
                              {lang === "tl" ? "Tingnan ang NHS Intro" : "Review NHS Intro"}
                         </button>
                         <button
                              type="button"
                              onClick={() => onNavigate("s-groups")}
                              className="font-mono text-xs px-3.5 py-1.5 rounded-lg bg-sky-500/15 border border-sky-400/30 text-sky-300 hover:bg-sky-500/25 cursor-pointer">
                              {lang === "tl" ? "Lahat ng 6 Pangkat →" : "All 6 Groups →"}
                         </button>
                    </div>
               </div>

               {/* Hero Header */}
               <div className="bg-gradient-to-br from-[#131920] to-[#0d131a] border border-sky-400/25 rounded-2xl p-7 mb-8">
                    <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-sky-400 mb-2">
                         NHS Member Cross-Training &amp; Operations Hub
                    </div>
                    <h1 className="text-[clamp(26px,4vw,42px)] font-extrabold tracking-tight mb-2">
                         {lang === "tl"
                              ? "Maligayang Pagbabalik, Miyembro ng NHS."
                              : "Welcome Back, NHS Member."}
                    </h1>
                    <p className="text-sm md:text-base text-[#64748b] max-w-2xl leading-relaxed mb-6">
                         {lang === "tl"
                              ? "Direkta kang nakarating sa Member Dashboard. Pumili ng alinman sa 6 na pangkat para sa cross-training, o ipagpatuloy ang iyong Proxmox VE, Linux, at SQL Database tracks."
                              : "You landed directly on the Member Dashboard. Jump straight into any of the 6 NHS groups, cross-train in intermediate/advanced tracks, or launch the In-App Lesson Viewer."}
                    </p>

                    {/* Metrics Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                         <div className="bg-[#08090c]/70 border border-[#1c2530] rounded-xl p-4">
                              <div className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">
                                   {lang === "tl" ? "Mga Tapos na Aralin" : "Lessons Completed"}
                              </div>
                              <div className="text-2xl font-extrabold text-green-400 mt-1">
                                   {completedLessons.length} / {totalLessons}
                              </div>
                         </div>
                         <div className="bg-[#08090c]/70 border border-[#1c2530] rounded-xl p-4">
                              <div className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">
                                   {lang === "tl" ? "Progreso sa SQL" : "SQL Progress Sync"}
                              </div>
                              <div className="text-2xl font-extrabold text-sky-400 mt-1">
                                   {completionPct}%
                              </div>
                         </div>
                         <div className="bg-[#08090c]/70 border border-[#1c2530] rounded-xl p-4">
                              <div className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">
                                   {lang === "tl" ? "Kabuuang Pangkat" : "Total NHS Groups"}
                              </div>
                              <div className="text-2xl font-extrabold text-[#f0a500] mt-1">
                                   6 Groups
                              </div>
                         </div>
                         <div className="bg-[#08090c]/70 border border-[#1c2530] rounded-xl p-4">
                              <div className="font-mono text-[10px] uppercase tracking-wider text-[#64748b]">
                                   {lang === "tl" ? "Bukas na Portals" : "Active Portals"}
                              </div>
                              <div className="text-2xl font-extrabold text-slate-200 mt-1">
                                   {groups.filter((g) => g.status === "open").length} Open
                              </div>
                         </div>
                    </div>
               </div>

               {/* Operational Announcements (Managed by Admin) */}
               {announcements && announcements.length > 0 && (
                    <div className="mb-10">
                         <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#f0a500] mb-3">
                              {lang === "tl" ? "Mga Operasyonal na Bulletin" : "Operational Bulletins"}
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              {announcements.map((a) => (
                                   <div
                                        key={a.id}
                                        className="bg-[#131920] border border-[#1c2530] rounded-xl p-5">
                                        <div className="flex items-center justify-between gap-2 mb-2">
                                             <span className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-0.5 rounded bg-[#f0a500]/15 text-[#f0a500] border border-[#f0a500]/30">
                                                  {a.badge}
                                             </span>
                                             <span className="font-mono text-[10px] text-[#64748b]">
                                                  {a.date}
                                             </span>
                                        </div>
                                        <div className="text-sm font-bold text-slate-100 mb-1">
                                             {t(a.title)}
                                        </div>
                                        <div className="text-xs text-[#64748b] leading-relaxed">
                                             {t(a.body)}
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               )}

               {/* Quick-Jump Across All 6 NHS Groups */}
               <div className="mb-10">
                    <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-sky-400 mb-2">
                         {lang === "tl"
                              ? "Direktang Paglipat sa 6 na Pangkat"
                              : "Quick-Jump: All 6 NHS Groups (00–05)"}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                         {groups.map((g) => (
                              <button
                                   key={g.slug}
                                   type="button"
                                   onClick={() => onOpenGroup(g)}
                                   className="bg-[#131920] border border-[#1c2530] hover:border-sky-400/40 rounded-xl p-4 text-left cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col">
                                   <div className="flex items-center justify-between mb-2">
                                        <span className="text-2xl">{g.icon}</span>
                                        <span
                                             className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded ${
                                                  g.status === "open"
                                                       ? "bg-green-400/15 text-green-400"
                                                       : "bg-amber-400/10 text-amber-400"
                                             }`}>
                                             {g.status}
                                        </span>
                                   </div>
                                   <div className="font-mono text-[10px] text-[#64748b]">
                                        Group {g.code}
                                   </div>
                                   <div className="text-xs font-bold text-slate-200 mt-0.5 line-clamp-1">
                                        {t(g.title)}
                                   </div>
                              </button>
                         ))}
                    </div>
               </div>

               {/* Cross-Training Track Explorer with Difficulty Filter */}
               <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <div>
                         <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#f0a500] mb-1">
                              {lang === "tl" ? "Cross-Training Catalog" : "Cross-Training Track Catalog"}
                         </div>
                         <h2 className="text-xl font-bold">
                              {lang === "tl"
                                   ? "Pumili ng Track na Ipagpapatuloy"
                                   : "Select a Track to Launch in the Lesson Viewer"}
                         </h2>
                    </div>

                    <div className="flex gap-1.5 font-mono text-[11px]">
                         {[
                              { id: "all", label: "All Tracks" },
                              { id: "beginner", label: "Beginner" },
                              { id: "intermediate", label: "Intermediate" },
                              { id: "advanced", label: "Advanced" },
                         ].map((f) => (
                              <button
                                   key={f.id}
                                   type="button"
                                   onClick={() => setLevelFilter(f.id)}
                                   className={`px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                                        levelFilter === f.id
                                             ? "bg-[#f0a500]/15 border-[#f0a500]/40 text-[#f0a500]"
                                             : "bg-[#131920] border-[#1c2530] text-[#64748b] hover:text-slate-200"
                                   }`}>
                                   {f.label}
                              </button>
                         ))}
                    </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTracks.map((tr) => {
                         const doneInTrack = tr.lessons.filter((l) =>
                              completedLessons.includes(l.id)
                         ).length;
                         return (
                              <div
                                   key={`${tr.parentScreen}-${tr.id}`}
                                   onClick={() => onOpenTrack(tr.id, tr.parentScreen)}
                                   className="bg-[#131920] border border-[#1c2530] hover:border-sky-400/40 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col">
                                   <div className="flex items-center justify-between mb-2.5">
                                        <span className="text-2xl">{tr.icon}</span>
                                        <span className="font-mono text-[9.5px] text-[#64748b] uppercase">
                                             {tr.groupLabel}
                                        </span>
                                   </div>
                                   <div className="text-[15px] font-bold text-slate-100 mb-1">
                                        {t(tr.title)}
                                   </div>
                                   <div className="text-xs text-[#64748b] leading-relaxed flex-1 mb-4">
                                        {t(tr.desc)}
                                   </div>
                                   <div className="flex items-center justify-between pt-3 border-t border-[#1c2530] font-mono text-[10.5px]">
                                        <span className="text-green-400">
                                             ✓ {doneInTrack}/{tr.lessons.length}{" "}
                                             {lang === "tl" ? "tapos" : "done"}
                                        </span>
                                        <span className="text-sky-400 font-semibold">
                                             {lang === "tl" ? "Buksan →" : "Open Track →"}
                                        </span>
                                   </div>
                              </div>
                         );
                    })}
               </div>
          </div>
     );
}
