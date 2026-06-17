import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LoginV2() {
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
      className={`min-h-screen w-full bg-[hsl(220_30%_8%)] text-white transition-all duration-700 ease-in-out ${exiting ? "scale-105 opacity-0 blur-sm" : ""}`}
    >
      <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
        <Link
          to="/login"
          className="text-xs font-medium uppercase tracking-[0.18em] text-white/60 hover:text-[hsl(var(--brand-accent))] transition-colors"
        >
          Style A ↺
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
        {/* LEFT — Editorial form */}
        <main
          className={`relative flex flex-col justify-between px-8 py-10 sm:px-14 lg:px-20 xl:px-28 transition-all duration-700 ease-out ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          {/* Brand mark */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[hsl(var(--brand-accent))] text-[hsl(220_40%_10%)] font-black text-lg">
              P
            </div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">
              Planbition / X
            </div>
          </div>

          {/* Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <div className="mb-2 text-xs font-mono uppercase tracking-[0.25em] text-[hsl(var(--brand-accent))]">
              01 — Access
            </div>
            <h1 className="text-5xl xl:text-6xl font-black tracking-tight leading-[0.95]">
              Sign in.
              <br />
              <span className="text-white/40">Plan smarter.</span>
            </h1>
            <p className="mt-5 text-sm text-white/60 max-w-sm leading-relaxed">
              {t("login.loginSubtitle", "Log in om verder te gaan met je roosterplanning")}
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-7">
              <div className="space-y-2 border-b border-white/15 pb-3 focus-within:border-[hsl(var(--brand-accent))] transition-colors">
                <Label htmlFor="email" className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">
                  {t("login.username", "Username")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="h-9 px-0 bg-transparent border-0 text-lg text-white placeholder:text-white/25 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                />
              </div>

              <div className="space-y-2 border-b border-white/15 pb-3 focus-within:border-[hsl(var(--brand-accent))] transition-colors">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/50">
                    {t("login.password")}
                  </Label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="h-9 px-0 bg-transparent border-0 text-lg text-white placeholder:text-white/25 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  className="text-xs font-medium text-white/50 hover:text-[hsl(var(--brand-accent))] transition-colors"
                  onClick={() => toast.info("Neem contact op met je beheerder.")}
                >
                  {t("login.forgotPassword", "Forgot password?")}
                </button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="group h-12 gap-2 rounded-none bg-[hsl(var(--brand-accent))] px-7 text-sm font-bold uppercase tracking-[0.15em] text-[hsl(220_40%_10%)] hover:bg-[hsl(var(--brand-accent))]/90"
                >
                  {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[hsl(220_40%_10%)]/30 border-t-[hsl(220_40%_10%)]" />
                  ) : (
                    <>
                      {t("login.login", "Sign in")}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* SSO row — compact pills */}
            <div className="mt-10">
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/40 mb-3">
                Or via SSO
              </div>
              <div className="flex flex-wrap gap-2">
                {["Azure", "Auth0", "Okta"].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toast.info(`${name} SSO — neem contact op met je beheerder om dit te activeren.`)}
                    className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-white/20 text-white/70 hover:border-[hsl(var(--brand-accent))] hover:text-[hsl(var(--brand-accent))] transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.22em] text-white/35">
            <span>© {new Date().getFullYear()} Planbition</span>
            <span>Compliant · Explainable · Fast</span>
          </div>
        </main>

        {/* RIGHT — Video brand canvas */}
        <aside
          className={`relative hidden lg:block overflow-hidden transition-all duration-700 ease-out ${entered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"}`}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/login-bg.mp4"
          />
          {/* Tint overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(220 40% 8% / 0.55) 0%, hsl(220 40% 8% / 0.25) 50%, hsl(28 90% 30% / 0.35) 100%)",
            }}
          />
          {/* Grid texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />

          {/* Editorial overlay */}
          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16 text-white">
            <div className="flex items-start justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
                The AI solution
                <br />
                for workforce planning
              </div>
              <a
                href="https://www.planbition.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/70 hover:text-[hsl(var(--brand-accent))] transition-colors"
              >
                planbition.com
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="space-y-6">
              <div className="font-black leading-[0.85] tracking-tighter">
                <div className="text-[clamp(7rem,18vw,16rem)] text-[hsl(var(--brand-accent))]">
                  X
                </div>
                <div className="text-2xl xl:text-3xl text-white/90 -mt-4 max-w-md">
                  Rosters that obey rules, respect people, and ship in under a minute.
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 border-t border-white/15 pt-6 max-w-xl">
                {[
                  { k: "<60s", v: "Solve time" },
                  { k: "100%", v: "Rule-compliant" },
                  { k: "AI", v: "Explainable" },
                ].map((s) => (
                  <div key={s.v}>
                    <div className="text-2xl xl:text-3xl font-black text-[hsl(var(--brand-accent))]">{s.k}</div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
