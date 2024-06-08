import { relations, sql } from "drizzle-orm";
import { numeric, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const post = pgTable("post", {
  id: varchar("id", { length: 256 }).primaryKey(),
  title: varchar("name", { length: 256 }).notNull(),
  content: varchar("content", { length: 256 }).notNull(),
  authorId: varchar("author_id", { length: 256 })
    .notNull()
    .references(() => profile.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const postRelations = relations(post, ({ one }) => ({
  author: one(profile, { fields: [post.authorId], references: [profile.id] }),
}));

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
  posts: many(post),
  assistants: many(assistant),
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

export const assistant = pgTable("assistant", {
  id: varchar("id", { length: 256 }).primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  instructions: varchar("instructions", { length: 256 }).notNull(),
  model: varchar("model", { length: 256 }).notNull(),
  profileId: varchar("profile_id", { length: 256 })
    .notNull()
    .references(() => profile.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const assistantRelations = relations(assistant, ({ many }) => ({
  threads: many(thread),
  runs: many(run),
  animals: many(animal),
}));

export const thread = pgTable("thread", {
  id: varchar("id", { length: 256 }).primaryKey(),
  assistantId: varchar("assistant_id", { length: 256 })
    .notNull()
    .references(() => assistant.id),
  animalId: varchar("animal_id", { length: 256 }).references(() => animal.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const run = pgTable("run", {
  id: varchar("id", { length: 256 }).primaryKey(),
  threadId: varchar("thread_id", { length: 256 })
    .notNull()
    .references(() => thread.id),
  assistantId: varchar("assistant_id", { length: 256 })
    .notNull()
    .references(() => assistant.id),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const animalRelations = relations(animal, ({ one }) => ({
  owner: one(profile, { fields: [animal.ownerId], references: [profile.id] }),
}));
