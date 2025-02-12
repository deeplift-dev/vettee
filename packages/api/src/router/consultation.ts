import { TRPCError } from "@trpc/server";
import { type Message } from "ai";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

import { schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createConsultationSchema = z.object({
  recordingConsent: z.boolean(),
  ownerId: z.string().optional(),
  animalId: z.string().optional(),
});

const updateConsultationSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
});

export const consultationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createConsultationSchema)
    .mutation(async ({ ctx, input }) => {
      console.log("input--", input);
      const consultation = await ctx.db
        .insert(schema.consultation)
        .values({
          id: nanoid(),
          veterinarianId: ctx.user.id,
          title: generateDefaultTitle(),
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: input.ownerId,
          animalId: input.animalId,
          consentedAt: input.recordingConsent ? new Date() : null,
        })
        .returning();

      return consultation[0];
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const consultation = await ctx.db.query.consultation.findFirst({
        where: eq(schema.consultation.id, input),
        with: {
          animal: true,
          owner: true,
          veterinarian: true,
          transcription: {
            orderBy: (transcription, { asc }) => [asc(transcription.createdAt)],
          },
        },
      });

      if (!consultation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Consultation not found",
        });
      }

      return consultation;
    }),
  updateTitle: protectedProcedure
    .input(updateConsultationSchema)
    .mutation(async ({ ctx, input }) => {
      const consultation = await ctx.db
        .update(schema.consultation)
        .set({
          title: input.title,
          updatedAt: new Date(),
        })
        .where(eq(schema.consultation.id, input.id))
        .returning();

      if (!consultation.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Consultation not found",
        });
      }

      return consultation[0];
    }),

  getByVeterinarianId: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.consultation.findMany({
      where: eq(schema.consultation.veterinarianId, ctx.user.id),
      with: {
        animal: true,
        veterinarian: true,
        owner: true,
      },
    });
  }),
  addMessage: protectedProcedure
    .input(z.object({ id: z.string(), message: z.custom<Message>() }))
    .mutation(async ({ ctx, input }) => {
      // First get the existing consultation to access current messages
      const existingConsultation = await ctx.db.query.consultation.findFirst({
        where: eq(schema.consultation.id, input.id),
      });

      if (!existingConsultation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Consultation not found",
        });
      }

      // Add new message to existing messages array
      const updatedMessages = [
        ...(existingConsultation.messages ?? []),
        input.message,
      ];

      const consultation = await ctx.db
        .update(schema.consultation)
        .set({ messages: updatedMessages })
        .where(eq(schema.consultation.id, input.id))
        .returning();

      return consultation[0];
    }),
});

const generateDefaultTitle = () => {
  return `New Consultation ${new Date().toLocaleString()}`;
};
