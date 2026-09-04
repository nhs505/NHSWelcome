import { useState, useEffect, useRef } from "react";
import { C, soonData, trackData, hwTrackData } from "./assets/components/content.js";
import WelcomeScreen from "./assets/components/WelcomeScreen.jsx";
import Particles from "./assets/components/particles.jsx";
/* NHS Welcome Portal — React + Tailwind CSS
 * Screens extracted little by little into ./components/
 */

export default function App() {
  const [lang, setLang] = useState("en");
  const [userType, setUserType] = useState("recruit");
  const [currentScreen, setCurrentScreen] = useState("s-boot");
  const [activeSoonGroup, setActiveSoonGroup] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const [trackParent, setTrackParent] = useState("s-itinfra");
  const [bootDone, setBootDone] = useState(false);
  const [langVisible, setLangVisible] = useState(false);
  const canvasRef = useRef(null);
  const bootLogRef = useRef(null);

  const t = (obj) =>
    typeof obj === "string" ? obj : obj?.[lang] || obj?.en || "";
  const show = (id) => {
    setCurrentScreen(id);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const cx = cv.getContext("2d");
    let pts = [],
      animId;
    const rsz = () => {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
    };
    const mkPts = () => {
      pts = Array.from({ length: 200 }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        r: Math.random() * 0.7 + 0.1,
        a: Math.random(),
        d: Math.random() * 0.002 + 0.0005,
      }));
    };
    const draw = () => {
      cx.clearRect(0, 0, cv.width, cv.height);
      pts.forEach((p) => {
        p.a += p.d;
        if (p.a > 1 || p.a < 0) p.d *= -1;
        cx.globalAlpha = p.a * 0.45;
        cx.fillStyle = "#7aa2bf";
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cx.fill();
      });
      cx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };
    rsz();
    mkPts();
    draw();
    const onResize = () => {
      rsz();
      mkPts();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (currentScreen !== "s-boot" || bootDone) return;
    const blogEl = bootLogRef.current;
    if (!blogEl) return;
    const bootLines = [
      ["", 120],
      ['<span class="text-slate-200">SFM — School For Ministers</span>', 0],
      [
        '<span class="text-slate-200">Special Task Force · Operational Portal</span>',
        0,
      ],
      [
        '<span class="text-[#2d4050]">────────────────────────────────────────────────</span>',
        60,
      ],
      ["", 200],
      [
        '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#2d4050]">Loading STF member registry...</span>',
        0,
      ],
      [
        '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#2d4050]">STF teams online — 5 active groups.</span>',
        50,
      ],
      [
        '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#2d4050]">NHS member portal: initializing...</span>',
        60,
      ],
      ["", 150],
      [
        '<span class="text-[#2d4050]">  Group 00 · Hardware Group     </span><span class="text-green-400"> [  OPEN  ]</span>',
        30,
      ],
      [
        '<span class="text-[#2d4050]">  Group 01 · I.O.T Group        </span><span class="text-amber-400">[ STANDBY ]</span>',
        30,
      ],
      [
        '<span class="text-[#2d4050]">  Group 02 · Network Group      </span><span class="text-amber-400">[ STANDBY ]</span>',
        30,
      ],
      [
        '<span class="text-[#2d4050]">  Group 03 · Admin Group        </span><span class="text-amber-400">[ STANDBY ]</span>',
        30,
      ],
      [
        '<span class="text-[#2d4050]">  Group 04 · Inventory Group    </span><span class="text-amber-400">[ STANDBY ]</span>',
        30,
      ],
      [
        '<span class="text-[#2d4050]">  Group 05 · I.T. Infrastructure</span><span class="text-green-400"> [  OPEN  ]</span>',
        30,
      ],
      ["", 250],
      [
        '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#2d4050]">STF is a program of SFM — equipping students for the future.</span>',
        60,
      ],
      [
        '<span class="text-green-400">[  OK  ]</span>  <span class="text-[#2d4050]">NHS: developing technology skills and building real projects.</span>',
        60,
      ],
      ["", 180],
      ['<span class="text-sky-400">NHS Welcome Portal — ready.</span>', 0],
      ["", 700],
      ["CURSOR", 0],
    ];
    let bi = 0,
      cancelled = false;
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
            setLangVisible(true);
            setBootDone(true);
            show("s-welcome");
          }
        }, 900);
        return;
      }
      const s = document.createElement("span");
      s.className = "block";
      s.innerHTML = html || "&nbsp;";
      blogEl.appendChild(s);
      blogEl.scrollTop = blogEl.scrollHeight;
      bi++;
      setTimeout(next, delay + Math.random() * 18);
    };
    const timer = setTimeout(next, 380);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [currentScreen, bootDone]);


  // ── Content imported from ./data/content.js ──

  const BackBtn = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 bg-transparent border border-[#1c2530] text-[#64748b] font-mono text-[11.5px] px-3.5 py-1.5 rounded-md cursor-pointer mb-7 hover:text-slate-200 hover:border-[#64748b] transition-colors">
      {children}
    </button>
  );
  const ProceedBtn = ({ children, onClick }) => (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2.5 bg-linear-to-br from-[#f0a500] to-[#e09000] text-[#1a0e00] font-extrabold text-base border-none rounded-[11px] px-8 py-4 cursor-pointer shadow-[0_0_28px_rgba(240,165,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(240,165,0,0.5)] transition-all font-['Space_Grotesk']">
      {children}
    </button>
  );
  const Screen = ({ id, children, className = "" }) => (
    <div
      className={`${currentScreen === id ? "flex" : "hidden"} min-h-screen flex-col ${className}`}>
      {children}
    </div>
  );

  return (
    
    <div className="relative min-h-screen bg-[#08090c] text-slate-200 font-['Space_Grotesk'] antialiased no-scrollbar">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
      <Particles />
      <div className="fixed inset-0 z-1 bg-[radial-linear(ellipse_90%_80%_at_50%_50%,transparent_40%,rgba(8,9,12,0.75))] pointer-events-none" />
      <div className="fixed inset-0 z-2 bg-[repeating-linear-linear(0deg,transparent,transparent_3px,rgba(0,0,0,0.06)_3px,rgba(0,0,0,0.06)_4px)] pointer-events-none" />
      <div
        className={`fixed top-4.5 right-5 z-200 flex gap-0 bg-[#131920] border border-[#1c2530] rounded-[20px] overflow-hidden transition-opacity duration-300 ${langVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {["en", "tl"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`bg-transparent border-none font-mono text-[11px] px-3.75 py-2 cursor-pointer tracking-[0.08em] transition-colors ${lang === l ? "bg-[#181f28] text-[#f0a500]" : "text-[#64748b] hover:text-slate-200"}`}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="relative z-10">
        <Screen
          id="s-boot"
          className="items-start justify-start p-12 md:p-[48px_52px]">
          <div
            ref={bootLogRef}
            className="font-mono text-[13px] leading-[1.9] text-[#4a6070] max-w-175"
          />
        </Screen>

        {/* Welcome screen — extracted component + optional Router path */}
        <Screen
          id="s-welcome"
          className="items-center justify-center p-10 md:p-[40px_24px]">
          <WelcomeScreen t={t} setUserType={setUserType} onNavigate={show} />
        </Screen>

        <Screen id="s-nhs">
          <div className="max-w-225 w-full mx-auto px-6 py-15 pb-20">
            <BackBtn onClick={() => show("s-welcome")}>
              {t(C.nhs.backToWelcome)}
            </BackBtn>
            {userType === "recruit" ? (
              <div className="rounded-[14px] p-[22px_24px] mb-9 bg-[rgba(240,165,0,0.08)] border border-[rgba(240,165,0,0.2)]">
                <div className="font-mono text-[10.5px] tracking-[0.15em] uppercase mb-2 text-[#f0a500]">
                  {t(C.rb.label)}
                </div>
                <div className="text-base font-bold mb-1.5">
                  {t(C.rb.title)}
                </div>
                <div className="text-[13.5px] leading-relaxed text-[#9d8b6e]">
                  {t(C.rb.desc)}
                </div>
              </div>
            ) : (
              <div className="rounded-[14px] p-[22px_24px] mb-9 bg-[rgba(56,189,248,0.07)] border border-[rgba(56,189,248,0.2)]">
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
            <div className="flex items-center gap-0 my-11 flex-wrap">
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
                    className={`bg-[#131920] border rounded-[10px] p-[18px_22px] flex-1 min-w-40 ${item.hi ? "border-[rgba(240,165,0,0.35)] bg-[#140f00]" : "border-[#1c2530]"}`}>
                    <div
                      className={`font-mono text-[10px] tracking-[0.15em] uppercase mb-1.5 ${item.hi ? "text-[#f0a500]" : "text-[#64748b]"}`}>
                      {item.code}
                    </div>
                    <div className="text-base font-bold mb-1">{item.name}</div>
                    <div className="text-xs text-[#64748b] leading-relaxed">
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5 mb-12">
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
            <div className="bg-[#131920] border border-[rgba(74,222,128,0.2)] rounded-2xl p-7 mb-12">
              <h3 className="text-xl font-bold mb-1.5">
                {t(C.nhs.whoH).replace(t(C.nhs.whoHl), "")}
                <span className="text-green-400">{t(C.nhs.whoHl)}</span>
                {t(C.nhs.whoH).includes("?") ? "?" : ""}
              </h3>
              <p className="text-[14.5px] text-[#64748b] mb-5 leading-relaxed">
                {t(C.nhs.whoLead)}
              </p>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
                {C.nhs.who.map((w, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 text-[13.5px] text-[#64748b] leading-relaxed">
                    <span className="text-green-400 font-bold shrink-0">
                      ✓
                    </span>
                    {t(w)}{" "}
                    <strong className="text-slate-200 ml-1">Welcome.</strong>
                  </div>
                ))}
              </div>
            </div>
            <hr className="border-none border-t border-[#1c2530] my-11" />
            <p className="text-[clamp(14.5px,1.8vw,17px)] text-[#64748b] leading-[1.75] max-w-[64ch] mb-8">
              {t(C.nhs.divLead)}
            </p>
            <div className="flex justify-center">
              <ProceedBtn onClick={() => show("s-groups")}>
                {t(C.nhs.seeGroups)}
              </ProceedBtn>
            </div>
          </div>
        </Screen>

        <Screen id="s-groups">
          <div className="max-w-225 w-full mx-auto px-6 py-15 pb-20">
            <BackBtn onClick={() => show("s-nhs")}>{t(C.grp.back)}</BackBtn>
            <div className="mb-11">
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-4.25">
              <div
                onClick={() => show("s-hardware")}
                className="bg-[#131920] border border-[#1c2530] rounded-[15px] p-[24px_22px] cursor-pointer relative overflow-hidden transition-all hover:-translate-y-0.75 flex flex-col hover:border-[rgba(74,222,128,0.4)] hover:bg-[rgba(74,222,128,0.03)]">
                <div className="absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r from-green-400 to-[#f0a500]" />
                <div className="inline-flex items-center gap-1.5 bg-[rgba(74,222,128,0.1)] border border-[rgba(74,222,128,0.3)] rounded-[20px] px-3 py-1 font-mono text-[9.5px] text-green-400 tracking-[0.08em] uppercase mb-2.5 w-fit">
                  {t(C.grp.startHere)}
                </div>
                <div className="text-[30px] mb-3">🔧</div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase mb-1.5 text-green-400">
                  {t(C.grp.g00tag)}
                </div>
                <div className="text-lg font-bold mb-1.5">
                  {t(C.grp.g00title)}
                </div>
                <div className="text-[13px] text-[#64748b] leading-relaxed flex-1">
                  {t(C.grp.g00desc)}
                </div>
                <div className="mt-3.5 flex items-center gap-1.5 font-mono text-[10.5px] text-[#f0a500]">
                  <span className="w-1.75 h-1.75 rounded-full bg-[#f0a500] shadow-[0_0_6px_rgba(240,165,0,0.5)]" />
                  {t(C.grp.statusOpen)}
                </div>
                <button className="mt-3 w-full border text-[13px] font-semibold py-2.5 rounded-lg cursor-pointer bg-[rgba(74,222,128,0.12)] border-[rgba(74,222,128,0.3)] text-green-400">
                  {t(C.grp.enterHw)}
                </button>
              </div>
              {[
                {
                  cls: "iot",
                  key: "01",
                  icon: "🌐",
                  bar: "from-purple-400 to-violet-600",
                  tag: "text-purple-400",
                },
                {
                  cls: "net",
                  key: "02",
                  icon: "📡",
                  bar: "from-sky-400 to-sky-600",
                  tag: "text-sky-400",
                },
                {
                  cls: "adm",
                  key: "03",
                  icon: "🗂️",
                  bar: "from-green-400 to-green-600",
                  tag: "text-green-400",
                },
                {
                  cls: "inv",
                  key: "04",
                  icon: "📦",
                  bar: "from-orange-400 to-orange-600",
                  tag: "text-orange-400",
                },
                {
                  cls: "itinfra",
                  key: "05",
                  icon: "🖥️",
                  bar: "from-[#f0a500] to-[#ffc040]",
                  tag: "text-[#f0a500]",
                },
              ].map(({ cls, key, icon, bar, tag }) => {
                const isInfra = cls === "itinfra";
                return (
                  <div
                    key={cls}
                    onClick={() => {
                      if (isInfra) show("s-itinfra");
                      else {
                        setActiveSoonGroup(cls === "net" ? "network" : cls);
                        show("s-soon");
                      }
                    }}
                    className={`bg-[#131920] border border-[#1c2530] rounded-[15px] p-[24px_22px] cursor-pointer relative overflow-hidden transition-all hover:-translate-y-0.75 flex flex-col ${isInfra ? "hover:border-[rgba(240,165,0,0.4)] hover:bg-[#12100a]" : ""}`}>
                    <div
                      className={`absolute top-0 left-0 right-0 h-0.75 bg-linear-to-r ${bar}`}
                    />
                    <div className="text-[30px] mb-3">{icon}</div>
                    <div
                      className={`font-mono text-[10px] tracking-[0.12em] uppercase mb-1.5 ${tag}`}>
                      {t(C.grp[`g${key}tag`])}
                    </div>
                    <div className="text-lg font-bold mb-1.5">
                      {t(C.grp[`g${key}title`])}
                    </div>
                    <div className="text-[13px] text-[#64748b] leading-relaxed flex-1">
                      {t(C.grp[`g${key}desc`])}
                    </div>
                    <div
                      className={`mt-3.5 flex items-center gap-1.5 font-mono text-[10.5px] ${isInfra ? "text-[#f0a500]" : "text-[#2d3a47]"}`}>
                      <span
                        className={`w-1.75 h-1.75 rounded-full ${isInfra ? "bg-[#f0a500] shadow-[0_0_6px_rgba(240,165,0,0.5)]" : "bg-[#2d3a47]"}`}
                      />
                      {isInfra ? t(C.grp.statusOpen) : t(C.grp.statusSoon)}
                    </div>
                    <button
                      className={`mt-3 w-full border text-[13px] font-semibold py-2.5 rounded-lg cursor-pointer ${isInfra ? "bg-[rgba(240,165,0,0.12)] border-[rgba(240,165,0,0.3)] text-[#f0a500]" : "bg-[#181f28] border-[#1c2530] text-slate-200"}`}>
                      {isInfra
                        ? t(C.grp.enterItInfra)
                        : `${t(C.grp.enterBtn)} ${t(C.grp[`g${key}title`])} →`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Screen>

        <Screen id="s-soon">
          {activeSoonGroup && soonData[activeSoonGroup] && (
            <div className="max-w-130 mx-auto px-6 py-14 pb-20">
              <BackBtn onClick={() => show("s-groups")}>
                {t(C.soon.backBtn)}
              </BackBtn>
              <div className="text-[52px] mb-5">
                {soonData[activeSoonGroup].icon}
              </div>
              <div className="font-mono text-[11px] tracking-[0.2em] text-[#64748b] uppercase mb-2.5">
                {t(C.soon.tag)}
              </div>
              <h2 className="text-[30px] font-extrabold mb-2.5">
                {t(soonData[activeSoonGroup].title)}
              </h2>
              <p className="text-[14.5px] text-[#64748b] leading-relaxed mb-7">
                {t(C.soon.lead)}
              </p>
              <div className="bg-[#131920] border border-[#1c2530] rounded-[10px] p-4 mb-7">
                <div className="font-mono text-[10.5px] text-[#64748b] mb-2.5 tracking-widest">
                  {t(C.soon.barLabel)}
                </div>
                <div className="bg-[#1c2530] rounded h-1.5 overflow-hidden">
                  <div className="h-full bg-linear-to-r from-[#f0a500] to-[#ffc040] rounded w-[15%]" />
                </div>
              </div>
              <div className="font-mono text-[11px] tracking-[0.2em] text-[#64748b] uppercase mb-2.5">
                {t(C.soon.featLabel)}
              </div>
              <div className="flex flex-col gap-2 mb-7">
                {(
                  t(soonData[activeSoonGroup].features) ||
                  soonData[activeSoonGroup].features.en
                ).map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-[13.5px] text-[#64748b] p-[9px_12px] bg-[#131920] border border-[#1c2530] rounded-lg">
                    <span>⚙️</span>
                    {f}
                  </div>
                ))}
              </div>
              <ProceedBtn onClick={() => show("s-groups")}>
                {t(C.soon.backBtn)}
              </ProceedBtn>
            </div>
          )}
        </Screen>

        <Screen id="s-itinfra">
          <div className="max-w-255 w-full mx-auto px-6 py-15 pb-20">
            <BackBtn onClick={() => show("s-groups")}>{t(C.itf.back)}</BackBtn>
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
            <div className="bg-[#131920] border border-[rgba(240,165,0,0.2)] rounded-[15px] p-7 mb-12 relative overflow-hidden">
              <div className="font-mono text-[10.5px] tracking-[0.15em] text-[#f0a500] uppercase mb-2.5">
                {t(C.itf.abLabel)}
              </div>
              <div
                className="text-[clamp(14px,1.6vw,16px)] text-slate-200 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: t(C.itf.abText) }}
              />
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-3.75">
              {Object.keys(trackData).map((id) => {
                const d = trackData[id];
                const avail = d.lessons.filter((l) => l.available).length;
                const levelMap = {
                  beginner: t({ en: "Beginner", tl: "Simula" }),
                  intermediate: t({ en: "Intermediate", tl: "Katamtaman" }),
                  advanced: t({ en: "Advanced", tl: "Advanced" }),
                };
                return (
                  <div
                    key={id}
                    onClick={() => {
                      setActiveTrack(id);
                      setTrackParent("s-itinfra");
                      show("s-track");
                    }}
                    className="bg-[#131920] border border-[#1c2530] rounded-[13px] p-5 cursor-pointer relative overflow-hidden transition-all hover:-translate-y-0.5 flex flex-col">
                    <div className="text-[26px] mb-2.5">{d.icon}</div>
                    <span
                      className={`font-mono text-[9.5px] tracking-widest uppercase border rounded px-2 py-0.5 inline-block mb-1.5 ${d.level === "beginner" ? "text-green-400 border-[rgba(74,222,128,0.3)]" : d.level === "intermediate" ? "text-amber-400 border-[rgba(245,158,11,0.3)]" : "text-red-400 border-[rgba(248,113,113,0.3)]"}`}>
                      {levelMap[d.level]}
                    </span>
                    <div className="text-[15.5px] font-bold mb-1.5">
                      {t(d.title)}
                    </div>
                    <div className="text-xs text-[#64748b] leading-relaxed flex-1 mb-3">
                      {t(d.desc).substring(0, 130)}…
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      {avail > 0 ? (
                        <>
                          <span className="font-mono text-[10px] text-green-400">
                            ✓ {avail} {t(C.td.availNow)}
                          </span>
                          <button className="font-semibold text-xs px-3 py-1.5 rounded-md border border-[#1c2530] bg-[#181f28] text-slate-200">
                            {lang === "tl" ? "Buksan" : "Open"} →
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-mono text-[10px] text-[#2d3a47]">
                            📦 {t(C.td.soon)}
                          </span>
                          <button className="font-semibold text-xs px-3 py-1.5 rounded-md border border-[#1c2530] bg-[#181f28] text-[#2d3a47]">
                            {lang === "tl" ? "Tingnan" : "View"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Screen>

        <Screen id="s-hardware">
          <div className="max-w-255 w-full mx-auto px-6 py-15 pb-20">
            <BackBtn onClick={() => show("s-groups")}>{t(C.hw.back)}</BackBtn>
            <div className="bg-[rgba(74,222,128,0.06)] border border-[rgba(74,222,128,0.2)] rounded-xl px-4.5 py-3.5 mb-8 font-mono text-[11.5px] text-green-400 flex items-center gap-2.5">
              🔧 {t(C.hw.strip)}
            </div>
            <div className="mb-12">
              <div className="font-mono text-[11px] tracking-[0.22em] text-[#f0a500] uppercase mb-2.5">
                {t(C.hw.eyebrow)}
              </div>
              <h1 className="text-[clamp(28px,5vw,58px)] font-extrabold leading-[1.05] tracking-tight mb-3.5 text-slate-200">
                {t(C.hw.h1)}{" "}
                <span className="text-green-400">{t(C.hw.h2)}</span>
                <br />
                {t(C.hw.h3)}
              </h1>
              <p className="text-[clamp(14px,1.8vw,17.5px)] text-[#64748b] leading-[1.75] max-w-[60ch] mb-6">
                {t(C.hw.lead)}
              </p>
              <div className="flex gap-2.5 flex-wrap">
                {(lang === "tl" ? C.hw.chips.tl : C.hw.chips.en).map((c) => (
                  <span
                    key={c}
                    className="font-mono text-[11px] border border-[#1c2530] rounded-[20px] px-3.5 py-1.5 text-[#64748b]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#131920] border border-[rgba(74,222,128,0.2)] rounded-[15px] p-7 mb-12">
              <div className="font-mono text-[10.5px] tracking-[0.15em] text-green-400 uppercase mb-2.5">
                {t(C.hw.abLabel)}
              </div>
              <div
                className="text-[clamp(14px,1.6vw,16px)] text-slate-200 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: t(C.hw.abText) }}
              />
            </div>
            <div className="font-mono text-[11px] tracking-[0.22em] text-[#64748b] uppercase mb-2">
              {t(C.hw.tracksLabel)}
            </div>
            <h2 className="text-[clamp(20px,3vw,28px)] font-bold mb-1.5">
              {t(C.hw.tracksH)}
            </h2>
            <p className="text-sm text-[#64748b] mb-7 leading-relaxed">
              {t(C.hw.tracksSub)}
            </p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-3.75">
              {hwTrackData.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setActiveTrack(d.id);
                    setTrackParent("s-hardware");
                    show("s-track");
                  }}
                  className="bg-[#131920] border border-[#1c2530] rounded-[13px] p-5 cursor-pointer relative overflow-hidden transition-all hover:-translate-y-0.5 flex flex-col"
                  style={{ borderBottom: `2px solid ${d.color}` }}>
                  <div className="text-[26px] mb-2.5">{d.icon}</div>
                  <span
                    className={`font-mono text-[9.5px] tracking-widest uppercase border rounded px-2 py-0.5 inline-block mb-1.5 ${d.level === "beginner" ? "text-green-400 border-[rgba(74,222,128,0.3)]" : "text-amber-400 border-[rgba(245,158,11,0.3)]"}`}>
                    {t(d.levelLabel)}
                  </span>
                  <div className="text-[15.5px] font-bold mb-1.5">
                    {t(d.title)}
                  </div>
                  <div className="text-xs text-[#64748b] leading-relaxed flex-1 mb-3">
                    {t(d.desc).substring(0, 130)}…
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-[10px] text-[#64748b]">
                      {d.lessons.length} {t(C.td.lessons)}
                    </span>
                    <button className="font-semibold text-xs px-3 py-1.5 rounded-md border border-[#1c2530] bg-[#181f28] text-slate-200">
                      {lang === "tl" ? "Tingnan" : "View"} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Screen>

        <Screen id="s-track">
          {activeTrack &&
            (() => {
              const isHw = trackParent === "s-hardware";
              const d = isHw
                ? hwTrackData.find((x) => x.id === activeTrack)
                : trackData[activeTrack];
              if (!d) return null;
              const avail = d.lessons.filter((l) => l.available);
              return (
                <div className="max-w-215 w-full mx-auto px-6 py-14 pb-20">
                  <BackBtn
                    onClick={() => {
                      if (isHw) show("s-hardware");
                      else show("s-itinfra");
                    }}>
                    {isHw
                      ? t(C.hw.back)
                        .replace("all groups", "Hardware Group")
                        .replace("lahat ng pangkat", "Hardware Group")
                      : t(C.td.back)}
                  </BackBtn>
                  <div className="mb-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-15 h-15 rounded-[13px] flex items-center justify-center text-[27px] shrink-0"
                        style={{
                          background: `${d.color}15`,
                          border: `1px solid ${d.color}40`,
                        }}>
                        {d.icon}
                      </div>
                      <div>
                        <div className="font-mono text-[10.5px] tracking-[0.18em] text-[#64748b] uppercase mb-1">
                          {isHw
                            ? "NHS · Hardware Group · Learning Track"
                            : t(C.td.eyebrow)}
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
                        className={`font-mono text-[10.5px] border rounded-[20px] px-3 py-1 ${d.level === "beginner" ? "text-green-400 border-[rgba(74,222,128,0.3)]" : d.level === "intermediate" ? "text-amber-400 border-[rgba(245,158,11,0.3)]" : "text-red-400 border-[rgba(248,113,113,0.3)]"}`}>
                        {t(d.levelLabel)}
                      </span>
                      <span className="font-mono text-[10.5px] border border-[#1c2530] rounded-[20px] px-3 py-1 text-[#64748b]">
                        {d.lessons.length} {t(C.td.lessons)}
                      </span>
                      {avail.length > 0 ? (
                        <span className="font-mono text-[10.5px] border border-[rgba(74,222,128,0.3)] rounded-[20px] px-3 py-1 text-green-400">
                          {avail.length} {t(C.td.availNow)}
                        </span>
                      ) : (
                        <span className="font-mono text-[10.5px] border border-[#1c2530] rounded-[20px] px-3 py-1 text-[#64748b]">
                          {t(C.td.building)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className="bg-[#131920] border border-[#1c2530] border-l-[3px] rounded-r-xl p-5 mb-8"
                    style={{ borderLeftColor: d.color }}>
                    <div
                      className="font-mono text-[10px] tracking-[0.15em] uppercase mb-2.5"
                      style={{ color: d.color }}>
                      {t(C.td.abLabel)}
                    </div>
                    <div
                      className="text-[15px] text-slate-200 leading-[1.75]"
                      dangerouslySetInnerHTML={{ __html: t(d.analogy) }}
                    />
                  </div>
                  <div className="font-mono text-[10.5px] tracking-[0.18em] text-[#64748b] uppercase mb-3">
                    {t(C.td.llLabel)} · {d.lessons.length} {t(C.td.lessons)}
                  </div>
                  <div className="flex flex-col gap-1.5 mb-7">
                    {d.lessons.map((l) => (
                      <div
                        key={l.n}
                        onClick={() => {
                          if (l.available && l.url)
                            window.open(l.url, "_blank");
                        }}
                        className={`flex items-start gap-3 bg-[#131920] border border-[#1c2530] rounded-lg p-[13px_14px] transition-colors ${l.available ? "cursor-pointer hover:border-[#2a3a4d] hover:bg-[#181f28]" : "cursor-default"}`}>
                        <span className="font-mono text-[11px] text-[#2d3a47] w-5 text-right shrink-0 pt-0.5">
                          {String(l.n).padStart(2, "0")}
                        </span>
                        <span
                          className={`w-2.25 h-2.25 rounded-full shrink-0 mt-1 ${l.available ? "bg-green-400 border border-green-400 shadow-[0_0_5px_rgba(74,222,128,0.4)]" : "bg-[#2d3a47] border border-[#1c2530]"}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-[13.5px] font-semibold leading-snug mb-0.5 ${!l.available ? "text-[#64748b]" : ""}`}>
                            {t(l.title)}
                          </div>
                          <div
                            className={`text-[11.5px] leading-snug ${l.available ? "text-[#64748b]" : "text-[#2d3a47]"}`}>
                            {t(l.desc)}
                          </div>
                        </div>
                        <span
                          className={`font-mono text-[9.5px] whitespace-nowrap pt-0.5 shrink-0 ${l.available ? "text-green-400" : "text-[#2d3a47]"}`}>
                          {l.available ? t(C.td.avail) : t(C.td.soon)}
                        </span>
                        {l.available && (
                          <span className="text-[#64748b] text-[13px] pt-0.5 shrink-0">
                            →
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  {avail.length > 0 ? (
                    <div className="flex items-center gap-3.5 flex-wrap">
                      <ProceedBtn
                        onClick={() => {
                          const first = avail[0];
                          if (first?.url) window.open(first.url, "_blank");
                        }}>
                        {activeTrack === "proxmox"
                          ? t(C.td.openBtn)
                          : t(C.td.startBtn)}{" "}
                        <span>→</span>
                      </ProceedBtn>
                      {activeTrack === "proxmox" && (
                        <span className="font-mono text-[11px] text-[#64748b]">
                          {t(C.td.opensIn)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="bg-[#131920] border border-[#1c2530] rounded-lg p-4 font-mono text-xs text-[#2d3a47] leading-relaxed">
                      {t(C.td.buildNote)}
                    </div>
                  )}
                </div>
              );
            })()}
        </Screen>
      </div>
    </div>
  );
}
