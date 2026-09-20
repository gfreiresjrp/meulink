import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { LogoWordmark, LogoSymbol } from "@/components/Logo";
import { SocialIcon } from "@/components/SocialIcons";
import { getClientPage } from "@/lib/queries";
import { SOCIAL_KEYS, SOCIAL_LABELS, parseSocials, socialHref } from "@/lib/socials";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const client = await db.query.clients.findFirst({ where: (c, { eq }) => eq(c.slug, slug) });
  if (!client) return {};
  return {
    title: `ALVEO + ${client.name}`,
    description: client.tagline ?? `Entregáveis ALVEO + ${client.name}`,
    openGraph: client.coverUrl ? { images: [client.coverUrl] } : undefined,
  };
}

export default async function ClientPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const data = await getClientPage(slug);
  if (!data || !data.client.published) notFound();
  const { client, groups } = data;
  const socials = parseSocials(client.socials);
  const socialEntries = SOCIAL_KEYS.filter((k) => socials[k]).map((k) => ({ key: k, href: socialHref(k, socials[k]!) }));

  return (
    <main className="flex flex-1 flex-col items-center px-4 pb-16 pt-5 sm:pt-8">
      <section className="w-full max-w-[680px]">
        {/* Capa */}
        <div className="relative">
          <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-navy-deep ring-1 ring-white/5">
            {client.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.coverUrl} alt="" className="size-full object-cover" />
            ) : (
              <div className="relative size-full overflow-hidden bg-[linear-gradient(120deg,#17325f_0%,#13294b_50%,#0c1f40_100%)]">
                {/* Marca d'água: símbolo gigante cortado à direita */}
                <LogoSymbol
                  aria-hidden
                  className="absolute -right-[4%] -top-[38%] h-[185%] w-auto text-white opacity-[0.07]"
                />
                <LogoSymbol
                  aria-hidden
                  className="absolute right-[22%] top-[28%] h-[120%] w-auto text-white opacity-[0.035]"
                />
                {/* Brilho lima no canto superior direito */}
                <div aria-hidden className="absolute -right-[8%] -top-[60%] aspect-square w-[42%] rounded-full bg-lime/20 blur-3xl" />
                {/* Linha diagonal lima, mesmo ângulo do chevron */}
                <div aria-hidden className="absolute -bottom-[10%] left-[58%] h-[130%] w-px origin-bottom rotate-[27deg] bg-gradient-to-t from-lime/60 via-lime/20 to-transparent" />

                {/* Bloco de marca alinhado à esquerda */}
                <div className="absolute left-[7%] top-1/2 flex -translate-y-[58%] flex-col gap-[10px] sm:gap-4">
                  <LogoWordmark className="w-[132px] text-white sm:w-[240px]" />
                  <span className="hidden text-[10px] font-medium uppercase tracking-[0.3em] text-cloud/70 sm:block">
                    Estratégia · Performance · Resultados
                  </span>
                </div>
              </div>
            )}
          </div>
          {/* Avatar */}
          <div className="absolute left-1/2 -bottom-10 grid size-20 -translate-x-1/2 place-items-center overflow-hidden rounded-full bg-white ring-4 ring-navy shadow-card">
            {client.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={client.logoUrl} alt={client.name} className="size-full object-cover" />
            ) : (
              <LogoSymbol className="h-9 w-auto text-navy" />
            )}
          </div>
        </div>

        {/* Título / subtítulo */}
        <header className="mt-14 flex flex-col items-center text-center">
          <h1 className="font-display text-[22px] font-semibold leading-tight text-white">{client.name}</h1>
          {client.tagline && <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-cloud/80">{client.tagline}</p>}

          {socialEntries.length > 0 && (
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {socialEntries.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[s.key]}
                    title={SOCIAL_LABELS[s.key]}
                    className="grid size-10 place-items-center rounded-full bg-white text-navy transition hover:bg-lime"
                  >
                    <SocialIcon name={s.key} className="size-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        {/* Links */}
        <div className="mt-10 flex flex-col gap-8">
          {groups.length === 0 && (
            <p className="rounded-2xl bg-navy-deep px-5 py-8 text-center text-sm text-muted ring-1 ring-white/5">
              Nenhum entregável publicado ainda.
            </p>
          )}
          {groups.map((g) => (
            <div key={g.id ?? "__none"} className="flex flex-col gap-2.5">
              <div className="mb-1 flex items-end justify-between border-b border-white/10 pb-2.5">
                <h2 className="relative font-display text-[17px] font-semibold tracking-tight text-white">
                  {g.title ?? "Links"}
                </h2>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted/70">
                  {g.links.length} {g.links.length === 1 ? "link" : "links"}
                </span>
              </div>
              {g.links.map((l) => (
                <a
                  key={l.id}
                  href={`/go/${l.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center rounded-xl bg-white px-5 py-[15px] text-navy ring-1 ring-black/5 transition hover:bg-lime active:scale-[0.99]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold">{l.title}</span>
                    {l.description && <span className="block truncate text-[12px] text-graphite/70">{l.description}</span>}
                  </span>
                </a>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
