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
   PPTX GENERATOR
   ══════════════════════════════════════════ */

async function downloadPptx() {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE";
  prs.author = "Planbition";
  prs.title = "Planbition X — AI-gedreven roosterplanning";

  // ── Design tokens ──
  const P = "2563EB";
  const P_DARK = "1E40AF";
  const ACC = "E8842C";
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
  const MODERN_AI = "7C3AED";
  const CLASSIC_AI = "0891B2";
  const NO_AI = "475569";
  const TOTAL = 10;

  let robotB64 = "";
  try { robotB64 = await imgToBase64(robotImg); } catch { /* */ }

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

  const contentSlide = (num: number) => {
    const sl = prs.addSlide();
    sl.background = { color: BG };
    addTopBar(sl);
    addFooter(sl, num);
    return sl;
  };

  // Helper for tech detail cards on AI slides
  const addTechCard = (sl: any, x: number, y: number, w: number, h: number, col: string, name: string, desc: string, detail: string) => {
    sl.addShape(prs.ShapeType.roundRect, {
      x, y, w, h, rectRadius: 0.12,
      fill: { color: CARD }, shadow: { type: "outer", blur: 6, opacity: 0.08, offset: 2 },
    });
    sl.addShape(prs.ShapeType.rect, { x, y, w, h: 0.05, fill: { color: col } });
    sl.addText(name, { x: x + 0.25, y: y + 0.15, w: w - 0.5, h: 0.35, fontSize: 13, bold: true, color: FG, fontFace: "Arial" });
    sl.addText(desc, { x: x + 0.25, y: y + 0.5, w: w - 0.5, h: 0.4, fontSize: 10, color: FG2, fontFace: "Arial", lineSpacing: 14 });
    sl.addText(detail, { x: x + 0.25, y: y + 0.95, w: w - 0.5, h: 0.7, fontSize: 9, color: MUT, fontFace: "Arial", lineSpacing: 13, italic: true });
  };

  // ═══════════════════════════════════════
  // SLIDE 1 — TITLE
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    sl.background = { color: P };
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.05, fill: { color: ACC } });
    sl.addShape(prs.ShapeType.ellipse, { x: 8, y: 4, w: 6, h: 4, fill: { color: P_DARK } });

    sl.addText("PLANBITION", { x: 1.0, y: 0.7, w: 6, h: 0.5, fontSize: 14, bold: true, color: "FFFFFF", fontFace: "Arial", charSpacing: 8 });
    sl.addText("X", { x: 0.6, y: 1.2, w: 4.5, h: 3.5, fontSize: 200, bold: true, color: "FFFFFF", fontFace: "Arial" });

    sl.addText("AI-gedreven\nroosterplanning", {
      x: 4.2, y: 1.6, w: 4.5, h: 1.6, fontSize: 34, bold: true, color: "FFFFFF", fontFace: "Arial", lineSpacing: 46,
    });
    sl.addText("De volgende generatie workforce scheduling", {
      x: 4.2, y: 3.3, w: 4.5, h: 0.4, fontSize: 13, color: "FFFFFF", fontFace: "Arial",
    });

    [
      { l: "Vroeg", c: S_E }, { l: "Dag", c: S_D },
      { l: "Laat", c: S_L }, { l: "Nacht", c: S_N },
    ].forEach((b, i) => {
      pill(sl, 4.2 + i * 1.35, 4.0, 1.2, b.l, b.c, "FFFFFF");
    });

    sl.addText("Solver  ·  AI  ·  Compliance  ·  Microservice", {
      x: 1.0, y: 5.0, w: 7, h: 0.35, fontSize: 11, bold: true, color: "FFFFFF", fontFace: "Arial",
    });

    [
      { v: "<1 min", l: "Oplostijd" },
      { v: "100%", l: "ATW-compliant" },
      { v: "73%", l: "Minder handwerk" },
    ].forEach((k, i) => {
      const kx = 1.0 + i * 2.4;
      sl.addText(k.v, { x: kx, y: 5.6, w: 2.0, h: 0.55, fontSize: 24, bold: true, color: "FFFFFF", fontFace: "Arial" });
      sl.addText(k.l, { x: kx, y: 6.1, w: 2.0, h: 0.3, fontSize: 9, color: "FFFFFF", fontFace: "Arial" });
    });

    sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.05, w: 13.33, h: 0.45, fill: { color: P_DARK } });
    sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
      x: 1, y: 7.1, w: 11.33, h: 0.3, fontSize: 9, color: "FFFFFF", fontFace: "Arial", align: "center",
    });

    addRobot(sl, 9.0, 0.8, 4.0);
  }

  // ═══════════════════════════════════════
  // SLIDE 2 — HOW IT WORKS
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(2);
    addHeading(sl, "Hoe werkt Planbition X?", "Van briefing tot optimaal rooster in drie stappen");

    const steps = [
      { num: "1", title: "Briefing", desc: "Beschrijf voorkeuren in\nnatuurlijke taal — de AI\nvertaalt dit naar constraints", col: S_E, tag: "AI Chat", tagC: MODERN_AI },
      { num: "2", title: "AI Solver", desc: "Optimaliseert het rooster met\nkwalificaties, contracturen\nen ATW-regels", col: P, tag: "Optimalisatie", tagC: CLASSIC_AI },
      { num: "3", title: "Wijzigen", desc: "Bij verstoringen vindt de AI\ndirect alternatieven —\nin seconden opgelost", col: ACC, tag: "AI + Solver", tagC: MODERN_AI },
    ];

    steps.forEach((step, i) => {
      const cx = 0.6 + i * 4.0;
      sl.addShape(prs.ShapeType.roundRect, {
        x: cx, y: 1.8, w: 3.6, h: 4.5, rectRadius: 0.15,
        fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 2 },
      });
      sl.addShape(prs.ShapeType.rect, { x: cx, y: 1.8, w: 3.6, h: 0.06, fill: { color: step.col } });
      sl.addShape(prs.ShapeType.ellipse, { x: cx + 1.3, y: 2.3, w: 1.0, h: 1.0, fill: { color: step.col } });
      sl.addText(step.num, { x: cx + 1.3, y: 2.3, w: 1.0, h: 1.0, fontSize: 30, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center" });
      sl.addText(step.title, { x: cx + 0.3, y: 3.5, w: 3.0, h: 0.5, fontSize: 18, bold: true, color: FG, fontFace: "Arial", align: "center" });
      sl.addText(step.desc, { x: cx + 0.3, y: 4.1, w: 3.0, h: 1.4, fontSize: 11, color: MUT, fontFace: "Arial", align: "center", lineSpacing: 17 });
      pill(sl, cx + 1.0, 5.7, 1.6, step.tag, step.tagC, "FFFFFF");
      if (i < 2) sl.addText("→", { x: cx + 3.6, y: 3.5, w: 0.4, h: 0.5, fontSize: 24, bold: true, color: P, fontFace: "Arial", align: "center" });
    });

    addRobot(sl, 11.5, 4.6, 1.5);
  }

  // ═══════════════════════════════════════
  // SLIDE 3 — RESULTATEN
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(3);
    addHeading(sl, "Meetbare resultaten", "Vanaf dag één impact op uw planningsproces");

    const stats = [
      { val: "<1 min", label: "Oplostijd\nper rooster", col: P, icon: "⚡" },
      { val: "100%", label: "ATW-\ncompliant", col: S_E, icon: "✓" },
      { val: "73%", label: "Minder\nhandwerk", col: ACC, icon: "↓" },
      { val: "€5k+", label: "Besparing\nper jaar", col: S_N, icon: "€" },
    ];
    const cW = 2.7, gap = 0.35;
    const totalW = stats.length * cW + (stats.length - 1) * gap;
    const startX = (13.33 - totalW) / 2;

    stats.forEach((st, i) => {
      const x = startX + i * (cW + gap);
      sl.addShape(prs.ShapeType.roundRect, {
        x, y: 2.0, w: cW, h: 4.2, rectRadius: 0.18,
        fill: { color: CARD }, shadow: { type: "outer", blur: 10, opacity: 0.1, offset: 3 },
      });
      sl.addShape(prs.ShapeType.rect, { x, y: 2.0, w: cW, h: 0.06, fill: { color: st.col } });
      sl.addShape(prs.ShapeType.ellipse, { x: x + 0.85, y: 2.5, w: 1.0, h: 1.0, fill: { color: st.col } });
      sl.addText(st.icon, { x: x + 0.85, y: 2.5, w: 1.0, h: 1.0, fontSize: 28, color: "FFFFFF", fontFace: "Arial", align: "center" });
      sl.addText(st.val, { x, y: 3.8, w: cW, h: 0.9, fontSize: 36, bold: true, color: st.col, fontFace: "Arial", align: "center" });
      sl.addText(st.label, { x, y: 4.8, w: cW, h: 0.8, fontSize: 11, color: MUT, fontFace: "Arial", align: "center", lineSpacing: 16 });
    });

    addRobot(sl, 11.2, 5.0, 1.3);
  }

  // ═══════════════════════════════════════
  // SLIDE 4 — MODERNE AI (Deep Learning / LLMs)
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(4);
    addHeading(sl, "Moderne AI — Deep Learning & LLMs");
    pill(sl, 0.7, 1.25, 2.0, "🧠  Moderne AI", MODERN_AI, "FFFFFF");

    sl.addText("State-of-the-art technieken uit machine learning en generatieve AI, toegepast op workforce planning.", {
      x: 3.0, y: 1.2, w: 8, h: 0.4, fontSize: 10, color: MUT, fontFace: "Arial",
    });

    const cards = [
      {
        name: "TFT Demand Forecaster",
        desc: "Temporal Fusion Transformer voorspelt personeelsbehoefte per locatie, dienst en tijdslot.",
        detail: "Input: historische bezetting, seizoenspatronen, evenementen. Output: voorspelde FTE-behoefte per uur. Resulteert in 15-20% betere bezettingsgraad.",
      },
      {
        name: "NLP Briefing Parser",
        desc: "Large Language Model vertaalt natuurlijke taal van planners naar solver-constraints.",
        detail: "Bijv. \"Jan mag geen nachtdiensten meer\" → hard constraint op shift-type N voor employee_id 42. Ondersteunt Nederlands, Engels, Duits.",
      },
      {
        name: "Planner-Correctie Learner",
        desc: "Supervised learning model dat leert van handmatige aanpassingen door planners.",
        detail: "Analyseert patronen in correcties (bv. planner wisselt altijd X en Y op vrijdag). Past gewichten aan zodat de solver dit in volgende runs automatisch doet.",
      },
      {
        name: "AI Alternatieve Zoeker",
        desc: "Bij verstoringen (ziekte, uitval) genereert de AI meerdere alternatieven met uitleg.",
        detail: "Combineert constraint-relaxatie met LLM-uitleg. Toont per alternatief: impact op score, betrokken medewerkers, en compliance-status.",
      },
    ];

    cards.forEach((c, i) => {
      const col = i < 2 ? 0 : 1;
      const row = i % 2;
      const cx = 0.5 + col * 6.2;
      const cy = 1.7 + row * 2.6;
      addTechCard(sl, cx, cy, 5.8, 2.4, MODERN_AI, c.name, c.desc, c.detail);
    });

    addRobot(sl, 11.3, 5.2, 1.2);
  }

  // ═══════════════════════════════════════
  // SLIDE 5 — KLASSIEKE AI (ML & Statistiek)
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(5);
    addHeading(sl, "Klassieke AI — Machine Learning & Statistiek");
    pill(sl, 0.7, 1.25, 2.2, "⚙️  Klassieke AI", CLASSIC_AI, "FFFFFF");

    sl.addText("Beproefde ML-technieken voor patroonherkenning en automatische parameterafstemming.", {
      x: 3.2, y: 1.2, w: 8, h: 0.4, fontSize: 10, color: MUT, fontFace: "Arial",
    });

    const cards = [
      {
        name: "Bayesian Weight Optimizer",
        desc: "Past constraint-gewichten automatisch aan op basis van plannergedrag.",
        detail: "Gebruikt Bayesian optimalisatie om de balans tussen soft constraints (voorkeuren, uren-verdeling, spreiding) te vinden die het beste matcht met hoe planners handmatig zouden plannen.",
      },
      {
        name: "ML Warm-Start Generator",
        desc: "Genereert een kwalitatief startrooster via patroonherkenning op historische data.",
        detail: "Classificeert per (medewerker, dag, dienst) de waarschijnlijkheid van toewijzing. De solver start vanuit dit punt i.p.v. een leeg rooster → 40-60% snellere convergentie.",
      },
      {
        name: "Anomalie Detectie",
        desc: "Signaleert afwijkende patronen in roosters en bezettingsdata.",
        detail: "Detecteert bv. ongebruikelijke overwerkpatronen, structurele onderbezetting op specifieke diensten, of medewerkers die consistent benadeeld worden in de planning.",
      },
    ];

    cards.forEach((c, i) => {
      const cx = 0.5;
      const cy = 1.7 + i * 1.8;
      addTechCard(sl, cx, cy, 11.5, 1.65, CLASSIC_AI, c.name, c.desc, c.detail);
    });

    addRobot(sl, 11.3, 5.5, 1.2);
  }

  // ═══════════════════════════════════════
  // SLIDE 6 — SOLVER TECHNIEKEN (Geen AI)
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(6);
    addHeading(sl, "Solver-technieken — Operations Research");
    pill(sl, 0.7, 1.25, 2.6, "🔧  Geen AI (deterministische solver)", NO_AI, "FFFFFF");

    sl.addText("Wiskundige optimalisatie en heuristische methoden — de motor achter elk rooster.", {
      x: 3.6, y: 1.2, w: 8, h: 0.4, fontSize: 10, color: MUT, fontFace: "Arial",
    });

    const cards = [
      {
        name: "Large Neighborhood Search (LNS)",
        desc: "Vernietigt en herbouwt grote delen van het rooster om lokale optima te ontsnappen.",
        detail: "Destroy operators selecteren 20-40% van toewijzingen. Repair operators herbouwen via greedy heuristieken met constraint-verificatie. Levert structureel betere oplossingen dan lokale zoektechnieken.",
      },
      {
        name: "GRASP + Tabu Hybride",
        desc: "Combineert greedy randomized constructie met geheugen-gestuurde lokale zoektechnieken.",
        detail: "GRASP bouwt diverse startoplossingen; Tabu Search verfijnt deze met een korte-termijn geheugen dat cyclisch gedrag voorkomt. Meerdere threads werken parallel aan verschillende startpunten.",
      },
      {
        name: "Incremental Constraint Scoring",
        desc: "Evalueert de impact van een enkele wijziging in O(1) i.p.v. het hele rooster opnieuw.",
        detail: "Delta-evaluatie voor alle harde en zachte constraints. Maakt het mogelijk om >100.000 moves per seconde te evalueren. Essentieel voor de snelheid van LNS en Tabu Search.",
      },
      {
        name: "ATW Compliance Engine",
        desc: "Volledige implementatie van de Arbeidstijdenwet als harde constraints.",
        detail: "Max uren per dag/week/periode, minimale rust, nachtdienst-limieten, consignatieregels. Elke toewijzing wordt real-time gevalideerd — 100% compliance gegarandeerd.",
      },
    ];

    cards.forEach((c, i) => {
      const col = i < 2 ? 0 : 1;
      const row = i % 2;
      const cx = 0.5 + col * 6.2;
      const cy = 1.7 + row * 2.6;
      addTechCard(sl, cx, cy, 5.8, 2.4, NO_AI, c.name, c.desc, c.detail);
    });

    addRobot(sl, 11.3, 5.2, 1.2);
  }

  // ═══════════════════════════════════════
  // SLIDE 7 — ARCHITECTUUR & INTEGRATIE
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(7);
    addHeading(sl, "Architectuur & Integratie");

    const colW = 5.6;

    sl.addShape(prs.ShapeType.roundRect, {
      x: 0.5, y: 1.7, w: colW, h: 4.8, rectRadius: 0.15,
      fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 2 },
    });
    sl.addShape(prs.ShapeType.rect, { x: 0.5, y: 1.7, w: colW, h: 0.06, fill: { color: P } });
    sl.addText("Performance & Compliance", { x: 0.9, y: 1.95, w: colW - 0.8, h: 0.45, fontSize: 16, bold: true, color: P, fontFace: "Arial" });

    [
      "Incremental scoring — alleen deltas herberekenen",
      "Multi-threaded parallelle neighborhood search",
      "Volledige ATW-regelset als harde constraints",
      "Elke toewijzing krijgt score (0-100) + uitleg",
      "< 1 minuut voor een compleet rooster",
    ].forEach((p, i) => {
      sl.addShape(prs.ShapeType.ellipse, { x: 1.0, y: 2.65 + i * 0.72, w: 0.12, h: 0.12, fill: { color: P } });
      sl.addText(p, { x: 1.25, y: 2.5 + i * 0.72, w: colW - 1.1, h: 0.55, fontSize: 11, color: FG2, fontFace: "Arial", valign: "middle" });
    });

    const rX = 6.5;
    sl.addShape(prs.ShapeType.roundRect, {
      x: rX, y: 1.7, w: colW, h: 4.8, rectRadius: 0.15,
      fill: { color: CARD }, shadow: { type: "outer", blur: 8, opacity: 0.08, offset: 2 },
    });
    sl.addShape(prs.ShapeType.rect, { x: rX, y: 1.7, w: colW, h: 0.06, fill: { color: ACC } });
    sl.addText("Microservice & API", { x: rX + 0.4, y: 1.95, w: colW - 0.8, h: 0.45, fontSize: 16, bold: true, color: ACC, fontFace: "Arial" });

    [
      "REST API — JSON in, optimaal rooster terug",
      "White-label ready, multi-tenant architectuur",
      "Webhook callbacks bij async oplossen",
      "Draait in elk WFM/ERP landschap",
      "SSO en rolgebaseerde toegangscontrole",
    ].forEach((p, i) => {
      sl.addShape(prs.ShapeType.ellipse, { x: rX + 0.5, y: 2.65 + i * 0.72, w: 0.12, h: 0.12, fill: { color: ACC } });
      sl.addText(p, { x: rX + 0.75, y: 2.5 + i * 0.72, w: colW - 1.1, h: 0.55, fontSize: 11, color: FG2, fontFace: "Arial", valign: "middle" });
    });

    addRobot(sl, 5.4, 5.3, 1.3);
  }

  // ═══════════════════════════════════════
  // SLIDE 8 — WAAROM PLANBITION X (Marketing)
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(8);
    addHeading(sl, "Waarom Planbition X?", "De voordelen voor uw organisatie");

    const benefits = [
      { icon: "⏱", title: "Van uren naar seconden", desc: "Wat planners nu handmatig doen in uren, lost de solver op in minder dan een minuut. Meer tijd voor uitzonderingen en menselijk contact.", col: P },
      { icon: "⚖", title: "Altijd compliant", desc: "De ATW-regelset is ingebouwd als harde constraint. Geen overtredingen, geen boetes, geen discussie. 100% aantoonbaar compliant.", col: S_E },
      { icon: "🔌", title: "Plug & Play integratie", desc: "REST API past in elk bestaand WFM- of ERP-systeem. White-label ready voor softwarepartners die het als eigen oplossing willen aanbieden.", col: ACC },
      { icon: "🧠", title: "Leert van uw planners", desc: "De AI observeert hoe planners handmatig corrigeren en past het model aan. Elk rooster wordt slimmer dan het vorige.", col: MODERN_AI },
      { icon: "📊", title: "Transparante scoring", desc: "Elke toewijzing krijgt een score van 0-100 met uitleg. Planners zien waarom een keuze is gemaakt en kunnen gericht bijsturen.", col: S_N },
      { icon: "💰", title: "Directe ROI", desc: "Gemiddeld €5k+ besparing per jaar door efficiëntere inzet, minder overwerk en minder correcties achteraf.", col: S_D },
    ];

    benefits.forEach((b, i) => {
      const col = i < 3 ? 0 : 1;
      const row = i % 3;
      const cx = 0.5 + col * 6.2;
      const cy = 1.7 + row * 1.7;

      sl.addShape(prs.ShapeType.roundRect, {
        x: cx, y: cy, w: 5.8, h: 1.5, rectRadius: 0.12,
        fill: { color: CARD }, shadow: { type: "outer", blur: 4, opacity: 0.06, offset: 1 },
      });
      sl.addShape(prs.ShapeType.rect, { x: cx, y: cy, w: 0.06, h: 1.5, fill: { color: b.col } });

      // Icon circle
      sl.addShape(prs.ShapeType.ellipse, { x: cx + 0.25, y: cy + 0.25, w: 0.7, h: 0.7, fill: { color: b.col } });
      sl.addText(b.icon, { x: cx + 0.25, y: cy + 0.25, w: 0.7, h: 0.7, fontSize: 18, color: "FFFFFF", fontFace: "Arial", align: "center" });

      sl.addText(b.title, { x: cx + 1.15, y: cy + 0.1, w: 4.3, h: 0.35, fontSize: 12, bold: true, color: FG, fontFace: "Arial" });
      sl.addText(b.desc, { x: cx + 1.15, y: cy + 0.5, w: 4.3, h: 0.9, fontSize: 9, color: FG2, fontFace: "Arial", lineSpacing: 13 });
    });

    addRobot(sl, 11.3, 5.3, 1.2);
  }

  // ═══════════════════════════════════════
  // SLIDE 9 — DOELGROEPEN & USE CASES (Sales)
  // ═══════════════════════════════════════
  {
    const sl = contentSlide(9);
    addHeading(sl, "Doelgroepen & use cases", "Voor wie is Planbition X?");

    const segments = [
      {
        title: "Uitzendbureaus & Staffing",
        points: ["Honderden medewerkers over meerdere locaties", "Wisselende beschikbaarheid en kwalificaties", "Hoge druk op compliance en snelheid"],
        col: P, icon: "👥",
      },
      {
        title: "Facilitaire dienstverlening",
        points: ["24/7 bezetting met vroege, dag-, avond- en nachtdiensten", "ATW-compliance essentieel", "Veel part-time en flexcontracten"],
        col: S_E, icon: "🏢",
      },
      {
        title: "WFM / ERP Software Partners",
        points: ["White-label solver als microservice", "REST API integreert in bestaand platform", "Geen eigen solver-ontwikkeling nodig"],
        col: ACC, icon: "🔌",
      },
      {
        title: "Zorg & Logistiek",
        points: ["Complexe kwalificatie-eisen per dienst", "Onregelmatige diensten en oproepkrachten", "Naleving CAO en arbeidstijden"],
        col: S_N, icon: "🏥",
      },
    ];

    segments.forEach((seg, i) => {
      const col = i < 2 ? 0 : 1;
      const row = i % 2;
      const cx = 0.5 + col * 6.2;
      const cy = 1.7 + row * 2.6;

      sl.addShape(prs.ShapeType.roundRect, {
        x: cx, y: cy, w: 5.8, h: 2.4, rectRadius: 0.12,
        fill: { color: CARD }, shadow: { type: "outer", blur: 6, opacity: 0.08, offset: 2 },
      });
      sl.addShape(prs.ShapeType.rect, { x: cx, y: cy, w: 5.8, h: 0.05, fill: { color: seg.col } });

      // Icon + title
      sl.addShape(prs.ShapeType.ellipse, { x: cx + 0.3, y: cy + 0.25, w: 0.65, h: 0.65, fill: { color: seg.col } });
      sl.addText(seg.icon, { x: cx + 0.3, y: cy + 0.25, w: 0.65, h: 0.65, fontSize: 18, color: "FFFFFF", fontFace: "Arial", align: "center" });
      sl.addText(seg.title, { x: cx + 1.15, y: cy + 0.25, w: 4.3, h: 0.45, fontSize: 14, bold: true, color: FG, fontFace: "Arial" });

      seg.points.forEach((p, j) => {
        sl.addShape(prs.ShapeType.ellipse, { x: cx + 0.5, y: cy + 1.1 + j * 0.4, w: 0.1, h: 0.1, fill: { color: seg.col } });
        sl.addText(p, { x: cx + 0.75, y: cy + 1.0 + j * 0.4, w: 4.6, h: 0.35, fontSize: 10, color: FG2, fontFace: "Arial", valign: "middle" });
      });
    });

    addRobot(sl, 11.3, 5.2, 1.2);
  }

  // ═══════════════════════════════════════
  // SLIDE 10 — CLOSING
  // ═══════════════════════════════════════
  {
    const sl = prs.addSlide();
    sl.background = { color: CARD };

    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: P } });
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0.06, w: 13.33, h: 0.03, fill: { color: ACC } });

    sl.addShape(prs.ShapeType.roundRect, {
      x: 1.5, y: 1.0, w: 10.33, h: 5.5, rectRadius: 0.25,
      fill: { color: P }, shadow: { type: "outer", blur: 20, opacity: 0.15, offset: 5 },
    });

    sl.addText("Klaar voor de\nvolgende stap?", {
      x: 2, y: 2.0, w: 5.5, h: 1.6, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Arial", lineSpacing: 48,
    });

    sl.addText("Vraag een demo aan of test de API.\nWij laten u graag zien wat Planbition X kan.", {
      x: 2, y: 3.7, w: 5.5, h: 0.9, fontSize: 14, color: "FFFFFF", fontFace: "Arial", lineSpacing: 22,
    });

    sl.addShape(prs.ShapeType.roundRect, { x: 2, y: 4.8, w: 3.8, h: 0.6, rectRadius: 0.3, fill: { color: ACC } });
    sl.addText("Vraag een demo aan →", { x: 2, y: 4.8, w: 3.8, h: 0.6, fontSize: 14, bold: true, color: "FFFFFF", fontFace: "Arial", align: "center" });

    sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
      x: 2, y: 5.6, w: 5.5, h: 0.35, fontSize: 10, color: "FFFFFF", fontFace: "Arial",
    });

    addRobot(sl, 8.5, 1.5, 3.5);

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
