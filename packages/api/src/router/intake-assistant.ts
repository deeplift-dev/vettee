import { TRPCError } from "@trpc/server";
import OpenAI from "openai";
import { z } from "zod";

import { eq, schema } from "@acme/db";

import { getIntakeAssistantPrompts } from "../helpers/prompts";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const intakeAssistantRouter = createTRPCRouter({
  createAssistant: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        animalId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const animal = await ctx.db.query.animal.findFirst({
          where: eq(schema.animal.id, input.animalId),
        });
        if (!animal) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Animal not found",
          });
        }
        const prompts = getIntakeAssistantPrompts(animal);
        const assistant = await openai.beta.assistants.create({
          name: input.name,
          instructions: prompts.instructions,
          model: "gpt-4o",
        });
        return assistant;
      } catch (error) {
        console.error("Failed to create assistant:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create assistant",
        });
      }
    }),

  createThread: protectedProcedure.mutation(async ({ ctx }) => {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
      const thread = await openai.beta.threads.create();
      return thread;
    } catch (error) {
      console.error("Failed to create thread:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create thread",
      });
    }
  }),

  createRun: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        assistantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const run = await openai.beta.threads.runs.createAndPoll(
          input.threadId,
          {
            assistant_id: input.assistantId,
          },
        );
        return run;
      } catch (error) {
        console.error("Failed to create run:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create run",
        });
      }
    }),

  getRunSteps: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        runId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const steps = await openai.beta.threads.runs.steps.list(
          input.threadId,
          input.runId,
        );
        return steps;
      } catch (error) {
        console.error("Failed to get run steps:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get run steps",
        });
      }
    }),

  getMessages: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const messages = await openai.beta.threads.messages.list(
          input.threadId,
        );
        return messages;
      } catch (error) {
        console.error("Failed to get messages:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get messages",
        });
      }
    }),

  createMessage: protectedProcedure
    .input(
      z.object({
        threadId: z.string(),
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      try {
        const threadMessages = await openai.beta.threads.messages.create(
          input.threadId,
          { role: input.role, content: input.content },
        );
        return threadMessages;
      } catch (error) {
        console.error("Failed to create message:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create message",
        });
      }
    }),
});
