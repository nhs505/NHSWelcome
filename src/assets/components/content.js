/**
 * NHS Welcome Portal — Content, Curriculum & Default SQL Seed Data
 * ---------------------------------------------------------------------------
 * Updated for:
 *   - 6 Specialized Groups total (Group 00 through Group 05)
 *   - 3 User Roles: Recruit, Member (direct to Member Dashboard), and Admin (Sector 111)
 *   - In-App Bilingual Lesson Viewer (replaces missing proxmox-bootcamp.html & mkLessons stubs)
 *   - Relational SQL State & Live SQL Exporter
 */

export function buildLessonList(trackKey, items) {
     return items.map((item, idx) => ({
          id: `${trackKey}-L${idx + 1}`,
          n: idx + 1,
          title: item.title,
          desc: item.desc,
          available: item.available ?? true,
          minutes: item.minutes ?? 15,
          body: item.body || {
               en: `In this lesson (${item.title.en}), you will learn the core concepts, practical steps, and how this skill supports NHS operations across local congregations.`,
               tl: `Sa araling ito (${item.title.tl}), matututunan mo ang mga pangunahing konsepto at praktikal na hakbang para sa operasyon ng NHS.`,
          },
          cli: item.cli || null,
          takeaway: item.takeaway || {
               en: "Always verify physical and logical connections before applying configuration changes.",
               tl: "Laging suriin ang pisikal at lohikal na koneksyon bago magbago ng configuration.",
          },
          quiz: item.quiz || {
               q: {
                    en: `What is the primary goal of "${item.title.en}"?`,
                    tl: `Ano ang pangunahing layunin ng "${item.title.tl}"?`,
               },
               options: [
                    {
                         en: "Build reliable, well-documented systems for NHS operations",
                         tl: "Magtayo ng maaasahan at maayos na sistema para sa NHS",
                    },
                    {
                         en: "Skip testing and deploy directly to production",
                         tl: "Laktawan ang pag-test at agad i-deploy",
                    },
                    {
                         en: "Avoid documenting hardware or server changes",
                         tl: "Iwasan ang paggawa ng dokumentasyon",
                    },
               ],
               answer: 0,
          },
     }));
}

export const INITIAL_GROUPS = [
     {
          id: 1,
          code: "00",
          slug: "hardware",
          icon: "🔧",
          status: "open",
          buildProgress: 100,
          recommendedForRecruit: true,
          bar: "from-green-400 to-[#f0a500]",
          tagColor: "text-green-400",
          accent: "#4ade80",
          tag: {
               en: "Group 00 · Start Here",
               tl: "Pangkat 00 · Magsimula Dito",
          },
          title: { en: "Hardware Group", tl: "Hardware Group" },
          desc: {
               en: "The foundation of everything. Hardware Group teaches what a computer is, how to build one from scratch, and how to keep machines running.",
               tl: "Ang pundasyon ng lahat. Ang Hardware Group ay nagtuturo kung ano ang isang computer, paano ito buuin, at paano ito panatilihing gumagana.",
          },
     },
     {
          id: 2,
          code: "01",
          slug: "iot",
          icon: "🌐",
          status: "standby",
          buildProgress: 35,
          recommendedForRecruit: false,
          bar: "from-purple-400 to-violet-600",
          tagColor: "text-purple-400",
          accent: "#c084fc",
          tag: { en: "Group 01", tl: "Pangkat 01" },
          title: { en: "I.O.T Group", tl: "I.O.T Group" },
          desc: {
               en: "Internet of Things — connecting physical sensors, microcontrollers, and smart devices to the digital world.",
               tl: "Internet of Things — pagkokonekta ng mga pisikal na sensor at device sa digital na mundo.",
          },
     },
     {
          id: 3,
          code: "02",
          slug: "network",
          icon: "📡",
          status: "standby",
          buildProgress: 45,
          recommendedForRecruit: false,
          bar: "from-sky-400 to-sky-600",
          tagColor: "text-sky-400",
          accent: "#38bdf8",
          tag: { en: "Group 02", tl: "Pangkat 02" },
          title: { en: "Network Group", tl: "Network Group" },
          desc: {
               en: "Managing the pathways data travels on — Wi-Fi planning, switches, VLANs, cabling, and routers.",
               tl: "Pamamahala ng mga landas na tinatahak ng datos — Wi-Fi, switches, VLANs, at routers.",
          },
     },
     {
          id: 4,
          code: "03",
          slug: "admin",
          icon: "🗂️",
          status: "standby",
          buildProgress: 30,
          recommendedForRecruit: false,
          bar: "from-green-400 to-green-600",
          tagColor: "text-green-400",
          accent: "#4ade80",
          tag: { en: "Group 03", tl: "Pangkat 03" },
          title: { en: "Admin Group", tl: "Admin Group" },
          desc: {
               en: "Managing processes, SOP documentation, user accounts, ticketing, and operational workflows.",
               tl: "Pamamahala ng mga proseso, dokumentasyon, ticketing, at sistema ng operasyon.",
          },
     },
     {
          id: 5,
          code: "04",
          slug: "inventory",
          icon: "📦",
          status: "standby",
          buildProgress: 25,
          recommendedForRecruit: false,
          bar: "from-orange-400 to-orange-600",
          tagColor: "text-orange-400",
          accent: "#fb923c",
          tag: { en: "Group 04", tl: "Pangkat 04" },
          title: { en: "Inventory Group", tl: "Inventory Group" },
          desc: {
               en: "Tracking, cataloguing, and managing all physical hardware assets and equipment lifecycle.",
               tl: "Pagsubaybay at pamamahala ng lahat ng pisikal na kagamitan at lifecycle ng hardware.",
          },
     },
     {
          id: 6,
          code: "05",
          slug: "itinfra",
          icon: "🖥️",
          status: "open",
          buildProgress: 100,
          recommendedForRecruit: false,
          bar: "from-[#f0a500] to-[#ffc040]",
          tagColor: "text-[#f0a500]",
          accent: "#f0a500",
          tag: { en: "Group 05", tl: "Pangkat 05" },
          title: {
               en: "I.T. Infrastructure Group",
               tl: "I.T. Infrastructure Group",
          },
          desc: {
               en: "Building skills in servers, Proxmox virtual machines, Linux, networking, SQL databases, and security.",
               tl: "Pagtatayo ng mga kasanayan sa mga server, Proxmox virtual machine, Linux, networking, SQL database, at seguridad.",
          },
     },
];

export const RECRUIT_CHECKLIST = [
     {
          id: "read_hierarchy",
          title: {
               en: "Understand SFM → STF → NHS",
               tl: "Unawain ang SFM → STF → NHS",
          },
          desc: {
               en: "Read how NHS operates inside the Special Task Force at School For Ministers.",
               tl: "Alamin kung paano gumagana ang NHS sa loob ng Special Task Force ng SFM.",
          },
     },
     {
          id: "explore_6_groups",
          title: {
               en: "Explore All 6 Specialized NHS Groups (00–05)",
               tl: "Tuklasin ang 6 na Pangkat ng NHS (00–05)",
          },
          desc: {
               en: "Visit the Groups portal to see how Hardware, IoT, Network, Admin, Inventory, and I.T. Infra work together.",
               tl: "Bisitahin ang Groups portal upang makita ang 6 na pangkat ng NHS.",
          },
     },
     {
          id: "complete_hw_lesson1",
          title: {
               en: "Complete Hardware Track 01 · Lesson 01",
               tl: "Tapusin ang Hardware Track 01 · Aralin 01",
          },
          desc: {
               en: "Open the in-app Lesson Viewer in Hardware Group and complete CPU, RAM & Storage basics.",
               tl: "Buksan ang Lesson Viewer sa Hardware Group at tapusin ang unang aralin.",
          },
     },
     {
          id: "complete_proxmox_intro",
          title: {
               en: "Complete Proxmox VE · Lesson 01",
               tl: "Tapusin ang Proxmox VE · Aralin 01",
          },
          desc: {
               en: "Learn how a Type-1 hypervisor turns one physical server into many virtual machines.",
               tl: "Alamin kung paano hinahati ng Proxmox ang isang server sa maraming virtual machine.",
          },
     },
     {
          id: "select_primary_group",
          title: {
               en: "Confirm Your Primary Group Assignment",
               tl: "Kumpirmahin ang Iyong Pangunahing Pangkat",
          },
          desc: {
               en: "Coordinate with Sector 111 or your group lead to get registered in the SQL user directory.",
               tl: "Makipag-ugnayan sa Sector 111 o sa iyong group lead para sa iyong pangkat.",
          },
     },
];

export const INITIAL_USERS = [
     {
          id: 1,
          sectorCode: "SECTOR-111",
          fullName: "Sector 111 (System Lead)",
          email: "sector111@nhs.sfm.local",
          role: "admin",
          primaryGroup: "05",
          lang: "en",
     },
     {
          id: 2,
          sectorCode: "MEM-2025-08",
          fullName: "Bro. Marco (Infra Specialist)",
          email: "marco@nhs.sfm.local",
          role: "member",
          primaryGroup: "05",
          lang: "en",
     },
     {
          id: 3,
          sectorCode: "MEM-2025-14",
          fullName: "Bro. Daniel (Hardware Lead)",
          email: "daniel@nhs.sfm.local",
          role: "member",
          primaryGroup: "00",
          lang: "tl",
     },
     {
          id: 4,
          sectorCode: "REC-2026-01",
          fullName: "Bro. Joshua (New Recruit)",
          email: "joshua@nhs.sfm.local",
          role: "recruit",
          primaryGroup: "00",
          lang: "en",
     },
];

export const INITIAL_ANNOUNCEMENTS = [
     {
          id: 1,
          badge: "SYSTEM UPDATE",
          audience: "all",
          pinned: true,
          date: "2026-10-22",
          title: {
               en: "6-Group Orientation Portal & In-App Lesson Viewer Live",
               tl: "Bukas Na ang 6-Group Portal at In-App Lesson Viewer",
          },
          body: {
               en: "All 6 NHS groups (Group 00 to Group 05) are now indexed with an integrated Lesson Viewer, Member Dashboard, Admin System Control, and SQL database synchronization.",
               tl: "Ang lahat ng 6 na pangkat ng NHS (Pangkat 00 hanggang 05) ay mayroon nang In-App Lesson Viewer, Member Dashboard, Admin Control, at SQL database.",
          },
     },
     {
          id: 2,
          badge: "CROSS-TRAINING",
          audience: "member",
          pinned: false,
          date: "2026-10-22",
          title: {
               en: "Proxmox VE & SQL Database Tracks Ready for Old Members",
               tl: "Proxmox VE at SQL Database Tracks Bukas Para sa Mga Miyembro",
          },
          body: {
               en: "Returning NHS members can jump straight from the Member Dashboard into Proxmox VE (12 lessons), Linux CLI, and Database Management (SQL).",
               tl: "Maaaring dumiretso ang mga miyembro ng NHS mula sa Member Dashboard patungo sa Proxmox VE, Linux CLI, at SQL Database Management.",
          },
     },
];

export const C = {
     w: {
          badge: {
               en: "SFM · Special Task Force · NHS",
               tl: "SFM · Special Task Force · NHS",
          },
          pre: { en: "Welcome to", tl: "Maligayang\nPagdating sa" },
          sub1: {
               en: "Network & Hardware Support",
               tl: "Network at Hardware Support",
          },
          sub2: {
               en: "Networks slow and Hardware down? Join the team and watch how it's done!",
               tl: "Network na mabagal at Hardware na sira? Sumali sa team at tingnan kung paano ito ginagawa!",
          },
          rlabel: { en: "For New Recruits", tl: "Para sa mga Bagong Miyembro" },
          rtitle: { en: "I'm new here", tl: "Bago pa ako dito" },
          rdesc: {
               en: "First time hearing about NHS? No technical background at all? Start with our guided orientation & Hardware foundation.",
               tl: "Unang beses mong marinig ang NHS? Walang background sa teknolohiya? Magsimula sa aming guided orientation.",
          },
          mlabel: { en: "For NHS Members", tl: "Para sa mga Miyembro ng NHS" },
          mtitle: { en: "I'm already in NHS", tl: "Miyembro na ako ng NHS" },
          mdesc: {
               en: "Go straight to the Member Dashboard — cross-train into a new group, resume advanced tracks, or review team bulletins.",
               tl: "Dumiretso sa Member Dashboard — mag-cross-train sa ibang pangkat, ipagpatuloy ang mga aralin, at basahin ang mga bulletin.",
          },
          alabel: { en: "System Control · Sector 111", tl: "System Control · Sector 111" },
          atitle: { en: "Admin Console", tl: "Admin Console" },
          adesc: {
               en: "Full control over all 6 NHS groups, learning tracks, bilingual lessons, user roles, and the SQL database.",
               tl: "Buong kontrol sa 6 na pangkat ng NHS, mga learning track, aralin, user roles, at SQL database.",
          },
          skip: {
               en: "Explore all 6 groups directly →",
               tl: "Tuklasin agad ang 6 na pangkat →",
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
               en: "You don't need any background in technology. Everything you need to know will be taught here — starting from the very beginning, using plain language and real analogies. Complete your 5-step Orientation Checklist below!",
               tl: "Hindi mo kailangang may background sa teknolohiya. Lahat ng kailangan mong malaman ay ituturo dito — mula sa simula, sa simpleng wika at tunay na mga halimbawa.",
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
               en: "You're already part of this team. Use the Member Dashboard to jump straight into cross-training tracks, Proxmox labs, or any of the 6 NHS groups.",
               tl: "Bahagi ka na ng pangkat na ito. Gamitin ang Member Dashboard upang makapag-cross-train sa alinman sa 6 na pangkat ng NHS.",
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
               en: "Network & Hardware Support — the technology-focused team within STF across 6 specialized groups.",
               tl: "Network at Hardware Support — ang pangkat na nakatuon sa teknolohiya sa loob ng STF na may 6 na espesyalisadong pangkat.",
          },
          whatEye: {
               en: "What we actually do",
               tl: "Ang aming tunay na ginagawa",
          },
          whatH: {
               en: "We're not I.T. support.\nWe're students building skills for the future.",
               tl: "Hindi kami I.T. support.\nKami ay mga estudyanteng nagtatayo ng kasanayan para sa kinabukasan.",
          },
          whatLead: {
               en: "Every NHS member is a student first. We learn technology by doing it — building real projects that will serve local congregations worldwide.",
               tl: "Bawat miyembro ng NHS ay estudyante muna. Natututo kami sa teknolohiya sa pamamagitan ng paggawa.",
          },
          id1t: { en: "Real Projects", tl: "Tunay na mga Proyekto" },
          id1d: {
               en: "NHS members design, build, and document real hardware and server projects.",
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
               en: "NHS isn't a solo experience. You grow alongside teammates across all 6 groups.",
               tl: "Ang NHS ay hindi isang nag-iisang karanasan. Lalago ka kasama ng 6 na pangkat.",
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
               {
                    en: "You can't code yet.",
                    tl: "Hindi ka pa marunong mag-code.",
               },
               {
                    en: "You're not sure which of the 6 groups fits you.",
                    tl: "Hindi ka sigurado kung alin sa 6 na pangkat ang para sa iyo.",
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
               en: "Inside NHS there are six specialized groups (Group 00 to Group 05). Explore all of them.",
               tl: "Sa loob ng NHS ay anim na espesyalisadong pangkat (Pangkat 00 hanggang Pangkat 05). Tuklasin ang lahat.",
          },
          seeGroups: {
               en: "Explore the 6 groups →",
               tl: "Tuklasin ang 6 na pangkat →",
          },
          backToWelcome: { en: "← Back to Welcome", tl: "← Bumalik sa Welcome" },
     },
     grp: {
          eyebrow: {
               en: "The six groups of NHS",
               tl: "Ang anim na pangkat ng NHS",
          },
          h: {
               en: "Choose your world to explore.",
               tl: "Piliin ang mundo mong tuklasin.",
          },
          lead: {
               en: "Each of the 6 groups inside NHS focuses on a vital slice of technology.",
               tl: "Bawat isa sa 6 na pangkat sa loob ng NHS ay nakatuon sa mahalagang bahagi ng teknolohiya.",
          },
          back: { en: "← Back", tl: "← Bumalik" },
          statusOpen: {
               en: "Open — Explore Now",
               tl: "Bukas — Tuklasin Ngayon",
          },
          statusSoon: { en: "Standby — Preview Syllabus", tl: "Standby — Tingnan ang Syllabus" },
          enterBtn: { en: "Preview", tl: "Tingnan" },
          enterOpen: {
               en: "Enter Group Portal →",
               tl: "Pumasok sa Portal →",
          },
          startHere: {
               en: "★ Recommended for all new recruits",
               tl: "★ Inirerekomenda para sa lahat ng bagong miyembro",
          },
          memberCrossTrain: {
               en: "⚡ Cross-Training Ready",
               tl: "⚡ Handa para sa Cross-Training",
          },
     },
     hw: {
          eyebrow: {
               en: "NHS · Group 00 · Hardware Group",
               tl: "NHS · Pangkat 00 · Hardware Group",
          },
          strip: {
               en: "★  Foundational Group 00 — Recommended starting point for all new NHS recruits",
               tl: "★  Pundasyong Pangkat 00 — Inirerekomendang unang pangkat para sa lahat ng bagong miyembro",
          },
          h1: {
               en: "We build computers.",
               tl: "Nagtatayo kami ng mga computer.",
          },
          h2: { en: "We fix them.", tl: "Inaaayos namin ang mga ito." },
          h3: {
               en: "We teach everyone how they work.",
               tl: "Itinuturo namin sa lahat kung paano ito gumagana.",
          },
          lead: {
               en: "Hardware Group (Group 00) is where every NHS member begins. We teach the physical side of computing — from components and BIOS to OS deployment and diagnostics.",
               tl: "Ang Hardware Group (Pangkat 00) ay kung saan nagsisimula ang bawat miyembro ng NHS. Walang kinakailangang karanasan.",
          },
          chips: {
               en: [
                    "Computer Parts",
                    "Building PCs",
                    "Operating Systems",
                    "Bootable USB",
                    "Windows & Linux Install",
                    "Troubleshooting",
               ],
               tl: [
                    "Mga Parte ng Computer",
                    "Pagtatayo ng PC",
                    "Mga Operating System",
                    "Bootable USB",
                    "Pag-install ng Windows at Linux",
                    "Pag-troubleshoot",
               ],
          },
          abLabel: { en: "Why start here?", tl: "Bakit magsimula dito?" },
          abText: {
               en: "Before you can manage a server or configure a network, you need to understand the machine in front of you. Hardware Group answers: what exactly is a computer?",
               tl: "Bago mo mapamahalaan ang isang server, kailangan mong maunawaan ang makinang nasa harap mo. Ano talaga ang isang computer?",
          },
          abHighlight: {
               en: "Hardware Group answers: what exactly is a computer?",
               tl: "Ano talaga ang isang computer?",
          },
          tracksLabel: { en: "Learning Tracks", tl: "Mga Learning Track" },
          tracksH: {
               en: "Follow the order. It all builds on itself.",
               tl: "Sundin ang pagkakasunud-sunod.",
          },
          tracksSub: {
               en: "Start with Track 01 — click any available lesson to open the In-App Lesson Viewer.",
               tl: "Magsimula sa Track 01 — buksan ang In-App Lesson Viewer sa bawat aralin.",
          },
          back: {
               en: "← Back to all 6 groups",
               tl: "← Bumalik sa 6 na pangkat",
          },
     },
     soon: {
          tag: { en: "Standby Module · Curriculum Preview", tl: "Standby Module · Preview ng Aralin" },
          lead: {
               en: "This group's full portal is currently in standby. Review the upcoming syllabus below or jump into a prerequisite track in Hardware (Group 00) or I.T. Infrastructure (Group 05).",
               tl: "Ang portal ng pangkat na ito ay kasalukuyang inihahanda. Tingnan ang syllabus sa ibaba o magsimula sa prerequisite track.",
          },
          barLabel: { en: "PORTAL BUILD PROGRESS", tl: "PROGRESO NG PORTAL" },
          featLabel: {
               en: "What you'll learn here",
               tl: "Ang matututunan mo dito",
          },
          prereqLabel: {
               en: "Recommended Prerequisite Track While Waiting",
               tl: "Inirerekomendang Prerequisite Track Habang Naghihintay",
          },
          backBtn: {
               en: "← Back to all 6 groups",
               tl: "← Bumalik sa 6 na pangkat",
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
               en: "I.T. Infrastructure (Group 05) builds, configures, and manages physical servers, Proxmox virtual machines, Linux environments, and SQL databases.",
               tl: "Ang I.T. Infrastructure (Pangkat 05) ay nagtatayo, nagko-configure, at namamahala ng mga server, Proxmox VM, Linux, at SQL database.",
          },
          chips: {
               en: [
                    "Servers",
                    "Proxmox VE",
                    "Networking",
                    "Linux CLI",
                    "SQL Databases",
                    "Cybersecurity",
               ],
               tl: [
                    "Mga Server",
                    "Proxmox VE",
                    "Networking",
                    "Linux CLI",
                    "SQL Database",
                    "Seguridad",
               ],
          },
          abLabel: {
               en: "Think of it this way",
               tl: "Isipin ito sa ganitong paraan",
          },
          abText: {
               en: "Imagine a city. Network Group builds the roads. I.T. Infrastructure builds the power plant.",
               tl: "Isipin ang isang lungsod. Network Group ang nagtatayo ng mga daan. I.T. Infrastructure ang nagtatayo ng power plant.",
          },
          abHighlight: {
               en: "I.T. Infrastructure builds the power plant.",
               tl: "I.T. Infrastructure ang nagtatayo ng power plant.",
          },
          tracksLabel: { en: "Learning Tracks", tl: "Mga Learning Track" },
          tracksH: {
               en: "Pick where you want to start.",
               tl: "Piliin kung saan ka gustong magsimula.",
          },
          tracksSub: {
               en: "Every track starts from clear analogies and opens directly in the In-App Lesson Viewer.",
               tl: "Bawat track ay may malinaw na halimbawa at bubukas sa In-App Lesson Viewer.",
          },
          back: {
               en: "← Back to all 6 groups",
               tl: "← Bumalik sa 6 na pangkat",
          },
     },
     td: {
          eyebrow: {
               en: "I.T. Infrastructure · Learning Track",
               tl: "I.T. Infrastructure · Learning Track",
          },
          eyebrowHw: {
               en: "Hardware Group · Learning Track",
               tl: "Hardware Group · Learning Track",
          },
          abLabel: {
               en: "Before we start — think of it this way",
               tl: "Bago tayo magsimula — isipin ito ng ganito",
          },
          llLabel: { en: "Interactive Lesson Plan", tl: "Plano ng mga Aralin" },
          avail: { en: "Open Lesson", tl: "Buksan ang Aralin" },
          done: { en: "Completed ✓", tl: "Tapos Na ✓" },
          soon: { en: "Coming soon", tl: "Malapit na" },
          openBtn: {
               en: "Launch Proxmox VE In-App Course",
               tl: "Buksan ang Proxmox VE Course sa App",
          },
          startBtn: {
               en: "Start Lesson 01 in Viewer",
               tl: "Simulan ang Unang Aralin",
          },
          opensIn: {
               en: "Opens directly in the built-in NHS Lesson Viewer",
               tl: "Bubukas mismo sa loob ng NHS Lesson Viewer",
          },
          buildNote: {
               en: "Admins can unlock and edit lessons for this track at any time in the Admin Console.",
               tl: "Maaaring buksan at i-edit ng Admin ang mga aralin sa Admin Console.",
          },
          back: {
               en: "← Back to I.T. Infrastructure",
               tl: "← Bumalik sa I.T. Infrastructure",
          },
          backHw: {
               en: "← Back to Hardware Group",
               tl: "← Bumalik sa Hardware Group",
          },
          availNow: { en: "available now", tl: "available na ngayon" },
          building: { en: "In preparation", tl: "Kasalukuyang Itinatayo" },
          lessons: { en: "lessons", tl: "mga aralin" },
     },
};

export const soonData = {
     iot: {
          icon: "🌐",
          prereqTrack: { parent: "s-hardware", trackId: "anatomy", label: "Hardware Track 01 · Anatomy of a Computer" },
          title: { en: "Group 01 · I.O.T Group", tl: "Pangkat 01 · I.O.T Group" },
          features: {
               en: [
                    "Introduction to Microcontrollers (ESP32 & Arduino)",
                    "Setting up temperature, motion, and power sensors",
                    "Connecting IoT nodes to local congregation VLANs",
                    "Reading live telemetry dashboards via MQTT",
                    "Building a real automated monitoring project",
               ],
               tl: [
                    "Panimula sa Microcontrollers (ESP32 at Arduino)",
                    "Pag-set up ng sensor (temperatura, mosyon, kuryente)",
                    "Pagkokonekta ng IoT device sa network",
                    "Pagbabasa ng live data gamit ang MQTT",
                    "Pagtatayo ng tunay na IoT project",
               ],
          },
     },
     network: {
          icon: "📡",
          prereqTrack: { parent: "s-itinfra", trackId: "network", label: "I.T. Infra · Networking for Infra" },
          title: { en: "Group 02 · Network Group", tl: "Pangkat 02 · Network Group" },
          features: {
               en: [
                    "OSI & TCP/IP fundamentals and RJ45 cabling standards",
                    "IPv4 subnetting, DHCP, DNS, and gateway routing",
                    "Managed switch and VLAN trunk configuration",
                    "High-density Wi-Fi access point placement & channel planning",
                    "Firewall rules and securing congregation networks",
               ],
               tl: [
                    "Paano gumagana ang network at tamang pag-crimping ng RJ45",
                    "IP address, subnetting, DHCP, DNS, at routing",
                    "Pag-configure ng managed switch at VLAN",
                    "Pagpaplano ng Wi-Fi access points",
                    "Pag-secure ng network at firewall",
               ],
          },
     },
     admin: {
          icon: "🗂️",
          prereqTrack: { parent: "s-itinfra", trackId: "database", label: "I.T. Infra · Database Management (SQL)" },
          title: { en: "Group 03 · Admin Group", tl: "Pangkat 03 · Admin Group" },
          features: {
               en: [
                    "NHS member registry and role-based access control",
                    "Standard Operating Procedure (SOP) documentation standards",
                    "Helpdesk ticketing triage and escalation workflows",
                    "Project milestone tracking across all 6 NHS groups",
                    "Cross-group communication and incident reporting",
               ],
               tl: [
                    "Pamamahala ng user account at access control",
                    "Sistema ng SOP at dokumentasyon",
                    "Ticketing at pagtugon sa mga request",
                    "Pagsubaybay sa mga proyekto ng 6 na pangkat",
                    "Koordinasyon ng buong NHS team",
               ],
          },
     },
     inventory: {
          icon: "📦",
          prereqTrack: { parent: "s-hardware", trackId: "maintenance", label: "Hardware Track 10 · Maintenance & Care" },
          title: { en: "Group 04 · Inventory Group", tl: "Pangkat 04 · Inventory Group" },
          features: {
               en: [
                    "Hardware asset tagging, serial logging, and QR barcoding",
                    "Component lifecycle tracking (from procurement to retirement)",
                    "SQL inventory database auditing and stock alerts",
                    "Preventive maintenance scheduling and condition grading",
                    "Spare-parts kit preparation for field deployments",
               ],
               tl: [
                    "Asset cataloguing at paglalagay ng QR/serial tags",
                    "Lifecycle ng hardware mula pagbili hanggang kapalit",
                    "Pagsubaybay ng inventory gamit ang SQL database",
                    "Pagmamasid sa kondisyon ng mga computer at server",
                    "Dokumentasyon ng pagkuha ng kagamitan",
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
               en: "Understand what a physical and virtual server actually is using plain language and real-world analogies.",
               tl: "Unawain kung ano talaga ang pisikal at virtual na server gamit ang simpleng wika.",
          },
          analogy: {
               en: "The server is the kitchen of a restaurant that never closes — taking requests from client devices and serving back data.",
               tl: "Ang server ay ang kusina ng isang restaurant na hindi nagsasara — tumatanggap ng request at nagbibigay ng datos.",
          },
          lessons: buildLessonList("server", [
               {
                    title: { en: "Desktop PC vs. Enterprise Server", tl: "Desktop PC kumpara sa Server" },
                    desc: { en: "Why servers are built for 24/7 reliability, ECC memory, and redundant power.", tl: "Bakit ginawa ang server para tumakbo nang 24/7." },
                    available: true,
                    minutes: 12,
                    body: {
                         en: "A server is not magic—it has a CPU, RAM,storage, and network card just like your desktop PC. The difference is mission: a desktop serves one person at a desk, while a server provides services (websites, databases, authentication, files) to dozens or hundreds of users over a network 24/7.",
                         tl: "Ang server ay may CPU, RAM, storage, at network card din tulad ng regular na PC. Ang pinagkaiba ay ang layunin nito: ang PC ay para sa isang tao, habang ang server ay nagbibigay ng serbisyo sa maraming user sa network nang 24/7.",
                    },
                    cli: "# Check server uptime and load average on Linux\nuptime\n# View CPU and RAM summary\nlscpu | head -n 12 && free -h",
               },
               {
                    title: { en: "How Clients and Servers Talk (Request & Response)", tl: "Paano Nag-uusap ang Client at Server" },
                    desc: { en: "IP addresses, ports, and the request-response cycle explained.", tl: "IP address, port, at ang ikot ng request at response." },
                    available: true,
                    minutes: 15,
                    cli: "# Test connectivity and HTTP headers from a server\ncurl -I http://localhost:4000/api/health",
               },
               {
                    title: { en: "Rack Servers, Tower Servers & Blade Chassis", tl: "Mga Uri ng Server Hardware" },
                    desc: { en: "Understanding 1U, 2U, 4U rack units and server room airflow.", tl: "Pag-unawa sa 1U, 2U, at airflow sa server rack." },
                    available: true,
               },
               {
                    title: { en: "RAID & Redundant Storage Basics", tl: "RAID at Redundant Storage" },
                    desc: { en: "How servers survive a hard drive failure without losing congregation data.", tl: "Paano nananatiling ligtas ang datos kahit masira ang isang drive." },
                    available: false,
               },
               {
                    title: { en: "Out-of-Band Management (IPMI / iDRAC / iLO)", tl: "Remote Management ng Server (IPMI)" },
                    desc: { en: "Powering on and fixing a server remotely even when the OS is down.", tl: "Pagkontrol sa server nang malayuan kahit patay ang OS." },
                    available: false,
               },
          ]),
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
               en: "Learn the essential terminal commands to navigate, configure, and control any Linux server.",
               tl: "Matuto ng mahahalagang terminal command para kontrolin ang anumang Linux server.",
          },
          analogy: {
               en: "A graphical desktop is like ordering from a picture menu; the Linux terminal is speaking directly to the chef.",
               tl: "Ang Linux terminal ay direktang pakikipag-usap sa sistema nang mabilis at eksakto.",
          },
          lessons: buildLessonList("linux", [
               {
                    title: { en: "Navigating the Linux Filesystem (pwd, ls, cd)", tl: "Paglilibot sa Linux Filesystem (pwd, ls, cd)" },
                    desc: { en: "Understanding /, /etc, /var, /home, and moving around the terminal.", tl: "Pag-unawa sa /, /etc, /var, /home sa terminal." },
                    available: true,
                    cli: "pwd\nls -la /etc\ncd /var/log && ls -lh",
               },
               {
                    title: { en: "Users, Permissions & sudo (chmod, chown)", tl: "Users, Permissions at sudo" },
                    desc: { en: "How Linux protects system files and how root privileges work.", tl: "Paano pinoprotektahan ng Linux ang mga system file." },
                    available: true,
                    cli: "whoami\nchmod 640 config.env\nsudo chown nhsadmin:nhsadmin /srv/nhs-portal",
               },
               {
                    title: { en: "Managing Packages & Updates (apt)", tl: "Pag-install at Update Gamit ang apt" },
                    desc: { en: "Keeping Debian/Ubuntu/Proxmox servers patched and installing tools.", tl: "Pag-update ng Debian at Ubuntu server." },
                    available: true,
                    cli: "sudo apt update && sudo apt upgrade -y\nsudo apt install htop curl git -y",
               },
               {
                    title: { en: "Systemd Services & Logs (systemctl, journalctl)", tl: "Systemd Services at Pagbasa ng Logs" },
                    desc: { en: "Starting, stopping, enabling services on boot, and reading error logs.", tl: "Pagpapatakbo ng serbisyo at pag-check ng logs." },
                    available: false,
               },
               {
                    title: { en: "SSH Key Authentication & Remote Access", tl: "SSH Keys at Ligtas na Remote Login" },
                    desc: { en: "Connecting securely to remote servers without password brute-force risks.", tl: "Ligtas na pagkonekta sa server gamit ang SSH key." },
                    available: false,
               },
               {
                    title: { en: "Disk Usage & Mounting Drives (df, lsblk, fstab)", tl: "Pag-check ng Storage at Drives" },
                    desc: { en: "Inspecting partitions and available space on production servers.", tl: "Pagsusuri ng storage space sa server." },
                    available: false,
               },
          ]),
     },
     proxmox: {
          icon: "⚡",
          color: "#f87171",
          level: "beginner",
          title: { en: "Proxmox VE Bootcamp", tl: "Proxmox VE Bootcamp" },
          levelLabel: { en: "Beginner → Pro", tl: "Simula → Pro" },
          desc: {
               en: "Our flagship 12-lesson field course — learn how to virtualize servers with Proxmox VE inside the In-App Lesson Viewer.",
               tl: "Ang aming pangunahing 12-aralin na kurso — matuto ng Proxmox VE mismo sa loob ng In-App Lesson Viewer.",
          },
          analogy: {
               en: "Proxmox VE divides one physical server into an apartment building of independent virtual machines and containers.",
               tl: "Ang Proxmox VE ay humahati sa isang pisikal na server upang maging maraming hiwa-hiwalay na virtual machine.",
          },
          lessons: buildLessonList("proxmox", [
               {
                    title: { en: "01 · What Is Virtualization & Why Proxmox VE?", tl: "01 · Ano ang Virtualization at Bakit Proxmox VE?" },
                    desc: { en: "Type-1 bare-metal hypervisors vs. Type-2 desktop virtualization.", tl: "Pagkakaiba ng Type-1 bare-metal hypervisor sa karaniwang PC." },
                    available: true,
                    minutes: 15,
                    body: {
                         en: "Traditionally, one physical server ran only one operating system—leaving 85% of its CPU and RAM idle. Proxmox Virtual Environment (PVE) is an open-source Type-1 hypervisor based on Debian Linux. It installs directly onto bare-metal hardware and lets NHS run multiple isolated Virtual Machines (KVM) and lightweight Linux Containers (LXC) on a single physical host.",
                         tl: "Dati, ang isang pisikal na server ay nagpapatakbo lamang ng isang OS kaya nasasayang ang lakas ng CPU at RAM. Ang Proxmox VE ay isang Type-1 hypervisor na ini-install mismo sa server upang makagawa tayo ng maraming Virtual Machines (KVM) at Containers (LXC) sa iisang makina.",
                    },
                    cli: "# Verify Proxmox VE version and cluster node status\npveversion -v\npvesh get /nodes",
               },
               {
                    title: { en: "02 · Hardware Requirements & BIOS Virtualization (VT-x / AMD-V)", tl: "02 · Mga Kailangan sa Hardware at BIOS (VT-x / AMD-V)" },
                    desc: { en: "Preparing server hardware, enabling CPU virtualization extensions, and ISO flashing.", tl: "Paghahanda ng server at pag-enable ng virtualization sa BIOS." },
                    available: true,
                    minutes: 15,
                    cli: "# Confirm hardware virtualization extensions are enabled on the CPU\negrep -c '(vmx|svm)' /proc/cpuinfo",
               },
               {
                    title: { en: "03 · Installing Proxmox VE & Web Console Tour (:8006)", tl: "03 · Pag-install ng Proxmox VE at Web Console (:8006)" },
                    desc: { en: "Static IP setup during installation and logging into https://ip:8006.", tl: "Paglalagay ng static IP at pagbukas ng web console sa port 8006." },
                    available: true,
                    minutes: 20,
                    cli: "# Proxmox Web UI is served over HTTPS on port 8006\n# Default login realm: Linux PAM standard authentication (root)\nhttps://192.168.1.100:8006",
               },
               {
                    title: { en: "04 · Configuring Repositories & Removing Subscription Nag", tl: "04 · Pag-configure ng No-Subscription Repository" },
                    desc: { en: "Switching from enterprise repo to pve-no-subscription for lab & congregation servers.", tl: "Pag-set up ng pve-no-subscription repository para sa updates." },
                    available: true,
                    minutes: 15,
                    cli: "# Disable enterprise repo and enable pve-no-subscription\nsed -i 's/^deb/#deb/' /etc/apt/sources.list.d/pve-enterprise.list\necho 'deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription' > /etc/apt/sources.list.d/pve-no-sub.list\napt update && apt dist-upgrade -y",
               },
               {
                    title: { en: "05 · Storage Pools: local, local-lvm, ZFS & ISO Uploads", tl: "05 · Storage Pools: local, local-lvm, ZFS at ISO" },
                    desc: { en: "Where ISOs, templates, virtual disks, and backups live inside Proxmox.", tl: "Kung saan inilalagay ang mga ISO installer, virtual disk, at backup." },
                    available: true,
                    minutes: 18,
                    cli: "# List storage pools and available capacity\npvesm status\n# List uploaded ISO images in local storage\nls -lh /var/lib/vz/template/iso/",
               },
               {
                    title: { en: "06 · Creating Your First KVM Virtual Machine", tl: "06 · Paggawa ng Unang KVM Virtual Machine" },
                    desc: { en: "Allocating CPU cores, VirtIO SCSI disks, RAM ballooning, and installing Ubuntu/Windows.", tl: "Paglalaan ng CPU, RAM, at VirtIO disk para sa bagong VM." },
                    available: true,
                    minutes: 25,
                    cli: "# List all running and stopped Virtual Machines\nqm list\n# Start VM 101 from the terminal\nqm start 101 && qm status 101",
               },
               {
                    title: { en: "07 · LXC Containers: Lightweight Instant Servers", tl: "07 · LXC Containers: Mabibilis at Magagaang Server" },
                    desc: { en: "When to use an LXC container vs. a full VM, and downloading CT templates.", tl: "Kailan dapat gumamit ng LXC container kumpara sa buong VM." },
                    available: true,
                    minutes: 20,
                    cli: "# Update container template list and download Debian 12 LXC\npveam update\npveam available --section system\npct list",
               },
               {
                    title: { en: "08 · Virtual Networking: Linux Bridges (vmbr0) & VLANs", tl: "08 · Virtual Networking: Linux Bridge (vmbr0) at VLAN" },
                    desc: { en: "How virtual machines share physical NICs and segment traffic with VLAN tags.", tl: "Paano kumokonekta sa network ang mga VM gamit ang vmbr0." },
                    available: true,
                    minutes: 20,
                    cli: "# Inspect bridge network configuration on Proxmox host\ncat /etc/network/interfaces\nip addr show vmbr0",
               },
               {
                    title: { en: "09 · Snapshots, Clones & VM Templates", tl: "09 · Snapshots, Clones at Golden Templates" },
                    desc: { en: "Taking a safety snapshot before updates and deploying new VMs in 30 seconds.", tl: "Paggawa ng snapshot bago mag-update para madaling maibalik." },
                    available: true,
                    minutes: 15,
                    cli: "# Create a pre-upgrade snapshot of VM 101\nqm snapshot 101 pre_upgrade --description 'Before package upgrade'\n# Roll back if needed\nqm rollback 101 pre_upgrade",
               },
               {
                    title: { en: "10 · Automated Backups (vzdump) & Disaster Recovery", tl: "10 · Automated Backups at Disaster Recovery" },
                    desc: { en: "Scheduling nightly compressed backups and testing full VM restoration.", tl: "Pag-schedule ng awtomatikong backup at pag-test ng restore." },
                    available: true,
                    minutes: 20,
                    cli: "# Run an immediate ZSTD-compressed snapshot backup of VM 101\nvzdump 101 --mode snapshot --compress zstd --storage local",
               },
               {
                    title: { en: "11 · Firewall Rules, User Permissions & Two-Factor Auth", tl: "11 · Firewall, User Permissions at Seguridad" },
                    desc: { en: "Securing the Proxmox cluster and granting least-privilege access to team members.", tl: "Pag-secure ng Proxmox lab at pagbibigay ng tamang access sa team." },
                    available: true,
                    minutes: 18,
                    cli: "# Check Proxmox firewall status\npve-firewall status\n# List Proxmox users and roles\npveum user list",
               },
               {
                    title: { en: "12 · Capstone Lab: Deploying the NHS Portal Stack on Proxmox", tl: "12 · Capstone Lab: Pag-deploy ng NHS Portal sa Proxmox" },
                    desc: { en: "End-to-end checklist: provisioning an LXC container for the SQL database and web portal.", tl: "Kumpletong pagsasanay: pagpapatakbo ng NHS Portal at SQL database sa Proxmox." },
                    available: true,
                    minutes: 30,
                    cli: "# Inside your Proxmox LXC container: verify NHS Portal & SQL service\nnode server/index.js &\ncurl http://localhost:4000/api/health",
               },
          ]),
     },
     deploy: {
          icon: "🚀",
          color: "#38bdf8",
          level: "intermediate",
          title: { en: "Deploying Services (Docker & Containers)", tl: "Pag-deploy ng mga Serbisyo (Docker)" },
          levelLabel: { en: "Intermediate", tl: "Katamtaman" },
          desc: {
               en: "Package and deploy real web apps, reverse proxies, and internal tools using Docker Compose.",
               tl: "Mag-deploy ng mga web app at serbisyo sa server gamit ang Docker Compose.",
          },
          analogy: {
               en: "If Proxmox builds the shopping mall, Docker opens standardized stores inside it.",
               tl: "Kung ang Proxmox ang mall, ang Docker ang nagbubukas ng maayos na mga tindahan sa loob nito.",
          },
          lessons: buildLessonList("deploy", [
               {
                    title: { en: "Containers vs. Virtual Machines", tl: "Containers kumpara sa Virtual Machines" },
                    desc: { en: "How Docker shares the host Linux kernel for sub-second startup.", tl: "Paano gumagana nang mabilis ang Docker containers." },
                    available: true,
                    cli: "docker version\ndocker ps -a",
               },
               {
                    title: { en: "Writing Clean docker-compose.yml Files", tl: "Pagsulat ng docker-compose.yml" },
                    desc: { en: "Defining ports, persistent volumes, environment variables, and restart policies.", tl: "Pag-set up ng ports, volumes, at restart policies." },
                    available: true,
                    cli: "docker compose up -d\ndocker compose logs -f",
               },
               {
                    title: { en: "Reverse Proxies & HTTPS Certificates (Nginx)", tl: "Reverse Proxy at HTTPS (Nginx)" },
                    desc: { en: "Routing clean domain names to internal container ports securely.", tl: "Pagkokonekta ng domain name sa mga container." },
                    available: false,
               },
          ]),
     },
     hosting: {
          icon: "🌐",
          color: "#4ade80",
          level: "intermediate",
          title: {
               en: "Managing & Hosting Services",
               tl: "Pamamahala at Pag-host ng Serbisyo",
          },
          levelLabel: { en: "Intermediate", tl: "Katamtaman" },
          desc: {
               en: "Keep NHS services online, monitored, backed up, and recoverable 24/7.",
               tl: "Panatilihing online, ligtas, at updated ang mga serbisyo ng NHS.",
          },
          analogy: {
               en: "Being the building engineer who monitors power, water, and alarms around the clock.",
               tl: "Pagiging building engineer na nagbabantay sa lahat ng sistema nang 24/7.",
          },
          lessons: buildLessonList("hosting", [
               {
                    title: { en: "Uptime Monitoring & Health Checks", tl: "Pagbabantay ng Uptime at Health Checks" },
                    desc: { en: "Setting up automated alerts before users notice an outage.", tl: "Pag-set up ng alerto bago pa mapansin ng user ang aberya." },
                    available: true,
                    cli: "curl -s http://localhost:4000/api/health | jq .",
               },
               {
                    title: { en: "The 3-2-1 Backup Rule in Practice", tl: "Ang 3-2-1 Backup Rule" },
                    desc: { en: "3 copies of data, 2 local media types, 1 offsite copy.", tl: "3 kopya ng datos, 2 uri ng storage, 1 offsite backup." },
                    available: true,
               },
          ]),
     },
     coding: {
          icon: "💻",
          color: "#fb923c",
          level: "beginner",
          title: { en: "Coding & Automation Scripting", tl: "Coding at Automation Scripting" },
          levelLabel: { en: "Beginner", tl: "Simula" },
          desc: {
               en: "Write Bash, Python, and JavaScript scripts that automate repetitive tasks.",
               tl: "Magsulat ng script na nag-a-automate ng araw-araw na gawain.",
          },
          analogy: {
               en: "Writing a recipe once that the computer follows accurately a thousand times.",
               tl: "Mga tagubilin na sinusunod ng computer nang eksakto sa bawat pagkakataon.",
          },
          lessons: buildLessonList("coding", [
               {
                    title: { en: "Bash Scripting for Server Automation", tl: "Bash Scripting para sa Server" },
                    desc: { en: "Variables, loops, exit codes, and cron jobs for scheduled tasks.", tl: "Variables, loops, at cron jobs para sa awtomatikong gawain." },
                    available: true,
                    cli: "#!/usr/bin/env bash\nset -euo pipefail\necho 'NHS Backup started at $(date -Iseconds)'",
               },
               {
                    title: { en: "Git Version Control for NHS Projects", tl: "Git Version Control para sa NHS" },
                    desc: { en: "Branching, clean commits, and collaborating without overwriting code.", tl: "Tamang paggamit ng git branch, commit, at pull request." },
                    available: true,
                    cli: "git status\ngit checkout -b feature/nhs-orientation-sql\ngit commit -m 'Add SQL schema and Admin console'",
               },
          ]),
     },
     network: {
          icon: "📡",
          color: "#67e8f9",
          level: "beginner",
          title: { en: "Networking for Infrastructure", tl: "Networking para sa Infrastructure" },
          levelLabel: { en: "Beginner", tl: "Simula" },
          desc: {
               en: "IP addressing, CIDR subnets, DNS, VLANs, and how servers communicate.",
               tl: "IP addressing, subnetting, DNS, at kung paano nag-uusap ang mga server.",
          },
          analogy: {
               en: "The postal system of data — every packet needs a street address (IP) and apartment number (Port).",
               tl: "Ang sistema ng koreo ng datos — bawat packet ay may IP address at Port.",
          },
          lessons: buildLessonList("network", [
               {
                    title: { en: "IPv4 Addresses, Subnets (/24) & Gateways", tl: "IPv4 Address, Subnet (/24) at Gateway" },
                    desc: { en: "Reading 192.168.10.0/24 and understanding private vs. public IP ranges.", tl: "Pag-unawa sa 192.168.10.0/24 at private IP addresses." },
                    available: true,
                    cli: "ip -br addr\nip route show\nping -c 4 1.1.1.1",
               },
               {
                    title: { en: "DNS Resolution & /etc/hosts", tl: "Paano Gumagana ang DNS" },
                    desc: { en: "Translating human-friendly names into IP addresses.", tl: "Pagpapalit ng domain name patungong IP address." },
                    available: true,
                    cli: "dig nhs.sfm.local +short\ncat /etc/resolv.conf",
               },
          ]),
     },
     database: {
          icon: "🗄️",
          color: "#c084fc",
          level: "intermediate",
          title: { en: "Database Management (SQL)", tl: "Pamamahala ng Database (SQL)" },
          levelLabel: { en: "Intermediate", tl: "Katamtaman" },
          desc: {
               en: "Design relational SQL tables, write queries, enforce foreign keys, and back up NHS databases.",
               tl: "Magdisenyo ng SQL tables, magsulat ng queries, at mag-backup ng database ng NHS.",
          },
          analogy: {
               en: "A structured ledger room that can cross-reference thousands of records in milliseconds.",
               tl: "Isang organisadong filing room na sumasagot sa loob lamang ng millisecond.",
          },
          lessons: buildLessonList("database", [
               {
                    title: { en: "01 · Relational Tables, Primary Keys & Foreign Keys", tl: "01 · Relational Tables, Primary Keys at Foreign Keys" },
                    desc: { en: "How NHS models users, 6 groups, tracks, and progress in database/schema.sql.", tl: "Paano naka-disenyo ang users, 6 groups, at lessons sa schema.sql." },
                    available: true,
                    minutes: 20,
                    body: {
                         en: "A relational database stores data in tables with strict column types and constraints. In the NHS Orientation Portal (`database/schema.sql`), `nhs_groups` stores our 6 groups (00–05), `tracks` references `nhs_groups(id)` via a Foreign Key, and `user_lesson_progress` links `users(id)` to `lessons(id)` so every completed lesson is permanently recorded.",
                         tl: "Ang relational SQL database ay nag-iimbak ng datos sa mga table na may malinaw na relasyon. Sa ating `database/schema.sql`, ang `nhs_groups` ay naglalaman ng 6 na pangkat (00–05), at ang `user_lesson_progress` ay nagtatala ng bawat araling natapos ng recruit o miyembro.",
                    },
                    cli: "SELECT g.group_code, g.title_en, COUNT(t.id) AS total_tracks\nFROM nhs_groups g\nLEFT JOIN tracks t ON t.group_id = g.id\nGROUP BY g.id\nORDER BY g.group_code;",
               },
               {
                    title: { en: "02 · CRUD Operations: SELECT, INSERT, UPDATE & DELETE", tl: "02 · CRUD Operations: SELECT, INSERT, UPDATE at DELETE" },
                    desc: { en: "Writing safe parameterized SQL queries for user registration and progress tracking.", tl: "Pagsulat ng ligtas na SQL queries para sa sistema ng NHS." },
                    available: true,
                    minutes: 20,
                    cli: "-- Promote a recruit to full NHS member in SQL\nUPDATE users\nSET role = 'member', primary_group_id = 6, last_active_at = CURRENT_TIMESTAMP\nWHERE sector_code = 'REC-2026-01';",
               },
               {
                    title: { en: "03 · SQL Backups, Dumps & Transactions", tl: "03 · SQL Backups, Dumps at Transactions" },
                    desc: { en: "Using transactions (BEGIN / COMMIT / ROLLBACK) and exporting .sql backups.", tl: "Paggamit ng transactions at pag-export ng .sql backup file." },
                    available: true,
                    minutes: 15,
                    cli: "# Export full SQLite database to a portable SQL file\nsqlite3 nhs_portal.db .dump > nhs_backup_$(date +%F).sql",
               },
          ]),
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
               en: "Harden servers, prevent SQL injection, manage firewalls, and protect congregation systems.",
               tl: "Protektahan ang mga server, database, at network laban sa mga umaatake.",
          },
          analogy: {
               en: "Locking the doors, verifying IDs at the gate, and keeping security logs.",
               tl: "Paglalagay ng matibay na kandado at pagsusuri ng bawat pumapasok sa sistema.",
          },
          lessons: buildLessonList("security", [
               {
                    title: { en: "Least Privilege, Firewalls (UFW) & SSH Hardening", tl: "Least Privilege, Firewall (UFW) at SSH Hardening" },
                    desc: { en: "Closing unused ports and restricting admin access.", tl: "Pagsasara ng hindi ginagamit na port sa server." },
                    available: true,
                    cli: "sudo ufw default deny incoming\nsudo ufw allow 22/tcp\nsudo ufw allow 8006/tcp\nsudo ufw enable",
               },
          ]),
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
               en: "Bridge your on-premise Proxmox and Linux skills to hybrid cloud and VPN mesh networks.",
               tl: "Iugnay ang iyong kasanayan sa Proxmox at Linux patungo sa hybrid cloud.",
          },
          analogy: {
               en: "You've built your own power plant with Proxmox; the cloud connects it to the regional grid.",
               tl: "Ang iyong lokal na Proxmox server na nakakonekta sa mas malawak na cloud network.",
          },
          lessons: buildLessonList("cloud", [
               {
                    title: { en: "Hybrid Lab: Connecting On-Prem Proxmox to Cloud via WireGuard", tl: "Hybrid Lab: Pagkonekta ng Proxmox sa Cloud Gamit ang WireGuard" },
                    desc: { en: "Encrypted site-to-site tunnels between local hardware and cloud VMs.", tl: "Ligtas na koneksyon sa pagitan ng lokal na server at cloud." },
                    available: true,
                    cli: "wg show",
               },
          ]),
     },
};

export const hwTrackData = [
     {
          id: "anatomy",
          icon: "🧠",
          color: "#4ade80",
          level: "beginner",
          title: {
               en: "Anatomy of a Computer",
               tl: "Anatomy ng Isang Computer",
          },
          levelLabel: { en: "Beginner · Track 01", tl: "Simula · Track 01" },
          desc: {
               en: "Every major component inside a computer explained with clear analogies and hands-on inspection.",
               tl: "Bawat pangunahing bahagi ng computer na ipinaliwanag gamit ang malinaw na halimbawa.",
          },
          analogy: {
               en: "A computer is like a human body — CPU is the brain, RAM is short-term workbench memory, SSD is long-term filing, and PSU is the heart.",
               tl: "Ang computer ay katulad ng katawang pantao — ang CPU ay utak, ang RAM ay mesa ng gawain, at ang PSU ay puso.",
          },
          lessons: buildLessonList("hw-anatomy", [
               {
                    title: { en: "01 · CPU, RAM & Storage (Brain, Workbench & Filing Cabinet)", tl: "01 · CPU, RAM at Storage (Utak, Mesa at Kabinet)" },
                    desc: { en: "Why adding RAM speeds up multitasking while SSDs speed up boot time.", tl: "Pagkakaiba ng trabaho ng CPU, RAM, at SSD/NVMe." },
                    available: true,
                    minutes: 15,
                    body: {
                         en: "Every computer relies on three core partners: (1) The CPU (Central Processing Unit) executes instructions billions of times per second. (2) RAM (Random Access Memory) holds the apps and files you are actively working on right now—it is super fast, but clears when power turns off. (3) Storage (NVMe SSD or SATA SSD) keeps the Operating System and files permanently even when unplugged.",
                         tl: "Ang bawat computer ay may tatlong pangunahing bahagi na laging nagtutulungan: (1) Ang CPU na nagpoproseso ng lahat ng utos, (2) Ang RAM na pansamantalang pinaglalagyan ng mga bukas na programa habang may kuryente, at (3) Ang SSD Storage kung saan nakatago nang permanente ang Windows/Linux at mga file.",
                    },
                    cli: "# Inspect CPU model, RAM DIMMs, and NVMe/SATA drives\nlscpu | grep 'Model name'\nfree -h\nlsblk -o NAME,SIZE,TYPE,MODEL",
               },
               {
                    title: { en: "02 · The Motherboard, Chipset & PCIe Lanes", tl: "02 · Ang Motherboard, Chipset at PCIe" },
                    desc: { en: "How the motherboard connects CPU sockets, DIMM slots, M.2 drives, and front-panel headers.", tl: "Paano pinagdurugtong ng motherboard ang lahat ng pyesa." },
                    available: true,
                    minutes: 15,
               },
               {
                    title: { en: "03 · Power Supply Unit (PSU), Wattage & Safety", tl: "03 · Power Supply Unit (PSU) at Kaligtasan" },
                    desc: { en: "80 Plus efficiency ratings, 24-pin ATX / 8-pin EPS connectors, and ESD protection.", tl: "Tamang pagpili at pagkabit ng kable ng Power Supply." },
                    available: true,
                    minutes: 15,
               },
               {
                    title: { en: "04 · Cooling Systems, Thermal Paste & Airflow", tl: "04 · Cooling Systems, Thermal Paste at Airflow" },
                    desc: { en: "Preventing thermal throttling with proper intake/exhaust fan orientation.", tl: "Tamang paglalagay ng thermal paste at direksyon ng fan." },
                    available: true,
                    minutes: 12,
               },
          ]),
     },
     {
          id: "howworks",
          icon: "⚙️",
          color: "#f0a500",
          level: "beginner",
          title: {
               en: "How Computers Work (Boot Sequence)",
               tl: "Paano Gumagana ang Computer",
          },
          levelLabel: { en: "Beginner · Track 02", tl: "Simula · Track 02" },
          desc: {
               en: "What happens millisecond by millisecond from pressing the power button to the desktop login screen.",
               tl: "Ano ang nangyayari mula sa pagpindot ng power button hanggang bumukas ang OS.",
          },
          analogy: {
               en: "Like a pilot running a pre-flight safety check (POST) before taking off into the operating system.",
               tl: "Katulad ng pre-flight check ng eroplano bago lumipad.",
          },
          lessons: buildLessonList("hw-howworks", [
               {
                    title: { en: "01 · Power Good Signal, POST & Beep Codes", tl: "01 · Power Good Signal, POST at Beep Codes" },
                    desc: { en: "How the motherboard checks CPU, RAM, and display before booting.", tl: "Paano sinusuri ng motherboard ang CPU at RAM sa unang bukas." },
                    available: true,
               },
               {
                    title: { en: "02 · UEFI vs. Legacy BIOS & Boot Order", tl: "02 · UEFI kumpara sa Legacy BIOS at Boot Order" },
                    desc: { en: "Entering BIOS setup (Del/F2), Secure Boot, and selecting a USB boot drive.", tl: "Pagpasok sa BIOS (Del/F2) at pagpili ng Boot Priority." },
                    available: true,
               },
          ]),
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
               en: "Step-by-step assembly sequence: bench testing, standoffs, cable management, and first POST.",
               tl: "Tamang pagkakasunud-sunod ng pagbuo ng computer nang ligtas.",
          },
          analogy: {
               en: "Like assembling precision furniture — installing the CPU and RAM outside the case first saves hours.",
               tl: "Pagbuo sa tamang pagkakasunud-sunod upang maiwasan ang pagkasira ng pyesa.",
          },
          lessons: buildLessonList("hw-build", [
               {
                    title: { en: "01 · Preparing the Motherboard: CPU, M.2 SSD & RAM", tl: "01 · Pagkakabit ng CPU, M.2 SSD at RAM sa Labas ng Case" },
                    desc: { en: "Aligning the golden triangle on the CPU socket and seating dual-channel RAM.", tl: "Tamang pagtapat ng CPU triangle at pag-click ng RAM." },
                    available: true,
               },
               {
                    title: { en: "02 · Case Standoffs, I/O Shield & Front Panel Pins", tl: "02 · Case Standoffs, I/O Shield at Front Panel Pins" },
                    desc: { en: "Avoiding motherboard shorts and wiring PWR_SW, RESET_SW, and LEDs.", tl: "Pag-iwas sa short circuit at tamang pagkabit ng Power Switch pins." },
                    available: true,
               },
          ]),
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
               en: "Windows, Linux, macOS, and Proxmox — when NHS deploys each operating system.",
               tl: "Windows, Linux, macOS, at Proxmox — kailan ginagamit ang bawat isa.",
          },
          analogy: {
               en: "An OS is the traffic coordinator between hardware components and user applications.",
               tl: "Ang OS ang tagapamahala sa pagitan ng hardware at ng mga programa.",
          },
          lessons: buildLessonList("hw-os", [
               {
                    title: { en: "01 · Desktop OS (Windows 11 / Ubuntu) vs. Server OS", tl: "01 · Desktop OS kumpara sa Server OS" },
                    desc: { en: "Matching the right OS to workstations, kiosks, and server nodes.", tl: "Pagpili ng tamang OS para sa workstation o server." },
                    available: true,
               },
          ]),
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
               en: "Create multi-ISO technician flash drives using Ventoy and GPT/UEFI installers with Rufus.",
               tl: "Paggawa ng multi-ISO bootable USB gamit ang Ventoy at Rufus.",
          },
          analogy: {
               en: "Ventoy turns one USB drive into a master keychain holding Windows, Ubuntu, Proxmox, and diagnostic ISOs.",
               tl: "Ginagawang master keychain ng Ventoy ang isang USB para sa maraming installer.",
          },
          lessons: buildLessonList("hw-bootable", [
               {
                    title: { en: "01 · Building a Multi-ISO Technician USB with Ventoy", tl: "01 · Paggawa ng Multi-ISO USB Gamit ang Ventoy" },
                    desc: { en: "Format once, drag-and-drop Windows, Ubuntu, Proxmox, and Memtest86 ISOs.", tl: "Mag-format nang isang beses at i-copy lang ang mga ISO file." },
                    available: true,
               },
          ]),
     },
     {
          id: "windows",
          icon: "🪟",
          color: "#38bdf8",
          level: "beginner",
          title: {
               en: "Installing Windows OS",
               tl: "Pag-install ng Windows OS",
          },
          levelLabel: { en: "Beginner · Track 06", tl: "Simula · Track 06" },
          desc: {
               en: "Clean GPT partitioning, driver installation, and NHS workstation post-install checklist.",
               tl: "Kumpletong pag-install ng Windows, drivers, at standard setup.",
          },
          analogy: {
               en: "Moving into a new building and setting up utilities, locks, and room labels.",
               tl: "Katulad ng paglipat sa bagong bahay at pag-aayos ng kuryente at gamit.",
          },
          lessons: buildLessonList("hw-windows", [
               {
                    title: { en: "01 · Clean Windows Install, Partitioning & Driver Pack", tl: "01 · Clean Windows Install at Pag-install ng Drivers" },
                    desc: { en: "Selecting the right NVMe partition and verifying Device Manager.", tl: "Pagpili ng tamang partition at pag-check sa Device Manager." },
                    available: true,
               },
          ]),
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
               en: "Clone and deploy golden OS images across 20+ lab workstations simultaneously with Clonezilla & PXE.",
               tl: "Mag-deploy ng Windows o Linux sa maraming computer nang sabay-sabay.",
          },
          analogy: {
               en: "Using a printing press instead of handwriting 50 copies one by one.",
               tl: "Paggamit ng printing press sa halip na mag-install nang paisa-isa.",
          },
          lessons: buildLessonList("hw-massimage", [
               {
                    title: { en: "01 · Capturing & Restoring Golden Images with Clonezilla", tl: "01 · Paggawa ng Golden Image Gamit ang Clonezilla" },
                    desc: { en: "Sysprep generalize, disk-to-image capture, and multicast PXE restore.", tl: "Paggamit ng Sysprep at Clonezilla para sa mabilisang deployment." },
                    available: true,
               },
          ]),
     },
     {
          id: "linux-install",
          icon: "🐧",
          color: "#4ade80",
          level: "beginner",
          title: { en: "Installing Linux (Ubuntu / Debian)", tl: "Pag-install ng Linux (Ubuntu / Debian)" },
          levelLabel: { en: "Beginner · Track 08", tl: "Simula · Track 08" },
          desc: {
               en: "Install Ubuntu Desktop and Debian Server from bootable USB to a production-ready system.",
               tl: "Pag-install ng Ubuntu at Debian mula sa bootable USB.",
          },
          analogy: {
               en: "A clean, fast workshop where you control every tool on the wall.",
               tl: "Isang mabilis at malinis na sistema na buo mong kontrolado.",
          },
          lessons: buildLessonList("hw-linux-install", [
               {
                    title: { en: "01 · Ubuntu LTS & Debian Server Installation Walkthrough", tl: "01 · Hakbang-hakbang na Pag-install ng Ubuntu LTS" },
                    desc: { en: "Swap, ext4/LVM partitioning, OpenSSH server toggle, and first boot.", tl: "Pag-partition ng drive at pag-enable ng OpenSSH Server." },
                    available: true,
               },
          ]),
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
               en: "Systematic isolation: No-Power, No-POST, BSOD, thermal shutdowns, and failing drives.",
               tl: "Ang diagnostic mindset para mabilis mahanap ang sira ng computer.",
          },
          analogy: {
               en: "Like a doctor checking vitals systematically instead of guessing.",
               tl: "Katulad ng doktor na sinusuri ang sintomas bago magbigay ng lunas.",
          },
          lessons: buildLessonList("hw-troubleshoot", [
               {
                    title: { en: "01 · The 5-Step Hardware Diagnostic Flow (No Power vs. No POST)", tl: "01 · Ang 5-Step Diagnostic Flow (No Power vs. No POST)" },
                    desc: { en: "Testing PSU, reseating RAM single-stick, clearing CMOS, and SMART health.", tl: "Pag-test ng PSU, pag-reseat ng RAM, at pag-reset ng CMOS." },
                    available: true,
               },
          ]),
     },
     {
          id: "maintenance",
          icon: "🛡️",
          color: "#94a3b8",
          level: "beginner",
          title: {
               en: "Maintenance & Care",
               tl: "Pagpapanatili at Pag-aalaga",
          },
          levelLabel: { en: "Beginner · Track 10", tl: "Simula · Track 10" },
          desc: {
               en: "Preventive dust cleaning, thermal paste replacement schedules, UPS battery checks, and asset logs.",
               tl: "Panatilihing tumatakbo nang maayos ang mga computer sa loob ng maraming taon.",
          },
          analogy: {
               en: "Regular oil changes and tire checks keep an engine running for a decade.",
               tl: "Ang regular na paglilinis ay nagpapahaba ng buhay ng computer.",
          },
          lessons: buildLessonList("hw-maintenance", [
               {
                    title: { en: "01 · Quarterly Preventive Maintenance & Thermal Repasting", tl: "01 · Regular na Paglilinis at Pagpapalit ng Thermal Paste" },
                    desc: { en: "Holding fan blades during compressed-air cleaning and logging temps.", tl: "Tamang paggamit ng blower at pag-log ng temperatura ng CPU." },
                    available: true,
               },
          ]),
     },
];
