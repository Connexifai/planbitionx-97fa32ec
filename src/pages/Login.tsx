import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, User, Lock, Sparkles, Shield, Zap, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import tinaAiImg from "@/assets/tina-ai-alpaca.png.asset.json";

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

function Auth0Logo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" d="M16 2.4l4.8 14.8H11.2L16 2.4zm0 27.2l-4.8-14.8h9.6L16 29.6zm-6.4-16h-8L9.6 0l-6.4 13.6zm-8 3.2h8l-6.4 13.6 6.4-13.6zm28.8-3.2h-8l6.4-13.6 6.4 13.6zm0 3.2l-6.4 13.6 6.4-13.6h-8z" />
    </svg>
  );
}

function OktaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="currentColor" d="M16 4c6.627 0 12 5.373 12 12s-5.373 12-12 12S4 22.627 4 16 9.373 4 16 4zm0 2.286a9.714 9.714 0 1 0 0 19.428 9.714 9.714 0 0 0 0-19.428z" />
    </svg>
  );
}

const FEATURES = [
  { icon: Sparkles, titleKey: "login.smartPlanning", fallback: "Smart AI planning", desc: "Generate compliant rosters in seconds." },
  { icon: Zap, titleKey: "login.solveTime", fallback: "Sub-minute solve time", desc: "From requirements to roster in <1 minute." },
  { icon: Shield, titleKey: "login.atwViolations", fallback: "Zero ATW violations", desc: "Hard-rule enforcement on every solve." },
];

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const tm = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveFeature((i) => (i + 1) % FEATURES.length), 4500);
    return () => clearInterval(id);
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
      className={`min-h-screen w-full bg-background text-foreground transition-all duration-700 ease-in-out ${exiting ? "scale-105 opacity-0 blur-sm" : ""}`}
    >
      <div className="absolute top-4 right-4 z-30">
        <LanguageSwitcher />
      </div>

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        {/* LEFT — Brand panel */}
        <aside
          className={`relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16 text-white transition-all duration-700 ease-out ${entered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
          style={{
            backgroundImage:
              "radial-gradient(120% 80% at 10% 0%, hsl(var(--brand-accent) / 0.95) 0%, transparent 55%), radial-gradient(100% 80% at 100% 100%, hsl(var(--primary) / 0.85) 0%, transparent 50%), linear-gradient(135deg, hsl(220 40% 10%) 0%, hsl(220 35% 14%) 100%)",
          }}
        >
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[hsl(var(--brand-accent))] opacity-30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--primary))] opacity-30 blur-3xl" />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* Top: wordmark */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md ring-1 ring-white/20">
              <span className="text-lg font-black tracking-tight">P</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-medium text-white/70">Planbition</div>
              <div className="text-xl font-black tracking-tight">
                X <span className="text-[hsl(var(--brand-accent))]">·</span> Workforce AI
              </div>
            </div>
          </div>

          {/* Middle: mascot + headline */}
          <div className="relative z-10 flex flex-col items-start gap-8 max-w-lg">
            <img
              src={robotImg}
              alt="Planbition X assistant"
              className="h-40 w-40 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] robot-float"
            />
            <div>
              <h1 className="text-4xl xl:text-5xl font-black leading-[1.05] tracking-tight">
                The intelligent way to plan your{" "}
                <span className="text-[hsl(var(--brand-accent))]">workforce</span>.
              </h1>
              <p className="mt-4 text-base xl:text-lg text-white/70 max-w-md">
                Planbition X turns labour rules, demand and preferences into a compliant roster — in under a minute.
              </p>
            </div>

            {/* Feature carousel */}
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                const active = i === activeFeature;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 transition-all duration-500 ${active ? "opacity-100 max-h-32" : "opacity-0 max-h-0 overflow-hidden"}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent))] text-[hsl(var(--brand-accent-foreground))]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t(f.titleKey, f.fallback)}</div>
                      <div className="text-xs text-white/60 mt-0.5">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
              <div className="mt-4 flex gap-1.5">
                {FEATURES.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Feature ${i + 1}`}
                    onClick={() => setActiveFeature(i)}
                    className={`h-1.5 rounded-full transition-all ${i === activeFeature ? "w-8 bg-[hsl(var(--brand-accent))]" : "w-4 bg-white/25 hover:bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom: footer line */}
          <div className="relative z-10 flex items-center justify-between text-xs text-white/50">
            <span>© {new Date().getFullYear()} Planbition</span>
            <span>Compliant · Explainable · Fast</span>
          </div>
        </aside>

        {/* RIGHT — Form panel */}
        <main
          className={`relative flex items-center justify-center px-6 py-12 sm:px-10 transition-all duration-700 ease-out ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Mobile brand badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent))] text-[hsl(var(--brand-accent-foreground))] font-black">
              P
            </div>
            <div className="font-black tracking-tight">Planbition X</div>
          </div>

          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                {t("login.welcome", "Welkom terug")}.
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t("login.loginSubtitle", "Log in om verder te gaan met je roosterplanning")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("login.username", "Gebruikersnaam")}
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Planistrator"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="h-12 pl-10 bg-card border-border focus-visible:ring-[hsl(var(--brand-accent))] focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("login.password")}
                  </Label>
                  <button
                    type="button"
                    className="text-xs font-medium text-[hsl(var(--brand-accent))] hover:underline"
                    onClick={() => toast.info("Neem contact op met je beheerder.")}
                  >
                    Wachtwoord vergeten?
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
                    className="h-12 pl-10 pr-10 bg-card border-border focus-visible:ring-[hsl(var(--brand-accent))] focus-visible:ring-offset-0"
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
                className="group h-12 w-full gap-2 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_hsl(var(--brand-accent)/0.6)] hover:shadow-[0_14px_40px_-10px_hsl(var(--brand-accent)/0.75)] transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, hsl(var(--brand-accent)) 0%, hsl(28 95% 58%) 50%, hsl(var(--primary)) 130%)",
                }}
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    {t("login.login", "Sign in")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            {/* SSO options */}
            <div className="mt-8">
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground tracking-wider">
                    {t("login.useAnotherService", "Use another service to log in")}
                  </span>
                </div>
              </div>
              <div className="grid gap-2.5">
                {[
                  { name: "Azure", provider: "azure", Logo: AzureLogo },
                  { name: "Auth0", provider: "auth0", Logo: Auth0Logo },
                  { name: "Okta", provider: "okta", Logo: OktaLogo },
                ].map((sso) => (
                  <Button
                    key={sso.provider}
                    type="button"
                    variant="outline"
                    className="h-11 w-full gap-2.5 justify-center font-semibold border-border hover:border-[hsl(var(--brand-accent))] hover:text-[hsl(var(--brand-accent))] transition-colors"
                    onClick={() =>
                      toast.info(
                        `${sso.name} SSO — neem contact op met je beheerder om dit te activeren.`
                      )
                    }
                  >
                    <sso.Logo className="h-4 w-4" />
                    {sso.name}
                  </Button>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
