"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Tab = { id: string; label: string; badge?: number; content: ReactNode };

export function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const select = (id: string) => setActive(id);

  return (
    <div className="flex flex-col gap-5">
      <div role="tablist" className="flex gap-1 rounded-xl bg-navy-deep p-1 ring-1 ring-white/5">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active === t.id}
            onClick={() => select(t.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-display text-sm font-semibold transition",
              active === t.id ? "bg-white text-navy shadow" : "text-muted hover:text-white",
            )}
          >
            {t.label}
            {typeof t.badge === "number" && (
              <span className={cn("rounded-full px-1.5 text-[10px]", active === t.id ? "bg-navy/10 text-navy" : "bg-white/10 text-muted")}>
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" hidden={active !== t.id}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
