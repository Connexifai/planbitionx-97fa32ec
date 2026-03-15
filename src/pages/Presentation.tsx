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
} from "lucide-react";
import robotImg from "@/assets/robot-assistant.png";

/* ── Slide data ── */
const slides = [
  {
    id: "title",
    title: "Planbition X",
    subtitle: "AI Overview",
    tagline: "Moderne AI • Klassieke AI • Optimalisatie",
    type: "title" as const,
  },
  {
    id: "modern-ai",
    title: "Moderne AI",
    subtitle: "in Planbition X",
    icon: Brain,
    color: "primary" as const,
    items: [
      {
        icon: TrendingUp,
        name: "TFT Demand Forecaster",
        desc: "Deep Learning voor personeelsvraag",
      },
      {
        icon: Target,
        name: "Bayesian Weight Optimizer",
        desc: "Automatisch afstellen van gewichten",
      },
      {
        icon: Lightbulb,
        name: "Medewerkervoorkeur-Learner",
        desc: "Voorkeuren en gedrag herkennen",
      },
      {
        icon: RefreshCw,
        name: "Planner-Correctie Learner",
        desc: "Leert van wijzigingen door planners",
      },
      {
        icon: Sparkles,
        name: "Warm-Start Generator",
        desc: "ML-variant voor snelle initialisatie",
      },
    ],
    type: "items" as const,
  },
  {
    id: "classic-ai",
    title: "Klassieke AI",
    subtitle: "in Planbition X",
    icon: Cpu,
    color: "brand-accent" as const,
    items: [
      {
        icon: Layers,
        name: "LNS Adaptive Weights",
        desc: "Adaptieve operatorselectie",
      },
      {
        icon: Target,
        name: "GRASP Reactive Alpha",
        desc: "Greedy + randomness",
      },
      {
        icon: RefreshCw,
        name: "Tabu Search",
        desc: "Voorkomen van cycli, lokaal zoeken",
      },
      {
        icon: Gauge,
        name: "SA-Hybride in Tabu",
        desc: "Simulated Annealing acceptatie",
      },
      {
        icon: Sparkles,
        name: "Warm-Start Generator",
        desc: "Heuristisch voor snelle initialisatie",
      },
    ],
    type: "items" as const,
  },
  {
    id: "optimization",
    title: "Slimme Optimalisatie",
    subtitle: "geen AI — pure engineering",
    icon: Zap,
    color: "shift-early" as const,
    items: [
      {
        icon: Gauge,
        name: "Incremental Scoring",
        desc: "Snelle caching & performance-layer",
      },
      {
        icon: Layers,
        name: "Pure Engineering",
        desc: "Geen leerproces, optimale snelheid",
      },
    ],
    type: "items" as const,
  },
  {
    id: "benefits",
    title: "Voordelen",
    subtitle: "voor klanten",
    icon: Trophy,
    color: "primary" as const,
    items: [
      {
        icon: Sparkles,
        name: "Betere roosters",
        desc: "Door combinatie van AI-technieken",
      },
      {
        icon: Clock,
        name: "Minder handwerk",
        desc: "Minder handmatige aanpassingen door planners",
      },
      {
        icon: Zap,
        name: "5–10× sneller",
        desc: "Snellere solving door slimme optimalisatie",
      },
      {
        icon: BarChart3,
        name: "Meer uitlegbaarheid",
        desc: "AI-gedreven uitleg van beslissingen",
      },
      {
        icon: ShieldCheck,
        name: "Betrouwbaar",
        desc: "Stabiele constraint-based planning",
      },
    ],
    type: "items" as const,
  },
];

/* ── Animated counter ── */
function useAnimatedIndex(current: number) {
  const [displayed, setDisplayed] = useState(current);
  const [dir, setDir] = useState(0); // -1 left, 0 none, 1 right
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (current === displayed) return;
    setDir(current > displayed ? 1 : -1);
    setAnimating(true);
    const t = setTimeout(() => {
      setDisplayed(current);
      setAnimating(false);
    }, 300);
    return () => clearTimeout(t);
  }, [current, displayed]);

  return { displayed, dir, animating };
}

/* ── Title slide ── */
function TitleSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full relative">
      {/* Pulsating X background */}
      <div className="pulsating-x pointer-events-none">
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
        <div className="pulsating-x-blob" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <img
          src={robotImg}
          alt="Planbition X AI"
          className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl robot-float mb-8"
        />
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-2">
          Planbition{" "}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            X
          </span>
        </h1>
        <p className="text-xl md:text-3xl font-light text-muted-foreground mb-8">
          AI Overview
        </p>
        <div className="flex items-center gap-3 text-sm md:text-base text-muted-foreground/70">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
            Moderne AI
          </span>
          <span className="text-border">•</span>
          <span className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent font-medium">
            Klassieke AI
          </span>
          <span className="text-border">•</span>
          <span className="px-3 py-1 rounded-full bg-shift-early/10 text-shift-early font-medium">
            Optimalisatie
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Items slide ── */
function ItemsSlide({
  slide,
  active,
}: {
  slide: (typeof slides)[1];
  active: boolean;
}) {
  if (slide.type !== "items") return null;
  const Icon = slide.icon!;

  return (
    <div className="flex flex-col justify-center h-full px-8 md:px-20 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {slide.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-light">
            {slide.subtitle}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="grid gap-4 md:gap-5">
        {slide.items!.map((item, i) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-start gap-5 p-5 md:p-6 rounded-2xl bg-card/80 border border-border/60 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-lg group"
              style={{
                opacity: active ? 1 : 0,
                transform: active
                  ? "translateX(0)"
                  : "translateX(40px)",
                transitionDelay: active ? `${i * 100}ms` : "0ms",
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <ItemIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-base md:text-lg mb-1">
                  {item.name}
                </div>
                <div className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main presentation ── */
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
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        go(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go]);

  const slide = slides[displayed];

  return (
    <div
      className="fixed inset-0 bg-background text-foreground select-none overflow-hidden cursor-default"
      onClick={(e) => {
        const w = window.innerWidth;
        if (e.clientX > w * 0.65) go(1);
        else if (e.clientX < w * 0.35) go(-1);
      }}
    >
      {/* Slide content */}
      <div
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          opacity: animating ? 0 : 1,
          transform: animating
            ? `translateX(${dir * -60}px)`
            : "translateX(0)",
        }}
      >
        {slide.type === "title" ? (
          <TitleSlide />
        ) : (
          <ItemsSlide slide={slide as any} active={!animating} />
        )}
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <img
          src="/images/planbition-logo.png"
          alt="Planbition"
          className="h-5 opacity-40"
        />

        {/* Dots */}
        <div className="flex items-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!animating) setCurrent(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className="text-xs text-muted-foreground/50 font-mono">
          {current + 1} / {slides.length}
        </div>
      </div>

      {/* Nav arrows */}
      {current > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(-1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
      {current < slides.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            go(1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/80 border border-border flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
