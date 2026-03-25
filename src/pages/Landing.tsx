import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import robotImg from "@/assets/robot-assistant.png";
import {
  Clock,
  Shield,
  Brain,
  Users,
  BarChart3,
  Globe,
  ChevronRight,
  ArrowRight,
  Zap,
  CheckCircle2,
  MessageSquareText,
  Cpu,
  RefreshCw,
} from "lucide-react";

const featureIcons = [Brain, Shield, Clock, Users, BarChart3, Globe];



export default function Landing() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    { value: "<1min", label: t("landing.statSolveTime") },
    { value: "100%", label: t("landing.statCompliance") },
    { value: "73%", label: t("landing.statEffort") },
    { value: "50K+", label: t("landing.statCostSaving") },
  ];

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
            <a href="#features" className="hover:text-foreground transition-colors">{t("landing.navFeatures")}</a>
            <a href="#microservice" className="hover:text-foreground transition-colors">{t("landing.navMicroservice")}</a>
            
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button onClick={() => navigate("/login")} size="sm">
              {t("landing.login")} <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover" src="/videos/login-bg.mp4" />
          <div className="absolute inset-0 bg-background/70" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4" />
            {t("landing.badge")}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            {t("landing.heroTitle1")}
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t("landing.heroTitle2")}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
            {t("landing.heroDesc")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-[50px]">
            <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate("/login")}>
              {t("landing.getStarted")} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 backdrop-blur-sm" asChild>
              <a href="#features">{t("landing.seeHow")}</a>
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-16 relative z-10">
          <img src={robotImg} alt="Planbition X AI Assistant" className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl" style={{ animation: "orbit 3s ease-in-out infinite" }} />
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

      {/* How it works */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("landing.howItWorksTitle")} <span className="text-primary">{t("landing.howItWorksTitleAccent")}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {([
              { icon: MessageSquareText, step: 1, titleKey: "step1Title", descKey: "step1Desc" },
              { icon: Cpu, step: 2, titleKey: "step2Title", descKey: "step2Desc" },
              { icon: RefreshCw, step: 3, titleKey: "step3Title", descKey: "step3Desc" },
            ] as const).map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
                    {item.step}
                  </div>
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{t(`landing.${item.titleKey}`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`landing.${item.descKey}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("landing.featuresTitle")} <span className="text-primary">{t("landing.featuresTitleAccent")}</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">{t("landing.featuresDesc")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => {
              const Icon = featureIcons[n - 1];
              return (
                <Card key={n} className="p-6 bg-card border-border hover:border-primary/30 transition-colors group">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{t(`landing.feat${n}Title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`landing.feat${n}Desc`)}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Microservice Section */}
      <section id="microservice" className="py-24 md:py-32 px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              {t("landing.microBadge")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("landing.microTitle")} <span className="text-primary">{t("landing.microTitleAccent")}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t("landing.microDesc")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {([
              { icon: Globe, titleKey: "microApi", descKey: "microApiDesc" },
              { icon: Shield, titleKey: "microWhiteLabel", descKey: "microWhiteLabelDesc" },
              { icon: BarChart3, titleKey: "microMultiTenant", descKey: "microMultiTenantDesc" },
            ] as const).map((item) => (
              <Card key={item.titleKey} className="p-6 bg-card border-border">
                <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t(`landing.${item.titleKey}`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`landing.${item.descKey}`)}</p>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t("landing.microUsedBy")}</p>
            <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
              {t("landing.microCta")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={robotImg} alt="" className="w-5 h-5 object-contain" />
            Planbition X · {t("landing.footer")}
          </div>
          <div>© {new Date().getFullYear()} Planbition. {t("landing.copyright")}</div>
        </div>
      </footer>
    </div>
  );
}
