import { relations, sql } from "drizzle-orm";
import { numeric, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: varchar("id", { length: 256 }).primaryKey(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  image: varchar("image", { length: 256 }),
  email: varchar("email", { length: 256 }),
  mobileNumber: varchar("mobile_number", { length: 256 }),
  onboardedAt: timestamp("onboarded_at"),
});

export const profileRelations = relations(profile, ({ many }) => ({
  animals: many(animal),
}));

export const animal = pgTable("animal", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  species: varchar("species", { length: 256 }),
  weight: numeric("weight"),
  yearOfBirth: numeric("year_of_birth").notNull(),
  ownerId: varchar("owner_id", { length: 256 }),
  avatarUrl: varchar("avatar_url", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const animalRelations = relations(animal, ({ one }) => ({
  owner: one(profile, { fields: [animal.ownerId], references: [profile.id] }),
}));

export const assistant = pgTable("assistant", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }),
  instructions: varchar("instructions", { length: 256 }),
  model: varchar("model", { length: 256 }),
  profileId: varchar("profile_id", { length: 256 }),
  createdAt: timestamp("created_at"),
});

export const assistantRelations = relations(assistant, ({ one }) => ({
  profile: one(profile, {
    fields: [assistant.profileId],
    references: [profile.id],
  }),
}));

export const thread = pgTable("thread", {
  id: varchar("id", { length: 256 }).primaryKey(),
  assistantId: varchar("assistant_id", { length: 256 }),
  animalId: varchar("animal_id", { length: 256 }),
  threadId: varchar("thread_id", { length: 256 }),
  object: varchar("object", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const threadRelations = relations(thread, ({ one }) => ({
  assistant: one(assistant, {
    fields: [thread.assistantId],
    references: [assistant.id],
  }),
  animal: one(animal, {
    fields: [thread.animalId],
    references: [animal.id],
  }),
}));
