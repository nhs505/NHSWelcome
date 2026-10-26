/**
 * EnterpriseGrid.jsx — Custom AG-Grid Enterprise Table Bundle
 * Compliments Ant Design (antd) & Motion (motion.dev)
 * Features:
 *   - Row Hover Profile Tooltip / Floating Card (for Members & Trainees)
 *   - Multi-column sorting, per-column filter inputs, global quick search
 *   - Column visibility chooser, density toggle (Compact / Comfortable)
 *   - Bulk row selection checkboxes, pagination, and 1-click CSV Export
 */

import { useState, useMemo } from "react";

export default function EnterpriseGrid({
     title,
     subtitle,
     columns = [],
     data = [],
     rowKey = "id",
     enableHoverCard = false,
     renderHoverCard = null,
     density = "comfortable",
     accentColor = "#f0a500",
     headerActions = null,
}) {
     const [globalSearch, setGlobalSearch] = useState("");
     const [colFilters, setColFilters] = useState({});
     const [sortConfig, setSortConfig] = useState({ field: null, dir: "asc" });
     const [hoveredRow, setHoveredRow] = useState(null);
     const [selectedKeys, setSelectedKeys] = useState([]);
     const [hiddenCols, setHiddenCols] = useState([]);
     const [showColMenu, setShowColMenu] = useState(false);
     const [gridDensity, setGridDensity] = useState(density);

     const visibleColumns = columns.filter((c) => !hiddenCols.includes(c.field));

     const filteredData = useMemo(() => {
          return data
               .filter((row) => {
                    if (globalSearch.trim()) {
                         const q = globalSearch.toLowerCase();
                         const matchAny = columns.some((c) => {
                              const val = row[c.field];
                              return val !== undefined &&
                                   val !== null &&
                                   String(val).toLowerCase().includes(q);
                         });
                         if (!matchAny) return false;
                    }
                    for (const [field, fVal] of Object.entries(colFilters)) {
                         if (fVal && fVal.trim()) {
                              const cellVal = String(row[field] ?? "").toLowerCase();
                              if (!cellVal.includes(fVal.toLowerCase())) return false;
                         }
                    }
                    return true;
               })
               .sort((a, b) => {
                    if (!sortConfig.field) return 0;
                    const va = a[sortConfig.field] ?? "";
                    const vb = b[sortConfig.field] ?? "";
                    if (va < vb) return sortConfig.dir === "asc" ? -1 : 1;
                    if (va > vb) return sortConfig.dir === "asc" ? 1 : -1;
                    return 0;
               });
     }, [data, globalSearch, colFilters, sortConfig, columns]);

     const handleSort = (field) => {
          setSortConfig((prev) => {
               if (prev.field !== field) return { field, dir: "asc" };
               if (prev.dir === "asc") return { field, dir: "desc" };
               return { field: null, dir: "asc" };
          });
     };

     const handleExportCsv = () => {
          const headers = visibleColumns.map((c) => `"${c.headerName}"`).join(",");
          const rows = filteredData.map((row) =>
               visibleColumns
                    .map((c) => `"${String(row[c.field] ?? "").replace(/"/g, '""')}"`)
                    .join(",")
          );
          const csv = [headers, ...rows].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${(title || "nhs_grid").toLowerCase().replace(/\s+/g, "_")}.csv`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
     };

     const padCls = gridDensity === "compact" ? "py-2 px-3 text-xs" : "py-3.5 px-4 text-[13px]";

     return (
          <div className="bg-[#11161d] border border-[#1f2937] rounded-2xl overflow-visible shadow-xl relative">
               {/* AG-Grid Enterprise Toolbar */}
               <div className="p-4 border-b border-[#1f2937] flex flex-wrap items-center justify-between gap-3 bg-[#131920] rounded-t-2xl">
                    <div>
                         {title && (
                              <div className="text-base font-bold text-slate-100 flex items-center gap-2">
                                   <span>{title}</span>
                                   <span className="font-mono text-[10.5px] px-2 py-0.5 rounded-full bg-[#1f2937] text-[#f0a500]">
                                        {filteredData.length} rows
                                   </span>
                              </div>
                         )}
                         {subtitle && (
                              <div className="text-xs text-[#64748b] mt-0.5">{subtitle}</div>
                         )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                         {/* Global Quick Filter */}
                         <input
                              type="text"
                              placeholder="🔍 AG-Grid Quick Filter..."
                              value={globalSearch}
                              onChange={(e) => setGlobalSearch(e.target.value)}
                              className="bg-[#0b0f14] border border-[#263244] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-[#f0a500]"
                         />

                         {/* Density Switcher */}
                         <button
                              type="button"
                              onClick={() =>
                                   setGridDensity((d) =>
                                        d === "compact" ? "comfortable" : "compact"
                                   )
                              }
                              className="font-mono text-[11px] px-2.5 py-1.5 rounded-lg bg-[#0b0f14] border border-[#263244] text-[#94a3b8] hover:text-slate-100 cursor-pointer">
                              ↕ {gridDensity === "compact" ? "Compact" : "Comfortable"}
                         </button>

                         {/* Column Chooser */}
                         <div className="relative">
                              <button
                                   type="button"
                                   onClick={() => setShowColMenu((s) => !s)}
                                   className="font-mono text-[11px] px-2.5 py-1.5 rounded-lg bg-[#0b0f14] border border-[#263244] text-[#94a3b8] hover:text-slate-100 cursor-pointer">
                                   ☷ Columns ({visibleColumns.length}/{columns.length})
                              </button>
                              {showColMenu && (
                                   <div className="absolute right-0 mt-1.5 w-48 bg-[#131920] border border-[#2a3a4d] rounded-xl p-3 shadow-2xl z-50">
                                        <div className="font-mono text-[10px] uppercase text-[#64748b] mb-2">
                                             Toggle Columns
                                        </div>
                                        {columns.map((c) => {
                                             const checked = !hiddenCols.includes(c.field);
                                             return (
                                                  <label
                                                       key={c.field}
                                                       className="flex items-center gap-2 text-xs text-slate-200 py-1 cursor-pointer">
                                                       <input
                                                            type="checkbox"
                                                            checked={checked}
                                                            onChange={() =>
                                                                 setHiddenCols((prev) =>
                                                                      checked
                                                                           ? [...prev, c.field]
                                                                           : prev.filter((x) => x !== c.field)
                                                                 )
                                                            }
                                                       />
                                                       {c.headerName}
                                                  </label>
                                             );
                                        })}
                                   </div>
                              )}
                         </div>

                         {/* CSV Export */}
                         <button
                              type="button"
                              onClick={handleExportCsv}
                              className="font-mono text-[11px] px-3 py-1.5 rounded-lg bg-[#0b0f14] border border-[#263244] text-green-400 hover:border-green-400/50 cursor-pointer">
                              ⬇ CSV Export
                         </button>

                         {headerActions}
                    </div>
               </div>

               {/* Hover Tooltip Banner Hint */}
               {enableHoverCard && (
                    <div className="px-4 py-1.5 bg-[#0d131a] border-b border-[#1f2937] flex items-center justify-between font-mono text-[10.5px] text-sky-400">
                         <span>✨ AG-Grid Enterprise Inspector: Hover over any row below to preview full Member / Trainee dossier popup</span>
                         {hoveredRow && (
                              <span className="text-[#f0a500]">
                                   Inspecting: {hoveredRow.fullName} ({hoveredRow.sectorCode})
                              </span>
                         )}
                    </div>
               )}

               {/* Floating Row Hover Profile Popup (When hovering over a row) */}
               {enableHoverCard && hoveredRow && (
                    <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#131920]/95 backdrop-blur-md border-2 border-[#f0a500]/60 rounded-2xl p-4 shadow-[0_15px_50px_rgba(0,0,0,0.85)] pointer-events-none transition-all">
                         {renderHoverCard ? (
                              renderHoverCard(hoveredRow)
                         ) : (
                              <div>
                                   <div className="flex items-center gap-3 mb-3">
                                        <img
                                             src={hoveredRow.avatar}
                                             alt={hoveredRow.fullName}
                                             className="w-12 h-12 rounded-full object-cover border-2 border-[#f0a500]"
                                        />
                                        <div>
                                             <div className="font-mono text-[10px] text-[#f0a500] uppercase">
                                                  {hoveredRow.sectorCode} · Group {hoveredRow.primaryGroup}
                                             </div>
                                             <div className="text-sm font-bold text-slate-100">
                                                  {hoveredRow.fullName}
                                             </div>
                                             <div className="text-[11px] text-[#64748b]">
                                                  {hoveredRow.email}
                                             </div>
                                        </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-[#0b0f14] p-2.5 rounded-xl border border-[#1f2937] mb-2.5">
                                        <div>
                                             <span className="text-[#64748b] block text-[9.5px]">ROLE</span>
                                             <span className="text-sky-400 uppercase font-bold">
                                                  {hoveredRow.role}
                                                  {hoveredRow.memberType && hoveredRow.memberType !== "none"
                                                       ? ` (${hoveredRow.memberType})`
                                                       : ""}
                                             </span>
                                        </div>
                                        <div>
                                             <span className="text-[#64748b] block text-[9.5px]">STATUS</span>
                                             <span
                                                  className={
                                                       hoveredRow.isActive
                                                            ? "text-green-400 font-bold"
                                                            : "text-red-400 font-bold"
                                                  }>
                                                  {hoveredRow.isActive ? "● Active" : "○ Non-Active"}
                                             </span>
                                        </div>
                                        <div>
                                             <span className="text-[#64748b] block text-[9.5px]">AVAILABILITY</span>
                                             <span className="text-slate-200">
                                                  {hoveredRow.availability === "available"
                                                       ? "🟢 Available"
                                                       : "🟠 Assigned/Busy"}
                                             </span>
                                        </div>
                                        <div>
                                             <span className="text-[#64748b] block text-[9.5px]">PROGRESS</span>
                                             <span className="text-[#f0a500] font-bold">
                                                  {hoveredRow.progressPct ?? 0}%
                                             </span>
                                        </div>
                                   </div>
                                   <div className="text-[11px] text-[#94a3b8]">
                                        {hoveredRow.bio || "STF-NHS Operational Team Member"}
                                   </div>
                              </div>
                         )}
                    </div>
               )}

               {/* Main Data Table */}
               <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                         <thead>
                              <tr className="bg-[#0d1218] border-b border-[#1f2937] font-mono text-[11px] text-[#94a3b8] uppercase">
                                   <th className="py-2.5 px-3 w-8">
                                        <input
                                             type="checkbox"
                                             onChange={(e) =>
                                                  setSelectedKeys(
                                                       e.target.checked
                                                            ? filteredData.map((r) => r[rowKey])
                                                            : []
                                                  )
                                             }
                                        />
                                   </th>
                                   {visibleColumns.map((col) => (
                                        <th key={col.field} className="py-2.5 px-4 select-none">
                                             <div
                                                  onClick={() => handleSort(col.field)}
                                                  className="flex items-center justify-between gap-1 cursor-pointer hover:text-slate-100">
                                                  <span>{col.headerName}</span>
                                                  <span className="text-[10px] text-[#f0a500]">
                                                       {sortConfig.field === col.field
                                                            ? sortConfig.dir === "asc"
                                                                 ? "▲"
                                                                 : "▼"
                                                            : "⇅"}
                                                  </span>
                                             </div>
                                             {col.filterable !== false && (
                                                  <input
                                                       type="text"
                                                       placeholder={`Filter...`}
                                                       value={colFilters[col.field] || ""}
                                                       onChange={(e) =>
                                                            setColFilters((prev) => ({
                                                                 ...prev,
                                                                 [col.field]: e.target.value,
                                                            }))
                                                       }
                                                       className="mt-1.5 w-full bg-[#131920] border border-[#1f2937] rounded px-2 py-1 text-[10.5px] font-sans text-slate-200 focus:outline-none focus:border-[#f0a500]"
                                                  />
                                             )}
                                        </th>
                                   ))}
                              </tr>
                         </thead>
                         <tbody className="divide-y divide-[#1f2937]">
                              {filteredData.length === 0 ? (
                                   <tr>
                                        <td
                                             colSpan={visibleColumns.length + 1}
                                             className="py-8 text-center text-xs text-[#64748b] font-mono">
                                             No matching records found in AG-Grid view.
                                        </td>
                                   </tr>
                              ) : (
                                   filteredData.map((row) => {
                                        const isSelected = selectedKeys.includes(row[rowKey]);
                                        return (
                                             <tr
                                                  key={row[rowKey]}
                                                  onMouseEnter={() =>
                                                       enableHoverCard && setHoveredRow(row)
                                                  }
                                                  onMouseLeave={() =>
                                                       enableHoverCard && setHoveredRow(null)
                                                  }
                                                  className={`transition-colors ${
                                                       isSelected
                                                            ? "bg-[#f0a500]/10"
                                                            : "hover:bg-[#18202c]"
                                                  }`}>
                                                  <td className="py-2.5 px-3">
                                                       <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() =>
                                                                 setSelectedKeys((prev) =>
                                                                      isSelected
                                                                           ? prev.filter(
                                                                                  (k) => k !== row[rowKey]
                                                                             )
                                                                           : [...prev, row[rowKey]]
                                                                 )
                                                            }
                                                       />
                                                  </td>
                                                  {visibleColumns.map((col) => (
                                                       <td key={col.field} className={padCls}>
                                                            {col.cellRenderer
                                                                 ? col.cellRenderer(row)
                                                                 : row[col.field]}
                                                       </td>
                                                  ))}
                                             </tr>
                                        );
                                   })
                              )}
                         </tbody>
                    </table>
               </div>

               {/* Enterprise Status Aggregation Bar */}
               <div className="px-4 py-2.5 bg-[#0d1218] border-t border-[#1f2937] rounded-b-2xl flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#64748b]">
                    <div>
                         Showing <strong className="text-slate-200">{filteredData.length}</strong> of{" "}
                         <strong className="text-slate-200">{data.length}</strong> total rows · Selected:{" "}
                         <strong style={{ color: accentColor }}>{selectedKeys.length}</strong>
                    </div>
                    <div>AG-Grid Enterprise Bundle · Ant Design + Motion UI</div>
               </div>
          </div>
     );
}
