"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface ClientSearchProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function ClientSearch({ value, onChange, required = false }: ClientSearchProps) {
  const [open, setOpen] = useState(false);
  const [clients, setClients] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchClients = useCallback(async (query: string) => {
    if (query.length < 1) {
      setClients([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("clients")
      .select("name")
      .ilike("name", `%${query}%`)
      .order("name")
      .limit(8);

    const names = data?.map((c) => c.name) ?? [];
    setClients(names);
    setOpen(names.length > 0);
    setLoading(false);
  }, []);

  function handleChange(v: string) {
    onChange(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchClients(v), 200);
  }

  function handleSelect(name: string) {
    onChange(name);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <label className="mb-1.5 block text-xs font-medium text-muted">
        Client Name
        {required && <span className="text-foreground/30 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => { if (value.length >= 1) searchClients(value); }}
        required={required}
        placeholder="Search or type new client name"
        autoComplete="off"
        className="w-full rounded-lg border border-black/[0.06] bg-white/60 px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:bg-white focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10 transition-all duration-200"
      />
      {loading && (
        <div className="absolute right-3 top-[2.1rem]">
          <svg className="h-4 w-4 animate-spin text-foreground/20" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}
      {open && clients.length > 0 && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-card-lg py-1.5 max-h-48 overflow-y-auto">
          {clients.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => handleSelect(name)}
              className={`w-full px-3.5 py-2 text-sm text-left transition-colors hover:bg-black/[0.03] ${
                value === name ? "font-medium text-foreground" : "text-foreground/70"
              }`}
            >
              {name}
            </button>
          ))}
          {!clients.some((n) => n.toLowerCase() === value.toLowerCase()) && value.trim() && (
            <div className="border-t border-black/[0.04] mt-1 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full px-3.5 py-2 text-sm text-left text-muted hover:bg-black/[0.03] transition-colors"
              >
                + Create &quot;{value.trim()}&quot;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
