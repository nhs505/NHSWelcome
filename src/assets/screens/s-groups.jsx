/**
 * s-groups.jsx — All 6 NHS Specialized Groups (Group 00 to Group 05)
 */

import { C } from "../components/content.js";
import { BackBtn } from "../components/ui.jsx";

export default function GroupsScreen({
     t,
     userType,
     groups,
     onNavigate,
     onOpenGroup,
}) {
     return (
          <div className="max-w-5xl w-full mx-auto px-6 py-12 pb-20">
               <BackBtn
                    onClick={() =>
                         onNavigate(userType === "member" ? "s-member-dash" : "s-nhs")
                    }>
                    {t(C.grp.back)}
               </BackBtn>

               <div className="mb-10">
                    <div className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#f0a500] mb-3">
                         {t(C.grp.eyebrow)}
                    </div>
                    <h2 className="text-[clamp(28px,4.5vw,52px)] font-extrabold leading-[1.1] tracking-[-0.02em] mb-4">
                         {t(C.grp.h)}
                    </h2>
                    <p className="text-[clamp(14.5px,1.8vw,17px)] text-[#64748b] leading-[1.75] max-w-[64ch]">
                         {t(C.grp.lead)}
                    </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groups.map((g) => {
                         const isOpen = g.status === "open";
                         return (
                              <div
                                   key={g.slug}
                                   onClick={() => onOpenGroup(g)}
                                   className={`bg-[#131920] border border-[#1c2530] rounded-[15px] p-6 cursor-pointer relative overflow-hidden transition-all hover:-translate-y-0.5 flex flex-col ${
                                        isOpen
                                             ? "hover:border-[rgba(240,165,0,0.45)]"
                                             : "hover:border-[#2a3a4d]"
                                   }`}>
                                   <div
                                        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${g.bar}`}
                                   />

                                   {/* Role-aware badge */}
                                   {g.code === "00" && userType === "recruit" && (
                                        <div className="inline-flex items-center gap-1.5 bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.3)] rounded-[20px] px-3 py-1 font-mono text-[9.5px] text-green-400 tracking-[0.08em] uppercase mb-2.5 w-fit">
                                             {t(C.grp.startHere)}
                                        </div>
                                   )}
                                   {isOpen && userType === "member" && (
                                        <div className="inline-flex items-center gap-1.5 bg-sky-400/10 border border-sky-400/30 rounded-[20px] px-3 py-1 font-mono text-[9.5px] text-sky-400 tracking-[0.08em] uppercase mb-2.5 w-fit">
                                             {t(C.grp.memberCrossTrain)}
                                        </div>
                                   )}

                                   <div className="text-[30px] mb-3">{g.icon}</div>
                                   <div
                                        className={`font-mono text-[10px] tracking-[0.12em] uppercase mb-1.5 ${g.tagColor}`}>
                                        {t(g.tag)}
                                   </div>
                                   <div className="text-lg font-bold mb-1.5 text-slate-100">
                                        {t(g.title)}
                                   </div>
                                   <div className="text-[13px] text-[#64748b] leading-relaxed flex-1">
                                        {t(g.desc)}
                                   </div>

                                   <div
                                        className={`mt-4 flex items-center justify-between font-mono text-[10.5px] ${
                                             isOpen ? "text-[#f0a500]" : "text-[#64748b]"
                                        }`}>
                                        <span className="flex items-center gap-1.5">
                                             <span
                                                  className={`w-2 h-2 rounded-full ${
                                                       isOpen
                                                            ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]"
                                                            : "bg-amber-400"
                                                  }`}
                                             />
                                             {isOpen ? t(C.grp.statusOpen) : t(C.grp.statusSoon)}
                                        </span>
                                        <span>{g.buildProgress}%</span>
                                   </div>

                                   <button
                                        type="button"
                                        className={`mt-3 w-full border text-[13px] font-semibold py-2.5 rounded-lg cursor-pointer ${
                                             isOpen
                                                  ? "bg-[rgba(240,165,0,0.12)] border-[rgba(240,165,0,0.3)] text-[#f0a500]"
                                                  : "bg-[#181f28] border-[#1c2530] text-slate-200"
                                        }`}>
                                        {isOpen
                                             ? `${t(C.grp.enterOpen)}`
                                             : `${t(C.grp.enterBtn)} ${t(g.title)} →`}
                                   </button>
                              </div>
                         );
                    })}
               </div>
          </div>
     );
}
