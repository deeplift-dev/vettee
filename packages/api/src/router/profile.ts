import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";

import { desc, eq, ilike, or, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { supabaseAdmin } from "../utils/supabase-admin";

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
  search: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const searchTerm = `%${input.query}%`;

      // Join profiles with animals in a single query
      const results = await ctx.db
        .select({
          profile: schema.profile,
          animals: schema.animal,
        })
        .from(schema.profile)
        .leftJoin(schema.animal, eq(schema.profile.id, schema.animal.ownerId))
        .where(
          or(
            ilike(schema.profile.firstName, searchTerm),
            ilike(schema.profile.lastName, searchTerm),
            ilike(schema.profile.email, searchTerm),
            ilike(schema.profile.mobileNumber, searchTerm),
          ),
        )
        .limit(10);

      // Group results by profile
      const profileMap = new Map();

      for (const row of results) {
        const profile = row.profile;
        const animal = row.animals;

        if (!profileMap.has(profile.id)) {
          profileMap.set(profile.id, {
            ...profile,
            animals: animal ? [animal] : [],
          });
        } else if (animal) {
          profileMap.get(profile.id).animals.push(animal);
        }
      }

      return Array.from(profileMap.values());
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
        mobile_number: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingProfile = await ctx.db
        .select()
        .from(schema.profile)
        .where(
          or(
            input.email ? eq(schema.profile.email, input.email) : undefined,
            input.mobile_number
              ? eq(schema.profile.mobileNumber, input.mobile_number)
              : undefined,
          ),
        )
        .then((profiles) => profiles[0]);

      if (existingProfile) {
        console.log("Existing profile found, updating...", existingProfile);
        await ctx.db
          .update(schema.profile)
          .set({
            firstName: input.first_name,
            lastName: input.last_name,
            onboardedAt: new Date(),
          })
          .where(eq(schema.profile.id, ctx.user.id))
          .then(() => console.log("Profile updated successfully"))
          .catch((error) => console.error("Error updating profile:", error));

        return existingProfile;
      }

      const newProfile = await ctx.db
        .insert(schema.profile)
        .values({
          id: nanoid(),
          image: ctx.user.user_metadata.avatar_url as string | undefined,
          email: ctx.user.email,
          firstName: input.first_name,
          lastName: input.last_name,
          mobileNumber: input.mobile_number,
          onboardedAt: new Date(),
        })
        .returning()
        .then((profiles) => profiles[0]);

      if (!newProfile) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create profile",
        });
      }

      return newProfile;
    }),
  deleteProfile: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      // Soft delete the user using Supabase Admin API
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
        ctx.user.id,
      );

      if (deleteError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete user account",
          cause: deleteError,
        });
      }

      // Delete the profile from your database
      await ctx.db
        .delete(schema.profile)
        .where(eq(schema.profile.id, ctx.user.id));

      return { success: true, message: "User account deleted successfully" };
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while deleting the user account",
        cause: error,
      });
    }
  }),
});
