import { useEffect, useRef } from "react";
import { Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════════
   SLIDE DATA — 100% Planbition X
   ══════════════════════════════════════════ */

interface PptxSlide {
  type: "title" | "intro" | "stats" | "items" | "two-col" | "closing";
  title: string;
  subtitle?: string;
  tagline?: string;
  bullets?: string[];
  stats?: { val: string; label: string }[];
  items?: { name: string; desc: string }[];
  left?: { heading: string; points: string[] };
  right?: { heading: string; points: string[] };
}

const slides: PptxSlide[] = [
  /* 1 — Title */
  {
    type: "title",
    title: "Planbition X",
    subtitle: "AI-gedreven roosterplanning — de volgende generatie",
    tagline: "Solver  •  AI  •  Compliance  •  Microservice",
  },
  /* 2 — Wat is Planbition X */
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
  },
  /* 3 — Wat doet het */
  {
    type: "items",
    title: "Wat doet Planbition X?",
    subtitle: "Van briefing tot optimaal rooster in drie stappen",
    items: [
      { name: "1. Briefing in natuurlijke taal", desc: "Beschrijf voorkeuren en beperkingen in gewone taal — de AI vertaalt dit naar constraints" },
      { name: "2. AI Solver optimaliseert", desc: "De solver weegt kwalificaties, contracturen, ATW-regels en voorkeuren af voor het beste rooster" },
      { name: "3. Verstoringen afhandelen", desc: "Bij ziekte of wijzigingsverzoeken vindt de AI direct concrete alternatieven en informeert medewerkers" },
      { name: "4. Uitleg per toewijzing", desc: "Elke shift-toewijzing krijgt een score (0-100) met uitleg waarom deze medewerker is gekozen" },
      { name: "5. Real-time analytics", desc: "Bezettingsgraad heatmaps, fill rate trends, loonkosten en kwalificatieverdeling in één dashboard" },
    ],
  },
  /* 4 — Kerncijfers */
  {
    type: "stats",
    title: "Planbition X in cijfers",
    subtitle: "Meetbare resultaten vanaf dag één",
    stats: [
      { val: "<1 min", label: "Typische oplostijd" },
      { val: "100%", label: "ATW-nalevingsgraad" },
      { val: "73%", label: "Minder planningsinspanning" },
      { val: "8", label: "Ondersteunde talen" },
      { val: "€5k+", label: "Bespaard per jaar" },
    ],
  },
  /* 5 — Moderne AI technieken */
  {
    type: "items",
    title: "Moderne AI in Planbition X",
    subtitle: "Machine Learning & Deep Learning technieken",
    items: [
      { name: "TFT Demand Forecaster", desc: "Temporal Fusion Transformer — Deep Learning model dat personeelsvraag voorspelt op basis van historische patronen" },
      { name: "Bayesian Weight Optimizer", desc: "Automatisch afstellen van constraint-gewichten op basis van plannergedrag en resultaten" },
      { name: "Medewerkervoorkeur-Learner", desc: "Herkent patronen in voorkeuren en gedrag van medewerkers voor betere toewijzingen" },
      { name: "Planner-Correctie Learner", desc: "Leert van handmatige wijzigingen door planners om toekomstige roosters te verbeteren" },
      { name: "ML Warm-Start Generator", desc: "Machine Learning model dat een kwalitatief startrooster genereert voor snellere optimalisatie" },
    ],
  },
  /* 6 — Klassieke AI technieken */
  {
    type: "items",
    title: "Klassieke AI in Planbition X",
    subtitle: "Metaheuristieken & optimalisatie-algoritmen",
    items: [
      { name: "Large Neighborhood Search (LNS)", desc: "Adaptieve operatorselectie die grote delen van het rooster tegelijk herstructureert" },
      { name: "GRASP Reactive Alpha", desc: "Greedy Randomized Adaptive Search — combineert greedy constructie met gecontroleerde randomness" },
      { name: "Tabu Search", desc: "Lokaal zoekalgoritme dat cycli voorkomt door eerder bezochte oplossingen te onthouden" },
      { name: "SA-Hybride in Tabu", desc: "Simulated Annealing acceptatiecriterium geïntegreerd in Tabu Search voor betere exploratie" },
      { name: "Heuristische Warm-Start", desc: "Snelle initialisatie via domain-specifieke heuristieken als alternatief voor ML warm-start" },
    ],
  },
  /* 7 — Slimme engineering */
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
  /* 8 — Voordelen */
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
  /* 9 — Microservice */
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
        "Gebruikt door WFM, logistiek en zorg in heel Europa",
      ],
    },
  },
  /* 10 — Closing */
  {
    type: "closing",
    title: "Klaar om te starten met Planbition X?",
    subtitle: "Neem contact op voor een demo of API-toegang",
  },
];

/* ══════════════════════════════════════════
   PPTX GENERATOR
   ══════════════════════════════════════════ */

async function downloadPptx() {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const prs = new PptxGenJS();
  prs.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  prs.author = "Planbition";
  prs.title = "Planbition X — AI-gedreven roosterplanning";

  const PRIMARY = "2563EB";
  const ACCENT = "E8842C";
  const BG = "F8F9FC";
  const DARK = "111827";
  const MUTED = "6B7280";
  const WHITE = "FFFFFF";
  const LIGHT_PRIMARY = "EFF6FF";

  const addFooter = (sl: any, label: string) => {
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 6.95, w: 13.33, h: 0.55, fill: { color: WHITE } });
    sl.addText(`Planbition X  ·  ${label}`, {
      x: 0.5, y: 7.0, w: 6, h: 0.4, fontSize: 9, color: MUTED, fontFace: "Arial",
    });
    sl.addText("planbition.com", {
      x: 9, y: 7.0, w: 3.83, h: 0.4, fontSize: 9, color: MUTED, fontFace: "Arial", align: "right",
    });
  };

  const addAccentBar = (sl: any) => {
    sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 0.12, h: 7.5, fill: { color: PRIMARY } });
  };

  for (const s of slides) {
    const sl = prs.addSlide();
    sl.background = { color: BG };

    if (s.type === "title") {
      sl.background = { color: PRIMARY };
      // Accent gradient stripe
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
      sl.addText("PLANBITION", {
        x: 1, y: 1.5, w: 11, h: 0.6, fontSize: 18, color: "FFFFFF80", fontFace: "Arial", charSpacing: 8, bold: true,
      });
      sl.addText("X", {
        x: 1, y: 2.2, w: 11, h: 1.8, fontSize: 96, bold: true, color: WHITE, fontFace: "Arial",
      });
      sl.addText(s.subtitle || "", {
        x: 1, y: 4.2, w: 9, h: 0.8, fontSize: 22, color: "FFFFFFCC", fontFace: "Arial",
      });
      sl.addText(s.tagline || "", {
        x: 1, y: 5.3, w: 9, h: 0.5, fontSize: 13, color: "FFFFFF80", fontFace: "Arial",
      });
      // Bottom bar
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 7.0, w: 13.33, h: 0.5, fill: { color: "1E40AF" } });
      sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
        x: 1, y: 7.05, w: 11, h: 0.4, fontSize: 10, color: "FFFFFF99", fontFace: "Arial", align: "center",
      });
      continue;
    }

    if (s.type === "closing") {
      sl.background = { color: PRIMARY };
      sl.addShape(prs.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.08, fill: { color: ACCENT } });
      sl.addText(s.title, {
        x: 1.5, y: 2.0, w: 10.33, h: 1.4, fontSize: 40, bold: true, color: WHITE, fontFace: "Arial", align: "center",
      });
      sl.addText(s.subtitle || "", {
        x: 2, y: 3.6, w: 9.33, h: 0.8, fontSize: 20, color: "FFFFFFCC", fontFace: "Arial", align: "center",
      });
      sl.addShape(prs.ShapeType.roundRect, {
        x: 4.5, y: 4.8, w: 4.33, h: 0.7, rectRadius: 0.35, fill: { color: ACCENT },
      });
      sl.addText("Vraag een demo aan →", {
        x: 4.5, y: 4.8, w: 4.33, h: 0.7, fontSize: 16, bold: true, color: WHITE, fontFace: "Arial", align: "center",
      });
      sl.addText("info@planbition.com  ·  +31-(0)24-3529629  ·  planbition.com", {
        x: 2, y: 6.0, w: 9.33, h: 0.5, fontSize: 13, color: "FFFFFF99", fontFace: "Arial", align: "center",
      });
      continue;
    }

    // All other slides
    addAccentBar(sl);
    addFooter(sl, s.title);

    if (s.type === "intro") {
      sl.addText(s.title, {
        x: 0.8, y: 0.5, w: 11, h: 0.9, fontSize: 34, bold: true, color: DARK, fontFace: "Arial",
      });
      // Accent underline
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.35, w: 2.0, h: 0.06, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.7, w: 11, h: 1.4, fontSize: 15, color: MUTED, fontFace: "Arial", lineSpacing: 24,
      });
      if (s.bullets) {
        s.bullets.forEach((b, i) => {
          const y = 3.5 + i * 0.7;
          sl.addShape(prs.ShapeType.roundRect, {
            x: 0.8, y, w: 11.5, h: 0.58, rectRadius: 0.08, fill: { color: LIGHT_PRIMARY },
          });
          sl.addText(`✓   ${b}`, {
            x: 1.1, y, w: 11, h: 0.58, fontSize: 14, color: DARK, fontFace: "Arial", valign: "middle",
          });
        });
      }
    }

    if (s.type === "stats") {
      sl.addText(s.title, {
        x: 0.8, y: 0.6, w: 11, h: 0.9, fontSize: 34, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.45, w: 2.0, h: 0.06, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.8, w: 10, h: 0.5, fontSize: 14, color: MUTED, fontFace: "Arial",
      });
      const count = (s.stats || []).length;
      const cardW = 2.2;
      const gap = 0.3;
      const totalW = count * cardW + (count - 1) * gap;
      const startX = (13.33 - totalW) / 2;
      (s.stats || []).forEach((st, i) => {
        const x = startX + i * (cardW + gap);
        sl.addShape(prs.ShapeType.roundRect, {
          x, y: 3.0, w: cardW, h: 2.8, rectRadius: 0.18,
          fill: { color: WHITE }, shadow: { type: "outer", blur: 8, opacity: 0.1, offset: 3 },
        });
        sl.addShape(prs.ShapeType.rect, { x, y: 3.0, w: cardW, h: 0.06, fill: { color: PRIMARY } });
        sl.addText(st.val, {
          x, y: 3.4, w: cardW, h: 1.2, fontSize: 36, bold: true, color: PRIMARY,
          fontFace: "Arial", align: "center",
        });
        sl.addText(st.label, {
          x, y: 4.7, w: cardW, h: 0.8, fontSize: 12, color: MUTED,
          fontFace: "Arial", align: "center", lineSpacing: 18,
        });
      });
    }

    if (s.type === "items") {
      sl.addText(s.title, {
        x: 0.8, y: 0.4, w: 11, h: 0.8, fontSize: 30, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.15, w: 2.0, h: 0.06, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.4, w: 10, h: 0.4, fontSize: 13, color: MUTED, fontFace: "Arial",
      });
      (s.items || []).forEach((item, i) => {
        const y = 2.2 + i * 0.88;
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.6, y, w: 12, h: 0.75, rectRadius: 0.1,
          fill: { color: i % 2 === 0 ? WHITE : LIGHT_PRIMARY },
        });
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.6, y, w: 0.06, h: 0.75, rectRadius: 0, fill: { color: PRIMARY },
        });
        sl.addText(item.name, {
          x: 1.0, y, w: 3.8, h: 0.75, fontSize: 14, bold: true, color: DARK, fontFace: "Arial", valign: "middle",
        });
        sl.addText(item.desc, {
          x: 5.0, y, w: 7.4, h: 0.75, fontSize: 12, color: MUTED, fontFace: "Arial", valign: "middle",
        });
      });
    }

    if (s.type === "two-col") {
      sl.addText(s.title, {
        x: 0.8, y: 0.4, w: 11, h: 0.8, fontSize: 30, bold: true, color: DARK, fontFace: "Arial",
      });
      sl.addShape(prs.ShapeType.rect, { x: 0.8, y: 1.15, w: 2.0, h: 0.06, fill: { color: PRIMARY } });
      sl.addText(s.subtitle || "", {
        x: 0.8, y: 1.4, w: 10, h: 0.4, fontSize: 13, color: MUTED, fontFace: "Arial",
      });

      // Left column
      if (s.left) {
        sl.addShape(prs.ShapeType.roundRect, {
          x: 0.6, y: 2.2, w: 5.8, h: 4.2, rectRadius: 0.15,
          fill: { color: WHITE }, shadow: { type: "outer", blur: 6, opacity: 0.08, offset: 2 },
        });
        sl.addShape(prs.ShapeType.rect, { x: 0.6, y: 2.2, w: 5.8, h: 0.06, fill: { color: PRIMARY } });
        sl.addText(s.left.heading, {
          x: 1.0, y: 2.5, w: 5, h: 0.5, fontSize: 18, bold: true, color: PRIMARY, fontFace: "Arial",
        });
        s.left.points.forEach((p, i) => {
          sl.addText(`●  ${p}`, {
            x: 1.2, y: 3.2 + i * 0.7, w: 4.8, h: 0.6, fontSize: 13, color: DARK, fontFace: "Arial", lineSpacing: 20,
          });
        });
      }

      // Right column
      if (s.right) {
        sl.addShape(prs.ShapeType.roundRect, {
          x: 6.9, y: 2.2, w: 5.8, h: 4.2, rectRadius: 0.15,
          fill: { color: WHITE }, shadow: { type: "outer", blur: 6, opacity: 0.08, offset: 2 },
        });
        sl.addShape(prs.ShapeType.rect, { x: 6.9, y: 2.2, w: 5.8, h: 0.06, fill: { color: ACCENT } });
        sl.addText(s.right.heading, {
          x: 7.3, y: 2.5, w: 5, h: 0.5, fontSize: 18, bold: true, color: ACCENT, fontFace: "Arial",
        });
        s.right.points.forEach((p, i) => {
          sl.addText(`●  ${p}`, {
            x: 7.5, y: 3.2 + i * 0.7, w: 4.8, h: 0.6, fontSize: 13, color: DARK, fontFace: "Arial", lineSpacing: 20,
          });
        });
      }
    }
  }

  prs.writeFile({ fileName: "PlanbitionX_Presentatie.pptx" });
}

/* ══════════════════════════════════════════
   PAGE COMPONENT — download-focused
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
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Download className="w-8 h-8 text-primary" />
        </div>
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
