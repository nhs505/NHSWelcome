/**
 * s-itinfra.jsx — Group 05 · I.T. Infrastructure Group Portal
 */

import { C } from "../components/content.js";
import { BackBtn, HighlightedText } from "../components/ui.jsx";

export default function ItInfraScreen({
     t,
     lang,
     itTracks,
     completedLessons,
     onNavigate,
     onOpenTrack,
}) {
     return (
          <div className="max-w-5xl w-full mx-auto px-6 py-12 pb-20">
               <BackBtn onClick={() => onNavigate("s-groups")}>
                    {t(C.itf.back)}
               </BackBtn>

               <div className="mb-12">
                    <div className="font-mono text-[11px] tracking-[0.22em] text-[#f0a500] uppercase mb-2.5">
                         {t(C.itf.eyebrow)}
                    </div>
                    <h1 className="text-[clamp(28px,5vw,58px)] font-extrabold leading-[1.05] tracking-tight mb-3.5">
                         {t(C.itf.h1)}{" "}
                         <span className="text-[#f0a500]">{t(C.itf.h2)}</span>
                         <br />
                         {t(C.itf.h3)}
                    </h1>
                    <p className="text-[clamp(14px,1.8vw,17.5px)] text-[#64748b] leading-[1.75] max-w-[60ch] mb-6">
                         {t(C.itf.lead)}
                    </p>
                    <div className="flex gap-2.5 flex-wrap">
                         {(lang === "tl" ? C.itf.chips.tl : C.itf.chips.en).map((c) => (
                              <span
                                   key={c}
                                   className="font-mono text-[11px] border border-[#1c2530] rounded-[20px] px-3.5 py-1.5 text-[#64748b]">
                                   {c}
                              </span>
                         ))}
                    </div>
               </div>

               <div className="bg-[#131920] border border-[rgba(240,165,0,0.2)] rounded-[15px] p-7 mb-12">
                    <div className="font-mono text-[10.5px] tracking-[0.15em] text-[#f0a500] uppercase mb-2.5">
                         {t(C.itf.abLabel)}
                    </div>
                    <div className="text-[clamp(14px,1.6vw,16px)] text-slate-200 leading-[1.8]">
                         <HighlightedText
                              text={t(C.itf.abText)}
                              highlight={t(C.itf.abHighlight)}
                              highlightClass="text-[#f0a500] font-bold"
                         />
                    </div>
               </div>

               <div className="font-mono text-[11px] tracking-[0.22em] text-[#64748b] uppercase mb-2">
                    {t(C.itf.tracksLabel)}
               </div>
               <h2 className="text-[clamp(20px,3vw,28px)] font-bold mb-1.5">
                    {t(C.itf.tracksH)}
               </h2>
               <p className="text-sm text-[#64748b] mb-7 leading-relaxed">
                    {t(C.itf.tracksSub)}
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(itTracks).map((id) => {
                         const d = itTracks[id];
                         const avail = d.lessons.filter((l) => l.available).length;
                         const doneCount = d.lessons.filter((l) =>
                              completedLessons.includes(l.id)
                         ).length;

                         return (
                              <div
                                   key={id}
                                   onClick={() => onOpenTrack(id, "s-itinfra")}
                                   className="bg-[#131920] border border-[#1c2530] rounded-[13px] p-5 cursor-pointer relative overflow-hidden transition-all hover:-translate-y-0.5 flex flex-col"
                                   style={{ borderBottom: `2px solid ${d.color}` }}>
                                   <div className="text-[26px] mb-2.5">{d.icon}</div>
                                   <span
                                        className={`font-mono text-[9.5px] tracking-widest uppercase border rounded px-2 py-0.5 inline-block mb-1.5 w-fit ${
                                             d.level === "beginner"
                                                  ? "text-green-400 border-[rgba(74,222,128,0.3)]"
                                                  : d.level === "intermediate"
                                                  ? "text-amber-400 border-[rgba(245,158,11,0.3)]"
                                                  : "text-red-400 border-[rgba(248,113,113,0.3)]"
                                        }`}>
                                        {t(d.levelLabel)}
                                   </span>
                                   <div className="text-[15.5px] font-bold mb-1.5">
                                        {t(d.title)}
                                   </div>
                                   <div className="text-xs text-[#64748b] leading-relaxed flex-1 mb-4">
                                        {t(d.desc)}
                                   </div>
                                   <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#1c2530]">
                                        <span className="font-mono text-[10px] text-green-400">
                                             ✓ {doneCount}/{avail} {t(C.td.availNow)}
                                        </span>
                                        <button
                                             type="button"
                                             className="font-semibold text-xs px-3 py-1.5 rounded-md border border-[#1c2530] bg-[#181f28] text-slate-200 cursor-pointer">
                                             {lang === "tl" ? "Buksan" : "Open"} →
                                        </button>
                                   </div>
                              </div>
                         );
                    })}
               </div>
          </div>
     );
}
