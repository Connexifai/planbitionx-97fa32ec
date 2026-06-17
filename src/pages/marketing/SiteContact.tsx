import { useState } from "react";
import { Mail, MapPin, Phone, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function SiteContact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", size: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast.success("Bedankt! We nemen binnen 1 werkdag contact op.");
  };

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 opacity-25">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover" src="/videos/login-bg.mp4" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220_30%_6%)]/80 via-[hsl(220_30%_6%)]/95 to-[hsl(220_30%_6%)]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10 py-20 lg:py-28 grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        {/* Left: pitch + info */}
        <div>
          <div className="text-xs uppercase tracking-[0.22em] text-[hsl(var(--brand-accent))] mb-4">Plan een demo</div>
          <h1 className="font-display text-[clamp(2.75rem,6.5vw,5rem)] leading-[0.95] tracking-tight">
            Laten we <em className="italic">kennismaken</em>.
          </h1>
          <p className="mt-6 text-lg text-white/75 max-w-md leading-relaxed">
            Vertel ons over je planning, dan laten we in 30 minuten zien hoe Planbition X dat eenvoudiger maakt.
          </p>

          <ul className="mt-10 space-y-5 text-sm">
            <li className="flex items-start gap-4">
              <Mail className="h-5 w-5 mt-0.5 text-[hsl(var(--brand-accent))]" />
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">E-mail</div>
                <a href="mailto:info@planbition.com" className="text-base text-white hover:text-[hsl(var(--brand-accent))]">info@planbition.com</a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <Phone className="h-5 w-5 mt-0.5 text-[hsl(var(--brand-accent))]" />
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Telefoon</div>
                <div className="text-base text-white">+31 (0)20 — 123 45 67</div>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <MapPin className="h-5 w-5 mt-0.5 text-[hsl(var(--brand-accent))]" />
              <div>
                <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Bezoekadres</div>
                <div className="text-base text-white">Nederland — adres op aanvraag</div>
              </div>
            </li>
          </ul>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-white/50 mb-3">Wat je krijgt</div>
            <ul className="space-y-2 text-sm text-white/80">
              {["Live demo van AI Briefing & Solver", "Antwoorden op je technische vragen", "Indicatie van implementatietijd", "Geen verkooppraat — wel een eerlijk advies"].map((t) => (
                <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-[hsl(var(--brand-accent))] mt-0.5 shrink-0" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl p-8 lg:p-12 shadow-2xl">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--brand-accent))]/20 text-[hsl(var(--brand-accent))] mb-6">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="font-display text-3xl">Dank je wel!</h3>
              <p className="mt-3 text-white/70 max-w-sm">We nemen binnen één werkdag contact op om de demo in te plannen.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Naam" required>
                  <input required value={form.name} onChange={update("name")} className={inputCls} placeholder="Jouw naam" />
                </Field>
                <Field label="Bedrijf" required>
                  <input required value={form.company} onChange={update("company")} className={inputCls} placeholder="Bedrijfsnaam" />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="E-mail" required>
                  <input required type="email" value={form.email} onChange={update("email")} className={inputCls} placeholder="naam@bedrijf.nl" />
                </Field>
                <Field label="Telefoon">
                  <input value={form.phone} onChange={update("phone")} className={inputCls} placeholder="+31 6 ..." />
                </Field>
              </div>
              <Field label="Aantal medewerkers" required>
                <select required value={form.size} onChange={update("size")} className={`${inputCls} appearance-none`}>
                  <option value="" className="bg-[hsl(220_30%_10%)]">Maak een keuze</option>
                  <option className="bg-[hsl(220_30%_10%)]">25 – 100</option>
                  <option className="bg-[hsl(220_30%_10%)]">100 – 500</option>
                  <option className="bg-[hsl(220_30%_10%)]">500 – 2.000</option>
                  <option className="bg-[hsl(220_30%_10%)]">2.000+</option>
                </select>
              </Field>
              <Field label="Vertel kort wat je zoekt">
                <textarea value={form.message} onChange={update("message")} rows={4} className={`${inputCls} resize-none`} placeholder="Bijvoorbeeld: we plannen nu in Excel en willen naar AI..." />
              </Field>

              <button type="submit" className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-[hsl(var(--brand-accent))] px-6 py-4 text-sm font-semibold text-black shadow-[0_14px_40px_-10px_hsl(var(--brand-accent)/0.8)] hover:shadow-[0_18px_50px_-10px_hsl(var(--brand-accent))] transition-all">
                Verstuur aanvraag
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <p className="text-xs text-white/50 text-center">Door te versturen ga je akkoord met onze privacyverklaring.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[hsl(var(--brand-accent))] focus:ring-2 focus:ring-[hsl(var(--brand-accent))]/30 transition-colors";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-2">
        {label}{required && <span className="text-[hsl(var(--brand-accent))]"> *</span>}
      </span>
      {children}
    </label>
  );
}