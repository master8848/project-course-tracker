import { db } from "@/lib/db/index";
import { and, eq } from "drizzle-orm";
import { 
  VideoId, 
  NewVideoParams,
  UpdateVideoParams, 
  updateVideoSchema,
  insertVideoSchema, 
  videos,
  videoIdSchema 
} from "@/lib/db/schema/videos";
import { getUserAuth } from "@/lib/auth/utils";

export const createVideo = async (video: NewVideoParams) => {
  const { session } = await getUserAuth();
  const newVideo = insertVideoSchema.parse({ ...video, userId: session?.user.id! });
  try {
    const [v] =  await db.insert(videos).values(newVideo).returning();
    return { video: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const updateVideo = async (id: VideoId, video: UpdateVideoParams) => {
  const { session } = await getUserAuth();
  const { id: videoId } = videoIdSchema.parse({ id });
  const newVideo = updateVideoSchema.parse({ ...video, userId: session?.user.id! });
  try {
    const [v] =  await db
     .update(videos)
     .set({...newVideo, updatedAt: new Date() })
     .where(and(eq(videos.id, videoId!), eq(videos.userId, session?.user.id!)))
     .returning();
    return { video: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteVideo = async (id: VideoId) => {
  const { session } = await getUserAuth();
  const { id: videoId } = videoIdSchema.parse({ id });
  try {
    const [v] =  await db.delete(videos).where(and(eq(videos.id, videoId!), eq(videos.userId, session?.user.id!)))
    .returning();
    return { video: v };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

