import { useState, useEffect, useRef } from "react";
import { Router } from "react-dom";
// import "./output.css";
/* NHS Welcome Portal — React + Tailwind CSS (single file) */

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

  // Content data is embedded below - full bilingual strings from original
  const C = {
    w: {
      badge: {
        en: "SFM · Special Task Force · NHS",
        tl: "SFM · Special Task Force · NHS",
      },
      pre: { en: "Welcome to", tl: "Maligayang\\nPagdating sa" },
      sub1: {
        en: "Network & Hardware Support",
        tl: "Network at Hardware Support",
      },
      sub2: {
        en: "You've arrived at the right place.",
        tl: "Nakarating ka sa tamang lugar.",
      },
      rlabel: { en: "For New Recruits", tl: "Para sa mga Bagong Miyembro" },
      rtitle: { en: "I'm brand new here", tl: "Bago pa ako dito" },
      rdesc: {
        en: "First time hearing about NHS? No technical background at all? Perfect — this is built exactly for you.",
        tl: "Unang beses mong marinig ang NHS? Walang background sa teknolohiya? Perpekto — ito ay ginawa para sa iyo.",
      },
      mlabel: { en: "For NHS Members", tl: "Para sa mga Miyembro ng NHS" },
      mtitle: { en: "I'm already in NHS", tl: "Miyembro na ako ng NHS" },
      mdesc: {
        en: "Want to explore another group, cross-train into a new skill, or go deeper? Welcome back.",
        tl: "Nais mong tuklasin ang ibang pangkat, matuto ng bagong kasanayan, o palalimin ang iyong kaalaman? Maligayang pagbabalik.",
      },
      skip: {
        en: "Skip intro — take me to the groups →",
        tl: "Laktawan ang intro — dalhin ako sa mga pangkat →",
      },
    },
    rb: {
      label: {
        en: "Welcome, New Recruit",
        tl: "Maligayang pagdating, Bagong Miyembro",
      },
      title: {
        en: "You made it. Now let's make it count.",
        tl: "Narito ka na. Gawin nating mahalaga ito.",
      },
      desc: {
        en: "You don't need any background in technology. Everything you need to know will be taught here — starting from the very beginning, using plain language and real analogies. The only thing we ask is that you stay curious.",
        tl: "Hindi mo kailangang may background sa teknolohiya. Lahat ng kailangan mong malaman ay ituturo dito — mula sa simula, sa simpleng wika at tunay na mga halimbawa. Ang tanging hihingin namin sa iyo ay manatiling mapanuri.",
      },
    },
    mb: {
      label: {
        en: "Welcome Back, NHS Member",
        tl: "Maligayang pagbabalik, Miyembro ng NHS",
      },
      title: {
        en: "Good to have you back. Ready to go deeper?",
        tl: "Masaya kang nandito ulit. Handa ka bang mas palalimin?",
      },
      desc: {
        en: "You're already part of this team. Explore any group's learning portal — cross-train into a new skill area, understand what another group does, or go deeper in your own. All of NHS is open to you.",
        tl: "Bahagi ka na ng pangkat na ito. Tuklasin ang portal ng kahit anong pangkat — matuto ng bagong kasanayan, maunawaan ang ginagawa ng ibang pangkat, o palalimin ang sarili mong larangan. Bukas sa iyo ang buong NHS.",
      },
    },
    nhs: {
      eyebrow: { en: "About NHS", tl: "Tungkol sa NHS" },
      h: {
        en: "Network & Hardware Support.",
        tl: "Network at Hardware Support.",
      },
      lead: {
        en: "We are one of the teams inside STF — the Special Task Force — a program launched by SFM (School For Ministers) to help its students develop the skills and knowledge they'll carry into the future.",
        tl: "Kami ay isa sa mga pangkat sa loob ng STF — ang Special Task Force — isang programa na inilunsad ng SFM (School For Ministers) upang tulungan ang mga estudyante nitong mapaunlad ang mga kasanayan at kaalaman na dadalhin nila sa hinaharap.",
      },
      cSchoolCode: { en: "The School", tl: "Ang Paaralan" },
      cSchoolName: "SFM",
      cSchoolDesc: {
        en: "School For Ministers — a school dedicated to training and preparing ministers.",
        tl: "School For Ministers — isang paaralang nakatuon sa pagsasanay at paghahanda ng mga ministro.",
      },
      cProgCode: { en: "The Program", tl: "Ang Programa" },
      cProgName: "STF",
      cProgDesc: {
        en: "Special Task Force — a student-led program within SFM where members build real skills and produce real projects.",
        tl: "Special Task Force — isang programang pinamumunuan ng mga estudyante sa loob ng SFM.",
      },
      cTeamCode: { en: "Your Team", tl: "Ang Inyong Pangkat" },
      cTeamName: "NHS",
      cTeamDesc: {
        en: "Network & Hardware Support — the technology-focused team within STF.",
        tl: "Network at Hardware Support — ang pangkat na nakatuon sa teknolohiya sa loob ng STF.",
      },
      whatEye: { en: "What we actually do", tl: "Ang aming tunay na ginagawa" },
      whatH: {
        en: "We're not I.T. support.\\nWe're students building skills for the future.",
        tl: "Hindi kami I.T. support.\\nKami ay mga estudyanteng nagtatayo ng kasanayan para sa kinabukasan.",
      },
      whatLead: {
        en: "Every NHS member is a student first. We learn technology by doing it — building real projects that will serve local congregations worldwide.",
        tl: "Bawat miyembro ng NHS ay estudyante muna. Natututo kami sa teknolohiya sa pamamagitan ng paggawa.",
      },
      id1t: { en: "Real Projects", tl: "Tunay na mga Proyekto" },
      id1d: {
        en: "NHS members are expected to produce real projects.",
        tl: "Ang mga miyembro ng NHS ay inaasahang gumawa ng tunay na mga proyekto.",
      },
      id2t: {
        en: "Future-Ready Skills",
        tl: "Mga Kasanayan para sa Hinaharap",
      },
      id2d: {
        en: "The skills you build here are the skills you'll use in local congregations.",
        tl: "Ang mga kasanayan na itatatayo mo dito ay ang mga kasanayang gagamitin mo sa mga lokal na kongregasyon.",
      },
      id3t: {
        en: "School-Supported Growth",
        tl: "Paglago na Sinusuportahan ng Paaralan",
      },
      id3d: {
        en: "STF members are actively helped by SFM to develop and grow.",
        tl: "Ang mga miyembro ng STF ay aktibong tinutulungan ng SFM na lumago.",
      },
      id4t: {
        en: "A Team That Builds Together",
        tl: "Isang Pangkat na Nagtatayo Nang Magkasama",
      },
      id4d: {
        en: "NHS isn't a solo experience. You grow alongside teammates.",
        tl: "Ang NHS ay hindi isang nag-iisang karanasan.",
      },
      whoH: { en: "Who belongs in NHS?", tl: "Sino ang dapat nasa NHS?" },
      whoHl: { en: "belongs", tl: "dapat nasa" },
      whoLead: {
        en: "We have one requirement: you need to want to learn. That's it.",
        tl: "Mayroon kaming isang kinakailangan: kailangan mong gustong matuto. Iyon lang.",
      },
      who: [
        {
          en: "You've never touched a server before.",
          tl: "Hindi ka pa nakahipo ng server kailanman.",
        },
        {
          en: "You don't know what a network switch is.",
          tl: "Hindi mo alam kung ano ang network switch.",
        },
        { en: "You can't code yet.", tl: "Hindi ka pa marunong mag-code." },
        {
          en: "You're not sure which group fits you.",
          tl: "Hindi ka sigurado kung alin sa mga pangkat ang para sa iyo.",
        },
        {
          en: "You know some basics and want to go deeper.",
          tl: "May kaunting alam ka at nais palalimin.",
        },
        {
          en: "You're already in a group and want to cross-train.",
          tl: "Miyembro ka na sa isang pangkat at nais matuto ng iba.",
        },
      ],
      divLead: {
        en: "Inside NHS there are five specialized groups. Explore all of them.",
        tl: "Sa loob ng NHS ay limang espesyalisadong pangkat. Tuklasin ang lahat.",
      },
      seeGroups: {
        en: "Explore the groups →",
        tl: "Tuklasin ang mga pangkat →",
      },
      backToWelcome: { en: "← Back", tl: "← Bumalik" },
    },
    grp: {
      eyebrow: {
        en: "The five groups of NHS",
        tl: "Ang limang pangkat ng NHS",
      },
      h: {
        en: "Choose your world to explore.",
        tl: "Piliin ang mundo mong tuklasin.",
      },
      lead: {
        en: "Each group inside NHS focuses on a different slice of technology.",
        tl: "Bawat pangkat sa loob ng NHS ay nakatuon sa kakaibang bahagi ng teknolohiya.",
      },
      back: { en: "← Back to NHS intro", tl: "← Bumalik sa intro ng NHS" },
      g00tag: {
        en: "Group 00 · Start Here",
        tl: "Pangkat 00 · Magsimula Dito",
      },
      g00title: { en: "Hardware Group", tl: "Hardware Group" },
      g00desc: {
        en: "The foundation of everything. Hardware Group teaches what a computer is, how to build one from scratch, and how to keep machines running.",
        tl: "Ang pundasyon ng lahat. Ang Hardware Group ay nagtuturo kung ano ang isang computer.",
      },
      g01tag: { en: "Group 01", tl: "Pangkat 01" },
      g01title: { en: "I.O.T Group", tl: "I.O.T Group" },
      g01desc: {
        en: "Internet of Things — connecting physical devices to the digital world.",
        tl: "Internet of Things — pagkokonekta ng mga pisikal na device sa digital na mundo.",
      },
      g02tag: { en: "Group 02", tl: "Pangkat 02" },
      g02title: { en: "Network Group", tl: "Network Group" },
      g02desc: {
        en: "Managing the pathways data travels on — Wi-Fi, switches, routers.",
        tl: "Pamamahala ng mga landas na tinatahak ng datos — Wi-Fi, switches, routers.",
      },
      g03tag: { en: "Group 03", tl: "Pangkat 03" },
      g03title: { en: "Admin Group", tl: "Admin Group" },
      g03desc: {
        en: "Managing processes, documentation, and operational systems.",
        tl: "Pamamahala ng mga proseso, dokumentasyon, at sistema ng operasyon.",
      },
      g04tag: { en: "Group 04", tl: "Pangkat 04" },
      g04title: { en: "Inventory Group", tl: "Inventory Group" },
      g04desc: {
        en: "Tracking and managing all physical hardware assets.",
        tl: "Pagsubaybay at pamamahala ng lahat ng pisikal na kagamitan.",
      },
      g05tag: { en: "Group 05", tl: "Pangkat 05" },
      g05title: {
        en: "I.T. Infrastructure Group",
        tl: "I.T. Infrastructure Group",
      },
      g05desc: {
        en: "Building skills in servers, virtual machines, networking, and systems.",
        tl: "Pagtatayo ng mga kasanayan sa mga server, virtual machine, networking, at sistema.",
      },
      statusOpen: { en: "Open — Explore Now", tl: "Bukas — Tuklasin Ngayon" },
      statusSoon: { en: "Opening Soon", tl: "Magbubukas Malapit Na" },
      enterBtn: { en: "Explore", tl: "Tuklasin" },
      enterItInfra: {
        en: "Enter I.T. Infrastructure →",
        tl: "Pumasok sa I.T. Infrastructure →",
      },
      enterHw: {
        en: "Enter Hardware Group →",
        tl: "Pumasok sa Hardware Group →",
      },
      startHere: {
        en: "★ Recommended for all new recruits",
        tl: "★ Inirerekomenda para sa lahat ng bagong miyembro",
      },
    },
    hw: {
      eyebrow: {
        en: "NHS · Hardware Group · Start Here",
        tl: "NHS · Hardware Group · Magsimula Dito",
      },
      strip: {
        en: "★  Recommended first group for all new NHS recruits",
        tl: "★  Inirerekomendang unang pangkat para sa lahat ng bagong miyembro",
      },
      h1: { en: "We build computers.", tl: "Nagtatayo kami ng mga computer." },
      h2: { en: "We fix them.", tl: "Inaaayos namin ang mga ito." },
      h3: {
        en: "We teach everyone how they work.",
        tl: "Itinututuro namin sa lahat kung paano ito gumagana.",
      },
      lead: {
        en: "Hardware Group is where every NHS member begins. We teach the physical side of computing. No experience required.",
        tl: "Ang Hardware Group ay kung saan nagsisimula ang bawat miyembro ng NHS. Walang kinakailangang karanasan.",
      },
      chips: {
        en: [
          "Computer Parts",
          "Building PCs",
          "Operating Systems",
          "Bootable USB",
          "Windows Install",
          "Troubleshooting",
        ],
        tl: [
          "Mga Parte ng Computer",
          "Pagtatayo ng PC",
          "Mga Operating System",
          "Bootable USB",
          "Pag-install ng Windows",
          "Pag-troubleshoot",
        ],
      },
      abLabel: { en: "Why start here?", tl: "Bakit magsimula dito?" },
      abText: {
        en: "Before you can manage a server or configure a network, you need to understand the machine in front of you. <strong class='text-[#f0a500]'>Hardware Group answers: what exactly is a computer?</strong>",
        tl: 'Bago mo mapamahalaan ang isang server, kailangan mong maunawaan ang makinang nasa harap mo. <strong class="text-[#f0a500]">Ano talaga ang isang computer?</strong>',
      },
      tracksLabel: { en: "Learning Tracks", tl: "Mga Learning Track" },
      tracksH: {
        en: "Follow the order. It all builds on itself.",
        tl: "Sundin ang pagkakasunud-sunod.",
      },
      tracksSub: {
        en: "Start with Track 01 — no experience needed.",
        tl: "Magsimula sa Track 01 — walang kinakailangang karanasan.",
      },
      back: { en: "← Back to all groups", tl: "← Bumalik sa lahat ng pangkat" },
    },
    soon: {
      tag: { en: "Coming Soon", tl: "Malapit Nang Dumating" },
      lead: {
        en: "This group's learning portal is being built.",
        tl: "Ang learning portal ng pangkat na ito ay kasalukuyang itinatayo.",
      },
      barLabel: { en: "BUILD PROGRESS", tl: "PROGRESO NG PAGTATAYO" },
      featLabel: {
        en: "What you'll learn here",
        tl: "Ang matututunan mo dito",
      },
      backBtn: {
        en: "← Back to all groups",
        tl: "← Bumalik sa lahat ng pangkat",
      },
    },
    itf: {
      eyebrow: {
        en: "NHS · Group 05 · I.T. Infrastructure",
        tl: "NHS · Pangkat 05 · I.T. Infrastructure",
      },
      h1: { en: "We learn to build the", tl: "Natututo kaming itayo ang" },
      h2: { en: "foundation everything", tl: "pundasyon ng" },
      h3: { en: "else runs on.", tl: "lahat ng iba pa." },
      lead: {
        en: "I.T. Infrastructure learns to build, configure, and manage servers and virtual systems. You don't need to know what that means yet.",
        tl: "Ang I.T. Infrastructure ay natututo kung paano itayo, i-configure, at pamahalaan ang mga server. Hindi mo kailangang malaman iyon ngayon.",
      },
      chips: {
        en: [
          "Servers",
          "Virtual Machines",
          "Networking",
          "Linux",
          "Databases",
          "Security",
        ],
        tl: [
          "Mga Server",
          "Virtual Machine",
          "Networking",
          "Linux",
          "Mga Database",
          "Seguridad",
        ],
      },
      abLabel: {
        en: "Think of it this way",
        tl: "Isipin ito sa ganitong paraan",
      },
      abText: {
        en: "Imagine a city. Network Group builds the roads. <strong class='text-[#f0a500]'>I.T. Infrastructure builds the power plant.</strong>",
        tl: 'Isipin ang isang lungsod. Network Group nagtatayo ng mga daan. <strong class="text-[#f0a500]">I.T. Infrastructure nagtatayo ng power plant.</strong>',
      },
      tracksLabel: { en: "Learning Tracks", tl: "Mga Learning Track" },
      tracksH: {
        en: "Pick where you want to start.",
        tl: "Piliin kung saan ka gustong magsimula.",
      },
      tracksSub: {
        en: "Every track begins from absolute zero.",
        tl: "Bawat track ay nagsisimula mula sa ganap na wala.",
      },
      back: { en: "← Back to all groups", tl: "← Bumalik sa lahat ng pangkat" },
    },
    td: {
      eyebrow: {
        en: "I.T. Infrastructure · Learning Track",
        tl: "I.T. Infrastructure · Learning Track",
      },
      abLabel: {
        en: "Before we start — think of it this way",
        tl: "Bago tayo magsimula — isipin ito ng ganito",
      },
      llLabel: { en: "Lesson Plan", tl: "Plano ng mga Aralin" },
      avail: { en: "Available", tl: "Available Na" },
      soon: { en: "Coming soon", tl: "Malapit na" },
      openBtn: {
        en: "Open the Proxmox Course",
        tl: "Buksan ang Proxmox Course",
      },
      startBtn: { en: "Start first lesson", tl: "Simulan ang unang aralin" },
      opensIn: {
        en: "Opens the full 12-lesson Field Course",
        tl: "Binubuksan ang buong 12-aralin na Field Course",
      },
      buildNote: {
        en: "This track is actively being built. Check back soon.",
        tl: "Aktibo pa ring itinatayo ang track na ito. Bumalik malapit na.",
      },
      back: {
        en: "← Back to I.T. Infrastructure",
        tl: "← Bumalik sa I.T. Infrastructure",
      },
      availNow: { en: "available now", tl: "available na ngayon" },
      building: { en: "Building now", tl: "Kasalukuyang Itinatayo" },
      lessons: { en: "lessons", tl: "mga aralin" },
    },
  };

  const soonData = {
    iot: {
      icon: "🌐",
      title: { en: "I.O.T Group", tl: "I.O.T Group" },
      features: {
        en: [
          "Introduction to IoT",
          "Setting up sensors",
          "Connecting devices to networks",
          "Reading live data",
          "Building a real IoT project",
        ],
        tl: [
          "Panimula sa IoT",
          "Pag-set up ng sensor",
          "Pagkokonekta ng device",
          "Pagbabasa ng live data",
          "Pagtatayo ng IoT project",
        ],
      },
    },
    network: {
      icon: "📡",
      title: { en: "Network Group", tl: "Network Group" },
      features: {
        en: [
          "How networks work",
          "IP addresses and routing",
          "Switch and router config",
          "Wi-Fi planning",
          "Securing a network",
        ],
        tl: [
          "Paano gumagana ang network",
          "IP address at routing",
          "Pag-configure ng switch",
          "Pagpaplano ng Wi-Fi",
          "Pag-secure ng network",
        ],
      },
    },
    admin: {
      icon: "🗂️",
      title: { en: "Admin Group", tl: "Admin Group" },
      features: {
        en: [
          "User account management",
          "Documentation systems",
          "Ticketing",
          "Operational workflows",
          "Team coordination",
        ],
        tl: [
          "Pamamahala ng user account",
          "Sistema ng dokumentasyon",
          "Ticketing",
          "Mga daloy ng trabaho",
          "Koordinasyon ng pangkat",
        ],
      },
    },
    inventory: {
      icon: "📦",
      title: { en: "Inventory Group", tl: "Inventory Group" },
      features: {
        en: [
          "Asset cataloguing",
          "Hardware lifecycle",
          "Inventory tracking",
          "Condition monitoring",
          "Procurement docs",
        ],
        tl: [
          "Asset cataloguing",
          "Lifecycle ng hardware",
          "Pagsubaybay ng inventory",
          "Pagmamasid sa kondisyon",
          "Dokumentasyon ng pagkuha",
        ],
      },
    },
  };

  const mkLessons = (n, avail = false) =>
    Array.from({ length: n }, (_, i) => ({
      n: i + 1,
      title: { en: `Lesson ${i + 1}`, tl: `Aralin ${i + 1}` },
      desc: {
        en: avail ? "Available" : "Coming soon",
        tl: avail ? "Available" : "Malapit na",
      },
      available: avail,
      url: avail ? "proxmox-bootcamp.html" : undefined,
    }));

  const trackData = {
    server: {
      icon: "🏗️",
      color: "#f0a500",
      level: "beginner",
      title: { en: "What Is a Server?", tl: "Ano ang Server?" },
      levelLabel: { en: "Beginner", tl: "Simula" },
      desc: {
        en: "Understand what a server actually is using plain language.",
        tl: "Unawain kung ano talaga ang server.",
      },
      analogy: {
        en: 'The server is the <strong class="text-[#f0a500]">kitchen</strong> of a restaurant that never closes.',
        tl: 'Ang server ay ang <strong class="text-[#f0a500]">kusina</strong>.',
      },
      lessons: mkLessons(5),
    },
    linux: {
      icon: "🐧",
      color: "#a78bfa",
      level: "beginner",
      title: {
        en: "Linux & the Command Line",
        tl: "Linux at ang Command Line",
      },
      levelLabel: { en: "Beginner", tl: "Simula" },
      desc: {
        en: "Learn the commands to control any server from a terminal.",
        tl: "Matuto ng mga command para kontrolin ang server.",
      },
      analogy: {
        en: 'The Linux terminal is <strong class="text-[#f0a500]">manual control</strong>.',
        tl: 'Ang Linux terminal ay <strong class="text-[#f0a500]">manu-manong kontrol</strong>.',
      },
      lessons: mkLessons(8),
    },
    proxmox: {
      icon: "⚡",
      color: "#f87171",
      level: "beginner",
      title: { en: "Proxmox VE", tl: "Proxmox VE" },
      levelLabel: { en: "Beginner → Pro", tl: "Simula → Pro" },
      desc: {
        en: "Our flagship track — 12 complete lessons. All available now.",
        tl: "Pangunahing track — 12 aralin. Available na ngayon.",
      },
      analogy: {
        en: '<strong class="text-[#f0a500]">Proxmox</strong> divides one server into many VMs.',
        tl: 'Ang <strong class="text-[#f0a500]">Proxmox</strong> ay humahati ng server sa maraming VM.',
      },
      lessons: mkLessons(12, true),
    },
    deploy: {
      icon: "🚀",
      color: "#38bdf8",
      level: "intermediate",
      title: { en: "Deploying Services", tl: "Pag-deploy ng mga Serbisyo" },
      levelLabel: { en: "Intermediate", tl: "Katamtaman" },
      desc: {
        en: "Put real software on a server using containers.",
        tl: "Maglagay ng software sa server gamit ang containers.",
      },
      analogy: {
        en: "Opening stores inside your mall.",
        tl: "Pagbubukas ng mga tindahan sa mall.",
      },
      lessons: mkLessons(6),
    },
    hosting: {
      icon: "🌐",
      color: "#4ade80",
      level: "intermediate",
      title: {
        en: "Managing & Hosting Services",
        tl: "Pamamahala at Pag-host",
      },
      levelLabel: { en: "Intermediate", tl: "Katamtaman" },
      desc: {
        en: "Keep services online, updated, and recoverable.",
        tl: "Panatilihing online at updated ang mga serbisyo.",
      },
      analogy: {
        en: "Being the building manager who never goes home.",
        tl: "Pagiging building manager na hindi umuwi.",
      },
      lessons: mkLessons(6),
    },
    coding: {
      icon: "💻",
      color: "#fb923c",
      level: "beginner",
      title: { en: "Coding & Scripting", tl: "Coding at Scripting" },
      levelLabel: { en: "Beginner", tl: "Simula" },
      desc: {
        en: "Write scripts that automate daily tasks.",
        tl: "Magsulat ng script na nag-a-automate ng gawain.",
      },
      analogy: {
        en: "Instructions the computer follows perfectly every time.",
        tl: "Mga tagubilin na sinusunod ng computer nang perpekto.",
      },
      lessons: mkLessons(7),
    },
    network: {
      icon: "📡",
      color: "#67e8f9",
      level: "beginner",
      title: { en: "Networking for Infra", tl: "Networking para sa Infra" },
      levelLabel: { en: "Beginner", tl: "Simula" },
      desc: {
        en: "IP addressing, routing, and how machines find each other.",
        tl: "IP addressing, routing, at kung paano naghahanapan ang mga makina.",
      },
      analogy: {
        en: "The postal system of data.",
        tl: "Ang sistema ng koreo ng datos.",
      },
      lessons: mkLessons(6),
    },
    database: {
      icon: "🗄️",
      color: "#c084fc",
      level: "intermediate",
      title: { en: "Database Management", tl: "Pamamahala ng Database" },
      levelLabel: { en: "Intermediate", tl: "Katamtaman" },
      desc: {
        en: "How databases work and how to keep them backed up.",
        tl: "Paano gumagana ang database at paano i-backup.",
      },
      analogy: {
        en: "A filing room that answers in milliseconds.",
        tl: "Filing room na sumasagot sa loob ng millisecond.",
      },
      lessons: mkLessons(6),
    },
    security: {
      icon: "🔒",
      color: "#f87171",
      level: "intermediate",
      title: {
        en: "Cybersecurity Basics",
        tl: "Mga Pangunahing Cybersecurity",
      },
      levelLabel: { en: "Intermediate", tl: "Katamtaman" },
      desc: {
        en: "Think like an attacker so you can defend what you build.",
        tl: "Mag-isip tulad ng umaatake para maprotektahan ang iyong itinayo.",
      },
      analogy: {
        en: "Invite a burglar first, then an architect.",
        tl: "Mag-imbita muna ng magnanakaw, pagkatapos ay arkitekto.",
      },
      lessons: mkLessons(7),
    },
    cloud: {
      icon: "☁️",
      color: "#94a3b8",
      level: "advanced",
      title: {
        en: "Cloud & Modern Infrastructure",
        tl: "Cloud at Modernong Infrastructure",
      },
      levelLabel: { en: "Advanced", tl: "Advanced" },
      desc: {
        en: "Bridge your on-premise skills to AWS, Azure, and beyond.",
        tl: "Iugnay ang iyong kasanayan sa cloud.",
      },
      analogy: {
        en: "You've been building your own power plant. The cloud is the national grid.",
        tl: "Ikaw ay nagtatayo ng power plant. Ang cloud ay ang pambansang grid.",
      },
      lessons: mkLessons(5),
    },
  };

  const hwTrackData = [
    {
      id: "anatomy",
      icon: "🧠",
      color: "#4ade80",
      level: "beginner",
      title: { en: "Anatomy of a Computer", tl: "Anatomy ng Isang Computer" },
      levelLabel: { en: "Beginner · Track 01", tl: "Simula · Track 01" },
      desc: {
        en: "Every major component inside a computer explained with analogies.",
        tl: "Bawat pangunahing bahagi ng computer na ipinaliwanag.",
      },
      analogy: {
        en: 'A computer is like a <strong class="text-[#f0a500]">human body</strong>.',
        tl: 'Ang computer ay katulad ng <strong class="text-[#f0a500]">katawang pantao</strong>.',
      },
      lessons: mkLessons(7),
    },
    {
      id: "howworks",
      icon: "⚙️",
      color: "#f0a500",
      level: "beginner",
      title: { en: "How Computers Work", tl: "Paano Gumagana ang Computer" },
      levelLabel: { en: "Beginner · Track 02", tl: "Simula · Track 02" },
      desc: {
        en: "What happens when you press the power button.",
        tl: "Ano ang nangyayari kapag pinindot mo ang power button.",
      },
      analogy: {
        en: "Like waking someone from deep sleep.",
        tl: "Katulad ng pagpupukas sa isang tao.",
      },
      lessons: mkLessons(5),
    },
    {
      id: "build",
      icon: "🔧",
      color: "#38bdf8",
      level: "beginner",
      title: {
        en: "Building a Computer from Scratch",
        tl: "Pagtatayo ng Computer mula sa Simula",
      },
      levelLabel: { en: "Beginner · Track 03", tl: "Simula · Track 03" },
      desc: {
        en: "Assemble all the parts into a working computer safely.",
        tl: "Tipunin ang lahat ng parte nang ligtas.",
      },
      analogy: {
        en: "Like assembling furniture — order matters.",
        tl: "Katulad ng pag-assemble ng kasangkapan.",
      },
      lessons: mkLessons(7),
    },
    {
      id: "os",
      icon: "🪟",
      color: "#a78bfa",
      level: "beginner",
      title: {
        en: "Types of Operating Systems",
        tl: "Mga Uri ng Operating System",
      },
      levelLabel: { en: "Beginner · Track 04", tl: "Simula · Track 04" },
      desc: {
        en: "Windows, Linux, and macOS — what each is and why it matters.",
        tl: "Windows, Linux, at macOS — kung ano ang bawat isa.",
      },
      analogy: {
        en: "An OS is the manager of an office building.",
        tl: "Ang OS ay ang manager ng office building.",
      },
      lessons: mkLessons(5),
    },
    {
      id: "bootable",
      icon: "💾",
      color: "#fb923c",
      level: "beginner",
      title: {
        en: "Bootable Devices: Rufus & Ventoy",
        tl: "Mga Bootable na Device: Rufus at Ventoy",
      },
      levelLabel: { en: "Beginner · Track 05", tl: "Simula · Track 05" },
      desc: {
        en: "Your most important tool as a hardware technician.",
        tl: "Ang iyong pinakamahalagang kagamitan.",
      },
      analogy: {
        en: "A spare key that also contains instructions.",
        tl: "Isang spare key na may tagubilin.",
      },
      lessons: mkLessons(5),
    },
    {
      id: "windows",
      icon: "🪟",
      color: "#38bdf8",
      level: "beginner",
      title: { en: "Installing Windows OS", tl: "Pag-install ng Windows OS" },
      levelLabel: { en: "Beginner · Track 06", tl: "Simula · Track 06" },
      desc: {
        en: "Complete Windows installation from USB to working desktop.",
        tl: "Kumpletong pag-install ng Windows.",
      },
      analogy: {
        en: "Like moving into a brand new house.",
        tl: "Katulad ng paglipat sa bagong bahay.",
      },
      lessons: mkLessons(5),
    },
    {
      id: "massimage",
      icon: "📡",
      color: "#f87171",
      level: "intermediate",
      title: {
        en: "Mass Deployment & Imaging",
        tl: "Mass Deployment at Imaging",
      },
      levelLabel: {
        en: "Intermediate · Track 07",
        tl: "Katamtaman · Track 07",
      },
      desc: {
        en: "Install Windows on many computers at once.",
        tl: "Mag-install ng Windows sa maraming computer nang sabay-sabay.",
      },
      analogy: {
        en: "Writing by hand vs using a rubber stamp.",
        tl: "Pagsulat ng kamay vs rubber stamp.",
      },
      lessons: mkLessons(5),
    },
    {
      id: "linux-install",
      icon: "🐧",
      color: "#4ade80",
      level: "beginner",
      title: { en: "Installing Linux", tl: "Pag-install ng Linux" },
      levelLabel: { en: "Beginner · Track 08", tl: "Simula · Track 08" },
      desc: {
        en: "Ubuntu installation from bootable USB to a running system.",
        tl: "Pag-install ng Ubuntu mula sa bootable USB.",
      },
      analogy: {
        en: "An empty apartment where you arrange everything.",
        tl: "Isang walang lamanang apartment.",
      },
      lessons: mkLessons(5),
    },
    {
      id: "troubleshoot",
      icon: "🔍",
      color: "#f59e0b",
      level: "intermediate",
      title: {
        en: "Troubleshooting Computers",
        tl: "Pag-troubleshoot ng mga Computer",
      },
      levelLabel: {
        en: "Intermediate · Track 09",
        tl: "Katamtaman · Track 09",
      },
      desc: {
        en: "The diagnostic mindset that makes Hardware Group valuable.",
        tl: "Ang diagnostic mindset na ginagawang mahalaga ang Hardware Group.",
      },
      analogy: {
        en: "Exactly like being a doctor.",
        tl: "Katulad ng pagiging doktor.",
      },
      lessons: mkLessons(6),
    },
    {
      id: "maintenance",
      icon: "🛡️",
      color: "#94a3b8",
      level: "beginner",
      title: { en: "Maintenance & Care", tl: "Pagpapanatili at Pag-aalaga" },
      levelLabel: { en: "Beginner · Track 10", tl: "Simula · Track 10" },
      desc: {
        en: "Keep the computers you build running for years.",
        tl: "Panatilihing tumatakbo ang mga computer sa loob ng maraming taon.",
      },
      analogy: {
        en: "Like maintaining a bicycle.",
        tl: "Katulad ng pagpapanatili ng bisikleta.",
      },
      lessons: mkLessons(5),
    },
  ];

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
      className="inline-flex items-center gap-2.5 bg-gradient-to-br from-[#f0a500] to-[#e09000] text-[#1a0e00] font-extrabold text-base border-none rounded-[11px] px-8 py-4 cursor-pointer shadow-[0_0_28px_rgba(240,165,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(240,165,0,0.5)] transition-all font-['Space_Grotesk']">
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
    <div className="relative min-h-screen bg-[#08090c] text-slate-200 font-['Space_Grotesk'] antialiased overflow-x-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />
      <div className="fixed inset-0 z-[1] bg-[radial-gradient(ellipse_90%_80%_at_50%_50%,transparent_40%,rgba(8,9,12,0.75))] pointer-events-none" />
      <div className="fixed inset-0 z-[2] bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,0.06)_3px,rgba(0,0,0,0.06)_4px)] pointer-events-none" />

      <div
        className={`fixed top-[18px] right-5 z-[200] flex gap-0 bg-[#131920] border border-[#1c2530] rounded-[20px] overflow-hidden transition-opacity duration-300 ${langVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {["en", "tl"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`bg-transparent border-none font-mono text-[11px] px-[15px] py-2 cursor-pointer tracking-[0.08em] transition-colors ${lang === l ? "bg-[#181f28] text-[#f0a500]" : "text-[#64748b] hover:text-slate-200"}`}>
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
            className="font-mono text-[13px] leading-[1.9] text-[#4a6070] max-w-[700px]"
          />
        </Screen>

        <Screen
          id="s-welcome"
          className="items-center justify-center p-10 md:p-[40px_24px]">
          <div className="max-w-[720px] w-full text-center">
            <div className="inline-flex items-center gap-2 bg-[#131920] border border-[#2a3a4d] rounded-[20px] px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-[#64748b] uppercase mb-7">
              <span className="w-[7px] h-[7px] rounded-full bg-[#f0a500] shadow-[0_0_8px_#f0a500] animate-pulse" />
              {t(C.w.badge)}
            </div>
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
            <p className="text-[clamp(14px,2vw,18px)] text-[#64748b] mb-12 leading-relaxed">
              {t(C.w.sub1)}
              <br />
              <strong className="text-slate-200 font-semibold">
                {t(C.w.sub2)}
              </strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-[560px] mx-auto mb-9">
              <div
                onClick={() => {
                  setUserType("recruit");
                  show("s-nhs");
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
              <div
                onClick={() => {
                  setUserType("member");
                  show("s-nhs");
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
            <div
              onClick={() => show("s-groups")}
              className="font-mono text-[11px] text-[#2d3a47] tracking-[0.1em] cursor-pointer hover:text-[#64748b]">
              {t(C.w.skip)}
            </div>
          </div>
        </Screen>

        <Screen id="s-nhs">
          <div className="max-w-[900px] w-full mx-auto px-6 py-[60px] pb-20">
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
                    <div className="text-[22px] text-[#2d3a47] px-2.5 flex-shrink-0">
                      →
                    </div>
                  )}
                  <div
                    className={`bg-[#131920] border rounded-[10px] p-[18px_22px] flex-1 min-w-[160px] ${item.hi ? "border-[rgba(240,165,0,0.35)] bg-[#140f00]" : "border-[#1c2530]"}`}>
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
                    <span className="text-green-400 font-bold flex-shrink-0">
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
          <div className="max-w-[900px] w-full mx-auto px-6 py-[60px] pb-20">
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(275px,1fr))] gap-[17px]">
              <div
                onClick={() => show("s-hardware")}
                className="bg-[#131920] border border-[#1c2530] rounded-[15px] p-[24px_22px] cursor-pointer relative overflow-hidden transition-all hover:-translate-y-[3px] flex flex-col hover:border-[rgba(74,222,128,0.4)] hover:bg-[rgba(74,222,128,0.03)]">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-400 to-[#f0a500]" />
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
                  <span className="w-[7px] h-[7px] rounded-full bg-[#f0a500] shadow-[0_0_6px_rgba(240,165,0,0.5)]" />
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
                    className={`bg-[#131920] border border-[#1c2530] rounded-[15px] p-[24px_22px] cursor-pointer relative overflow-hidden transition-all hover:-translate-y-[3px] flex flex-col ${isInfra ? "hover:border-[rgba(240,165,0,0.4)] hover:bg-[#12100a]" : ""}`}>
                    <div
                      className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${bar}`}
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
                        className={`w-[7px] h-[7px] rounded-full ${isInfra ? "bg-[#f0a500] shadow-[0_0_6px_rgba(240,165,0,0.5)]" : "bg-[#2d3a47]"}`}
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
            <div className="max-w-[520px] mx-auto px-6 py-14 pb-20">
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
                <div className="font-mono text-[10.5px] text-[#64748b] mb-2.5 tracking-[0.1em]">
                  {t(C.soon.barLabel)}
                </div>
                <div className="bg-[#1c2530] rounded h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f0a500] to-[#ffc040] rounded w-[15%]" />
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
          <div className="max-w-[1020px] w-full mx-auto px-6 py-[60px] pb-20">
            <BackBtn onClick={() => show("s-groups")}>{t(C.itf.back)}</BackBtn>
            <div className="mb-12">
              <div className="font-mono text-[11px] tracking-[0.22em] text-[#f0a500] uppercase mb-2.5">
                {t(C.itf.eyebrow)}
              </div>
              <h1 className="text-[clamp(28px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-0.025em] mb-3.5">
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-[15px]">
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
                      className={`font-mono text-[9.5px] tracking-[0.1em] uppercase border rounded px-2 py-0.5 inline-block mb-1.5 ${d.level === "beginner" ? "text-green-400 border-[rgba(74,222,128,0.3)]" : d.level === "intermediate" ? "text-amber-400 border-[rgba(245,158,11,0.3)]" : "text-red-400 border-[rgba(248,113,113,0.3)]"}`}>
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
          <div className="max-w-[1020px] w-full mx-auto px-6 py-[60px] pb-20">
            <BackBtn onClick={() => show("s-groups")}>{t(C.hw.back)}</BackBtn>
            <div className="bg-[rgba(74,222,128,0.06)] border border-[rgba(74,222,128,0.2)] rounded-xl px-[18px] py-3.5 mb-8 font-mono text-[11.5px] text-green-400 flex items-center gap-2.5">
              🔧 {t(C.hw.strip)}
            </div>
            <div className="mb-12">
              <div className="font-mono text-[11px] tracking-[0.22em] text-[#f0a500] uppercase mb-2.5">
                {t(C.hw.eyebrow)}
              </div>
              <h1 className="text-[clamp(28px,5vw,58px)] font-extrabold leading-[1.05] tracking-[-0.025em] mb-3.5 text-slate-200">
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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(265px,1fr))] gap-[15px]">
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
                    className={`font-mono text-[9.5px] tracking-[0.1em] uppercase border rounded px-2 py-0.5 inline-block mb-1.5 ${d.level === "beginner" ? "text-green-400 border-[rgba(74,222,128,0.3)]" : "text-amber-400 border-[rgba(245,158,11,0.3)]"}`}>
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
                <div className="max-w-[860px] w-full mx-auto px-6 py-14 pb-20">
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
                        className="w-[60px] h-[60px] rounded-[13px] flex items-center justify-center text-[27px] flex-shrink-0"
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
                        <span className="font-mono text-[11px] text-[#2d3a47] w-5 text-right flex-shrink-0 pt-0.5">
                          {String(l.n).padStart(2, "0")}
                        </span>
                        <span
                          className={`w-[9px] h-[9px] rounded-full flex-shrink-0 mt-1 ${l.available ? "bg-green-400 border border-green-400 shadow-[0_0_5px_rgba(74,222,128,0.4)]" : "bg-[#2d3a47] border border-[#1c2530]"}`}
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
                          className={`font-mono text-[9.5px] whitespace-nowrap pt-0.5 flex-shrink-0 ${l.available ? "text-green-400" : "text-[#2d3a47]"}`}>
                          {l.available ? t(C.td.avail) : t(C.td.soon)}
                        </span>
                        {l.available && (
                          <span className="text-[#64748b] text-[13px] pt-0.5 flex-shrink-0">
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
