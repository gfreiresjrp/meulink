import type { SVGProps } from "react";

const base = (props: SVGProps<SVGSVGElement>) => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const Icon = {
  Up: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="m18 15-6-6-6 6" /></svg>,
  Down: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="m6 9 6 6 6-6" /></svg>,
  Eye: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>,
  EyeOff: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a17.6 17.6 0 0 1-3.2 4.2M6.2 6.2A17.9 17.9 0 0 0 2 12s3.5 7 10 7c1.5 0 2.9-.4 4.1-1" /></svg>,
  Trash: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6" /></svg>,
  Edit: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>,
  Plus: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M12 5v14M5 12h14" /></svg>,
  External: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>,
  Copy: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></svg>,
  Check: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="m5 12 5 5L20 7" /></svg>,
  Close: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M18 6 6 18M6 6l12 12" /></svg>,
  Refresh: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M21 12a9 9 0 1 1-2.6-6.4M21 3v6h-6" /></svg>,
  Search: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>,
  Link: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>,
  Users: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>,
  Click: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M9 9l10 4-4 1.5L13.5 19 9 9Z" /><path d="M4 4l1.5 1.5M9 2v2M2 9h2M5.5 12.5 4 14" /></svg>,
  Phone: (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="6" y="2" width="12" height="20" rx="2.5" /><path d="M11 18h2" /></svg>,
};
