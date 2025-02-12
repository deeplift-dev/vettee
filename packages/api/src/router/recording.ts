import { nanoid } from "nanoid";
import { z } from "zod";

import { and, desc, eq, isNotNull, schema } from "@acme/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const recordingRouter = createTRPCRouter({
  saveTranscription: publicProcedure
    .input(
      z.object({
        audioBlob: z.string().optional(),
        transcription: z.string().optional(),
        animalId: z.string().optional(),
        consultationId: z.string().optional(),
        transcriptionId: z.string().optional(),
        transcriptionUrl: z.string().optional(),
        transcriptionStatus: z.string().optional(),
        transcriptionCreatedAt: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const id = await nanoid();

      // Save transcription to database
      const result = await ctx.db
        .insert(schema.transcription)
        .values({
          id: id,
          animalId: input.animalId,
          consultId: input.consultationId,
          audioUrl: input.audioBlob,
          transcriptionText: input.transcription,
          transcriptionId: input.transcriptionId,
          transcriptionUrl: input.transcriptionUrl,
          transcriptionStatus: input.transcriptionStatus,
          transcriptionCreatedAt: new Date(input.transcriptionCreatedAt),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return result[0];
    }),

  updateByTranscriptionId: publicProcedure
    .input(
      z.object({
        transcriptionId: z.string(),
        transcriptionStatus: z.string(),
        transcriptionCreatedAt: z.string(),
        predictionObject: z.any(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .update(schema.transcription)
        .set({
          transcriptionStatus: input.transcriptionStatus,
          transcriptionCreatedAt: new Date(input.transcriptionCreatedAt),
          predictionObject: input.predictionObject,
          updatedAt: new Date(),
        })
        .where(eq(schema.transcription.transcriptionId, input.transcriptionId));
    }),

  getByConsultId: publicProcedure
    .input(
      z.object({
        consultId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const consultation = await ctx.db.query.consultation.findFirst({
        where: eq(schema.consultation.id, input.consultId),
      });

      if (!consultation) {
        throw new Error("Consultation not found");
      }

      const lastSyncedTranscriptionId = consultation.lastSyncedTranscriptionId;

      const transcriptions = await ctx.db.query.transcription.findMany({
        where: and(
          eq(schema.transcription.consultId, input.consultId),
          isNotNull(schema.transcription.predictionObject),
        ),
        orderBy: desc(schema.transcription.createdAt),
      });

      const lastSyncedTranscription = transcriptions[0];
      const synced = lastSyncedTranscription?.id === lastSyncedTranscriptionId;

      return {
        transcriptions,
        synced,
      };
    }),
  syncTranscription: publicProcedure
    .input(
      z.object({
        consultationId: z.string(),
        lastTranscriptionId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db
        .update(schema.consultation)
        .set({
          lastSyncedTranscriptionId: input.lastTranscriptionId,
          updatedAt: new Date(),
        })
        .where(eq(schema.consultation.id, input.consultationId));
    }),
});
