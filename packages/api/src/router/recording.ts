
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { nanoid } from "nanoid";

export const recordingRouter = createTRPCRouter({
  saveTranscription: publicProcedure
    .input(z.object({
      audioBlob: z.string(),
      transcription: z.string(),
      animalId: z.string(),
      consultId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const id = nanoid();
      
      // Save transcription to database
      const result = await ctx.db
        .insert(schema.transcription)
        .values({
          id,
          animalId: input.animalId,
          consultId: input.consultId,
          audioUrl: input.audioBlob,
          transcriptionText: input.transcription,
        })
        .returning();

      return result[0];
    }),
});
