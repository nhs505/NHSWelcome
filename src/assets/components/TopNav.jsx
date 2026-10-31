/**
 * Public Recruit Splash TopNav
 * Note: "Recruit | Member | Admin" switcher has been removed per requirements!
 * Recruits have a dedicated Splash/Orientation view with "I want to be a trainee"
 * and "Sign In" buttons.
 */

import React from "react";
import { Layout, Button, Radio } from "antd";

const { Header, Content, Footer } = Layout;
const items = Array.from({ length: 5 }).map((_, index) => ({
     key: index + 1,
     label: `nav ${index + 1}`,
}));

const TopNav = ({
     lang,
     setLang,
     currentScreen,
     onNavigate,
     onOpenTraineeRegister,
     onOpenLogin,
}) => {
     if (currentScreen === "s-boot") return null;

     return (
          <Layout>
               <Header
                    style={{
                         display: "flex",
                         justifyContent: "center",
                         alignItems: "center",
                         // backgroundColor: "#0f131a",
                         padding: "0.5rem 2rem",
                    }}>
                    {/* Brand Logo */}
                    <div className="flex items-center gap-3">
                         <Button
                              variant="text"
                              color="primary"
                              type="link"
                              style={{
                                   border: "none",
                                   backgroundColor: "transparent",
                                   display: "flex",
                                   gap: "0.5rem",
                              }}
                              onClick={() => onNavigate("s-welcome")}
                              // className=" text-left   border-none text-slate-200  transition-colors"
                         >
                              <span className="w-2.5 h-2.5 rounded-full bg-[#f0a500] shadow-[0_0_8px_#f0a500]" />
                              <span className="font-mono text-xs font-bold tracking-wider uppercase">
                                   STF-NHS · Recruit Orientation
                              </span>
                         </Button>
                         <span className="text-[#2d3a47] font-mono text-xs hidden sm:inline">
                              |
                         </span>
                         <nav className="hidden sm:flex items-center gap-1.5 font-mono ">
                              <Button
                                   variant="text"
                                   color="primary"
                                   size="small"
                                   style={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                   }}
                                   onClick={() => onNavigate("s-groups")}
                                   className={`px-2.5 py-1 rounded cursor-pointer border-none transition-colors ${
                                        (
                                             [
                                                  "s-groups",
                                                  "s-hardware",
                                                  "s-itinfra",
                                                  "s-track",
                                                  "s-soon",
                                                  "s-lesson",
                                             ].includes(currentScreen)
                                        ) ?
                                             "bg-[#181f28] text-green-400"
                                        :    "bg-transparent text-[#64748b] hover:text-slate-200"
                                   }`}>
                                   {lang === "tl" ? "Grupo" : "Groups"}
                              </Button>
                              <span className="text-[#2d3a47] font-mono text-xs hidden sm:inline">
                                   |
                              </span>
                              <Button
                                   variant="text"
                                   color="primary"
                                   size="small"
                                   style={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                   }}
                                   onClick={() => onNavigate("s-nhs")}>
                                   {lang === "tl" ?
                                        "Tungkol sa NHS"
                                   :    "About NHS"}
                              </Button>
                              <span className="text-[#2d3a47] font-mono text-xs hidden sm:inline">
                                   |
                              </span>
                         </nav>
                    </div>

                    {/* Right Actions: "I want to be a trainee", "Sign In", and Language Toggle */}
                    <div className="flex items-center gap-2.5">
                         <Button
                              type="link"
                              variant="text"
                              color="primary"
                              size="small"
                              onClick={onOpenLogin}
                              style={{
                                   border: "none",
                                   backgroundColor: "transparent",
                              }}>
                              🔐 {lang === "tl" ? "Sign In" : "Sign In"}
                         </Button>

                         <div className="absolute right-10 rounded-full overflow-hidden bg-transparent">
                              <Radio.Group
                                   value={lang}
                                   color="primary"
                                   size="small"
                                   style={{
                                        display: "flex",
                                        border: "none",
                                        backgroundColor: "transparent",
                                        contentFontSize: "0.75rem",
                                   }}>
                                   {["en", "tl"].map((l) => (
                                        <Radio.Button
                                             // color="transparent"
                                             value={l}
                                             size="small"
                                             onClick={() => setLang(l)}
                                             style={{
                                                  border: "none",
                                                  backgroundColor:
                                                       "transparent",
                                             }}>
                                             {l.toUpperCase()}
                                        </Radio.Button>
                                   ))}
                              </Radio.Group>
                         </div>
                    </div>
               </Header>
          </Layout>
     );
};
export default TopNav;
