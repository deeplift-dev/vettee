import { nanoid } from "nanoid";
import { z } from "zod";

import { schema } from "@acme/db";

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
        })
        .returning();

      return result[0];
    }),
});
