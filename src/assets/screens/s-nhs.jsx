/**
 * s-nhs.jsx — About NHS Screen & Interactive Recruit Orientation Checklist
 */

import { C, RECRUIT_CHECKLIST } from "../components/content.js";
import { BackBtn, ProceedBtn, HighlightedText } from "../components/ui.jsx";

export default function AboutNhsScreen({
     t,
     userType,
     onNavigate,
     completedChecklist = [],
     onToggleChecklist,
}) {
     return (
          <div className="max-w-4xl w-full mx-auto px-6 py-12 pb-20">
               <BackBtn onClick={() => onNavigate("s-welcome")}>
                    {t(C.nhs.backToWelcome)}
               </BackBtn>

               {userType === "recruit" ? (
                    <div className="rounded-[14px] p-6 mb-9 bg-[rgba(240,165,0,0.08)] border border-[rgba(240,165,0,0.25)]">
                         <div className="font-mono text-[10.5px] tracking-[0.15em] uppercase mb-2 text-[#f0a500]">
                              {t(C.rb.label)}
                         </div>
                         <div className="text-base font-bold mb-1.5">
                              {t(C.rb.title)}
                         </div>
                         <div className="text-[13.5px] leading-relaxed text-[#b9a585]">
                              {t(C.rb.desc)}
                         </div>
                    </div>
               ) : (
                    <div className="rounded-[14px] p-6 mb-9 bg-[rgba(56,189,248,0.07)] border border-[rgba(56,189,248,0.25)] flex flex-wrap items-center justify-between gap-4">
                         <div className="max-w-xl">
                              <div className="font-mono text-[10.5px] tracking-[0.15em] uppercase mb-2 text-sky-400">
                                   {t(C.mb.label)}
                              </div>
                              <div className="text-base font-bold mb-1.5">
                                   {t(C.mb.title)}
                              </div>
                              <div className="text-[13.5px] leading-relaxed text-[#64748b]">
                                   {t(C.mb.desc)}
                              </div>
                         </div>
                         <button
                              type="button"
                              onClick={() => onNavigate("s-member-dash")}
                              className="font-mono text-xs font-semibold px-4 py-2.5 rounded-lg bg-sky-500/15 border border-sky-400/40 text-sky-300 cursor-pointer hover:bg-sky-500/25">
                              Go to Member Dashboard →
                         </button>
                    </div>
               )}

               <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#f0a500] mb-3">
                    {t(C.nhs.eyebrow)}
               </div>
               <h2 className="text-[clamp(28px,4.5vw,52px)] font-extrabold leading-[1.1] tracking-[-0.02em] mb-4">
                    {t(C.nhs.h)}
               </h2>
               <p className="text-[clamp(14.5px,1.8vw,17px)] text-[#64748b] leading-[1.75] max-w-[64ch]">
                    {t(C.nhs.lead)}
               </p>

               {/* SFM -> STF -> NHS Hierarchy */}
               <div className="flex items-center gap-0 my-10 flex-wrap">
                    {[
                         {
                              code: t(C.nhs.cSchoolCode),
                              name: C.nhs.cSchoolName,
                              desc: t(C.nhs.cSchoolDesc),
                         },
                         {
                              code: t(C.nhs.cProgCode),
                              name: C.nhs.cProgName,
                              desc: t(C.nhs.cProgDesc),
                         },
                         {
                              code: t(C.nhs.cTeamCode),
                              name: C.nhs.cTeamName,
                              desc: t(C.nhs.cTeamDesc),
                              hi: true,
                         },
                    ].map((item, i) => (
                         <div key={i} className="contents">
                              {i > 0 && (
                                   <div className="text-[22px] text-[#2d3a47] px-2.5 shrink-0">
                                        →
                                   </div>
                              )}
                              <div
                                   className={`bg-[#131920] border rounded-[10px] p-5 flex-1 min-w-44 ${
                                        item.hi
                                             ? "border-[rgba(240,165,0,0.35)] bg-[#140f00]"
                                             : "border-[#1c2530]"
                                   }`}>
                                   <div
                                        className={`font-mono text-[10px] tracking-[0.15em] uppercase mb-1.5 ${
                                             item.hi ? "text-[#f0a500]" : "text-[#64748b]"
                                        }`}>
                                        {item.code}
                                   </div>
                                   <div className="text-base font-bold mb-1">
                                        {item.name}
                                   </div>
                                   <div className="text-xs text-[#64748b] leading-relaxed">
                                        {item.desc}
                                   </div>
                              </div>
                         </div>
                    ))}
               </div>

               {/* Interactive Recruit Onboarding Checklist (Backed by SQL) */}
               <div className="bg-[#131920] border border-[rgba(240,165,0,0.28)] rounded-2xl p-6 mb-12">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                         <div>
                              <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-[#f0a500] mb-1">
                                   SQL-Tracked Recruit Roadmap
                              </div>
                              <h3 className="text-lg font-bold">
                                   5-Step New Recruit Orientation Checklist
                              </h3>
                         </div>
                         <span className="font-mono text-xs text-green-400 bg-green-400/10 border border-green-400/30 rounded-full px-3 py-1">
                              {completedChecklist.length} / {RECRUIT_CHECKLIST.length} Completed
                         </span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                         {RECRUIT_CHECKLIST.map((task, idx) => {
                              const done = completedChecklist.includes(task.id);
                              return (
                                   <div
                                        key={task.id}
                                        onClick={() => onToggleChecklist && onToggleChecklist(task.id)}
                                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                                             done
                                                  ? "bg-green-400/5 border-green-400/30"
                                                  : "bg-[#0d1218] border-[#1c2530] hover:border-[#2a3a4d]"
                                        }`}>
                                        <span
                                             className={`w-5 h-5 rounded flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                                                  done
                                                       ? "bg-green-400 text-[#08090c] font-bold"
                                                       : "border border-[#2d3a47] text-transparent"
                                             }`}>
                                             ✓
                                        </span>
                                        <div className="flex-1">
                                             <div className="text-sm font-semibold text-slate-200">
                                                  {String(idx + 1).padStart(2, "0")} · {t(task.title)}
                                             </div>
                                             <div className="text-xs text-[#64748b] mt-0.5">
                                                  {t(task.desc)}
                                             </div>
                                        </div>
                                   </div>
                              );
                         })}
                    </div>
               </div>

               {/* What we actually do */}
               <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#f0a500] mb-3">
                    {t(C.nhs.whatEye)}
               </div>
               <h2 className="text-[clamp(22px,3.5vw,40px)] font-extrabold leading-[1.1] tracking-[-0.02em] mb-4">
                    {t(C.nhs.whatH)
                         .replace(/\\n/g, "\n")
                         .split("\n")
                         .map((l, i) => (
                              <span key={i}>
                                   {l}
                                   {i === 0 && <br />}
                              </span>
                         ))}
               </h2>
               <p className="text-[clamp(14.5px,1.8vw,17px)] text-[#64748b] leading-[1.75] max-w-[64ch] mb-8">
                    {t(C.nhs.whatLead)}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-12">
                    {[
                         { icon: "🛠️", title: t(C.nhs.id1t), desc: t(C.nhs.id1d) },
                         { icon: "🌍", title: t(C.nhs.id2t), desc: t(C.nhs.id2d) },
                         { icon: "📈", title: t(C.nhs.id3t), desc: t(C.nhs.id3d) },
                         { icon: "🤝", title: t(C.nhs.id4t), desc: t(C.nhs.id4d) },
                    ].map((card, i) => (
                         <div
                              key={i}
                              className="bg-[#131920] border border-[#1c2530] rounded-xl p-5">
                              <div className="text-2xl mb-2.5">{card.icon}</div>
                              <div className="text-[15px] font-bold mb-1.5">
                                   {card.title}
                              </div>
                              <div className="text-[13px] text-[#64748b] leading-relaxed">
                                   {card.desc}
                              </div>
                         </div>
                    ))}
               </div>

               {/* Fixed "Who belongs in NHS?" section */}
               <div className="bg-[#131920] border border-[rgba(74,222,128,0.2)] rounded-2xl p-7 mb-12">
                    <h3 className="text-xl font-bold mb-1.5">
                         <HighlightedText
                              text={t(C.nhs.whoH)}
                              highlight={t(C.nhs.whoHl)}
                              highlightClass="text-green-400"
                         />
                    </h3>
                    <p className="text-[14.5px] text-[#64748b] mb-5 leading-relaxed">
                         {t(C.nhs.whoLead)}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                         {C.nhs.who.map((w, i) => (
                              <div
                                   key={i}
                                   className="flex items-start gap-2.5 text-[13.5px] text-[#64748b] leading-relaxed">
                                   <span className="text-green-400 font-bold shrink-0">
                                        ✓
                                   </span>
                                   <span>
                                        {t(w)}{" "}
                                        <strong className="text-slate-200 ml-1">
                                             Welcome.
                                        </strong>
                                   </span>
                              </div>
                         ))}
                    </div>
               </div>

               <div className="border-t border-[#1c2530] my-10" />
               <p className="text-[clamp(14.5px,1.8vw,17px)] text-[#64748b] leading-[1.75] max-w-[64ch] mb-8">
                    {t(C.nhs.divLead)}
               </p>
               <div className="flex justify-center">
                    <ProceedBtn onClick={() => onNavigate("s-groups")}>
                         {t(C.nhs.seeGroups)}
                    </ProceedBtn>
               </div>
          </div>
     );
}
