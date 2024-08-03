import { db } from "@/lib/db/index";
import { eq } from "drizzle-orm";
import { type AllVideoId, allVideoIdSchema, allVideos } from "@/lib/db/schema/allVideos";
import { videos } from "@/lib/db/schema/videos";

export const getAllVideos = async () => {
  const rows = await db.select({ allVideo: allVideos, video: videos }).from(allVideos).leftJoin(videos, eq(allVideos.videoId, videos.id));
  const a = rows .map((r) => ({ ...r.allVideo, video: r.video})); 
  return { allVideos: a };
};

export const getAllVideoById = async (id: AllVideoId) => {
  const { id: allVideoId } = allVideoIdSchema.parse({ id });
  const [row] = await db.select({ allVideo: allVideos, video: videos }).from(allVideos).where(eq(allVideos.id, allVideoId)).leftJoin(videos, eq(allVideos.videoId, videos.id));
  if (row === undefined) return {};
  const a =  { ...row.allVideo, video: row.video } ;
  return { allVideo: a };
};


