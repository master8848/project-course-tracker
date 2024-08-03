import { sql } from "drizzle-orm";
import { text, integer, varchar, timestamp, pgTable } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { videos } from "./videos"
import { type getAllVideos } from "@/lib/api/allVideos/queries";

import { nanoid, timestamps } from "@/lib/utils";


export const allVideos = pgTable('all_videos', {
  id: varchar("id", { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  name: text("name").notNull(),
  url: text("url").notNull(),
  numberOfTimes: integer("number_of_times").notNull(),
  videoId: varchar("video_id", { length: 256 }).references(() => videos.id, { onDelete: "cascade" }).notNull(),
  
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),

});


// Schema for allVideos - used to validate API requests
const baseSchema = createSelectSchema(allVideos).omit(timestamps)

export const insertAllVideoSchema = createInsertSchema(allVideos).omit(timestamps);
export const insertAllVideoParams = baseSchema.extend({
  numberOfTimes: z.coerce.number(),
  videoId: z.coerce.string().min(1)
}).omit({ 
  id: true
});

export const updateAllVideoSchema = baseSchema;
export const updateAllVideoParams = baseSchema.extend({
  numberOfTimes: z.coerce.number(),
  videoId: z.coerce.string().min(1)
})
export const allVideoIdSchema = baseSchema.pick({ id: true });

// Types for allVideos - used to type API request params and within Components
export type AllVideo = typeof allVideos.$inferSelect;
export type NewAllVideo = z.infer<typeof insertAllVideoSchema>;
export type NewAllVideoParams = z.infer<typeof insertAllVideoParams>;
export type UpdateAllVideoParams = z.infer<typeof updateAllVideoParams>;
export type AllVideoId = z.infer<typeof allVideoIdSchema>["id"];
    
// this type infers the return from getAllVideos() - meaning it will include any joins
export type CompleteAllVideo = Awaited<ReturnType<typeof getAllVideos>>["allVideos"][number];

