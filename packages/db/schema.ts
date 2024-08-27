import { relations, sql } from "drizzle-orm";
import {
  jsonb,
  numeric,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const profile = pgTable("profile", {
  id: varchar("id", { length: 256 }).primaryKey(),
  firstName: varchar("first_name", { length: 256 }),
  lastName: varchar("last_name", { length: 256 }),
  image: varchar("image", { length: 256 }),
  email: varchar("email", { length: 256 }),
  mobileNumber: varchar("mobile_number", { length: 256 }),
  onboardedAt: timestamp("onboarded_at"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
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
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const animalRelations = relations(animal, ({ one }) => ({
  owner: one(profile, { fields: [animal.ownerId], references: [profile.id] }),
}));

export const conversation = pgTable("conversation", {
  id: varchar("id", { length: 256 }).primaryKey(),
  animalId: varchar("animal_id", { length: 256 }),
  title: varchar("title", { length: 256 }).notNull(),
  messages: jsonb("messages").notNull(),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const conversationRelations = relations(conversation, ({ one }) => ({
  animal: one(animal, {
    fields: [conversation.animalId],
    references: [animal.id],
  }),
}));
