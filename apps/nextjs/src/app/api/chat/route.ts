import { openai } from "@ai-sdk/openai";
import { streamText, tool } from "ai";
import { z } from "zod";

import { veterinarianPrompt } from "~/lib/prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    let messages;
    let transcription = null;
    let attachments = [];

    // Determine if the request is JSON or FormData
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData request (with or without attachments)
      const formData = await req.formData();
      const messagesJson = formData.get("messages") as string;
      transcription = formData.get("transcription") as string | null;

      // Parse messages from JSON
      messages = JSON.parse(messagesJson);

      // Handle attachments if they exist
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("files")) {
          if (value instanceof Blob) {
            // Create a base64 representation of the image
            const buffer = Buffer.from(await value.arrayBuffer());
            const base64Image = buffer.toString("base64");
            const mimeType = value.type;

            // Add to attachments array
            attachments.push({
              type: "image",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            });
          }
        }
      }
    } else {
      // Handle JSON request (no attachments)
      const body = await req.json();
      messages = body.messages;
      transcription = body.transcription;
    }

    // Create the system message
    const systemMessages = [
      {
        role: "system",
        content: veterinarianPrompt,
      },
    ];

    // Add transcription if available
    if (transcription) {
      systemMessages.push({
        role: "system",
        content: transcription,
      });
    }

    // Prepare all messages for OpenAI
    const allMessages = [
      ...systemMessages,
      ...messages.map((msg) => {
        // For the last user message, add any attachments from the form
        if (
          msg.role === "user" &&
          msg === messages[messages.length - 1] &&
          attachments.length > 0
        ) {
          return {
            role: "user",
            content: [{ type: "text", text: msg.content }, ...attachments],
          };
        }
        return msg;
      }),
    ];

    console.log(
      "Sending messages to OpenAI:",
      JSON.stringify(allMessages, null, 2),
    );

    const result = await streamText({
      model: openai("gpt-4o"),
      messages: allMessages,
      // Uncomment if you want to use tools again
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
      JSON.stringify({
        error: "Failed to process chat request",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
