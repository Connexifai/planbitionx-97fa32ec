import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const values = [
  { title: "Mensen eerst", desc: "Een rooster is geen spreadsheet. Het zijn vrije weekenden, ophalen van de kinderen, en uitkijken naar je dienst." },
  { title: "AI met uitleg", desc: "Wij geloven niet in black-box optimalisatie. Elke keuze van onze solver is uit te leggen aan een mens." },
  { title: "Snelheid is een feature", desc: "Een planning maken hoort niet je vrijdagmiddag te kosten. Onder een minuut, of we hebben werk te doen." },
];

export default function SiteAbout() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-25">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover" src="/videos/login-bg.mp4" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_30%_6%)]/80 via-[hsl(220_30%_6%)]/95 to-[hsl(220_30%_6%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-20 pb-24 lg:pt-28">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--brand-accent))] mb-4">Over Planbition</div>
            <h1 className="font-display text-[clamp(3rem,8vw,6rem)] leading-[0.95] tracking-tight">
              Slim plannen voor <em className="italic">slimme</em> mensen.
            </h1>
            <p className="mt-6 text-lg lg:text-xl text-white/75 max-w-2xl leading-relaxed">
              Wij geloven dat technologie planners moet ondersteunen, niet vervangen. Daarom bouwen we Planbition X — een platform waar AI en mens samen tot een beter rooster komen.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="text-xs uppercase tracking-[0.22em] text-white/40">Ons verhaal</div>
          <div className="space-y-6 text-lg text-white/80 leading-relaxed font-display [&>p]:font-sans [&>p]:text-base lg:[&>p]:text-lg">
            <p>
              Planbition is ontstaan vanuit de overtuiging dat workforce management beter kan. Slimmer. Menselijker. We werken voor uitzendbureaus, technische dienstverleners en organisaties waar de juiste mensen op het juiste moment op de juiste plek essentieel zijn.
            </p>
            <p>
              Vandaag is Planbition onderdeel van de zvoove-groep, samen met zusterbedrijf RecruitNow. Waar RecruitNow met Cockpit X de recruitmentkant van flexbureaus automatiseert, brengt Planbition X dezelfde AI-kracht naar de operationele planning.
            </p>
            <p>
              Eén ecosysteem, van vacature tot dienst — gebouwd door teams die geloven dat goede software stil zou moeten zijn en alleen mag opvallen door wat het mogelijk maakt.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-white/10 bg-[hsl(220_30%_5%)] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="font-display text-4xl lg:text-5xl tracking-tight mb-12 max-w-2xl">Waar we voor staan.</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {values.map((v, i) => (
              <div key={v.title} className="rounded-3xl border border-white/10 bg-white/[0.03] p-8">
                <div className="font-display text-5xl text-[hsl(var(--brand-accent))]/40 mb-6">0{i + 1}</div>
                <h3 className="font-display text-2xl tracking-tight mb-3">{v.title}</h3>
                <p className="text-white/70 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sister */}
      <section className="py-24 lg:py-32 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/40 mb-4">Familie</div>
            <h2 className="font-display text-4xl lg:text-5xl leading-tight tracking-tight">
              Onderdeel van <span className="text-[hsl(var(--brand-accent))]">zvoove</span>. Zusje van <em className="italic">RecruitNow</em>.
            </h2>
            <p className="mt-6 text-white/70 text-lg leading-relaxed">
              Met meer dan 450 flexbureaus die op het zvoove-ecosysteem vertrouwen, bouwen we samen aan de toekomst van werk — van eerste sollicitatie tot laatste dienst.
            </p>
            <a href="https://www.recruitnow.nl" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[hsl(var(--brand-accent))]">
              Bezoek RecruitNow.nl <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[hsl(var(--brand-accent))]/15 to-transparent p-10 lg:p-14">
            <div className="grid grid-cols-2 gap-8">
              {[
                { k: "450+", v: "flexbureaus in zvoove-ecosysteem" },
                { k: "<60s", v: "voor een complete planning" },
                { k: "100%", v: "uitlegbare AI-keuzes" },
                { k: "24/7", v: "AI-assistent voor verstoringen" },
              ].map((s) => (
                <div key={s.k}>
                  <div className="font-display text-5xl text-white">{s.k}</div>
                  <div className="mt-2 text-sm text-white/60">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 py-24 bg-[hsl(220_30%_5%)] text-center">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <h2 className="font-display text-5xl lg:text-6xl tracking-tight">Werk je mee?</h2>
          <p className="mt-6 text-white/70">We zijn altijd op zoek naar mensen die geloven dat planning beter kan.</p>
          <Link to="/site/contact" className="mt-10 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--brand-accent))] px-8 py-4 text-sm font-semibold text-black">
            Neem contact op <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}