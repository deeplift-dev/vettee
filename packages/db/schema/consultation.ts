import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { animals } from "./animal";
import { profiles } from "./profile";

export const consultations = pgTable("consultations", {
  id: text("id").primaryKey(),
  animalId: uuid("animal_id").references(() => animals.id),
  ownerId: uuid("owner_id").references(() => profiles.id),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  consentedAt: timestamp("consented_at"),
});

export const consultationRelations = relations(consultations, ({ one }) => ({
  animal: one(animals, {
    fields: [consultations.animalId],
    references: [animals.id],
  }),
  owner: one(profiles, {
    fields: [consultations.ownerId],
    references: [profiles.id],
  }),
}));
