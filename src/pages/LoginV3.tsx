import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import robotImg from "@/assets/robot-assistant.png";
import {
  ArrowRight,
  Brain,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

function AzureLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#f25022" d="M0 0h45.6v45.6H0z" />
      <path fill="#7fba00" d="M50.4 0H96v45.6H50.4z" />
      <path fill="#00a4ef" d="M0 50.4h45.6V96H0z" />
      <path fill="#ffb900" d="M50.4 50.4H96V96H50.4z" />
    </svg>
  );
}

export default function LoginV3() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const tm = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(tm);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      toast.error(t("login.error", "Ongeldige inloggegevens"));
      return;
    }
    setExiting(true);
    sessionStorage.setItem("just_logged_in", "true");
    setTimeout(() => navigate("/"), 800);
  };

  return (
    <div
      className={`min-h-screen bg-background text-foreground overflow-x-hidden transition-all duration-700 ease-in-out ${
        exiting ? "scale-105 opacity-0 blur-sm" : ""
      }`}
    >
      {/* Nav — mirrors Landing */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">
          <Link to="/landing" className="flex items-center gap-3">
            <img src={robotImg} alt="Planbition X" className="w-8 h-8 object-contain" />
            <span className="text-lg font-bold tracking-tight text-foreground">
              Planbition <span className="text-primary">X</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link to="/landing#features" className="hover:text-foreground transition-colors">
              {t("landing.navFeatures", "Features")}
            </Link>
            <Link to="/landing#microservice" className="hover:text-foreground transition-colors">
              {t("landing.navMicroservice", "Microservice")}
            </Link>
            <button
              onClick={() => navigate("/ai-slides")}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Brain className="w-4 h-4" /> AI Presentation
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground hover:text-primary transition-colors"
            >
              Style A ↻
            </Link>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero with login card */}
      <section className="relative min-h-screen pt-24 pb-16 px-6 overflow-hidden flex items-center">
        {/* Background video — same as Landing */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src="/videos/login-bg.mp4"
          />
          <div className="absolute inset-0 bg-background/75" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Brand / pitch column */}
          <div
            className={`transition-all duration-700 ease-out ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-sm">
              <Zap className="w-4 h-4" />
              {t("landing.badge", "AI-native workforce planning")}
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
              {t("login.heroTitle1", "Plan je rooster")}
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {t("login.heroTitle2", "in seconden met AI")}
              </span>
            </h1>

            <p className="mt-6 text-lg text-foreground/80 max-w-xl leading-relaxed drop-shadow-sm">
              {t(
                "login.heroDesc",
                "Planbition X maakt complexe roosterplanning eenvoudig. AI helpt je om sneller, slimmer en compliant te plannen."
              )}
            </p>

            <Link
              to="/landing"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              {t("login.learnMore", "Meer informatie")}
              <ChevronRight className="w-4 h-4" />
            </Link>

            <div className="mt-8 hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Briefing
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Scheduler
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                AI Assistant
              </div>
            </div>
          </div>

          {/* Login card */}
          <Card
            className={`relative w-full max-w-md justify-self-center lg:justify-self-end p-8 bg-card/90 backdrop-blur-xl border-border shadow-2xl transition-all duration-700 ease-out ${
              entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight">
                {t("login.welcome", "Welkom terug")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("login.loginSubtitle", "Log in om verder te gaan met je roosterplanning")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {t("login.username", "Username")}
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="h-11 pl-10 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {t("login.password", "Password")}
                  </Label>
                  <button
                    type="button"
                    onClick={() => toast.info("Neem contact op met je beheerder.")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {t("login.forgotPassword", "Forgot password?")}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    className="h-11 pl-10 pr-10 bg-background border-border focus-visible:ring-primary focus-visible:ring-offset-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="group h-12 w-full gap-2 text-base font-semibold"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {t("login.login", "Sign in")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground tracking-wider">
                  {t("login.useAnotherService", "or continue with")}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 w-full gap-2.5 justify-center font-semibold hover:border-primary hover:text-primary transition-colors"
              onClick={() =>
                toast.info("Azure SSO — neem contact op met je beheerder om dit te activeren.")
              }
            >
              <AzureLogo className="h-4 w-4" />
              Azure SSO
            </Button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              <Link to="/landing" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
                ← {t("login.backToLanding", "Back to homepage")}
              </Link>
            </p>
          </Card>
        </div>
      </section>

      {/* Footer — mirrors Landing */}
      <footer className="relative z-10 border-t border-border py-6 px-6 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={robotImg} alt="" className="w-5 h-5 object-contain" />
            Planbition X · {t("landing.footer", "AI-native workforce planning")}
          </div>
          <div>© {new Date().getFullYear()} Planbition. {t("landing.copyright", "All rights reserved.")}</div>
        </div>
      </footer>
    </div>
  );
}