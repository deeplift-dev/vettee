import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

import { veterinarianPrompt } from "~/lib/prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, transcription } = body;

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
          ]
        : []),
      ...messages,
    ];

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: allMessages,
      // tools: {
      //   displayMedicationInfo: tool({
      //     description: "Display medication information in a structured format",
      //     parameters: z.object({
      //       medication: z.string().describe("Medication name"),
      //       dosage: z
      //         .string()
      //         .optional()
      //         .describe("Recommended dosage information"),
      //       usage: z.string().optional().describe("Usage instructions"),
      //       warnings: z
      //         .string()
      //         .optional()
      //         .describe("Important warnings or contraindications"),
      //       notes: z.string().optional().describe("Additional information"),
      //     }),
      //     execute: async (params) => {
      //       console.log("Displaying medication info:", params.medication);
      //       // Return structured data for frontend to render in custom UI component
      //       return params;
      //     },
      //   }),
      // },
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
