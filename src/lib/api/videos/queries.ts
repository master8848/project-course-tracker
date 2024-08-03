import { db } from "@/lib/db/index";
import { eq, and } from "drizzle-orm";
import { getUserAuth } from "@/lib/auth/utils";
import { type VideoId, videoIdSchema, videos } from "@/lib/db/schema/videos";
import { allVideos, type CompleteAllVideo } from "@/lib/db/schema/allVideos";

export const getVideos = async () => {
  const { session } = await getUserAuth();
  const rows = await db.select().from(videos).where(eq(videos.userId, session?.user.id!));
  const v = rows
  return { videos: v };
};

export const getVideoById = async (id: VideoId) => {
  const { session } = await getUserAuth();
  const { id: videoId } = videoIdSchema.parse({ id });
  const [row] = await db.select().from(videos).where(and(eq(videos.id, videoId), eq(videos.userId, session?.user.id!)));
  if (row === undefined) return {};
  const v = row;
  return { video: v };
};

export const getVideoByIdWithAllVideos = async (id: VideoId) => {
  const { session } = await getUserAuth();
  const { id: videoId } = videoIdSchema.parse({ id });
  const rows = await db.select({ video: videos, allVideo: allVideos }).from(videos).where(and(eq(videos.id, videoId), eq(videos.userId, session?.user.id!))).leftJoin(allVideos, eq(videos.id, allVideos.videoId));
  if (rows.length === 0) return {};
  const v = rows[0].video;
  const va = rows.filter((r) => r.allVideo !== null).map((a) => a.allVideo) as CompleteAllVideo[];

  return { video: v, allVideos: va };
};

