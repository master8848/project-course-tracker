import { type Video } from "@/lib/db/schema/videos";
import { type AllVideo, type CompleteAllVideo } from "@/lib/db/schema/allVideos";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<AllVideo>) => void;

export const useOptimisticAllVideos = (
  allVideos: CompleteAllVideo[],
  videos: Video[]
) => {
  const [optimisticAllVideos, addOptimisticAllVideo] = useOptimistic(
    allVideos,
    (
      currentState: CompleteAllVideo[],
      action: OptimisticAction<AllVideo>,
    ): CompleteAllVideo[] => {
      const { data } = action;

      const optimisticVideo = videos.find(
        (video) => video.id === data.videoId,
      )!;

      const optimisticAllVideo = {
        ...data,
        video: optimisticVideo,
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticAllVideo]
            : [...currentState, optimisticAllVideo];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticAllVideo } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticAllVideo, optimisticAllVideos };
};
