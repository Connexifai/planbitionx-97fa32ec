import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { employeeId, employeeName, question, assignments, employee, shifts, schedulePeriod } = await req.json();

    // Build context about the employee's schedule
    const empAssignments = (assignments || []).filter(
      (a: any) => String(a.PersonId) === String(employeeId)
    );

    const dayNamesNL = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

    const scheduleLines = empAssignments.map((a: any) => {
      const d = new Date(a.Start);
      const dayName = dayNamesNL[d.getDay()];
      const startTime = a.Start?.split("T")[1]?.slice(0, 5) || "";
      const endTime = a.End?.split("T")[1]?.slice(0, 5) || "";
      const shiftName = a.ShiftName || a.ShiftId || "onbekend";
      return `- ${dayName} ${a.Start?.split("T")[0]}: ${shiftName} (${startTime}–${endTime})`;
    }).join("\n");

    // Build employee details
    const empDetails: string[] = [];
    if (employee) {
      if (employee.ContractHoursPerWeek) empDetails.push(`Contracturen: ${employee.ContractHoursPerWeek}u/week`);
      if (employee.Qualifications?.length) empDetails.push(`Kwalificaties: ${employee.Qualifications.join(", ")}`);
      if (employee.Availability) empDetails.push(`Beschikbaarheid: ${JSON.stringify(employee.Availability)}`);
      if (employee.MaxShiftsPerWeek) empDetails.push(`Max diensten/week: ${employee.MaxShiftsPerWeek}`);
      if (employee.EmploymentType) empDetails.push(`Type: ${employee.EmploymentType}`);
    }

    // Build shift overview
    const shiftOverview = (shifts || []).map((s: any) => 
      `- ${s.Name}: ${s.Start?.split("T")[1]?.slice(0, 5) || "?"} – ${s.End?.split("T")[1]?.slice(0, 5) || "?"} (${s.QualificationRequired || "geen kwalificatie"})`
    ).join("\n");

    const systemPrompt = `Je bent een AI-roosterassistent die uitlegt waarom het rooster er zo uitziet. Geef een duidelijk, beknopt antwoord in het Nederlands. Gebruik bullet points waar nuttig. Wees specifiek en verwijs naar concrete gegevens.

Medewerker: ${employeeName} (ID: ${employeeId})
${empDetails.length > 0 ? "\nMedewerkergegevens:\n" + empDetails.join("\n") : ""}

Roosterperiode: ${schedulePeriod}

Huidige planning van ${employeeName}:
${scheduleLines || "(geen diensten ingepland)"}

${shiftOverview ? "Beschikbare diensten:\n" + shiftOverview : ""}

Totaal ingeplande diensten: ${empAssignments.length}

Beantwoord de vraag van de planner. Mogelijke redenen waarom iemand wel/niet is ingepland:
- Contracturen (te weinig of te veel uren)
- Beschikbaarheid (niet beschikbaar op bepaalde dagen)
- Kwalificaties (niet gekwalificeerd voor bepaalde diensten)
- Rustregels (minimale rust tussen diensten)
- Eerlijke verdeling (workload balancing)
- Maximaal aantal diensten per week
- Vraag/bezetting (geen open plekken op die dag)

Houd het antwoord kort (max 4-5 zinnen) en relevant.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("AI gateway error:", response.status, err);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Onvoldoende credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI API error [${response.status}]: ${err}`);
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "Ik kon geen verklaring genereren.";

    return new Response(JSON.stringify({ explanation: content }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in explain-assignment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
