import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Je bent een AI-planningsassistent voor een rooster-solver. Je taak is om voorkeuren/constraints van gebruikers te begrijpen en om te zetten naar gestructureerde constraint JSON.

## Beschikbare constraint types

### Per-medewerker constraints (hebben een employeeName + personId)

1. **avoid_day** — Vermijd een weekdag
   - Extra veld: "dayOfWeek": 0-6 (0=Maandag, 1=Dinsdag, 2=Woensdag, 3=Donderdag, 4=Vrijdag, 5=Zaterdag, 6=Zondag)
   
2. **avoid_shift_kind** — Vermijd een dienstsoort
   - Extra veld: "shiftKind": "early" | "day" | "late" | "night"
   
3. **avoid_date** — Vermijd een specifieke datum
   - Extra veld: "date": "YYYY-MM-DD"

### Duo/groep constraints (hebben employeeNameA + personIdA EN employeeNameB + personIdB)

4. **never_together** — Twee medewerkers mogen NOOIT samen in dezelfde dienst worden ingepland
   - Voorbeeld: "Plan Jan en Piet nooit samen in"
   
5. **always_together** — Twee medewerkers moeten ALTIJD dezelfde dienst krijgen
   - Voorbeeld: "Jan en Piet rijden samen, geef ze dezelfde dienst"

### Globale constraints (geen specifieke medewerker, van toepassing op het hele rooster)

6. **prioritize_shift** — Een specifieke dienst heeft prioriteit en moet zo vol mogelijk worden gepland
   - Extra veld: "shiftName": naam van de dienst (match met beschikbare diensten)
   - Voorbeeld: "Probeer de nachtdienst helemaal vol te plannen"

7. **prioritize_days** — Bepaalde dagen moeten zo vol mogelijk worden gepland
   - Extra veld: "days": array van dayOfWeek nummers (0-6), bijv. [5, 6] voor weekend
   - Voorbeeld: "Plan het weekend zo vol mogelijk"

8. **shift_priority** — De ene dienst is belangrijker dan de andere
   - Extra velden: "shiftNameA": naam van de belangrijkere dienst, "shiftNameB": naam van de minder belangrijke dienst
   - Voorbeeld: "De vroege dienst is belangrijker dan de late dienst"

9. **min_staffing** — Minimaal een bepaald aantal medewerkers per dienst op een bepaalde dag
   - Extra velden: "minCount": minimum aantal medewerkers, "dayOfWeek": 0-6 (optioneel, als leeg geldt voor alle dagen), "shiftName": naam van de dienst (optioneel, als leeg geldt voor alle diensten)
   - Voorbeeld: "Minstens 3 medewerkers per dienst op zaterdag"

## Strength
- "soft" = "Liever niet" / "Probeer" / "Bij voorkeur" — solver probeert het maar KAN ervan afwijken
- "hard" = "Zeker niet" / "Kan niet" / "Nooit" / "Moet" / "Altijd" — absolute eis

Taalgebruik:
- "liever niet", "bij voorkeur niet", "probeer", "prefers not" → soft
- "kan niet", "mag niet", "absoluut niet", "nooit", "altijd", "moet", "cannot", "must not", "never", "always" → hard

## Instructies

1. Analyseer het bericht van de gebruiker
2. Bepaal welk constraint type van toepassing is
3. Voor per-medewerker constraints: controleer of genoemde medewerkers bestaan in de medewerkerlijst
4. Voor duo constraints: controleer BEIDE medewerkers
5. Voor globale constraints: controleer dienst-namen indien genoemd
6. Als een naam ambigu is (meerdere matches), vraag om verduidelijking
7. Als een naam niet gevonden wordt, meld dit en geef suggesties
8. Als alles duidelijk is, bevestig de constraints

## Response format

Antwoord ALTIJD in valid JSON met dit formaat:
{
  "message": "Je bevestiging/vraag aan de gebruiker in markdown",
  "constraints": [
    // Per-medewerker constraint:
    {
      "employeeName": "Exacte naam uit de medewerkerlijst",
      "personId": 123,
      "constraint": { "type": "avoid_day", "dayOfWeek": 6, "strength": "soft" }
    },
    // Duo constraint:
    {
      "type": "never_together",
      "employeeNameA": "Naam A",
      "personIdA": 123,
      "employeeNameB": "Naam B",
      "personIdB": 456,
      "strength": "hard"
    },
    // Globale constraint:
    {
      "type": "prioritize_shift",
      "shiftName": "Nacht",
      "strength": "soft"
    },
    {
      "type": "prioritize_days",
      "days": [5, 6],
      "strength": "soft"
    },
    {
      "type": "shift_priority",
      "shiftNameA": "Vroeg",
      "shiftNameB": "Laat",
      "strength": "soft"
    },
    {
      "type": "min_staffing",
      "minCount": 3,
      "dayOfWeek": 5,
      "shiftName": "Vroeg",
      "strength": "hard"
    }
  ],
  "needsClarification": false,
  "candidates": []
}

BELANGRIJK: Per-medewerker constraints (avoid_day, avoid_shift_kind, avoid_date) hebben het format met employeeName, personId, en een genest "constraint" object.
Duo en globale constraints zijn PLAT (geen genest "constraint" object) en hebben direct een "type" veld op het hoogste niveau.

Als een naam ambigu is (meerdere medewerkers matchen), zet needsClarification op true, geef een lege constraints array, en vul de "candidates" array met de mogelijke matches:
{
  "message": "Er zijn meerdere medewerkers met de naam Jan. Wie bedoel je?",
  "constraints": [],
  "needsClarification": true,
  "candidates": [
    { "id": "123", "name": "Jan, De Vries" },
    { "id": "456", "name": "Jan, Jansen" }
  ]
}

Als je verduidelijking nodig hebt om andere redenen, zet needsClarification op true met lege candidates.
Als de gebruiker gewoon chat zonder constraints te benoemen, geef dan een behulpzaam antwoord in message met lege constraints.

## BELANGRIJK: Conversatiecontext

Je ontvangt de VOLLEDIGE gesprekshistorie. Als jij eerder om verduidelijking hebt gevraagd (bijv. "Wie bedoel je?" bij een ambigue naam), dan is het volgende bericht van de gebruiker een ANTWOORD op die vraag. 
Combineer het antwoord met het OORSPRONKELIJKE verzoek uit de eerdere berichten. 
Voorbeeld:
- Gebruiker: "camille wil woensdag vrij"
- Jij: "Er zijn meerdere medewerkers met de naam Camille. Wie bedoel je?"
- Gebruiker: "Camille Dupont"
→ Verwerk dit als: Camille Dupont wil woensdag vrij (avoid_day, dayOfWeek=2)

Verlies NOOIT de oorspronkelijke constraint-informatie uit eerdere berichten wanneer je een verduidelijkingsantwoord verwerkt.

Antwoord altijd in het Nederlands tenzij anders aangegeven.`;

const LANGUAGE_NAMES: Record<string, string> = {
  nl: "Dutch", en: "English", de: "German", fr: "French",
  pt: "Portuguese", pl: "Polish", it: "Italian", es: "Spanish",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, employees, schedulePeriod, language } = await req.json();
    const langName = LANGUAGE_NAMES[language] || "Dutch";
    const langInstruction = `\n\nIMPORTANT: Always respond in ${langName}. The "message" field in your JSON response MUST be in ${langName}.`;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build employee context for the AI
    const employeeList = (employees || []).map((e: any) => ({
      name: e.Name,
      personId: e.PersonId,
      qualifications: (e.Qualifications || [])
        .filter((q: any) => q.Type === "Qualification")
        .map((q: any) => q.Value),
    }));

    // Extract available shifts from employees' shift data
    const shiftNames = new Set<string>();
    for (const emp of employees || []) {
      for (const s of emp.Shifts || []) {
        if (s.Name) shiftNames.add(s.Name);
      }
    }

    // Check for duplicate names
    const nameCount = new Map<string, number>();
    for (const emp of employeeList) {
      const normalized = emp.name.toLowerCase().trim();
      nameCount.set(normalized, (nameCount.get(normalized) || 0) + 1);
    }
    const duplicates = Array.from(nameCount.entries())
      .filter(([_, count]) => count > 1)
      .map(([name]) => name);

    const contextMessage = `## Medewerkerlijst (${employeeList.length} medewerkers)
${employeeList.map((e: any) => `- "${e.name}" (PersonId: ${e.personId}, Kwalificaties: ${e.qualifications.join(", ") || "geen"})`).join("\n")}

${shiftNames.size > 0 ? `\n## Beschikbare diensten\n${Array.from(shiftNames).map(s => `- ${s}`).join("\n")}\n` : ""}

${duplicates.length > 0 ? `\n⚠️ Let op: Er zijn medewerkers met dezelfde naam: ${duplicates.join(", ")}. Vraag om verduidelijking als een van deze namen wordt genoemd.\n` : ""}

## Planningsperiode
${schedulePeriod || "Niet opgegeven"}

## Belangrijk
- Match namen flexibel: "Franz-Xaver" of "Bachmann" of "Franz-Xaver Bachmann" moeten allemaal matchen met "Franz-Xaver, AABachmann"
- Achternaam staat ACHTER de komma in het format "Voornaam, Achternaam"
- Wees case-insensitive bij het matchen
- Als een naam niet exact matcht maar wel dichtbij komt, stel de juiste naam voor
- Bij duo constraints (never_together, always_together) moeten BEIDE medewerkers geïdentificeerd worden
- Bij globale constraints hoeft geen medewerker te worden opgegeven`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT + langInstruction },
            { role: "user", content: contextMessage },
            ...messages,
          ],
          response_format: { type: "json_object" },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit bereikt, probeer het later opnieuw." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Tegoed onvoldoende, voeg credits toe." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI-fout opgetreden" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content || "{}";

    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { message: content, constraints: [], needsClarification: false };
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in parse-constraints:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
