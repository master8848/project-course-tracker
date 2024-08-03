import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getVideoByIdWithAllVideos } from "@/lib/api/videos/queries";
import OptimisticVideo from "./OptimisticVideo";
import { checkAuth } from "@/lib/auth/utils";
import AllVideoList from "@/components/allVideos/AllVideoList";

import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function VideoPage({
  params,
}: {
  params: { videoId: string };
}) {

  return (
    <main className="overflow-auto">
      <Video id={params.videoId} />
    </main>
  );
}

const Video = async ({ id }: { id: string }) => {
  await checkAuth();

  const { video, allVideos } = await getVideoByIdWithAllVideos(id);
  

  if (!video) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="videos" />
        <OptimisticVideo video={video}  />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{video.name}&apos;s All Videos</h3>
        <AllVideoList
          videos={[]}
          videoId={video.id}
          allVideos={allVideos}
        />
      </div>
    </Suspense>
  );
};
