import { useEffect, useRef, useState } from "react";

const LINES = [
    { text: "> initializing session...", delay: 40 },
    { text: "> loading STF registry...", delay: 35 },
    { text: "> NHS portal: ONLINE", delay: 45 },
    { text: "", delay: 20 },
    { text: "Welcome to NHS", delay: 55, big: true },
    { text: "(Network and Hardware Support Team)", delay: 40, accent: true },
    { text: "", delay: 20 },
    { text: "> status: READY", delay: 35 },
    { text: "> press any key or click to continue_", delay: 30, dim: true },
];

function IdleConsole({ idleMs = 10000, enabled = true }) {
    const [visible, setVisible] = useState(false);
    const [typed, setTyped] = useState([]); // strings already typed
    const [lineIndex, setLineIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const timerRef = useRef(null);
    const typingRef = useRef(null);

    const resetIdle = () => {
        if (!enabled) return;
        if (timerRef.current) clearTimeout(timerRef.current);
        if (visible) return; // while overlay is open, don't restart until dismissed
        timerRef.current = setTimeout(() => {
            setVisible(true);
            setTyped([]);
            setLineIndex(0);
            setCharIndex(0);
        }, idleMs);
    };

    const dismiss = () => {
        setVisible(false);
        setTyped([]);
        setLineIndex(0);
        setCharIndex(0);
        if (typingRef.current) clearTimeout(typingRef.current);
        // restart idle countdown after dismiss
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setVisible(true);
            setTyped([]);
            setLineIndex(0);
            setCharIndex(0);
        }, idleMs);
    };

    // track activity
    useEffect(() => {
        if (!enabled) return;
        const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
        const onActivity = () => {
            if (visible) dismiss();
            else resetIdle();
        };
        events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
        resetIdle();
        return () => {
            events.forEach((e) => window.removeEventListener(e, onActivity));
            if (timerRef.current) clearTimeout(timerRef.current);
            if (typingRef.current) clearTimeout(typingRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, visible, idleMs]);

    // typewriter
    useEffect(() => {
        if (!visible) return;
        if (lineIndex >= LINES.length) return;

        const current = LINES[lineIndex];
        const full = current.text;

        if (charIndex <= full.length) {
            typingRef.current = setTimeout(() => {
                setTyped((prev) => {
                    const next = [...prev];
                    next[lineIndex] = full.slice(0, charIndex);
                    return next;
                });
                setCharIndex((c) => c + 1);
            }, current.delay ?? 40);
        } else {
            typingRef.current = setTimeout(() => {
                setLineIndex((i) => i + 1);
                setCharIndex(0);
            }, 280);
        }

        return () => {
            if (typingRef.current) clearTimeout(typingRef.current);
        };
    }, [visible, lineIndex, charIndex]);

    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[500] flex items-center justify-center bg-[#05070a]/95 backdrop-blur-[2px] cursor-pointer"
            onClick={dismiss}
            role="dialog"
            aria-label="Idle welcome console"
        >
            {/* scanlines */}
            <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                    background:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
                }}
            />

            <div className="relative w-full max-w-[720px] px-6 font-mono">
                <div className="mb-4 text-[11px] tracking-[0.2em] text-[#2d4050] uppercase">
                    NHS · Secure Terminal · Idle Session
                </div>

                <div className="rounded-xl border border-[#1c2530] bg-[#0a0e14]/90 p-6 shadow-[0_0_40px_rgba(240,165,0,0.08)]">
                    {LINES.map((line, i) => {
                        if (i > lineIndex) return null;
                        const content = typed[i] ?? "";
                        const isActive = i === lineIndex;

                        return (
                            <div
                                key={i}
                                className={`min-h-[1.4em] leading-relaxed ${line.big
                                        ? "mt-3 text-[clamp(22px,4vw,36px)] font-bold text-[#f0a500]"
                                        : line.accent
                                            ? "text-[clamp(13px,2vw,16px)] text-sky-400"
                                            : line.dim
                                                ? "mt-4 text-[12px] text-[#4a6070]"
                                                : "text-[13px] text-[#8aa0b4]"
                                    }`}
                            >
                                {content}
                                {isActive && (
                                    <span className="ml-0.5 inline-block h-[1em] w-[8px] translate-y-[2px] bg-sky-400 align-middle animate-pulse" />
                                )}
                            </div>
                        );
                    })}
                </div>

                <p className="mt-5 text-center font-mono text-[11px] text-[#2d3a47]">
                    Click anywhere or press a key to return
                </p>
            </div>
        </div>
    )
}

export default IdleConsole