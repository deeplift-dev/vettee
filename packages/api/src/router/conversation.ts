import { nanoid } from "nanoid";
import { z } from "zod";

import { and, count, eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const conversationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        animalId: z.string().min(1),
        title: z.string().min(1),
        messages: z.array(
          z.object({
            role: z.enum(["system", "user", "assistant", "function"]),
            content: z.string(),
            created_at: z.string(),
            id: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newConversation = await ctx.db
        .insert(schema.conversation)
        .values({
          id: input.id ?? nanoid(),
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

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.conversation.findFirst({
        where: eq(schema.conversation.id, input.id),
      });
    }),

  listForAnimal: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().positive().default(10),
        page: z.number().int().positive().default(1),
        animalId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;
      const conversations = await ctx.db.query.conversation.findMany({
        where: and(
          eq(schema.conversation.ownerId, ctx.user.id),
          eq(schema.conversation.animalId, input.animalId),
        ),
        orderBy: (conversations, { desc }) => [desc(conversations.updatedAt)],
        limit: input.limit,
        offset: offset,
      });
      const totalCount = await ctx.db
        .select({ count: count() })
        .from(schema.conversation)
        .where(
          and(
            eq(schema.conversation.ownerId, ctx.user.id),
            eq(schema.conversation.animalId, input.animalId),
          ),
        )
        .then((result) => result[0]?.count ?? 0);

      const totalPages = Math.ceil(totalCount / input.limit);

      return {
        data: conversations,
        pagination: {
          currentPage: input.page,
          totalPages: totalPages,
          nextPage: input.page < totalPages ? input.page + 1 : null,
          previousPage: input.page > 1 ? input.page - 1 : null,
        },
      };
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
        message: z.union([
          z.object({
            role: z.enum(["system", "user", "assistant", "function"]),
            content: z.string(),
          }),
          z.object({
            type: z.literal("jsx"),
            content: z.record(z.any()),
          }),
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.db.query.conversation.findFirst({
        where: eq(schema.conversation.id, input.conversationId),
      });

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      const newMessage = {
        id: nanoid(),
        ...input.message,
        created_at: new Date().toISOString(),
      };

      const updatedMessages = [...conversation.messages, newMessage];

      return ctx.db
        .update(schema.conversation)
        .set({
          messages: updatedMessages,
          updatedAt: new Date(),
        })
        .where(eq(schema.conversation.id, input.conversationId))
        .returning();
    }),

  updateConversationTitle: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(schema.conversation)
        .set({ title: input.title })
        .where(eq(schema.conversation.id, input.id))
        .returning();
    }),
});
