import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-display font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3 text-xs" : "h-10 px-4 text-sm",
        variant === "primary" && "bg-lime text-navy hover:brightness-105 active:brightness-95",
        variant === "outline" && "ring-1 ring-white/15 text-white hover:bg-white/5",
        variant === "ghost" && "text-muted hover:bg-white/5 hover:text-white",
        variant === "danger" && "text-red-300 hover:bg-red-500/10",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl bg-navy px-3 text-sm text-white ring-1 ring-white/10 placeholder:text-muted/60 outline-none transition focus:ring-2 focus:ring-lime/70",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-xl bg-navy px-3 text-sm text-white ring-1 ring-white/10 outline-none transition focus:ring-2 focus:ring-lime/70",
        className,
      )}
      {...props}
    />
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted/80">{hint}</span>}
    </label>
  );
}

export function Card({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl bg-navy-deep p-5 ring-1 ring-white/5 shadow-card", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title && (
            <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">{title}</h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Notice({ kind, children }: { kind: "error" | "ok"; children: ReactNode }) {
  return (
    <p
      className={cn(
        "rounded-xl px-3 py-2 text-sm",
        kind === "error" ? "bg-red-500/10 text-red-200 ring-1 ring-red-500/20" : "bg-lime/10 text-lime ring-1 ring-lime/20",
      )}
    >
      {children}
    </p>
  );
}

export function Toggle({ name, defaultChecked, label }: { name: string; defaultChecked?: boolean; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-sm text-white">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-white/10 ring-1 ring-white/10 transition peer-checked:bg-lime after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5 peer-checked:after:bg-navy" />
      {label}
    </label>
  );
}
