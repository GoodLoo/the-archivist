"use client";

import { useState, useRef, useEffect } from "react";

interface SortBarProps {
  priceSort: "default" | "asc" | "desc";
  nameSort: "default" | "asc" | "desc";
  sizeSort: "default" | "asc" | "desc";
  onPriceSort: (v: "default" | "asc" | "desc") => void;
  onNameSort: (v: "default" | "asc" | "desc") => void;
  onSizeSort: (v: "default" | "asc" | "desc") => void;
  scaleFilter: string;
  onScaleChange: (scale: string) => void;
  availableScales: string[];
  showInStock: boolean;
  onStockToggle: () => void;
  totalFiltered: number;
  totalRaw: number;
}

function Dropdown({
  label,
  open,
  onToggle,
  onClose,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 border border-dark-border dark:border-dark-border border-light-border px-2.5 py-1.5 text-xs font-medium text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:border-crimson hover:text-crimson transition-colors"
      >
        {label}
        <svg className={`h-2.5 w-2.5 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-30 mt-1 min-w-[110px] border border-dark-border dark:border-dark-border border-light-border bg-dark-bg dark:bg-dark-bg bg-white shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

function Option({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-1.5 text-xs transition-colors hover:bg-dark-border/20 dark:hover:bg-dark-border/20 hover:bg-gray-100 ${active ? "text-crimson font-bold" : "text-dark-text-secondary dark:text-dark-text-secondary text-gray-600"}`}
    >
      {children}
    </button>
  );
}

export default function SortBar({
  priceSort,
  nameSort,
  sizeSort,
  onPriceSort,
  onNameSort,
  onSizeSort,
  scaleFilter,
  onScaleChange,
  availableScales,
  showInStock,
  onStockToggle,
  totalFiltered,
  totalRaw,
}: SortBarProps) {
  const [priceOpen, setPriceOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [scaleOpen, setScaleOpen] = useState(false);

  const priceLabel = priceSort === "default" ? "Price" : priceSort === "asc" ? "Price ↑" : "Price ↓";
  const nameLabel = nameSort === "default" ? "Name" : nameSort === "asc" ? "Name A–Z" : "Name Z–A";
  const sizeLabel = sizeSort === "default" ? "Size" : sizeSort === "asc" ? "Size ↑" : "Size ↓";
  const scaleLabel = scaleFilter === "all" ? "Scale" : scaleFilter;

  const hasFilters = priceSort !== "default" || nameSort !== "default" || sizeSort !== "default" || scaleFilter !== "all" || showInStock;

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <Dropdown label={priceLabel} open={priceOpen} onToggle={() => setPriceOpen(!priceOpen)} onClose={() => setPriceOpen(false)}>
        <Option active={priceSort === "default"} onClick={() => { onPriceSort("default"); setPriceOpen(false); }}>Default</Option>
        <Option active={priceSort === "asc"} onClick={() => { onPriceSort("asc"); setPriceOpen(false); }}>Low → High</Option>
        <Option active={priceSort === "desc"} onClick={() => { onPriceSort("desc"); setPriceOpen(false); }}>High → Low</Option>
      </Dropdown>

      <Dropdown label={nameLabel} open={nameOpen} onToggle={() => setNameOpen(!nameOpen)} onClose={() => setNameOpen(false)}>
        <Option active={nameSort === "default"} onClick={() => { onNameSort("default"); setNameOpen(false); }}>Default</Option>
        <Option active={nameSort === "asc"} onClick={() => { onNameSort("asc"); setNameOpen(false); }}>A → Z</Option>
        <Option active={nameSort === "desc"} onClick={() => { onNameSort("desc"); setNameOpen(false); }}>Z → A</Option>
      </Dropdown>

      <Dropdown label={sizeLabel} open={sizeOpen} onToggle={() => setSizeOpen(!sizeOpen)} onClose={() => setSizeOpen(false)}>
        <Option active={sizeSort === "default"} onClick={() => { onSizeSort("default"); setSizeOpen(false); }}>Default</Option>
        <Option active={sizeSort === "asc"} onClick={() => { onSizeSort("asc"); setSizeOpen(false); }}>Small → Large</Option>
        <Option active={sizeSort === "desc"} onClick={() => { onSizeSort("desc"); setSizeOpen(false); }}>Large → Small</Option>
      </Dropdown>

      <Dropdown label={scaleLabel} open={scaleOpen} onToggle={() => setScaleOpen(!scaleOpen)} onClose={() => setScaleOpen(false)}>
        <Option active={scaleFilter === "all"} onClick={() => { onScaleChange("all"); setScaleOpen(false); }}>All</Option>
        {availableScales.map((s) => (
          <Option key={s} active={scaleFilter === s} onClick={() => { onScaleChange(s); setScaleOpen(false); }}>{s}</Option>
        ))}
      </Dropdown>

      <button
        onClick={onStockToggle}
        className={`border px-2.5 py-1.5 text-xs font-medium transition-colors ${showInStock ? "border-crimson bg-crimson text-white" : "border-dark-border dark:border-dark-border border-light-border text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:border-crimson hover:text-crimson"}`}
      >
        {showInStock ? "In Stock" : "All"}
      </button>

      {hasFilters && (
        <button
          onClick={() => { onPriceSort("default"); onNameSort("default"); onSizeSort("default"); onScaleChange("all"); if (showInStock) onStockToggle(); }}
          className="text-[10px] uppercase tracking-wider text-dark-text-secondary dark:text-dark-text-secondary text-light-text-secondary hover:text-crimson transition-colors"
        >
          Clear
        </button>
      )}

      <span className="ml-auto text-[10px] text-dark-text-secondary dark:text-dark-text-secondary text-gray-500">
        {totalFiltered}/{totalRaw}
      </span>
    </div>
  );
}
