"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/all-videos/useOptimisticAllVideos";
import { type AllVideo } from "@/lib/db/schema/allVideos";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import AllVideoForm from "@/components/allVideos/AllVideoForm";
import { type Video, type VideoId } from "@/lib/db/schema/videos";

export default function OptimisticAllVideo({ 
  allVideo,
  videos,
  videoId 
}: { 
  allVideo: AllVideo; 
  
  videos: Video[];
  videoId?: VideoId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: AllVideo) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticAllVideo, setOptimisticAllVideo] = useOptimistic(allVideo);
  const updateAllVideo: TAddOptimistic = (input) =>
    setOptimisticAllVideo({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <AllVideoForm
          allVideo={optimisticAllVideo}
          videos={videos}
        videoId={videoId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateAllVideo}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticAllVideo.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticAllVideo.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticAllVideo, null, 2)}
      </pre>
    </div>
  );
}
