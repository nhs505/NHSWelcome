/**
 * s-soon.jsx — Standby / Coming Soon Group Screen with Live Build Progress & Prerequisite Jump
 */

import { C, soonData } from "../components/content.js";
import { BackBtn, ProceedBtn } from "../components/ui.jsx";

export default function ComingSoonScreen({
     t,
     activeSoonGroup,
     groups,
     onNavigate,
     onOpenTrack,
}) {
     const data = activeSoonGroup ? soonData[activeSoonGroup] : null;
     const groupObj = groups.find((g) => g.slug === activeSoonGroup);
     if (!data) return null;

     const progress = groupObj ? groupObj.buildProgress : 35;

     return (
          <div className="max-w-2xl w-full mx-auto px-6 py-12 pb-20">
               <BackBtn onClick={() => onNavigate("s-groups")}>
                    {t(C.soon.backBtn)}
               </BackBtn>

               <div className="text-[52px] mb-4">{data.icon}</div>
               <div className="font-mono text-[11px] tracking-[0.2em] text-[#f0a500] uppercase mb-2">
                    {t(C.soon.tag)}
               </div>
               <h2 className="text-[30px] font-extrabold mb-2.5">{t(data.title)}</h2>
               <p className="text-[14.5px] text-[#64748b] leading-relaxed mb-7">
                    {t(C.soon.lead)}
               </p>

               {/* Dynamic Progress Bar (Controlled by Admin in SQL state) */}
               <div className="bg-[#131920] border border-[#1c2530] rounded-[12px] p-4 mb-7">
                    <div className="flex items-center justify-between font-mono text-[10.5px] text-[#64748b] mb-2 tracking-widest">
                         <span>{t(C.soon.barLabel)}</span>
                         <span className="text-[#f0a500]">{progress}%</span>
                    </div>
                    <div className="bg-[#1c2530] rounded h-2 overflow-hidden">
                         <div
                              className="h-full bg-gradient-to-r from-[#f0a500] to-[#ffc040] rounded transition-all"
                              style={{ width: `${progress}%` }}
                         />
                    </div>
               </div>

               <div className="font-mono text-[11px] tracking-[0.2em] text-[#64748b] uppercase mb-2.5">
                    {t(C.soon.featLabel)}
               </div>
               <div className="flex flex-col gap-2 mb-7">
                    {(t(data.features) || data.features.en).map((f, i) => (
                         <div
                              key={i}
                              className="flex items-center gap-2.5 text-[13.5px] text-slate-300 p-3 bg-[#131920] border border-[#1c2530] rounded-lg">
                              <span>⚙️</span>
                              {f}
                         </div>
                    ))}
               </div>

               {/* Prerequisite Track Jump so users never hit a dead end */}
               {data.prereqTrack && (
                    <div className="bg-[#131920] border border-sky-400/30 rounded-xl p-5 mb-7">
                         <div className="font-mono text-[10px] tracking-widest uppercase text-sky-400 mb-1">
                              {t(C.soon.prereqLabel)}
                         </div>
                         <div className="text-sm font-bold text-slate-100 mb-3">
                              {data.prereqTrack.label}
                         </div>
                         <button
                              type="button"
                              onClick={() =>
                                   onOpenTrack(data.prereqTrack.trackId, data.prereqTrack.parent)
                              }
                              className="font-mono text-xs font-semibold px-4 py-2 rounded-lg bg-sky-500/15 border border-sky-400/40 text-sky-300 cursor-pointer hover:bg-sky-500/25">
                              Start Prerequisite Track Now →
                         </button>
                    </div>
               )}

               <ProceedBtn onClick={() => onNavigate("s-groups")}>
                    {t(C.soon.backBtn)}
               </ProceedBtn>
          </div>
     );
}
