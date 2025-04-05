import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { consultations } from "./consultation";

export const consultationImages = pgTable("consultation_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  consultationId: text("consultation_id").references(() => consultations.id),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const consultationImageRelations = relations(
  consultationImages,
  ({ one }) => ({
    consultation: one(consultations, {
      fields: [consultationImages.consultationId],
      references: [consultations.id],
    }),
  }),
);
