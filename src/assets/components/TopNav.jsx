/**
 * Public Recruit Splash TopNav
 * Note: "Recruit | Member | Admin" switcher has been removed per requirements!
 * Recruits have a dedicated Splash/Orientation view with "I want to be a trainee"
 * and "Sign In" buttons.
 */

export default function TopNav({
     lang,
     setLang,
     currentScreen,
     onNavigate,
     onOpenTraineeRegister,
     onOpenLogin,
}) {
     if (currentScreen === "s-boot") return null;

     return (
          <header className="sticky top-0 z-50 backdrop-blur-md bg-[#08090c]/85 border-b border-[#1c2530] px-4 md:px-8 py-3">
               <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3">
                         <button
                              type="button"
                              onClick={() => onNavigate("s-welcome")}
                              className="flex items-center gap-2 text-left cursor-pointer bg-transparent border-none text-slate-200 hover:text-[#f0a500] transition-colors">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#f0a500] shadow-[0_0_8px_#f0a500]" />
                              <span className="font-mono text-xs font-bold tracking-wider uppercase">
                                   STF-NHS · Recruit Orientation
                              </span>
                         </button>
                         <span className="text-[#2d3a47] font-mono text-xs hidden sm:inline">|</span>
                         <nav className="hidden sm:flex items-center gap-1.5 font-mono text-[11px]">
                              <button
                                   type="button"
                                   onClick={() => onNavigate("s-welcome")}
                                   className={`px-2.5 py-1 rounded cursor-pointer border-none transition-colors ${
                                        currentScreen === "s-welcome"
                                             ? "bg-[#181f28] text-[#f0a500]"
                                             : "bg-transparent text-[#64748b] hover:text-slate-200"
                                   }`}>
                                   Home
                              </button>
                              <button
                                   type="button"
                                   onClick={() => onNavigate("s-nhs")}
                                   className={`px-2.5 py-1 rounded cursor-pointer border-none transition-colors ${
                                        currentScreen === "s-nhs"
                                             ? "bg-[#181f28] text-[#f0a500]"
                                             : "bg-transparent text-[#64748b] hover:text-slate-200"
                                   }`}>
                                   About NHS
                              </button>
                              <button
                                   type="button"
                                   onClick={() => onNavigate("s-groups")}
                                   className={`px-2.5 py-1 rounded cursor-pointer border-none transition-colors ${
                                        ["s-groups", "s-hardware", "s-itinfra", "s-track", "s-soon", "s-lesson"].includes(
                                             currentScreen
                                        )
                                             ? "bg-[#181f28] text-green-400"
                                             : "bg-transparent text-[#64748b] hover:text-slate-200"
                                   }`}>
                                   {lang === "tl" ? "6 na Pangkat" : "6 Groups"}
                              </button>
                         </nav>
                    </div>

                    {/* Right Actions: "I want to be a trainee", "Sign In", and Language Toggle */}
                    <div className="flex items-center gap-2.5">

                         <button
                              type="button"
                              onClick={onOpenLogin}
                              className="font-mono text-[11px] font-semibold px-3.5 py-1.5 rounded-full bg-[#131920] border border-[#2a3a4d] text-sky-400 hover:bg-[#181f28] cursor-pointer transition-colors">
                              🔐 {lang === "tl" ? "Mag-Sign In" : "Portal Sign In"}
                         </button>

                         <div className="flex bg-[#131920] border border-[#1c2530] rounded-full overflow-hidden">
                              {["en", "tl"].map((l) => (
                                   <button
                                        key={l}
                                        type="button"
                                        onClick={() => setLang(l)}
                                        className={`bg-transparent border-none font-mono text-[11px] px-2.5 py-1.5 cursor-pointer tracking-wider transition-colors ${
                                             lang === l
                                                  ? "bg-[#181f28] text-[#f0a500]"
                                                  : "text-[#64748b] hover:text-slate-200"
                                        }`}>
                                        {l.toUpperCase()}
                                   </button>
                              ))}
                         </div>
                    </div>
               </div>
          </header>
     );
}
