import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import planbitionLogo from "@/assets/planbition-zvoove-logo.png.asset.json";
import tinaAlpaca from "@/assets/tina-ai-alpaca.png.asset.json";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, ArrowRight, User, Lock, MessageSquareText, Sparkles, LifeBuoy } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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

export default function LoginV2() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const tm = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Autoplay
  useEffect(() => {
    if (!carouselApi) return;
    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselApi]);

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
      className={`min-h-screen w-full transition-all duration-700 ease-in-out ${exiting ? "scale-105 opacity-0 blur-sm" : ""}`}
    >
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        {/* LEFT — Video brand canvas */}
        <aside
          className={`relative hidden lg:block overflow-hidden bg-[hsl(220_30%_8%)] text-white transition-all duration-700 ease-out ${entered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"}`}
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
                "radial-gradient(ellipse at top left, hsl(28 90% 45% / 0.20) 0%, transparent 65%), radial-gradient(ellipse at bottom right, hsl(220 60% 55% / 0.22) 0%, transparent 65%), linear-gradient(135deg, hsl(220 40% 8% / 0.35) 0%, hsl(220 40% 8% / 0.10) 50%, hsl(28 90% 32% / 0.20) 100%)",
            }}
          />
          {/* Editorial overlay */}
          <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16 text-white">
            <div className="flex items-start justify-between">
              <img src={planbitionLogo.url} alt="Planbition" className="h-12 object-contain" />
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

              <div className="border-t border-white/15 pt-5 max-w-xl">
                <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
                  <CarouselContent>
                    {[
                      {
                        Icon: MessageSquareText,
                        title: "AI Briefing",
                        desc: "Geef in mensentaal harde en zachte restricties mee — \"Anna niet op vrijdag\", \"liefst geen late dienst voor Tom\".",
                      },
                      {
                        Icon: Sparkles,
                        title: "Uitlegbare AI Solver",
                        desc: "Maakt automatisch een planning die alle regels respecteert en legt elke keuze in begrijpelijke taal uit.",
                      },
                      {
                        Icon: LifeBuoy,
                        title: "AI Assistent",
                        desc: "Ondersteunt de planner bij ziekmeldingen en verstoringen, en doet concrete voorstellen voor swaps en invallers.",
                      },
                    ].map(({ Icon, title, desc }) => (
                      <CarouselItem key={title}>
                        <div className="flex gap-4 rounded-xl border border-white/15 bg-black/30 p-4 backdrop-blur-md">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent))]/20 text-[hsl(var(--brand-accent))]">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-base font-semibold tracking-tight text-white">{title}</div>
                            <div className="text-sm text-white/80 leading-relaxed mt-1">{desc}</div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <div className="mt-3 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      onClick={() => carouselApi?.scrollTo(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === currentSlide ? "w-5 bg-[hsl(var(--brand-accent))]" : "w-1.5 bg-white/30 hover:bg-white/50"
                      }`}
                      aria-label={`Ga naar slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT — Clean light form */}
        <main
          className={`relative flex items-center justify-center overflow-hidden text-foreground px-6 py-12 sm:px-10 transition-all duration-700 ease-out ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ background: "#ffffff" }}
        >
          {/* Editorial corner mascot */}
          <img
            src={tinaAlpaca.url}
            alt=""
            aria-hidden
            className="pointer-events-none absolute bottom-6 right-6 hidden h-24 w-24 object-contain opacity-30 xl:block"
          />

          {/* Top-right controls */}
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Style B
            </span>
            <LanguageSwitcher />
          </div>

          {/* Mobile brand badge */}
          <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent))] text-[hsl(var(--brand-accent-foreground))] font-black">
              P
            </div>
            <div className="font-black tracking-tight">Planbition X</div>
          </div>

          <div className="relative z-10 w-full max-w-md">
            {/* Editorial header */}
            <div className="mb-10 flex items-end justify-between border-b border-slate-900 pb-6">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                  Planbition X
                </p>
                <h2
                  className="text-5xl tracking-tight text-slate-900"
                  style={{ fontFamily: "'Instrument Serif', ui-serif, Georgia, serif", fontWeight: 400 }}
                >
                  {t("login.welcome", "Welkom terug")}
                </h2>
              </div>
              <img
                src={tinaAlpaca.url}
                alt="Tina"
                className="hidden h-12 w-12 object-contain opacity-60 sm:block"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  {t("login.username", "Username")}
                </Label>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-3 text-slate-900 outline-none transition-colors placeholder:text-slate-300 focus:border-[hsl(var(--brand-accent))]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    {t("login.password")}
                  </Label>
                  <button
                    type="button"
                    className="text-[10px] font-bold uppercase tracking-[0.18em] text-[hsl(var(--brand-accent))] hover:underline"
                    onClick={() => toast.info("Neem contact op met je beheerder.")}
                  >
                    {t("login.forgotPassword", "Forgot?")}
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="current-password"
                    className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-3 pr-8 text-slate-900 outline-none transition-colors placeholder:text-slate-300 focus:border-[hsl(var(--brand-accent))]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="group mt-2 h-14 w-full gap-2 rounded-none text-xs font-bold uppercase tracking-[0.2em] text-white bg-[hsl(var(--brand-accent))] hover:bg-[hsl(28,90%,45%)] transition-all"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    {t("login.login", "Sign into Account")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            {/* SSO options */}
            <div className="mt-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-white px-4 font-bold tracking-[0.2em] text-slate-400">
                    {t("login.useAnotherService", "Use another service to log in")}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-0 -space-x-px">
                {[
                  { name: "Azure", provider: "azure", Logo: AzureLogo },
                  { name: "Auth0", provider: "auth0", Logo: Auth0Logo },
                  { name: "Okta", provider: "okta", Logo: OktaLogo },
                ].map((sso) => (
                  <button
                    key={sso.provider}
                    type="button"
                    className="flex h-12 items-center justify-center gap-2 border border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-700 transition-colors hover:bg-slate-50 hover:text-[hsl(var(--brand-accent))]"
                    onClick={() =>
                      toast.info(
                        `${sso.name} SSO — neem contact op met je beheerder om dit te activeren.`
                      )
                    }
                  >
                    <sso.Logo className="h-4 w-4" />
                    {sso.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer accent bar */}
            <div className="mt-12 flex h-1 w-full">
              <div className="h-full w-1/3 bg-[hsl(var(--brand-accent))]" />
              <div className="h-full w-2/3 bg-slate-100" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
