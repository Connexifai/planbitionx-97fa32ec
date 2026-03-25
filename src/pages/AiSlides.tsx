import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ChevronLeft, Maximize2 } from "lucide-react";
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
const BG = "#F8FAFC";

const TOTAL_SLIDES = 6;

/* ═══ Scaled Slide Wrapper ═══ */
function ScaledSlide({ children }: { children: React.ReactNode }) {
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
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
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

/* ═══ Shared Layout ═══ */
function SlideLayout({ title, subtitle, children, slideNum }: { title: string; subtitle?: string; children: React.ReactNode; slideNum: number }) {
  return (
    <div className="w-full h-full relative" style={{ background: BG }}>
      <div className="absolute top-0 left-0 w-full h-[5px]" style={{ background: P }} />
      <div className="absolute top-[5px] left-0 w-full h-[2px]" style={{ background: ACC }} />
      <div className="pt-[40px] pl-[80px] pr-[80px]">
        <h2 className="text-[36px] font-bold" style={{ color: "#0F172A" }}>{title}</h2>
        <div className="w-[80px] h-[4px] rounded-full mt-3" style={{ background: P }} />
        {subtitle && <p className="text-[16px] mt-3" style={{ color: "#64748B" }}>{subtitle}</p>}
      </div>
      <div className="mt-4">{children}</div>
      <div className="absolute bottom-0 left-0 w-full h-[44px] border-t flex items-center px-[80px] justify-between" style={{ background: "#FFFFFF", borderColor: "#E2E8F0" }}>
        <div className="flex items-center gap-2">
          {[GREEN, AMBER, P, VIOLET].map((c, i) => (
            <div key={i} className="w-[10px] h-[10px] rounded-full" style={{ background: c }} />
          ))}
          <span className="text-[12px] font-bold ml-2" style={{ color: "#0F172A" }}>Planbition X</span>
        </div>
        <span className="text-[12px]" style={{ color: "#94A3B8" }}>{slideNum} / {TOTAL_SLIDES}</span>
      </div>
    </div>
  );
}

/* ═══ SLIDE 1 — Title ═══ */
function Slide1() {
  return (
    <div className="w-full h-full relative" style={{ background: DARK }}>
      <div className="absolute" style={{ right: -80, top: 300, width: 500, height: 500, borderRadius: "50%", background: "#1E3A5F", opacity: 0.5 }} />
      <div className="absolute" style={{ left: -60, bottom: 50, width: 350, height: 350, borderRadius: "50%", background: "#1A1A3E", opacity: 0.5 }} />
      <div className="absolute top-0 left-0 w-full h-[4px]" style={{ background: ACC }} />

      <div className="relative z-10 flex h-full">
        <div className="flex-1 flex flex-col justify-center pl-[120px] pr-[60px]">
          <p className="text-[20px] font-bold tracking-[8px] mb-8" style={{ color: "#94A3B8" }}>PLANBITION</p>
          <p className="text-[220px] font-bold leading-none mb-4" style={{ color: ACC }}>X</p>
          <h1 className="text-[56px] font-bold leading-[66px] mb-6" style={{ color: "#FFFFFF" }}>
            AI in Planbition X
          </h1>
          <p className="text-[24px] leading-[34px] mb-12" style={{ color: "#CBD5E1" }}>
            Classical & Modern AI — working together<br />in a single solver engine
          </p>
          <div className="flex gap-4">
            {[
              { l: "Modern AI", c: MODERN },
              { l: "Classical AI", c: CLASSIC },
              { l: "Domain Logic", c: DOMAIN },
            ].map(b => (
              <span key={b.l} className="px-6 py-2.5 rounded-full text-[16px] font-bold text-white" style={{ background: b.c }}>
                {b.l}
              </span>
            ))}
          </div>
        </div>
        <div className="w-[520px] flex items-center justify-center pr-[60px]">
          <img src={robotImg} alt="" className="w-[420px] h-[420px] object-contain drop-shadow-2xl" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[48px] flex items-center justify-center" style={{ background: DARK2 }}>
        <p className="text-[14px]" style={{ color: "#64748B" }}>info@planbition.com · +31-(0)24-3529629 · planbition.com</p>
      </div>
    </div>
  );
}

/* ═══ SLIDE 2 — Schematic Overview ═══ */
function Slide2() {
  return (
    <SlideLayout title="AI Architecture — Schematic Overview" subtitle="Which AI sits where in the planning process" slideNum={2}>
      <div className="relative w-full" style={{ height: 720 }}>
        {/* Center: Solver */}
        <div className="absolute" style={{ left: "50%", top: "46%", transform: "translate(-50%, -50%)" }}>
          <div className="w-[260px] h-[260px] rounded-full flex flex-col items-center justify-center shadow-2xl" style={{ background: `linear-gradient(135deg, ${P}, ${P_DARK})` }}>
            <span className="text-white text-[46px] font-bold">Solver</span>
            <span className="text-white/70 text-[14px] mt-1">Optimization Engine</span>
          </div>
          <div className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-full border-2 border-dashed" style={{ borderColor: `${P}40` }} />
        </div>

        {/* Solver techniques around center */}
        {[
          { label: "SA", full: "Simulated Annealing", x: "50%", y: "5%", mx: -55 },
          { label: "LNS", full: "Large Neighborhood Search", x: "68%", y: "18%", mx: 10 },
          { label: "LAHC", full: "Late Acceptance HC", x: "68%", y: "70%", mx: 10 },
          { label: "GRASP", full: "GRASP + Tabu", x: "50%", y: "82%", mx: -55 },
          { label: "CP", full: "Constraint Propagation", x: "32%", y: "70%", mx: -230 },
          { label: "ICS", full: "Incremental Scoring", x: "32%", y: "18%", mx: -220 },
        ].map((t, i) => (
          <div key={i} className="absolute flex items-center gap-2" style={{ left: t.x, top: t.y, marginLeft: t.mx }}>
            <div className="w-[88px] h-[46px] rounded-lg flex items-center justify-center shadow-md text-white text-[14px] font-bold" style={{ background: i < 4 ? CLASSIC : DOMAIN }}>
              {t.label}
            </div>
            <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: "#64748B" }}>{t.full}</span>
          </div>
        ))}

        {/* LEFT: Pre-process */}
        <div className="absolute flex flex-col gap-4" style={{ left: 40, top: "28%", transform: "translateY(-20%)" }}>
          <div className="text-[12px] font-bold tracking-widest" style={{ color: MODERN }}>PRE-PROCESS</div>
          {[
            { name: "AI Briefing", desc: "NLP → Constraints", sub: "LLM-based" },
            { name: "TFT Forecaster", desc: "Demand Prediction", sub: "Deep Learning" },
            { name: "ML Warm Start", desc: "Smart initial roster", sub: "Supervised ML" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-[170px] rounded-lg p-3 shadow-md border-l-4" style={{ background: "#F5F3FF", borderColor: i === 2 ? AMBER : MODERN }}>
                <p className="text-[14px] font-bold" style={{ color: "#0F172A" }}>{item.name}</p>
                <p className="text-[11px]" style={{ color: "#64748B" }}>{item.desc}</p>
                <p className="text-[10px] font-semibold mt-1" style={{ color: i === 2 ? AMBER : MODERN }}>{item.sub}</p>
              </div>
              <svg width="60" height="20" viewBox="0 0 60 20"><defs><marker id={`al${i}`} markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill={i === 2 ? AMBER : MODERN} /></marker></defs><line x1="0" y1="10" x2="50" y2="10" stroke={i === 2 ? AMBER : MODERN} strokeWidth="2" strokeDasharray="5 3" markerEnd={`url(#al${i})`} /></svg>
            </div>
          ))}
        </div>

        {/* RIGHT: Post-process */}
        <div className="absolute flex flex-col gap-4" style={{ right: 40, top: "28%", transform: "translateY(-20%)" }}>
          <div className="text-[12px] font-bold tracking-widest text-right" style={{ color: MODERN }}>POST-PROCESS</div>
          {[
            { name: "AI Assistant", desc: "Alternatives & explanations" },
            { name: "Explain AI", desc: "Per-assignment reasoning" },
            { name: "Correction Learner", desc: "Learns from planner edits" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <svg width="60" height="20" viewBox="0 0 60 20"><defs><marker id={`ar${i}`} markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto"><polygon points="0 0,7 2.5,0 5" fill={MODERN} /></marker></defs><line x1="0" y1="10" x2="50" y2="10" stroke={MODERN} strokeWidth="2" strokeDasharray="5 3" markerEnd={`url(#ar${i})`} /></svg>
              <div className="w-[170px] rounded-lg p-3 shadow-md border-r-4" style={{ background: "#F5F3FF", borderColor: MODERN }}>
                <p className="text-[14px] font-bold" style={{ color: "#0F172A" }}>{item.name}</p>
                <p className="text-[11px]" style={{ color: "#64748B" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* BOTTOM: Background */}
        <div className="absolute flex items-center gap-4" style={{ left: "50%", bottom: 20, transform: "translateX(-50%)" }}>
          <div className="rounded-lg p-3 shadow-md border-b-4 text-center" style={{ background: "#FFFBEB", borderColor: AMBER, width: 260 }}>
            <p className="text-[11px] font-bold tracking-wider" style={{ color: AMBER }}>BACKGROUND</p>
            <p className="text-[15px] font-bold" style={{ color: "#0F172A" }}>Bayesian Weight Optimizer</p>
            <p className="text-[11px]" style={{ color: "#64748B" }}>Auto-tunes constraint weights</p>
          </div>
          <div className="rounded-lg p-3 shadow-md border-b-4 text-center" style={{ background: "#FEF2F2", borderColor: "#EF4444", width: 220 }}>
            <p className="text-[11px] font-bold tracking-wider" style={{ color: "#EF4444" }}>MONITORING</p>
            <p className="text-[15px] font-bold" style={{ color: "#0F172A" }}>Anomaly Detection</p>
            <p className="text-[11px]" style={{ color: "#64748B" }}>Flags unusual patterns</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* ═══ SLIDE 3 — Modern AI ═══ */
function Slide3() {
  const cards = [
    {
      name: "NLP Briefing Parser",
      desc: "A Large Language Model translates natural language instructions from planners into solver constraints.",
      detail: "E.g. \"Jan can't do night shifts\" → hard constraint on shift type N for employee_id 42. Supports 8 languages.",
      phase: "Pre-process",
      col: MODERN,
    },
    {
      name: "AI Assistant (Post-Solve)",
      desc: "When disruptions occur (illness, absence), the AI generates multiple alternatives with explanations per candidate.",
      detail: "Combines constraint relaxation with LLM-generated explanations. Shows impact, compliance status and score per alternative.",
      phase: "Post-process",
      col: MODERN,
    },
    {
      name: "TFT Demand Forecaster",
      desc: "Temporal Fusion Transformer predicts staffing needs per location, shift and time slot using deep learning.",
      detail: "Input: historical occupancy, seasonal patterns, events. Output: predicted FTE demand per hour. Results in 15-20% better fill rate.",
      phase: "Pre-process",
      col: MODERN,
    },
    {
      name: "Planner Correction Learner",
      desc: "Supervised learning model that learns from manual adjustments made by planners after solving.",
      detail: "Analyzes correction patterns (e.g. planner always swaps X and Y on Fridays). Adjusts weights so the solver does this automatically in future runs.",
      phase: "Background",
      col: AMBER,
    },
  ];

  return (
    <SlideLayout title="Modern AI — Deep Learning & LLMs" subtitle="State-of-the-art techniques for natural interaction and intelligent predictions" slideNum={3}>
      <div className="flex items-start gap-2 px-[80px] mt-1">
        <span className="px-4 py-1.5 rounded-full text-[13px] font-bold text-white" style={{ background: MODERN }}>🧠 Modern AI</span>
      </div>
      <div className="grid grid-cols-2 gap-5 px-[80px] mt-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100">
            <div className="h-[5px]" style={{ background: c.col }} />
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[18px] font-bold" style={{ color: "#0F172A" }}>{c.name}</h3>
                <span className="text-[11px] font-semibold px-3 py-0.5 rounded-full text-white" style={{ background: c.col }}>{c.phase}</span>
              </div>
              <p className="text-[14px] leading-[20px] mb-2" style={{ color: "#334155" }}>{c.desc}</p>
              <p className="text-[13px] leading-[18px]" style={{ color: "#64748B" }}>{c.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* ═══ SLIDE 4 — Classical AI: Metaheuristics ═══ */
function Slide4() {
  const cards = [
    {
      name: "Simulated Annealing (SA)",
      desc: "Temporarily accepts worse moves to escape local optima and find a better global solution.",
      detail: "Temperature decreases stepwise; prevents getting stuck. Core algorithm of the solver engine.",
    },
    {
      name: "Large Neighborhood Search (LNS)",
      desc: "Destroys and rebuilds large parts of the roster to break through local optima.",
      detail: "Destroy/repair cycle on 20-40% of assignments with direct constraint checking.",
    },
    {
      name: "Late Acceptance Hill Climbing (LAHC)",
      desc: "Compares against historical scores instead of only the current best solution.",
      detail: "Buffer-based acceptance provides strong diversification alongside LNS.",
    },
    {
      name: "GRASP + Tabu Hybrid",
      desc: "Randomized construction followed by memory-guided local search.",
      detail: "Diverse starting solutions, then Tabu refinement without cyclical behavior.",
    },
  ];

  return (
    <SlideLayout title="Classical AI — Metaheuristics & Optimization" subtitle="Proven search techniques that find the optimal roster" slideNum={4}>
      <div className="flex items-start gap-2 px-[80px] mt-1">
        <span className="px-4 py-1.5 rounded-full text-[13px] font-bold text-white" style={{ background: CLASSIC }}>⚙️ Classical AI</span>
      </div>
      <div className="grid grid-cols-2 gap-5 px-[80px] mt-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100">
            <div className="h-[5px]" style={{ background: CLASSIC }} />
            <div className="p-5">
              <h3 className="text-[18px] font-bold mb-2" style={{ color: "#0F172A" }}>{c.name}</h3>
              <p className="text-[14px] leading-[20px] mb-2" style={{ color: "#334155" }}>{c.desc}</p>
              <p className="text-[13px] leading-[18px]" style={{ color: "#64748B" }}>{c.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* ═══ SLIDE 5 — ML Warm Start & Classical ML ═══ */
function Slide5() {
  return (
    <SlideLayout title="ML Warm Start & Learning" subtitle="Machine Learning provides the solver with an intelligent starting point" slideNum={5}>
      <div className="flex gap-8 px-[80px] mt-4">
        {/* Left: Warm Start */}
        <div className="flex-1">
          <div className="rounded-2xl bg-white shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: GREEN }}>
                <span className="text-white text-[22px]">⚡</span>
              </div>
              <div>
                <h3 className="text-[20px] font-bold" style={{ color: "#0F172A" }}>ML Warm-Start Generator</h3>
                <p className="text-[13px]" style={{ color: "#64748B" }}>Supervised Learning on historical data</p>
              </div>
            </div>
            <p className="text-[14px] leading-[22px] mb-4" style={{ color: "#334155" }}>
              The ML model analyzes historical roster data and learns patterns: which employee is typically assigned to which shift on which day.
            </p>
            <p className="text-[14px] leading-[22px] mb-4" style={{ color: "#334155" }}>
              For each combination (employee × day × shift), the model predicts the assignment probability. This generates a quality <strong>starting roster</strong>.
            </p>
            <div className="rounded-xl p-4" style={{ background: "#F0FDF4", border: `2px solid ${GREEN}33` }}>
              <p className="text-[17px] font-bold mb-1" style={{ color: GREEN }}>40-60% faster convergence</p>
              <p className="text-[13px]" style={{ color: "#334155" }}>
                The solver starts from this point instead of an empty roster — finding the optimal solution much faster.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Other ML techniques */}
        <div className="w-[620px] flex flex-col gap-4">
          {[
            { icon: "🎯", title: "Bayesian Weight Optimizer", desc: "Automatically adjusts constraint weights based on planner behavior. Uses Bayesian optimization to find the balance between soft constraints that best matches how planners would plan manually.", col: AMBER, bg: "#FFFBEB" },
            { icon: "🔍", title: "Anomaly Detection", desc: "Flags unusual patterns in rosters and occupancy data. Detects unusual overtime patterns, structural understaffing on specific shifts, or employees consistently disadvantaged.", col: "#EF4444", bg: "#FEF2F2" },
            { icon: "📊", title: "Incremental Constraint Scoring", desc: "Recalculates only the delta of a change (O(1)). Enables >100,000 evaluations/sec for fast iterative optimization.", col: DOMAIN, bg: "#F1F5F9" },
            { icon: "⚖️", title: "ATW Compliance Engine", desc: "Working Time Act fully implemented as hard constraints. Real-time validation of hours, rest, night shifts, breaks and on-call rules.", col: P, bg: "#EFF6FF" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 shadow-md" style={{ background: s.bg, borderLeft: `4px solid ${s.col}` }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[16px]">{s.icon}</span>
                <p className="text-[15px] font-bold" style={{ color: "#0F172A" }}>{s.title}</p>
              </div>
              <p className="text-[12px] leading-[17px]" style={{ color: "#64748B" }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

/* ═══ SLIDE 6 — Domain Logic ═══ */
function Slide6() {
  const cards = [
    {
      name: "Constraint Propagation",
      desc: "Filters impossible assignments before the search phase even begins.",
      detail: "Shrinks the search space based on availability, qualifications, and rest rules. Dramatically reduces computation time.",
    },
    {
      name: "Incremental Constraint Scoring",
      desc: "Recalculates only the delta of a change — O(1) per move evaluation.",
      detail: "Enables >100,000 evaluations/sec for fast iterative optimization. Critical for SA and LNS performance.",
    },
    {
      name: "ATW Compliance Engine",
      desc: "The Working Time Act (Arbeidstijdenwet) is fully implemented as hard constraints.",
      detail: "Real-time validation of hours, rest periods, night shifts, break rules and on-call regulations. 100% compliance guaranteed.",
    },
  ];

  return (
    <SlideLayout title="Domain Logic — Constraints & Compliance" subtitle="Deterministic engines that validate and score every roster" slideNum={6}>
      <div className="flex items-start gap-2 px-[80px] mt-1">
        <span className="px-4 py-1.5 rounded-full text-[13px] font-bold text-white" style={{ background: DOMAIN }}>📐 Domain Logic</span>
      </div>
      <div className="flex flex-col gap-5 px-[80px] mt-4">
        {cards.map((c, i) => (
          <div key={i} className="rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-100">
            <div className="h-[5px]" style={{ background: DOMAIN }} />
            <div className="p-6 flex gap-6">
              <div className="w-[56px] h-[56px] rounded-xl flex items-center justify-center shrink-0" style={{ background: `${DOMAIN}15` }}>
                <span className="text-[24px]">{["🔗", "⚡", "⚖️"][i]}</span>
              </div>
              <div>
                <h3 className="text-[20px] font-bold mb-2" style={{ color: "#0F172A" }}>{c.name}</h3>
                <p className="text-[15px] leading-[22px] mb-1" style={{ color: "#334155" }}>{c.desc}</p>
                <p className="text-[14px] leading-[20px]" style={{ color: "#64748B" }}>{c.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* ═══ All slides ═══ */
const SLIDES = [Slide1, Slide2, Slide3, Slide4, Slide5, Slide6];

export default function AiSlides() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setCurrent(c => Math.min(c + 1, TOTAL_SLIDES - 1)), []);
  const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) containerRef.current?.requestFullscreen();
    else document.exitFullscreen();
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
      if (e.key === "F5") { e.preventDefault(); toggleFullscreen(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, isFullscreen, toggleFullscreen]);

  const CurrentSlide = SLIDES[current];

  return (
    <div ref={containerRef} className="flex flex-col bg-black h-screen">
      {!isFullscreen && (
        <div className="flex items-center justify-between h-14 px-4 bg-background border-b shrink-0">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
          <span className="text-sm text-muted-foreground">{current + 1} / {TOTAL_SLIDES}</span>
          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex-1 flex items-center justify-center relative">
        <div className={cn("w-full", isFullscreen ? "h-full" : "h-full max-w-[1400px]")}>
          <ScaledSlide><CurrentSlide /></ScaledSlide>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-full px-4 py-2">
          <button onClick={prev} disabled={current === 0} className="text-white/80 hover:text-white disabled:opacity-30 p-1"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={cn("w-2.5 h-2.5 rounded-full transition-all", i === current ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60")} />
            ))}
          </div>
          <button onClick={next} disabled={current === TOTAL_SLIDES - 1} className="text-white/80 hover:text-white disabled:opacity-30 p-1"><ArrowRight className="w-5 h-5" /></button>
        </div>
      </div>

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
