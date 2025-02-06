// import { friendli } from "@friendliai/ai-provider";
// import { streamText } from "ai";

// // Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();

//     const result = streamText({
//       model: friendli("meta-llama-3.3-70b-instruct", {
//         tools: [{ type: "web:search" }, { type: "math:calculator" }],
//       }),
//       messages,
//     });

//     console.log("result", result);
//     return result.toDataStreamResponse();
//   } catch (error) {
//     console.error("Error in chat route:", error);
//     return new Response("An error occurred while processing your request", {
//       status: 500,
//     });
//   }
// }

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

import veterinarianPrompt from "~/lib/prompt";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Combine the veterinarian prompt with the first message if it exists
  const enhancedMessages =
    messages.length > 0
      ? [{ role: "system", content: veterinarianPrompt }, ...messages]
      : messages;

  const result = streamText({
    model: openai("gpt-4o"),
    messages: enhancedMessages,
  });

  return result.toDataStreamResponse();
}
