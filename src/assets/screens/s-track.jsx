/**
 * s-track.jsx — Track Detail Screen
 * Launches lessons inside the In-App Lesson Viewer (LessonViewer.jsx).
 */

import { C } from "../components/content.js";
import { BackBtn, ProceedBtn } from "../components/ui.jsx";

export default function TrackDetailScreen({
     t,
     activeTrack,
     trackParent,
     itTracks,
     hwTracks,
     completedLessons,
     onNavigate,
     onLaunchLesson,
}) {
     const isHw = trackParent === "s-hardware";
     const d = isHw
          ? hwTracks.find((x) => x.id === activeTrack)
          : itTracks[activeTrack];

     if (!d) return null;

     const avail = d.lessons.filter((l) => l.available);

     return (
          <div className="max-w-4xl w-full mx-auto px-6 py-12 pb-20">
               <BackBtn
                    onClick={() =>
                         onNavigate(isHw ? "s-hardware" : "s-itinfra")
                    }>
                    {isHw ? t(C.td.backHw) : t(C.td.back)}
               </BackBtn>

               <div className="mb-8">
                    <div className="flex items-start gap-4 mb-4">
                         <div
                              className="w-14 h-14 rounded-[13px] flex items-center justify-center text-[27px] shrink-0"
                              style={{
                                   background: `${d.color}15`,
                                   border: `1px solid ${d.color}40`,
                              }}>
                              {d.icon}
                         </div>
                         <div>
                              <div className="font-mono text-[10.5px] tracking-[0.18em] text-[#64748b] uppercase mb-1">
                                   {isHw ? t(C.td.eyebrowHw) : t(C.td.eyebrow)}
                              </div>
                              <div className="text-[clamp(21px,4vw,40px)] font-extrabold leading-[1.1] tracking-[-0.02em]">
                                   {t(d.title)}
                              </div>
                         </div>
                    </div>
                    <p className="text-[clamp(14px,1.7vw,16.5px)] text-[#64748b] leading-[1.75] max-w-[65ch] mb-4">
                         {t(d.desc)}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                         <span
                              className={`font-mono text-[10.5px] border rounded-[20px] px-3 py-1 ${
                                   d.level === "beginner"
                                        ? "text-green-400 border-[rgba(74,222,128,0.3)]"
                                        : d.level === "intermediate"
                                        ? "text-amber-400 border-[rgba(245,158,11,0.3)]"
                                        : "text-red-400 border-[rgba(248,113,113,0.3)]"
                              }`}>
                              {t(d.levelLabel)}
                         </span>
                         <span className="font-mono text-[10.5px] border border-[#1c2530] rounded-[20px] px-3 py-1 text-[#64748b]">
                              {d.lessons.length} {t(C.td.lessons)}
                         </span>
                         <span className="font-mono text-[10.5px] border border-[rgba(74,222,128,0.3)] rounded-[20px] px-3 py-1 text-green-400">
                              {avail.length} {t(C.td.availNow)}
                         </span>
                    </div>
               </div>

               {/* Analogy Box */}
               <div
                    className="bg-[#131920] border border-[#1c2530] border-l-[3px] rounded-r-xl p-5 mb-8"
                    style={{ borderLeftColor: d.color }}>
                    <div
                         className="font-mono text-[10px] tracking-[0.15em] uppercase mb-2"
                         style={{ color: d.color }}>
                         {t(C.td.abLabel)}
                    </div>
                    <div className="text-[15px] text-slate-200 leading-[1.75]">
                         {t(d.analogy)}
                    </div>
               </div>

               <div className="font-mono text-[10.5px] tracking-[0.18em] text-[#64748b] uppercase mb-3">
                    {t(C.td.llLabel)} · {d.lessons.length} {t(C.td.lessons)}
               </div>

               <div className="flex flex-col gap-2 mb-8">
                    {d.lessons.map((l, idx) => {
                         const isDone = completedLessons.includes(l.id);
                         return (
                              <div
                                   key={l.id || l.n}
                                   onClick={() => {
                                        if (l.available) onLaunchLesson(idx);
                                   }}
                                   className={`flex items-start gap-3 bg-[#131920] border rounded-xl p-4 transition-colors ${
                                        l.available
                                             ? "border-[#1c2530] cursor-pointer hover:border-[#f0a500]/50 hover:bg-[#181f28]"
                                             : "border-[#1c2530] opacity-60 cursor-not-allowed"
                                   }`}>
                                   <span className="font-mono text-[11px] text-[#64748b] w-6 text-right shrink-0 pt-0.5">
                                        {String(l.n).padStart(2, "0")}
                                   </span>
                                   <span
                                        className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                                             isDone
                                                  ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]"
                                                  : l.available
                                                  ? "bg-[#f0a500]"
                                                  : "bg-[#2d3a47]"
                                        }`}
                                   />
                                   <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-slate-100 mb-0.5">
                                             {t(l.title)}
                                        </div>
                                        <div className="text-xs text-[#64748b]">
                                             {t(l.desc)}
                                        </div>
                                   </div>
                                   <span
                                        className={`font-mono text-[10px] whitespace-nowrap pt-0.5 shrink-0 ${
                                             isDone
                                                  ? "text-green-400 font-bold"
                                                  : l.available
                                                  ? "text-[#f0a500]"
                                                  : "text-[#64748b]"
                                        }`}>
                                        {isDone
                                             ? t(C.td.done)
                                             : l.available
                                             ? `${t(C.td.avail)} →`
                                             : t(C.td.soon)}
                                   </span>
                              </div>
                         );
                    })}
               </div>

               {avail.length > 0 ? (
                    <div className="flex items-center gap-4 flex-wrap">
                         <ProceedBtn onClick={() => onLaunchLesson(0)}>
                              {activeTrack === "proxmox"
                                   ? t(C.td.openBtn)
                                   : t(C.td.startBtn)}{" "}
                              <span>→</span>
                         </ProceedBtn>
                         <span className="font-mono text-[11px] text-[#64748b]">
                              {t(C.td.opensIn)}
                         </span>
                    </div>
               ) : (
                    <div className="bg-[#131920] border border-[#1c2530] rounded-lg p-4 font-mono text-xs text-[#64748b]">
                         {t(C.td.buildNote)}
                    </div>
               )}
          </div>
     );
}
