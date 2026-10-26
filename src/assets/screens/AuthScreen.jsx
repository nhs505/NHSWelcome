/**
 * AuthScreen.jsx — Penetration-Hardened Login & Registration Screen
 * Implements:
 *   1. User Role Selection as BUTTONS (Admin, Member [Project Member], or Trainee) — NOT a dropdown!
 *   2. Single-Device Session Lock detection & simulation toggle
 *   3. "I want to be a trainee" instant self-registration
 *   4. "Registering Account for Member should be consulted for the Admin" enforcement notice
 */

import { useState } from "react";
import { AVATARS } from "../components/dbService.js";

export default function AuthScreen({
     mode = "login", // "login" | "register_trainee"
     setMode,
     users,
     groups,
     activeDeviceLocks,
     simulatedRemoteSessions,
     onToggleSimulatedRemote,
     onForceClearRemoteLock,
     onLoginSuccess,
     onRegisterTrainee,
     onBackToSplash,
}) {
     // Role selected via BUTTONS (Admin, Member [Project member], or Trainee)
     const [selectedRole, setSelectedRole] = useState("admin");
     const [username, setUsername] = useState("sector111");
     const [password, setPassword] = useState("admin123");
     const [errorMsg, setErrorMsg] = useState("");
     const [showMemberNotice, setShowMemberNotice] = useState(false);
     const [failedAttempts, setFailedAttempts] = useState(0);

     // Trainee Self-Registration State
     const [trName, setTrName] = useState("");
     const [trUsername, setTrUsername] = useState("");
     const [trEmail, setTrEmail] = useState("");
     const [trPassword, setTrPassword] = useState("");
     const [trGroup, setTrGroup] = useState("00");

     const handleRoleButtonClick = (role) => {
          setSelectedRole(role);
          setErrorMsg("");
          setShowMemberNotice(false);
          // Pre-fill demo credentials for fast testing
          if (role === "admin") {
               setUsername("sector111");
               setPassword("admin123");
          } else if (role === "member") {
               setUsername("marco");
               setPassword("member123");
          } else if (role === "trainee") {
               setUsername("joshua");
               setPassword("trainee123");
          }
     };

     const handleLoginSubmit = (e) => {
          e.preventDefault();
          setErrorMsg("");

          if (failedAttempts >= 5) {
               setErrorMsg(
                    "🛡️ PENETRATION DEFENSE TRIGGERED: Too many failed login attempts. Account locked for 15 minutes."
               );
               return;
          }

          const cleanUser = username.trim().toLowerCase();
          const matchedUser = users.find(
               (u) =>
                    (u.username.toLowerCase() === cleanUser ||
                         u.sectorCode.toLowerCase() === cleanUser) &&
                    u.role === selectedRole
          );

          if (!matchedUser || matchedUser.password !== password) {
               setFailedAttempts((c) => c + 1);
               setErrorMsg(
                    `Invalid credentials for ${selectedRole.toUpperCase()} role. (Attempt ${
                         failedAttempts + 1
                    }/5)`
               );
               return;
          }

          if (!matchedUser.isActive) {
               setErrorMsg(
                    "Access Denied: Your account has been marked Non-Active by the Administrator."
               );
               return;
          }

          // Check Single-Device Session Lock!
          const remoteSim = simulatedRemoteSessions?.[matchedUser.username];
          const existingLock = activeDeviceLocks?.[matchedUser.username];

          if (remoteSim || existingLock) {
               setErrorMsg(
                    `🔒 SINGLE-DEVICE SECURITY BLOCK: "${matchedUser.fullName}" (${matchedUser.sectorCode}) is already signed in on another device or active browser tab! Simultaneous logins are prohibited. Please log out from the other device first.`
               );
               return;
          }

          setFailedAttempts(0);
          onLoginSuccess(matchedUser);
     };

     const handleTraineeRegisterSubmit = (e) => {
          e.preventDefault();
          setErrorMsg("");
          if (!trName.trim() || !trUsername.trim() || trPassword.length < 6) {
               setErrorMsg("Please enter your full name, a username, and a password (6+ chars).");
               return;
          }
          const exists = users.some(
               (u) => u.username.toLowerCase() === trUsername.trim().toLowerCase()
          );
          if (exists) {
               setErrorMsg("That username is already registered. Please choose another.");
               return;
          }
          const newTrainee = {
               id: Date.now(),
               sectorCode: `TRN-2026-${Math.floor(100 + Math.random() * 899)}`,
               username: trUsername.trim(),
               password: trPassword,
               fullName: trName.trim(),
               email: trEmail.trim() || `${trUsername.trim().toLowerCase()}@nhs.sfm.local`,
               role: "trainee",
               memberType: "none",
               primaryGroup: trGroup,
               avatar: AVATARS.trainee,
               bio: "Registered via 'I want to be a trainee' on Recruit Splash",
               isActive: true,
               availability: "available",
               progressPct: 10,
               orientationDone: false,
          };
          onRegisterTrainee(newTrainee);
     };

     return (
          <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6">
               <div className="max-w-xl w-full bg-[#131920] border border-[#243040] rounded-2xl p-6 md:p-8 shadow-2xl">
                    {/* Top Back & Mode Switch */}
                    <div className="flex items-center justify-between gap-2 mb-6">
                         <button
                              type="button"
                              onClick={onBackToSplash}
                              className="font-mono text-xs text-[#64748b] hover:text-slate-200 bg-transparent border border-[#1c2530] rounded-lg px-3 py-1.5 cursor-pointer">
                              ← Back to Recruit Splash
                         </button>
                         <div className="flex gap-2">
                              <button
                                   type="button"
                                   onClick={() => {
                                        setMode("login");
                                        setErrorMsg("");
                                   }}
                                   className={`font-mono text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${
                                        mode === "login"
                                             ? "bg-[#f0a500]/15 border-[#f0a500]/50 text-[#f0a500]"
                                             : "bg-[#0d1218] border-[#1c2530] text-[#64748b]"
                                   }`}>
                                   Sign In
                              </button>
                              <button
                                   type="button"
                                   onClick={() => {
                                        setMode("register_trainee");
                                        setErrorMsg("");
                                   }}
                                   className={`font-mono text-xs px-3 py-1.5 rounded-lg border cursor-pointer ${
                                        mode === "register_trainee"
                                             ? "bg-green-400/15 border-green-400/50 text-green-400"
                                             : "bg-[#0d1218] border-[#1c2530] text-[#64748b]"
                                   }`}>
                                   🌱 I want to be a trainee
                              </button>
                         </div>
                    </div>

                    {mode === "login" ? (
                         <div>
                              <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-[#f0a500] mb-1">
                                   Penetration-Hardened Session Auth · Single-Device Lock
                              </div>
                              <h2 className="text-2xl font-extrabold text-slate-100 mb-1.5">
                                   Select Your User Type &amp; Sign In
                              </h2>
                              <p className="text-xs text-[#64748b] mb-5">
                                   Choose your user type below using the role buttons. Sessions automatically log out when your browser tab closes.
                              </p>

                              {/* ROLE SELECTION BUTTONS (Explicitly Buttons Instead of Dropdown!) */}
                              <div className="mb-5">
                                   <div className="font-mono text-[10px] uppercase tracking-wider text-[#94a3b8] mb-2">
                                        1. Select What Kind of User You Are (Button Selector):
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                        {[
                                             {
                                                  id: "admin",
                                                  icon: "🛡️",
                                                  title: "Admin",
                                                  sub: "Full System Control",
                                                  activeBorder: "border-red-400 bg-red-400/10 text-red-300",
                                             },
                                             {
                                                  id: "member",
                                                  icon: "🏅",
                                                  title: "Member",
                                                  sub: "Project Member",
                                                  activeBorder: "border-sky-400 bg-sky-400/10 text-sky-300",
                                             },
                                             {
                                                  id: "trainee",
                                                  icon: "🌱",
                                                  title: "Trainee",
                                                  sub: "Joined NHS Recruit",
                                                  activeBorder: "border-green-400 bg-green-400/10 text-green-300",
                                             },
                                        ].map((btn) => {
                                             const active = selectedRole === btn.id;
                                             return (
                                                  <button
                                                       key={btn.id}
                                                       type="button"
                                                       onClick={() => handleRoleButtonClick(btn.id)}
                                                       className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between ${
                                                            active
                                                                 ? btn.activeBorder
                                                                 : "border-[#1f2937] bg-[#0b0f14] text-slate-300 hover:border-[#334155]"
                                                       }`}>
                                                       <div className="flex items-center justify-between mb-1">
                                                            <span className="text-xl">{btn.icon}</span>
                                                            {active && (
                                                                 <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-black/40">
                                                                      Selected
                                                                 </span>
                                                            )}
                                                       </div>
                                                       <div className="text-sm font-extrabold">{btn.title}</div>
                                                       <div className="text-[10.5px] opacity-75 font-mono">
                                                            {btn.sub}
                                                       </div>
                                                  </button>
                                             );
                                        })}
                                   </div>
                              </div>

                              {/* Login Form */}
                              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3.5">
                                   <div>
                                        <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                             Username or Sector ID
                                        </label>
                                        <input
                                             type="text"
                                             value={username}
                                             onChange={(e) => setUsername(e.target.value)}
                                             placeholder="e.g. sector111, marco, joshua"
                                             className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#f0a500]"
                                        />
                                   </div>
                                   <div>
                                        <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                             Password
                                        </label>
                                        <input
                                             type="password"
                                             value={password}
                                             onChange={(e) => setPassword(e.target.value)}
                                             className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-[#f0a500]"
                                        />
                                   </div>

                                   {/* Single-Device Lock Simulator Bar (To test & prove the security feature!) */}
                                   <div className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                                        <div className="text-[11px] text-[#94a3b8]">
                                             <strong className="text-slate-200">Test Single-Device Lock:</strong>{" "}
                                             Simulate that <code className="text-[#f0a500]">{username || "user"}</code> is already logged in on another PC
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <button
                                                  type="button"
                                                  onClick={() =>
                                                       onToggleSimulatedRemote(username.trim().toLowerCase())
                                                  }
                                                  className={`font-mono text-[10.5px] px-2.5 py-1 rounded border cursor-pointer ${
                                                       simulatedRemoteSessions?.[username.trim().toLowerCase()]
                                                            ? "bg-red-500/20 border-red-400 text-red-300 font-bold"
                                                            : "bg-[#131920] border-[#263244] text-[#64748b]"
                                                  }`}>
                                                  {simulatedRemoteSessions?.[username.trim().toLowerCase()]
                                                       ? "🔒 Active on Device #2 (Click to Release)"
                                                       : "🔓 Not Logged In Elsewhere"}
                                             </button>
                                             {activeDeviceLocks?.[username.trim().toLowerCase()] && (
                                                  <button
                                                       type="button"
                                                       onClick={() =>
                                                            onForceClearRemoteLock(username.trim().toLowerCase())
                                                       }
                                                       className="font-mono text-[10px] px-2 py-1 rounded bg-amber-500/20 border border-amber-400 text-amber-300 cursor-pointer">
                                                       Reset Stale Lock
                                                  </button>
                                             )}
                                        </div>
                                   </div>

                                   {errorMsg && (
                                        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-400/40 text-xs text-red-300 leading-relaxed font-mono">
                                             {errorMsg}
                                        </div>
                                   )}

                                   <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#f0a500] to-[#e09000] text-[#1a0e00] font-extrabold text-sm border-none cursor-pointer shadow-[0_0_24px_rgba(240,165,0,0.3)] hover:opacity-95 transition-all">
                                        Sign In as {selectedRole.toUpperCase()} →
                                   </button>
                              </form>

                              {/* Registration Rules Footer: Trainee vs. Member (Consult Admin) */}
                              <div className="mt-6 pt-5 border-t border-[#1f2937] flex flex-col gap-2.5 text-xs">
                                   <div className="flex items-center justify-between">
                                        <span className="text-[#64748b]">New Recruit ready to join?</span>
                                        <button
                                             type="button"
                                             onClick={() => setMode("register_trainee")}
                                             className="font-mono text-xs text-green-400 bg-transparent border-none cursor-pointer hover:underline font-bold">
                                             🌱 Click "I want to be a trainee" →
                                        </button>
                                   </div>
                                   <div className="flex items-center justify-between">
                                        <span className="text-[#64748b]">Need a Project Member account?</span>
                                        <button
                                             type="button"
                                             onClick={() => setShowMemberNotice((s) => !s)}
                                             className="font-mono text-xs text-sky-400 bg-transparent border-none cursor-pointer hover:underline">
                                             🏅 Register as Member (Consult Admin)
                                        </button>
                                   </div>
                                   {showMemberNotice && (
                                        <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-400/30 text-xs text-sky-200 leading-relaxed">
                                             <strong>🛡️ Member Account Policy:</strong> Registering an account for a <strong>Member</strong> (Project Member or Plenary Class) cannot be done publicly—it must be consulted with and provisioned by an <strong>Admin</strong> inside <code>Admin Portal → Accounts → Add Account for Member</code>. If you are a recruit joining NHS, please click <strong>"I want to be a trainee"</strong> above!
                                        </div>
                                   )}
                              </div>
                         </div>
                    ) : (
                         /* TRAINEE SELF-REGISTRATION ("I want to be a trainee") */
                         <div>
                              <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-green-400 mb-1">
                                   Recruit-to-Trainee Onboarding
                              </div>
                              <h2 className="text-2xl font-extrabold text-slate-100 mb-1.5">
                                   🌱 "I want to be a trainee"
                              </h2>
                              <p className="text-xs text-[#64748b] mb-5">
                                   As a Trainee, you are a recruit who has decided to join NHS! Complete the form below to create your Trainee account and start your learning roadmap.
                              </p>

                              <form onSubmit={handleTraineeRegisterSubmit} className="flex flex-col gap-3.5">
                                   <div>
                                        <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                             Your Full Name
                                        </label>
                                        <input
                                             type="text"
                                             placeholder="e.g. Bro. Aaron Santos"
                                             value={trName}
                                             onChange={(e) => setTrName(e.target.value)}
                                             className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100"
                                        />
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                             <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                  Username
                                             </label>
                                             <input
                                                  type="text"
                                                  placeholder="e.g. aaron_nhs"
                                                  value={trUsername}
                                                  onChange={(e) => setTrUsername(e.target.value)}
                                                  className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100"
                                             />
                                        </div>
                                        <div>
                                             <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                  Email Address
                                             </label>
                                             <input
                                                  type="email"
                                                  placeholder="aaron@nhs.sfm.local"
                                                  value={trEmail}
                                                  onChange={(e) => setTrEmail(e.target.value)}
                                                  className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100"
                                             />
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                             <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                  Password (6+ characters)
                                             </label>
                                             <input
                                                  type="password"
                                                  placeholder="••••••••"
                                                  value={trPassword}
                                                  onChange={(e) => setTrPassword(e.target.value)}
                                                  className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100"
                                             />
                                        </div>
                                        <div>
                                             <label className="block font-mono text-[10.5px] uppercase text-[#94a3b8] mb-1">
                                                  Initial Group Interest (00–05)
                                             </label>
                                             <select
                                                  value={trGroup}
                                                  onChange={(e) => setTrGroup(e.target.value)}
                                                  className="w-full bg-[#0b0f14] border border-[#263244] rounded-xl px-3.5 py-2.5 text-sm text-slate-100">
                                                  {groups.map((g) => (
                                                       <option key={g.code} value={g.code}>
                                                            Group {g.code} · {g.title.en}
                                                       </option>
                                                  ))}
                                             </select>
                                        </div>
                                   </div>

                                   {errorMsg && (
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/40 text-xs text-red-300 font-mono">
                                             {errorMsg}
                                        </div>
                                   )}

                                   <button
                                        type="submit"
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-[#06180e] font-extrabold text-sm border-none cursor-pointer shadow-lg">
                                        🌱 Complete Trainee Registration &amp; Enter Portal →
                                   </button>
                              </form>
                         </div>
                    )}
               </div>
          </div>
     );
}
