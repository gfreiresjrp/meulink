"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icons";
import { cn } from "@/lib/utils";

const FRAME_W = 375;
const FRAME_H = 812;
const SCALE = 280 / FRAME_W;

/** Preview ao vivo da página pública, num frame de celular. Recarrega quando `version` muda. */
export function PhonePreview({ slug, version, published }: { slug: string; version: number; published: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [spin, setSpin] = useState(false);
  const src = `/${slug}`;

  const reload = () => {
    setSpin(true);
    ref.current?.contentWindow?.location.reload();
    setTimeout(() => setSpin(false), 700);
  };

  useEffect(() => {
    if (ref.current) reload();
  }, [version]);

  return (
    <div className="sticky top-[88px] flex flex-col items-center gap-3">
      <div className="flex w-full items-center justify-between px-1">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
          <Icon.Phone className="size-3.5" /> Preview
        </span>
        <button type="button" onClick={reload} className="flex items-center gap-1.5 text-xs text-muted hover:text-white" title="Recarregar">
          <Icon.Refresh className={cn("size-3.5", spin && "animate-spin")} /> Atualizar
        </button>
      </div>
      <div className="relative overflow-hidden rounded-[38px] bg-black p-2.5 ring-1 ring-white/15 shadow-card" style={{ width: FRAME_W * SCALE + 20 }}>
        <div className="absolute left-1/2 top-2.5 z-10 h-5 w-24 -translate-x-1/2 rounded-b-2xl bg-black" />
        {/* Renderiza em 375×812 (iPhone) e reduz com escala, para o layout ser idêntico ao do celular */}
        <div className="relative overflow-hidden rounded-[30px] bg-navy" style={{ width: FRAME_W * SCALE, height: FRAME_H * SCALE }}>
          <iframe
            ref={ref}
            src={src}
            title="Preview da página"
            className="absolute left-0 top-0 origin-top-left border-0 bg-navy"
            style={{ width: FRAME_W, height: FRAME_H, transform: `scale(${SCALE})` }}
          />
        </div>
        {!published && (
          <div className="pointer-events-none absolute inset-2.5 flex items-end justify-center rounded-[30px] bg-gradient-to-t from-black/70 to-transparent pb-6">
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-navy">Rascunho: só você vê</span>
          </div>
        )}
      </div>
    </div>
  );
}
