import { useState, useEffect, useCallback } from "react";
import {
  Brain,
  Cpu,
  Zap,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Target,
  Lightbulb,
  BarChart3,
  Clock,
  ShieldCheck,
  Layers,
  Gauge,
  Calendar,
  Users,
  Handshake,
  UserCheck,
  Building2,
  Plug,
  Download,
  Globe,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import robotImg from "@/assets/robot-assistant.png";
import { Button } from "@/components/ui/button";

/* ══════════════════════════════════════════
   SLIDE DEFINITIONS
   ══════════════════════════════════════════ */

type SlideType = "title" | "intro" | "features-grid" | "stats" | "clients" | "items" | "closing";

interface SlideItem {
  icon: any;
  name: string;
  desc: string;
}

interface SlideData {
  id: string;
  type: SlideType;
  title: string;
  subtitle?: string;
  tagline?: string;
  icon?: any;
  items?: SlideItem[];
  stats?: { val: string; label: string }[];
  bullets?: string[];
  clientLogos?: { name: string; src: string }[];
  features?: { icon: any; title: string; desc: string }[];
}

const slides: SlideData[] = [
  /* ── 1. Title ── */
  {
    id: "title",
    type: "title",
    title: "Planbition",
    subtitle: "De online oplossing voor uw workforce management",
    tagline: "Planning • HR • Rapportage • AI",
  },
  /* ── 2. Wat is Planbition ── */
  {
    id: "what-is",
    type: "intro",
    title: "Wat is Planbition?",
    subtitle:
      "Planbition is een uitermate flexibel online workforce management systeem dat vrijwel elk planningsproces kan ondersteunen — van onboarding tot tijdregistratie. De juiste mensen, op het juiste moment, op de juiste plaats.",
    bullets: [
      "100% web gebaseerd — bruikbaar op elk apparaat",
      "Pay as you use — alle modules inbegrepen",
      "Meerdere vestigingen binnen één installatie",
      "Open platform met 18 standaard API's",
    ],
  },
  /* ── 3. Kernfunctionaliteit ── */
  {
    id: "capabilities",
    type: "features-grid",
    title: "Kernfunctionaliteit",
    subtitle: "Eén platform voor de volledige personeelscyclus",
    features: [
      { icon: Calendar, title: "Planning & Roosteren", desc: "Operationele planningsmodule — het hart van de applicatie" },
      { icon: Users, title: "HR Management", desc: "Contracten, kwalificaties en dossiers — altijd actueel" },
      { icon: Handshake, title: "CRM", desc: "Klantbeheer met SLA's en KPI's per klant" },
      { icon: UserCheck, title: "Werknemer Zelf Service", desc: "Eigen rooster, beschikbaarheid en verlofaanvragen" },
      { icon: Building2, title: "Master / Vendor", desc: "Vraagverdeling over meerdere leveranciers" },
      { icon: BarChart3, title: "Rapportage & BI", desc: "Power BI integratie en draaitabellen" },
      { icon: Clock, title: "Tijdregistratie", desc: "Terminals, geofencing of handmatige invoer" },
      { icon: Plug, title: "Interfacing", desc: "18 standaard API's voor import en export" },
    ],
  },
  /* ── 4. Voordelen ── */
  {
    id: "benefits",
    type: "stats",
    title: "Waarom Planbition?",
    subtitle: "Bewezen resultaten bij onze klanten",
    stats: [
      { val: "85%", label: "Besparing op planningstijd" },
      { val: "70%", label: "Minder communicatietijd" },
      { val: "100%", label: "Web gebaseerd" },
      { val: "∞", label: "Onbeperkt aantal gebruikers" },
    ],
  },
  /* ── 5. Klanten ── */
  {
    id: "clients",
    type: "clients",
    title: "Onze klanten",
    subtitle: "Vertrouwd door toonaangevende organisaties in Nederland en daarbuiten",
    clientLogos: [
      { name: "Timing", src: "/images/clients/timing.png" },
      { name: "Adecco", src: "/images/clients/adecco.png" },
      { name: "Stork", src: "/images/clients/stork.png" },
      { name: "Consolid", src: "/images/clients/consolid.png" },
      { name: "YoungCapital", src: "/images/clients/yc.png" },
    ],
  },
  /* ── 6. Planbition X intro ── */
  {
    id: "x-intro",
    type: "intro",
    title: "Planbition X",
    subtitle:
      "De volgende generatie roosterplanning. Met AI-optimalisatie genereert Planbition X ATW-conforme roosters in minder dan een minuut — inclusief automatische verstoringenafhandeling en slimme alternatieven.",
    bullets: [
      "AI-optimizer lost roosters op in seconden",
      "100% ATW-compliance ingebouwd",
      "Verstoringen afhandelen met concrete alternatieven",
      "Beschikbaar als standalone microservice (REST API)",
    ],
  },
  /* ── 7. X Stats ── */
  {
    id: "x-stats",
    type: "stats",
    title: "Planbition X in cijfers",
    subtitle: "Meetbare resultaten vanaf dag één",
    stats: [
      { val: "<1 min", label: "Typische oplostijd" },
      { val: "100%", label: "ATW-nalevingsgraad" },
      { val: "73%", label: "Minder planningsinspanning" },
      { val: "€5k+", label: "Bespaard per jaar" },
    ],
  },
  /* ── 8. Moderne AI ── */
  {
    id: "modern-ai",
    type: "items",
    title: "Moderne AI",
    subtitle: "in Planbition X",
    icon: Brain,
    items: [
      { icon: TrendingUp, name: "TFT Demand Forecaster", desc: "Deep Learning voor personeelsvraag" },
      { icon: Target, name: "Bayesian Weight Optimizer", desc: "Automatisch afstellen van gewichten" },
      { icon: Lightbulb, name: "Medewerkervoorkeur-Learner", desc: "Voorkeuren en gedrag herkennen" },
      { icon: RefreshCw, name: "Planner-Correctie Learner", desc: "Leert van wijzigingen door planners" },
      { icon: Sparkles, name: "Warm-Start Generator", desc: "ML-variant voor snelle initialisatie" },
    ],
  },
  /* ── 9. Klassieke AI ── */
  {
    id: "classic-ai",
    type: "items",
    title: "Klassieke AI",
    subtitle: "in Planbition X",
    icon: Cpu,
    items: [
      { icon: Layers, name: "LNS Adaptive Weights", desc: "Adaptieve operatorselectie" },
      { icon: Target, name: "GRASP Reactive Alpha", desc: "Greedy + randomness" },
      { icon: RefreshCw, name: "Tabu Search", desc: "Voorkomen van cycli, lokaal zoeken" },
      { icon: Gauge, name: "SA-Hybride in Tabu", desc: "Simulated Annealing acceptatie" },
      { icon: Sparkles, name: "Warm-Start Generator", desc: "Heuristisch voor snelle initialisatie" },
    ],
  },
  /* ── 10. Slimme Optimalisatie ── */
  {
    id: "optimization",
    type: "items",
    title: "Slimme Optimalisatie",
    subtitle: "geen AI — pure engineering",
    icon: Zap,
    items: [
      { icon: Gauge, name: "Incremental Scoring", desc: "Snelle caching & performance-layer" },
      { icon: Layers, name: "Pure Engineering", desc: "Geen leerproces, optimale snelheid" },
    ],
  },
  /* ── 11. Voordelen AI ── */
  {
    id: "ai-benefits",
    type: "items",
    title: "Voordelen",
    subtitle: "voor klanten",
    icon: Trophy,
    items: [
      { icon: Sparkles, name: "Betere roosters", desc: "Door combinatie van AI-technieken" },
      { icon: Clock, name: "Minder handwerk", desc: "Minder handmatige aanpassingen door planners" },
      { icon: Zap, name: "5–10× sneller", desc: "Snellere solving door slimme optimalisatie" },
      { icon: BarChart3, name: "Meer uitlegbaarheid", desc: "AI-gedreven uitleg van beslissingen" },
      { icon: ShieldCheck, name: "Betrouwbaar", desc: "Stabiele constraint-based planning" },
    ],
  },
  /* ── 12. Closing ── */
  {
    id: "closing",
    type: "closing",
    title: "Klaar om te starten?",
    subtitle: "Neem contact op voor een demo of start direct met Planbition X.",
  },
];

/* ══════════════════════════════════════════
   PPTX EXPORT
   ══════════════════════════════════════════ */

async function downloadPptx() {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.author = "Planbition";
  prs.title = "Planbition X — AI Overview";

  const PRIMARY = "2563EB";
  const ACCENT = "E8842C";
  const BG = "F5F6FA";
  const DARK = "1A2236";
  const MUTED = "6B7280";
  const WHITE = "FFFFFF";

  for (const s of slides) {
    const sl = prs.addSlide();
    sl.background = { color: BG };

    // Bottom bar on every slide
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 6.9, w: 13.33, h: 0.6, fill: { color: WHITE } });
    sl.addText(`Planbition  ·  ${s.title}`, {
      x: 0.5, y: 7.0, w: 5, h: 0.4, fontSize: 9, color: MUTED, fontFace: "Arial",
    });

    if (s.type === "title") {
      sl.background = { color: PRIMARY };
      sl.addText("Planbition", {
        x: 1, y: 2.0, w: 11, h: 1.2, fontSize: 54, bold: true, color: WHITE, fontFace: "Arial",
      });
      sl.addText(s.subtitle || "", {
        x: 1, y: 3.4, w: 9, h: 0.8, fontSize: 22, color: "FFFFFFCC", fontFace: "Arial",
      });
      sl.addText(s.tagline || "", {
        x: 1, y: 4.6, w: 9, h: 0.5, fontSize: 14, color: "FFFFFF99", fontFace: "Arial",
      });
    }

    if (s.type === "intro") {
      sl.addText(s.title, {
        x: 0.8, y: 0.5, w: 11, h: 0.9, fontSize: 36, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.5, w: 10, h: 1.2, fontSize: 16, color: MUTED, fontFace: "Arial",
        lineSpacing: 26,
      });
      if (s.bullets) {
        s.bullets.forEach((b, i) => {
          sl.addText(`✓  ${b}`, {
            x: 1.0, y: 3.2 + i * 0.65, w: 10, h: 0.5, fontSize: 16, color: DARK, fontFace: "Arial",
          });
        });
      }
    }

    if (s.type === "features-grid") {
      sl.addText(s.title, {
        x: 0.8, y: 0.4, w: 11, h: 0.8, fontSize: 32, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.1, w: 10, h: 0.5, fontSize: 14, color: MUTED, fontFace: "Arial",
      });
      (s.features || []).forEach((f, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 0.6 + col * 3.1;
        const y = 2.0 + row * 2.4;
        sl.addShape(prs.ShapeType.roundRect, {
          x, y, w: 2.9, h: 2.1, rectRadius: 0.15,
          fill: { color: WHITE }, shadow: { type: "outer", blur: 6, opacity: 0.1, offset: 2 },
        });
        sl.addText(f.title, {
          x: x + 0.2, y: y + 0.3, w: 2.5, h: 0.4, fontSize: 14, bold: true, color: DARK, fontFace: "Arial",
        });
        sl.addText(f.desc, {
          x: x + 0.2, y: y + 0.8, w: 2.5, h: 0.9, fontSize: 11, color: MUTED, fontFace: "Arial",
          lineSpacing: 16,
        });
      });
    }

    if (s.type === "stats") {
      sl.addText(s.title, {
        x: 0.8, y: 1.0, w: 11, h: 0.9, fontSize: 36, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.9, w: 10, h: 0.5, fontSize: 14, color: MUTED, fontFace: "Arial",
      });
      (s.stats || []).forEach((st, i) => {
        const x = 0.8 + i * 3.1;
        sl.addShape(prs.ShapeType.roundRect, {
          x, y: 3.0, w: 2.8, h: 2.5, rectRadius: 0.2,
          fill: { color: WHITE }, shadow: { type: "outer", blur: 8, opacity: 0.1, offset: 3 },
        });
        sl.addText(st.val, {
          x, y: 3.3, w: 2.8, h: 1, fontSize: 40, bold: true, color: PRIMARY,
          fontFace: "Arial", align: "center",
        });
        sl.addText(st.label, {
          x, y: 4.4, w: 2.8, h: 0.6, fontSize: 13, color: MUTED,
          fontFace: "Arial", align: "center",
        });
      });
    }

    if (s.type === "clients") {
      sl.addText(s.title, {
        x: 0.8, y: 2.0, w: 11, h: 0.9, fontSize: 36, bold: true, color: DARK, fontFace: "Arial",
        align: "center",
      });
      sl.addText(s.subtitle || "", {
        x: 1, y: 2.9, w: 11, h: 0.5, fontSize: 14, color: MUTED, fontFace: "Arial",
        align: "center",
      });
      // Note: logos would need to be embedded as images - showing names instead
      (s.clientLogos || []).forEach((c, i) => {
        sl.addText(c.name, {
          x: 1.2 + i * 2.3, y: 4.2, w: 2, h: 0.6, fontSize: 16, color: MUTED,
          fontFace: "Arial", align: "center", bold: true,
        });
      });
    }

    if (s.type === "items") {
      sl.addShape(prs.ShapeType.roundRect, {
        x: 0.5, y: 0.3, w: 0.6, h: 0.6, rectRadius: 0.15, fill: { color: `${PRIMARY}15` },
      });
      sl.addText(s.title, {
        x: 1.3, y: 0.3, w: 8, h: 0.5, fontSize: 30, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addText(s.subtitle || "", {
        x: 1.3, y: 0.85, w: 8, h: 0.4, fontSize: 15, color: MUTED, fontFace: "Arial",
      });
      (s.items || []).forEach((item, i) => {
        const y = 1.8 + i * 1.0;
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.8, y, w: 11.5, h: 0.85, rectRadius: 0.12,
          fill: { color: WHITE }, shadow: { type: "outer", blur: 4, opacity: 0.08, offset: 2 },
        });
        sl.addText(item.name, {
          x: 1.6, y, w: 4, h: 0.85, fontSize: 15, bold: true, color: DARK, fontFace: "Arial",
          valign: "middle",
        });
        sl.addText(item.desc, {
          x: 5.5, y, w: 6, h: 0.85, fontSize: 13, color: MUTED, fontFace: "Arial",
          valign: "middle",
        });
      });
    }

    if (s.type === "closing") {
      sl.background = { color: PRIMARY };
      sl.addText(s.title, {
        x: 1, y: 2.2, w: 11, h: 1.2, fontSize: 44, bold: true, color: WHITE,
        fontFace: "Arial", align: "center",
      });
      sl.addText(s.subtitle || "", {
        x: 2, y: 3.6, w: 9, h: 0.8, fontSize: 18, color: "FFFFFFCC",
        fontFace: "Arial", align: "center",
      });
      sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
        x: 2, y: 5.0, w: 9, h: 0.5, fontSize: 14, color: "FFFFFF99",
        fontFace: "Arial", align: "center",
      });
    }
  }

  prs.writeFile({ fileName: "Planbition_X_Presentatie.pptx" });
}

/* ══════════════════════════════════════════
   SLIDE COMPONENTS
   ══════════════════════════════════════════ */

function TitleSlide({ slide }: { slide: SlideData }) {
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="pulsating-x pointer-events-none">
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <img src={robotImg} alt="Planbition AI" className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-2xl robot-float mb-6" />
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-3">
          {slide.title}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-light mb-8 max-w-3xl text-center px-8">
          {slide.subtitle}
        </p>
        {slide.tagline && (
          <div className="flex items-center gap-3 text-sm md:text-base text-muted-foreground/70">
            {slide.tagline.split("•").map((part, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-border">•</span>}
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {part.trim()}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function IntroSlide({ slide, active }: { slide: SlideData; active: boolean }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-20 max-w-5xl mx-auto w-full">
      <h2
        className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 transition-all duration-500"
        style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)" }}
      >
        {slide.id === "x-intro" ? (
          <>Planbition <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">X</span></>
        ) : slide.title}
      </h2>
      <p
        className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-10 transition-all duration-500 delay-100"
        style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)" }}
      >
        {slide.subtitle}
      </p>
      {slide.bullets && (
        <div className="space-y-4">
          {slide.bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-center gap-4 transition-all duration-500"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(30px)",
                transitionDelay: `${200 + i * 100}ms`,
              }}
            >
              <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
              <span className="text-base md:text-lg">{b}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FeaturesGridSlide({ slide, active }: { slide: SlideData; active: boolean }) {
  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-16 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h2
          className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 transition-all duration-500"
          style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)" }}
        >
          {slide.title}
        </h2>
        <p className="text-muted-foreground text-lg">{slide.subtitle}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {(slide.features || []).map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="p-5 rounded-2xl bg-card border border-border/60 hover:border-primary/30 hover:shadow-lg transition-all group"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                transitionDelay: `${i * 60}ms`,
                transitionDuration: "500ms",
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-3 group-hover:bg-brand-accent/20 transition-colors">
                <Icon className="w-5 h-5 text-brand-accent" />
              </div>
              <div className="font-semibold text-sm mb-1">{f.title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{f.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsSlide({ slide, active }: { slide: SlideData; active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <h2
        className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 transition-all duration-500"
        style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)" }}
      >
        {slide.title}
      </h2>
      <p className="text-muted-foreground text-lg mb-16">{slide.subtitle}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 max-w-5xl">
        {(slide.stats || []).map((st, i) => (
          <div
            key={st.label}
            className="flex flex-col items-center p-6 md:p-8 rounded-2xl bg-card border border-border/60 shadow-sm transition-all duration-500"
            style={{
              opacity: active ? 1 : 0,
              transform: active ? "translateY(0) scale(1)" : "translateY(30px) scale(0.9)",
              transitionDelay: `${i * 120}ms`,
            }}
          >
            <div className="text-4xl md:text-5xl font-extrabold text-primary mb-2">{st.val}</div>
            <div className="text-sm text-muted-foreground text-center">{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientsSlide({ slide, active }: { slide: SlideData; active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-8">
      <h2
        className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2 transition-all duration-500"
        style={{ opacity: active ? 1 : 0 }}
      >
        {slide.title}
      </h2>
      <p className="text-muted-foreground text-lg mb-16 max-w-2xl text-center">{slide.subtitle}</p>
      <div className="flex items-center justify-center gap-12 md:gap-20 flex-wrap">
        {(slide.clientLogos || []).map((c, i) => (
          <img
            key={c.name}
            src={c.src}
            alt={c.name}
            className="h-10 md:h-14 object-contain transition-all duration-500"
            style={{
              opacity: active ? 0.7 : 0,
              transform: active ? "translateY(0)" : "translateY(20px)",
              transitionDelay: `${i * 100}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ItemsSlide({ slide, active }: { slide: SlideData; active: boolean }) {
  const Icon = slide.icon!;
  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-20 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{slide.title}</h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">{slide.subtitle}</p>
        </div>
      </div>
      <div className="grid gap-4 md:gap-5">
        {(slide.items || []).map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-start gap-5 p-5 md:p-6 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-lg group"
              style={{
                opacity: active ? 1 : 0,
                transform: active ? "translateX(0)" : "translateX(40px)",
                transitionDelay: active ? `${i * 100}ms` : "0ms",
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <ItemIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-base md:text-lg mb-1">{item.name}</div>
                <div className="text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ClosingSlide({ slide, active }: { slide: SlideData; active: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      <div className="pulsating-x pointer-events-none">
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        <img src={robotImg} alt="Planbition AI" className="w-20 h-20 object-contain drop-shadow-2xl robot-float mb-8" />
        <h2
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 transition-all duration-500"
          style={{ opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(20px)" }}
        >
          {slide.title}
        </h2>
        <p
          className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl transition-all duration-500 delay-150"
          style={{ opacity: active ? 1 : 0 }}
        >
          {slide.subtitle}
        </p>
        <div
          className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground transition-all duration-500 delay-300"
          style={{ opacity: active ? 1 : 0 }}
        >
          <span>info@planbition.com</span>
          <span className="hidden sm:inline text-border">·</span>
          <span>+31-(0)24-3529629</span>
          <span className="hidden sm:inline text-border">·</span>
          <span>planbition.com</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN PRESENTATION
   ══════════════════════════════════════════ */

function useAnimatedIndex(current: number) {
  const [displayed, setDisplayed] = useState(current);
  const [dir, setDir] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (current === displayed) return;
    setDir(current > displayed ? 1 : -1);
    setAnimating(true);
    const t = setTimeout(() => {
      setDisplayed(current);
      setAnimating(false);
    }, 280);
    return () => clearTimeout(t);
  }, [current, displayed]);

  return { displayed, dir, animating };
}

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const { displayed, dir, animating } = useAnimatedIndex(current);

  const go = useCallback(
    (d: number) => {
      if (animating) return;
      const next = current + d;
      if (next >= 0 && next < slides.length) setCurrent(next);
    },
    [current, animating],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  const slide = slides[displayed];

  const renderSlide = () => {
    const active = !animating;
    switch (slide.type) {
      case "title": return <TitleSlide slide={slide} />;
      case "intro": return <IntroSlide slide={slide} active={active} />;
      case "features-grid": return <FeaturesGridSlide slide={slide} active={active} />;
      case "stats": return <StatsSlide slide={slide} active={active} />;
      case "clients": return <ClientsSlide slide={slide} active={active} />;
      case "items": return <ItemsSlide slide={slide} active={active} />;
      case "closing": return <ClosingSlide slide={slide} active={active} />;
      default: return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background text-foreground select-none overflow-hidden cursor-default"
      onClick={(e) => {
        const w = window.innerWidth;
        if ((e.target as HTMLElement).closest("button")) return;
        if (e.clientX > w * 0.65) go(1);
        else if (e.clientX < w * 0.35) go(-1);
      }}
    >
      {/* Slide content */}
      <div
        className="absolute inset-0 transition-all duration-280 ease-out"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating ? `translateX(${dir * -60}px)` : "translateX(0)",
        }}
      >
        {renderSlide()}
      </div>

      {/* Top bar with download */}
      <div className="absolute top-0 right-0 z-20 p-4">
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground/50 hover:text-foreground gap-2"
          onClick={(e) => {
            e.stopPropagation();
            downloadPptx();
          }}
        >
          <Download className="w-4 h-4" />
          <span className="hidden md:inline text-xs">PPTX</span>
        </Button>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4">
        <img src="/images/planbition-logo.png" alt="Planbition" className="h-5 opacity-40" />
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={(e) => { e.stopPropagation(); if (!animating) setCurrent(i); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground/50 font-mono">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Nav arrows */}
      {current > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); go(-1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
      {current < slides.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); go(1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
