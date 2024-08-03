import { Suspense } from "react";

import Loading from "@/app/loading";
import AllVideoList from "@/components/allVideos/AllVideoList";
import { getAllVideos } from "@/lib/api/allVideos/queries";
import { getVideos } from "@/lib/api/videos/queries";

export const revalidate = 0;

export default async function AllVideosPage() {
  return (
    <main>
      <div className="relative">
        <div className="flex justify-between">
          <h1 className="font-semibold text-2xl my-2">All Videos</h1>
        </div>
        <AllVideos />
      </div>
    </main>
  );
}

const AllVideos = async () => {
  
  const { allVideos } = await getAllVideos();
  const { videos } = await getVideos();
  return (
    <Suspense fallback={<Loading />}>
      <AllVideoList allVideos={allVideos} videos={videos} />
    </Suspense>
  );
};
