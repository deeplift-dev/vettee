import { nanoid } from "nanoid";
import { z } from "zod";

import { eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        animalId: z.string().min(1),
        title: z.string().min(1),
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant"]),
            content: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newConversation = await ctx.db
        .insert(schema.conversation)
        .values({
          id: nanoid(),
          animalId: input.animalId,
          title: input.title,
          messages: input.messages,
          ownerId: ctx.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return newConversation;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.conversation.findFirst({
        where: eq(schema.conversation.id, input.id),
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        messages: z
          .array(
            z.object({
              role: z.enum(["system", "user", "assistant"]),
              content: z.string(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: Partial<typeof input> = {};
      if (input.title) updateData.title = input.title;
      if (input.messages) updateData.messages = input.messages;
      updateData.updatedAt = new Date();

      return ctx.db
        .update(schema.conversation)
        .set(updateData)
        .where(eq(schema.conversation.id, input.id));
    }),

  saveMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        message: z.object({
          role: z.enum(["system", "user", "assistant"]),
          content: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.db.query.conversation.findFirst({
        where: eq(schema.conversation.id, input.conversationId),
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const updatedMessages = [...conversation.messages, input.message];

      return ctx.db
        .update(schema.conversation)
        .set({
          messages: updatedMessages,
          updatedAt: new Date(),
        })
        .where(eq(schema.conversation.id, input.conversationId))
        .returning();
    }),
});
