import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { desc, eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const animalRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.post.findMany({
      with: { author: true },
      orderBy: desc(schema.post.id),
      limit: 10,
    });
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.post.findFirst({
        with: { author: true },
        where: eq(schema.post.id, input.id),
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        species: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(schema.animal).values({
        id: nanoid(),
        name: input.name,
        species: input.species,
        ownerId: ctx.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.query.post.findFirst({
        where: eq(schema.post.id, input),
      });

      if (post?.authorId !== ctx.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only the author is allowed to delete the post",
        });
      }

      return ctx.db.delete(schema.post).where(eq(schema.post.id, input));
    }),
});
