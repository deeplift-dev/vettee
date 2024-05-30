import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const assistantRouter = createTRPCRouter({
  checkAnimal: publicProcedure
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

          /**
           * Functions are not yet supported by the gpt-4v
           * https://platform.openai.com/docs/guides/function-calling/supported-models
           */
          // functions: [
          //   {
          //     name: "out",
          //     // here we define our function to get the result from the agent in JSON form
          //     description:
          //       "This is the function that returns the result of the agent",
          //     // we use zod and a zod-to-json-schema converter to define the JSON Schema very easily
          //     parameters: zodToJsonSchema(
          //       z.object({
          //         type: z.string(),
          //         confidence: z.number().multipleOf(0.1),
          //       }),
          //     ),
          //   }
          // ]
        });

        console.log("response -- ", response);
        return response;
      } catch (error) {
        console.log(error);
      }
    }),

  getBasicSpeciesFacts: publicProcedure
    .input(
      z.object({
        species: z.string().min(1),
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
              content: [
                {
                  type: "text",
                  text: `I'd like to know some basic facts about a ${input.species}.`,
                },
              ],
            },
          ],
        });

        console.log("response -- ", response);
        return response;
      } catch (error) {
        console.log(error);
      }
    }),
  intakeAnimalProcedure: publicProcedure
    .input(
      z.object({
        animalId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const questions = [
          "What are the current medications for the animal, if any?",
          "Are there any ongoing medical concerns for the animal?",
          "Is the pet desexed (neutered or spayed)?",
        ];

        const response = await openai.chat.completions.create({
          stream: false,
          model: "gpt-4",
          max_tokens: 150,
          messages: [
            {
              role: "system",
              content:
                "You are an assistant helping with the intake of a new animal at a veterinary clinic. Please ask the following questions to the user.",
            },
            {
              role: "assistant",
              content: questions.join("\n"),
            },
          ],
        });

        console.log("OpenAI response -- ", response);
        return response;
      } catch (error) {
        console.error("Failed to process intake through OpenAI:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to process animal intake through OpenAI",
        });
      }
    }),
});
