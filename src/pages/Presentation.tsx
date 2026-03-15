import { useEffect, useRef } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import robotImg from "@/assets/robot-assistant.png";

/* ══════════════════════════════════════════
   SLIDE DATA — 100% Planbition X
   ══════════════════════════════════════════ */

interface PptxSlide {
  type: "title" | "intro" | "stats" | "items" | "two-col" | "closing" | "how-it-works";
  title: string;
  subtitle?: string;
  tagline?: string;
  bullets?: string[];
  stats?: { val: string; label: string }[];
  items?: { name: string; desc: string }[];
  left?: { heading: string; points: string[] };
  right?: { heading: string; points: string[] };
  steps?: { num: string; title: string; desc: string }[];
  robotPosition?: "right" | "bottom-right" | "left";
}

const slides: PptxSlide[] = [
  {
    type: "title",
    title: "Planbition X",
    subtitle: "AI-gedreven roosterplanning — de volgende generatie",
    tagline: "Solver  •  AI  •  Compliance  •  Microservice",
    robotPosition: "right",
  },
  {
    type: "intro",
    title: "Wat is Planbition X?",
    subtitle:
      "Planbition X is een AI-gedreven rooster-solver die in seconden volledig ATW-conforme personeelsroosters genereert. Het systeem combineert moderne AI-technieken met constraint-based optimalisatie om de beste planning te creëren — met uitleg, verstoringsafhandeling en een REST API voor naadloze integratie.",
    bullets: [
      "Genereert optimale roosters in minder dan 1 minuut",
      "100% ATW-compliance automatisch geborgd",
      "Natuurlijke taal briefing — beschrijf voorkeuren, de AI begrijpt het",
      "Slimme verstoringsafhandeling bij ziekte of verzoeken",
      "Beschikbaar als standalone microservice met REST API",
    ],
    robotPosition: "bottom-right",
  },
  {
    type: "how-it-works",
    title: "Hoe werkt het?",
    subtitle: "Van briefing tot optimaal rooster in drie stappen",
    steps: [
      { num: "01", title: "Briefing", desc: "Beschrijf voorkeuren in natuurlijke taal. De AI vertaalt dit automatisch naar constraints voor de solver." },
      { num: "02", title: "AI Solver", desc: "De solver optimaliseert het rooster met kwalificaties, contracturen, ATW-regels en voorkeuren." },
      { num: "03", title: "Wijzigen", desc: "Bij verstoringen vindt de AI direct alternatieven. Shift swaps, ziekte — in seconden opgelost." },
    ],
    robotPosition: "bottom-right",
  },
  {
    type: "items",
    title: "Wat doet Planbition X?",
    subtitle: "De volledige planning lifecycle",
    items: [
      { name: "Briefing in natuurlijke taal", desc: "Beschrijf voorkeuren en beperkingen in gewone taal — de AI vertaalt dit naar constraints" },
      { name: "AI Solver optimaliseert", desc: "De solver weegt kwalificaties, contracturen, ATW-regels en voorkeuren af voor het beste rooster" },
      { name: "Verstoringen afhandelen", desc: "Bij ziekte of wijzigingsverzoeken vindt de AI direct concrete alternatieven" },
      { name: "Uitleg per toewijzing", desc: "Elke shift-toewijzing krijgt een score (0-100) met uitleg waarom deze medewerker is gekozen" },
      { name: "Real-time analytics", desc: "Bezettingsgraad heatmaps, fill rate trends, loonkosten en kwalificatieverdeling" },
    ],
  },
  {
    type: "stats",
    title: "Planbition X in cijfers",
    subtitle: "Meetbare resultaten vanaf dag één",
    stats: [
      { val: "<1 min", label: "Typische oplostijd" },
      { val: "100%", label: "ATW-compliance" },
      { val: "73%", label: "Minder handwerk" },
      { val: "8", label: "Talen" },
      { val: "€5k+", label: "Bespaard / jaar" },
    ],
  },
  {
    type: "items",
    title: "Moderne AI in Planbition X",
    subtitle: "Machine Learning & Deep Learning technieken",
    items: [
      { name: "TFT Demand Forecaster", desc: "Temporal Fusion Transformer — Deep Learning voor personeelsvraag op basis van historische patronen" },
      { name: "Bayesian Weight Optimizer", desc: "Automatisch afstellen van constraint-gewichten op basis van plannergedrag en resultaten" },
      { name: "Medewerkervoorkeur-Learner", desc: "Herkent patronen in voorkeuren en gedrag van medewerkers voor betere toewijzingen" },
      { name: "Planner-Correctie Learner", desc: "Leert van handmatige wijzigingen door planners om toekomstige roosters te verbeteren" },
      { name: "ML Warm-Start Generator", desc: "Machine Learning model dat een kwalitatief startrooster genereert voor snellere optimalisatie" },
    ],
    robotPosition: "bottom-right",
  },
  {
    type: "items",
    title: "Klassieke AI in Planbition X",
    subtitle: "Metaheuristieken & optimalisatie-algoritmen",
    items: [
      { name: "Large Neighborhood Search", desc: "Adaptieve operatorselectie die grote delen van het rooster tegelijk herstructureert" },
      { name: "GRASP Reactive Alpha", desc: "Greedy Randomized Adaptive Search — combineert greedy constructie met gecontroleerde randomness" },
      { name: "Tabu Search", desc: "Lokaal zoekalgoritme dat cycli voorkomt door eerder bezochte oplossingen te onthouden" },
      { name: "SA-Hybride in Tabu", desc: "Simulated Annealing acceptatiecriterium geïntegreerd in Tabu Search voor betere exploratie" },
      { name: "Heuristische Warm-Start", desc: "Snelle initialisatie via domain-specifieke heuristieken als alternatief voor ML warm-start" },
    ],
  },
  {
    type: "two-col",
    title: "Slimme Optimalisatie & Engineering",
    subtitle: "Geen AI — pure performance engineering",
    left: {
      heading: "Performance",
      points: [
        "Incremental Scoring — alleen gewijzigde delen herberekenen",
        "Delta-evaluatie caching voor milliseconde-snelle moves",
        "Multi-threaded solving met parallelle neighborhood search",
      ],
    },
    right: {
      heading: "Compliance Engine",
      points: [
        "Volledige ATW-regelset als harde constraints",
        "Rusttijden, nachtdienst-limieten, pauzeregels",
        "36-uur rust per 7 dagen, 46-uur na nachtreeks",
      ],
    },
  },
  {
    type: "items",
    title: "Voordelen van Planbition X",
    subtitle: "Waarom klanten kiezen voor AI-gedreven planning",
    items: [
      { name: "Betere roosters", desc: "Combinatie van moderne en klassieke AI-technieken levert aantoonbaar betere resultaten" },
      { name: "73% minder handwerk", desc: "Planners besteden drastisch minder tijd aan handmatige aanpassingen en correcties" },
      { name: "5–10× sneller", desc: "Wat uren kostte duurt nu seconden — door slimme optimalisatie en caching" },
      { name: "Volledige uitlegbaarheid", desc: "AI-gedreven uitleg van elke beslissing — transparant en controleerbaar voor planners" },
      { name: "ATW-garantie", desc: "100% compliance met arbeidstijdenwet, automatisch geborgd — geen handmatige controle nodig" },
      { name: "Microservice architectuur", desc: "REST API integratie in elk WFM/ERP systeem — white-label ready, multi-tenant" },
    ],
  },
  {
    type: "two-col",
    title: "Microservice & Integratie",
    subtitle: "Een standalone solver voor elk platform",
    left: {
      heading: "REST API",
      points: [
        "Stuur JSON met medewerkers, diensten en constraints",
        "Ontvang een geoptimaliseerd rooster terug",
        "Webhook callbacks bij asynchroon oplossen",
        "Volledige API documentatie beschikbaar",
      ],
    },
    right: {
      heading: "White-Label & Multi-Tenant",
      points: [
        "Embed de solver in uw eigen product",
        "Geïsoleerde tenant-data met SLA-garanties",
        "Schaalbare infrastructuur per klant",
        "Gebruikt door WFM, logistiek en zorg in Europa",
      ],
    },
    robotPosition: "bottom-right",
  },
  {
    type: "closing",
    title: "Klaar om te starten met Planbition X?",
    subtitle: "Neem contact op voor een demo of API-toegang",
    robotPosition: "right",
  },
];

/* ══════════════════════════════════════════
   HELPER — image to base64
   ══════════════════════════════════════════ */

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
   PPTX GENERATOR — app-style
   ══════════════════════════════════════════ */

async function downloadPptx() {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.author = "Planbition";
  prs.title = "Planbition X — AI-gedreven roosterplanning";

  // App design tokens (from index.css)
  const PRIMARY = "2563EB";     // --primary
  const PRIMARY_DARK = "1D4ED8";
  const ACCENT = "E8842C";      // --brand-accent (orange)
  const BG = "EFF1F5";          // --background
  const CARD = "FFFFFF";        // --card
  const DARK = "1E293B";        // --foreground
  const MUTED = "64748B";       // --muted-foreground
  const BORDER = "E2E8F0";      // --border
  const SHIFT_EARLY = "34D399"; // green
  const SHIFT_DAY = "F59E0B";   // amber
  const SHIFT_LATE = "3B82F6";  // blue
  const SHIFT_NIGHT = "8B5CF6"; // purple

  // Load robot image
  let robotB64 = "";
  try {
    robotB64 = await imgToBase64(robotImg);
  } catch { /* fallback: no robot */ }

  const addRobot = (sl: any, position: string) => {
    if (!robotB64) return;
    const opts: any = { data: `image/png;base64,${robotB64}`, sizing: { type: "contain" as const, w: 1.8, h: 1.8 } };
    if (position === "right") {
      Object.assign(opts, { x: 10.8, y: 1.2, w: 1.8, h: 1.8 });
    } else if (position === "bottom-right") {
      Object.assign(opts, { x: 11.0, y: 5.2, w: 1.5, h: 1.5 });
    } else if (position === "left") {
      Object.assign(opts, { x: 0.5, y: 2.5, w: 1.8, h: 1.8 });
    }
    sl.addImage(opts);
  };

  // App-style footer with mini roster aesthetic
  const addFooter = (sl: any, slideNum: number) => {
    // Footer bar mimicking app sidebar bottom
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 6.9, w: 13.33, h: 0.6, fill: { color: CARD } });
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 6.9, w: 13.33, h: 0.02, fill: { color: BORDER } });
    // Shift-colored dots (like the app's shift badges)
    const dots = [SHIFT_EARLY, SHIFT_DAY, SHIFT_LATE, SHIFT_NIGHT];
    dots.forEach((c, i) => {
      sl.addShape(prs.ShapeType.ellipse, {
        x: 0.5 + i * 0.35, y: 7.08, w: 0.18, h: 0.18, fill: { color: c },
      });
    });
    sl.addText("Planbition X", {
      x: 2.0, y: 7.0, w: 4, h: 0.4, fontSize: 9, bold: true, color: DARK, fontFace: "Arial",
    });
    sl.addText(`${slideNum} / ${slides.length}`, {
      x: 10, y: 7.0, w: 2.83, h: 0.4, fontSize: 9, color: MUTED, fontFace: "Arial", align: "right",
    });
  };

  // App-style left accent bar (like sidebar indicator)
  const addSideIndicator = (sl: any) => {
    sl.addShape(prs.ShapeType.roundRect, {
      x: 0, y: 0, w: 0.08, h: 7.5, rectRadius: 0, fill: { color: PRIMARY },
    });
  };

  for (let idx = 0; idx < slides.length; idx++) {
    const s = slides[idx];
    const sl = prs.addSlide();
    sl.background = { color: BG };

    /* ── TITLE SLIDE ── */
    if (s.type === "title") {
      // Full primary background with gradient effect
      sl.background = { color: PRIMARY };
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: ACCENT } });
      // Decorative card shapes (mimicking roster cards)
      sl.addShape(prs.ShapeType.roundRect, {
        x: 9.5, y: 4.0, w: 3.0, h: 1.8, rectRadius: 0.15, fill: { color: "FFFFFF18" },
      });
      sl.addShape(prs.ShapeType.roundRect, {
        x: 10.0, y: 4.4, w: 2.5, h: 1.0, rectRadius: 0.1, fill: { color: "FFFFFF10" },
      });

      sl.addText("PLANBITION", {
        x: 1, y: 1.2, w: 8, h: 0.5, fontSize: 18, color: "FFFFFFDD", fontFace: "Arial", charSpacing: 10, bold: true,
      });
      sl.addText("X", {
        x: 1, y: 1.8, w: 3, h: 2.2, fontSize: 120, bold: true, color: "FFFFFF", fontFace: "Arial",
      });
      sl.addText(s.subtitle || "", {
        x: 1, y: 4.0, w: 7.5, h: 0.8, fontSize: 22, bold: true, color: "FFFFFF", fontFace: "Arial", lineSpacing: 30,
      });
      sl.addText(s.tagline || "", {
        x: 1, y: 5.2, w: 7.5, h: 0.5, fontSize: 13, bold: true, color: "FFFFFFCC", fontFace: "Arial",
      });
      // Shift badge row
      const badges = [
        { label: "Early", color: SHIFT_EARLY },
        { label: "Day", color: SHIFT_DAY },
        { label: "Late", color: SHIFT_LATE },
        { label: "Night", color: SHIFT_NIGHT },
      ];
      badges.forEach((b, i) => {
        sl.addShape(prs.ShapeType.roundRect, {
          x: 1 + i * 1.6, y: 6.0, w: 1.4, h: 0.35, rectRadius: 0.17, fill: { color: b.color + "40" },
        });
        sl.addText(b.label, {
          x: 1 + i * 1.6, y: 6.0, w: 1.4, h: 0.35, fontSize: 9, color: "FFFFFFCC", fontFace: "Arial", align: "center",
        });
      });
      // Footer
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.0, w: 13.33, h: 0.5, fill: { color: PRIMARY_DARK } });
      sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
        x: 1, y: 7.05, w: 11, h: 0.4, fontSize: 10, color: "FFFFFF80", fontFace: "Arial", align: "center",
      });
      // Robot
      if (robotB64) {
        sl.addImage({
          data: `image/png;base64,${robotB64}`, x: 9.5, y: 0.8, w: 2.8, h: 2.8,
          sizing: { type: "contain" as const, w: 2.8, h: 2.8 },
        });
      }
      continue;
    }

    /* ── CLOSING SLIDE ── */
    if (s.type === "closing") {
      sl.background = { color: PRIMARY };
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: ACCENT } });
      if (robotB64) {
        sl.addImage({
          data: `image/png;base64,${robotB64}`, x: 5.5, y: 0.8, w: 2.2, h: 2.2,
          sizing: { type: "contain" as const, w: 2.2, h: 2.2 },
        });
      }
      sl.addText(s.title, {
        x: 1.5, y: 3.2, w: 10.33, h: 1.2, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center",
      });
      sl.addText(s.subtitle || "", {
        x: 2, y: 4.4, w: 9.33, h: 0.6, fontSize: 18, color: "FFFFFFCC", fontFace: "Arial", align: "center",
      });
      // CTA button shape
      sl.addShape(prs.ShapeType.roundRect, {
        x: 4.5, y: 5.4, w: 4.33, h: 0.65, rectRadius: 0.32, fill: { color: ACCENT },
      });
      sl.addText("Vraag een demo aan →", {
        x: 4.5, y: 5.4, w: 4.33, h: 0.65, fontSize: 15, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center",
      });
      sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
        x: 2, y: 6.4, w: 9.33, h: 0.5, fontSize: 12, color: "FFFFFF80", fontFace: "Arial", align: "center",
      });
      continue;
    }

    // ── All content slides ──
    addSideIndicator(sl);
    addFooter(sl, idx + 1);
    if (s.robotPosition) addRobot(sl, s.robotPosition);

    /* ── HOW IT WORKS ── */
    if (s.type === "how-it-works") {
      sl.addText(s.title, {
        x: 0.8, y: 0.4, w: 11, h: 0.8, fontSize: 32, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.15, w: 1.5, h: 0.05, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.4, w: 10, h: 0.4, fontSize: 13, color: MUTED, fontFace: "Arial",
      });
      (s.steps || []).forEach((step, i) => {
        const x = 0.6 + i * 3.8;
        // Card
        sl.addShape(prs.ShapeType.roundRect, {
          x, y: 2.2, w: 3.5, h: 3.8, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 3 },
        });
        // Top accent bar
        sl.addShape(prs.ShapeType.rect, { x, y: 2.2, w: 3.5, h: 0.06, fill: { color: i === 0 ? SHIFT_EARLY : i === 1 ? PRIMARY : ACCENT } });
        // Step number circle
        const circleColor = i === 0 ? SHIFT_EARLY : i === 1 ? PRIMARY : ACCENT;
        sl.addShape(prs.ShapeType.ellipse, {
          x: x + 1.35, y: 2.6, w: 0.8, h: 0.8, fill: { color: circleColor },
        });
        sl.addText(step.num, {
          x: x + 1.35, y: 2.6, w: 0.8, h: 0.8, fontSize: 20, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center",
        });
        // Title
        sl.addText(step.title, {
          x: x + 0.3, y: 3.6, w: 2.9, h: 0.5, fontSize: 18, bold: true, color: DARK, fontFace: "Arial", align: "center",
        });
        // Description
        sl.addText(step.desc, {
          x: x + 0.3, y: 4.2, w: 2.9, h: 1.4, fontSize: 12, color: MUTED, fontFace: "Arial", align: "center", lineSpacing: 18,
        });
        // Arrow between cards
        if (i < 2) {
          sl.addText("→", {
            x: x + 3.5, y: 3.5, w: 0.3, h: 0.6, fontSize: 20, color: PRIMARY, fontFace: "Arial", align: "center",
          });
        }
      });
    }

    /* ── INTRO ── */
    if (s.type === "intro") {
      sl.addText(s.title, {
        x: 0.8, y: 0.4, w: 10, h: 0.8, fontSize: 32, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.15, w: 1.5, h: 0.05, fill: { color: PRIMARY } });
      // Subtitle in a card
      sl.addShape(prs.ShapeType.roundRect, {
        x: 0.6, y: 1.5, w: 10, h: 1.5, rectRadius: 0.12,
        fill: { color: CARD }, shadow: { type: "outer", blur: 4, opacity: 0.06, offset: 2 },
      });
      sl.addText(s.subtitle || "", {
        x: 1.0, y: 1.6, w: 9.2, h: 1.3, fontSize: 14, color: MUTED, fontFace: "Arial", lineSpacing: 22,
      });
      if (s.bullets) {
        s.bullets.forEach((b, i) => {
          const y = 3.4 + i * 0.65;
          // Alternating row style (like roster grid)
          sl.addShape(prs.ShapeType.roundRect, {
            x: 0.6, y, w: 10, h: 0.55, rectRadius: 0.06,
            fill: { color: i % 2 === 0 ? CARD : BG },
          });
          sl.addShape(prs.ShapeType.roundRect, {
            x: 0.6, y, w: 0.05, h: 0.55, rectRadius: 0, fill: { color: PRIMARY },
          });
          sl.addText(`✓  ${b}`, {
            x: 1.0, y, w: 9.5, h: 0.55, fontSize: 13, color: DARK, fontFace: "Arial", valign: "middle",
          });
        });
      }
    }

    /* ── STATS ── */
    if (s.type === "stats") {
      sl.addText(s.title, {
        x: 0.8, y: 0.5, w: 11, h: 0.8, fontSize: 32, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.25, w: 1.5, h: 0.05, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.6, w: 10, h: 0.4, fontSize: 13, color: MUTED, fontFace: "Arial",
      });
      // KPI cards (like the app's KpiCards component)
      const kpiColors = [PRIMARY, SHIFT_EARLY, ACCENT, SHIFT_LATE, SHIFT_NIGHT];
      const count = (s.stats || []).length;
      const cardW = 2.15;
      const gap = 0.25;
      const totalW = count * cardW + (count - 1) * gap;
      const startX = (13.33 - totalW) / 2;
      (s.stats || []).forEach((st, i) => {
        const x = startX + i * (cardW + gap);
        const kpiColor = kpiColors[i % kpiColors.length];
        // Card shadow
        sl.addShape(prs.ShapeType.roundRect, {
          x, y: 2.8, w: cardW, h: 3.0, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 10, opacity: 0.1, offset: 3 },
        });
        // Top color bar (like KPI card accent)
        sl.addShape(prs.ShapeType.rect, { x, y: 2.8, w: cardW, h: 0.06, fill: { color: kpiColor } });
        // Value
        sl.addText(st.val, {
          x, y: 3.3, w: cardW, h: 1.0, fontSize: 34, bold: true, color: kpiColor,
          fontFace: "Arial", align: "center",
        });
        // Label
        sl.addText(st.label, {
          x, y: 4.5, w: cardW, h: 0.8, fontSize: 11, color: MUTED,
          fontFace: "Arial", align: "center", lineSpacing: 16,
        });
      });
    }

    /* ── ITEMS ── */
    if (s.type === "items") {
      sl.addText(s.title, {
        x: 0.8, y: 0.3, w: 10, h: 0.7, fontSize: 28, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 0.95, w: 1.5, h: 0.05, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.15, w: 10, h: 0.35, fontSize: 12, color: MUTED, fontFace: "Arial",
      });
      const maxW = s.robotPosition ? 10.0 : 11.8;
      (s.items || []).forEach((item, i) => {
        const y = 1.8 + i * 0.85;
        // Roster-style alternating rows
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.5, y, w: maxW, h: 0.72, rectRadius: 0.08,
          fill: { color: i % 2 === 0 ? CARD : BG },
          shadow: i % 2 === 0 ? { type: "outer", blur: 3, opacity: 0.05, offset: 1 } : undefined,
        });
        // Left accent pip
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.5, y, w: 0.05, h: 0.72, rectRadius: 0, fill: { color: PRIMARY },
        });
        // Name
        sl.addText(item.name, {
          x: 0.9, y, w: 3.5, h: 0.72, fontSize: 13, bold: true, color: DARK, fontFace: "Arial", valign: "middle",
        });
        // Desc
        sl.addText(item.desc, {
          x: 4.5, y, w: maxW - 4.2, h: 0.72, fontSize: 11, color: MUTED, fontFace: "Arial", valign: "middle",
        });
      });
    }

    /* ── TWO-COL ── */
    if (s.type === "two-col") {
      sl.addText(s.title, {
        x: 0.8, y: 0.3, w: 11, h: 0.7, fontSize: 28, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 0.95, w: 1.5, h: 0.05, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.15, w: 10, h: 0.35, fontSize: 12, color: MUTED, fontFace: "Arial",
      });
      const colW = s.robotPosition ? 5.0 : 5.8;
      const rightX = s.robotPosition ? 5.8 : 6.9;

      if (s.left) {
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.5, y: 1.8, w: colW, h: 4.5, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 3 },
        });
        sl.addShape(prs.ShapeType.rect, { x: 0.5, y: 1.8, w: colW, h: 0.06, fill: { color: PRIMARY } });
        sl.addText(s.left.heading, {
          x: 0.9, y: 2.1, w: colW - 0.8, h: 0.5, fontSize: 17, bold: true, color: PRIMARY, fontFace: "Arial",
        });
        s.left.points.forEach((p, i) => {
          sl.addText(`●  ${p}`, {
            x: 1.1, y: 2.8 + i * 0.75, w: colW - 1.0, h: 0.65, fontSize: 12, color: DARK, fontFace: "Arial", lineSpacing: 18,
          });
        });
      }

      if (s.right) {
        sl.addShape(prs.ShapeType.roundRect, {
          x: rightX, y: 1.8, w: colW, h: 4.5, rectRadius: 0.15,
          fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 3 },
        });
        sl.addShape(prs.ShapeType.rect, { x: rightX, y: 1.8, w: colW, h: 0.06, fill: { color: ACCENT } });
        sl.addText(s.right.heading, {
          x: rightX + 0.4, y: 2.1, w: colW - 0.8, h: 0.5, fontSize: 17, bold: true, color: ACCENT, fontFace: "Arial",
        });
        s.right.points.forEach((p, i) => {
          sl.addText(`●  ${p}`, {
            x: rightX + 0.6, y: 2.8 + i * 0.75, w: colW - 1.0, h: 0.65, fontSize: 12, color: DARK, fontFace: "Arial", lineSpacing: 18,
          });
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
