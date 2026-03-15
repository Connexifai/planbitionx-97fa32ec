import { useEffect, useRef } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import robotImg from "@/assets/robot-assistant.png";

/* ══════════════════════════════════════════
   SLIDE DATA — Compact Planbition X Sales Deck
   ══════════════════════════════════════════ */

interface PptxSlide {
  type: "title" | "kpi-hero" | "flow" | "grid" | "two-col" | "closing";
  title: string;
  subtitle?: string;
  tagline?: string;
  stats?: { val: string; label: string; color?: string }[];
  items?: { name: string; desc: string }[];
  steps?: { num: string; title: string; desc: string }[];
  left?: { heading: string; points: string[] };
  right?: { heading: string; points: string[] };
}

const slides: PptxSlide[] = [
  {
    type: "title",
    title: "Planbition X",
    subtitle: "AI-gedreven roosterplanning\nDe volgende generatie",
    tagline: "Solver  ·  AI  ·  Compliance  ·  Microservice",
  },
  {
    type: "flow",
    title: "Hoe werkt Planbition X?",
    subtitle: "Van briefing tot optimaal rooster in drie stappen",
    steps: [
      { num: "1", title: "Briefing", desc: "Beschrijf voorkeuren in natuurlijke taal — de AI vertaalt dit naar constraints" },
      { num: "2", title: "AI Solver", desc: "Optimaliseert het rooster met kwalificaties, contracturen en ATW-regels" },
      { num: "3", title: "Wijzigen", desc: "Bij verstoringen vindt de AI direct alternatieven — in seconden opgelost" },
    ],
  },
  {
    type: "kpi-hero",
    title: "Meetbare resultaten",
    subtitle: "Vanaf dag één impact",
    stats: [
      { val: "<1 min", label: "Oplostijd" },
      { val: "100%", label: "ATW-compliant" },
      { val: "73%", label: "Minder handwerk" },
      { val: "€5k+", label: "Besparing / jaar" },
    ],
  },
  {
    type: "grid",
    title: "AI & Optimalisatie",
    subtitle: "Moderne en klassieke technieken gecombineerd",
    items: [
      { name: "TFT Demand Forecaster", desc: "Deep Learning voor personeelsvraag op basis van historische patronen" },
      { name: "Large Neighborhood Search", desc: "Herstructureert grote delen van het rooster tegelijk voor betere oplossingen" },
      { name: "Bayesian Weight Optimizer", desc: "Stemt constraint-gewichten automatisch af op plannergedrag" },
      { name: "ML Warm-Start", desc: "Genereert kwalitatief startrooster voor snellere optimalisatie" },
      { name: "Planner-Correctie Learner", desc: "Leert van handmatige wijzigingen om toekomstige roosters te verbeteren" },
      { name: "GRASP + Tabu Hybride", desc: "Combineert greedy constructie met geheugen-gestuurde lokale zoekmethoden" },
    ],
  },
  {
    type: "two-col",
    title: "Architectuur & Integratie",
    left: {
      heading: "Performance",
      points: [
        "Incremental scoring — alleen deltas herberekenen",
        "Multi-threaded parallelle neighborhood search",
        "Volledige ATW-regelset als harde constraints",
        "Elke toewijzing krijgt score (0-100) + uitleg",
      ],
    },
    right: {
      heading: "Microservice",
      points: [
        "REST API — JSON in, optimaal rooster terug",
        "White-label ready, multi-tenant architectuur",
        "Webhook callbacks bij async oplossen",
        "Draait in elk WFM/ERP landschap",
      ],
    },
  },
  {
    type: "closing",
    title: "Klaar voor de volgende stap?",
    subtitle: "Vraag een demo aan of test de API",
  },
];

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
   PPTX GENERATOR — App-style solver aesthetic
   ══════════════════════════════════════════ */

async function downloadPptx() {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.author = "Planbition";
  prs.title = "Planbition X — AI-gedreven roosterplanning";

  // Design tokens from the app
  const P = "2563EB";       // primary blue
  const P_DARK = "1D4ED8";
  const ACC = "E8842C";     // brand accent orange
  const BG = "F3F5F9";
  const CARD = "FFFFFF";
  const FG = "1E293B";
  const MUT = "64748B";
  const BRD = "E2E8F0";
  const S_E = "34D399";     // shift early (green)
  const S_D = "F59E0B";     // shift day (amber)
  const S_L = "3B82F6";     // shift late (blue)
  const S_N = "8B5CF6";     // shift night (purple)
  const TOTAL = slides.length;

  let robotB64 = "";
  try { robotB64 = await imgToBase64(robotImg); } catch { /* */ }

  // ── Shared layout elements ──

  const addTopBar = (sl: any) => {
    // Thin primary bar at very top (app header feel)
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.04, fill: { color: P } });
    // Orange accent line below
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0.04, w: 13.33, h: 0.02, fill: { color: ACC } });
  };

  const addFooter = (sl: any, num: number) => {
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.0, w: 13.33, h: 0.5, fill: { color: CARD } });
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.0, w: 13.33, h: 0.015, fill: { color: BRD } });
    // Shift dots
    [S_E, S_D, S_L, S_N].forEach((c, i) => {
      sl.addShape(prs.ShapeType.ellipse, { x: 0.5 + i * 0.3, y: 7.15, w: 0.15, h: 0.15, fill: { color: c } });
    });
    sl.addText("Planbition X", { x: 1.8, y: 7.08, w: 3, h: 0.3, fontSize: 8, bold: true, color: FG, fontFace: "Arial" });
    sl.addText(`${num} / ${TOTAL}`, { x: 10.5, y: 7.08, w: 2.3, h: 0.3, fontSize: 8, color: MUT, fontFace: "Arial", align: "right" });
  };

  const addRobot = (sl: any, x: number, y: number, w: number) => {
    if (!robotB64) return;
    sl.addImage({ data: `image/png;base64,${robotB64}`, x, y, w, h: w, sizing: { type: "contain" as const, w, h: w } });
  };

  const addHeading = (sl: any, title: string, subtitle?: string) => {
    sl.addText(title, { x: 0.8, y: 0.5, w: 11, h: 0.7, fontSize: 28, bold: true, color: FG, fontFace: "Arial" });
    sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.15, w: 1.2, h: 0.04, fill: { color: P } });
    if (subtitle) {
      sl.addText(subtitle, { x: 0.8, y: 1.35, w: 10, h: 0.35, fontSize: 12, color: MUT, fontFace: "Arial" });
    }
  };

  // ── Build slides ──

  for (let idx = 0; idx < slides.length; idx++) {
    const s = slides[idx];
    const sl = prs.addSlide();

    /* ── TITLE ── */
    if (s.type === "title") {
      sl.background = { color: P };
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.05, fill: { color: ACC } });

      // Decorative translucent roster cards
      sl.addShape(prs.ShapeType.roundRect, { x: 8.8, y: 3.5, w: 3.8, h: 2.4, rectRadius: 0.15, fill: { color: "FFFFFF12" } });
      sl.addShape(prs.ShapeType.roundRect, { x: 9.3, y: 4.0, w: 3.0, h: 1.2, rectRadius: 0.1, fill: { color: "FFFFFF0A" } });

      // "PLANBITION" lettermark
      sl.addText("PLANBITION", { x: 1.2, y: 1.0, w: 7, h: 0.5, fontSize: 16, color: "FFFFFFCC", fontFace: "Arial", charSpacing: 12, bold: true });

      // Giant X
      sl.addText("X", { x: 1.2, y: 1.6, w: 4, h: 2.8, fontSize: 140, bold: true, color: "FFFFFF", fontFace: "Arial" });

      // Subtitle
      sl.addText(s.subtitle || "", { x: 1.2, y: 4.3, w: 7, h: 1.0, fontSize: 22, color: "FFFFFF", fontFace: "Arial", bold: true, lineSpacing: 32 });

      // Tagline
      sl.addText(s.tagline || "", { x: 1.2, y: 5.5, w: 7, h: 0.4, fontSize: 12, color: "FFFFFFBB", fontFace: "Arial" });

      // Shift badge row
      [
        { l: "Vroeg", c: S_E }, { l: "Dag", c: S_D },
        { l: "Laat", c: S_L }, { l: "Nacht", c: S_N },
      ].forEach((b, i) => {
        const bx = 1.2 + i * 1.5;
        sl.addShape(prs.ShapeType.roundRect, { x: bx, y: 6.15, w: 1.3, h: 0.32, rectRadius: 0.16, fill: { color: b.c + "50" } });
        sl.addText(b.l, { x: bx, y: 6.15, w: 1.3, h: 0.32, fontSize: 9, color: "FFFFFFDD", fontFace: "Arial", align: "center", bold: true });
      });

      // Footer
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.05, w: 13.33, h: 0.45, fill: { color: P_DARK } });
      sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
        x: 1, y: 7.1, w: 11.33, h: 0.35, fontSize: 9, color: "FFFFFF90", fontFace: "Arial", align: "center",
      });

      // Robot
      addRobot(sl, 9.2, 0.6, 3.0);
      continue;
    }

    /* ── CLOSING ── */
    if (s.type === "closing") {
      sl.background = { color: P };
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.05, fill: { color: ACC } });
      addRobot(sl, 5.6, 0.8, 2.2);

      sl.addText(s.title, { x: 1.5, y: 3.3, w: 10.33, h: 1.0, fontSize: 34, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center" });
      sl.addText(s.subtitle || "", { x: 2, y: 4.4, w: 9.33, h: 0.5, fontSize: 16, color: "FFFFFFCC", fontFace: "Arial", align: "center" });

      // CTA button
      sl.addShape(prs.ShapeType.roundRect, { x: 4.5, y: 5.3, w: 4.33, h: 0.6, rectRadius: 0.3, fill: { color: ACC } });
      sl.addText("Vraag een demo aan →", { x: 4.5, y: 5.3, w: 4.33, h: 0.6, fontSize: 14, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center" });

      sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
        x: 2, y: 6.3, w: 9.33, h: 0.4, fontSize: 11, color: "FFFFFF90", fontFace: "Arial", align: "center",
      });
      continue;
    }

    // ── Content slides: shared chrome ──
    sl.background = { color: BG };
    addTopBar(sl);
    addFooter(sl, idx + 1);

    /* ── FLOW (How it works) ── */
    if (s.type === "flow") {
      addHeading(sl, s.title, s.subtitle);
      addRobot(sl, 11.0, 5.0, 1.4);

      (s.steps || []).forEach((step, i) => {
        const cx = 0.8 + i * 3.9;
        const colors = [S_E, P, ACC];
        const col = colors[i];

        // Card
        sl.addShape(prs.ShapeType.roundRect, {
          x: cx, y: 2.0, w: 3.5, h: 4.2, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 6, opacity: 0.07, offset: 2 },
        });
        // Top color accent
        sl.addShape(prs.ShapeType.rect, { x: cx, y: 2.0, w: 3.5, h: 0.05, fill: { color: col } });

        // Number circle
        sl.addShape(prs.ShapeType.ellipse, { x: cx + 1.25, y: 2.5, w: 1.0, h: 1.0, fill: { color: col } });
        sl.addText(step.num, { x: cx + 1.25, y: 2.5, w: 1.0, h: 1.0, fontSize: 28, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center" });

        // Title
        sl.addText(step.title, { x: cx + 0.3, y: 3.7, w: 2.9, h: 0.5, fontSize: 18, bold: true, color: FG, fontFace: "Arial", align: "center" });

        // Desc
        sl.addText(step.desc, { x: cx + 0.3, y: 4.3, w: 2.9, h: 1.5, fontSize: 12, color: MUT, fontFace: "Arial", align: "center", lineSpacing: 18 });

        // Arrow
        if (i < 2) {
          sl.addText("→", { x: cx + 3.5, y: 3.6, w: 0.4, h: 0.5, fontSize: 22, bold: true, color: P, fontFace: "Arial", align: "center" });
        }
      });
    }

    /* ── KPI HERO ── */
    if (s.type === "kpi-hero") {
      addHeading(sl, s.title, s.subtitle);
      addRobot(sl, 11.2, 4.8, 1.3);

      const kpiColors = [P, S_E, ACC, S_N];
      const count = (s.stats || []).length;
      const cW = 2.6;
      const gap = 0.4;
      const totalW = count * cW + (count - 1) * gap;
      const startX = (13.33 - totalW) / 2;

      (s.stats || []).forEach((st, i) => {
        const x = startX + i * (cW + gap);
        const col = kpiColors[i % kpiColors.length];

        // Card
        sl.addShape(prs.ShapeType.roundRect, {
          x, y: 2.4, w: cW, h: 3.6, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 10, opacity: 0.1, offset: 3 },
        });
        // Top accent
        sl.addShape(prs.ShapeType.rect, { x, y: 2.4, w: cW, h: 0.05, fill: { color: col } });
        // Value
        sl.addText(st.val, { x, y: 3.0, w: cW, h: 1.2, fontSize: 38, bold: true, color: col, fontFace: "Arial", align: "center" });
        // Label
        sl.addText(st.label, { x, y: 4.5, w: cW, h: 0.6, fontSize: 12, color: MUT, fontFace: "Arial", align: "center" });
      });
    }

    /* ── GRID (roster-style rows) ── */
    if (s.type === "grid") {
      addHeading(sl, s.title, s.subtitle);
      addRobot(sl, 11.2, 4.8, 1.3);

      const rW = 10.8;
      (s.items || []).forEach((item, i) => {
        const y = 1.9 + i * 0.82;

        // Row bg
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.5, y, w: rW, h: 0.7, rectRadius: 0.06,
          fill: { color: i % 2 === 0 ? CARD : BG },
          shadow: i % 2 === 0 ? { type: "outer", blur: 2, opacity: 0.04, offset: 1 } : undefined,
        });
        // Left accent pip
        sl.addShape(prs.ShapeType.roundRect, { x: 0.5, y, w: 0.05, h: 0.7, rectRadius: 0, fill: { color: P } });

        // Name
        sl.addText(item.name, { x: 0.9, y, w: 3.2, h: 0.7, fontSize: 12, bold: true, color: FG, fontFace: "Arial", valign: "middle" });
        // Desc
        sl.addText(item.desc, { x: 4.2, y, w: rW - 3.9, h: 0.7, fontSize: 11, color: MUT, fontFace: "Arial", valign: "middle" });
      });
    }

    /* ── TWO-COL ── */
    if (s.type === "two-col") {
      addHeading(sl, s.title, s.subtitle);
      addRobot(sl, 11.3, 5.0, 1.2);

      const cW = 5.5;
      const rX = 6.5;

      if (s.left) {
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.5, y: 1.8, w: cW, h: 4.6, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 6, opacity: 0.07, offset: 2 },
        });
        sl.addShape(prs.ShapeType.rect, { x: 0.5, y: 1.8, w: cW, h: 0.05, fill: { color: P } });
        sl.addText(s.left.heading, { x: 0.9, y: 2.1, w: cW - 0.8, h: 0.4, fontSize: 16, bold: true, color: P, fontFace: "Arial" });
        s.left.points.forEach((p, i) => {
          sl.addText(`●  ${p}`, { x: 1.0, y: 2.7 + i * 0.7, w: cW - 0.9, h: 0.6, fontSize: 11, color: FG, fontFace: "Arial", lineSpacing: 16 });
        });
      }

      if (s.right) {
        sl.addShape(prs.ShapeType.roundRect, {
          x: rX, y: 1.8, w: cW, h: 4.6, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 6, opacity: 0.07, offset: 2 },
        });
        sl.addShape(prs.ShapeType.rect, { x: rX, y: 1.8, w: cW, h: 0.05, fill: { color: ACC } });
        sl.addText(s.right.heading, { x: rX + 0.4, y: 2.1, w: cW - 0.8, h: 0.4, fontSize: 16, bold: true, color: ACC, fontFace: "Arial" });
        s.right.points.forEach((p, i) => {
          sl.addText(`●  ${p}`, { x: rX + 0.5, y: 2.7 + i * 0.7, w: cW - 0.9, h: 0.6, fontSize: 11, color: FG, fontFace: "Arial", lineSpacing: 16 });
        });
      }
    }
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
