import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import planbitionLogo from "@/assets/planbition-logo-white-v2.png.asset.json";
import tinaAlpaca from "@/assets/tina-alpaca-transparent.png.asset.json";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, ArrowRight, User, Lock, MessageSquareText, Sparkles, LifeBuoy } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useTranslation } from "react-i18next";


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
      toast.error(t("login.error", "Invalid login credentials"));
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
                <div className="text-[clamp(3rem,7vw,5.5rem)] whitespace-nowrap">
                  <span className="text-white">Meet Planbition</span>
                  <span className="text-[hsl(var(--brand-accent))] text-[1.35em] font-black"> X</span>
                </div>
                <div className="text-2xl xl:text-3xl text-white/90 font-medium">
                  Rosters that obey rules, respect people, and ship<br />
                  in under a minute. <a href="https://www.planbition.com" target="_blank" rel="noopener noreferrer" className="underline text-[hsl(var(--brand-accent))] hover:text-blue-400">More info</a>
                </div>
              </div>

              <div className="border-t border-white/15 pt-5 max-w-xl">
                <Carousel opts={{ loop: true }} setApi={setCarouselApi} className="w-full">
                  <CarouselContent>
                    {[
                    {
                        Icon: MessageSquareText,
                        title: "AI Briefing",
                        desc: "Describe hard and soft constraints in plain language — \"Anna not on Friday\", \"no late shift for Tom if possible\".",
                      },
                      {
                        Icon: Sparkles,
                        title: "Explainable AI Solver",
                        desc: "Automatically builds a schedule that respects every rule, and explains every choice in plain language.",
                      },
                      {
                        Icon: LifeBuoy,
                        title: "AI Assistant",
                        desc: "Supports the planner with sick leave and disruptions, and proposes concrete swaps and replacements.",
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
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT — Clean light form */}
        <main
          className={`relative flex items-center justify-center text-foreground px-6 py-12 sm:px-10 transition-all duration-700 ease-out ${entered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{
            background:
              "radial-gradient(ellipse at top left, hsl(220 60% 55% / 0.10) 0%, transparent 65%), radial-gradient(ellipse at bottom right, hsl(28 90% 52% / 0.12) 0%, transparent 65%), radial-gradient(ellipse at 20% 0%, hsl(210 40% 96%) 0%, hsl(var(--background)) 60%)",
          }}
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
                {t("login.welcome", "Welcome back")}.
              </h2>
              <div className="mt-1 -ml-[15px] flex items-center gap-1">
                <img src={tinaAlpaca.url} alt="Tina" className="h-14 w-14 object-contain" />
                <p className="text-lg leading-tight">
                  <span className="font-bold text-primary">Log in</span>
                  <span className="text-foreground font-medium"> and plan with Tina.</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-foreground">
                  {t("login.username", "Username")}
                </Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="h-12 pl-10 bg-card border-2 border-border shadow-sm focus-visible:ring-[hsl(var(--brand-accent))] focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {t("login.password")}
                  </Label>
                  <button
                    type="button"
                    className="text-xs font-medium text-[hsl(var(--brand-accent))] hover:underline"
                    onClick={() => toast.info("Contact your administrator.")}
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
                    className="h-12 pl-10 pr-10 bg-card border-2 border-border shadow-sm focus-visible:ring-[hsl(var(--brand-accent))] focus-visible:ring-offset-0"
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
                className="group h-12 w-full gap-2 text-sm font-semibold text-white bg-[hsl(var(--brand-accent))] hover:bg-[hsl(var(--brand-accent))] shadow-[0_10px_30px_-10px_hsl(var(--brand-accent)/0.6)] hover:shadow-[0_14px_40px_-10px_hsl(var(--brand-accent)/0.75)] transition-all"
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
                    className="h-12 w-full gap-2.5 justify-center font-semibold text-sm border-2 border-border bg-card shadow-sm hover:border-[hsl(var(--brand-accent))] hover:text-[hsl(var(--brand-accent))] transition-colors"
                    onClick={() =>
                      toast.info(
                        `${sso.name} SSO — contact your administrator to activate this.`
                      )
                    }
                  >
                    <sso.Logo className="h-5 w-5" />
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
