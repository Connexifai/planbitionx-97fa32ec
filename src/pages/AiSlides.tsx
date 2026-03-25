import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import robotImg from "@/assets/robot-assistant.png";

/* ═══ Design tokens ═══ */
const DARK = "#0B1120";
const DARK2 = "#111B2E";
const P = "#2563EB";
const P_DARK = "#1E40AF";
const ACC = "#E8842C";
const MODERN = "#7C3AED";
const CLASSIC = "#0891B2";
const DOMAIN = "#475569";
const GREEN = "#10B981";
const AMBER = "#F59E0B";
const VIOLET = "#8B5CF6";

const TOTAL_SLIDES = 6;

/* ═══ Scaled Slide Wrapper ═══ */
function ScaledSlide({ children, className }: { children: React.ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setScale(Math.min(width / 1920, height / 1080));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden", className)}>
      <div
        className="absolute origin-center select-none"
        style={{
          width: 1920, height: 1080,
          left: "50%", top: "50%",
          marginLeft: -960, marginTop: -540,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ═══ Slide Components ═══ */

function Slide1Title() {
  return (
    <div className="w-full h-full relative" style={{ background: DARK }}>
      {/* Geometric accents */}
      <div className="absolute" style={{ right: -80, top: 300, width: 500, height: 500, borderRadius: "50%", background: "#1E3A5F", opacity: 0.5 }} />
      <div className="absolute" style={{ left: -60, bottom: 50, width: 350, height: 350, borderRadius: "50%", background: "#1A1A3E", opacity: 0.5 }} />
      {/* Top accent */}
      <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: ACC }} />

      <div className="relative z-10 flex h-full">
        <div className="flex-1 flex flex-col justify-center pl-[120px] pr-[60px]">
          <p className="text-[18px] font-bold tracking-[8px] mb-6" style={{ color: "#94A3B8" }}>PLANBITION</p>
          <p className="text-[200px] font-bold leading-none mb-2" style={{ color: ACC }}>X</p>
          <h1 className="text-[44px] font-bold leading-[56px] mb-4" style={{ color: "#FFFFFF" }}>
            AI in Planbition X
          </h1>
          <p className="text-[18px] mb-10" style={{ color: "#94A3B8" }}>
            Klassieke en moderne AI — samen in één solver
          </p>
          <div className="flex gap-3">
            {[
              { l: "Moderne AI", c: MODERN },
              { l: "Klassieke AI", c: CLASSIC },
              { l: "Domain Logic", c: DOMAIN },
            ].map(b => (
              <span key={b.l} className="px-5 py-2 rounded-full text-[14px] font-bold text-white" style={{ background: b.c }}>
                {b.l}
              </span>
            ))}
          </div>
        </div>
        <div className="w-[500px] flex items-center justify-center pr-[60px]">
          <img src={robotImg} alt="" className="w-[400px] h-[400px] object-contain drop-shadow-2xl" />
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full h-[48px] flex items-center px-[120px]" style={{ background: DARK2 }}>
        <p className="text-[13px]" style={{ color: "#64748B" }}>info@planbition.com · +31-(0)24-3529629 · planbition.com</p>
      </div>
    </div>
  );
}

function Slide2Overview() {
  return (
    <SlideLayout title="Klassieke vs Moderne AI" subtitle="Twee werelden, één solver">
      <div className="flex gap-10 px-[60px] mt-8">
        {/* Modern AI */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full text-[14px] font-bold text-white" style={{ background: MODERN }}>🧠 Moderne AI</span>
          </div>
          <p className="text-[16px] leading-[26px] mb-6" style={{ color: "#64748B" }}>
            Deep Learning & LLM-technologie voor natuurlijke interactie en intelligente voorspellingen.
          </p>
          {[
            { t: "NLP Briefing Parser", d: "Vertaalt natuurlijke taal naar solver-constraints" },
            { t: "AI Assistent (Post-Solve)", d: "Zoekt alternatieven bij verstoringen met uitleg" },
            { t: "TFT Demand Forecaster", d: "Voorspelt personeelsbehoefte met deep learning" },
            { t: "Planner-Correctie Learner", d: "Leert van handmatige aanpassingen" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="w-[8px] h-[8px] rounded-full mt-2 shrink-0" style={{ background: MODERN }} />
              <div>
                <p className="text-[16px] font-bold" style={{ color: "#0F172A" }}>{item.t}</p>
                <p className="text-[14px]" style={{ color: "#64748B" }}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-[2px] self-stretch rounded-full" style={{ background: "#E2E8F0" }} />

        {/* Classic AI */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full text-[14px] font-bold text-white" style={{ background: CLASSIC }}>⚙️ Klassieke AI</span>
          </div>
          <p className="text-[16px] leading-[26px] mb-6" style={{ color: "#64748B" }}>
            Bewezen metaheuristieken en optimalisatietechnieken die het optimale rooster vinden.
          </p>
          {[
            { t: "Simulated Annealing (SA)", d: "Accepteert tijdelijk slechtere oplossingen voor beter eindresultaat" },
            { t: "Large Neighborhood Search (LNS)", d: "Vernietigt en herbouwt delen van het rooster" },
            { t: "Late Acceptance Hill Climbing", d: "Vergelijkt met historische scores voor diversificatie" },
            { t: "GRASP + Tabu Hybride", d: "Diverse startoplossingen met geheugen-gestuurde search" },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 mb-4">
              <div className="w-[8px] h-[8px] rounded-full mt-2 shrink-0" style={{ background: CLASSIC }} />
              <div>
                <p className="text-[16px] font-bold" style={{ color: "#0F172A" }}>{item.t}</p>
                <p className="text-[14px]" style={{ color: "#64748B" }}>{item.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide3ModernAI() {
  const cards = [
    {
      name: "NLP Briefing Parser",
      desc: "Large Language Model vertaalt natuurlijke taal van planners naar solver-constraints.",
      detail: "\"Jan mag geen nachtdiensten\" → hard constraint op shift-type N. Ondersteunt 8 talen.",
      phase: "Vóór het oplossen",
      col: MODERN,
    },
    {
      name: "AI Assistent (Post-Solve)",
      desc: "Bij verstoringen genereert de AI meerdere alternatieven met uitleg per kandidaat.",
      detail: "Combineert constraint-relaxatie met LLM-uitleg. Toont impact, compliance-status en score.",
      phase: "Na het oplossen",
      col: MODERN,
    },
    {
      name: "TFT Demand Forecaster",
      desc: "Temporal Fusion Transformer voorspelt personeelsbehoefte per locatie en tijdslot.",
      detail: "Input: historische bezetting, seizoenspatronen. Output: voorspelde FTE-behoefte per uur.",
      phase: "Vóór het oplossen",
      col: MODERN,
    },
    {
      name: "Planner-Correctie Learner",
      desc: "Supervised learning model dat leert van handmatige aanpassingen door planners.",
      detail: "Past gewichten aan zodat de solver menselijke patronen automatisch overneemt.",
      phase: "Achtergrondproces",
      col: MODERN,
    },
  ];

  return (
    <SlideLayout title="Moderne AI — Deep Learning & LLMs" subtitle="State-of-the-art technieken voor natuurlijke interactie en intelligente voorspellingen">
      <div className="grid grid-cols-2 gap-6 px-[60px] mt-6">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100">
            <div className="h-[5px]" style={{ background: c.col }} />
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[20px] font-bold" style={{ color: "#0F172A" }}>{c.name}</h3>
                <span className="text-[12px] font-semibold px-3 py-1 rounded-full text-white" style={{ background: c.col }}>{c.phase}</span>
              </div>
              <p className="text-[15px] leading-[22px] mb-2" style={{ color: "#334155" }}>{c.desc}</p>
              <p className="text-[14px] leading-[20px]" style={{ color: "#64748B" }}>{c.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function Slide4ClassicAI() {
  const cards = [
    {
      name: "Simulated Annealing (SA)",
      desc: "Accepteert tijdelijk slechtere moves om een beter globaal optimum te vinden.",
      detail: "Temperatuur daalt stapsgewijs; voorkomt vastlopen in lokale optima. Kernalgoritme van de solver.",
      col: CLASSIC,
    },
    {
      name: "Large Neighborhood Search (LNS)",
      desc: "Vernietigt en herbouwt grote delen van het rooster om lokale optima te doorbreken.",
      detail: "Destroy/repair-cyclus op 20-40% van toewijzingen met directe constraint-check.",
      col: CLASSIC,
    },
    {
      name: "Late Acceptance Hill Climbing (LAHC)",
      desc: "Vergelijkt met historische score i.p.v. alleen de huidige beste score.",
      detail: "Buffer-gebaseerde acceptatie geeft sterke diversificatie naast LNS.",
      col: CLASSIC,
    },
    {
      name: "GRASP + Tabu Hybride",
      desc: "Randomized constructie gevolgd door geheugen-gestuurde lokale search.",
      detail: "Diverse startoplossingen, daarna Tabu-refinement zonder cyclisch gedrag.",
      col: CLASSIC,
    },
  ];

  return (
    <SlideLayout title="Klassieke AI — Metaheuristieken" subtitle="Bewezen optimalisatietechnieken die het optimale rooster vinden">
      <div className="grid grid-cols-2 gap-6 px-[60px] mt-6">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100">
            <div className="h-[5px]" style={{ background: c.col }} />
            <div className="p-6">
              <h3 className="text-[20px] font-bold mb-2" style={{ color: "#0F172A" }}>{c.name}</h3>
              <p className="text-[15px] leading-[22px] mb-2" style={{ color: "#334155" }}>{c.desc}</p>
              <p className="text-[14px] leading-[20px]" style={{ color: "#64748B" }}>{c.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

function Slide5WarmStart() {
  return (
    <SlideLayout title="ML Warm Start" subtitle="Machine Learning voorziet de solver van een intelligent startpunt">
      <div className="flex gap-10 px-[60px] mt-6">
        {/* Left: explanation */}
        <div className="flex-1">
          <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: GREEN }}>
                <span className="text-white text-[24px]">⚡</span>
              </div>
              <div>
                <h3 className="text-[22px] font-bold" style={{ color: "#0F172A" }}>ML Warm-Start Generator</h3>
                <p className="text-[14px]" style={{ color: "#64748B" }}>Supervised Learning op historische data</p>
              </div>
            </div>
            <p className="text-[16px] leading-[26px] mb-6" style={{ color: "#334155" }}>
              Het ML-model analyseert historische roosterdata en leert patronen: welke medewerker wordt doorgaans op welke dag aan welke dienst gekoppeld.
            </p>
            <p className="text-[16px] leading-[26px] mb-6" style={{ color: "#334155" }}>
              Per combinatie (medewerker × dag × dienst) voorspelt het model de waarschijnlijkheid van toewijzing. Dit genereert een kwalitatief <strong>startrooster</strong>.
            </p>
            <div className="rounded-xl p-5" style={{ background: "#F0FDF4", border: `2px solid ${GREEN}33` }}>
              <p className="text-[18px] font-bold mb-1" style={{ color: GREEN }}>40-60% snellere convergentie</p>
              <p className="text-[14px]" style={{ color: "#334155" }}>
                De solver start vanuit dit punt i.p.v. een leeg rooster — waardoor het optimale rooster sneller gevonden wordt.
              </p>
            </div>
          </div>
        </div>

        {/* Right: visual flow */}
        <div className="w-[650px] flex flex-col justify-center gap-5">
          {[
            { step: "1", title: "Historische data", desc: "Analyseer vorige roosters, plannervoorkeuren en correcties", col: MODERN, bg: "#F5F3FF" },
            { step: "2", title: "ML Classificatie", desc: "Voorspel per (medewerker, dag, dienst) de toewijzingskans", col: AMBER, bg: "#FFFBEB" },
            { step: "3", title: "Warm Start Rooster", desc: "Genereer startrooster op basis van hoogste waarschijnlijkheden", col: GREEN, bg: "#F0FDF4" },
            { step: "4", title: "Solver Optimalisatie", desc: "SA, LNS en LAHC verfijnen het rooster tot het optimum", col: P, bg: "#EFF6FF" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-5">
              <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 text-white text-[22px] font-bold" style={{ background: s.col }}>
                {s.step}
              </div>
              <div className="flex-1 rounded-xl p-4" style={{ background: s.bg, borderLeft: `4px solid ${s.col}` }}>
                <p className="text-[17px] font-bold" style={{ color: "#0F172A" }}>{s.title}</p>
                <p className="text-[14px]" style={{ color: "#64748B" }}>{s.desc}</p>
              </div>
              {i < 3 && (
                <div className="absolute" style={{ left: "calc(50% + 300px)", marginTop: 72 }}>
                  {/* Arrow handled by spacing */}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

function Slide6Schema() {
  // Schematic overview with solver in center
  return (
    <SlideLayout title="AI Architectuur — Schematisch Overzicht" subtitle="Welke AI zit waar in het planningsproces">
      <div className="relative w-full" style={{ height: 720 }}>
        {/* Center: Solver */}
        <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
          <div className="w-[280px] h-[280px] rounded-full flex flex-col items-center justify-center shadow-2xl" style={{ background: `linear-gradient(135deg, ${P}, ${P_DARK})` }}>
            <span className="text-white text-[52px] font-bold">Solver</span>
            <span className="text-white/70 text-[16px] mt-1">Optimalisatie Engine</span>
          </div>
          {/* Inner ring techniques */}
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-full border-2 border-dashed" style={{ borderColor: `${P}40` }} />
        </div>

        {/* IN the solver process (SA, LNS, LAHC) — positioned around center */}
        {[
          { label: "SA", full: "Simulated Annealing", x: "50%", y: "8%", mx: -60, my: 0 },
          { label: "LNS", full: "Large Neighborhood Search", x: "65%", y: "22%", mx: 20, my: 0 },
          { label: "LAHC", full: "Late Acceptance HC", x: "65%", y: "72%", mx: 20, my: 0 },
          { label: "GRASP", full: "GRASP + Tabu", x: "50%", y: "86%", mx: -60, my: 0 },
        ].map((t, i) => (
          <div key={i} className="absolute flex items-center gap-3" style={{ left: t.x, top: t.y, marginLeft: t.mx, marginTop: t.my }}>
            <div className="w-[100px] h-[52px] rounded-xl flex items-center justify-center shadow-md text-white text-[15px] font-bold" style={{ background: CLASSIC }}>
              {t.label}
            </div>
            <span className="text-[13px] font-medium" style={{ color: "#64748B" }}>{t.full}</span>
          </div>
        ))}

        {/* LEFT: Pre-process AI */}
        <div className="absolute flex flex-col gap-5" style={{ left: 40, top: "50%", transform: "translateY(-50%)" }}>
          <div className="text-[13px] font-bold tracking-wider mb-2" style={{ color: MODERN }}>VÓÓR HET OPLOSSEN</div>
          {[
            { name: "AI Briefing", desc: "NLP → Constraints" },
            { name: "TFT Forecaster", desc: "Demand Prediction" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-[180px] rounded-xl p-4 shadow-md border-l-4" style={{ background: "#F5F3FF", borderColor: MODERN }}>
                <p className="text-[16px] font-bold" style={{ color: "#0F172A" }}>{item.name}</p>
                <p className="text-[13px]" style={{ color: "#64748B" }}>{item.desc}</p>
              </div>
              <svg width="80" height="24" viewBox="0 0 80 24" className="shrink-0">
                <defs><marker id={`ah${i}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={MODERN} /></marker></defs>
                <line x1="0" y1="12" x2="70" y2="12" stroke={MODERN} strokeWidth="2" strokeDasharray="6 4" markerEnd={`url(#ah${i})`} />
              </svg>
            </div>
          ))}
        </div>

        {/* RIGHT: Post-process AI */}
        <div className="absolute flex flex-col gap-5" style={{ right: 40, top: "50%", transform: "translateY(-50%)" }}>
          <div className="text-[13px] font-bold tracking-wider mb-2 text-right" style={{ color: MODERN }}>NA HET OPLOSSEN</div>
          {[
            { name: "AI Assistent", desc: "Alternatieven & uitleg" },
            { name: "Explain AI", desc: "Uitleg per toewijzing" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <svg width="80" height="24" viewBox="0 0 80 24" className="shrink-0">
                <defs><marker id={`ahR${i}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={MODERN} /></marker></defs>
                <line x1="0" y1="12" x2="70" y2="12" stroke={MODERN} strokeWidth="2" strokeDasharray="6 4" markerEnd={`url(#ahR${i})`} />
              </svg>
              <div className="w-[180px] rounded-xl p-4 shadow-md border-r-4" style={{ background: "#F5F3FF", borderColor: MODERN }}>
                <p className="text-[16px] font-bold" style={{ color: "#0F172A" }}>{item.name}</p>
                <p className="text-[13px]" style={{ color: "#64748B" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM: Background process — ML Learning */}
        <div className="absolute flex flex-col items-center" style={{ left: "50%", bottom: 10, transform: "translateX(-50%)" }}>
          <svg width="24" height="50" viewBox="0 0 24 50" className="mb-2">
            <defs><marker id="ahB" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill={AMBER} /></marker></defs>
            <line x1="12" y1="40" x2="12" y2="5" stroke={AMBER} strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#ahB)" />
          </svg>
          <div className="rounded-xl p-4 shadow-md border-b-4 text-center" style={{ background: "#FFFBEB", borderColor: AMBER, width: 320 }}>
            <p className="text-[13px] font-bold tracking-wider mb-1" style={{ color: AMBER }}>ACHTERGRONDPROCES</p>
            <p className="text-[18px] font-bold" style={{ color: "#0F172A" }}>ML Warm Start & Learning</p>
            <p className="text-[13px]" style={{ color: "#64748B" }}>Historische data → Startrooster + gewichten</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* ═══ Shared Slide Layout ═══ */
function SlideLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="w-full h-full relative" style={{ background: "#F8FAFC" }}>
      {/* Top bars */}
      <div className="absolute top-0 left-0 w-full h-[5px]" style={{ background: P }} />
      <div className="absolute top-[5px] left-0 w-full h-[2px]" style={{ background: ACC }} />

      {/* Header */}
      <div className="pt-[40px] pl-[80px] pr-[80px]">
        <h2 className="text-[36px] font-bold" style={{ color: "#0F172A" }}>{title}</h2>
        <div className="w-[80px] h-[4px] rounded-full mt-3" style={{ background: P }} />
        {subtitle && <p className="text-[16px] mt-3" style={{ color: "#64748B" }}>{subtitle}</p>}
      </div>

      {/* Content */}
      <div className="mt-4">
        {children}
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full h-[44px] border-t flex items-center px-[80px] justify-between" style={{ background: "#FFFFFF", borderColor: "#E2E8F0" }}>
        <div className="flex items-center gap-2">
          {[GREEN, AMBER, P, VIOLET].map((c, i) => (
            <div key={i} className="w-[10px] h-[10px] rounded-full" style={{ background: c }} />
          ))}
          <span className="text-[12px] font-bold ml-2" style={{ color: "#0F172A" }}>Planbition X</span>
        </div>
      </div>
    </div>
  );
}

/* ═══ Slide navigation controls ═══ */
const SLIDES = [Slide1Title, Slide2Overview, Slide3ModernAI, Slide4ClassicAI, Slide5WarmStart, Slide6Schema];

export default function AiSlides() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, TOTAL_SLIDES - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
      if (e.key === "Escape" && isFullscreen) document.exitFullscreen();
      if (e.key === "f" || e.key === "F5") { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, isFullscreen, toggleFullscreen]);

  const CurrentSlide = SLIDES[current];

  return (
    <div ref={containerRef} className={cn("flex flex-col bg-black", isFullscreen ? "h-screen" : "h-screen")}>
      {/* Toolbar */}
      {!isFullscreen && (
        <div className="flex items-center justify-between h-14 px-4 bg-background border-b shrink-0">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Terug
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{current + 1} / {TOTAL_SLIDES}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className={cn("w-full", isFullscreen ? "h-full" : "h-full max-w-[1400px] aspect-video")}>
          <ScaledSlide>
            <CurrentSlide />
          </ScaledSlide>
        </div>

        {/* Navigation overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-4 py-2">
          <button onClick={prev} disabled={current === 0} className="text-white/80 hover:text-white disabled:opacity-30 transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all",
                  i === current ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
          <button onClick={next} disabled={current === TOTAL_SLIDES - 1} className="text-white/80 hover:text-white disabled:opacity-30 transition-colors p-1">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail strip (non-fullscreen only) */}
      {!isFullscreen && (
        <div className="h-24 bg-background border-t flex items-center gap-3 px-4 overflow-x-auto shrink-0">
          {SLIDES.map((S, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-16 aspect-video rounded-md overflow-hidden border-2 transition-all shrink-0",
                i === current ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-muted-foreground/50"
              )}
            >
              <div className="w-full h-full" style={{ transform: "scale(0.083)", transformOrigin: "top left", width: 1920, height: 1080 }}>
                <S />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
