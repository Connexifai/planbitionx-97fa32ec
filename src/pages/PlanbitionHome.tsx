import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
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
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import robotImg from "@/assets/robot-assistant.png";
import SolverShowcase from "@/components/home/SolverShowcase";


const featureIcons = [Calendar, Users, Handshake, UserCheck, Building2, BarChart3, Clock, Plug];

const benefitKeys = [
  "benefitWeb",
  "benefitMultiSite",
  "benefitPayAsYouUse",
  "benefitSaveTime",
  "benefitComm",
  "benefitAudit",
];

/* ── Scroll-reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

export default function PlanbitionHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "#features", label: t("home.navFeatures") },
    { href: "#benefits", label: t("home.navBenefits") },
    { href: "#planbition-x", label: t("home.navX"), highlight: true },
    { href: "#contact", label: t("home.navContact") },
  ];

  const features = Array.from({ length: 8 }, (_, i) => ({
    icon: featureIcons[i],
    title: t(`home.feat${i + 1}Title`),
    desc: t(`home.feat${i + 1}Desc`),
  }));

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <img src="/images/planbition-logo.png" alt="Planbition" className="h-8 object-contain" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`hover:text-foreground transition-colors ${l.highlight ? "font-semibold text-primary" : ""}`}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl px-6 py-4 space-y-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm ${l.highlight ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"} transition-colors`}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-primary/80 to-primary/60 dark:from-primary/90 dark:via-primary/60 dark:to-primary/40" />
        <div className="absolute bottom-0 right-0 w-[40%] h-[40%] z-0 bg-brand-accent/15 blur-[120px] rounded-full" />
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-primary-foreground/5 blur-2xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-primary-foreground">
            <Section>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                {t("home.heroTitle")}{" "}
                <span className="text-brand-accent">{t("home.heroTitleAccent")}</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl mb-8 leading-relaxed">
                {t("home.heroDesc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="text-base px-8 h-12 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  onClick={() => navigate("/login")}
                >
                  {t("home.heroCta")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12 border-primary-foreground/60 text-primary-foreground bg-primary-foreground/15 hover:bg-primary-foreground/25 backdrop-blur-sm font-semibold"
                  asChild
                >
                  <a href="#features">
                    <Play className="mr-2 w-4 h-4" /> {t("home.heroSecondary")}
                  </a>
                </Button>
              </div>
            </Section>
          </div>

          {/* Solver Showcase Animation */}
          <Section className="flex-1 max-w-md">
            <SolverShowcase />
          </Section>
        </div>
      </section>

      {/* ── Client logos ── */}
      <section className="border-y border-border bg-card/50 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground mb-6 font-medium">
            {t("home.clients")}
          </p>
          <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {clients.map((c) => (
              <img key={c.name} src={c.src} alt={c.name} className="h-8 md:h-10 object-contain" />
            ))}
          </div>
        </div>
      </section>

      {/* ── Planbition X ── */}
      <section id="planbition-x" className="py-24 md:py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="max-w-5xl mx-auto relative z-10">
          <Section>
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" />
                  {t("home.xBadge")}
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                  Planbition{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">X</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg">
                  {t("home.xDesc")}
                </p>
                <ul className="space-y-3 mb-8">
                  {(["xPoint1", "xPoint2", "xPoint3", "xPoint4"] as const).map((key) => (
                    <li key={key} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{t(`home.${key}`)}</span>
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate("/landing")}>
                  {t("home.xCta")} <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-brand-accent/10 rounded-3xl blur-2xl" />
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
                      <p className="text-sm text-muted-foreground">{t("home.xCardSub")}</p>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {[
                        { val: "<1min", label: t("home.xStat1") },
                        { val: "100%", label: t("home.xStat2") },
                        { val: "73%", label: t("home.xStat3") },
                        { val: "€5k+", label: t("home.xStat4") },
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
          </Section>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 md:py-32 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <Section>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("home.featuresTitle")}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{t("home.featuresDesc")}</p>
            </div>
          </Section>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Section key={f.title}>
                <Card className="p-6 bg-card border-border hover:border-brand-accent/30 hover:shadow-lg transition-all group h-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                    <f.icon className="w-6 h-6 text-brand-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section id="benefits" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <Section className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("home.benefitsTitle")}</h2>
            <p className="text-muted-foreground mb-8 max-w-lg">{t("home.benefitsDesc")}</p>
            <ul className="space-y-4">
              {benefitKeys.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{t(`home.${key}`)}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section className="flex-1 flex justify-center">
            <div className="relative w-64 h-[500px]">
              <div className="absolute inset-0 rounded-[2.5rem] border-[6px] border-foreground/20 bg-background shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-foreground/20 rounded-b-2xl" />
                <div className="pt-10 px-4 space-y-3">
                  <div className="text-center">
                    <img src="/images/planbition-logo.png" alt="Planbition" className="h-6 mx-auto mb-3 opacity-80" />
                    <div className="text-xs text-muted-foreground">{t("home.phoneMockTitle")}</div>
                  </div>
                  {[
                    { day: t("days.mo"), type: "primary", label: t("grid.early") },
                    { day: t("days.tu"), type: "brand-accent", label: t("grid.day") },
                    { day: t("days.we"), type: "shift-early", label: t("grid.late") },
                    { day: t("days.th"), type: "primary", label: t("grid.early") },
                    { day: t("days.fr"), type: "brand-accent", label: t("grid.day") },
                  ].map((item) => (
                    <div key={item.day} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      <div className="w-8 text-xs font-medium text-muted-foreground">{item.day}</div>
                      <div className={`flex-1 h-6 rounded bg-${item.type}/30`} />
                      <div className="text-[10px] text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-24 md:py-32 px-6 bg-muted/30">
        <Section>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("home.contactTitle")}</h2>
            <p className="text-muted-foreground mb-12">{t("home.contactDesc")}</p>
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
        </Section>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <img src="/images/planbition-logo.png" alt="Planbition" className="h-6 object-contain" />
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Planbition. {t("home.copyright")}
          </div>
        </div>
      </footer>
    </div>
  );
}
