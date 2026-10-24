/**
 * WelcomeScreen — first interactive screen after the boot sequence.
 *
 * Props:
 *   t          – translator helper (obj) => string
 *   setUserType – sets "recruit" | "member"
 *   onNavigate  – (screenId) => void   e.g. show("s-nhs") or navigate("/nhs")
 *
 * Usage with state-based navigation (current App):
 *   <WelcomeScreen t={t} setUserType={setUserType} onNavigate={show} />
 *
 * Usage with React Router:
 *   const navigate = useNavigate();
 *   <WelcomeScreen
 *     t={t}
 *     setUserType={setUserType}
 *     onNavigate={(id) => {
 *       if (id === "s-nhs") navigate("/nhs");
 *       if (id === "s-groups") navigate("/groups");
 *     }}
 *   />
 */

import { C } from "../components/content.js";

export default function WelcomeScreen({ t, setUserType, onNavigate }) {
     return (
          <div className=" flex flex-col items-center justify-center p-10 md:p-[40px_24px]">
               <div className="max-w-180 w-full text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#131920] border border-[#2a3a4d] rounded-[20px] px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-[#64748b] uppercase mb-7">
                         <span className="w-1.75 h-1.75 rounded-full bg-[#f0a500] shadow-[0_0_8px_#f0a500] animate-pulse" />
                         {t(C.w.badge)}
                    </div>

                    {/* Title */}
                    <div className="text-[clamp(40px,7vw,82px)] font-extrabold leading-none tracking-[-0.03em] mb-1.5">
                         {t(C.w.pre)
                              .replace(/\\n/g, "\n")
                              .split("\n")
                              .map((line, i) => (
                                   <span key={i}>
                                        {line}
                                        {i === 0 && <br />}
                                   </span>
                              ))}{" "}
                         <span className="text-[#f0a500]">NHS.</span>
                    </div>

                    {/* Subtitle */}
                    <p className="text-[clamp(14px,2vw,18px)] text-[#64748b] mb-12 leading-relaxed">
                         {t(C.w.sub1)}
                         <br />
                         <strong className="text-slate-200 font-semibold">
                              {t(C.w.sub2)}
                         </strong>
                    </p>

                    {/* Path cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-140 mx-auto mb-9">
                         {/* Recruit */}
                         <div
                              onClick={() => {
                                   setUserType("recruit");
                                   onNavigate("s-nhs");
                              }}
                              className="bg-[#131920] border border-[#1c2530] rounded-[14px] p-[22px_20px] cursor-pointer text-left transition-colors hover:bg-[#181f28] hover:border-[rgba(240,165,0,0.4)]">
                              <div className="text-[26px] mb-2.5">🌱</div>
                              <div className="font-mono text-[10px] tracking-[0.12em] text-[#f0a500] uppercase mb-1">
                                   {t(C.w.rlabel)}
                              </div>
                              <div className="text-base font-bold mb-1.5">
                                   {t(C.w.rtitle)}
                              </div>
                              <div className="text-[12.5px] text-[#64748b] leading-relaxed">
                                   {t(C.w.rdesc)}
                              </div>
                         </div>

                         {/* Member */}
                         <div
                              onClick={() => {
                                   setUserType("member");
                                   onNavigate("s-nhs");
                              }}
                              className="bg-[#131920] border border-[#1c2530] rounded-[14px] p-[22px_20px] cursor-pointer text-left transition-colors hover:bg-[#181f28] hover:border-[rgba(56,189,248,0.4)]">
                              <div className="text-[26px] mb-2.5">🏅</div>
                              <div className="font-mono text-[10px] tracking-[0.12em] text-sky-400 uppercase mb-1">
                                   {t(C.w.mlabel)}
                              </div>
                              <div className="text-base font-bold mb-1.5">
                                   {t(C.w.mtitle)}
                              </div>
                              <div className="text-[12.5px] text-[#64748b] leading-relaxed">
                                   {t(C.w.mdesc)}
                              </div>
                         </div>
                    </div>

                    {/* Skip link */}
                    <div
                         onClick={() => onNavigate("s-groups")}
                         className="font-mono text-[11px] text-[#2d3a47] tracking-widest cursor-pointer hover:text-[#64748b]">
                         {t(C.w.skip)}
                    </div>
               </div>
          </div>
     );
}
