import { z } from "zod";

import { eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      console.log("made it here", input);
      return ctx.db
        .select()
        .from(schema.profile)
        .where(eq(schema.profile.id, input.id));
    }),
  getCurrentUserProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.profile)
      .where(eq(schema.profile.id, ctx.user.id));
  }),

  create: protectedProcedure
    .input(
      z.object({
        first_name: z.string().min(1),
        last_name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existingProfile] = await ctx.db
        .select()
        .from(schema.profile)
        .where(eq(schema.profile.id, ctx.user.id));

      if (existingProfile) {
        await ctx.db
          .update(schema.profile)
          .set({
            firstName: input.first_name,
            lastName: input.last_name,
            onboardedAt: new Date(),
          })
          .where(eq(schema.profile.id, ctx.user.id));

        return existingProfile.id;
      }

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
