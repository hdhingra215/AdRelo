"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface SoftSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  required?: boolean;
  placeholder?: string;
}

export function SoftSelect({
  label,
  value,
  onChange,
  options,
  required = false,
  placeholder = "Select...",
}: SoftSelectProps) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter options by search
  const filtered = search
    ? options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
        setHighlightIdx(-1);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightIdx(-1);
  }, [search]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll("[data-option]");
      items[highlightIdx]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightIdx]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightIdx((prev) =>
            prev < filtered.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightIdx((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightIdx >= 0 && highlightIdx < filtered.length) {
            onChange(filtered[highlightIdx]);
            setOpen(false);
            setSearch("");
            setHighlightIdx(-1);
          }
          break;
        case "Escape":
          setOpen(false);
          setSearch("");
          setHighlightIdx(-1);
          break;
      }
    },
    [open, filtered, highlightIdx, onChange]
  );

  if (custom) {
    return (
      <div>
        <label className="mb-1.5 block text-xs font-medium text-muted">
          {label}
          {required && <span className="text-foreground/30 ml-0.5">*</span>}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            placeholder="Enter custom value"
            className="w-full rounded-lg border border-black/[0.06] bg-white/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:bg-white focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => {
              setCustom(false);
              onChange("");
            }}
            className="shrink-0 rounded-lg border border-black/[0.06] bg-white/60 px-3 py-2.5 text-xs text-muted hover:bg-white transition-colors"
          >
            List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      <label className="mb-1.5 block text-xs font-medium text-muted">
        {label}
        {required && <span className="text-foreground/30 ml-0.5">*</span>}
      </label>
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setSearch("");
          setHighlightIdx(-1);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-black/[0.06] bg-white/60 px-3.5 py-2.5 text-sm text-left transition-all duration-200 hover:bg-white focus:bg-white focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
      >
        <span className={value ? "text-foreground" : "text-foreground/25"}>
          {value || placeholder}
        </span>
        <svg
          className="h-4 w-4 text-foreground/30"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {/* Hidden input for form validation */}
      {required && (
        <input
          type="text"
          value={value}
          required
          tabIndex={-1}
          className="sr-only"
          onChange={() => {}}
        />
      )}
      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-card-lg py-1.5 max-h-64 flex flex-col">
          {/* Search input */}
          <div className="px-2 pb-1.5">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type to search…"
              className="w-full rounded-lg border border-black/[0.06] bg-black/[0.02] px-3 py-1.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/15 transition-colors"
            />
          </div>
          {/* Options list */}
          <div ref={listRef} className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <div className="px-3.5 py-2 text-sm text-muted/60">
                No matches found
              </div>
            ) : (
              filtered.map((opt, idx) => (
                <button
                  key={opt}
                  type="button"
                  data-option
                  onClick={() => {
                    onChange(opt);
                    setOpen(false);
                    setSearch("");
                    setHighlightIdx(-1);
                  }}
                  className={`w-full px-3.5 py-2 text-sm text-left transition-colors ${
                    idx === highlightIdx
                      ? "bg-black/[0.05] text-foreground"
                      : value === opt
                        ? "font-medium text-foreground"
                        : "text-foreground/70 hover:bg-black/[0.03]"
                  }`}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
          {/* Add custom option */}
          <div className="border-t border-black/[0.04] mt-1 pt-1">
            <button
              type="button"
              onClick={() => {
                setCustom(true);
                onChange("");
                setOpen(false);
                setSearch("");
              }}
              className="w-full px-3.5 py-2 text-sm text-left text-muted hover:bg-black/[0.03] transition-colors"
            >
              + Add custom
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
