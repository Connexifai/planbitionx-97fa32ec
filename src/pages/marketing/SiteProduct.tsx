import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, Users, FileSpreadsheet, ShieldCheck, Zap, BarChart3, MessageSquareText, Sparkles, LifeBuoy, CheckCircle2 } from "lucide-react";

const modules = [
  { Icon: Calendar, title: "Planning & Roosteren", desc: "Het operationele hart. Sleep, plan, optimaliseer — met realtime inzicht in bezetting en gaps." },
  { Icon: Users, title: "HR Management", desc: "Medewerkers, contracten, kwalificaties en beschikbaarheid in één overzicht." },
  { Icon: FileSpreadsheet, title: "CAO & Tijd", desc: "Automatische CAO-berekeningen, urenregistratie en toeslagen — zonder spreadsheets." },
  { Icon: BarChart3, title: "Rapportage", desc: "Live dashboards over bezetting, kosten en fill rates. Export naar Excel of BI." },
  { Icon: ShieldCheck, title: "Compliance", desc: "Werk- en rusttijdenwet, maxima en minima — bewaakt zodra je plant." },
  { Icon: Zap, title: "Integraties", desc: "Export naar verlonings- en facturatiesystemen, koppelingen met je HR-stack." },
];

const ai = [
  { Icon: MessageSquareText, title: "AI Briefing", desc: "Spreek je restricties uit in mensentaal. De solver maakt onderscheid tussen harde regels (CAO, contract) en zachte voorkeuren (wensdagen)." },
  { Icon: Sparkles, title: "Uitlegbare Solver", desc: "Een planning binnen seconden — met natuurtaal uitleg waarom keuze X gemaakt is. Geen black box, wel snelheid." },
  { Icon: LifeBuoy, title: "Dagelijkse Assistent", desc: "Bij een ziekmelding stelt de assistent direct alternatieven voor: swap, oproepkracht, of impact-uitleg als er niets past." },
];

export default function SiteProduct() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-30">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover" src="/videos/login-bg.mp4" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_30%_6%)]/70 via-[hsl(220_30%_6%)]/90 to-[hsl(220_30%_6%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-24 lg:pt-28">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--brand-accent))] mb-4">Het platform</div>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-tight">
              Eén platform.<br />
              <em className="italic">Elk</em> planningsproces.
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-white/75 max-w-2xl leading-relaxed">
              Van CAO-berekening tot AI-gegenereerd rooster. Planbition X bundelt alles wat je nodig hebt om de juiste mensen op het juiste moment op de juiste plaats te krijgen.
            </p>
          </div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-xs uppercase tracking-[0.22em] text-white/40 mb-4">Modules</div>
          <h2 className="font-display text-4xl lg:text-5xl tracking-tight mb-12 max-w-2xl">Alles wat je nodig hebt, niets wat afleidt.</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {modules.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-7 hover:border-[hsl(var(--brand-accent))]/40 hover:bg-white/[0.04] transition-all">
                <Icon className="h-6 w-6 text-[hsl(var(--brand-accent))] mb-5" />
                <h3 className="font-display text-2xl mb-2 tracking-tight">{title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI deep dive */}
      <section id="ai" className="border-y border-white/10 bg-[hsl(220_30%_5%)] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl mb-16">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--brand-accent))] mb-4">AI in het hart</div>
            <h2 className="font-display text-5xl lg:text-6xl leading-[0.95] tracking-tight">
              Drie AI-onderdelen die <em className="italic">samen</em> werken.
            </h2>
          </div>

          <div className="space-y-6">
            {ai.map(({ Icon, title, desc }, i) => (
              <div key={title} className="grid lg:grid-cols-[auto_1fr_2fr] gap-6 lg:gap-12 items-start rounded-3xl border border-white/10 bg-white/[0.03] p-8 lg:p-12">
                <div className="font-display text-5xl lg:text-7xl text-[hsl(var(--brand-accent))]/40 leading-none">
                  0{i + 1}
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--brand-accent))]/15 text-[hsl(var(--brand-accent))]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-3xl lg:text-4xl tracking-tight">{title}</h3>
                </div>
                <p className="text-lg text-white/75 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promises */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/40 mb-4">Beloftes</div>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight tracking-tight">Gemaakt voor planners die <em className="italic">niet</em> houden van puzzelen.</h2>
          </div>
          <ul className="space-y-5">
            {[
              "Roosters in onder een minuut, ook bij honderden medewerkers",
              "Elke planning bevat uitleg in begrijpelijke taal",
              "Realtime alarm bij CAO- of contractovertredingen",
              "Voorstellen bij ziekmeldingen zonder zelf te bellen",
              "Naadloze export naar verloning en facturatie",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-lg">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-[hsl(var(--brand-accent))] mt-0.5" />
                <span className="text-white/85">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24 bg-[hsl(220_30%_5%)]">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
          <h2 className="font-display text-5xl lg:text-6xl tracking-tight">Zie het zelf, in 30 minuten.</h2>
          <Link to="/site/contact" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-accent))] px-8 py-4 text-sm font-semibold text-black shadow-[0_14px_40px_-10px_hsl(var(--brand-accent)/0.8)]">
            Plan een demo <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}