"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/videos/useOptimisticVideos";
import { type Video } from "@/lib/db/schema/videos";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import VideoForm from "@/components/videos/VideoForm";


export default function OptimisticVideo({ 
  video,
   
}: { 
  video: Video; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Video) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticVideo, setOptimisticVideo] = useOptimistic(video);
  const updateVideo: TAddOptimistic = (input) =>
    setOptimisticVideo({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <VideoForm
          video={optimisticVideo}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateVideo}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticVideo.name}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticVideo.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticVideo, null, 2)}
      </pre>
    </div>
  );
}
