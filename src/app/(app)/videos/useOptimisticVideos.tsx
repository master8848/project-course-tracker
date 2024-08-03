
import { type Video, type CompleteVideo } from "@/lib/db/schema/videos";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<Video>) => void;

export const useOptimisticVideos = (
  videos: CompleteVideo[],
  
) => {
  const [optimisticVideos, addOptimisticVideo] = useOptimistic(
    videos,
    (
      currentState: CompleteVideo[],
      action: OptimisticAction<Video>,
    ): CompleteVideo[] => {
      const { data } = action;

      

      const optimisticVideo = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticVideo]
            : [...currentState, optimisticVideo];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticVideo } : item,
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

  return { addOptimisticVideo, optimisticVideos };
};
