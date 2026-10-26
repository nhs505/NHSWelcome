/**
 * Shared UI Primitives & Safe Highlight Helper (ui.jsx)
 */

export function BackBtn({ children, onClick }) {
     return (
          <button
               type="button"
               onClick={onClick}
               className="inline-flex items-center gap-1.5 bg-transparent border border-[#1c2530] text-[#64748b] font-mono text-[11.5px] px-3.5 py-1.5 rounded-md cursor-pointer mb-7 hover:text-slate-200 hover:border-[#64748b] transition-colors">
               {children}
          </button>
     );
}

export function ProceedBtn({ children, onClick, className = "" }) {
     return (
          <button
               type="button"
               onClick={onClick}
               className={`inline-flex items-center gap-2.5 bg-gradient-to-br from-[#f0a500] to-[#e09000] text-[#1a0e00] font-extrabold text-base border-none rounded-[11px] px-7 py-3.5 cursor-pointer shadow-[0_0_28px_rgba(240,165,0,0.3)] hover:-translate-y-0.5 hover:shadow-[0_0_42px_rgba(240,165,0,0.5)] transition-all ${className}`}>
               {children}
          </button>
     );
}

/**
 * Safely highlights a substring inside a translated string without breaking word order.
 * Fixes the original bug where "Who belongs in NHS?" became "Who  in NHS?belongs?".
 */
export function HighlightedText({ text = "", highlight = "", highlightClass = "text-green-400" }) {
     if (!highlight || !text.includes(highlight)) {
          return <>{text}</>;
     }
     const parts = text.split(highlight);
     return (
          <>
               {parts.map((part, i) => (
                    <span key={i}>
                         {part}
                         {i < parts.length - 1 && (
                              <span className={highlightClass}>{highlight}</span>
                         )}
                    </span>
               ))}
          </>
     );
}
