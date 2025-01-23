import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { z } from "zod";

import { schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

const createConsultationSchema = z.object({
  recordingConsent: z.boolean(),
});

const updateConsultationSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
});

export const consultationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createConsultationSchema)
    .mutation(async ({ ctx, input }) => {
      const consultation = await ctx.db
        .insert(schema.consultation)
        .values({
          id: nanoid(),
          veterinarianId: ctx.user.id,
          title: generateDefaultTitle(),
          createdAt: new Date(),
          updatedAt: new Date(),
          consentedAt: input.recordingConsent ? new Date() : null,
        })
        .returning();

      return consultation[0];
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      console.log("input", input);
      const consultation = await ctx.db.query.consultation.findFirst({
        where: eq(schema.consultation.id, input),
        with: {
          animal: true,
          // owner: true,
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
});

const generateDefaultTitle = () => {
  return `New Consultation ${new Date().toLocaleString()}`;
};
