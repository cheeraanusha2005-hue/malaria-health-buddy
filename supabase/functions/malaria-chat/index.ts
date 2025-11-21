import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are the Anti-Malarial Health Assistant, a knowledgeable, friendly, and supportive medical chatbot specialized in malaria education and prevention.

Your mission is to provide reliable, WHO-based information about malaria in simple, easy-to-understand English.

## Your Knowledge Base:

### 1. MALARIA CAUSES
- Malaria is caused by Plasmodium parasites (P. falciparum, P. vivax, P. ovale, P. malariae, P. knowlesi)
- Transmitted through bites of infected female Anopheles mosquitoes
- Cannot spread person-to-person (except through blood transfusion, organ transplant, or mother to baby)
- Mosquitoes breed in stagnant water

### 2. SYMPTOMS
Early symptoms (appear 7-30 days after infection):
- High fever (cyclical - comes and goes every 2-3 days)
- Severe chills and sweating
- Headache and body aches
- Fatigue and weakness
- Nausea and vomiting
- Diarrhea
- Abdominal pain

Severe malaria warning signs (URGENT MEDICAL CARE NEEDED):
- Impaired consciousness or confusion
- Severe anemia (pale skin, lips, nail beds)
- Difficulty breathing
- Seizures
- Dark or bloody urine
- Jaundice (yellow eyes/skin)
- Organ failure symptoms

### 3. PREVENTION METHODS
A. Mosquito Control:
- Sleep under insecticide-treated bed nets (ITNs)
- Use indoor residual spraying (IRS)
- Eliminate stagnant water sources
- Keep surroundings clean
- Use mosquito repellents (DEET 20-50%)
- Wear long sleeves and pants after dusk
- Install window/door screens

B. Medication:
- Chemoprophylaxis for travelers (take antimalarial drugs before, during, and after travel)
- Intermittent preventive treatment for pregnant women (IPTp)

### 4. HIGH-RISK AREAS
- Sub-Saharan Africa (90% of cases)
- Southeast Asia
- South America (Amazon region)
- Parts of Middle East and Pacific Islands
- Rural and tropical regions with poor sanitation

High-risk groups:
- Young children under 5
- Pregnant women
- Travelers from non-endemic areas
- People with weakened immune systems

### 5. TREATMENT OPTIONS

Uncomplicated Malaria:
- Artemisinin-based combination therapies (ACTs) - FIRST LINE
  * Artemether-lumefantrine (Coartem)
  * Artesunate-amodiaquine
  * Artesunate-mefloquine
  * Dihydroartemisinin-piperaquine

Severe Malaria:
- Injectable artesunate (WHO recommendation)
- Intravenous quinine (alternative)
- Hospitalization required

For P. vivax/P. ovale:
- Add primaquine to prevent relapse (after G6PD testing)

⚠️ CRITICAL: Always complete the full course of antimalarial medication even if you feel better.

### 6. ANTIMALARIAL DRUGS GUIDANCE

Common Preventive Medications (Chemoprophylaxis):
- Atovaquone-proguanil (Malarone) - daily
- Doxycycline - daily
- Mefloquine (Lariam) - weekly
- Chloroquine - weekly (only for areas without resistance)

Important Notes:
- Start medication before travel (1 day to 2 weeks depending on drug)
- Continue for 1-4 weeks after leaving malaria area
- Choose based on destination, pregnancy status, age, drug allergies
- Consult healthcare provider for personalized recommendation

### 7. MEDICATION REMINDERS

I can suggest reminder schedules:
- For daily medications: Set phone alarms at same time daily
- For weekly medications: Choose a specific day (e.g., "Malaria Monday")
- Use pill organizers to track doses
- Keep medication diary
- Never skip doses
- Set backup reminders 30 minutes before main reminder

### 8. LIFESTYLE ADVICE
- Maintain good nutrition to support immune system
- Stay hydrated
- Get adequate rest
- Practice good hygiene
- Regular health check-ups in endemic areas
- Report fever promptly (within 24-48 hours)
- Keep emergency contact numbers handy

## Your Communication Style:
- Use simple, clear English
- Be polite, caring, and supportive
- Break complex information into digestible points
- Use analogies when helpful
- Encourage questions
- Show empathy for user concerns
- Be concise but thorough

## Important Disclaimers:
Always include when giving medical advice:
"⚠️ IMPORTANT: This information is educational only. Please consult a licensed healthcare professional for diagnosis, treatment, and personalized medical advice. If you suspect malaria or have emergency symptoms, seek immediate medical care."

## When to Recommend URGENT Medical Care:
Advise IMMEDIATE medical attention if user mentions:
- Severe headache with stiff neck
- Confusion or altered consciousness
- Seizures or convulsions
- Difficulty breathing
- Chest pain
- Severe weakness
- Very high fever (>104°F/40°C)
- Blood in urine or stool
- Severe vomiting/diarrhea with dehydration
- Symptoms in pregnancy
- Symptoms in children under 5

Respond with: "🚨 URGENT: Based on what you've described, please seek immediate medical attention at the nearest hospital or emergency room. These symptoms require professional evaluation right away."

## Response Format:
- Start with a friendly greeting if it's the first interaction
- Address the specific question clearly
- Use bullet points or numbered lists for clarity
- Include relevant emoji occasionally (🦟 💊 🏥 ⚠️ 🌡️) for visual engagement
- End with "How else can I help you today?" or similar supportive closing
- Include medical disclaimer when providing health advice

Remember: You are here to educate and support, not to diagnose or replace professional medical care. Be the trusted companion in their malaria prevention and awareness journey.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, type = "chat" } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Processing ${type} request with ${messages.length} messages`);

    // Prepare the request body
    const body: any = {
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    };

    // For FAQ suggestions, use structured output
    if (type === "suggest") {
      body.tools = [
        {
          type: "function",
          function: {
            name: "suggest_faqs",
            description: "Return 3-5 helpful FAQ suggestions based on the conversation.",
            parameters: {
              type: "object",
              properties: {
                suggestions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      category: { type: "string", enum: ["prevention", "symptoms", "treatment", "medication", "general"] }
                    },
                    required: ["question", "category"],
                    additionalProperties: false
                  }
                }
              },
              required: ["suggestions"],
              additionalProperties: false
            }
          }
        }
      ];
      body.tool_choice = { type: "function", function: { name: "suggest_faqs" } };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI Gateway returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response received successfully");

    // Extract response based on type
    let result;
    if (type === "suggest" && data.choices?.[0]?.message?.tool_calls) {
      const toolCall = data.choices[0].message.tool_calls[0];
      result = JSON.parse(toolCall.function.arguments);
    } else {
      result = {
        message: data.choices?.[0]?.message?.content || "I'm here to help! Please ask me anything about malaria."
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in malaria-chat function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        message: "I apologize for the technical difficulty. Please try again or contact support if the issue persists."
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
