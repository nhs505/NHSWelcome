/**
 * WelcomeScreen.jsx — Public Recruits Splash Screen
 * - Serves as the main Splash Page for Recruits.
 * - If a Recruit decides to join NHS, they click "I want to be a trainee" to self-register.
 * - Existing Trainees, Project Members, and Admins click "Sign In to Account Portal" (with Button Role Selector).
 */

import { Button, Divider } from "antd";
import { C } from "../components/content.js";

export default function WelcomeScreen({
     t,
     lang,
     onNavigate,
     onOpenTraineeRegister,
     onOpenLogin,
}) {
     return (
          <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 md:p-10">
               <div className="max-w-4xl w-full text-center">
                    {/* Splash Badge */}
                    <div className="flex flex-col items-center h-[85vh] justify-center pb-[15vh]">
                         <div className="inline-flex items-center gap-2 bg-[#131920] border border-[#2a3a4d] rounded-[20px] px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-[#94a3b8] uppercase mb-7 shadow-lg">
                              <span className="w-2 h-2 rounded-full bg-[#f0a500] shadow-[0_0_8px_#f0a500] animate-pulse" />
                              {t(C.w.badge)}
                         </div>

                         {/* Title */}
                         <div className="text-[clamp(40px,7vw,82px)] font-extrabold leading-none tracking-[-0.03em] mb-3">
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
                         <p className="text-[clamp(14px,2vw,18px)] text-[#64748b] mb-10 leading-relaxed max-w-2xl mx-auto">
                              {t(C.w.sub1)}
                              <br />
                              <strong className="text-slate-200 font-semibold">
                                   {t(C.w.sub2)}
                              </strong>
                         </p>
                    </div>

                    <Divider
                         titlePlacement="start"
                         plain
                         className="bg-white"
                    />

                    {/* Primary Recruit Orientation & Trainee Join Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-[15vh] pb-[15vh] max-w-4xl mx-auto mb-9">
                         {/* 1. Explore Orientation as a Recruit */}

                         <div
                              onClick={() => onNavigate("s-nhs")}
                              className="bg-[#131920] border border-[#1c2530] rounded-2xl p-6 cursor-pointer text-left transition-all hover:-translate-y-1 hover:bg-[#181f28] hover:border-[#f0a500]/50 flex flex-col">
                              <div className="flex text-[28px] mb-2.5 place-items-center">
                                   🧭
                              </div>
                              <div className="font-mono text-[10px] tracking-[0.12em] text-[#f0a500] uppercase mb-1">
                                   Step 01 · Public Recruit Splash
                              </div>
                              <div className="text-base font-bold mb-1.5 text-slate-100">
                                   {lang === "tl" ?
                                        "Tuklasin ang NHS Orientation"
                                   :    "Explore NHS Orientation"}
                              </div>
                              <div className="text-[12.5px] text-[#64748b] leading-relaxed flex-1 mb-4">
                                   {t(C.w.rdesc)}
                              </div>
                              <span className="font-mono text-[11px] text-[#f0a500] font-semibold">
                                   Start Recruit Tour →
                              </span>
                         </div>

                         {/* 2. "I want to be a trainee" Instant Self-Registration */}
                         <div
                              onClick={onOpenTraineeRegister}
                              className="bg-gradient-to-b from-[#1a1608] to-[#131920] border-2 border-[#f0a500]/60 rounded-2xl p-6 cursor-pointer text-left transition-all hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(240,165,0,0.2)] flex flex-col">
                              <div className="text-[28px] mb-2.5">🌱</div>
                              <div className="font-mono text-[10px] tracking-[0.12em] text-green-400 uppercase mb-1">
                                   Step 02 · Decided to Join NHS?
                              </div>
                              <div className="text-base font-bold mb-1.5 text-slate-100">
                                   {lang === "tl" ?
                                        "Gusto kong maging Trainee!"
                                   :    "I want to be a trainee"}
                              </div>
                              <div className="text-[12.5px] text-[#94a3b8] leading-relaxed flex-1 mb-4">
                                   {lang === "tl" ?
                                        "Mag-register agad bilang Trainee sa isang click upang magkaroon ng sariling Trainee Dashboard at Learning Roadmap."
                                   :    "Ready to join NHS? Click here to register your Trainee account immediately and unlock your personal Learning Roadmap."
                                   }
                              </div>
                              <span className="inline-flex items-center justify-center w-full py-2 rounded-lg bg-[#f0a500] text-[#1a0e00] font-mono text-xs font-extrabold">
                                   I want to be a trainee →
                              </span>
                         </div>

                         {/* 3. Sign In for Admin, Project Member, or Trainee */}
                         <div
                              onClick={onOpenLogin}
                              className="bg-[#131920] border border-[#1c2530] rounded-2xl p-6 cursor-pointer text-left transition-all hover:-translate-y-1 hover:bg-[#181f28] hover:border-sky-400/50 flex flex-col">
                              <div className="text-[28px] mb-2.5">🔐</div>
                              <div className="font-mono text-[10px] tracking-[0.12em] text-sky-400 uppercase mb-1">
                                   Authenticated Portals
                              </div>
                              <div className="text-base font-bold mb-1.5 text-slate-100">
                                   {lang === "tl" ?
                                        "Sign In (Admin / Member / Trainee)"
                                   :    "Sign In: Admin · Member · Trainee"}
                              </div>
                              <div className="text-[12.5px] text-[#64748b] leading-relaxed flex-1 mb-4">
                                   {lang === "tl" ?
                                        "May account ka na? Piliin ang iyong role button (Admin, Project Member, o Trainee) at mag-sign in nang ligtas."
                                   :    "Already registered? Select your user button (Admin, Project Member, or Trainee) to enter your workspace."
                                   }
                              </div>
                              <span className="font-mono text-[11px] text-sky-400 font-semibold">
                                   Open Secure Login →
                              </span>
                         </div>
                    </div>

                    {/* Direct 6 Groups Preview Link */}
                    <button
                         type="button"
                         onClick={() => onNavigate("s-groups")}
                         className="bg-transparent border-none font-mono text-[11px] text-[#64748b] tracking-widest cursor-pointer hover:text-[#f0a500] transition-colors">
                         {t(C.w.skip)}
                    </button>

                    <div className="mt-10 font-mono text-[11px] text-[#2d3a47]">
                         © Copyright STF-NHS · School For Ministers · Special
                         Task Force
                    </div>
               </div>
          </div>
     );
}
