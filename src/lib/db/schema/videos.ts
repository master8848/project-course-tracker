import { sql } from "drizzle-orm";
import { text, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { users } from "@/lib/db/schema/auth";
import { type getVideos } from "@/lib/api/videos/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const videos = pgTable('videos', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  description: text("description"),
  userId: varchar("user_id", { length: 256 }).references(() => users.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for videos - used to validate API requests
const baseSchema = createSelectSchema(videos).omit(timestamps)

export const insertVideoSchema = createInsertSchema(videos).omit(timestamps);
export const insertVideoParams = baseSchema.extend({}).omit({ 
  id: true,
  userId: true
});

export const updateVideoSchema = baseSchema;
export const updateVideoParams = baseSchema.extend({}).omit({ 
  userId: true
});
export const videoIdSchema = baseSchema.pick({ id: true });

// Types for videos - used to type API request params and within Components
export type Video = typeof videos.$inferSelect;
export type NewVideo = z.infer<typeof insertVideoSchema>;
export type NewVideoParams = z.infer<typeof insertVideoParams>;
export type UpdateVideoParams = z.infer<typeof updateVideoParams>;
export type VideoId = z.infer<typeof videoIdSchema>["id"];
    
// this type infers the return from getVideos() - meaning it will include any joins
export type CompleteVideo = Awaited<ReturnType<typeof getVideos>>["videos"][number];

