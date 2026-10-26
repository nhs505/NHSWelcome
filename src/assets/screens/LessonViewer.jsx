/**
 * LessonViewer.jsx (s-lesson)
 * In-App Interactive Bilingual Lesson Viewer.
 * Replaces the missing proxmox-bootcamp.html external link.
 */

import { useState } from "react";
import { BackBtn, ProceedBtn } from "../components/ui.jsx";

export default function LessonViewer({
     t,
     lang,
     track,
     activeLessonIndex,
     setActiveLessonIndex,
     completedLessons,
     onToggleLessonComplete,
     onBackToTrack,
}) {
     const [selectedOption, setSelectedOption] = useState(null);
     const [quizSubmitted, setQuizSubmitted] = useState(false);
     const [copied, setCopied] = useState(false);

     if (!track || !track.lessons || track.lessons.length === 0) return null;

     const lesson = track.lessons[activeLessonIndex] || track.lessons[0];
     const isCompleted = completedLessons.includes(lesson.id);

     const handleCopyCli = () => {
          if (!lesson.cli) return;
          try {
               navigator.clipboard.writeText(lesson.cli);
               setCopied(true);
               setTimeout(() => setCopied(false), 2000);
          } catch {
               setCopied(true);
               setTimeout(() => setCopied(false), 2000);
          }
     };

     const switchLesson = (idx) => {
          setActiveLessonIndex(idx);
          setSelectedOption(null);
          setQuizSubmitted(false);
          window.scrollTo(0, 0);
     };

     return (
          <div className="max-w-5xl w-full mx-auto px-6 py-10 pb-20">
               <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <BackBtn onClick={onBackToTrack}>
                         ← {lang === "tl" ? "Bumalik sa Track:" : "Back to Track:"} {t(track.title)}
                    </BackBtn>
                    <span className="font-mono text-xs text-[#64748b]">
                         {lang === "tl" ? "Aralin" : "Lesson"}{" "}
                         {String(lesson.n).padStart(2, "0")} /{" "}
                         {String(track.lessons.length).padStart(2, "0")} · ⏱ {lesson.minutes || 15} min
                    </span>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Sidebar: Track Lesson List */}
                    <aside className="lg:col-span-4 bg-[#131920] border border-[#1c2530] rounded-2xl p-4 h-fit">
                         <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[#f0a500] mb-2">
                              {t(track.title)}
                         </div>
                         <div className="flex flex-col gap-1.5 max-h-[440px] overflow-y-auto pr-1">
                              {track.lessons.map((l, idx) => {
                                   const done = completedLessons.includes(l.id);
                                   const isCurrent = idx === activeLessonIndex;
                                   return (
                                        <button
                                             key={l.id}
                                             type="button"
                                             onClick={() => switchLesson(idx)}
                                             className={`w-full text-left p-2.5 rounded-xl border font-sans transition-colors cursor-pointer flex items-center gap-2.5 ${
                                                  isCurrent
                                                       ? "bg-[#181f28] border-[#f0a500]/50 text-slate-100"
                                                       : "bg-[#0d1218] border-[#1c2530] text-[#64748b] hover:text-slate-200"
                                             }`}>
                                             <span
                                                  className={`w-5 h-5 rounded-full font-mono text-[10px] flex items-center justify-center shrink-0 ${
                                                       done
                                                            ? "bg-green-400 text-[#08090c] font-bold"
                                                            : isCurrent
                                                            ? "bg-[#f0a500]/20 text-[#f0a500] border border-[#f0a500]/40"
                                                            : "bg-[#131920] text-[#64748b]"
                                                  }`}>
                                                  {done ? "✓" : String(l.n).padStart(2, "0")}
                                             </span>
                                             <span className="text-xs font-semibold line-clamp-1">
                                                  {t(l.title)}
                                             </span>
                                        </button>
                                   );
                              })}
                         </div>
                    </aside>

                    {/* Main Lesson Content Area */}
                    <div className="lg:col-span-8 flex flex-col gap-5">
                         <div className="bg-[#131920] border border-[#1c2530] rounded-2xl p-6 md:p-8">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                   <span className="font-mono text-[10.5px] tracking-widest uppercase text-[#f0a500]">
                                        NHS In-App Lesson Viewer · Module {String(lesson.n).padStart(2, "0")}
                                   </span>
                                   <button
                                        type="button"
                                        onClick={() => onToggleLessonComplete(lesson.id)}
                                        className={`font-mono text-xs px-3.5 py-1.5 rounded-full border cursor-pointer transition-colors ${
                                             isCompleted
                                                  ? "bg-green-400/15 border-green-400/40 text-green-400"
                                                  : "bg-[#181f28] border-[#2a3a4d] text-slate-300 hover:border-green-400/40"
                                        }`}>
                                        {isCompleted
                                             ? lang === "tl"
                                                  ? "✓ Tapos Na (Naka-save sa SQL)"
                                                  : "✓ Completed (Saved to SQL)"
                                             : lang === "tl"
                                             ? "Markahan Bilang Tapos"
                                             : "Mark Lesson Complete"}
                                   </button>
                              </div>

                              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 mb-2">
                                   {t(lesson.title)}
                              </h1>
                              <p className="text-sm text-[#64748b] mb-6">{t(lesson.desc)}</p>

                              {/* Plain-Language Analogy Banner */}
                              <div
                                   className="bg-[#0d1218] border border-[#1c2530] border-l-4 rounded-r-xl p-4 mb-6"
                                   style={{ borderLeftColor: track.color || "#f0a500" }}>
                                   <div className="font-mono text-[10px] tracking-widest uppercase text-[#f0a500] mb-1">
                                        {lang === "tl" ? "Analohiya sa Simpleng Wika" : "Plain-Language Analogy"}
                                   </div>
                                   <div className="text-sm text-slate-200 leading-relaxed">
                                        {t(track.analogy)}
                                   </div>
                              </div>

                              {/* Core Lesson Explanation */}
                              <div className="text-[15px] text-slate-200 leading-[1.8] mb-6 whitespace-pre-line">
                                   {t(lesson.body)}
                              </div>

                              {/* Terminal / CLI Command Snippet */}
                              {lesson.cli && (
                                   <div className="bg-[#070a0e] border border-[#1c2530] rounded-xl overflow-hidden mb-6">
                                        <div className="flex items-center justify-between px-4 py-2 bg-[#0f141c] border-b border-[#1c2530]">
                                             <span className="font-mono text-[10.5px] text-sky-400 uppercase tracking-wider">
                                                  💻 Terminal / SQL Reference
                                             </span>
                                             <button
                                                  type="button"
                                                  onClick={handleCopyCli}
                                                  className="font-mono text-[10.5px] px-2.5 py-1 rounded bg-[#181f28] border border-[#2a3a4d] text-slate-300 hover:text-[#f0a500] cursor-pointer">
                                                  {copied ? "✓ Copied" : "Copy Snippet"}
                                             </button>
                                        </div>
                                        <pre className="p-4 font-mono text-xs text-green-300 overflow-x-auto leading-relaxed">
                                             <code>{lesson.cli}</code>
                                        </pre>
                                   </div>
                              )}

                              {/* Key Takeaway */}
                              <div className="bg-[rgba(240,165,0,0.06)] border border-[rgba(240,165,0,0.2)] rounded-xl p-4 mb-6">
                                   <div className="font-mono text-[10px] uppercase tracking-widest text-[#f0a500] mb-1">
                                        ★ Key Field Takeaway
                                   </div>
                                   <div className="text-xs md:text-sm text-slate-200">
                                        {t(lesson.takeaway)}
                                   </div>
                              </div>

                              {/* Quick Knowledge Check Quiz */}
                              {lesson.quiz && (
                                   <div className="bg-[#0d1218] border border-[#1c2530] rounded-xl p-5">
                                        <div className="font-mono text-[10px] uppercase tracking-widest text-sky-400 mb-1.5">
                                             Quick Knowledge Check
                                        </div>
                                        <div className="text-sm font-bold text-slate-100 mb-3">
                                             {t(lesson.quiz.q)}
                                        </div>
                                        <div className="flex flex-col gap-2 mb-4">
                                             {lesson.quiz.options.map((opt, oIdx) => {
                                                  const isCorrect = oIdx === lesson.quiz.answer;
                                                  const isSelected = selectedOption === oIdx;
                                                  let cls =
                                                       "border-[#1c2530] bg-[#131920] text-slate-300 hover:border-[#2a3a4d]";
                                                  if (quizSubmitted) {
                                                       if (isCorrect)
                                                            cls =
                                                                 "border-green-400/60 bg-green-400/10 text-green-300";
                                                       else if (isSelected)
                                                            cls =
                                                                 "border-red-400/60 bg-red-400/10 text-red-300";
                                                  } else if (isSelected) {
                                                       cls =
                                                            "border-[#f0a500] bg-[#f0a500]/10 text-[#f0a500]";
                                                  }
                                                  return (
                                                       <button
                                                            key={oIdx}
                                                            type="button"
                                                            onClick={() => {
                                                                 setSelectedOption(oIdx);
                                                                 setQuizSubmitted(false);
                                                            }}
                                                            className={`text-left text-xs p-3 rounded-lg border cursor-pointer transition-colors ${cls}`}>
                                                            {t(opt)}
                                                       </button>
                                                  );
                                             })}
                                        </div>
                                        <div className="flex items-center justify-between">
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       if (selectedOption === null) return;
                                                       setQuizSubmitted(true);
                                                       if (
                                                            selectedOption === lesson.quiz.answer &&
                                                            !isCompleted
                                                       ) {
                                                            onToggleLessonComplete(lesson.id);
                                                       }
                                                  }}
                                                  className="font-mono text-xs font-semibold px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 cursor-pointer hover:bg-sky-500/30">
                                                  Check Answer
                                             </button>
                                             {quizSubmitted && (
                                                  <span
                                                       className={`font-mono text-xs ${
                                                            selectedOption === lesson.quiz.answer
                                                                 ? "text-green-400"
                                                                 : "text-amber-400"
                                                       }`}>
                                                       {selectedOption === lesson.quiz.answer
                                                            ? "✓ Correct! Lesson marked complete."
                                                            : "Try selecting the first option."}
                                                  </span>
                                             )}
                                        </div>
                                   </div>
                              )}
                         </div>

                         {/* Bottom Prev / Next Lesson Controls */}
                         <div className="flex items-center justify-between gap-4">
                              <button
                                   type="button"
                                   disabled={activeLessonIndex === 0}
                                   onClick={() => switchLesson(activeLessonIndex - 1)}
                                   className="font-mono text-xs px-4 py-2.5 rounded-xl bg-[#131920] border border-[#1c2530] text-slate-300 disabled:opacity-40 cursor-pointer">
                                   ← Previous Lesson
                              </button>

                              {activeLessonIndex < track.lessons.length - 1 ? (
                                   <ProceedBtn onClick={() => switchLesson(activeLessonIndex + 1)}>
                                        Next Lesson ({String(activeLessonIndex + 2).padStart(2, "0")}) →
                                   </ProceedBtn>
                              ) : (
                                   <ProceedBtn onClick={onBackToTrack}>
                                        Finish Track &amp; Return →
                                   </ProceedBtn>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}
