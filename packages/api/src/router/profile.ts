import { z } from "zod";

import { eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(schema.profile)
        .where(eq(schema.profile.id, input.id));
    }),

  create: protectedProcedure
    .input(
      z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newProfile] = await ctx.db
        .insert(schema.profile)
        .values({
          id: ctx.user.id,
          image: ctx.user.user_metadata.avatar_url as string | undefined,
          email: ctx.user.email,
          firstName: input.first_name,
          lastName: input.last_name,
          onboardedAt: new Date(),
        })
        .returning();

      return newProfile!.id;
    }),
});
