import { useEffect, useRef } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import robotImg from "@/assets/robot-assistant.png";

/* ═══ Helpers ═══ */

async function imgToBase64(src: string): Promise<string> {
  const res = await fetch(src);
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(blob);
  });
}

/* ══════════════════════════════════════════
   PPTX GENERATOR — Solver-app aesthetic
   ══════════════════════════════════════════ */

async function downloadPptx() {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.author = "Planbition";
  prs.title = "Planbition X — AI-gedreven roosterplanning";

  // ── Design tokens (app palette) ──
  const P = "2563EB";
  const P_DARK = "1E40AF";
  const P_LIGHT = "DBEAFE";
  const ACC = "E8842C";
  const ACC_LIGHT = "FEF3C7";
  const BG = "F8FAFC";
  const CARD = "FFFFFF";
  const FG = "0F172A";
  const FG2 = "334155";
  const MUT = "64748B";
  const BRD = "E2E8F0";
  const S_E = "10B981";
  const S_D = "F59E0B";
  const S_L = "3B82F6";
  const S_N = "8B5CF6";
  const MODERN_AI = "7C3AED";   // purple for modern AI
  const CLASSIC_AI = "0891B2";  // teal for classical AI
  const NO_AI = "475569";       // slate for non-AI
  const TOTAL = 6;

  let robotB64 = "";
  try { robotB64 = await imgToBase64(robotImg); } catch { /* */ }

  // No logo image — use text instead to avoid stretching

  // ── Shared helpers ──
  const addTopBar = (sl: any) => {
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.05, fill: { color: P } });
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0.05, w: 13.33, h: 0.02, fill: { color: ACC } });
  };

  const addFooter = (sl: any, num: number) => {
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.0, w: 13.33, h: 0.5, fill: { color: CARD } });
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.0, w: 13.33, h: 0.01, fill: { color: BRD } });
    [S_E, S_D, S_L, S_N].forEach((c, i) => {
      sl.addShape(prs.ShapeType.ellipse, { x: 0.5 + i * 0.28, y: 7.17, w: 0.13, h: 0.13, fill: { color: c } });
    });
    sl.addText("Planbition X", { x: 1.7, y: 7.08, w: 2, h: 0.3, fontSize: 8, bold: true, color: FG, fontFace: "Arial" });
    sl.addText(`${num} / ${TOTAL}`, { x: 11, y: 7.1, w: 1.8, h: 0.25, fontSize: 8, color: MUT, fontFace: "Arial", align: "right" });
  };

  const addRobot = (sl: any, x: number, y: number, w: number) => {
    if (!robotB64) return;
    sl.addImage({ data: `image/png;base64,${robotB64}`, x, y, w, h: w, sizing: { type: "contain" as const, w, h: w } });
  };

  const addHeading = (sl: any, title: string, sub?: string) => {
    sl.addText(title, { x: 0.7, y: 0.45, w: 10, h: 0.6, fontSize: 26, bold: true, color: FG, fontFace: "Arial" });
    sl.addShape(prs.ShapeType.rect, { x: 0.7, y: 1.0, w: 1.0, h: 0.04, fill: { color: P } });
    if (sub) sl.addText(sub, { x: 0.7, y: 1.15, w: 10, h: 0.35, fontSize: 11, color: MUT, fontFace: "Arial" });
  };

  const pill = (sl: any, x: number, y: number, w: number, text: string, bg: string, fg: string) => {
    sl.addShape(prs.ShapeType.roundRect, { x, y, w, h: 0.28, rectRadius: 0.14, fill: { color: bg } });
    sl.addText(text, { x, y, w, h: 0.28, fontSize: 8, bold: true, color: fg, fontFace: "Arial", align: "center" });
  };

  // ═══════════════════════════════════════
  // SLIDE 1 — TITLE
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    // Landing page hero style: full blue background with gradient feel
    sl.background = { color: P };

    // Orange accent at top (like landing page)
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.05, fill: { color: ACC } });

    // Subtle lighter area bottom-right for depth
    sl.addShape(prs.ShapeType.ellipse, { x: 8, y: 4, w: 6, h: 4, fill: { color: P_DARK } });

    // "PLANBITION" text brand (no logo image)
    sl.addText("PLANBITION", { x: 1.0, y: 0.7, w: 6, h: 0.5, fontSize: 14, bold: true, color: "FFFFFF", fontFace: "Arial", charSpacing: 8 });

    // Giant X
    sl.addText("X", { x: 0.6, y: 1.2, w: 4.5, h: 3.5, fontSize: 200, bold: true, color: "FFFFFF", fontFace: "Arial" });

    // Subtitle — white on blue like landing hero
    sl.addText("AI-gedreven\nroosterplanning", {
      x: 4.2, y: 1.6, w: 4.5, h: 1.6, fontSize: 34, bold: true, color: "FFFFFF", fontFace: "Arial", lineSpacing: 46,
    });

    sl.addText("De volgende generatie workforce scheduling", {
      x: 4.2, y: 3.3, w: 4.5, h: 0.4, fontSize: 13, color: "FFFFFF", fontFace: "Arial",
    });

    // Shift badges
    [
      { l: "Vroeg", c: S_E }, { l: "Dag", c: S_D },
      { l: "Laat", c: S_L }, { l: "Nacht", c: S_N },
    ].forEach((b, i) => {
      pill(sl, 4.2 + i * 1.35, 4.0, 1.2, b.l, b.c, "FFFFFF");
    });

    // Tagline pills
    sl.addText("Solver  ·  AI  ·  Compliance  ·  Microservice", {
      x: 1.0, y: 5.0, w: 7, h: 0.35, fontSize: 11, bold: true, color: "FFFFFF", fontFace: "Arial",
    });

    // KPI row
    const kpis = [
      { v: "<1 min", l: "Oplostijd", c: "FFFFFF" },
      { v: "100%", l: "ATW-compliant", c: "FFFFFF" },
      { v: "73%", l: "Minder handwerk", c: "FFFFFF" },
    ];
    kpis.forEach((k, i) => {
      const kx = 1.0 + i * 2.4;
      sl.addText(k.v, { x: kx, y: 5.6, w: 2.0, h: 0.55, fontSize: 24, bold: true, color: "FFFFFF", fontFace: "Arial" });
      sl.addText(k.l, { x: kx, y: 6.1, w: 2.0, h: 0.3, fontSize: 9, color: "FFFFFF", fontFace: "Arial" });
    });

    // Footer
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.05, w: 13.33, h: 0.45, fill: { color: P_DARK } });
    sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
      x: 1, y: 7.1, w: 11.33, h: 0.3, fontSize: 9, color: "FFFFFF", fontFace: "Arial", align: "center",
    });

    // Robot — RIGHT SIDE, in front of everything, large and prominent
    addRobot(sl, 9.0, 0.8, 4.0);
  }

  // ═══════════════════════════════════════
  // SLIDE 2 — HOW IT WORKS (3-step flow)
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    sl.background = { color: BG };
    addTopBar(sl);
    addFooter(sl, 2);
    addHeading(sl, "Hoe werkt Planbition X?", "Van briefing tot optimaal rooster in drie stappen");

    const steps = [
      { num: "1", title: "Briefing", desc: "Beschrijf voorkeuren in\nnatuurlijke taal — de AI\nvertaalt dit naar constraints", col: S_E, tag: "AI Chat", tagC: MODERN_AI },
      { num: "2", title: "AI Solver", desc: "Optimaliseert het rooster met\nkwalificaties, contracturen\nen ATW-regels", col: P, tag: "Optimalisatie", tagC: CLASSIC_AI },
      { num: "3", title: "Wijzigen", desc: "Bij verstoringen vindt de AI\ndirect alternatieven —\nin seconden opgelost", col: ACC, tag: "AI + Solver", tagC: MODERN_AI },
    ];

    steps.forEach((step, i) => {
      const cx = 0.6 + i * 4.0;
      // Card
      sl.addShape(prs.ShapeType.roundRect, {
        x: cx, y: 1.8, w: 3.6, h: 4.5, rectRadius: 0.15,
        fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 2 },
      });
      sl.addShape(prs.ShapeType.rect, { x: cx, y: 1.8, w: 3.6, h: 0.06, fill: { color: step.col } });

      // Number
      sl.addShape(prs.ShapeType.ellipse, { x: cx + 1.3, y: 2.3, w: 1.0, h: 1.0, fill: { color: step.col } });
      sl.addText(step.num, { x: cx + 1.3, y: 2.3, w: 1.0, h: 1.0, fontSize: 30, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center" });

      // Title
      sl.addText(step.title, { x: cx + 0.3, y: 3.5, w: 3.0, h: 0.5, fontSize: 18, bold: true, color: FG, fontFace: "Arial", align: "center" });

      // Desc
      sl.addText(step.desc, { x: cx + 0.3, y: 4.1, w: 3.0, h: 1.4, fontSize: 11, color: MUT, fontFace: "Arial", align: "center", lineSpacing: 17 });

      // Tech tag
      pill(sl, cx + 1.0, 5.7, 1.6, step.tag, step.tagC, "FFFFFF");

      // Arrow between cards
      if (i < 2) {
        sl.addText("→", { x: cx + 3.6, y: 3.5, w: 0.4, h: 0.5, fontSize: 24, bold: true, color: P, fontFace: "Arial", align: "center" });
      }
    });

    // Robot in bottom-right, AFTER all cards so it's in front
    addRobot(sl, 11.5, 4.6, 1.5);
  }

  // ═══════════════════════════════════════
  // SLIDE 3 — RESULTATEN (KPI cards)
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    sl.background = { color: BG };
    addTopBar(sl);
    addFooter(sl, 3);
    addHeading(sl, "Meetbare resultaten", "Vanaf dag één impact op uw planningsproces");

    const stats = [
      { val: "<1 min", label: "Oplostijd\nper rooster", col: P, icon: "⚡" },
      { val: "100%", label: "ATW-\ncompliant", col: S_E, icon: "✓" },
      { val: "73%", label: "Minder\nhandwerk", col: ACC, icon: "↓" },
      { val: "€5k+", label: "Besparing\nper jaar", col: S_N, icon: "€" },
    ];

    const cW = 2.7;
    const gap = 0.35;
    const totalW = stats.length * cW + (stats.length - 1) * gap;
    const startX = (13.33 - totalW) / 2;

    stats.forEach((st, i) => {
      const x = startX + i * (cW + gap);

      // Card
      sl.addShape(prs.ShapeType.roundRect, {
        x, y: 2.0, w: cW, h: 4.2, rectRadius: 0.18,
        fill: { color: CARD }, shadow: { type: "outer", blur: 10, opacity: 0.1, offset: 3 },
      });
      sl.addShape(prs.ShapeType.rect, { x, y: 2.0, w: cW, h: 0.06, fill: { color: st.col } });

      // Icon circle
      sl.addShape(prs.ShapeType.ellipse, { x: x + 0.85, y: 2.5, w: 1.0, h: 1.0, fill: { color: st.col } });
      sl.addText(st.icon, { x: x + 0.85, y: 2.5, w: 1.0, h: 1.0, fontSize: 28, color: "FFFFFF", fontFace: "Arial", align: "center" });

      // Value
      sl.addText(st.val, { x, y: 3.8, w: cW, h: 0.9, fontSize: 36, bold: true, color: st.col, fontFace: "Arial", align: "center" });

      // Label
      sl.addText(st.label, { x, y: 4.8, w: cW, h: 0.8, fontSize: 11, color: MUT, fontFace: "Arial", align: "center", lineSpacing: 16 });
    });

    // Robot in front
    addRobot(sl, 11.2, 5.0, 1.3);
  }

  // ═══════════════════════════════════════
  // SLIDE 4 — AI & OPTIMALISATIE (categorized!)
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    sl.background = { color: BG };
    addTopBar(sl);
    addFooter(sl, 4);
    addHeading(sl, "AI & Optimalisatie-technieken");

    // Legend
    pill(sl, 0.7, 1.25, 1.8, "🧠  Moderne AI", MODERN_AI, "FFFFFF");
    pill(sl, 2.7, 1.25, 2.0, "⚙️  Klassieke AI", CLASSIC_AI, "FFFFFF");
    pill(sl, 4.9, 1.25, 2.2, "🔧  Geen AI (solver)", NO_AI, "FFFFFF");

    const techniques = [
      { name: "TFT Demand Forecaster", desc: "Deep Learning voorspelt personeelsbehoefte op basis van historische patronen", cat: "modern" as const },
      { name: "NLP Briefing Parser", desc: "LLM vertaalt natuurlijke taal naar solver-constraints", cat: "modern" as const },
      { name: "Planner-Correctie Learner", desc: "ML leert van handmatige wijzigingen om toekomstige roosters te verbeteren", cat: "modern" as const },
      { name: "Bayesian Weight Optimizer", desc: "Past constraint-gewichten automatisch aan op plannergedrag", cat: "classic" as const },
      { name: "ML Warm-Start", desc: "Genereert kwalitatief startrooster via patroonherkenning", cat: "classic" as const },
      { name: "Large Neighborhood Search", desc: "Herstructureert grote delen van het rooster tegelijk voor betere oplossingen", cat: "noai" as const },
      { name: "GRASP + Tabu Hybride", desc: "Greedy constructie met geheugen-gestuurde lokale zoekmethoden", cat: "noai" as const },
      { name: "Incremental Scoring", desc: "Berekent alleen deltas — milliseconde-evaluaties per toewijzing", cat: "noai" as const },
    ];

    const catColor = { modern: MODERN_AI, classic: CLASSIC_AI, noai: NO_AI };
    const catLabel = { modern: "Moderne AI", classic: "Klassieke AI", noai: "Solver" };

    techniques.forEach((t, i) => {
      const y = 1.75 + i * 0.65;
      const col = catColor[t.cat];

      // Row
      sl.addShape(prs.ShapeType.roundRect, {
        x: 0.5, y, w: 11.5, h: 0.55, rectRadius: 0.06,
        fill: { color: i % 2 === 0 ? CARD : BG },
        shadow: i % 2 === 0 ? { type: "outer", blur: 2, opacity: 0.04, offset: 1 } : undefined,
      });
      // Left accent
      sl.addShape(prs.ShapeType.roundRect, { x: 0.5, y, w: 0.06, h: 0.55, rectRadius: 0, fill: { color: col } });

      // Category dot
      sl.addShape(prs.ShapeType.ellipse, { x: 0.75, y: y + 0.15, w: 0.25, h: 0.25, fill: { color: col } });

      // Name
      sl.addText(t.name, { x: 1.15, y, w: 3.0, h: 0.55, fontSize: 11, bold: true, color: FG, fontFace: "Arial", valign: "middle" });

      // Desc
      sl.addText(t.desc, { x: 4.3, y, w: 5.8, h: 0.55, fontSize: 10, color: FG2, fontFace: "Arial", valign: "middle" });

      // Cat label
      pill(sl, 10.3, y + 0.13, 1.5, catLabel[t.cat], col, "FFFFFF");
    });

    // Robot in front, bottom right
    addRobot(sl, 11.4, 5.2, 1.2);
  }

  // ═══════════════════════════════════════
  // SLIDE 5 — ARCHITECTUUR & INTEGRATIE
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    sl.background = { color: BG };
    addTopBar(sl);
    addFooter(sl, 5);
    addHeading(sl, "Architectuur & Integratie");

    const colW = 5.6;

    // Left: Performance
    sl.addShape(prs.ShapeType.roundRect, {
      x: 0.5, y: 1.7, w: colW, h: 4.8, rectRadius: 0.15,
      fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 2 },
    });
    sl.addShape(prs.ShapeType.rect, { x: 0.5, y: 1.7, w: colW, h: 0.06, fill: { color: P } });
    sl.addText("Performance & Compliance", { x: 0.9, y: 1.95, w: colW - 0.8, h: 0.45, fontSize: 16, bold: true, color: P, fontFace: "Arial" });

    const leftPoints = [
      "Incremental scoring — alleen deltas herberekenen",
      "Multi-threaded parallelle neighborhood search",
      "Volledige ATW-regelset als harde constraints",
      "Elke toewijzing krijgt score (0-100) + uitleg",
      "< 1 minuut voor een compleet rooster",
    ];
    leftPoints.forEach((p, i) => {
      sl.addShape(prs.ShapeType.ellipse, { x: 1.0, y: 2.65 + i * 0.72, w: 0.12, h: 0.12, fill: { color: P } });
      sl.addText(p, { x: 1.25, y: 2.5 + i * 0.72, w: colW - 1.1, h: 0.55, fontSize: 11, color: FG2, fontFace: "Arial", valign: "middle" });
    });

    // Right: Microservice
    const rX = 6.5;
    sl.addShape(prs.ShapeType.roundRect, {
      x: rX, y: 1.7, w: colW, h: 4.8, rectRadius: 0.15,
      fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 2 },
    });
    sl.addShape(prs.ShapeType.rect, { x: rX, y: 1.7, w: colW, h: 0.06, fill: { color: ACC } });
    sl.addText("Microservice & API", { x: rX + 0.4, y: 1.95, w: colW - 0.8, h: 0.45, fontSize: 16, bold: true, color: ACC, fontFace: "Arial" });

    const rightPoints = [
      "REST API — JSON in, optimaal rooster terug",
      "White-label ready, multi-tenant architectuur",
      "Webhook callbacks bij async oplossen",
      "Draait in elk WFM/ERP landschap",
      "SSO en rolgebaseerde toegangscontrole",
    ];
    rightPoints.forEach((p, i) => {
      sl.addShape(prs.ShapeType.ellipse, { x: rX + 0.5, y: 2.65 + i * 0.72, w: 0.12, h: 0.12, fill: { color: ACC } });
      sl.addText(p, { x: rX + 0.75, y: 2.5 + i * 0.72, w: colW - 1.1, h: 0.55, fontSize: 11, color: FG2, fontFace: "Arial", valign: "middle" });
    });

    // Robot between the two columns at bottom — always in front
    addRobot(sl, 5.4, 5.3, 1.3);
  }

  // ═══════════════════════════════════════
  // SLIDE 6 — CLOSING
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    sl.background = { color: CARD };

    // Top bars
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: P } });
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0.06, w: 13.33, h: 0.03, fill: { color: ACC } });

    // Centered blue panel
    sl.addShape(prs.ShapeType.roundRect, {
      x: 1.5, y: 1.0, w: 10.33, h: 5.5, rectRadius: 0.25,
      fill: { color: P }, shadow: { type: "outer", blur: 20, opacity: 0.15, offset: 5 },
    });

    // Title
    sl.addText("Klaar voor de\nvolgende stap?", {
      x: 2, y: 2.0, w: 5.5, h: 1.6, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Arial", lineSpacing: 48,
    });

    sl.addText("Vraag een demo aan of test de API.\nWij laten u graag zien wat Planbition X kan.", {
      x: 2, y: 3.7, w: 5.5, h: 0.9, fontSize: 14, color: "FFFFFF", fontFace: "Arial", lineSpacing: 22,
    });

    // CTA
    sl.addShape(prs.ShapeType.roundRect, { x: 2, y: 4.8, w: 3.8, h: 0.6, rectRadius: 0.3, fill: { color: ACC } });
    sl.addText("Vraag een demo aan →", { x: 2, y: 4.8, w: 3.8, h: 0.6, fontSize: 14, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center" });

    // Contact details
    sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
      x: 2, y: 5.6, w: 5.5, h: 0.35, fontSize: 10, color: "FFFFFF", fontFace: "Arial",
    });

    // Robot — right side of the blue panel, large and in front
    addRobot(sl, 8.5, 1.5, 3.5);

    // Footer
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.1, w: 13.33, h: 0.4, fill: { color: CARD } });
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.1, w: 13.33, h: 0.01, fill: { color: BRD } });
    sl.addText("Planbition X", { x: 5, y: 7.12, w: 3.33, h: 0.3, fontSize: 9, bold: true, color: MUT, fontFace: "Arial", align: "center" });
  }

  prs.writeFile({ fileName: "PlanbitionX_Presentatie.pptx" });
}

/* ══════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════ */

export default function Presentation() {
  const navigate = useNavigate();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!hasTriggered.current) {
      hasTriggered.current = true;
      downloadPptx();
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <img src={robotImg} alt="Planbition X" className="w-24 h-24 object-contain mx-auto robot-float" />
        <h1 className="text-2xl font-bold">Planbition X Presentatie</h1>
        <p className="text-muted-foreground max-w-md">
          De PowerPoint wordt automatisch gedownload. Klik hieronder als de download niet start.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          <Button onClick={downloadPptx}>
            <Download className="w-4 h-4 mr-2" />
            Download PPTX
          </Button>
        </div>
      </div>
    </div>
  );
}
