import { useState, useRef, useEffect } from "react";
import { SendHorizontal, User, Loader2, AlertTriangle, CheckCircle2, X } from "lucide-react";
import robotImg from "@/assets/robot-head-avatar.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import ReactMarkdown from "react-markdown";

// Per-employee constraint (avoid_day, avoid_shift_kind, avoid_date)
export interface EmployeeConstraint {
  employeeName: string;
  personId: number;
  constraint: {
    type: "avoid_day" | "avoid_shift_kind" | "avoid_date";
    dayOfWeek?: number;
    shiftKind?: string;
    date?: string;
    strength?: "soft" | "hard";
  };
}

// Duo constraint (never_together, always_together)
export interface DuoConstraint {
  type: "never_together" | "always_together";
  employeeNameA: string;
  personIdA: number;
  employeeNameB: string;
  personIdB: number;
  strength?: "soft" | "hard";
}

// Global constraint (prioritize_shift, prioritize_days, shift_priority, min_staffing)
export interface GlobalConstraint {
  type: "prioritize_shift" | "prioritize_days" | "shift_priority" | "min_staffing";
  shiftName?: string;
  shiftNameA?: string;
  shiftNameB?: string;
  days?: number[];
  minCount?: number;
  dayOfWeek?: number;
  strength?: "soft" | "hard";
}

export type BriefingConstraint = EmployeeConstraint | DuoConstraint | GlobalConstraint;

// Type guards
export function isEmployeeConstraint(c: BriefingConstraint): c is EmployeeConstraint {
  return "constraint" in c && "personId" in c;
}
export function isDuoConstraint(c: BriefingConstraint): c is DuoConstraint {
  return "type" in c && (c as any).type === "never_together" || (c as any).type === "always_together";
}
export function isGlobalConstraint(c: BriefingConstraint): c is GlobalConstraint {
  return "type" in c && !("constraint" in c) && !("personIdA" in c);
}

interface CandidateEmployee {
  id: string;
  name: string;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  candidates?: CandidateEmployee[];
  originalMessage?: string;
}

interface AiBriefingChatProps {
  employees: any[];
  schedulePeriod: string;
  constraints: BriefingConstraint[];
  onConstraintsChange: (constraints: BriefingConstraint[]) => void;
}

const dayNames = ["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"];

function getShortName(name: string) {
  const parts = name.split(",");
  return parts.length > 1 ? parts[0].trim() : name;
}

function ConstraintTag({ c, onRemove, t }: { c: BriefingConstraint; onRemove: () => void; t: (key: string, opts?: any) => string }) {
  let label = "";
  let isHard = false;

  if (isEmployeeConstraint(c)) {
    const shortName = getShortName(c.employeeName);
    const shiftKindNames: Record<string, string> = {
      early: t("constraint.early"), day: t("constraint.day"),
      late: t("constraint.late"), night: t("constraint.night"),
    };
    let detail = "";
    if (c.constraint.type === "avoid_day") detail = dayNames[c.constraint.dayOfWeek ?? 0];
    if (c.constraint.type === "avoid_shift_kind") detail = shiftKindNames[c.constraint.shiftKind ?? ""] || c.constraint.shiftKind || "";
    if (c.constraint.type === "avoid_date") detail = c.constraint.date ?? "";
    isHard = c.constraint.strength === "hard";
    label = `${shortName} · ${detail}`;
  } else if (isDuoConstraint(c)) {
    const nameA = getShortName(c.employeeNameA);
    const nameB = getShortName(c.employeeNameB);
    isHard = c.strength === "hard";
    label = c.type === "never_together"
      ? `${nameA} ✗ ${nameB} · ${t("constraint.neverTogether")}`
      : `${nameA} ↔ ${nameB} · ${t("constraint.alwaysTogether")}`;
  } else if (isGlobalConstraint(c)) {
    isHard = c.strength === "hard";
    switch (c.type) {
      case "prioritize_shift":
        label = `⬆ ${c.shiftName} · ${t("constraint.prioritizeShift")}`;
        break;
      case "prioritize_days":
        label = `⬆ ${(c.days || []).map(d => dayNames[d]).join(", ")} · ${t("constraint.prioritizeDays")}`;
        break;
      case "shift_priority":
        label = `${c.shiftNameA} > ${c.shiftNameB}`;
        break;
      case "min_staffing": {
        const dayPart = c.dayOfWeek !== undefined ? ` ${dayNames[c.dayOfWeek]}` : "";
        const shiftPart = c.shiftName ? ` ${c.shiftName}` : "";
        label = `≥${c.minCount}${shiftPart}${dayPart} · ${t("constraint.minStaffing")}`;
        break;
      }
    }
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "gap-1 text-xs py-1 px-2",
        isHard ? "border-destructive/50 bg-destructive/10 text-destructive" : "border-primary/30 bg-primary/10 text-primary"
      )}
    >
      <span>{label}</span>
      <span className="opacity-50">({isHard ? "hard" : "soft"})</span>
      <button onClick={onRemove} className="ml-0.5 hover:opacity-100 opacity-60">
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
}

export function AiBriefingChat({ employees, schedulePeriod, constraints, onConstraintsChange }: AiBriefingChatProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: t("chat.initialMessage") },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history for AI
      const chatHistory = [...messages, userMsg]
        .filter((m) => m.id !== 1) // skip initial system message
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-constraints`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: chatHistory,
            employees,
            schedulePeriod,
            language: i18n.language,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Check for disambiguation candidates
      if (data.needsClarification && data.candidates?.length > 0) {
        const aiMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message || t("chat.multipleCandidates"),
          candidates: data.candidates,
          originalMessage: msg,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Add AI response
        const aiMsg: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: data.message || t("chat.constraintConfirm"),
        };
        setMessages((prev) => [...prev, aiMsg]);

        // Add new constraints — normalize the mixed format from the AI
        if (data.constraints && data.constraints.length > 0) {
          const newConstraints: BriefingConstraint[] = data.constraints.map((raw: any) => {
            // Per-employee constraint (has nested "constraint" object)
            if (raw.constraint) {
              return {
                employeeName: raw.employeeName,
                personId: raw.personId,
                constraint: raw.constraint,
              } as EmployeeConstraint;
            }
            // Duo constraint
            if (raw.type === "never_together" || raw.type === "always_together") {
              return {
                type: raw.type,
                employeeNameA: raw.employeeNameA,
                personIdA: raw.personIdA,
                employeeNameB: raw.employeeNameB,
                personIdB: raw.personIdB,
                strength: raw.strength || "hard",
              } as DuoConstraint;
            }
            // Global constraint
            return raw as GlobalConstraint;
          });
          onConstraintsChange([...constraints, ...newConstraints]);
        }
      }
    } catch (error) {
      console.error("Parse constraints error:", error);
      const errMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `⚠️ ${t("chat.errorOccurred")}: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const removeConstraint = (index: number) => {
    onConstraintsChange(constraints.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex justify-center">
      <div className="flex flex-col h-full min-w-0 max-w-3xl w-full px-5 pt-4">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h2 className="text-lg font-semibold">{t("chat.briefingTitle")}</h2>
            <p className="text-xs text-muted-foreground">{t("chat.briefingSubtitle")}</p>
          </div>
        </div>

        {/* Active constraints bar */}
        {constraints.length > 0 && (
          <div className="mb-3 p-3 rounded-xl border border-border/50 bg-card shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground">
                {t("constraint.activeCount", { count: constraints.length })}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {constraints.map((c, i) => (
                <ConstraintTag key={i} c={c} onRemove={() => removeConstraint(i)} t={t} />
              ))}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 overflow-y-auto roster-scroll space-y-4 px-2 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col", msg.role === "user" ? "items-end" : "items-start")}>
              <div className={cn("flex gap-3 max-w-[85%]", msg.role === "user" ? "flex-row-reverse" : "")}>
                <div className={cn("flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mt-0.5 overflow-hidden", msg.role === "assistant" ? "bg-primary/10" : "bg-accent")}>
                  {msg.role === "assistant" ? <img src={robotImg} alt="AI" className="h-full w-full object-cover" /> : <User className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className={cn("rounded-xl px-4 py-3 text-sm leading-relaxed", msg.role === "assistant" ? "bg-card border shadow-sm" : "bg-primary text-primary-foreground")}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:my-1 [&>ul]:my-1 [&>ol]:my-1">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              </div>

              {/* Disambiguation candidates */}
              {msg.candidates && msg.candidates.length > 0 && (
                <div className="mt-3 ml-11 flex flex-wrap gap-2">
                  {msg.candidates.map((c) => (
                    <Button
                      key={c.id}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-xs"
                      disabled={loading}
                      onClick={() => {
                        const original = msg.originalMessage || "";
                        const clarified = original.replace(
                          /\b\w+\b/i,
                          (match) => {
                            if (c.name.toLowerCase().includes(match.toLowerCase())) return c.name;
                            return match;
                          }
                        );
                        const finalMsg = clarified === original ? `${c.name}: ${original}` : clarified;
                        setMessages((prev) =>
                          prev.map((m) => m.id === msg.id ? { ...m, candidates: undefined } : m)
                        );
                        handleSend(finalMsg);
                      }}
                    >
                      👤 {c.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mt-0.5 bg-primary/10 overflow-hidden">
                <img src={robotImg} alt="AI" className="h-full w-full object-cover" />
              </div>
              <div className="rounded-xl px-4 py-3 text-sm bg-card border shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              </div>
            </div>
          )}
        </div>

        <div className="bg-background pt-4 pb-3 px-4 border-t border-border">
          <div className="flex items-center gap-1 mb-2">
            <span className="h-6 w-6 overflow-hidden rounded-md">
              <img src={robotImg} alt="AI" className="h-full w-full object-cover" />
            </span>
            <span className="text-xs font-medium text-muted-foreground">{t("chat.sendMessage")}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-card px-4 py-3 shadow-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder={t("chat.briefingPlaceholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              disabled={loading}
            />
            <Button size="sm" className="shrink-0 gap-1.5" onClick={() => handleSend()} disabled={!input.trim() || loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
              {t("chat.send")}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 text-center" dangerouslySetInnerHTML={{ __html: t("chat.briefingFooter") }} />
        </div>
      </div>
    </div>
  );
}
