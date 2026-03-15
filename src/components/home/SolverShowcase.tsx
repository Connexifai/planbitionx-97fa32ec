import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquare, Sparkles, CheckCircle2, ArrowRight, Bot, User, Loader2 } from "lucide-react";

const PHASE_DURATION = 6500; // ms per phase (longer for phase 2 animation)
const PHASES = 3;

/* Mini roster data */
const rosterRows = [
  { name: "Jan B.", shifts: ["V", "V", "D", "D", "—", "L", "N"] },
  { name: "Marie K.", shifts: ["D", "L", "L", "—", "V", "V", "D"] },
  { name: "Franz X.", shifts: ["N", "N", "—", "V", "D", "D", "L"] },
  { name: "Sarah M.", shifts: ["L", "D", "V", "N", "N", "—", "V"] },
  { name: "Pieter J.", shifts: ["—", "V", "N", "L", "D", "D", "D"] },
];

const days = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

const shiftColor: Record<string, string> = {
  V: "bg-shift-early/40 text-shift-early border border-shift-early/50",
  D: "bg-shift-day/40 text-shift-day border border-shift-day/50",
  L: "bg-shift-late/40 text-shift-late border border-shift-late/50",
  N: "bg-shift-night/40 text-shift-night border border-shift-night/50",
  "—": "bg-muted/30 text-muted-foreground",
};

/* Modified roster after AI swap */
const rosterAfterSwap = rosterRows.map((r, i) => {
  if (i === 2) return { ...r, shifts: ["N", "N", "—", "—", "D", "D", "L"] }; // Franz freed on Thursday
  if (i === 4) return { ...r, shifts: ["—", "V", "N", "L", "V", "D", "D"] }; // Pieter takes Thursday V
  return r;
});

function ShiftBadge({ shift }: { shift: string }) {
  return (
    <div className={`w-7 h-5 rounded text-[9px] font-bold flex items-center justify-center ${shiftColor[shift] || "bg-muted/30"}`}>
      {shift}
    </div>
  );
}

function MiniRoster({ rows, highlight, dimCell, glowCell, rosterRef }: { 
  rows: typeof rosterRows; 
  highlight?: { row: number; col: number; color: string }[];
  dimCell?: { row: number; col: number };
  glowCell?: { row: number; col: number };
  rosterRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="space-y-0.5" ref={rosterRef}>
      {/* Header */}
      <div className="flex items-center gap-0.5 mb-1">
        <div className="w-16 text-[8px] text-muted-foreground font-medium" />
        {days.map((d) => (
          <div key={d} className="w-7 text-center text-[8px] text-muted-foreground font-medium">{d}</div>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div key={r.name} className="flex items-center gap-0.5">
          <div className="w-16 text-[9px] text-foreground font-medium truncate">{r.name}</div>
          {r.shifts.map((s, ci) => {
            const hl = highlight?.find((h) => h.row === ri && h.col === ci);
            const isDimmed = dimCell && dimCell.row === ri && dimCell.col === ci;
            const isGlowing = glowCell && glowCell.row === ri && glowCell.col === ci;
            return (
              <div 
                key={ci} 
                data-cell={`${ri}-${ci}`}
                className={`relative transition-all duration-300 ${hl ? "ring-2 ring-offset-1 rounded" : ""} ${isDimmed ? "opacity-20 scale-90" : ""} ${isGlowing ? "ring-2 ring-primary rounded shadow-[0_0_12px_hsl(var(--primary)/0.5)] scale-110" : ""}`} 
                style={hl ? { "--tw-ring-color": hl.color } as any : undefined}
              >
                <ShiftBadge shift={s} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function TypingText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return <>{displayed}<span className="animate-pulse">|</span></>;
}

export default function SolverShowcase() {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(0);
  const [subStep, setSubStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase((p) => (p + 1) % PHASES);
      setSubStep(0);
    }, PHASE_DURATION);
    return () => clearInterval(timer);
  }, []);

  // Sub-step progression within each phase
  useEffect(() => {
    if (phase === 1) {
      // Phase 1 has 2 sub-steps: solving → result
      const t1 = setTimeout(() => setSubStep(1), 1500);
      return () => clearTimeout(t1);
    }
    if (phase === 2) {
      const t1 = setTimeout(() => setSubStep(1), 1800);
      const t2 = setTimeout(() => setSubStep(2), 3200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [phase]);

  return (
    <div className="relative w-full max-w-md">
      {/* Outer frame */}
      <div className="rounded-2xl bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 p-4 shadow-2xl">
        <div className="rounded-lg bg-background/95 overflow-hidden">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-brand-accent/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-shift-early/50" />
            <span className="text-[10px] text-muted-foreground ml-1.5 font-medium">Planbition X</span>
            <div className="ml-auto flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${phase === i ? "bg-primary scale-125" : "bg-muted-foreground/30"}`}
                />
              ))}
            </div>
          </div>

          {/* Content area - fixed height */}
          <div className="relative h-[280px] overflow-hidden">
            {/* ── Phase 0: AI Briefing ── */}
            <div
              className={`absolute inset-0 p-3 transition-all duration-500 ${
                phase === 0 ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <MessageSquare className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-semibold text-foreground">AI Briefing</span>
              </div>

              {/* Chat messages */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <div className="bg-muted/50 rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[85%]">
                    <p className="text-[10px] text-foreground leading-relaxed">
                      {t("home.showcaseAiGreeting")}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <div className="bg-primary/15 rounded-lg rounded-tr-sm px-2.5 py-1.5 max-w-[85%]">
                    <p className="text-[10px] text-foreground leading-relaxed">
                      <TypingText text={t("home.showcaseUserMsg")} speed={35} />
                    </p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-3 h-3 text-brand-accent" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3 h-3 text-primary" />
                  </div>
                  <div className="bg-muted/50 rounded-lg rounded-tl-sm px-2.5 py-1.5">
                    <p className="text-[10px] text-foreground flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-shift-early" />
                      {t("home.showcaseAiConfirm")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Solve button */}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-center justify-center gap-1.5 bg-primary text-primary-foreground rounded-md py-1.5 text-[10px] font-semibold animate-pulse">
                  <Sparkles className="w-3 h-3" />
                  {t("home.showcaseSolveBtn")}
                </div>
              </div>
            </div>

            {/* ── Phase 1: Solving → Solved Roster ── */}
            <div
              className={`absolute inset-0 p-3 transition-all duration-500 ${
                phase === 1 ? "opacity-100 translate-x-0" : phase > 1 ? "opacity-0 -translate-x-8 pointer-events-none" : "opacity-0 translate-x-8 pointer-events-none"
              }`}
            >
              {subStep === 0 ? (
                /* Solving animation */
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <div className="text-xs font-semibold text-foreground">{t("home.showcaseSolving")}</div>
                  <div className="w-40 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[loading-bar_2s_ease-in-out_infinite]" />
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    {[t("home.showcaseStep1"), t("home.showcaseStep2"), t("home.showcaseStep3")].map((step, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-shift-early" />
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Solved roster */
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-shift-early" />
                      <span className="text-[10px] font-semibold text-foreground">{t("home.showcaseRosterReady")}</span>
                    </div>
                    <span className="text-[9px] text-muted-foreground">0.8s</span>
                  </div>

                  {/* KPI bar */}
                  <div className="flex gap-2 mb-3">
                    {[
                      { label: t("home.showcaseKpiFill"), val: "94%", color: "text-primary" },
                      { label: "ATW", val: "0", color: "text-shift-early" },
                      { label: t("home.showcaseKpiShifts"), val: "35", color: "text-brand-accent" },
                    ].map((k) => (
                      <div key={k.label} className="flex-1 rounded bg-muted/40 p-1.5 text-center">
                        <div className={`text-sm font-bold ${k.color}`}>{k.val}</div>
                        <div className="text-[8px] text-muted-foreground">{k.label}</div>
                      </div>
                    ))}
                  </div>

                  <MiniRoster rows={rosterRows} />
                </div>
              )}
            </div>

            {/* ── Phase 2: Post-solve AI change ── */}
            <div
              className={`absolute inset-0 p-3 transition-all duration-500 ${
                phase === 2 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 pointer-events-none"
              }`}
            >
              {subStep === 0 && (
                /* User asks for a swap */
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">{t("home.showcasePostSolve")}</span>
                  </div>
                  <div className="flex gap-2 justify-end mb-2">
                    <div className="bg-primary/15 rounded-lg rounded-tr-sm px-2.5 py-1.5 max-w-[90%]">
                      <p className="text-[10px] text-foreground leading-relaxed">
                        <TypingText text={t("home.showcaseSwapRequest")} speed={30} />
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-brand-accent" />
                    </div>
                  </div>
                </div>
              )}

              {subStep === 1 && (
                /* AI analyzing */
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold text-foreground">{t("home.showcasePostSolve")}</span>
                  </div>
                  <div className="flex gap-2 justify-end mb-2">
                    <div className="bg-primary/15 rounded-lg rounded-tr-sm px-2.5 py-1.5 max-w-[90%]">
                      <p className="text-[10px] text-foreground">{t("home.showcaseSwapRequest")}</p>
                    </div>
                    <div className="w-5 h-5 rounded-full bg-brand-accent/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-brand-accent" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-muted/50 rounded-lg rounded-tl-sm px-2.5 py-1.5">
                      <p className="text-[10px] text-foreground flex items-center gap-1">
                        <Loader2 className="w-3 h-3 text-primary animate-spin" />
                        {t("home.showcaseAnalyzing")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {subStep === 2 && (
                /* AI resolved with updated roster */
                <div>
                  <div className="flex gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3 h-3 text-primary" />
                    </div>
                    <div className="bg-muted/50 rounded-lg rounded-tl-sm px-2.5 py-1.5 max-w-[90%]">
                      <p className="text-[10px] text-foreground leading-relaxed">
                        <CheckCircle2 className="w-3 h-3 text-shift-early inline mr-0.5 -mt-0.5" />
                        {t("home.showcaseSwapResult")}
                      </p>
                    </div>
                  </div>
                  <MiniRoster
                    rows={rosterAfterSwap}
                    highlight={[
                      { row: 2, col: 3, color: "hsl(152, 60%, 46%)" }, // Franz freed
                      { row: 4, col: 4, color: "hsl(152, 60%, 46%)" }, // Pieter takes over
                    ]}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Phase indicator labels */}
          <div className="flex border-t border-border/50 bg-muted/20">
            {[
              { icon: MessageSquare, label: t("home.showcasePhase1") },
              { icon: Sparkles, label: t("home.showcasePhase2") },
              { icon: ArrowRight, label: t("home.showcasePhase3") },
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => { setPhase(i); setSubStep(0); }}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-[9px] font-medium transition-all cursor-pointer ${
                  phase === i
                    ? "text-primary bg-primary/5 border-t-2 border-primary -mt-px"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <p.icon className="w-3 h-3" />
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
