import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import { veterinarianPrompt } from "~/lib/prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define tools that can be used by the AI
const tools = [
  {
    name: "extractSymptoms",
    description: "Extract symptoms mentioned in the consultation",
    execute: (transcription: string) => {
      // Parse transcription for symptoms
      const symptoms =
        transcription?.match(
          /(?<=\[Patient\].*)(pain|discomfort|vomiting|diarrhea|lethargy|fever|cough|sneezing|limping|swelling)/gi,
        ) || [];
      console.log("Extracted symptoms:", symptoms);
      return [...new Set(symptoms)];
    },
  },
  {
    name: "identifyMedications",
    description: "Identify any medications mentioned",
    execute: (transcription: string) => {
      // Parse transcription for medication names
      const medications =
        transcription?.match(
          /(?<=\[Doctor\].*)(prescribed|recommend|give|take|medication|medicine|antibiotic|treatment)/gi,
        ) || [];
      console.log("Identified medications:", medications);
      return [...new Set(medications)];
    },
  },
  {
    name: "extractVitalSigns",
    description: "Extract vital signs and measurements mentioned",
    execute: (transcription: string) => {
      // Parse for temperature, weight, heart rate, etc.
      const vitals =
        transcription?.match(
          /(?<=\[Doctor\].*)(temperature|weight|heart rate|blood pressure|respiratory rate|pulse)\s*[:of]\s*[\d.]+/gi,
        ) || [];
      console.log("Extracted vital signs:", vitals);
      return [...new Set(vitals)];
    },
  },
  {
    name: "identifyDiagnosticTests",
    description: "Identify diagnostic tests mentioned or recommended",
    execute: (transcription: string) => {
      // Parse for lab tests, imaging, etc.
      const tests =
        transcription?.match(
          /(?<=\[Doctor\].*)(blood test|urinalysis|x-ray|ultrasound|biopsy|culture|lab work|radiograph)/gi,
        ) || [];
      console.log("Identified diagnostic tests:", tests);
      return [...new Set(tests)];
    },
  },
  {
    name: "extractDietaryInfo",
    description: "Extract dietary information and recommendations",
    execute: (transcription: string) => {
      // Parse for diet-related information
      const dietary =
        transcription?.match(
          /(?<=\[Doctor\].*)(diet|food|feeding|nutrition|eat|meal)/gi,
        ) || [];
      console.log("Extracted dietary info:", dietary);
      return [...new Set(dietary)];
    },
  },
  {
    name: "identifyFollowUp",
    description: "Extract follow-up instructions and next steps",
    execute: (transcription: string) => {
      // Parse for follow-up care instructions
      const followUp =
        transcription?.match(
          /(?<=\[Doctor\].*)(follow up|come back|return|check|monitor|watch for)/gi,
        ) || [];
      console.log("Identified follow-up instructions:", followUp);
      return [...new Set(followUp)];
    },
  },
  {
    name: "calculateDosage",
    description: "Calculate medication dosage based on weight",
    execute: (weight: number, dosagePerKg: number) => {
      const dosage = weight * dosagePerKg;
      console.log("Calculated dosage:", dosage);
      return dosage;
    },
  },
  {
    name: "calculateFluidRate",
    description: "Calculate IV fluid administration rate",
    execute: (weight: number, maintenanceRate: number = 2) => {
      // Basic maintenance rate calculation (ml/hr)
      const dailyRequirement = weight * maintenanceRate * 24;
      const result = {
        dailyRequirement,
        hourlyRate: dailyRequirement / 24,
      };
      console.log("Calculated fluid rates:", result);
      return result;
    },
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, transcription } = body;
    console.log("%%%calling this now%%%");

    // Only run tools that don't require additional parameters
    const insights = tools
      .filter(
        (tool) =>
          tool.name !== "calculateDosage" && tool.name !== "calculateFluidRate",
      )
      .map((tool) => ({
        tool: tool.name,
        result: tool.execute(transcription || ""),
      }));

    const allMessages = [
      {
        role: "system",
        content: veterinarianPrompt,
      },
      ...(transcription
        ? [
            {
              role: "system",
              content: transcription,
            },
            {
              role: "system",
              content: `Extracted insights from consultation: ${JSON.stringify(insights, null, 2)}`,
            },
          ]
        : []),
      ...messages,
    ];

    console.log("allMessages...", allMessages);
    console.log("insights...", insights);

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: allMessages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat route:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
      },
    );
  }
}
