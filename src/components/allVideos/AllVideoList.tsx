"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type AllVideo, CompleteAllVideo } from "@/lib/db/schema/allVideos";
import Modal from "@/components/shared/Modal";
import { type Video, type VideoId } from "@/lib/db/schema/videos";
import { useOptimisticAllVideos } from "@/app/(app)/all-videos/useOptimisticAllVideos";
import { Button } from "@/components/ui/button";
import AllVideoForm from "./AllVideoForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (allVideo?: AllVideo) => void;

export default function AllVideoList({
  allVideos,
  videos,
  videoId 
}: {
  allVideos: CompleteAllVideo[];
  videos: Video[];
  videoId?: VideoId 
}) {
  const { optimisticAllVideos, addOptimisticAllVideo } = useOptimisticAllVideos(
    allVideos,
    videos 
  );
  const [open, setOpen] = useState(false);
  const [activeAllVideo, setActiveAllVideo] = useState<AllVideo | null>(null);
  const openModal = (allVideo?: AllVideo) => {
    setOpen(true);
    allVideo ? setActiveAllVideo(allVideo) : setActiveAllVideo(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeAllVideo ? "Edit AllVideo" : "Create All Video"}
      >
        <AllVideoForm
          allVideo={activeAllVideo}
          addOptimistic={addOptimisticAllVideo}
          openModal={openModal}
          closeModal={closeModal}
          videos={videos}
        videoId={videoId}
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticAllVideos.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticAllVideos.map((allVideo) => (
            <AllVideo
              allVideo={allVideo}
              key={allVideo.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const AllVideo = ({
  allVideo,
  openModal,
}: {
  allVideo: CompleteAllVideo;
  openModal: TOpenModal;
}) => {
  const optimistic = allVideo.id === "optimistic";
  const deleting = allVideo.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("all-videos")
    ? pathname
    : pathname + "/all-videos/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{allVideo.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + allVideo.id }>
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
        No all videos
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new all video.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New All Videos </Button>
      </div>
    </div>
  );
};
