import { Link } from "react-router-dom";
import { ArrowUpRight, MessageSquareText, Sparkles, LifeBuoy, Check, Calendar, Users, FileSpreadsheet, ShieldCheck, Zap } from "lucide-react";

const clients = ["Timing", "Adecco", "Stork", "Consolid", "YoungCapital"];

const pillars = [
  {
    Icon: MessageSquareText,
    title: "AI Briefing",
    desc: "Geef je restricties in gewone taal: 'Anna niet op vrijdag', 'Tom liever geen late dienst'. De solver vertaalt dat naar harde en zachte regels.",
  },
  {
    Icon: Sparkles,
    title: "Uitlegbare AI Solver",
    desc: "Genereert in seconden een rooster dat alle CAO-, contract- en wensregels respecteert — en legt elke keuze in begrijpelijke taal uit.",
  },
  {
    Icon: LifeBuoy,
    title: "AI Assistent",
    desc: "Bij ziekmeldingen of verstoringen doet de assistent meteen concrete voorstellen: swappen, invallers benaderen, of de impact tonen.",
  },
];

const features = [
  { Icon: Calendar, title: "Planning & Roosteren", desc: "Operationele planning als hart van de applicatie — overzicht, inzicht en grip op elke dienst." },
  { Icon: Users, title: "Human Resource Management", desc: "Beschikbaarheid, kwalificaties en contracten van medewerkers op één plek." },
  { Icon: FileSpreadsheet, title: "CAO & Verloning", desc: "Automatische berekeningen, exports naar verlonings- en facturatiesystemen." },
  { Icon: ShieldCheck, title: "Compliance", desc: "Werktijden, rusttijden en CAO-regels worden continu bewaakt." },
  { Icon: Zap, title: "Snel & Flexibel", desc: "Vrijwel elk planningsproces wordt ondersteund — van onboarding tot export." },
];

export default function SiteHome() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          src="/videos/login-bg.mp4"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at top left, hsl(28 90% 45% / 0.25) 0%, transparent 60%), radial-gradient(ellipse at bottom right, hsl(220 60% 55% / 0.25) 0%, transparent 60%), linear-gradient(180deg, hsl(220 30% 6% / 0.55) 0%, hsl(220 30% 6% / 0.85) 100%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-32 lg:pt-32 lg:pb-44">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--brand-accent))]" /> Planbition X — nu met AI
            </span>
            <h1 className="mt-8 font-display text-[clamp(3rem,9vw,7.5rem)] leading-[0.9] tracking-tight">
              De juiste mensen,<br />
              op het juiste moment, <em className="text-[hsl(var(--brand-accent))] not-italic font-display italic">in seconden</em>.
            </h1>
            <p className="mt-8 max-w-2xl text-lg lg:text-xl text-white/75 leading-relaxed">
              Planbition is dé online oplossing voor workforce management. Met uitlegbare AI maak je roosters die regels respecteren, mensen tevreden houden en in onder een minuut staan.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/site/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-accent))] px-7 py-3.5 text-sm font-semibold text-black shadow-[0_14px_40px_-10px_hsl(var(--brand-accent)/0.7)] hover:shadow-[0_18px_50px_-10px_hsl(var(--brand-accent)/0.9)] transition-all"
              >
                Plan een demo
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link to="/site/product" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors backdrop-blur">
                Ontdek het platform
              </Link>
            </div>
          </div>

          {/* Clients */}
          <div className="mt-24 lg:mt-32">
            <div className="text-xs uppercase tracking-[0.22em] text-white/40 mb-6">Vertrouwd door</div>
            <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
              {clients.map((c) => (
                <div key={c} className="font-display text-2xl text-white/50 hover:text-white/80 transition-colors">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI PILLARS */}
      <section className="relative border-t border-white/10 bg-[hsl(220_30%_5%)] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 mb-16">
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--brand-accent))] mb-4">De drie AI-pijlers</div>
              <h2 className="font-display text-5xl lg:text-6xl leading-[0.95] tracking-tight">
                AI die <em className="italic">begrijpt</em>,<br /> rekent en uitlegt.
              </h2>
            </div>
            <p className="text-lg text-white/70 leading-relaxed lg:pt-20 max-w-xl">
              Geen black-box optimalisatie. Onze AI luistert naar de planner, lost het puzzelwerk op binnen alle regels, en helpt elke dag bij dagelijkse verstoringen — met voorstellen die je kunt vertrouwen.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {pillars.map(({ Icon, title, desc }, i) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 transition-all hover:border-[hsl(var(--brand-accent))]/40 hover:from-white/[0.07]"
              >
                <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[hsl(var(--brand-accent))]/0 blur-3xl transition-all group-hover:bg-[hsl(var(--brand-accent))]/20" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(var(--brand-accent))]/15 text-[hsl(var(--brand-accent))] mb-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">0{i + 1}</div>
                  <h3 className="font-display text-3xl tracking-tight mb-3">{title}</h3>
                  <p className="text-white/70 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM */}
      <section className="relative border-t border-white/10 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl mb-16">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--brand-accent))] mb-4">Eén platform</div>
            <h2 className="font-display text-5xl lg:text-6xl leading-[0.95] tracking-tight">
              Van <em className="italic">onboarding</em> tot verloning.
            </h2>
            <p className="mt-6 text-lg text-white/70">
              Planbition is een uitermate flexibel systeem dat vrijwel elk planningsproces ondersteunt — van CAO-berekeningen tot exports naar je verlonings- en facturatiesysteem.
            </p>
          </div>

          <div className="grid gap-px bg-white/10 rounded-3xl overflow-hidden lg:grid-cols-3">
            {features.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-[hsl(220_30%_6%)] p-8 hover:bg-[hsl(220_30%_8%)] transition-colors">
                <Icon className="h-6 w-6 text-[hsl(var(--brand-accent))] mb-5" />
                <h3 className="font-display text-2xl tracking-tight mb-2">{title}</h3>
                <p className="text-sm text-white/65 leading-relaxed">{desc}</p>
              </div>
            ))}
            <div className="bg-gradient-to-br from-[hsl(var(--brand-accent))]/20 to-[hsl(220_30%_6%)] p-8 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-white/60 mb-2">En meer</div>
                <h3 className="font-display text-2xl tracking-tight">Een platform dat met je meegroeit.</h3>
              </div>
              <Link to="/site/product" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[hsl(var(--brand-accent))]">
                Bekijk alle functies <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE / SISTER */}
      <section className="relative border-t border-white/10 bg-[hsl(220_30%_5%)] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/40 mb-4">Onderdeel van zvoove</div>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight">
              Samen met <span className="text-[hsl(var(--brand-accent))]">RecruitNow</span> bouwen we de toekomst van werk.
            </h2>
            <p className="mt-6 text-white/70 text-lg leading-relaxed">
              Waar RecruitNow met Cockpit X recruitment transformeert, brengt Planbition X die zelfde AI-kracht naar de operationele planning. Eén ecosysteem, van vacature tot dienst.
            </p>
            <a
              href="https://www.recruitnow.nl"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[hsl(var(--brand-accent))]"
            >
              Bezoek RecruitNow <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[hsl(var(--brand-accent))]/15 via-white/[0.03] to-transparent p-10 lg:p-14">
            <div className="font-display text-3xl lg:text-4xl leading-tight text-white/90">
              "Het rooster dat we vroeger op vrijdagmiddag puzzelden, staat nu maandagochtend — en niemand klaagt."
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[hsl(var(--brand-accent))] text-black font-black flex items-center justify-center">M</div>
              <div>
                <div className="font-semibold">Marieke de Jong</div>
                <div className="text-sm text-white/50">Planningsmanager, een uitzendbureau</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/10 py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
          <h2 className="font-display text-5xl lg:text-7xl leading-[0.95] tracking-tight">
            Klaar om je <em className="italic text-[hsl(var(--brand-accent))]">vrijdagmiddag</em> terug te krijgen?
          </h2>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
            Plan een demo van 30 minuten. We laten je zien hoe Planbition X jouw planning eenvoudiger maakt.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/site/contact" className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-accent))] px-8 py-4 text-sm font-semibold text-black shadow-[0_14px_40px_-10px_hsl(var(--brand-accent)/0.8)]">
              Plan een demo <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link to="/site/product" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-sm font-semibold hover:bg-white/5">
              Bekijk product
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/60">
            {["Geen creditcard nodig", "Onboarding in dagen", "Vanaf 25 medewerkers"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[hsl(var(--brand-accent))]" /> {t}</span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}