import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { desc, eq, schema } from "@acme/db";

import { getYears } from "~/utils/data/get-years";
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
});
