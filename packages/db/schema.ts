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
  data: jsonb("data"),
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

export const animalSynthesizedData = pgTable("animal_synthesized_data", {
  id: varchar("id", { length: 256 }).primaryKey(),
  animalId: varchar("animal_id", { length: 256 }).notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const animalSynthesizedDataRelations = relations(
  animalSynthesizedData,
  ({ one }) => ({
    animal: one(animal, {
      fields: [animalSynthesizedData.animalId],
      references: [animal.id],
    }),
  }),
);

export const transcription = pgTable("transcription", {
  id: varchar("id", { length: 256 }).primaryKey(),
  animalId: varchar("animal_id", { length: 256 }).notNull(),
  consultId: varchar("consult_id", { length: 256 }),
  audioUrl: varchar("audio_url", { length: 1024 }).notNull(),
  transcriptionText: varchar("transcription_text", { length: 4096 }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const transcriptionRelations = relations(transcription, ({ one }) => ({
  animal: one(animal, {
    fields: [transcription.animalId],
    references: [animal.id],
  }),
}));

export const consultation = pgTable("consultation", {
  id: varchar("id", { length: 256 }).primaryKey(),
  animalId: varchar("animal_id", { length: 256 }).notNull(),
  ownerId: varchar("owner_id", { length: 256 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  summary: varchar("summary", { length: 1024 }),
  transcriptionId: varchar("transcription_id", { length: 256 }),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const consultationRelations = relations(consultation, ({ one }) => ({
  animal: one(animal, {
    fields: [consultation.animalId],
    references: [animal.id],
  }),
  transcription: one(transcription, {
    fields: [consultation.transcriptionId],
    references: [transcription.id],
  }),
}));
