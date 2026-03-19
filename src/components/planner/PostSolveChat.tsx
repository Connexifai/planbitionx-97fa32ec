import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { SendHorizontal, User, CheckCircle2, UserPlus, Repeat2, GitBranch, AlertCircle, Smartphone, Filter } from "lucide-react";
import robotImg from "@/assets/robot-head-avatar.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import ReactMarkdown from "react-markdown";
import { buildAlternativesPayload, getRemovedAssignments } from "@/lib/buildAlternativesPayload";
import type { AlternativeConstraint, Alternative, AlternativesResponse, AlternativeChange, SearchScope } from "@/lib/buildAlternativesPayload";
import { format, parseISO } from "date-fns";
import { nl, enUS, de, fr, pt, pl, it, es } from "date-fns/locale";
import { EmployeeApprovalDialog } from "./EmployeeApprovalDialog";

interface CandidateEmployee {
  id: string;
  name: string;
}

interface SwapOption {
  dayOfWeek: number;
  label: string;
}

interface AddDayOption {
  dayOfWeek: number;
  date: string;
  label: string;
  currentEmployees: { id: string; name: string; shiftName: string }[];
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  alternatives?: Alternative[];
  baseline?: AlternativesResponse["Baseline"];
  constraintSummary?: string;
  pendingConstraint?: AlternativeConstraint;
  /** Disambiguation candidates */
  candidates?: CandidateEmployee[];
  /** Original user message to retry after disambiguation */
  originalMessage?: string;
  /** Whether this is a confirmation of an applied alternative (hides action buttons) */
  applied?: boolean;
  /** Open swap: available free days to pick from */
  swapOptions?: SwapOption[];
  /** Base constraint for open swap (missing swapDayOfWeek) */
  swapConstraintBase?: AlternativeConstraint;
  /** Add days: available days to add the employee to */
  addDayOptions?: AddDayOption[];
  /** Employee info for add_days flow */
  addDaysEmployeeId?: string;
  addDaysEmployeeName?: string;
}

export interface RosterFilterState {
  employeeNames: string[];
  conflictEmployeeName?: string;
  conflictDayDate?: string;
}

export interface PostSolveChatProps {
  requestData: any;
  solverAssignments: any[];
  solverExplanations?: any[];
  onApplyAlternative?: (alternative: Alternative) => void;
  onNavigateToEmployee?: (employeeName: string) => void;
  onFilterRoster?: (filter: RosterFilterState | null) => void;
}

// ─── Helpers to classify and explain alternatives ──────────────

type ChangeType = "direct_replacement" | "swap" | "chain";

interface ClassifiedAlternative {
  type: ChangeType;
  icon: typeof UserPlus;
  label: string;
  explanation: string;
}

function formatShiftDate(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    return format(parseISO(isoDate), "EEEE d MMM", { locale: nl });
  } catch {
    return isoDate.split("T")[0] || "";
  }
}

function formatShiftTime(start?: string, end?: string): string {
  if (!start) return "";
  const s = start.split("T")[1]?.slice(0, 5) || "";
  const e = end?.split("T")[1]?.slice(0, 5) || "";
  return e ? `${s}–${e}` : s;
}

interface PreparedAlternatives {
  filledAlts: Alternative[];
  openAlt?: Alternative;
  visibleAlts: Alternative[];
}

function prepareAlternatives(alternatives: Alternative[]): PreparedAlternatives {
  // Deduplicate by rank to avoid showing the same alternative twice
  const seen = new Set<number>();
  const deduped = alternatives.filter((a) => {
    if (seen.has(a.Rank)) return false;
    seen.add(a.Rank);
    return true;
  });
  const filledAlts = deduped.filter((a) => a.ConflictShiftFilled !== false).slice(0, 5);
  let openAlt = deduped.find((a) => a.ConflictShiftFilled === false);

  // Always create a synthetic "dienst open laten" option if the solver didn't return one
  if (!openAlt && filledAlts.length > 0) {
    const maxRank = Math.max(...deduped.map((a) => a.Rank), 0);
    openAlt = {
      Rank: maxRank + 1,
      ChangesFromBaseline: 0,
      ConflictShiftFilled: false,
      Summary: "De dienst wordt niet opgevuld en blijft open.",
      Score: { FillRatePercentage: filledAlts[0]?.Score?.FillRatePercentage ?? 0, HardViolations: 0 },
      Changes: [],
      Assignments: filledAlts[0]?.Assignments || [],
    };
  }

  // For open shift alternatives, strip all "removed" changes so only additions are shown
  if (openAlt) {
    openAlt = { ...openAlt, Changes: (openAlt.Changes || []).filter((c) => c.Action !== "removed") };
  }

  return {
    filledAlts,
    openAlt,
    visibleAlts: openAlt ? [...filledAlts, openAlt] : filledAlts,
  };
}

function formatAlternativeCount(prepared: PreparedAlternatives, t: (key: string, opts?: any) => string): string {
  if (prepared.filledAlts.length > 0) {
    return prepared.filledAlts.length === 1
      ? t("postSolve.solutionCount_one", { count: 1 })
      : t("postSolve.solutionCount_other", { count: prepared.filledAlts.length });
  }
  return prepared.openAlt ? t("postSolve.optionCount_one", { count: 1 }) : t("postSolve.solutionCount_zero");
}

/**
 * For swap requests: enrich alternatives with swap-day changes.
 * - Filters to only show alternatives where the replacing employee works on the swap day
 * - Adds synthetic changes: replacer removed from swap day, target added to swap day
 */
function enrichSwapAlternatives(
  alternatives: Alternative[],
  constraint: AlternativeConstraint,
  solverAssignments: any[],
  requestData: any,
): Alternative[] {
  if (constraint.swapDayOfWeek === undefined && !constraint.swapDate) return alternatives;

  const dayNamesNL = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
  const swapDayLabel = constraint.swapDayOfWeek !== undefined ? dayNamesNL[constraint.swapDayOfWeek] : constraint.swapDate || "";

  // Build shift name lookup
  const shiftNameMap = new Map<string, string>();
  for (const s of (requestData?.Shifts || [])) {
    shiftNameMap.set(String(s.Id), s.Name || "");
  }

  const enriched: Alternative[] = [];

  for (const alt of alternatives) {
    const addedChanges = (alt.Changes || []).filter(c => c.Action === "added");
    if (addedChanges.length === 0) {
      enriched.push(alt);
      continue;
    }

    // Find if any replacing employee works on the swap day
    const replacerIds = new Set(addedChanges.map(c => String(c.EmployeeId)));
    let foundSwapMatch = false;

    for (const replacerId of replacerIds) {
      // Find this employee's assignments on the swap day
      const swapDayAssignments = (solverAssignments || []).filter((a: any) => {
        if (String(a.PersonId) !== replacerId) return false;
        const d = new Date(a.Start);
        const solverDay = d.getDay() === 0 ? 6 : d.getDay() - 1;
        if (constraint.swapDayOfWeek !== undefined) return solverDay === constraint.swapDayOfWeek;
        if (constraint.swapDate) return a.Start?.startsWith(constraint.swapDate);
        return false;
      });

      if (swapDayAssignments.length > 0) {
        foundSwapMatch = true;
        const swapAssignment = swapDayAssignments[0];
        const replacerName = addedChanges.find(c => String(c.EmployeeId) === replacerId)?.EmployeeName || "";
        const shiftName = shiftNameMap.get(String(swapAssignment.ShiftId)) || "";

        // Add synthetic swap changes
        const swapChanges: AlternativeChange[] = [
          {
            EmployeeId: replacerId,
            EmployeeName: replacerName,
            ShiftId: String(swapAssignment.ShiftId),
            ShiftName: shiftName,
            Action: "removed",
            Reason: `${replacerName} → ${shiftName} ${swapDayLabel} (swap)`,
            Start: swapAssignment.Start,
            End: swapAssignment.End,
          },
          {
            EmployeeId: constraint.employeeId,
            EmployeeName: constraint.employeeName,
            ShiftId: String(swapAssignment.ShiftId),
            ShiftName: shiftName,
            Action: "added",
            Reason: `${constraint.employeeName} → ${swapDayLabel} (swap)`,
            Start: swapAssignment.Start,
            End: swapAssignment.End,
          },
        ];

        enriched.push({
          ...alt,
          Summary: `${constraint.employeeName} ↔ ${replacerName}`,
          Changes: [...(alt.Changes || []), ...swapChanges],
          ChangesFromBaseline: (alt.Changes?.length || 0) + swapChanges.length,
        });
      }
    }

    // If no replacer works on the swap day, skip this alternative (not a valid swap)
    if (!foundSwapMatch) continue;
  }

  return enriched;
}

function classifyAlternative(alt: Alternative, constraintEmployee?: string, isSwapRequest?: boolean, t?: (key: string, opts?: any) => string): ClassifiedAlternative {
  const tr = t || ((k: string) => k);
  // "Leave shift open" option
  if (alt.ConflictShiftFilled === false) {
    return {
      type: "direct_replacement",
      icon: AlertCircle,
      label: tr("postSolve.leaveShiftOpen"),
      explanation: alt.Summary || tr("postSolve.shiftOpenDefault", "The shift will not be filled and remains open."),
    };
  }

  const changes = alt.Changes || [];
  const added = changes.filter((c) => c.Action === "added");
  const removed = changes.filter((c) => c.Action === "removed");

  // Swap-enriched alternatives: classify as swap
  if (isSwapRequest && added.length >= 2 && removed.length >= 2) {
    return {
      type: "swap",
      icon: Repeat2,
      label: tr("postSolve.shiftSwapLabel"),
      explanation: alt.Summary || tr("postSolve.shiftSwapDefault"),
    };
  }

  if (removed.length <= 1 && added.length >= 1 && added.length <= 2) {
    const replacers = [...new Set(added.map((c) => c.EmployeeName))];
    return {
      type: "direct_replacement",
      icon: UserPlus,
      label: tr("postSolve.directReplacement"),
      explanation: alt.Summary || (
        added.length === 1
          ? tr("postSolve.directReplacementSingle", { name: replacers[0], date: formatShiftDate(added[0].Start) })
          : tr("postSolve.directReplacementMulti", { names: replacers.join(", ") })
      ),
    };
  }

  if (removed.length === 1 && added.length === 1 && removed[0].ShiftId === added[0].ShiftId) {
    return {
      type: "swap",
      icon: Repeat2,
      label: tr("postSolve.shiftSwapLabel"),
      explanation: alt.Summary || tr("postSolve.swapExplanation", { name1: removed[0].EmployeeName, name2: added[0].EmployeeName, date: formatShiftDate(added[0].Start) }),
    };
  }

  const uniqueEmployees = [...new Set(changes.map((c) => c.EmployeeName))];
  const uniqueDays = [...new Set(changes.filter((c) => c.Start).map((c) => formatShiftDate(c.Start)))];

  return {
    type: "chain",
    icon: GitBranch,
    label: tr("postSolve.chainLabel"),
    explanation: alt.Summary || (
      uniqueDays.length > 1
        ? tr("postSolve.chainMultiDay", { days: uniqueDays.length, count: uniqueEmployees.length, names: uniqueEmployees.join(", ") })
        : tr("postSolve.chainSingleDay", { count: uniqueEmployees.length, names: uniqueEmployees.join(", ") })
    ),
  };
}

// ─── Main component ────────────────────────────────────────────

export function PostSolveChat({ requestData, solverAssignments, solverExplanations, onApplyAlternative, onNavigateToEmployee, onFilterRoster }: PostSolveChatProps) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: t("chat.postSolveInitial"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalAlternative, setApprovalAlternative] = useState<Alternative | null>(null);
  const [lastConstraint, setLastConstraint] = useState<AlternativeConstraint | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /** Shared function to call the alternatives endpoint and enrich results */
  const fetchAlternatives = useCallback(async (
    constraint: AlternativeConstraint,
    scope: SearchScope
  ): Promise<AlternativesResponse> => {
    console.log("[PostSolveChat] solverAssignments count:", solverAssignments?.length, "sample:", JSON.stringify(solverAssignments?.slice(0, 2)));
    const payload = buildAlternativesPayload(requestData, solverAssignments, constraint, 10, scope);
    console.log("[PostSolveChat] FULL ALTERNATIVES PAYLOAD:", JSON.stringify(payload));
    console.log("[PostSolveChat] payload employee sample AssignedShifts:", payload?.Employees?.slice(0, 3)?.map((e: any) => ({ name: e.Name, assigned: e.AssignedShifts?.length })));

    const altRes = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/solve-alternatives`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!altRes.ok) {
      const errText = await altRes.text();
      throw new Error(`Alternatives API error: ${errText}`);
    }

    const raw = await altRes.json();
    // Normalize: solver may return lowercase keys ("alternatives") vs PascalCase ("Alternatives")
    const response: AlternativesResponse = {
      Alternatives: raw.Alternatives ?? raw.alternatives ?? [],
      Baseline: raw.Baseline ?? raw.baseline ?? { TotalAssignments: 0, FillRatePercentage: 0 },
    };
    console.log("[PostSolveChat] Parsed alternatives count:", response.Alternatives.length);
    return response;
  }, [requestData, solverAssignments]);

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isTyping) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Step 1: Parse intent via AI
      const parseRes = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-chat-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            message: msg,
            conversationHistory: messages
              .filter((m) => m.role === "user" || (m.role === "assistant" && !m.alternatives && !m.candidates && !m.swapOptions))
              .slice(-10)
              .map((m) => ({ role: m.role, content: m.content })),
            employees: requestData?.Employees || [],
            schedulePeriod: requestData ? `${requestData.Start} - ${requestData.End}` : "",
            language: i18n.language,
          }),
        }
      );

      if (!parseRes.ok) throw new Error("Intent parsing failed");
      const intent = await parseRes.json();

      if (!intent.understood) {
        if (intent.ambiguous && intent.candidates?.length > 0) {
          // Ambiguous — ask user to pick
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              content: t("postSolve.ambiguousEmployee"),
              candidates: intent.candidates,
              originalMessage: msg,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              content: `⚠️ ${intent.reason || t("postSolve.notUnderstood")}`,
            },
          ]);
        }
        setIsTyping(false);
        return;
      }

      // ── Explain intent: answer "why" questions ──
      if (intent.constraintType === "explain") {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: t("postSolve.lookingUpExplanation", { name: intent.employeeName }),
          },
        ]);

        // Find the employee object from request data for context
        const empObj = (requestData?.Employees || []).find(
          (e: any) => String(e.PersonId ?? e.Id) === String(intent.employeeId)
        );

        const explainRes = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/explain-assignment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({
              employeeId: intent.employeeId,
              employeeName: intent.employeeName,
              question: msg,
              assignments: solverAssignments || [],
              employee: empObj || null,
              shifts: requestData?.Shifts || [],
              schedulePeriod: requestData ? `${requestData.Start} - ${requestData.End}` : "",
              solverExplanations: (solverExplanations || []).filter(
                (e: any) => String(e.EmployeeId) === String(intent.employeeId)
              ),
              language: i18n.language,
            }),
          }
        );

        if (!explainRes.ok) {
          throw new Error("Explain API error");
        }

        const explainData = await explainRes.json();

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: `💡 ${explainData.explanation}`,
          },
        ]);
        setIsTyping(false);
        return;
      }

      // ── Add days intent: find free days and show options ──
      if (intent.constraintType === "add_days") {
        const dayNamesLocal = t("postSolve.dayNames", { returnObjects: true }) as string[];
        const empId = String(intent.employeeId);
        const empAssignments = (solverAssignments || []).filter(
          (a: any) => String(a.PersonId) === String(empId)
        );

        // Build shift name & employee name lookups
        const shiftNameMap = new Map<string, string>();
        for (const s of (requestData?.Shifts || [])) {
          shiftNameMap.set(String(s.Id), s.Name || "");
        }
        const empNameMap = new Map<string, string>();
        for (const e of (requestData?.Employees || [])) {
          empNameMap.set(String(e.PersonId ?? e.Id), e.Name || "");
        }

        // Iterate schedule dates to find days the employee is NOT scheduled
        const startDate = requestData?.Start ? new Date(requestData.Start) : null;
        const endDate = requestData?.End ? new Date(requestData.End) : null;
        const addDayOptions: AddDayOption[] = [];

        if (startDate && endDate) {
          const current = new Date(startDate);
          while (current <= endDate) {
            const solverDay = current.getDay() === 0 ? 6 : current.getDay() - 1;
            // Use local date to avoid UTC timezone shift
            const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;

            const empOnThisDate = empAssignments.some((a: any) => a.Start?.split("T")[0] === dateStr);

            if (!empOnThisDate) {
              const othersOnDate = (solverAssignments || [])
                .filter((a: any) => a.Start?.split("T")[0] === dateStr && String(a.PersonId) !== empId)
                .map((a: any) => ({
                  id: String(a.PersonId),
                  name: empNameMap.get(String(a.PersonId)) || String(a.PersonId),
                  shiftName: shiftNameMap.get(String(a.ShiftId)) || a.ShiftName || "",
                }));
              const uniqueOthers = Array.from(new Map(othersOnDate.map((o) => [o.id, o])).values());

              addDayOptions.push({
                dayOfWeek: solverDay,
                date: dateStr,
                label: `${dayNamesLocal[solverDay].charAt(0).toUpperCase() + dayNamesLocal[solverDay].slice(1)} ${dateStr}`,
                currentEmployees: uniqueOthers,
              });
            }
            current.setDate(current.getDate() + 1);
          }
        }

        // If a specific day was mentioned, skip the picker and directly process
        const targetDayOfWeek = intent.dayOfWeek;
        const targetDate = intent.date;
        
        if (targetDayOfWeek !== undefined || targetDate) {
          // Find the matching option
          const matchingOption = addDayOptions.find((opt) => {
            if (targetDate) return opt.date === targetDate;
            return opt.dayOfWeek === targetDayOfWeek;
          });

          if (!matchingOption) {
            // Employee is already scheduled on that day or day doesn't exist
            const dayLabel = targetDate || (targetDayOfWeek !== undefined ? dayNamesLocal[targetDayOfWeek] : "");
            const alreadyScheduled = empAssignments.some((a: any) => {
              if (targetDate) return a.Start?.split("T")[0] === targetDate;
              if (targetDayOfWeek !== undefined) {
                const d = new Date(a.Start);
                const sd = d.getDay() === 0 ? 6 : d.getDay() - 1;
                return sd === targetDayOfWeek;
              }
              return false;
            });
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now() + 1,
                role: "assistant",
                content: alreadyScheduled
                  ? t("postSolve.alreadyScheduledOn", { name: intent.employeeName, day: dayLabel })
                  : t("postSolve.outsidePeriod", { day: dayLabel }),
              },
            ]);
            setIsTyping(false);
            return;
          }

          // Directly trigger the add day flow for this option
          setIsTyping(false);
          handleAddDaySelected(matchingOption, empId, intent.employeeName);
          return;
        }

        if (addDayOptions.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              content: t("postSolve.allDaysScheduled", { name: intent.employeeName }),
            },
          ]);
          setIsTyping(false);
          return;
        }

        const currentDayCount = empAssignments.length;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: t("postSolve.addDayPrompt", { name: intent.employeeName, current: currentDayCount, total: currentDayCount + addDayOptions.length }),
            addDayOptions,
            addDaysEmployeeId: empId,
            addDaysEmployeeName: intent.employeeName,
          },
        ]);
        setIsTyping(false);
        return;
      }

      // Step 2: Build constraint
      const constraint: AlternativeConstraint = {
        employeeId: String(intent.employeeId),
        employeeName: intent.employeeName,
        type: intent.constraintType,
        dayOfWeek: intent.dayOfWeek ?? undefined,
        date: intent.date ?? undefined,
        shiftKind: intent.shiftKind ?? undefined,
        strength: "hard",
        // Swap fields
        swapDayOfWeek: intent.swapDayOfWeek ?? undefined,
        swapDate: intent.swapDate ?? undefined,
      };

      // Open swap: isSwap=true but no specific target day → ask user which free day
      const isOpenSwap = intent.isSwap === true
        && constraint.swapDayOfWeek === undefined
        && constraint.swapDate === undefined;

      if (isOpenSwap) {
        // Find the employee's free days so we can suggest them
        const dayNamesSwap = t("postSolve.dayNames", { returnObjects: true }) as string[];
        const empAssignments = (solverAssignments || []).filter(
          (a: any) => String(a.PersonId) === String(constraint.employeeId)
        );
        // Get which ISO day-of-week numbers are occupied
        const occupiedDays = new Set<number>();
        for (const a of empAssignments) {
          const d = new Date(a.Start);
          const solverDay = d.getDay() === 0 ? 6 : d.getDay() - 1; // JS→ISO
          occupiedDays.add(solverDay);
        }
        const freeDays = dayNamesSwap
          .map((name, idx) => ({ name, idx }))
          .filter(({ idx }) => !occupiedDays.has(idx));

        const conflictDay = constraint.dayOfWeek !== undefined ? dayNamesSwap[constraint.dayOfWeek] : constraint.date || "";

        if (freeDays.length === 0) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              role: "assistant",
              content: t("postSolve.swapAllDaysScheduled", { name: constraint.employeeName }),
            },
          ]);
          setIsTyping(false);
          return;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: t("postSolve.swapDayPrompt", { name: constraint.employeeName, conflictDay }),
            swapOptions: freeDays.map(d => ({ dayOfWeek: d.idx, label: d.name.charAt(0).toUpperCase() + d.name.slice(1) })),
            swapConstraintBase: constraint,
          },
        ]);
        setIsTyping(false);
        return;
      }

      // Show understanding message
      const isSwapWithTarget = intent.isSwap === true;
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: isSwapWithTarget
            ? t("postSolve.understoodSwap", { summary: intent.summary })
            : t("postSolve.understoodSearch", { summary: intent.summary }),
        },
      ]);

      setLastConstraint(constraint);

      // Debug: log target employee's assignments from solver output
      const targetEmpAssignments = (solverAssignments || []).filter(
        (a: any) => String(a.PersonId) === String(constraint.employeeId)
      );
      console.log("[PostSolveChat] Target employee debug:", {
        employeeId: constraint.employeeId,
        employeeName: constraint.employeeName,
        constraintType: constraint.type,
        dayOfWeek: constraint.dayOfWeek,
        totalSolverAssignments: solverAssignments?.length,
        targetAssignmentCount: targetEmpAssignments.length,
        targetAssignments: targetEmpAssignments.map((a: any) => ({
          ShiftId: a.ShiftId,
          PersonId: a.PersonId,
          Start: a.Start,
          End: a.End,
        })),
      });

      // Pre-check: does the employee actually have conflicting shifts?
      const removedShifts = getRemovedAssignments(
        solverAssignments,
        constraint,
        requestData?.Shifts || []
      );
      console.log("[PostSolveChat] Removed shifts:", removedShifts);

      if (removedShifts.length === 0) {
        const dayNamesConflict = t("postSolve.dayNames", { returnObjects: true }) as string[];
        let detail = "";
        if (constraint.type === "avoid_day" && constraint.dayOfWeek !== undefined) {
          detail = t("postSolve.onDay", { day: dayNamesConflict[constraint.dayOfWeek] });
        } else if (constraint.type === "avoid_date" && constraint.date) {
          detail = t("postSolve.onDate", { date: constraint.date });
        } else if (constraint.type === "avoid_shift_kind" && constraint.shiftKind) {
          detail = t("postSolve.inShiftKind", { kind: constraint.shiftKind });
        }
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: t("postSolve.noConflict", { name: constraint.employeeName, detail }),
          },
        ]);
        setIsTyping(false);
        return;
      }

      // Step 3: First search with "narrow" scope (fast, local solutions)
      const altResponse = await fetchAlternatives(constraint, "narrow");
      const swapEnriched = enrichSwapAlternatives(altResponse.Alternatives || [], constraint, solverAssignments, requestData);
      const narrowPrepared = prepareAlternatives(swapEnriched);
      const resultMsgId = Date.now() + 2;

      if (narrowPrepared.visibleAlts.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: resultMsgId,
            role: "assistant",
            content: t("postSolve.noAlternativesFound"),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: resultMsgId,
            role: "assistant",
            content: (t as any)("postSolve.alternativesFound", { count: formatAlternativeCount(narrowPrepared, t) }),
            alternatives: narrowPrepared.visibleAlts,
            baseline: altResponse.Baseline,
            constraintSummary: intent.summary,
            pendingConstraint: constraint,
          },
        ]);
      }
    } catch (error) {
      console.error("PostSolveChat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: t("postSolve.errorOccurred", { error: error instanceof Error ? error.message : t("postSolve.unknownError") }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApplyAlternative = (alt: Alternative) => {
    onApplyAlternative?.(alt);
    // Clear alternatives from all previous messages and show applied change
    setMessages((prev) => [
      ...prev.map((m) => m.alternatives ? { ...m, alternatives: undefined } : m),
      {
        id: Date.now(),
        role: "assistant",
        content: t("postSolve.changeApplied"),
        alternatives: [alt],
        applied: true,
      },
    ]);
  };

  const handleSolveForMe = (alt: Alternative) => {
    setApprovalAlternative(alt);
    setApprovalDialogOpen(true);
  };

  /** Get the constraint employee name for the current approval flow */
  const constraintEmployeeId = lastConstraint?.employeeId;
  const constraintEmployeeName = lastConstraint?.employeeName;

  const handleAllApproved = (alt: Alternative) => {
    onApplyAlternative?.(alt);
    // Clear alternatives from all previous messages and show applied change
    setMessages((prev) => [
      ...prev.map((m) => m.alternatives ? { ...m, alternatives: undefined } : m),
      {
        id: Date.now(),
        role: "assistant",
        content: t("postSolve.allApprovedApplied"),
        alternatives: [alt],
        applied: true,
      },
    ]);
  };

  const handleRejected = async (rejectedByName: string, _rejectedById: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        role: "assistant",
        content: t("postSolve.rejectedSearching", { name: rejectedByName }),
      },
    ]);
    setIsTyping(true);

    try {
      if (!lastConstraint) throw new Error(t("postSolve.noConstraintAvailable"));

      // Search with full scope to find more options
      const altResponse = await fetchAlternatives(lastConstraint, "full");
      const allAlts = altResponse.Alternatives || [];
      // Filter out alternatives that involve the rejecting employee
      const filteredAlts = allAlts.filter((a) => {
        const changes = a.Changes || [];
        return !changes.some((c) => c.EmployeeName === rejectedByName);
      });
      const prepared = prepareAlternatives(filteredAlts);

      if (prepared.visibleAlts.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: t("postSolve.noAlternativesWithout", { name: rejectedByName }),
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: (t as any)("postSolve.foundWithout", { count: formatAlternativeCount(prepared, t), name: rejectedByName }),
            alternatives: prepared.visibleAlts,
            baseline: altResponse.Baseline,
          },
        ]);
      }
    } catch (error) {
      console.error("Re-search after rejection error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: t("postSolve.reSearchError", { error: error instanceof Error ? error.message : t("postSolve.unknownError") }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /** Handle user picking a day for an open swap */
  const handleSwapDaySelected = async (baseConstraint: AlternativeConstraint, dayOfWeek: number, dayLabel: string) => {
    // Remove swap options from the message
    setMessages((prev) =>
      prev.map((m) => m.swapOptions ? { ...m, swapOptions: undefined, swapConstraintBase: undefined } : m)
    );

    // Show user "choice" as a user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: dayLabel },
    ]);
    setIsTyping(true);

    const constraint: AlternativeConstraint = {
      ...baseConstraint,
      swapDayOfWeek: dayOfWeek,
    };
    setLastConstraint(constraint);

    try {
      const dayNamesNL = ["maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag", "zondag"];
      const offDay = constraint.dayOfWeek !== undefined ? dayNamesNL[constraint.dayOfWeek] : constraint.date || "";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `🔄 **Begrepen:** ${constraint.employeeName} wil ${offDay} ruilen met ${dayLabel.toLowerCase()}.\n\n⏳ Ik zoek de beste ruilopties...`,
        },
      ]);

      // Pre-check
      const removedShifts = getRemovedAssignments(solverAssignments, constraint, requestData?.Shifts || []);
      if (removedShifts.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: `ℹ️ **${constraint.employeeName}** is niet ingepland op ${offDay}. Er is geen dienst om te ruilen.\n\nProbeer een andere dag.`,
          },
        ]);
        setIsTyping(false);
        return;
      }

      const altResponse = await fetchAlternatives(constraint, "narrow");
      // Enrich with swap-day changes: filter to only show swap-compatible alternatives
      const swapEnriched = enrichSwapAlternatives(altResponse.Alternatives || [], constraint, solverAssignments, requestData);
      const prepared = prepareAlternatives(swapEnriched);

      if (prepared.visibleAlts.length === 0) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 2, role: "assistant", content: "⚠️ Geen ruilopties gevonden voor deze combinatie." },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: `Ik heb **${formatAlternativeCount(prepared)}** gevonden:`,
            alternatives: prepared.visibleAlts,
            baseline: altResponse.Baseline,
            constraintSummary: `${constraint.employeeName} ruilt ${offDay} met ${dayLabel.toLowerCase()}`,
            pendingConstraint: constraint,
          },
        ]);
      }
    } catch (error) {
      console.error("Swap day selection error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: `❌ Er ging iets mis: ${error instanceof Error ? error.message : "Onbekende fout"}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  /** Handle user picking a day for add_days flow */
  const handleAddDaySelected = async (option: AddDayOption, targetEmployeeId: string, targetEmployeeName: string) => {
    // Remove addDayOptions from the message
    setMessages((prev) =>
      prev.map((m) => m.addDayOptions ? { ...m, addDayOptions: undefined } : m)
    );

    // Show user "choice"
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: option.label },
    ]);
    setIsTyping(true);

    try {
      const constraint: AlternativeConstraint = {
        employeeId: targetEmployeeId,
        employeeName: targetEmployeeName,
        type: "add_date",
        date: option.date,
        strength: "hard",
      };
      setLastConstraint(constraint);

      // ── Step 1: Check for open (unfilled) shifts on this date ──
      const shiftsOnDate = (requestData?.Shifts || []).filter(
        (s: any) => String(s.Start || "").startsWith(option.date)
      );

      // Count current assignments per shift (by ShiftId + Start)
      const assignmentCountByShift = new Map<string, number>();
      for (const a of (solverAssignments || [])) {
        const key = `${a.ShiftId}|${a.Start}`;
        assignmentCountByShift.set(key, (assignmentCountByShift.get(key) || 0) + 1);
      }

      // Get employee qualifications
      const targetEmp = (requestData?.Employees || []).find(
        (e: any) => String(e.PersonId ?? e.Id) === targetEmployeeId
      );
      const empQuals = (targetEmp?.Qualifications || [])
        .filter((q: any) => q.Type === "Qualification")
        .map((q: any) => q.Value);

      // Find shifts with open spots that the employee is qualified for
      const openShifts = shiftsOnDate.filter((s: any) => {
        const key = `${s.Id}|${s.Start}`;
        const assigned = assignmentCountByShift.get(key) || 0;
        const demand = s.Demand || 0;
        if (assigned >= demand) return false;

        // Check qualification match
        const requiredQuals = s.Qualifications?.AllOf || [];
        if (requiredQuals.length === 0) return true; // no qualification needed
        return requiredQuals.every((q: any) => empQuals.includes(q.Value));
      });

      console.log("[PostSolveChat] Open shifts on", option.date, ":", openShifts.length, "of", shiftsOnDate.length);

      if (openShifts.length > 0) {
        // ── Create synthetic alternatives for open shifts (no displacement needed) ──
        const openAlternatives: Alternative[] = openShifts.map((s: any, idx: number) => ({
          Rank: idx + 1,
          ChangesFromBaseline: 1,
          Summary: `${targetEmployeeName} wordt ingepland op ${s.Name} — er is nog plek (openstaande dienst).`,
          ConflictShiftFilled: true,
          Score: { FillRatePercentage: 100, HardViolations: 0 },
          Changes: [{
            EmployeeId: targetEmployeeId,
            EmployeeName: targetEmployeeName,
            ShiftId: String(s.Id),
            ShiftName: s.Name || "",
            Action: "added" as const,
            Reason: "Openstaande dienst — geen andere medewerker hoeft uitgewisseld te worden.",
            Start: s.Start,
            End: s.End,
          }],
          Assignments: [
            // Include all current assignments plus this new one
            ...(solverAssignments || []),
            { Start: s.Start, End: s.End, PersonId: targetEmployeeId, ShiftId: String(s.Id) },
          ],
        }));

        const openPrepared = prepareAlternatives(openAlternatives);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "assistant",
            content: `✅ Er ${openShifts.length === 1 ? "is" : "zijn"} **${openShifts.length} openstaande ${openShifts.length === 1 ? "dienst" : "diensten"}** op ${option.label} waar ${targetEmployeeName} direct op ingepland kan worden — zonder andere medewerkers te verplaatsen:`,
            alternatives: openPrepared.visibleAlts,
            baseline: { TotalAssignments: solverAssignments?.length || 0, FillRatePercentage: 100 },
            constraintSummary: `${targetEmployeeName} inplannen op ${option.label} (openstaand)`,
            pendingConstraint: constraint,
          },
        ]);
        setIsTyping(false);
        return;
      }

      // ── Step 2: No open shifts — fall back to solver to displace someone ──
      const othersCount = option.currentEmployees.length;
      const othersText = othersCount > 0
        ? `Er zijn geen openstaande diensten op **${option.label}**. Alle ${othersCount} plekken zijn bezet.\n\n`
        : "";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: `⏳ ${othersText}Ik zoek alternatieven waarbij ${targetEmployeeName} iemand overneemt...`,
        },
      ]);

      const altResponse = await fetchAlternatives(constraint, "full");
      const prepared = prepareAlternatives(altResponse.Alternatives || []);

      if (prepared.visibleAlts.length === 0) {
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 2, role: "assistant", content: `⚠️ Geen geschikte alternatieven gevonden voor ${option.label}.` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content: `Ik heb **${prepared.visibleAlts.length} ${prepared.visibleAlts.length === 1 ? "optie" : "opties"}** gevonden om ${targetEmployeeName} in te plannen op ${option.label}:`,
            alternatives: prepared.visibleAlts,
            baseline: altResponse.Baseline,
            constraintSummary: `${targetEmployeeName} inplannen op ${option.label}`,
            pendingConstraint: constraint,
          },
        ]);
      }
    } catch (error) {
      console.error("Add day selection error:", error);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: `❌ Er ging iets mis: ${error instanceof Error ? error.message : "Onbekende fout"}` },
      ]);
    } finally {
      setIsTyping(false);
    }
  };


  return (
    <div className="flex h-full">
      <div className="flex flex-col h-full flex-1 min-w-0 max-w-3xl">
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto roster-scroll space-y-4 px-5 pt-4 min-h-0"
        >
          {messages.map((msg) => (
            <div key={msg.id}>
              <div
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mt-0.5 overflow-hidden",
                    msg.role === "assistant" ? "bg-primary/10" : "bg-accent"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <img src={robotImg} alt="AI" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "assistant"
                      ? "bg-card border shadow-sm"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>

              {/* Alternatives cards */}
              {msg.alternatives && msg.alternatives.length > 0 && (
                <div className="mt-4 space-y-4 ml-11">
                  {/* Section header — hidden for applied confirmations */}
                  {!msg.applied && (() => {
                    // Collect unique employee names from all alternatives for filtering
                    const allNames = new Set<string>();
                    const constraintEmpName = msg.pendingConstraint?.employeeName;
                    if (constraintEmpName) allNames.add(constraintEmpName);
                    msg.alternatives!.forEach(alt => {
                      alt.Changes?.forEach(c => {
                        if (c.EmployeeName) allNames.add(c.EmployeeName);
                      });
                    });
                    // Determine conflict day date from the constraint
                    let conflictDayDate: string | undefined;
                    if (msg.pendingConstraint) {
                      const c = msg.pendingConstraint;
                      if (c.date) {
                        conflictDayDate = c.date;
                      } else if (c.dayOfWeek !== undefined && requestData?.Start) {
                        // Find the date matching this dayOfWeek in the schedule period
                        const start = new Date(requestData.Start);
                        const end = new Date(requestData.End);
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                          if ((d.getDay() + 6) % 7 === c.dayOfWeek) {
                            // Use local date to avoid UTC timezone shift
                            const yyyy = d.getFullYear();
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            const dd = String(d.getDate()).padStart(2, '0');
                            conflictDayDate = `${yyyy}-${mm}-${dd}`;
                            break;
                          }
                        }
                      }
                    }
                    return (
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        🔄 Alternatieven
                        <Badge variant="secondary" className="text-[10px] font-normal">
                          {msg.alternatives!.length} optie{msg.alternatives!.length !== 1 && "s"}
                        </Badge>
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7 gap-1.5 px-2.5"
                        onClick={() => onFilterRoster?.({
                          employeeNames: Array.from(allNames),
                          conflictEmployeeName: constraintEmpName,
                          conflictDayDate,
                        })}
                      >
                        <Filter className="h-3 w-3" />
                        Filteren
                      </Button>
                    </div>
                    );
                  })()}
                  {msg.alternatives.map((alt, altIdx) => {
                    const isSwapCtx = !!(msg.pendingConstraint?.swapDayOfWeek !== undefined || msg.pendingConstraint?.swapDate);
                    const classified = classifyAlternative(alt, msg.constraintSummary, isSwapCtx, t);
                    const TypeIcon = classified.icon;
                    const isOpenShift = alt.ConflictShiftFilled === false;
                    const isRecommended = altIdx === 0 && !isOpenShift;

                    return (
                      <div
                        key={alt.Rank}
                        className={cn(
                          "rounded-xl overflow-hidden bg-card transition-all",
                          isRecommended && "border-2 border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/10",
                          !isRecommended && !isOpenShift && "border border-border shadow-sm hover:border-primary/30 hover:shadow-md",
                          isOpenShift && "border border-dashed border-muted-foreground/30 opacity-75"
                        )}
                      >
                        {/* Colored type header */}
                        <div className={cn(
                          "px-4 py-2.5 flex items-center justify-between",
                          classified.type === "direct_replacement" && !isOpenShift && "bg-emerald-500/15 dark:bg-emerald-500/10",
                          classified.type === "swap" && "bg-sky-500/15 dark:bg-sky-500/10",
                          classified.type === "chain" && "bg-amber-500/15 dark:bg-amber-500/10",
                          isOpenShift && "bg-muted/40",
                        )}>
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold",
                              isRecommended
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : isOpenShift
                                  ? "bg-muted text-muted-foreground"
                                  : classified.type === "direct_replacement" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                                  : classified.type === "swap" ? "bg-sky-500/20 text-sky-700 dark:text-sky-400"
                                  : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                            )}>
                              {isRecommended ? "⭐" : altIdx + 1}
                            </div>
                            <div className="flex flex-col">
                              <div className={cn(
                                "flex items-center gap-1.5 text-sm font-semibold",
                                isOpenShift ? "text-muted-foreground"
                                  : classified.type === "direct_replacement" ? "text-emerald-700 dark:text-emerald-400"
                                  : classified.type === "swap" ? "text-sky-700 dark:text-sky-400"
                                  : "text-amber-700 dark:text-amber-400"
                              )}>
                                <TypeIcon className="h-4 w-4" />
                                {classified.label}
                              </div>
                              {!isOpenShift && (
                              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                                {(() => {
                                  const count = alt.ChangesFromBaseline;
                                  return <span>{count !== 1 ? t("postSolve.changeCountPlural", { count }) : t("postSolve.changeCount", { count })}</span>;
                                })()}
                              </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {isRecommended && (
                              <Badge className="text-[10px] bg-primary text-primary-foreground border-primary font-semibold">
                                {t("postSolve.recommended")}
                              </Badge>
                            )}
                            {isOpenShift && (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/30">
                                {t("postSolve.noReplacement")}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="px-4 py-2 mx-3 mb-1 mt-2 bg-muted/40 rounded-lg border border-border/50">
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isOpenShift ? "⚠️" : "💡"} {classified.explanation}
                          </p>
                        </div>

                        {/* Changes detail — hidden for open shift alternatives */}
                        {!isOpenShift && alt.Changes && alt.Changes.length > 0 && (
                          <div className="px-4 pb-3 pt-1 space-y-1.5">
                            {alt.Changes.map((change, i) => (
                              <div
                                key={i}
                                className={cn(
                                  "flex items-center gap-2 text-xs px-3 py-2 rounded-lg border",
                                  change.Action === "added"
                                    ? "bg-primary/5 text-primary border-primary/15 dark:text-primary"
                                    : "bg-destructive/5 text-destructive border-destructive/15 dark:text-destructive"
                                )}
                              >
                                <span className={cn(
                                  "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0",
                                  change.Action === "added"
                                    ? "bg-primary/15 text-primary"
                                    : "bg-destructive/15 text-destructive"
                                )}>
                                  {change.Action === "added" ? "+" : "−"}
                                </span>
                                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                  {change.EmployeeName && <button type="button" onClick={() => onNavigateToEmployee?.(change.EmployeeName)} className="font-semibold truncate underline decoration-dotted underline-offset-2 hover:text-foreground cursor-pointer transition-colors">{change.EmployeeName}</button>}
                                  {change.EmployeeName && change.ShiftName && <span className="text-muted-foreground shrink-0">→</span>}
                                  {change.ShiftName && <span className="truncate">{change.ShiftName}</span>}
                                </div>
                                {change.Start && (
                                  <span className="text-muted-foreground text-[10px] shrink-0 ml-auto whitespace-nowrap">
                                    {formatShiftDate(change.Start)} · {formatShiftTime(change.Start, change.End)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action buttons — hidden for applied alternatives */}
                        {!msg.applied && (
                        <div className={cn(
                          "border-t px-4 py-3 flex justify-end gap-2",
                          isRecommended ? "bg-primary/5" : "bg-muted/20"
                        )}>
                          <Button
                            size="sm"
                            variant={isOpenShift ? "outline" : isRecommended ? "default" : "outline"}
                            className={cn(
                              "text-xs h-8 gap-1.5 px-3",
                              isRecommended && "shadow-sm"
                            )}
                            onClick={() => handleApplyAlternative(alt)}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {isOpenShift ? t("postSolve.leaveShiftOpen") : t("postSolve.applyChange")}
                          </Button>
                          {!isOpenShift && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs h-8 gap-1.5 px-3"
                              onClick={() => handleSolveForMe(alt)}
                            >
                              <Smartphone className="h-3.5 w-3.5" />
                              {t("postSolve.solveForMe")}
                            </Button>
                          )}
                        </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Disambiguation candidates */}
              {msg.candidates && msg.candidates.length > 0 && (
                <div className="mt-3 ml-11 flex flex-wrap gap-2">
                  {msg.candidates.map((c) => (
                    <Button
                      key={c.id}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-xs"
                      disabled={isTyping}
                      onClick={() => {
                        // Replace the original message with the full name and re-send
                        const original = msg.originalMessage || "";
                        // Build a clarified message using the full name
                        const clarified = original.replace(
                          /\b\w+\b/i,
                          (match) => {
                            // Replace the first word that partially matches the candidate name
                            if (c.name.toLowerCase().includes(match.toLowerCase())) return c.name;
                            return match;
                          }
                        );
                        // If no replacement happened, just prepend the full name
                        const finalMsg = clarified === original
                          ? `${c.name}: ${original}`
                          : clarified;
                        // Remove candidates from this message
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

              {/* Open swap day picker */}
              {msg.swapOptions && msg.swapOptions.length > 0 && msg.swapConstraintBase && (
                <div className="mt-3 ml-11 flex flex-wrap gap-2">
                  {msg.swapOptions.map((opt) => (
                    <Button
                      key={opt.dayOfWeek}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-xs"
                      disabled={isTyping}
                      onClick={() => handleSwapDaySelected(msg.swapConstraintBase!, opt.dayOfWeek, opt.label)}
                    >
                      🔄 {opt.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Add days picker */}
              {msg.addDayOptions && msg.addDayOptions.length > 0 && msg.addDaysEmployeeId && (
                <div className="mt-3 ml-11 flex flex-wrap gap-2">
                  {msg.addDayOptions.map((opt) => (
                    <Button
                      key={opt.date}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-xs"
                      disabled={isTyping}
                      onClick={() => handleAddDaySelected(opt, msg.addDaysEmployeeId!, msg.addDaysEmployeeName || "")}
                    >
                      📅 {opt.label}
                      {opt.currentEmployees.length > 0 && (
                        <span className="text-muted-foreground ml-1">
                          ({opt.currentEmployees.length} {t("postSolve.scheduled")})
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              )}

            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 mt-0.5 bg-primary/10 overflow-hidden">
                <img src={robotImg} alt="AI" className="h-full w-full object-cover" />
              </div>
              <div className="rounded-xl px-4 py-3 text-sm bg-card border shadow-sm">
                <div className="flex gap-1.5 items-center text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="ml-2 text-xs">{t("chat.analyzing")}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Input */}
        <div className="bg-background pt-4 pb-3 px-5 border-t border-border">
          <div className="flex items-center gap-2 rounded-xl border-2 border-primary/20 bg-card px-4 py-3 shadow-md focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isTyping && handleSend()}
              placeholder={t("chat.postSolvePlaceholder")}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
              disabled={isTyping}
            />
            <Button
              size="sm"
              className="shrink-0 gap-1.5"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
            >
              <SendHorizontal className="h-4 w-4" />
              {t("chat.send")}
            </Button>
          </div>
        </div>
      </div>

      <EmployeeApprovalDialog
        open={approvalDialogOpen}
        onOpenChange={setApprovalDialogOpen}
        alternative={approvalAlternative}
        constraintEmployeeId={constraintEmployeeId}
        constraintEmployeeName={constraintEmployeeName}
        onAllApproved={handleAllApproved}
        onRejected={handleRejected}
      />
    </div>
  );
}
