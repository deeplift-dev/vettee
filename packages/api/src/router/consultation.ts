import { eq } from "drizzle-orm";
import { z } from "zod";

import { consultations } from "../db/schema/consultation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const createConsultationSchema = z.object({
  ownerId: z.string().uuid(),
  animalName: z.string().min(1),
  animalSpecies: z.string().optional(),
  animalAge: z.string().optional(),
  recordingConsent: z.boolean(),
});

export const consultationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createConsultationSchema)
    .mutation(async ({ ctx, input }) => {
      const consultation = await ctx.db
        .insert(consultations)
        .values({
          ownerId: input.ownerId,
          animalName: input.animalName,
          animalSpecies: input.animalSpecies,
          animalAge: input.animalAge,
          recordingConsent: input.recordingConsent.toString(),
        })
        .returning();

      return consultation[0];
    }),

  getById: protectedProcedure
    .input(z.string().uuid())
    .query(async ({ ctx, input }) => {
      const consultation = await ctx.db.query.consultations.findFirst({
        where: eq(consultations.id, input),
        with: {
          owner: true,
        },
      });

      return consultation;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    const consultationList = await ctx.db.query.consultations.findMany({
      with: {
        owner: true,
      },
      orderBy: (consultations, { desc }) => [desc(consultations.createdAt)],
    });

    return consultationList;
  }),
});
