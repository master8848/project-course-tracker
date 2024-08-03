import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { 
  AllVideoId, 
  NewAllVideoParams,
  UpdateAllVideoParams, 
  updateAllVideoSchema,
  insertAllVideoSchema, 
  allVideos,
  allVideoIdSchema 
} from "@/lib/db/schema/allVideos";

export const createAllVideo = async (allVideo: NewAllVideoParams) => {
  const newAllVideo = insertAllVideoSchema.parse(allVideo);
  try {
    const [a] =  await db.insert(allVideos).values(newAllVideo).returning();
    return { allVideo: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateAllVideo = async (id: AllVideoId, allVideo: UpdateAllVideoParams) => {
  const { id: allVideoId } = allVideoIdSchema.parse({ id });
  const newAllVideo = updateAllVideoSchema.parse(allVideo);
  try {
    const [a] =  await db
     .update(allVideos)
     .set({...newAllVideo, updatedAt: new Date() })
     .where(eq(allVideos.id, allVideoId!))
     .returning();
    return { allVideo: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteAllVideo = async (id: AllVideoId) => {
  const { id: allVideoId } = allVideoIdSchema.parse({ id });
  try {
    const [a] =  await db.delete(allVideos).where(eq(allVideos.id, allVideoId!))
    .returning();
    return { allVideo: a };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

