import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";

const nav = [
  { to: "/site", label: "Home", end: true },
  { to: "/site/product", label: "Product" },
  { to: "/site/over-ons", label: "Over ons" },
  { to: "/site/contact", label: "Contact" },
];

export default function SiteLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="min-h-screen bg-[hsl(220_30%_6%)] text-white font-sans antialiased selection:bg-[hsl(var(--brand-accent))] selection:text-black">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[hsl(220_30%_6%)]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/site" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent))] text-black font-black">P</div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-xl tracking-tight">Planbition</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">a zvoove company</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    isActive ? "text-white bg-white/10" : "text-white/70 hover:text-white"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login-v2" className="text-sm font-medium text-white/80 hover:text-white">
              Inloggen
            </Link>
            <Link
              to="/site/contact"
              className="group inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--brand-accent))] px-5 py-2.5 text-sm font-semibold text-black shadow-[0_10px_30px_-10px_hsl(var(--brand-accent)/0.7)] hover:shadow-[0_14px_40px_-10px_hsl(var(--brand-accent)/0.9)] transition-all"
            >
              Plan demo
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden text-white/80"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-white/10 bg-[hsl(220_30%_6%)] px-6 py-6 space-y-3">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `block text-lg font-medium ${isActive ? "text-[hsl(var(--brand-accent))]" : "text-white/80"}`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="pt-4 flex gap-3 border-t border-white/10">
              <Link to="/login-v2" className="flex-1 text-center rounded-full border border-white/20 py-2.5 text-sm font-medium">Inloggen</Link>
              <Link to="/site/contact" className="flex-1 text-center rounded-full bg-[hsl(var(--brand-accent))] py-2.5 text-sm font-semibold text-black">Plan demo</Link>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--brand-accent))] text-black font-black">P</div>
              <span className="font-display text-2xl">Planbition</span>
            </div>
            <p className="max-w-md text-sm text-white/60 leading-relaxed">
              De online oplossing voor workforce management. Slimme planning voor slimme mensen — met uitlegbare AI die roosters maakt die kloppen.
            </p>
            <p className="text-xs text-white/40">
              Onderdeel van de zvoove-groep. Zusterbedrijf van{" "}
              <a href="https://www.recruitnow.nl" target="_blank" rel="noreferrer" className="underline hover:text-white">RecruitNow</a>.
            </p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Product</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/site/product" className="hover:text-white">Functionaliteit</Link></li>
              <li><Link to="/site/product#ai" className="hover:text-white">AI Solver</Link></li>
              <li><Link to="/site/product#hr" className="hover:text-white">HR & CAO</Link></li>
              <li><Link to="/login-v2" className="hover:text-white">Inloggen</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">Contact</div>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/site/over-ons" className="hover:text-white">Over ons</Link></li>
              <li><Link to="/site/contact" className="hover:text-white">Plan demo</Link></li>
              <li><a href="mailto:info@planbition.com" className="hover:text-white">info@planbition.com</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Planbition. Alle rechten voorbehouden.
        </div>
      </footer>
    </div>
  );
}