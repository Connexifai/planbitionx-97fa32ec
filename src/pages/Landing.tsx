import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import robotImg from "@/assets/robot-assistant.png";
import {
  Clock,
  Shield,
  Brain,
  Users,
  BarChart3,
  Globe,
  ChevronRight,
  Star,
  ArrowRight,
  Zap,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Optimization",
    desc: "Generate optimal rosters in seconds using advanced solver technology that balances compliance, preferences, and efficiency.",
  },
  {
    icon: Shield,
    title: "WTA Compliance Built-In",
    desc: "Automatic enforcement of working time regulations, rest periods, and legal requirements — zero manual checking.",
  },
  {
    icon: Clock,
    title: "Solve in Seconds",
    desc: "What used to take hours of manual planning now happens in under 16 seconds with enterprise-grade accuracy.",
  },
  {
    icon: Users,
    title: "Smart Shift Swaps",
    desc: "AI-assisted disruption handling for sick leave, shift swaps, and last-minute changes with concrete alternatives.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Occupancy heatmaps, fill rate trends, labor cost estimates, and qualification distribution — all at a glance.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    desc: "Available in 8 languages including Dutch, German, French, English, Spanish, Italian, Portuguese, and Polish.",
  },
];

const testimonials = [
  {
    name: "Sarah van den Berg",
    role: "Operations Manager, LogiFlow BV",
    quote: "Planbition X reduced our planning time from 6 hours to under 2 minutes. The WTA compliance alone saved us from costly violations.",
    stars: 5,
  },
  {
    name: "Thomas Müller",
    role: "HR Director, MedCare GmbH",
    quote: "The AI assistant is a game-changer. When someone calls in sick, we have a qualified replacement suggestion within seconds.",
    stars: 5,
  },
  {
    name: "Marie Dubois",
    role: "Planning Lead, TransEurope SA",
    quote: "Finally a tool that understands the complexity of 24/7 shift planning. Our employees are happier and our coverage is better than ever.",
    stars: 5,
  },
];

const stats = [
  { value: "16s", label: "Average solve time" },
  { value: "99.8%", label: "WTA compliance rate" },
  { value: "73%", label: "Less planning effort" },
  { value: "8", label: "Languages supported" },
];

const tiers = [
  { name: "Free", maxEmp: 25, pricePerEmp: 0, features: ["AI roster optimization", "WTA compliance engine", "Basic analytics"] },
  { name: "Pro", maxEmp: 200, pricePerEmp: 3.5, features: ["Everything in Free", "Shift swap assistant", "Multi-language", "Priority support"] },
  { name: "Enterprise", maxEmp: Infinity, pricePerEmp: 2.5, features: ["Everything in Pro", "Custom integrations", "Dedicated account manager", "SLA guarantee"] },
];

function PricingCalculator({ onGetStarted }: { onGetStarted: () => void }) {
  const [employeeCount, setEmployeeCount] = useState(50);

  const pricing = useMemo(() => {
    if (employeeCount <= 25) return { tier: tiers[0], monthly: 0 };
    if (employeeCount <= 200) return { tier: tiers[1], monthly: employeeCount * tiers[1].pricePerEmp };
    return { tier: tiers[2], monthly: employeeCount * tiers[2].pricePerEmp };
  }, [employeeCount]);

  return (
    <section id="pricing" className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, transparent <span className="text-primary">pricing</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Drag the slider to see what Planbition X costs for your team.
          </p>
        </div>

        {/* Slider */}
        <Card className="p-8 md:p-10 bg-card border-border max-w-xl mx-auto mb-12">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">Employees</span>
            <span className="text-3xl font-extrabold text-foreground">{employeeCount}</span>
          </div>
          <Slider
            value={[employeeCount]}
            onValueChange={(v) => setEmployeeCount(v[0])}
            min={5}
            max={500}
            step={5}
            className="my-6"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5</span>
            <span>500</span>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <div className="text-sm text-muted-foreground mb-1">{pricing.tier.name} plan</div>
            <div className="text-4xl font-extrabold text-foreground">
              €{Math.round(pricing.monthly)}
              <span className="text-lg font-normal text-muted-foreground">/mo</span>
            </div>
            {pricing.tier.pricePerEmp > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                €{pricing.tier.pricePerEmp}/employee/month
              </div>
            )}
            {pricing.monthly === 0 && (
              <div className="text-sm text-muted-foreground mt-1">Free up to 25 employees</div>
            )}
          </div>
        </Card>

        {/* Tier cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isActive =
              tier.name === pricing.tier.name;
            return (
              <Card
                key={tier.name}
                className={`p-6 bg-card flex flex-col transition-all ${
                  isActive ? "border-primary ring-2 ring-primary/20 scale-[1.02]" : "border-border"
                }`}
              >
                <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  {tier.pricePerEmp === 0
                    ? "€0 · up to 25 employees"
                    : tier.maxEmp === Infinity
                    ? `€${tier.pricePerEmp}/emp/mo · 200+`
                    : `€${tier.pricePerEmp}/emp/mo · up to ${tier.maxEmp}`}
                </div>
                <ul className="text-sm space-y-2 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={isActive ? "default" : "outline"}
                  className="w-full"
                  onClick={onGetStarted}
                >
                  {tier.pricePerEmp === 0 ? "Start free" : "Get started"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-3">
            <img src={robotImg} alt="Planbition X" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Planbition <span className="text-primary">X</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <Button onClick={() => navigate("/login")} size="sm">
            Log in <ChevronRight className="ml-1 w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        {/* Video background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src="/videos/login-bg.mp4"
          />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-4 h-4" />
            AI-driven roster planning
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Stop planning.
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Start optimizing.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Planbition X transforms workforce scheduling from hours of manual puzzle‑work
            into AI‑powered, WTA‑compliant rosters — generated in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate("/login")}>
              Get started free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12" asChild>
              <a href="#features">See how it works</a>
            </Button>
          </div>
        </div>

        {/* Floating robot */}
        <div className="flex justify-center mt-16 relative z-10">
          <img
            src={robotImg}
            alt="Planbition X AI Assistant"
            className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl"
            style={{ animation: "orbit 3s ease-in-out infinite" }}
          />
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="py-8 md:py-10 text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-primary">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need for <span className="text-primary">smarter scheduling</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From automated compliance to real‑time disruption handling, Planbition X covers the full planning lifecycle.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card
                key={f.title}
                className="p-6 bg-card border-border hover:border-primary/30 transition-colors group"
              >
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 md:py-32 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Trusted by planning teams <span className="text-primary">across Europe</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 bg-card border-border flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-foreground/90 flex-1 mb-6">
                  "{t.quote}"
                </blockquote>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <PricingCalculator onGetStarted={() => navigate("/login")} />

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={robotImg} alt="" className="w-5 h-5 object-contain" />
            Planbition X · AI-driven roster planning
          </div>
          <div>© {new Date().getFullYear()} Planbition. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
