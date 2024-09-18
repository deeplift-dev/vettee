import OpenAI from "openai";
import { z } from "zod";

import { eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getConversationTitlePrompt } from "../utils/prompt-constants";

export const assistantRouter = createTRPCRouter({
  checkAnimal: protectedProcedure
    .input(
      z.object({
        species: z.string().min(1),
        presignedUrl: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const response = await openai.chat.completions.create({
          stream: false,
          model: "gpt-4-vision-preview",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `I'm going to provide you with the image of a ${input.species}. I'd like you to tell me the specific breed or type of ${input.species}.
              Do not include any explanations, only provide a RFC8259 compliant JSON response following this format without deviation. Please keep in mind that the user who is providing this image is from Australia, but please remember that the ${input.species} might not originate from that region so use your best judgement.
                [{
                  "type": "the breed or type of ${input.species} in the image provided.",
                  "confidence": "your confidence in your answer",
                  "background_colors": "choose some key colors from the image and generate a list of the top 3 colors in hex format that could be used for a linear gradient background for a website, preferring vibrant pastel colors. Return colors in an array of strings with double quotes.",
                  "attributes": [{
                    "weight": "the weight of the type of ${input.species} in metric units using the image provided as some minor guidance. Please return your best guess as a single number in grams based on your understanding of the breed in question.",
                    "color": "the color of the specific type of ${input.species} using the image provided as guidance. Just a few words.",
                    "other": "a nice and interesting attribute you can think of regarding this breed or type of ${input.species}. Try to keep under 200 characters."
                    "ailments": "summarise in a short sentence what the most common ailments that this breed or type of ${input.species} is known to have."
                  }]
                }]
              `,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: input.presignedUrl,
                  },
                },
              ],
            },
          ],
        });

        return response;
      } catch (error) {
        console.log(error);
      }
    }),

  getConversationTitle: protectedProcedure
    .input(
      z.object({
        species: z.string().min(1),
        name: z.string().min(1),
        yearOfBirth: z.string().min(1),
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant", "function"]),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const response = await openai.chat.completions.create({
          stream: false,
          model: "gpt-3.5-turbo",
          max_tokens: 50,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that generates conversation titles.",
            },
            {
              role: "user",
              content: getConversationTitlePrompt(
                input.messages,
                input.species,
                input.name,
              ),
            },
          ],
        });
        const content = response.choices[0]?.message?.content;
        if (typeof content === "string" && content.trim().length > 0) {
          // Remove any leading/trailing quotes and whitespace
          const cleanedContent = content.trim().replace(/^["']|["']$/g, "");
          // Ensure the title is not too long
          const truncatedContent =
            cleanedContent.length > 40
              ? cleanedContent.substring(0, 37) + "..."
              : cleanedContent;
          return truncatedContent;
        } else {
          // Fallback title with additional info
          return `Chat about ${input.species} ${input.name}`;
        }
      } catch (error) {
        console.error("Error generating conversation title:", error);
        return "Chat with " + input.name;
      }
    }),

  getPromptSuggestions: protectedProcedure
    .input(
      z.object({
        species: z.string().min(1),
        name: z.string().min(1),
        yearOfBirth: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const response = await openai.chat.completions.create({
          stream: false,
          model: "gpt-4",
          max_tokens: 300,
          messages: [
            {
              role: "user",
              content: `
                Please provide me with a list of 4 prompts for a ${input.species} called ${input.name} who was born in ${input.yearOfBirth}.
                The prompts should be relevant to the following categories:
                1. Diet and Nutrition
                2. Vaccinations and Health Checkups
                3. Behavioral Issues
                4. Emergency Assessment
        
                These could be questions that someone might ask a Vet or a question that the owner might ask themselves. 
                Ensure the prompts are varied, useful, and interesting. Keep each prompt under 8 words. Keep the language
                non-technical, and you do not have to explicitly mention the animals age. Just use it as context when crafting 
                the prompts. 
                Return the response as a JSON object with the following structure:
        
                {
                  "prompts": [
                    { "description": "a description of the prompt, please keep under 80 characters" }
                  ]
                }
              `,
            },
          ],
        });

        return response;
      } catch (error) {
        console.log(error);
      }
    }),

  synthesizeConversation: protectedProcedure
    .input(
      z.object({
        animalId: z.string(),
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant", "function"]),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("made it here!!");
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that extracts key information about animals from conversations.",
            },
            {
              role: "user",
              content: `Please analyze the following conversation and extract key information about the animal. Return the data in JSON format with the following structure:
              {
                "weight": number (in kg),
                "lastVaccinationDate": string (YYYY-MM-DD),
                "dietaryRestrictions": string[],
                "knownAllergies": string[],
                "recentSymptoms": string[],
                "behavioralNotes": string
              }`,
            },
            ...input.messages,
          ],
        });

        const extractedData = JSON.parse(
          response.choices[0]?.message?.content || "{}",
        );

        console.log("extractedData", extractedData);

        // Update the animal data in the database
        await ctx.db
          .update(schema.animal)
          .set({
            data: extractedData,
          })
          .where(eq(schema.animal.id, input.animalId));

        return extractedData;
      } catch (error) {
        console.error("Error synthesizing conversation:", error);
        throw new Error("Failed to synthesize conversation");
      }
    }),
});
