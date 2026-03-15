import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Users,
  Handshake,
  UserCheck,
  Building2,
  BarChart3,
  Clock,
  Plug,
  CheckCircle2,
  ArrowRight,
  Play,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import robotImg from "@/assets/robot-assistant.png";

const clients = [
  { name: "Timing", src: "/images/clients/timing.png" },
  { name: "Adecco", src: "/images/clients/adecco.png" },
  { name: "Stork", src: "/images/clients/stork.png" },
  { name: "Consolid", src: "/images/clients/consolid.png" },
  { name: "YoungCapital", src: "/images/clients/yc.png" },
];

const features = [
  {
    icon: Calendar,
    title: "Planning & Roosteren",
    desc: "De operationele planningsmodule vormt het hart van de applicatie. Overzicht en inzicht voor een efficiënte planning.",
  },
  {
    icon: Users,
    title: "Human Resource Management",
    desc: "Altijd actueel inzicht in uw personeelsportfolio — contracten, kwalificaties en dossiers overal toegankelijk.",
  },
  {
    icon: Handshake,
    title: "Customer Relations Management",
    desc: "Beheer al uw klanten centraal met SLA's en KPI's per klant voor gedetailleerd management overzicht.",
  },
  {
    icon: UserCheck,
    title: "Werknemer Zelf Service",
    desc: "Werknemers beheren zelf roosters, beschikbaarheid, verlofaanvragen en kunnen zich inplannen op open diensten.",
  },
  {
    icon: Building2,
    title: "Master / Vendor",
    desc: "Verdeel de vraag over meerdere leveranciers met centraal overzicht van de volledige planning en KPI's.",
  },
  {
    icon: BarChart3,
    title: "Rapportage & BI",
    desc: "Complete rapportage-engine met lijsten, draaitabellen en Power BI integratie voor analyse op elk niveau.",
  },
  {
    icon: Clock,
    title: "Tijdregistratie",
    desc: "Hardware terminals, geofencing of handmatige invoer — registreer tijd op basis van de planning met automatische afrondingsregels.",
  },
  {
    icon: Plug,
    title: "Interfacing",
    desc: "Open software met 18 standaard API's voor import en export. Aangepaste interfaces zijn ook mogelijk.",
  },
];

const benefits = [
  "100% web gebaseerd, bruikbaar op elk apparaat",
  "Meerdere instellingen binnen één installatie",
  "Pay as you use — alle modules inbegrepen",
  "Bespaar tot 85% van uw planningstijd",
  "Communicatietijd met 70% verminderen",
  "Audit trail en KPI's altijd bij de hand",
];

export default function PlanbitionHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <img
              src="/images/planbition-logo.png"
              alt="Planbition"
              className="h-8 object-contain"
            />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Functionaliteit</a>
            <a href="#benefits" className="hover:text-foreground transition-colors">Voordelen</a>
            <a href="#planbition-x" className="hover:text-foreground transition-colors font-semibold text-primary">
              Planbition X
            </a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[hsl(210,100%,50%)] via-[hsl(210,90%,40%)] to-[hsl(220,80%,30%)]" />
        {/* Subtle orange glow from logo accent */}
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] z-0 bg-brand-accent/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              De online oplossing voor uw{" "}
              <span className="text-blue-200">workforce management</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-xl mb-8 leading-relaxed">
              Planbition is een uitermate flexibel systeem dat vrijwel elk planningsproces kan
              ondersteunen. Van onboarding tot tijdregistratie — de juiste mensen op het juiste
              moment op de juiste plaats.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base px-8 h-12 bg-white text-blue-700 hover:bg-blue-50"
                onClick={() => navigate("/login")}
              >
                Start nu <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                asChild
              >
                <a href="#features">
                  <Play className="mr-2 w-4 h-4" /> Ontdek meer
                </a>
              </Button>
            </div>
          </div>

          {/* Dashboard mockup image area */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl">
                <div className="rounded-lg bg-background/90 p-4 space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <span className="text-xs text-muted-foreground ml-2">Dashboard</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Medewerkers", val: "619", change: "+36%" },
                      { label: "Uitstroom", val: "89", change: "-12%" },
                      { label: "Vervulling", val: "94%", change: "+8%" },
                    ].map((kpi) => (
                      <div key={kpi.label} className="rounded-md bg-muted/50 p-3">
                        <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
                        <div className="text-lg font-bold text-foreground">{kpi.val}</div>
                        <div className="text-[10px] text-primary font-medium">{kpi.change}</div>
                      </div>
                    ))}
                  </div>
                  <div className="h-20 rounded-md bg-muted/30 flex items-end px-2 pb-2 gap-1">
                    {[40, 55, 35, 70, 60, 80, 75, 90, 65, 85, 78, 92].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-primary/60"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client logos */}
      <section className="border-y border-border bg-card/50 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground mb-6 font-medium">
            Onze klanten:
          </p>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {clients.map((c) => (
              <img
                key={c.name}
                src={c.src}
                alt={c.name}
                className="h-8 md:h-10 object-contain"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ✨ Planbition X CTA */}
      <section id="planbition-x" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                NIEUW — AI-gestuurd roosteren
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                Planbition{" "}
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  X
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg">
                De volgende generatie roosterplanning. Met AI-optimalisatie genereert Planbition X
                ATW-conforme roosters in minder dan een minuut — inclusief automatische
                verstoringenafhandeling, shift swaps en slimme alternatieven.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "AI-optimizer lost roosters op in seconden",
                  "100% ATW-compliance ingebouwd",
                  "Verstoringen afhandelen met concrete alternatieven",
                  "Beschikbaar in 8 talen",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                size="lg"
                className="text-base px-8 h-12"
                onClick={() => navigate("/landing")}
              >
                Ontdek Planbition X <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl blur-2xl" />
                <Card className="relative p-8 bg-card border-primary/20 shadow-2xl max-w-sm">
                  <img
                    src={robotImg}
                    alt="Planbition X AI"
                    className="w-32 h-32 mx-auto object-contain mb-6 drop-shadow-xl"
                    style={{ animation: "orbit 3s ease-in-out infinite" }}
                  />
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">
                      Planbition <span className="text-primary">X</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI-driven roster planning — de toekomst van personeelsplanning
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    {[
                      { val: "<1min", label: "Oplostijd" },
                      { val: "100%", label: "ATW-conform" },
                      { val: "73%", label: "Minder moeite" },
                      { val: "€5k+", label: "Besparing/jaar" },
                    ].map((s) => (
                      <div key={s.label} className="text-center p-2 rounded-lg bg-muted/50">
                        <div className="text-lg font-bold text-primary">{s.val}</div>
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Functionaliteit
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Planbition is een uitermate flexibel systeem dat vrijwel elk planningsproces kan
              ondersteunen — van onboarding tot tijdregistratie.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <Card
                key={f.title}
                className="p-6 bg-card border-border hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Voordelen
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg">
              Beschikbaar op alle apparaten met onbeperkt aantal gratis gebruikers. Planbition is
              uiterst configureerbaar zonder dure aanpassingen.
            </p>
            <ul className="space-y-4">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-64 h-[500px]">
              {/* Phone mockup */}
              <div className="absolute inset-0 rounded-[2.5rem] border-[6px] border-foreground/20 bg-background shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/20 rounded-b-2xl" />
                <div className="pt-10 px-4 space-y-3">
                  <div className="text-center">
                    <img src="/images/planbition-logo.png" alt="Planbition" className="h-6 mx-auto mb-3 opacity-80" />
                    <div className="text-xs text-muted-foreground">Mijn Rooster</div>
                  </div>
                  {["Ma", "Di", "Wo", "Do", "Vr"].map((day, i) => (
                    <div key={day} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <div className="w-8 text-xs font-medium text-muted-foreground">{day}</div>
                      <div
                        className={`flex-1 h-6 rounded ${
                          i % 3 === 0
                            ? "bg-primary/30"
                            : i % 3 === 1
                            ? "bg-orange-400/30"
                            : "bg-green-400/30"
                        }`}
                      />
                      <div className="text-[10px] text-muted-foreground">
                        {i % 3 === 0 ? "Vroeg" : i % 3 === 1 ? "Dag" : "Laat"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 md:py-32 px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Contact</h2>
          <p className="text-muted-foreground mb-12">
            Heeft u vragen over ons product of onze diensten? Neem contact met ons op.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-border text-center">
              <Phone className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="text-sm font-medium">+31-(0)24-3529629</div>
            </Card>
            <Card className="p-6 bg-card border-border text-center">
              <Mail className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="text-sm font-medium">info@planbition.com</div>
            </Card>
            <Card className="p-6 bg-card border-border text-center">
              <MapPin className="w-6 h-6 text-primary mx-auto mb-3" />
              <div className="text-sm font-medium">Helmond, NL</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/planbition-logo.png" alt="Planbition" className="h-6 object-contain" />
          </div>
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Planbition. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
