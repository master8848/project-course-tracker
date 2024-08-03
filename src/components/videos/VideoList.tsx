"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type Video, CompleteVideo } from "@/lib/db/schema/videos";
import Modal from "@/components/shared/Modal";

import { useOptimisticVideos } from "@/app/(app)/videos/useOptimisticVideos";
import { Button } from "@/components/ui/button";
import VideoForm from "./VideoForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (video?: Video) => void;

export default function VideoList({
  videos,
   
}: {
  videos: CompleteVideo[];
   
}) {
  const { optimisticVideos, addOptimisticVideo } = useOptimisticVideos(
    videos,
     
  );
  const [open, setOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const openModal = (video?: Video) => {
    setOpen(true);
    video ? setActiveVideo(video) : setActiveVideo(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeVideo ? "Edit Video" : "Create Video"}
      >
        <VideoForm
          video={activeVideo}
          addOptimistic={addOptimisticVideo}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticVideos.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticVideos.map((video) => (
            <Video
              video={video}
              key={video.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Video = ({
  video,
  openModal,
}: {
  video: CompleteVideo;
  openModal: TOpenModal;
}) => {
  const optimistic = video.id === "optimistic";
  const deleting = video.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("videos")
    ? pathname
    : pathname + "/videos/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{video.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + video.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No videos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new video.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Videos </Button>
      </div>
    </div>
  );
};
