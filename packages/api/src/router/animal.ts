import { nanoid } from "nanoid";
import { z } from "zod";

import { eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const animalRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        species: z.string().min(1),
        avatarUrl: z.string().optional(),
        yearOfBirth: z.number().int().min(1950),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(schema.animal).values({
        id: nanoid(),
        name: input.name,
        species: input.species,
        avatarUrl: input.avatarUrl,
        ownerId: ctx.user.id,
        yearOfBirth: input.yearOfBirth.toString(),
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.animal.findFirst({
        where: eq(schema.animal.id, input.id),
      });
    }),

  updateAnimal: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z
          .object({
            id: z.string().optional(),
            name: z.string().optional(),
            species: z.string().optional(),
            avatarUrl: z.string().optional(),
            yearOfBirth: z.number().int().min(1950).optional(),
          })
          .strict(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const updateData = {
        ...input.data,
        yearOfBirth: input.data.yearOfBirth?.toString(),
      };
      return ctx.db
        .update(schema.animal)
        .set(updateData)
        .where(eq(schema.animal.id, input.id));
    }),

  deleteAnimal: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.delete(schema.animal).where(eq(schema.animal.id, input.id));
    }),

  getSynthesizedData: publicProcedure
    .input(z.object({ animalId: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db.query.animalSynthesizedData.findFirst({
        where: eq(schema.animalSynthesizedData.animalId, input.animalId),
      });
      return result ?? { animalId: input.animalId, data: null };
    }),
});
