/**
 * STF-NHS v3.0 — Main Application Controller (App.jsx)
 * ---------------------------------------------------------------------------
 * Architecture:
 *   1. Public Splash Screen ("s-boot") -> Recruit Orientation Splash ("s-welcome")
 *   2. Recruit Splash TopNav (with "Recruit | Member | Admin" removed!)
 *   3. "I want to be a trainee" Self-Registration & Button-Based Role Login ("s-auth")
 *   4. Single-Device Session Lock + Auto-Logout on Tab/Browser Close (pagehide/beforeunload)
 *   5. Authenticated Sidebar Workspaces ("s-portal") for Admin, Project Member, and Trainee
 */

import { useState, useEffect, useRef } from "react";
import {
     getInitialDbState,
     saveDbState,
     getTabSession,
     getActiveDeviceLocks,
     setTabSession,
     releaseTabSessionLock,
     AVATARS,
} from "./assets/components/dbService.js";
import TopNav from "./assets/components/TopNav.jsx";
import Particles from "./assets/components/particles.jsx";
import IdleConsole from "./assets/components/idleConsole.jsx";

import WelcomeScreen from "./assets/screens/WelcomeScreen.jsx";
import AuthScreen from "./assets/screens/AuthScreen.jsx";
import PortalWorkspace from "./assets/screens/PortalWorkspace.jsx";
import AboutNhsScreen from "./assets/screens/s-nhs.jsx";
import GroupsScreen from "./assets/screens/s-groups.jsx";
import ComingSoonScreen from "./assets/screens/s-soon.jsx";
import HardwareScreen from "./assets/screens/s-hardware.jsx";
import ItInfraScreen from "./assets/screens/s-itinfra.jsx";
import TrackDetailScreen from "./assets/screens/s-track.jsx";
import LessonViewer from "./assets/screens/LessonViewer.jsx";

export default function App() {
     const [lang, setLang] = useState("en");
     const [currentScreen, setCurrentScreen] = useState("s-boot");
     const [authMode, setAuthMode] = useState("login"); // "login" | "register_trainee"
     const [activeSoonGroup, setActiveSoonGroup] = useState("iot");
     const [activeTrack, setActiveTrack] = useState("proxmox");
     const [trackParent, setTrackParent] = useState("s-itinfra");
     const [activeLessonIndex, setActiveLessonIndex] = useState(0);
     const [bootDone, setBootDone] = useState(false);

     const [dbState, setDbState] = useState(() => getInitialDbState());
     const [currentUserId, setCurrentUserId] = useState(() => {
          const sess = getTabSession();
          return sess ? sess.userId : null;
     });
     const [deviceLocks, setDeviceLocks] = useState(() => getActiveDeviceLocks());

     const tabIdRef = useRef(`tab_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);
     const bootLogRef = useRef(null);

     const currentUser = dbState.users.find((u) => u.id === currentUserId) || null;

     useEffect(() => {
          saveDbState(dbState);
     }, [dbState]);

     // Automatic Logout when Browser or Browser Tab Closes!
     useEffect(() => {
          if (!currentUser) return;
          const handleTabClose = () => {
               releaseTabSessionLock(currentUser.username);
          };
          window.addEventListener("pagehide", handleTabClose);
          window.addEventListener("beforeunload", handleTabClose);
          return () => {
               window.removeEventListener("pagehide", handleTabClose);
               window.removeEventListener("beforeunload", handleTabClose);
          };
     }, [currentUser]);

     const t = (obj) =>
          typeof obj === "string" ? obj : obj?.[lang] || obj?.en || "";

     const show = (id) => {
          setCurrentScreen(id);
          window.scrollTo(0, 0);
     };

     // Boot / Splash Screen Sequence
     useEffect(() => {
          if (currentScreen !== "s-boot" || bootDone) return;
          const blogEl = bootLogRef.current;
          if (!blogEl) return;
          blogEl.innerHTML = "";

          const bootLines = [
               ["", 90],
               ['<span class="text-slate-200">SFM — School For Ministers</span>', 0],
               [
                    '<span class="text-slate-200">Special Task Force · NHS Enterprise Portal v3.0</span>',
                    0,
               ],
               [
                    '<span class="text-[#2d4050]">────────────────────────────────────────────────</span>',
                    40,
               ],
               ["", 120],
               [
                    '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#64748b]">PHP 8.2 PDO + MySQL 8.0 Upgradable Engine Online</span>',
                    35,
               ],
               [
                    '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#64748b]">Single-Device Session Lock &amp; Penetration Shield Active</span>',
                    35,
               ],
               [
                    '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#64748b]">Ant Design + Motion.dev + AG-Grid Enterprise Loaded</span>',
                    35,
               ],
               ["", 100],
               [
                    '<span class="text-[#64748b]">  Group 00 · Hardware Group     </span><span class="text-green-400"> [  OPEN  ]</span>',
                    20,
               ],
               [
                    '<span class="text-[#64748b]">  Group 01 · I.O.T Group        </span><span class="text-amber-400">[ STANDBY ]</span>',
                    20,
               ],
               [
                    '<span class="text-[#64748b]">  Group 02 · Network Group      </span><span class="text-amber-400">[ STANDBY ]</span>',
                    20,
               ],
               [
                    '<span class="text-[#64748b]">  Group 03 · Admin Group        </span><span class="text-amber-400">[ STANDBY ]</span>',
                    20,
               ],
               [
                    '<span class="text-[#64748b]">  Group 04 · Inventory Group    </span><span class="text-amber-400">[ STANDBY ]</span>',
                    20,
               ],
               [
                    '<span class="text-[#64748b]">  Group 05 · I.T. Infrastructure</span><span class="text-green-400"> [  OPEN  ]</span>',
                    20,
               ],
               ["", 140],
               [
                    '<span class="text-sky-400">Launching NHS Recruit Orientation Splash...</span>',
                    0,
               ],
               ["", 500],
               ["CURSOR", 0],
          ];

          let bi = 0;
          let cancelled = false;

          const next = () => {
               if (cancelled || bi >= bootLines.length) return;
               const [html, delay] = bootLines[bi];
               if (html === "CURSOR") {
                    const c = document.createElement("span");
                    c.className =
                         "inline-block w-2 h-3.5 bg-sky-400 align-middle animate-pulse";
                    blogEl.appendChild(c);
                    setTimeout(() => {
                         if (!cancelled) {
                              setBootDone(true);
                              show("s-welcome");
                         }
                    }, 550);
                    return;
               }
               const s = document.createElement("span");
               s.className = "block";
               s.innerHTML = html || "&nbsp;";
               blogEl.appendChild(s);
               blogEl.scrollTop = blogEl.scrollHeight;
               bi++;
               setTimeout(next, delay);
          };

          const timer = setTimeout(next, 200);
          return () => {
               cancelled = true;
               clearTimeout(timer);
          };
     }, [currentScreen, bootDone]);

     // Auth Handlers
     const handleLoginSuccess = (user) => {
          setTabSession(user, tabIdRef.current);
          setDeviceLocks(getActiveDeviceLocks());
          setCurrentUserId(user.id);
          show("s-portal");
     };

     const handleRegisterTrainee = (newTrainee) => {
          setDbState((prev) => ({
               ...prev,
               users: [newTrainee, ...prev.users],
               completedLessonsByUser: {
                    ...prev.completedLessonsByUser,
                    [newTrainee.id]: ["hw-anatomy-L1"],
               },
               userSettings: {
                    ...prev.userSettings,
                    [newTrainee.id]: {
                         themeMode: "dark",
                         accentTheme: "emerald",
                         density: "comfortable",
                         motionEnabled: true,
                         language: lang,
                    },
               },
          }));
          setTabSession(newTrainee, tabIdRef.current);
          setDeviceLocks(getActiveDeviceLocks());
          setCurrentUserId(newTrainee.id);
          show("s-portal");
     };

     const handleLogout = () => {
          if (currentUser) {
               releaseTabSessionLock(currentUser.username);
          }
          setTabSession(null);
          setDeviceLocks(getActiveDeviceLocks());
          setCurrentUserId(null);
          show("s-welcome");
     };

     const handleSwitchAccount = () => {
          if (currentUser) {
               releaseTabSessionLock(currentUser.username);
          }
          setTabSession(null);
          setDeviceLocks(getActiveDeviceLocks());
          setCurrentUserId(null);
          setAuthMode("login");
          show("s-auth");
     };

     // Workspace Mutators
     const handleUpdateUserSetting = (patch) => {
          if (!currentUser) return;
          setDbState((prev) => ({
               ...prev,
               userSettings: {
                    ...prev.userSettings,
                    [currentUser.id]: {
                         ...(prev.userSettings?.[currentUser.id] || {
                              themeMode: "dark",
                              accentTheme: "gold",
                              density: "comfortable",
                              motionEnabled: true,
                              language: "en",
                         }),
                         ...patch,
                    },
               },
          }));
     };

     const handleUpdateAccountProfile = (patch) => {
          if (!currentUser) return;
          setDbState((prev) => ({
               ...prev,
               users: prev.users.map((u) =>
                    u.id === currentUser.id ? { ...u, ...patch } : u
               ),
          }));
     };

     const handleAddAccount = ({
          fullName,
          username,
          email,
          password,
          role,
          memberType,
          primaryGroup,
     }) => {
          const prefix =
               role === "admin"
                    ? "ADM"
                    : role === "trainee"
                    ? "TRN"
                    : memberType === "plenary"
                    ? "PLN"
                    : "MEM";
          const newUser = {
               id: Date.now(),
               sectorCode: `${prefix}-2026-${Math.floor(100 + Math.random() * 899)}`,
               username,
               password,
               fullName,
               email,
               role,
               memberType,
               primaryGroup,
               avatar:
                    role === "admin"
                         ? AVATARS.admin
                         : role === "trainee"
                         ? AVATARS.trainee
                         : AVATARS.member1,
               bio:
                    role === "member"
                         ? `Provisioned by Admin as ${memberType}`
                         : `Provisioned by Admin`,
               isActive: true,
               availability: "available",
               progressPct: role === "trainee" ? 20 : 85,
               orientationDone: role !== "trainee",
          };
          setDbState((prev) => ({
               ...prev,
               users: [newUser, ...prev.users],
          }));
     };

     const handleToggleUserActive = (userId) => {
          setDbState((prev) => ({
               ...prev,
               users: prev.users.map((u) =>
                    u.id === userId ? { ...u, isActive: !u.isActive } : u
               ),
          }));
     };

     const handleToggleUserAvailability = (userId) => {
          setDbState((prev) => ({
               ...prev,
               users: prev.users.map((u) =>
                    u.id === userId
                         ? {
                                ...u,
                                availability:
                                     u.availability === "available"
                                          ? "busy"
                                          : "available",
                           }
                         : u
               ),
          }));
     };

     const handlePromoteUser = (userId, nextRole, nextMemberType) => {
          setDbState((prev) => ({
               ...prev,
               users: prev.users.map((u) =>
                    u.id === userId
                         ? {
                                ...u,
                                role: nextRole,
                                memberType: nextMemberType,
                                sectorCode:
                                     nextMemberType === "project_member"
                                          ? u.sectorCode.replace(/^(PLN|TRN)/, "MEM")
                                          : u.sectorCode.replace(/^TRN/, "PLN"),
                           }
                         : u
               ),
          }));
     };

     const handleAddProject = ({
          name,
          description,
          priority,
          status,
          assignedTeamId,
          attachments,
          deadlineStart,
          deadlineEnd,
          createdBy,
     }) => {
          const newProjId = Date.now();
          const newProj = {
               id: newProjId,
               name,
               description,
               status: status || "Draft",
               priority: priority || "None",
               progressPct: status === "Finish project" ? 100 : 10,
               assignedTeamId,
               attachments: attachments || [],
               deadlineStart,
               deadlineEnd,
               createdAt: "2026-10-24",
               createdBy,
          };

          setDbState((prev) => {
               const nextCal = [...prev.calendarEvents];
               // Automatically add to Calendar if Deadline is set!
               if (deadlineStart) {
                    nextCal.unshift({
                         id: Date.now() + 1,
                         title: `[Project] ${name}`,
                         description: description || "Auto-synced project deadline",
                         tag: "Project Deadline",
                         priority: priority || "None",
                         preset: "project_sync",
                         startDate: deadlineStart,
                         endDate: deadlineEnd || deadlineStart,
                         addedBy: createdBy,
                         linkedProjectId: newProjId,
                    });
               }
               return {
                    ...prev,
                    projects: [newProj, ...prev.projects],
                    calendarEvents: nextCal,
               };
          });
     };

     const handleUpdateProjectStatus = (projectId, newStatus) => {
          setDbState((prev) => ({
               ...prev,
               projects: prev.projects.map((p) =>
                    p.id === projectId
                         ? {
                                ...p,
                                status: newStatus,
                                progressPct:
                                     newStatus === "Finish project"
                                          ? 100
                                          : p.progressPct,
                           }
                         : p
               ),
          }));
     };

     const handleCreateTeam = ({ name, groupCode, leadUserId, memberIds, description }) => {
          setDbState((prev) => ({
               ...prev,
               teams: [
                    ...prev.teams,
                    {
                         id: Date.now(),
                         name,
                         groupCode,
                         leadUserId,
                         memberIds,
                         description,
                    },
               ],
          }));
     };

     const handleAssignTeamToProject = (projectId, teamId) => {
          setDbState((prev) => ({
               ...prev,
               projects: prev.projects.map((p) =>
                    p.id === Number(projectId)
                         ? { ...p, assignedTeamId: Number(teamId) }
                         : p
               ),
          }));
     };

     const handleAddCalendarEvent = (ev) => {
          setDbState((prev) => ({
               ...prev,
               calendarEvents: [{ id: Date.now(), ...ev }, ...prev.calendarEvents],
          }));
     };

     const handleToggleLessonComplete = (lessonId) => {
          const uid = currentUser ? currentUser.id : 8;
          setDbState((prev) => {
               const curList = prev.completedLessonsByUser?.[uid] || [];
               const exists = curList.includes(lessonId);
               const nextList = exists
                    ? curList.filter((id) => id !== lessonId)
                    : [...curList, lessonId];
               return {
                    ...prev,
                    completedLessonsByUser: {
                         ...prev.completedLessonsByUser,
                         [uid]: nextList,
                    },
               };
          });
     };

     // If signed in and on s-portal, render the full Sidebar/Navbar PortalWorkspace
     if (currentScreen === "s-portal" && currentUser) {
          return (
               <PortalWorkspace
                    currentUser={currentUser}
                    dbState={dbState}
                    userSetting={dbState.userSettings?.[currentUser.id]}
                    onUpdateUserSetting={handleUpdateUserSetting}
                    onUpdateAccountProfile={handleUpdateAccountProfile}
                    onAddAccount={handleAddAccount}
                    onToggleUserActive={handleToggleUserActive}
                    onToggleUserAvailability={handleToggleUserAvailability}
                    onPromoteUser={handlePromoteUser}
                    onAddProject={handleAddProject}
                    onUpdateProjectStatus={handleUpdateProjectStatus}
                    onCreateTeam={handleCreateTeam}
                    onAssignTeamToProject={handleAssignTeamToProject}
                    onAddCalendarEvent={handleAddCalendarEvent}
                    onToggleLessonComplete={handleToggleLessonComplete}
                    onLogout={handleLogout}
                    onSwitchAccount={handleSwitchAccount}
               />
          );
     }

     const currentTrackObj =
          trackParent === "s-hardware"
               ? dbState.hwTracks.find((x) => x.id === activeTrack)
               : dbState.itTracks[activeTrack];

     return (
          <div className="relative min-h-screen bg-[#08090c] text-slate-200 font-['Space_Grotesk'] antialiased no-scrollbar">
               {/* Background Video */}
               <video
                    src="/videos/robot-transparent.webm"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="fixed mx-[20%] inset-0 w-[70%] h-full object-cover opacity-5 pointer-events-none z-0"
               />

               <Particles count={70} />
               <IdleConsole idleMs={60000} enabled={bootDone} />

               {/* Public Recruit TopNav (with "Recruit | Member | Admin" removed!) */}
               <TopNav
                    lang={lang}
                    setLang={setLang}
                    currentScreen={currentScreen}
                    onNavigate={show}
                    onOpenTraineeRegister={() => {
                         setAuthMode("register_trainee");
                         show("s-auth");
                    }}
                    onOpenLogin={() => {
                         setAuthMode("login");
                         show("s-auth");
                    }}
               />

               <main className="relative z-10">
                    {currentScreen === "s-boot" && (
                         <div className="min-h-screen flex flex-col items-start justify-between p-10 md:p-14">
                              <div
                                   ref={bootLogRef}
                                   className="font-mono text-[13px] leading-[1.9] text-[#4a6070] max-w-2xl"
                              />
                              <button
                                   type="button"
                                   onClick={() => {
                                        setBootDone(true);
                                        show("s-welcome");
                                   }}
                                   className="font-mono text-xs text-[#64748b] hover:text-[#f0a500] bg-[#131920] border border-[#1c2530] rounded-lg px-4 py-2 cursor-pointer">
                                   Skip Splash Sequence →
                              </button>
                         </div>
                    )}

                    {currentScreen === "s-welcome" && (
                         <WelcomeScreen
                              t={t}
                              lang={lang}
                              onNavigate={show}
                              onOpenTraineeRegister={() => {
                                   setAuthMode("register_trainee");
                                   show("s-auth");
                              }}
                              onOpenLogin={() => {
                                   setAuthMode("login");
                                   show("s-auth");
                              }}
                         />
                    )}

                    {currentScreen === "s-auth" && (
                         <AuthScreen
                              mode={authMode}
                              setMode={setAuthMode}
                              users={dbState.users}
                              groups={dbState.groups}
                              activeDeviceLocks={deviceLocks}
                              simulatedRemoteSessions={dbState.simulatedRemoteSessions}
                              onToggleSimulatedRemote={(uname) =>
                                   setDbState((prev) => ({
                                        ...prev,
                                        simulatedRemoteSessions: {
                                             ...prev.simulatedRemoteSessions,
                                             [uname]: !prev.simulatedRemoteSessions?.[uname],
                                        },
                                   }))
                              }
                              onForceClearRemoteLock={(uname) => {
                                   releaseTabSessionLock(uname);
                                   setDeviceLocks(getActiveDeviceLocks());
                              }}
                              onLoginSuccess={handleLoginSuccess}
                              onRegisterTrainee={handleRegisterTrainee}
                              onBackToSplash={() => show("s-welcome")}
                         />
                    )}

                    {currentScreen === "s-nhs" && (
                         <AboutNhsScreen
                              t={t}
                              userType="recruit"
                              onNavigate={show}
                              completedChecklist={["read_hierarchy"]}
                              onToggleChecklist={() => {}}
                         />
                    )}

                    {currentScreen === "s-groups" && (
                         <GroupsScreen
                              t={t}
                              userType="recruit"
                              groups={dbState.groups}
                              onNavigate={show}
                              onOpenGroup={(g) => {
                                   if (g.slug === "hardware") show("s-hardware");
                                   else if (g.slug === "itinfra") show("s-itinfra");
                                   else {
                                        setActiveSoonGroup(g.slug);
                                        show("s-soon");
                                   }
                              }}
                         />
                    )}

                    {currentScreen === "s-soon" && (
                         <ComingSoonScreen
                              t={t}
                              activeSoonGroup={activeSoonGroup}
                              groups={dbState.groups}
                              onNavigate={show}
                              onOpenTrack={(tid, parent) => {
                                   setActiveTrack(tid);
                                   setTrackParent(parent);
                                   show("s-track");
                              }}
                         />
                    )}

                    {currentScreen === "s-hardware" && (
                         <HardwareScreen
                              t={t}
                              lang={lang}
                              userType="recruit"
                              hwTracks={dbState.hwTracks}
                              completedLessons={["hw-anatomy-L1"]}
                              onNavigate={show}
                              onOpenTrack={(tid, parent) => {
                                   setActiveTrack(tid);
                                   setTrackParent(parent);
                                   show("s-track");
                              }}
                         />
                    )}

                    {currentScreen === "s-itinfra" && (
                         <ItInfraScreen
                              t={t}
                              lang={lang}
                              itTracks={dbState.itTracks}
                              completedLessons={["proxmox-L1"]}
                              onNavigate={show}
                              onOpenTrack={(tid, parent) => {
                                   setActiveTrack(tid);
                                   setTrackParent(parent);
                                   show("s-track");
                              }}
                         />
                    )}

                    {currentScreen === "s-track" && (
                         <TrackDetailScreen
                              t={t}
                              activeTrack={activeTrack}
                              trackParent={trackParent}
                              itTracks={dbState.itTracks}
                              hwTracks={dbState.hwTracks}
                              completedLessons={["hw-anatomy-L1", "proxmox-L1"]}
                              onNavigate={show}
                              onLaunchLesson={(idx) => {
                                   setActiveLessonIndex(idx);
                                   show("s-lesson");
                              }}
                         />
                    )}

                    {currentScreen === "s-lesson" && (
                         <LessonViewer
                              t={t}
                              lang={lang}
                              track={currentTrackObj}
                              activeLessonIndex={activeLessonIndex}
                              setActiveLessonIndex={setActiveLessonIndex}
                              completedLessons={["hw-anatomy-L1", "proxmox-L1"]}
                              onToggleLessonComplete={handleToggleLessonComplete}
                              onBackToTrack={() => show("s-track")}
                         />
                    )}
               </main>
          </div>
     );
}
