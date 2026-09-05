/**
 * NHS Welcome Portal — Content & Data Module
 * ---------------------------------------------------------------------------
 * All bilingual strings, group info, track definitions, and lesson data.
 * Import into App.jsx so the UI stays clean and content is easy to update.
 *
 * Usage:
 *   import { C, soonData, trackData, hwTrackData } from "./data/content.js";
 *
 * Translator helper (keep in App.jsx):
 *   const t = (obj) =>
 *     typeof obj === "string" ? obj : obj?.[lang] || obj?.en || "";
 *
 * HOW TO ADD A NEW LANGUAGE
 *   1. Add a new key (e.g. "es") next to "en" / "tl" on every string object.
 *   2. Add the language code to the toggle buttons in App.jsx.
 *
 * HOW TO EDIT CONTENT
 *   Welcome / recruit / member  →  C.w, C.rb, C.mb
 *   About NHS                   →  C.nhs
 *   Groups grid                 →  C.grp
 *   Hardware portal             →  C.hw
 *   I.T. Infrastructure portal  →  C.itf
 *   Track detail labels         →  C.td
 *   Coming-soon groups          →  soonData
 *   I.T. Infra tracks           →  trackData
 *   Hardware tracks             →  hwTrackData
 */

/** Create placeholder lesson rows for tracks still being built */
export function mkLessons(n, avail = false) {
  return Array.from({ length: n }, (_, i) => ({
    n: i + 1,
    title: { en: `Lesson ${i + 1}`, tl: `Aralin ${i + 1}` },
    desc: {
      en: avail ? "Available" : "Coming soon",
      tl: avail ? "Available" : "Malapit na",
    },
    available: avail,
    url: avail ? "proxmox-bootcamp.html" : undefined,
  }));
}

export const C = {
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
      en: "Networks slow and Hardware down ? Join the squad and watch how it's done!",
      tl: "Network ba'y mabagal at Hardware ay sira? Halina sa team at makitang ang problema ay mawala!",
    },
    rlabel: { en: "For New Recruits", tl: "Para sa mga Bagong Miyembro" },
    rtitle: { en: "I'm new here", tl: "Bago pa ako dito" },
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

export const soonData = {
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

export const trackData = {
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

export const hwTrackData = [
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
