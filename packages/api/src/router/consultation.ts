
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { nanoid } from "nanoid";

export const consultationRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        animalId: z.string(),
        title: z.string(),
        summary: z.string().optional(),
        transcriptionId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = nanoid();
      
      const result = await ctx.db
        .insert(schema.consultation)
        .values({
          id,
          animalId: input.animalId,
          ownerId: ctx.user.id,
          title: input.title,
          summary: input.summary,
          transcriptionId: input.transcriptionId,
        })
        .returning();

      return result[0];
    }),

  getByAnimal: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.consultation.findMany({
        where: (consultation, { eq }) => eq(consultation.animalId, input),
        orderBy: (consultation, { desc }) => [desc(consultation.createdAt)],
      });
    }),
});
