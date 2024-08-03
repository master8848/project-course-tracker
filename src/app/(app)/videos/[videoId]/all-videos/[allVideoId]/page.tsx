import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getAllVideoById } from "@/lib/api/allVideos/queries";
import { getVideos } from "@/lib/api/videos/queries";import OptimisticAllVideo from "@/app/(app)/all-videos/[allVideoId]/OptimisticAllVideo";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function AllVideoPage({
  params,
}: {
  params: { allVideoId: string };
}) {

  return (
    <main className="overflow-auto">
      <AllVideo id={params.allVideoId} />
    </main>
  );
}

const AllVideo = async ({ id }: { id: string }) => {
  
  const { allVideo } = await getAllVideoById(id);
  const { videos } = await getVideos();

  if (!allVideo) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="all-videos" />
        <OptimisticAllVideo allVideo={allVideo} videos={videos}
        videoId={allVideo.videoId} />
      </div>
    </Suspense>
  );
};
