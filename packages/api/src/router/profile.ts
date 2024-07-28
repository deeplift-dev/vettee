import { z } from "zod";

import { desc, eq, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db
        .select()
        .from(schema.profile)
        .where(eq(schema.profile.id, input.id));

      if (!profile.length) {
        throw new Error("Profile not found");
      }

      return profile;
    }),
  getCurrentUserProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(schema.profile)
      .where(eq(schema.profile.id, ctx.user.id));
  }),
  animals: protectedProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select()
      .from(schema.animal)
      .orderBy(desc(schema.animal.createdAt))
      .where(eq(schema.animal.ownerId, ctx.user.id));

    return result;
  }),
  create: protectedProcedure
    .input(
      z.object({
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log("input----", input);
      const existingProfile = await ctx.db
        .select()
        .from(schema.profile)
        .where(eq(schema.profile.id, ctx.user.id))
        .then((profiles) => profiles[0]);

      console.log("existingProfile----", existingProfile);

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

      const newProfile = await ctx.db
        .insert(schema.profile)
        .values({
          id: ctx.user.id,
          image: ctx.user.user_metadata.avatar_url as string | undefined,
          email: ctx.user.email,
          firstName: input.first_name,
          lastName: input.last_name,
          onboardedAt: new Date(),
        })
        .returning()
        .then((profiles) => profiles[0]);

      return newProfile.id;
    }),
});
